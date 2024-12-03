import { Card } from "@/components/ui/card"
import { Plus } from 'lucide-react'

export default function AddWishlistItem({ onClick }) {
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

