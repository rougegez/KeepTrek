import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import CarouselView from "@/components/Blog/Carousel/CarouselView"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function CarouselDialog({ open, onOpenChange, images }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent close={false} className="w-full p-8 bg-transparent border-none shadow-none min-w-[80vh]">
                <DialogClose asChild className="absolute -top-5 -right-5">
                    <Button variant="outline" className="rounded-full h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </DialogClose>
                <CarouselView
                    images={images}
                    classNames={{
                        item: "flex items-center basis-full",
                        imageDiv: "flex aspect-auto justify-center",
                        image: "h-full max-w-full max-h-[80vh] min-h-[50vh] object-contain",
                        leftArrow: "-left-12",
                        rightArrow: "-right-12",
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}