
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useData } from '@/contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

const RepaymentFormDialog = ({ isOpen, setIsOpen, loan }) => {
  const { addRepayment } = useData();
  const { toast } = useToast();
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm();

  // Reset form when dialog opens or loan changes
  useEffect(() => {
    if (isOpen) {
      reset({
        amount: '',
        date: new Date(), // Default to today
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data) => {
     if (!loan?.id) {
        toast({ variant: "destructive", title: "Error", description: "Invalid loan selected." });
        return;
     }
     try {
        const repaymentData = {
           ...data,
           date: format(data.date, 'yyyy-MM-dd'), // Format date correctly
           amount: parseFloat(data.amount) // Ensure amount is number
        };
        addRepayment(loan.id, repaymentData);
        // Toast handled inside addRepayment
        setIsOpen(false); // Close dialog
     } catch (error) {
        console.error("Error adding repayment:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not record repayment." });
     }
  };

  const remainingBalance = loan ? (loan.amount - (loan.repayments?.reduce((sum, r) => sum + r.amount, 0) || 0)) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Repayment</DialogTitle>
          <DialogDescription>
             Enter the amount received for the loan: "{loan?.itemDescription || 'Loan'}". <br/>
             Remaining Balance: <span className="font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(remainingBalance)}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">

          {/* Amount */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (₹)*
            </Label>
            <div className="col-span-3">
              <div className="relative">
                 <IndianRupee className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register("amount", {
                       required: "Repayment amount is required",
                       valueAsNumber: true,
                       min: { value: 0.01, message: "Amount must be positive" },
                       // Optional: Max validation against remaining balance?
                       // max: { value: remainingBalance > 0 ? remainingBalance : Infinity, message: `Amount cannot exceed remaining balance (${remainingBalance.toFixed(2)})`}
                    })}
                    placeholder="e.g., 100.00"
                    className={`pl-8 ${errors.amount ? 'border-destructive' : ''}`} // Add padding for icon
                    disabled={isSubmitting}
                  />
              </div>
              {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount.message}</p>}
            </div>
          </div>

          {/* Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date*
            </Label>
             <Controller
                name="date"
                control={control}
                rules={{ required: "Repayment date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                          errors.date ? 'border-destructive' : ''
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
            {errors.date && <p className="col-start-2 col-span-3 text-xs text-destructive mt-1">{errors.date.message}</p>}
          </div>

          <DialogFooter>
             <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
             </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Recording...' : 'Record Repayment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RepaymentFormDialog;
  