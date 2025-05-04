
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useData } from '@/contexts/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"; // Use DialogClose
import { useToast } from "@/components/ui/use-toast";

const CustomerFormDialog = ({ isOpen, setIsOpen, customerToEdit = null }) => {
  const { addCustomer, updateCustomer } = useData();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const isEditMode = !!customerToEdit;

  useEffect(() => {
    if (isEditMode && customerToEdit) {
      reset({
        name: customerToEdit.name,
        phone: customerToEdit.phone || '',
        address: customerToEdit.address || '',
        // Add other fields if they exist like trust score, credit limit
      });
    } else {
      reset({ name: '', phone: '', address: '' }); // Reset for adding new
    }
  }, [customerToEdit, isEditMode, reset, isOpen]); // Reset when dialog opens/closes or customer changes

   const onSubmit = (data) => {
      try {
         if (isEditMode) {
           updateCustomer(customerToEdit.id, data);
           toast({ title: "Success", description: `Customer "${data.name}" updated.` });
         } else {
           addCustomer(data);
           // Toast is handled inside addCustomer
         }
         setIsOpen(false); // Close dialog on success
      } catch (error) {
         console.error("Error saving customer:", error);
         toast({ variant: "destructive", title: "Error", description: "Could not save customer." });
      }
   };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? `Update the details for ${customerToEdit.name}.` : 'Enter the details for the new customer.'} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name*
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                {...register("name", { required: "Customer name is required" })}
                className={errors.name ? 'border-destructive' : ''}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
             <div className="col-span-3">
                <Input
                  id="phone"
                  type="tel"
                   {...register("phone", {
                       pattern: {
                         value: /^[6-9]\d{9}$/, // Basic Indian mobile number pattern
                         message: "Enter a valid 10-digit mobile number starting with 6-9"
                      }
                   })}
                  placeholder="e.g., 9876543210"
                  className={errors.phone ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
             </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
             <div className="col-span-3">
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Optional address details"
                  disabled={isSubmitting}
                />
             </div>
          </div>
           {/* Add other fields like Trust Score, Credit Limit later if needed */}
          <DialogFooter>
             <DialogClose asChild>
                 <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
               {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Customer')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerFormDialog;
  