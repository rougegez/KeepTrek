import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
} from '@/components/ui/carousel'
import Image from '@/components/ui/image'
import { cn } from '@/lib/utils'
import Autoplay from 'embla-carousel-autoplay'


export default function CarouselView({
    images,
    classNames = {
        carousel: null,
        content: null,
        item: null,
        imageDiv: null,
        image: null,
        leftArrow: null,
        rightArrow: null,
    },
    carouselProps = {
        plugins: [
            Autoplay(),
        ],
        opts: {
            loop: true,
            align: 'start',
        }
    },
    onImageClick,
    ...props
}) {


    return (
        <Carousel
            className={cn("w-full", classNames.carousel)}
            {...carouselProps}
            {...props}
        >
            <CarouselContent
                className={cn("-ml-1", classNames.content)}
            >
                {(images && images.length > 0) ? (
                    images.map((image, index) => (
                        <CarouselItem key={index} className={cn("pl-1 basis-1/3 object-contain", classNames.item)}>
                            <div className={cn("relative w-full aspect-video", classNames.imageDiv)}>
                                <Image
                                    key={image}
                                    src={image}
                                    className={cn("object-cover", classNames.image)}
                                    onClick={onImageClick}
                                />
                            </div>
                        </CarouselItem>
                    ))
                ) : (
                    <CarouselItem className={cn("pl-1 basis-1/3 object-contain", classNames.item)}>
                        <div className={cn("relative w-full aspect-video", classNames.imageDiv)}>
                            <Image
                                src="/assets/dummy-image.jpg"
                                className={cn("object-cover", classNames.image)}
                                onClick={onImageClick}
                            />
                        </div>
                    </CarouselItem>
                )}
            </CarouselContent>
            {images && images.length > 1 && (
                <>
                    <CarouselPrevious className={cn("left-4", classNames.leftArrow)} />
                    <CarouselNext className={cn("right-4", classNames.rightArrow)} />
                </>
            )}
        </Carousel>
    )
}