import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { MapPin, Notebook, Pencil, Trash } from 'lucide-react'
  
  //tofix
  const handleNoteChange = (dayIndex, activityId, newNote) => {
    const newDays = [...days];
    const activity = newDays[dayIndex].activities.find((a) => a.id === activityId);
    if (activity) {
      activity.notes = newNote; // Update the notes field
    }
    setDays(newDays);
  };

  export default function ItemModal({ item, isOpen, onClose }) {
    if (!item) return null
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between mt-4">
                <DialogTitle className="text-3xl">{item.title}</DialogTitle>
                <div className="flex gap-1">
                    <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm">
                        <span className="sr-only">Edit</span>
                        <Pencil className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    </Button>
                    <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm">
                        <span className="sr-only">Delete</span>
                        <Trash className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    </Button>
                </div>
            </div>
            <label className="block text-sm font-normal text-muted-foreground">{item.category}</label>
          </DialogHeader>
          <div className="grid gap-4">
            <img
              src={item.image || "./src/assets/dummy-image.jpg"}
              alt={item.title}
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
            <textarea
                className="w-full min-h-[50px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50 truncate"
                placeholder="Add a note..."
                value={item.note}
                onChange={(e) => handleNoteChange(dayIndex, activity.id, e.target.value)}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  