import { useState } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
} from '@/components/ui/carousel'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Image from '@/components/ui/image'
import { FileUploader } from '@/components/ui/file-uploader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Autoplay from 'embla-carousel-autoplay'

export default function CarouselEdit({ preview }) {

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
    const [files, setFiles] = useState([])
    const [imagePreview, setImagePreview] = useState([])
    const [link, setLink] = useState('')


    const handleFileChange = (files) => {
        if (files) {
            setFiles(files);
            console.log(files);
        }
    };

    const handleSubmitLink = () => {
        if (!link) return
        setFiles((prev) => [...prev, { name: `Image (${prev.length + 1})`, url: link }])
        setLink('')
    }

    const handleSaveImages = () => {
        if (files.length > 0) {
            const imageUrls = files.map((file) => {
                if (file.url) {
                    return file.url;
                } else
                    return URL.createObjectURL(file)
            });
            setImagePreview(imageUrls);
            setIsOpen(false);
        }
        if (files.length === 0) {
            setImagePreview([]);
            setIsOpen(false);
        }
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
                    {(imagePreview && imagePreview.length > 0) && imagePreview.map((image, index) => (
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
                {imagePreview.length === 0 && !preview &&
                    <>
                        <CarouselPrevious className="left-4" />
                        <CarouselNext className="right-4" />
                    </>
                }
            </Carousel>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Upload Image
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="Image URL"
                            className="mb-4"
                            onChange={(e) => setLink(e.target.value)}
                        />
                        <Button
                            onClick={handleSubmitLink}
                        >
                            Submit
                        </Button>
                    </div>
                    <FileUploader
                        className="w-full"
                        value={files}
                        onValueChange={(files) => handleFileChange(files)}
                        maxFileCount={5}
                    />
                    <DialogFooter>
                        <div className="flex w-full items-center justify-end gap-x-2">
                            <DialogClose asChild >
                                <Button
                                    variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                onClick={() => handleSaveImages()}>
                                Save
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}