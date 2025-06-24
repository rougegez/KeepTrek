import { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
} from '@/components/ui/carousel'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from '@/components/ui/image'
import ImageUploadSheet from '@/components/Guides/components/ImageUploadSheet'
import Autoplay from 'embla-carousel-autoplay'

export default function CarouselEdit({ file, onFileChange, preview }) {
    const carouselProps = preview ? {
        plugins: [
            Autoplay(),
        ],
        opts: {
            loop: true,
            align: 'start',
        }
    } : {
        opts: {
            align: 'start',
            watchDrag: false
        }
    }

    const [isOpen, setIsOpen] = useState(false)
    const [images, setImages] = useState(file ?? [])

    // Preview images: use .src from each file object
    const imagePreview = images.map(img => img.src || img.url)

    const handleSaveImages = (newImages) => {
        setImages(newImages)
        if (onFileChange) {
            onFileChange(newImages)
        }
        setIsOpen(false)
    }

    return (
        <>
            <Carousel
                {...carouselProps}
            >
                <CarouselContent>
                    {!preview &&
                        <CarouselItem className="pl-1 md:basis-1/2 lg:basis-1/3 object-contain">
                            <div className="relative w-full aspect-video">
                                <Card
                                    className="cursor-pointer hover:bg-muted/50 transition-colors h-full"
                                    onClick={() => setIsOpen(true)}
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <Plus className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </Card>
                            </div>
                        </CarouselItem>
                    }
                    {(imagePreview && imagePreview.length > 0) && imagePreview.map((image, idx) => (
                        <CarouselItem key={image + idx} className="pl-1 md:basis-1/2 lg:basis-1/3 object-contain">
                            <div className="relative w-full aspect-video">
                                <Image
                                    src={image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {imagePreview.length !== 0 &&
                    <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </>
                }
            </Carousel>
            <ImageUploadSheet
                open={isOpen}
                onOpenChange={setIsOpen}
                onSave={handleSaveImages}
                maxFileCount={5}
            />
        </>
    )
}