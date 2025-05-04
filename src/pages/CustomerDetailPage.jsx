
import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LoanFormDialog from '@/components/LoanFormDialog';
import RepaymentFormDialog from '@/components/RepaymentFormDialog';
import CustomerFormDialog from '@/components/CustomerFormDialog';
import { generatePDFStatement } from '@/lib/pdfGenerator';
import { motion } from 'framer-motion';
import CustomerDetailHeader from '@/components/CustomerDetailHeader'; // Refactored Header
import LoanCard from '@/components/LoanCard'; // Refactored Loan Card

const CustomerDetailPage = () => {
  const { customerId } = useParams();
  const { getCustomerDetails, deleteLoan, deleteCustomer, loading } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [isRepaymentDialogOpen, setIsRepaymentDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [selectedLoanForRepayment, setSelectedLoanForRepayment] = useState(null);

  // Memoize customer details to prevent recalculations on every render
  const customerDetails = useMemo(() => getCustomerDetails(customerId), [getCustomerDetails, customerId]);

  // --- Helper Functions ---
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  }, []);

  const getStatusBadge = useCallback((status) => {
    switch (status) {
      case 'Overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'Paid':
        return <Badge variant="success" className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700">Paid</Badge>;
      case 'Pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }, []);

  // --- Event Handlers ---
  const handleRecordRepayment = useCallback((loan) => {
    setSelectedLoanForRepayment(loan);
    setIsRepaymentDialogOpen(true);
  }, []);

  const handleDeleteLoan = useCallback((loanId, loanDesc) => {
    deleteLoan(loanId);
    // Toast is handled within deleteLoan context function now
  }, [deleteLoan]);

  const handleDeleteCustomer = useCallback(() => {
    if (!customerDetails) return;
    deleteCustomer(customerDetails.id);
    // Toast is handled within deleteCustomer context function now
    navigate('/dashboard');
  }, [customerDetails, deleteCustomer, navigate]);

  const handleGeneratePDF = useCallback(() => {
    if (customerDetails) {
      try {
        generatePDFStatement(customerDetails);
        toast({ title: "PDF Generated", description: `Statement for ${customerDetails.name} downloaded.` });
      } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({ variant: "destructive", title: "PDF Error", description: "Could not generate PDF statement." });
      }
    }
  }, [customerDetails, toast]);

  // --- Render Logic ---
  if (loading) {
    return <div className="flex justify-center items-center h-[calc(100vh-10rem)]"><LoadingSpinner size="lg" /></div>;
  }

  if (!customerDetails) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-destructive mb-4">Customer Not Found</h2>
        <Button onClick={() => navigate('/dashboard')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <CustomerDetailHeader
        customerDetails={customerDetails}
        onAddLoan={() => setIsLoanDialogOpen(true)}
        onEditCustomer={() => setIsEditCustomerDialogOpen(true)}
        onDeleteCustomer={handleDeleteCustomer}
        onGeneratePDF={handleGeneratePDF}
        formatCurrency={formatCurrency}
        getStatusBadge={getStatusBadge}
      />

      <Card>
        <CardHeader>
          <CardTitle>Credit History</CardTitle>
          <CardDescription>Details of loans and repayments for {customerDetails.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          {customerDetails.loans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No loans recorded for this customer yet.
            </div>
          ) : (
            <div className="space-y-6">
              {customerDetails.loans.map(loan => (
                <LoanCard
                  key={loan.id}
                  loan={loan}
                  onRecordRepayment={handleRecordRepayment}
                  onDeleteLoan={handleDeleteLoan}
                  formatCurrency={formatCurrency}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LoanFormDialog
        isOpen={isLoanDialogOpen}
        setIsOpen={setIsLoanDialogOpen}
        customerId={customerId}
      />
      {selectedLoanForRepayment && (
        <RepaymentFormDialog
          isOpen={isRepaymentDialogOpen}
          setIsOpen={setIsRepaymentDialogOpen}
          loan={selectedLoanForRepayment}
        />
      )}
      {customerDetails && (
        <CustomerFormDialog
          isOpen={isEditCustomerDialogOpen}
          setIsOpen={setIsEditCustomerDialogOpen}
          customerToEdit={customerDetails}
        />
      )}
    </motion.div>
  );
};

export default CustomerDetailPage;
  