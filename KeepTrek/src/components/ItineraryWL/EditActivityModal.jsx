import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditActivityModal = ({ isOpen, onClose, currentActivity, onSaveEdit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Activity Name</label>
            <Input
              type="text"
              value={currentActivity?.title || ""}
              onChange={(e) =>
                onSaveEdit({ ...currentActivity, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Address</label>
            <Input
              type="text"
              value={currentActivity?.location || ""}
              onChange={(e) =>
                onSaveEdit({ ...currentActivity, location: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Notes</label>
            <textarea
              className="w-full min-h-[80px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
              value={currentActivity?.notes || ""}
              onChange={(e) =>
                onSaveEdit({ ...currentActivity, notes: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => {
              onSaveEdit(currentActivity);
              onClose();
            }}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditActivityModal;

