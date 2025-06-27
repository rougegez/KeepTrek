import * as React from "react"
import { FileText, Upload, X, Link as LinkIcon, Image as ImageIcon } from "lucide-react"
import Dropzone from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Unified image object: { type: 'file'|'url', name, src, file? }
export function FileUploader(props) {
    const {
        value: valueProp = [],
        onValueChange,
        progresses,
        accept = { "image/*": [] },
        maxSize = 1024 * 1024 * 2,
        maxFileCount = 1,
        multiple = false,
        disabled = false,
        className,
        ...dropzoneProps
    } = props

    // Controlled mode: always use valueProp
    const files = valueProp
    const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount

    const onDrop = React.useCallback(
        (acceptedFiles, rejectedFiles) => {
            let newImages = acceptedFiles.map((file) => ({
                type: 'file',
                name: file.name,
                src: URL.createObjectURL(file),
                file,
                size: file.size,
            }))
            let updated = [...(files || []), ...newImages]
            if (updated.length > maxFileCount) updated = updated.slice(0, maxFileCount)
            onValueChange?.(updated)
        },
        [files, maxFileCount, onValueChange]
    )

    function onRemove(index) {
        const removed = files[index]
        if (removed?.type === 'file' && removed?.src) {
            URL.revokeObjectURL(removed.src)
        }
        const newFiles = files.filter((_, i) => i !== index)
        onValueChange?.(newFiles)
    }

    return (
        <div className="relative flex flex-col gap-6 overflow-hidden">
            <Dropzone
                onDrop={onDrop}
                accept={accept}
                maxSize={maxSize}
                maxFiles={maxFileCount}
                multiple={maxFileCount > 1 || multiple}
                disabled={isDisabled}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isDragActive && "border-muted-foreground/50",
                            isDisabled && "pointer-events-none opacity-60",
                            className
                        )}
                        {...dropzoneProps}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
                                </div>
                                <p className="font-medium text-muted-foreground">Drop the files here</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
                                </div>
                                <div className="flex flex-col gap-px">
                                    <p className="font-medium text-muted-foreground">Drag 'n' drop files here, or click to select files</p>
                                    <p className="text-sm text-muted-foreground/70">
                                        You can upload
                                        {maxFileCount > 1
                                            ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount} files (maximum ${formatBytes(maxSize)} each)`
                                            : ` a file (maximum ${formatBytes(maxSize)})`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dropzone>
            {files?.length ? (
                <ScrollArea className="h-fit w-full px-3">
                    <div className="flex max-h-48 flex-col gap-4">
                        {files?.map((img, index) => (
                            <FileCard
                                key={index}
                                img={img}
                                onRemove={() => onRemove(index)}
                                progress={progresses?.[img.name]}
                            />
                        ))}
                    </div>
                </ScrollArea>
            ) : null}
        </div>
    )
}

function FileCard({ img, progress, onRemove }) {
    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5 items-center">
                {img.type === 'file' ? <ImageIcon className="text-blue-400" /> : <LinkIcon className="text-green-500" />}
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">{img.name || img.src}</p>
                        <p className="text-xs text-muted-foreground">
                            {img.type === 'file' ? 'Uploaded file' : 'Image URL'}
                        </p>
                        {img.size && <p className="text-xs text-muted-foreground">{formatBytes(img.size)}</p>}
                    </div>
                    {progress ? <Progress value={progress} /> : null}
                </div>
                <img
                    src={img.src}
                    alt={img.name || 'preview'}
                    width={48}
                    height={48}
                    loading="lazy"
                    className="aspect-square shrink-0 rounded-md object-cover border ml-2"
                />
            </div>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    onClick={onRemove}
                >
                    <X className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        </div>
    )
}