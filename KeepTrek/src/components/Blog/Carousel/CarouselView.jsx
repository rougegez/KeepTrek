import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
} from '@/components/ui/carousel'
import Image from '@/components/ui/image'
import Autoplay from 'embla-carousel-autoplay'



export default function CarouselView({ images }) {


    return (
        <Carousel
            plugins={[
                Autoplay(),
            ]}
            opts={{
                loop: true,
                align: 'start',
            }}
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3 object-contain">
                        <div className="relative w-full aspect-video">
                            <Image
                                src={image}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
        </Carousel>
    )
}