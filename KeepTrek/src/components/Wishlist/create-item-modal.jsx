import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  //SelectValue,
} from "@/components/ui/select"

export default function CreateItemModal({ 
    isOpen,
  onClose,
  onSubmit,
  category,
  setCategory,
  title,
  setTitle,
  address,
  setAddress,
  note,
  setNote, 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Wishlist</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <Button variant="outline" className="w-full">
                  {category || "Select a category"}
                </Button>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
                <SelectItem value="Activities">Activities</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">Name</label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">Address</label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label className="block text-sm font-medium text-muted-foreground">Notes</label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </form>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={onSubmit}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

