import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, MapPin, Notebook, ThumbsUp, ThumbsDown, Pencil } from 'lucide-react'

export default function WishlistCard({ image, title, address, note, onClick }) {
  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardContent className="p-0 relative">
        <img 
          src={image || "./src/assets/dummy-image.jpg"} 
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm">
            <span className="sr-only">Like</span>
            <ThumbsUp className="w-3 h-3 mt-0.5 flex-shrink-0" />
          </Button>
          <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm">
            <span className="sr-only">Dislike</span>
            <ThumbsDown className="w-3 h-3 mt-0.5 flex-shrink-0" />
          </Button>
          <Button size="icon" variant="secondary" className="w-6 h-6 bg-white/80 backdrop-blur-sm">
            <span className="sr-only">Edit</span>
            <Pencil className="w-3 h-3 mt-0.5 flex-shrink-0 stroke-muted-foreground" />
          </Button>
        </div>
        <div className="p-4">
          <h2 className="font-semibold truncate">{title}</h2>
          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <h3 className="font-normal truncate">{address}</h3>
          </div>
          <div className="flex items-start gap-1 text-sm text-muted-foreground">
            <Notebook className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
            <p className="text-sm text-muted-foreground truncate">{note || "Add a note..."}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

