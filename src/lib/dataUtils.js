
import { addWeeks, addMonths, isBefore, parseISO } from 'date-fns';

export const calculateNextDueDate = (issueDateStr, frequency, repayments = []) => {
  const issueDate = parseISO(issueDateStr);
  let nextDueDate = issueDate;

  const lastRepaymentDate = repayments.length > 0
    ? parseISO(repayments[repayments.length - 1].date)
    : null;

  let startDate = lastRepaymentDate || issueDate;

  while (isBefore(nextDueDate, startDate) || nextDueDate.toDateString() === startDate.toDateString()) {
    if (frequency === 'bi-weekly') {
      nextDueDate = addWeeks(nextDueDate, 2);
    } else if (frequency === 'monthly') {
      nextDueDate = addMonths(nextDueDate, 1);
    } else {
      nextDueDate = addMonths(nextDueDate, 1);
    }
  }
  return nextDueDate;
};

export const calculateTotalRepaid = (repayments = []) => {
  return repayments.reduce((sum, repayment) => sum + parseFloat(repayment.amount || 0), 0);
};

export const calculateRemainingBalance = (loanAmount, repayments = []) => {
  const totalRepaid = calculateTotalRepaid(repayments);
  return parseFloat(loanAmount || 0) - totalRepaid;
};

export const determineLoanStatus = (loanAmount, nextDueDate, repayments = []) => {
    const remaining = calculateRemainingBalance(loanAmount, repayments);
    if (remaining <= 0) {
        return 'Paid';
    }
    // Check if nextDueDate is before today (ignoring time)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for accurate date comparison
    const dueDate = new Date(nextDueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (isBefore(dueDate, today)) {
        return 'Overdue';
    }
    return 'Pending';
};


export const calculateCustomerOutstanding = (loans = []) => {
  return loans.reduce((total, loan) => {
    const remaining = calculateRemainingBalance(loan.amount, loan.repayments);
    return total + (remaining > 0 ? remaining : 0);
  }, 0);
};

export const findCustomerNextDueDate = (loans = []) => {
   let earliestDueDate = null;
   loans.forEach(loan => {
       const remaining = calculateRemainingBalance(loan.amount, loan.repayments);
       if (remaining > 0) {
           const nextDueDate = calculateNextDueDate(loan.issueDate, loan.frequency, loan.repayments);
           if (!earliestDueDate || isBefore(nextDueDate, earliestDueDate)) {
               earliestDueDate = nextDueDate;
           }
       }
   });
   return earliestDueDate;
};

export const determineCustomerStatus = (loans = []) => {
  const hasOverdue = loans.some(loan => {
     const remaining = calculateRemainingBalance(loan.amount, loan.repayments);
     if (remaining <= 0) return false; // Skip paid loans
     const nextDueDate = calculateNextDueDate(loan.issueDate, loan.frequency, loan.repayments);

     // Check if nextDueDate is before today (ignoring time)
     const today = new Date();
     today.setHours(0, 0, 0, 0);
     const dueDate = new Date(nextDueDate);
     dueDate.setHours(0, 0, 0, 0);

     return isBefore(dueDate, today);
  });
  return hasOverdue ? 'Overdue' : 'Up-to-date';
};

// Helper to get data from local storage safely
export const loadDataFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Failed to load data from localStorage key "${key}":`, error);
    return []; // Return empty array on error
  }
};

// Helper to save data to local storage safely
export const saveDataToStorage = (key, data) => {
   try {
     localStorage.setItem(key, JSON.stringify(data));
     return true;
   } catch (error) {
     console.error(`Failed to save data to localStorage key "${key}":`, error);
     return false;
   }
};
  