
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

const RepaymentTable = ({ repayments, formatCurrency }) => {
  const formatDate = (date) => {
     if (!date) return '-';
     try {
       return format(new Date(date), 'dd MMM yyyy, hh:mm a');
     } catch {
        return '-';
     }
  };

  if (!repayments || repayments.length === 0) {
    return null; // Don't render anything if no repayments
  }

  return (
    <div className="mt-3 mb-2">
      <h4 className="text-sm font-medium mb-1 text-muted-foreground">Repayments:</h4>
      <Table>
        <TableHeader>
          <TableRow className="text-xs">
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {repayments.map(repay => (
            <TableRow key={repay.id} className="text-xs">
              <TableCell>{formatDate(repay.date)}</TableCell>
              <TableCell className="text-right">{formatCurrency(repay.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RepaymentTable;
  