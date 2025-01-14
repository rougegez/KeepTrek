import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { MapPin, Notebook, Pencil, Trash, ThumbsUp, ThumbsDown, User, Map } from 'lucide-react';
import { getUserProfile } from "@/APIs/users";

export default function ItemModal({ item, isOpen, onClose, onEdit, onDelete, onUpvote, onDownvote, onLocationClick, currUser }) {
  const [creatorName, setCreatorName] = useState("");
  const [editorNames, setEditorNames] = useState([]);
  const [upvoterNames, setUpvoterNames] = useState([]);
  const [downvoterNames, setDownvoterNames] = useState([]);

  useEffect(() => {
    const fetchUsernames = async () => {
      if (item) {
        const creatorProfile = await getUserProfile(item.creatorID);
        setCreatorName(creatorProfile.username);

        const editorProfiles = await Promise.all(item.editors.map(id => getUserProfile(id)));
        setEditorNames(editorProfiles.map(profile => profile.username));

        const upvoterProfiles = await Promise.all(item.upvotes.map(id => getUserProfile(id)));
        setUpvoterNames(upvoterProfiles.map(profile => profile.username));

        const downvoterProfiles = await Promise.all(item.downvotes.map(id => getUserProfile(id)));
        setDownvoterNames(downvoterProfiles.map(profile => profile.username));
      }
    };

    fetchUsernames();
  }, [item]);

  const handleDelete = async () => {
    onDelete(item);
    onClose();
  };

  if (!item) return null;

  const currentUser = currUser;
  const upvotes = item.upvotes || []; // Ensure upvotes is an array
  const downvotes = item.downvotes || []; // Ensure downvotes is an array

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[95vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <div className="flex items-center justify-between mt-4 mb-2">
            <label className="block text-l font-normal bg-secondary px-3 py-1 rounded-lg">
              {item.category.replace(/\b\w/g, char => char.toUpperCase())}
            </label>
            <div className="flex gap-1">
              <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm" onClick={() => onEdit(item)}>
                <span className="sr-only">Edit</span>
                <Pencil className="w-3 h-3 mt-0.5 flex-shrink-0" />
              </Button>
              <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm" onClick={handleDelete}>
                <span className="sr-only">Delete</span>
                <Trash className="w-3 h-3 mt-0.5 flex-shrink-0" />
              </Button>
            </div>
          </div>
          <Separator />
          <DialogTitle className="text-3xl pt-4">{item.title}</DialogTitle>

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <div>
                <div className="flex items-start gap-1 text-muted-foreground">
                  <User className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                  <label className="block text-sm font-normal text-muted-foreground">Added by</label>
                </div>
                {creatorName}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <div className="flex gap-2 items-center">
                <span className="text-right text-sm text-muted-foreground">{upvoterNames.join(", ")}</span>
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); onUpvote(item); }}>
                  <span className="sr-only">Upvote</span>
                  <ThumbsUp className={`w-3 h-3 mt-0.5 flex-shrink-0 ${upvotes.includes(currentUser) ? 'fill-current text-blue-500' : ''}`} />
                  <span>{upvotes.length}</span>
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-right text-sm text-muted-foreground">{downvoterNames.join(", ")}</span>
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); onDownvote(item); }}>
                  <span className="sr-only">Downvote</span>
                  <ThumbsDown className={`w-3 h-3 mt-0.5 flex-shrink-0 ${downvotes.includes(currentUser) ? 'fill-current text-red-500' : ''}`} />
                  <span>{downvotes.length}</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4">
          <img
            src={item.image || "/src/assets/dummy-image.jpg"}
            alt={item.title}
            className="w-full aspect-video object-cover rounded-lg"
          />
          
          <div className="flex items-start gap-1 text-muted-foreground">
            <Button
              variant="ghost"
              className="relative h-3 w-3 rounded-full"
              size="icon"
              onClick={(e) => {e.stopPropagation(); onLocationClick(item); onClose();}}
              {...(item.coordinates.length > 1 ? {} : {disabled: true})}
            >
              <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            </Button> 
            <label className="block text-sm font-normal text-muted-foreground">Address</label>
          </div>
          <p className="">{item.location}</p>
          
          <div className="flex items-start gap-1 text-muted-foreground">
            <Notebook className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <label className="block text-sm font-normal text-muted-foreground">Notes</label>
          </div>
          <p className="">{item.notes}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
