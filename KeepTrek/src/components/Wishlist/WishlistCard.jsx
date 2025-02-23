import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Notebook, ThumbsUp, ThumbsDown, Plus, CheckIcon } from 'lucide-react'
import { motion } from "framer-motion";

export function WishlistCard({ 
  item, 
  onClick, 
  onUpvote, 
  onDownvote, 
  onLocationClick, 
  currUser, 
  addMode, 
  onSelect, 
  isSelected,
  optimisticVotes
}) {
  const handleUpvote = async () => {
    await onUpvote(item);
  };
  
  const handleDownvote = async () => {
    await onDownvote(item);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        opacity: { duration: 0.2 },
        layout: { duration: 0.3 },
        scale: { duration: 0.2 }
      }}
    >
      <Card className={`group cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'border-4 border-primary' : ''}`} onClick={!addMode ? onClick : undefined}>
        <CardContent className="p-0 relative">
          <img 
            src={item.image || "./src/assets/dummy-image.jpg"} 
            alt={item.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {addMode ? (
              <Button size="icon" variant="secondary" className={`flex gap-1 h-6 backdrop-blur-sm ${isSelected ? 'bg-primary text-white' : ''}`} onClick={(e) => { e.stopPropagation(); onSelect(item); }}>
                <span className="sr-only">Select</span>
                <CheckIcon className={`w-3 h-3 mt-0.5 flex-shrink-0`} />
              </Button>
            ) : (
              <>
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); handleUpvote(); }}>
                  <span className="sr-only">Upvote</span>
                  <ThumbsUp className={`w-3 h-3 mt-0.5 flex-shrink-0 ${optimisticVotes[item.id]?.upvotes.includes(currUser) ? 'fill-current text-blue-500' : ''}`} />
                  <span>{optimisticVotes[item.id]?.upvotes.length || 0}</span>
                </Button>
                <Button size="icon" variant="secondary" className={`flex gap-1 h-6 bg-white/80 backdrop-blur-sm`} onClick={(e) => { e.stopPropagation(); handleDownvote(); }}>
                  <span className="sr-only">Downvote</span>
                  <ThumbsDown className={`w-3 h-3 mt-0.5 flex-shrink-0 ${optimisticVotes[item.id]?.downvotes.includes(currUser) ? 'fill-current text-red-500' : ''}`} />
                  <span>{optimisticVotes[item.id]?.downvotes.length || 0}</span>
                </Button>
              </>
            )}
          </div>
          <div className="p-4">
            <h2 className="font-semibold truncate mb-2">{item.title}</h2>
            <div className="flex items-start gap-1 text-sm text-muted-foreground">
              <Button
                variant="ghost"
                className="relative h-5 w-full mb-2"
                size="icon"
                onClick={(e) => {e.stopPropagation(); onLocationClick(item);}}
                {...(item.coordinates.length > 1 ? {} : {disabled: true})}
              >
                <MapPin className="w-3 h-3" />
                <h3 className="font-normal mt-0.5 truncate">{item.location}</h3>
              </Button> 
            </div>
            <div className="flex items-start mt-0.5 gap-2 text-sm text-muted-foreground">
              <Notebook className="w-4 h-4" /> 
              <p className="text-sm text-muted-foreground truncate">{item.notes || "Add a note..."}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AddItemCard({ onClick, category }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:bg-muted/50 transition-colors h-full"
        onClick={() => onClick(category)}
      >
        <div className="flex items-center justify-center h-full min-h-[240px]">
          <Plus className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>
    </motion.div>
  )
}