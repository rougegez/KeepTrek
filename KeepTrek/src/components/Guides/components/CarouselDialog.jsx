import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import CarouselView from "@/components/Blog/Carousel/CarouselView"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"


export default function CarouselDialog({ open, onOpenChange, images }) {

    const isMobile = useIsMobile();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent close={false} className="w-full p-0 bg-transparent border-none shadow-none min-w-[80vh]">
                <DialogClose asChild className="absolute -top-8 -right-8">
                    <Button variant="outline" className="rounded-full h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </DialogClose>
                <CarouselView
                    images={images}
                    classNames={{
                        item: "flex items-center basis-full",
                        imageDiv: "flex aspect-auto justify-center",
                        image: `h-full ${isMobile ? "max-w-[80vw]" : "max-w-full"} max-h-[80vh] min-h-[50vh] object-contain`,
                        leftArrow: "-left-12",
                        rightArrow: "-right-12",
                    }}
                />
            </DialogContent>
        </Dialog>
    )
}