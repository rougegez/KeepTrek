import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetClose,
    SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/ui/file-uploader";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function ImageUploadSheet({ imgs, open, onOpenChange, onSave, maxFileCount = 1 }) {
    // Unified image array: { type: 'file'|'url', name, src, file?, size? }
    const [images, setImages] = useState(imgs || []);
    const [urlInput, setUrlInput] = useState("");

    // Add image URL to array
    const handleUrlAdd = (url) => {
        url = url.trim();
        if (url && !images.some(img => img.src === url)) {
            const name = url.split('/').pop();
            const newImg = { type: 'url', name, src: url };
            let updated = [...images, newImg];
            setImages(updated);
        }
        setUrlInput("");
    };

    const handleFileChange = (newImages) => {
        setImages(prev => [...prev, ...newImages]);
    };

    // Remove image by index
    const removeImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSave = () => {
        if (images.length > maxFileCount) {
            toast.info(`You can only upload up to ${maxFileCount} image${maxFileCount > 1 ? 's' : ''}.`);
            return;
        }
        onSave(images)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col h-full">
                <SheetHeader>
                    <SheetTitle>
                        Upload Image{maxFileCount > 1 ? 's' : ''}
                    </SheetTitle>
                    <SheetDescription>
                        Upload {maxFileCount > 1 ? 'images' : 'an image'} to be used in your guide.
                        You can provide URLs and/or upload file{maxFileCount > 1 ? 's' : ''}.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 min-h-0 overflow-y-auto grid auto-rows-min gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="sheet-image-link">
                            Image URL{maxFileCount > 1 ? 's' : ''}
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="sheet-image-link"
                                type="text"
                                placeholder={maxFileCount > 1 ? "Paste image URL and press Enter" : "Image URL"}
                                className="flex-1"
                                value={urlInput}
                                onChange={e => setUrlInput(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleUrlAdd(urlInput);
                                }}
                            />
                            <Button
                                type="button"
                                onClick={() => handleUrlAdd(urlInput)}
                                aria-label="Add image URL"
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-muted-foreground text-sm font-semibold gap-2">
                        <span className="h-px w-8 bg-zinc-200 dark:bg-zinc-700" />
                        or
                        <span className="h-px w-8 bg-zinc-200 dark:bg-zinc-700" />
                    </div>
                    <FileUploader
                        className="w-full"
                        value={images.filter(img => img.type === 'file')}
                        onValueChange={handleFileChange}
                        maxFileCount={maxFileCount}
                        showPreview={false}
                    />
                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="flex flex-wrap gap-4 justify-center mb-2">
                            {images.map((img, idx) => (
                                <div key={idx} className={`relative group flex flex-col items-center p-4 ${idx+1 > maxFileCount && 'ring-2 ring-red-400'}`}>
                                    <img
                                        src={img.src}
                                        alt={img.name || `Preview ${idx + 1}`}
                                        className="max-h-32 max-w-xs rounded-lg shadow border object-contain"
                                    />
                                    <div className="text-xs mt-1 text-zinc-500 text-center">
                                        {img.name}
                                        <br />
                                        <span className="italic">{img.type === 'file'
                                            ? 'Uploaded file' :
                                            img.type === 'blob'
                                                ? 'Existing Image'
                                                : 'Image URL'}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -top-2 -right-2 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-none!"
                                        onClick={() => removeImage(idx)}
                                        aria-label="Remove image"
                                    >
                                        <X />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <SheetFooter className="gap-y-2">
                    <SheetClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button onClick={handleSave}>Save</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}