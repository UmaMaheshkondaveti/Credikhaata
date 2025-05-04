
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useData } from '@/contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover
import { Calendar } from "@/components/ui/calendar"; // Import Calendar
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const LoanFormDialog = ({ isOpen, setIsOpen, customerId = null, loanToEdit = null }) => {
  const { customers, addLoan, updateLoan } = useData(); // Assuming updateLoan exists in context
  const { toast } = useToast();
  const { register, handleSubmit, reset, control, setValue, formState: { errors, isSubmitting } } = useForm();

  const isEditMode = !!loanToEdit; // Placeholder for future edit functionality

  // Reset form when dialog opens or customer/loan changes
  useEffect(() => {
    if (isOpen) {
       if (isEditMode && loanToEdit) {
          // Populate form for editing (implement later)
          reset({
             customerId: loanToEdit.customerId,
             itemDescription: loanToEdit.itemDescription,
             amount: loanToEdit.amount,
             issueDate: new Date(loanToEdit.issueDate), // Convert string to Date
             frequency: loanToEdit.frequency,
             // ... other fields
          });
       } else {
          // Reset for adding new, pre-fill customer if provided
           reset({
             customerId: customerId || '', // Pre-fill if adding from customer page
             itemDescription: '',
             amount: '',
             issueDate: new Date(), // Default to today
             frequency: 'monthly', // Default frequency
           });
       }
    }
  }, [isOpen, customerId, loanToEdit, isEditMode, reset]);


  const onSubmit = (data) => {
     try {
        const loanData = {
           ...data,
           issueDate: format(data.issueDate, 'yyyy-MM-dd'), // Format date correctly for storage
           amount: parseFloat(data.amount) // Ensure amount is a number
        };

       if (isEditMode) {
         // updateLoan(loanToEdit.id, loanData); // Implement updateLoan later
         toast({ title: "Success", description: "Loan details updated." }); // Placeholder
       } else {
          if (!loanData.customerId) {
             toast({ variant: "destructive", title: "Error", description: "Please select a customer." });
             return;
          }
         addLoan(loanData);
          // Toast handled in addLoan
       }
       setIsOpen(false); // Close dialog on success
     } catch (error) {
       console.error("Error saving loan:", error);
       toast({ variant: "destructive", title: "Error", description: "Could not save loan." });
     }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]"> {/* Slightly wider dialog */}
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Loan' : 'Add New Loan'}</DialogTitle>
          <DialogDescription>
             {isEditMode ? 'Update the loan details.' : 'Record a new credit sale for a customer.'} Click save when done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
           {/* Customer Select */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerId" className="text-right">
              Customer*
            </Label>
             <Controller
                 name="customerId"
                 control={control}
                 rules={{ required: "Please select a customer" }}
                 render={({ field }) => (
                   <Select
                     onValueChange={field.onChange}
                     value={field.value}
                     disabled={isSubmitting || isEditMode || !!customerId} // Disable if editing or customerId prop provided
                   >
                     <SelectTrigger className={`col-span-3 ${errors.customerId ? 'border-destructive' : ''}`}>
                       <SelectValue placeholder="Select a customer" />
                     </SelectTrigger>
                     <SelectContent>
                       {customers.length > 0 ? (
                          customers.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name}{c.phone ? ` (${c.phone})` : ''}</SelectItem>
                       ))
                       ) : (
                         <div className="px-4 py-2 text-sm text-muted-foreground">No customers added yet.</div>
                       ) }
                     </SelectContent>
                   </Select>
                 )}
             />
             {errors.customerId && <p className="col-start-2 col-span-3 text-xs text-destructive mt-1">{errors.customerId.message}</p>}
          </div>

          {/* Item Description */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="itemDescription" className="text-right">
               Item/Service*
             </Label>
             <div className="col-span-3">
               <Input
                 id="itemDescription"
                 {...register("itemDescription", { required: "Description is required" })}
                 placeholder="e.g., Groceries, Stitching charges"
                 className={errors.itemDescription ? 'border-destructive' : ''}
                 disabled={isSubmitting}
               />
               {errors.itemDescription && <p className="text-xs text-destructive mt-1">{errors.itemDescription.message}</p>}
             </div>
           </div>

           {/* Amount */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount (₹)*
              </Label>
              <div className="col-span-3">
                <Input
                  id="amount"
                   type="number"
                   step="0.01"
                   {...register("amount", {
                       required: "Loan amount is required",
                       valueAsNumber: true,
                       min: { value: 0.01, message: "Amount must be positive" }
                   })}
                  placeholder="e.g., 500.00"
                  className={errors.amount ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                 {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
              </div>
            </div>

            {/* Issue Date */}
             <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="issueDate" className="text-right">
                 Issue Date*
               </Label>
                <Controller
                   name="issueDate"
                   control={control}
                   rules={{ required: "Issue date is required" }}
                   render={({ field }) => (
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant={"outline"}
                           className={cn(
                             "col-span-3 justify-start text-left font-normal",
                             !field.value && "text-muted-foreground",
                              errors.issueDate ? 'border-destructive' : ''
                           )}
                           disabled={isSubmitting}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0">
                         <Calendar
                           mode="single"
                           selected={field.value}
                           onSelect={field.onChange}
                           initialFocus
                         />
                       </PopoverContent>
                     </Popover>
                   )}
                 />
               {errors.issueDate && <p className="col-start-2 col-span-3 text-xs text-destructive mt-1">{errors.issueDate.message}</p>}
             </div>


           {/* Repayment Frequency */}
           <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="frequency" className="text-right">
               Repayment*
             </Label>
             <Controller
                name="frequency"
                control={control}
                defaultValue="monthly" // Set default value here
                rules={{ required: "Repayment frequency is required" }}
                render={({ field }) => (
                   <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <SelectTrigger className={`col-span-3 ${errors.frequency ? 'border-destructive' : ''}`}>
                         <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="bi-weekly">Bi-Weekly (Every 2 weeks)</SelectItem>
                         <SelectItem value="monthly">Monthly</SelectItem>
                         {/* Add other options if needed */}
                      </SelectContent>
                   </Select>
                )}
              />
             {errors.frequency && <p className="col-start-2 col-span-3 text-xs text-destructive mt-1">{errors.frequency.message}</p>}
           </div>

          {/* Optional fields like interest, grace days can be added similarly */}

          <DialogFooter>
             <DialogClose asChild>
                 <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
             </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Loan')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoanFormDialog;
  