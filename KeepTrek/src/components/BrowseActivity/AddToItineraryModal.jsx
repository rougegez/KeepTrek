import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AddToItineraryModal = ({ isOpen, onClose, onConfirm, days, activityTitle }) => {
  const [selectedDay, setSelectedDay] = useState('');

  const handleConfirm = () => {
    if (selectedDay) {
      onConfirm(selectedDay);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add "{activityTitle}" to Itinerary</DialogTitle>
          <DialogDescription>
            Select a day from your itinerary to add this activity.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger>
              <SelectValue placeholder="Select a day" />
            </SelectTrigger>
            <SelectContent>
              {days.map((day, index) => (
                <SelectItem key={index} value={day.date}>
                  {day.date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedDay}>
            Add to Itinerary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToItineraryModal; 