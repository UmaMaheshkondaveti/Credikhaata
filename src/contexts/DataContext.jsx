
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { parseISO } from 'date-fns';
import {
  calculateNextDueDate,
  calculateRemainingBalance,
  determineLoanStatus,
  calculateCustomerOutstanding,
  findCustomerNextDueDate,
  determineCustomerStatus,
  loadDataFromStorage,
  saveDataToStorage
} from '@/lib/dataUtils'; // Import utility functions

const DataContext = createContext(null);

const getStorageKey = (userId, type) => `credikhaata_data_${userId}_${type}`;

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDataInitialized, setIsDataInitialized] = useState(false);
  const { toast } = useToast();

  // Load data effect
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      setIsDataInitialized(false);
      const customerKey = getStorageKey(user.id, 'customers');
      const loanKey = getStorageKey(user.id, 'loans');

      const loadedCustomers = loadDataFromStorage(customerKey);
      const loadedLoans = loadDataFromStorage(loanKey);

      setCustomers(loadedCustomers);
      setLoans(loadedLoans);
      setIsDataInitialized(true); // Mark as initialized after loading
      setLoading(false);

      if (!loadedCustomers && localStorage.getItem(customerKey)) {
         toast({ variant: "destructive", title: "Load Error", description: "Could not load customer data." });
      }
      if (!loadedLoans && localStorage.getItem(loanKey)) {
         toast({ variant: "destructive", title: "Load Error", description: "Could not load loan data." });
      }

    } else {
      // Clear data on logout
      setCustomers([]);
      setLoans([]);
      setIsDataInitialized(false);
      setLoading(false);
    }
  }, [user?.id, toast]);

  // Save customers effect
  useEffect(() => {
    if (user?.id && isDataInitialized) {
      const customerKey = getStorageKey(user.id, 'customers');
      if (!saveDataToStorage(customerKey, customers)) {
         toast({ variant: "destructive", title: "Save Error", description: "Could not save customer data." });
      }
    }
  }, [customers, user?.id, isDataInitialized, toast]);

  // Save loans effect
  useEffect(() => {
    if (user?.id && isDataInitialized) {
      const loanKey = getStorageKey(user.id, 'loans');
       if (!saveDataToStorage(loanKey, loans)) {
          toast({ variant: "destructive", title: "Save Error", description: "Could not save loan data." });
       }
    }
  }, [loans, user?.id, isDataInitialized, toast]);


  // --- CRUD Operations ---

  const addCustomer = useCallback((customerData) => {
    if (!user?.id) return;
    const newCustomer = {
      ...customerData,
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({ title: "Success", description: `Customer "${newCustomer.name}" added.` });
  }, [user?.id, toast]);

  const updateCustomer = useCallback((customerId, updatedData) => {
    if (!user?.id) return;
    setCustomers(prev =>
      prev.map(c => (c.id === customerId && c.userId === user.id ? { ...c, ...updatedData } : c))
    );
     toast({ title: "Success", description: "Customer details updated." });
  }, [user?.id, toast]);

  const deleteCustomer = useCallback((customerId) => {
     if (!user?.id) return;
     const customerName = customers.find(c => c.id === customerId)?.name || 'Customer';
     setLoans(prev => prev.filter(l => l.customerId !== customerId || l.userId !== user.id));
     setCustomers(prev => prev.filter(c => c.id !== customerId || c.userId !== user.id));
     toast({ variant:"destructive", title: "Deleted", description: `Customer "${customerName}" and their loans removed.` });
  }, [user?.id, toast, customers]);

  const addLoan = useCallback((loanData) => {
     if (!user?.id) return;
     if (!loanData.customerId || !loanData.amount || !loanData.issueDate || !loanData.frequency) {
       toast({ variant: "destructive", title: "Error", description: "Missing required loan details." });
       return;
     }
     const newLoan = {
       ...loanData,
       id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
       userId: user.id,
       repayments: [],
       createdAt: new Date().toISOString(),
       amount: parseFloat(loanData.amount || 0)
     };
     setLoans(prev => [...prev, newLoan]);
     toast({ title: "Success", description: `Loan for "${loanData.itemDescription || 'Item'}" added.` });
   }, [user?.id, toast]);

   const addRepayment = useCallback((loanId, repaymentData) => {
    if (!user?.id) return;
     if (!repaymentData.amount || !repaymentData.date) {
        toast({ variant: "destructive", title: "Error", description: "Repayment amount and date are required." });
        return;
     }

    setLoans(prevLoans =>
      prevLoans.map(loan => {
        if (loan.id === loanId && loan.userId === user.id) {
           const repaymentAmount = parseFloat(repaymentData.amount);
           if (repaymentAmount <= 0) {
              toast({ variant: "destructive", title: "Error", description: "Repayment amount must be positive." });
              return loan;
           }

          const newRepayment = {
            ...repaymentData,
             amount: repaymentAmount,
            id: `repay_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            createdAt: new Date().toISOString(),
          };
          const updatedRepayments = [...(loan.repayments || []), newRepayment]
             .sort((a, b) => parseISO(a.date) - parseISO(b.date));

          toast({ title: "Success", description: `Repayment of ${repaymentAmount.toFixed(2)} recorded.` });
          return { ...loan, repayments: updatedRepayments };
        }
        return loan;
      })
    );
  }, [user?.id, toast]);

  const deleteLoan = useCallback((loanId) => {
      if (!user?.id) return;
      const loanDesc = loans.find(l => l.id === loanId)?.itemDescription || 'Loan';
      setLoans(prev => prev.filter(l => l.id !== loanId || l.userId !== user.id));
      toast({ variant:"destructive", title: "Deleted", description: `Loan "${loanDesc}" removed.` });
   }, [user?.id, toast, loans]);

   // --- Data Retrieval and Memoization ---

   const enrichedCustomers = useMemo(() => {
       if (!user?.id || !isDataInitialized) return [];
       return customers.map(customer => {
           const customerLoans = loans.filter(loan => loan.customerId === customer.id);
           const outstandingBalance = calculateCustomerOutstanding(customerLoans);
           const nextDueDate = findCustomerNextDueDate(customerLoans);
           const status = determineCustomerStatus(customerLoans);

           return {
               ...customer,
               outstandingBalance,
               nextDueDate,
               status,
               loanCount: customerLoans.length
           };
       });
   }, [customers, loans, user?.id, isDataInitialized]);

   const getCustomerDetails = useCallback((customerId) => {
       if (!user?.id || !isDataInitialized) return null;
       const customer = customers.find(c => c.id === customerId && c.userId === user.id);
       if (!customer) return null;

       const customerLoans = loans
           .filter(loan => loan.customerId === customerId && loan.userId === user.id)
           .map(loan => {
               const nextDueDate = calculateNextDueDate(loan.issueDate, loan.frequency, loan.repayments);
               const remainingBalance = calculateRemainingBalance(loan.amount, loan.repayments);
               const status = determineLoanStatus(loan.amount, nextDueDate, loan.repayments);
               return {
                   ...loan,
                   nextDueDate,
                   remainingBalance,
                   status,
               };
           })
           .sort((a, b) => parseISO(b.issueDate) - parseISO(a.issueDate));

       const outstandingBalance = calculateCustomerOutstanding(customerLoans);
       const overallNextDueDate = findCustomerNextDueDate(customerLoans);
       const overallStatus = determineCustomerStatus(customerLoans);

       return {
           ...customer,
           loans: customerLoans,
           outstandingBalance,
           nextDueDate: overallNextDueDate,
           status: overallStatus,
       };
   }, [customers, loans, user?.id, isDataInitialized]);

  const value = {
    customers: enrichedCustomers,
    loans,
    loading: loading || !isDataInitialized,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addLoan,
    addRepayment,
    deleteLoan,
    getCustomerDetails,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
  