import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Notebook, ThumbsUp, ThumbsDown, Plus } from 'lucide-react'

export function WishlistCard({ item, onClick, onUpvote, onDownvote, currUser }) {
  const handleUpvote = async () => {
    onUpvote(item);
  };
  
  const handleDownvote = async () => {
    onDownvote(item);
  };

  const currentUser = currUser;

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="p-0 relative">
        <img 
          src={item.image || "./src/assets/dummy-image.jpg"} 
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); handleUpvote(); }}>
            <span className="sr-only">Upvote</span>
            <ThumbsUp className={`w-3 h-3 mt-0.5 flex-shrink-0 ${item.upvotes.includes(currentUser) ? 'fill-current text-blue-500' : ''}`} />
            <span>{item.upvotes.length}</span>
          </Button>
          <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); handleDownvote(); }}>
            <span className="sr-only">Downvote</span>
            <ThumbsDown className={`w-3 h-3 mt-0.5 flex-shrink-0 ${item.downvotes.includes(currentUser) ? 'fill-current text-red-500' : ''}`} />
            <span>{item.downvotes.length}</span>
          </Button>
        </div>
        <div className="p-4">
          <h2 className="font-semibold truncate">{item.name}</h2>
          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <h3 className="font-normal truncate">{item.address}</h3>
          </div>
          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <Notebook className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <p className="text-sm text-muted-foreground truncate">{item.note || "Add a note..."}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function AddItemCard({ onClick }) {
  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full min-h-[240px]">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
    </Card>
  )
}