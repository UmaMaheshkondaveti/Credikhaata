
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, IndianRupee } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import RepaymentTable from '@/components/RepaymentTable'; // Import RepaymentTable
import { format } from 'date-fns';

const LoanCard = ({
  loan,
  onRecordRepayment,
  onDeleteLoan,
  formatCurrency,
  getStatusBadge,
}) => {

   const formatDateOnly = (date) => {
     if (!date) return '-';
     try {
       return format(new Date(date), 'dd MMM yyyy');
     } catch {
        return '-';
     }
  };

  return (
    <Card key={loan.id} className="bg-background dark:bg-background/80 overflow-hidden">
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div>
          <CardTitle className="text-lg">{loan.itemDescription || 'Loan'}</CardTitle>
          <CardDescription>
            Issued: {formatDateOnly(loan.issueDate)} | Frequency: <span className="capitalize">{loan.frequency || 'monthly'}</span>
          </CardDescription>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">{formatCurrency(loan.amount)}</p>
          {getStatusBadge(loan.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="flex flex-col sm:flex-row justify-between text-sm mb-3 gap-2 sm:gap-4">
          <p>Next Due: <span className="font-medium">{formatDateOnly(loan.nextDueDate)}</span></p>
          <p>Remaining: <span className={`font-medium ${loan.remainingBalance > 0 ? 'text-warning' : 'text-success'}`}>{formatCurrency(loan.remainingBalance)}</span></p>
        </div>
        <RepaymentTable repayments={loan.repayments} formatCurrency={formatCurrency} />
      </CardContent>
      <CardFooter className="bg-muted/50 dark:bg-muted/20 py-3 px-6 flex justify-end gap-2">
        {loan.remainingBalance > 0 && (
          <Button size="sm" variant="outline" onClick={() => onRecordRepayment(loan)}>
            <IndianRupee className="mr-2 h-4 w-4" /> Record Repayment
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this Loan?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the loan for "{loan.itemDescription || 'Item'}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDeleteLoan(loan.id, loan.itemDescription || 'Item')} className="bg-destructive hover:bg-destructive/90">
                Yes, delete loan
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default LoanCard;
  