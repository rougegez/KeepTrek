import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { MapPin, Notebook, Pencil, Trash2, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { getUserProfile } from "@/APIs/users";
import { UserAvatar, UserAvatarStack } from '../profilePage/avatar';
import { ScrollArea } from "@/components/ui/scroll-area";

// Utility function to linkify URLs in text
function linkify(text) {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{part}</a>;
    }
    return part;
  });
}

export default function ItemModal({ 
  item, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onUpvote, 
  onDownvote, 
  onLocationClick, 
  currUser,
  optimisticVotes
}) {
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    const fetchUsernames = async () => {
      if (item) {
        const creatorProfile = await getUserProfile(item.creatorID);
        setCreatorName(creatorProfile.username);
      }
    };

    fetchUsernames();
  }, [item]);

  const handleUpvote = async () => {
    await onUpvote(item);
  };
  
  const handleDownvote = async () => {
    await onDownvote(item);
  };

  const handleDelete = async () => {
    onDelete(item);
    onClose();
  };

  if (!item) return null;

  const currentUser = currUser;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] md:max-w-3xl max-h-[95vh] overflow-hidden rounded-xl">
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
                <Trash2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
              </Button>
            </div>
          </div>
          <Separator />
          <DialogTitle className="text-3xl pt-4">{item.title}</DialogTitle>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 items-end">
              <div className="flex flex-col gap-1">
                <div className="flex items-start gap-1 text-muted-foreground">
                  <User className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                  <label className="block text-sm font-normal text-muted-foreground">Added by</label>
                </div>
                <UserAvatar 
                  userId={item.creatorID}
                  className="h-8 w-8"
                />
              </div>
              
              {item.editors?.length > 0 && (
                <>
                  <Separator orientation="vertical" className="h-8 w-0.5" />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-1 text-muted-foreground">
                      <Pencil className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                      <label className="block text-sm font-normal text-muted-foreground">Edited by</label>
                    </div>
                    <UserAvatarStack 
                      userIds={item.editors} 
                      size={8}
                      maxUsers={3}
                      className="-space-x-2"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-end space-y-2">
              <div className="flex gap-2 items-center">
                <div>
                  <UserAvatarStack userIds={optimisticVotes[item.id]?.upvotes} size={6} />
                </div>
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={handleUpvote}>
                  <span className="sr-only">Upvote</span>
                  <ThumbsUp className={`w-3 h-3 mt-0.5 flex-shrink-0 ${optimisticVotes[item.id]?.upvotes.includes(currUser) ? 'fill-current text-blue-500' : ''}`} />
                  <span>{optimisticVotes[item.id]?.upvotes.length || 0}</span>
                </Button>
              </div>
              <div className="flex gap-2 items-center">
                <div>
                  <UserAvatarStack userIds={optimisticVotes[item.id]?.downvotes} size={6} />
                </div>
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={handleDownvote}>
                  <span className="sr-only">Downvote</span>
                  <ThumbsDown className={`w-3 h-3 mt-0.5 flex-shrink-0 ${optimisticVotes[item.id]?.downvotes.includes(currUser) ? 'fill-current text-red-500' : ''}`} />
                  <span>{optimisticVotes[item.id]?.downvotes.length || 0}</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh]">
          <div className="grid gap-4 pr-4">
            <img
              src={item.image || "/src/assets/dummy-image.jpg"}
              alt={item.title}
              className="w-full aspect-video object-cover rounded-lg"
            />
            
            <div className="flex items-start gap-2 mt-2 text-muted-foreground">
              <Button
                variant="ghost"
                className="relative h-3 w-3 rounded-full"
                size="icon"
                onClick={(e) => {e.stopPropagation(); onLocationClick(item); onClose();}}
                {...(item.coordinates.length > 1 ? {} : {disabled: true})}
              >
                <MapPin className="w-3 h-3 mt-0.5" />
              </Button> 
              <label className="block text-sm font-normal text-muted-foreground">Address</label>
            </div>
            <p className="">{item.location}</p>
            
            <div className="flex items-start gap-2 mt-2 text-muted-foreground">
              <Notebook className="w-4 h-4" /> 
              <label className="block text-sm font-normal text-muted-foreground">Notes</label>
            </div>
            <p className="whitespace-pre-line break-words">{linkify(item.notes)}</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
