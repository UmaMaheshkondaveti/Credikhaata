
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const formatCurrency = (amount) => {
   return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
};

const formatDateOnly = (date) => {
   if (!date) return '-';
   try {
     return format(new Date(date), 'dd MMM yyyy');
   } catch {
     return '-';
   }
};

export const generatePDFStatement = (customerDetails) => {
  if (!customerDetails) {
    console.error("No customer details provided for PDF generation.");
    return;
  }

  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  let startY = 20; // Initial y position

  // --- Header ---
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('CrediKhaata Statement', 105, startY, { align: 'center' });
  startY += 10;

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`Customer: ${customerDetails.name}`, 14, startY);
  doc.text(`Export Date: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 200, startY, { align: 'right'});
  startY += 6;
  if (customerDetails.phone) {
     doc.text(`Phone: ${customerDetails.phone}`, 14, startY);
     startY += 6;
  }
  if (customerDetails.address) {
     doc.text(`Address: ${customerDetails.address}`, 14, startY);
     startY += 6;
  }

  // --- Summary ---
  startY += 4; // Add a bit more space
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Summary', 14, startY);
  startY += 8;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Total Outstanding Balance: ${formatCurrency(customerDetails.outstandingBalance)}`, 14, startY);
  startY += 6;
  doc.text(`Overall Status: ${customerDetails.status}`, 14, startY);
   if (customerDetails.nextDueDate) {
     doc.text(`Next Due Date (Overall): ${formatDateOnly(customerDetails.nextDueDate)}`, 105, startY, { align: 'left'}); // Align with balance
   }
   startY += 10;


  // --- Loan Details Table ---
  if (customerDetails.loans && customerDetails.loans.length > 0) {
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Loan Details', 14, startY);
    startY += 8;


    customerDetails.loans.forEach((loan, index) => {
        if (startY > pageHeight - 40) { // Check if space needed for footer + next item header
            doc.addPage();
            startY = 20;
             doc.setFontSize(14);
             doc.setFont(undefined, 'bold');
             doc.text(`Loan Details (Continued)`, 14, startY);
             startY += 8;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Loan #${index + 1}: ${loan.itemDescription || 'Loan'}`, 14, startY);
        startY += 6;

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Issued: ${formatDateOnly(loan.issueDate)}`, 14, startY);
        doc.text(`Amount: ${formatCurrency(loan.amount)}`, 70, startY);
        doc.text(`Status: ${loan.status}`, 130, startY);
        startY += 5;
        doc.text(`Frequency: ${loan.frequency || 'monthly'}`, 14, startY);
        doc.text(`Remaining: ${formatCurrency(loan.remainingBalance)}`, 70, startY);
         if (loan.status !== 'Paid') {
           doc.text(`Next Due: ${formatDateOnly(loan.nextDueDate)}`, 130, startY);
         }
        startY += 8;

        // Repayments Table for this loan
        if (loan.repayments && loan.repayments.length > 0) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.text(`Repayments:`, 18, startY); // Indent slightly
            startY += 5;

            const repaymentBody = loan.repayments.map(r => [
                format(new Date(r.date), 'dd MMM yyyy, hh:mm a'),
                formatCurrency(r.amount)
            ]);

            doc.autoTable({
                startY: startY,
                head: [['Date', 'Amount']],
                body: repaymentBody,
                theme: 'grid',
                headStyles: { fillColor: [220, 220, 220], textColor: 40, fontSize: 9 },
                bodyStyles: { fontSize: 9 },
                columnStyles: { 1: { halign: 'right' } },
                margin: { left: 18, right: 18 }, // Indent table
                didDrawPage: (data) => {
                    // Reset startY for new page if autoTable adds one
                    if (data.cursor.y > startY) { // Check if table content caused page break
                        startY = data.cursor.y;
                    }
                }
            });
            // Get Y position after table
            startY = doc.autoTable.previous.finalY + 10; // Add padding after table
        } else {
            doc.setFontSize(9);
            doc.setFont(undefined, 'italic');
            doc.text('No repayments recorded for this loan.', 18, startY);
            startY += 8;
        }
         // Add a separator line
         if (index < customerDetails.loans.length - 1) {
             doc.setDrawColor(200); // Light gray line
             doc.line(14, startY - 2, 196, startY - 2);
             startY += 4;
         }
    });


  } else {
    doc.setFontSize(11);
    doc.text('No loans recorded for this customer.', 14, startY);
  }

  // --- Footer (on each page) ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, pageHeight - 10, { align: 'center'});
     doc.text(`CrediKhaata Statement - ${customerDetails.name}`, 14, pageHeight - 10);
  }


  // --- Save the PDF ---
   const filename = `CrediKhaata_${customerDetails.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
   doc.save(filename);
};
  