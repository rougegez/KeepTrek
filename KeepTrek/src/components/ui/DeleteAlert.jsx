import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const DeleteAlert = ({ isOpen, onClose, onConfirm, itemName = 'item', isLoading = false }) => {
    return (
        <AlertDialog 
            open={isOpen} 
            onOpenChange={(open) => {
                if (!isLoading && !open) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this {itemName.toLowerCase()}? 
                        This action cannot be undone and all associated data will be permanently lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        className="bg-red-600 text-white hover:bg-red-700" 
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner className="mr-2 h-4 w-4" />
                                Deleting...
                            </>
                        ) : (
                            'Delete'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteAlert;
