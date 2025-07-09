import { useState, useEffect } from 'react'
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
import { cn } from '@/lib/utils'

export default function CarouselEdit({
    file,
    onFileChange,
    preview,
    classNames = {
        carousel: null,
        content: null,
        item: null,
        imageDiv: null,
        image: null,
        leftArrow: null,
        rightArrow: null,
    },
    ...props
}) {
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
    const imagePreview = images.map(img => img.src || img.url || img)

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
                className={cn("w-full", classNames.carousel)}
                {...carouselProps}
                {...props}
            >
                <CarouselContent className={cn("-ml-1", classNames.content)}>
                    {!preview &&
                        <CarouselItem className={cn("pl-1 basis-1/3 object-contain", classNames.item)}>
                            <div className={cn("relative w-full aspect-video", classNames.imageDiv)}>
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
                        <CarouselItem key={image + idx} className={cn("pl-1 basis-1/3 object-contain", classNames.item)}>
                            <div className={cn("relative w-full aspect-video", classNames.imageDiv)}>
                                <Image
                                    key={image}
                                    src={image}
                                    className={cn("object-cover", classNames.image)}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {imagePreview.length !== 0 &&
                    <>
                        <CarouselPrevious className={cn("left-4", classNames.leftArrow)} />
                        <CarouselNext className={cn("right-4", classNames.rightArrow)} />
                    </>
                }
            </Carousel>

            <ImageUploadSheet
                key={images + isOpen}
                imgs={images.map((img) => ({ src: img.src || img, type: img.type || 'blob' }))}
                open={isOpen}
                onOpenChange={setIsOpen}
                onSave={handleSaveImages}
                maxFileCount={5}
            />
        </>
    )
}