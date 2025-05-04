
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table components
import { Badge } from '@/components/ui/badge'; // Import Badge
import { ArrowUpDown, UserPlus, Search, Eye } from 'lucide-react'; // Added Eye icon
import LoadingSpinner from '@/components/LoadingSpinner';
import CustomerFormDialog from '@/components/CustomerFormDialog'; // Dialog for adding customer
import LoanFormDialog from '@/components/LoanFormDialog'; // Dialog for adding loan
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { customers, loading } = useData();
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm)) // Allow searching by phone if it exists
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle different types for sorting
    if (sortConfig.key === 'outstandingBalance') {
       aValue = aValue || 0;
       bValue = bValue || 0;
    } else if (sortConfig.key === 'nextDueDate') {
       // Handle null dates - push them to the end when ascending
       if (!aValue) return sortConfig.direction === 'ascending' ? 1 : -1;
       if (!bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
    } else if (typeof aValue === 'string') {
       aValue = aValue.toLowerCase();
       bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

   const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ?
      <ArrowUpDown className="ml-2 h-4 w-4 transform rotate-180" /> :
      <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const formatCurrency = (amount) => {
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  };

  const formatDate = (date) => {
     if (!date) return '-';
     try {
       return format(new Date(date), 'dd MMM yyyy');
     } catch {
        return '-';
     }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'Up-to-date':
        return <Badge variant="success">Up-to-date</Badge>; // Assuming success variant exists
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Customer Dashboard</h1>
        <div className="flex gap-2 flex-wrap justify-center">
           <Button onClick={() => setIsLoanDialogOpen(true)} variant="outline">
             <UserPlus className="mr-2 h-4 w-4" /> Add Loan
           </Button>
           <Button onClick={() => setIsCustomerDialogOpen(true)}>
             <UserPlus className="mr-2 h-4 w-4" /> Add Customer
           </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Customers</CardTitle>
          <CardDescription>Manage your customers and their outstanding balances.</CardDescription>
          <div className="relative mt-4">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <LoadingSpinner className="my-16" />
          ) : sortedCustomers.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                 <p className="mb-4">No customers found{searchTerm ? ' matching your search' : ''}.</p>
                 <Button onClick={() => setIsCustomerDialogOpen(true)}>
                   <UserPlus className="mr-2 h-4 w-4" /> Add Your First Customer
                 </Button>
               </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-accent" onClick={() => handleSort('name')}>
                       <div className="flex items-center">Name {getSortIcon('name')}</div>
                    </TableHead>
                     <TableHead className="cursor-pointer hover:bg-accent hidden sm:table-cell" onClick={() => handleSort('phone')}>
                       <div className="flex items-center">Phone {getSortIcon('phone')}</div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-accent text-right" onClick={() => handleSort('outstandingBalance')}>
                      <div className="flex items-center justify-end">Balance {getSortIcon('outstandingBalance')}</div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-accent hidden md:table-cell" onClick={() => handleSort('nextDueDate')}>
                      <div className="flex items-center">Next Due {getSortIcon('nextDueDate')}</div>
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-accent" onClick={() => handleSort('status')}>
                      <div className="flex items-center">Status {getSortIcon('status')}</div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedCustomers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{customer.phone || '-'}</TableCell>
                      <TableCell className={`text-right font-semibold ${customer.outstandingBalance > 0 ? 'text-destructive' : 'text-success'}`}>
                         {formatCurrency(customer.outstandingBalance)}
                      </TableCell>
                       <TableCell className="hidden md:table-cell">{formatDate(customer.nextDueDate)}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link to={`/customer/${customer.id}`} title={`View ${customer.name}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                         {/* Add Edit/Delete later maybe */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
       <CustomerFormDialog isOpen={isCustomerDialogOpen} setIsOpen={setIsCustomerDialogOpen} />
       <LoanFormDialog isOpen={isLoanDialogOpen} setIsOpen={setIsLoanDialogOpen} />

    </motion.div>
  );
};

export default DashboardPage;
  