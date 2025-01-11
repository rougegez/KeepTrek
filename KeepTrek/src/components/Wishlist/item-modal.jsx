import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Notebook, Pencil, Trash, ThumbsUp, ThumbsDown, User } from 'lucide-react';

export default function ItemModal({ item, isOpen, onClose, onEdit, onDelete, onUpvote, onDownvote, currUser }) {

  useEffect(() => {
    if (item) {
      console.log("Item:", item); // Debug log
      console.log("Item ID:", item.id); // Debug log
      console.log("Item tripID:", item.tripID); // Debug log
    }
  }, [item]);

  const handleEdit = () => {
    onEdit(item);
  };

  const handleDelete = async () => {
    onDelete(item);
    onClose();
  };

  const handleUpvote = async () => {
    onUpvote(item);
  };
  
  const handleDownvote = async () => {
    onDownvote(item);
  };

  const handleClose = () => {
    onClose();
  };

  if (!item) return null;

  const currentUser = currUser;
  const upvotes = item.upvotes || []; // Ensure upvotes is an array
  const downvotes = item.downvotes || []; // Ensure downvotes is an array

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mt-4">
            <label className="block text-l font-normal">{item.category}</label>
            <div className="flex gap-1">
              <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm" onClick={handleEdit}>
                <span className="sr-only">Edit</span>
                <Pencil className="w-3 h-3 mt-0.5 flex-shrink-0" />
              </Button>
              <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm" onClick={handleDelete}>
                <span className="sr-only">Delete</span>
                <Trash className="w-3 h-3 mt-0.5 flex-shrink-0" />
              </Button>
            </div>
          </div>
          <DialogTitle className="text-3xl">{item.name}</DialogTitle>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div>
                <div className="flex items-start gap-1 text-muted-foreground">
                  <User className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                  <label className="block text-sm font-normal text-muted-foreground">Added by</label>
                </div>
                {item.creatorID}
              </div>
              <div>
                <div className="flex items-start gap-1 text-muted-foreground">
                  <Pencil className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                  <label className="block text-sm font-normal text-muted-foreground">Edited by</label>
                </div>
                {item.editors}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); handleUpvote(); }}>
                  <span className="sr-only">Upvote</span>
                  <ThumbsUp className={`w-3 h-3 mt-0.5 flex-shrink-0 ${upvotes.includes(currentUser) ? 'fill-current text-blue-500' : ''}`} />
                  <span>{upvotes.length}</span>
                </Button>
                <span>{item.upvotes}</span>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); handleDownvote(); }}>
                  <span className="sr-only">Downvote</span>
                  <ThumbsDown className={`w-3 h-3 mt-0.5 flex-shrink-0 ${downvotes.includes(currentUser) ? 'fill-current text-red-500' : ''}`} />
                  <span>{downvotes.length}</span>
                </Button>
                <span>{item.downvotes}</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4">
          <img
            src={item.image || "/src/assets/dummy-image.jpg"}
            alt={item.name}
            className="w-full aspect-video object-cover rounded-lg"
          />
          
          <div className="flex items-start gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <label className="block text-sm font-normal text-muted-foreground">Address</label>
          </div>
          <p className="">{item.address}</p>
          
          <div className="flex items-start gap-1 text-muted-foreground">
            <Notebook className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <label className="block text-sm font-normal text-muted-foreground">Notes</label>
          </div>
          <p className="">{item.note}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
