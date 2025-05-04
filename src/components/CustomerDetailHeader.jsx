
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, Plus, FileDown } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const CustomerDetailHeader = ({
  customerDetails,
  onAddLoan,
  onEditCustomer,
  onDeleteCustomer,
  onGeneratePDF,
  formatCurrency,
  getStatusBadge,
}) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link to="/dashboard"><ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">{customerDetails.name}</h1>
        <p className="text-muted-foreground">{customerDetails.phone || 'No phone number'}</p>
        <p className="text-muted-foreground text-sm">{customerDetails.address || 'No address provided'}</p>
        <div className="mt-2 flex items-center gap-2">
          {getStatusBadge(customerDetails.status)}
          <span className={`font-semibold ${customerDetails.outstandingBalance > 0 ? 'text-destructive' : 'text-success'}`}>
            {formatCurrency(customerDetails.outstandingBalance)} Due
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-start sm:justify-end self-start sm:self-center">
        <Button variant="outline" size="sm" onClick={onGeneratePDF}>
          <FileDown className="mr-2 h-4 w-4" /> Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={onEditCustomer}>
          <Edit className="mr-2 h-4 w-4" /> Edit Customer
        </Button>
        <Button size="sm" onClick={onAddLoan}>
          <Plus className="mr-2 h-4 w-4" /> Add Loan
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Customer
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete customer "{customerDetails.name}" and all their associated loans and repayments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDeleteCustomer} className="bg-destructive hover:bg-destructive/90">
                Yes, delete customer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CustomerDetailHeader;
  