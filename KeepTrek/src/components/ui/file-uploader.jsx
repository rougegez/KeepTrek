import * as React from "react"
import { FileText, Upload, X } from "lucide-react"
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

export function FileUploader(props) {
    const {
        value: valueProp,
        onValueChange,
        progresses,
        accept = {
            "image/*": [],
        },
        maxSize = 1024 * 1024 * 2,
        maxFileCount = 1,
        multiple = false,
        disabled = false,
        className,
        initialImage,
        ...dropzoneProps
    } = props

    const [files, setFiles] = React.useState(valueProp || [])

    React.useEffect(() => {
        if (valueProp !== files) {
            setFiles(valueProp || [])
        }
    }, [valueProp])

    React.useEffect(() => {
        if (initialImage) {
            const initialFile = {
                name: initialImage.split('/').pop(), // Extract the file name from the URL
                preview: initialImage,
                type: "image/*",
            }
            setFiles([initialFile])
        }
    }, [initialImage])

    const onDrop = React.useCallback(
        (acceptedFiles, rejectedFiles) => {
            if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
                {error && <p className="text-red-500 text-sm">{"Cannot upload more than 1 file at a time"}</p>}
                return
            }

            if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
                {error && <p className="text-red-500 text-sm">{`Cannot upload more than ${maxFileCount} files`}</p>}
                return
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            )

            const updatedFiles = files ? [...files, ...newFiles] : newFiles

            setFiles(updatedFiles)
            onValueChange?.(updatedFiles)

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    {error && <p className="text-red-500 text-sm">{`File ${file.name} was rejected`}</p>}
                })
            }
        },
        [files, maxFileCount, multiple, onValueChange]
    )

    function onRemove(index) {
        if (!files) return
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)
        onValueChange?.(newFiles)
    }

    // Revoke preview url when component unmounts
    React.useEffect(() => {
        return () => {
            if (!files) return
            files.forEach((file) => {
                if (isFileWithPreview(file) && !valueProp) {
                    URL.revokeObjectURL(file.preview)
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount

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
                                    <Upload
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="font-medium text-muted-foreground">
                                    Drop the files here
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Upload
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="flex flex-col gap-px">
                                    <p className="font-medium text-muted-foreground">
                                        Drag {`'n'`} drop files here, or click to select files
                                    </p>
                                    <p className="text-sm text-muted-foreground/70">
                                        You can upload
                                        {maxFileCount > 1
                                            ? ` ${maxFileCount === Infinity ? "multiple" : maxFileCount}
                                            files (maximum ${formatBytes(maxSize)} each)`
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
                        {files?.map((file, index) => (
                            <FileCard
                                key={index}
                                file={file}
                                onRemove={() => onRemove(index)}
                                progress={progresses?.[file.name]}
                            />
                        ))}
                    </div>
                </ScrollArea>
            ) : null}
        </div>
    )
}

function FileCard({ file, progress, onRemove }) {
    return (
        <div className="relative flex items-center gap-2.5">
            <div className="flex flex-1 gap-2.5">
                {isFileWithPreview(file) ? <FilePreview file={file} /> : null}
                <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-px">
                        <p className="line-clamp-1 text-sm font-medium text-foreground/80">
                            {file.name}
                        </p>
                        {file.size != null && (
                            <p className="text-xs text-muted-foreground">
                                {formatBytes(file.size)}
                            </p>
                        )}
                    </div>
                    {progress ? <Progress value={progress} /> : null}
                </div>
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

function isFileWithPreview(file) {
    return "preview" in file && typeof file.preview === "string"
}

function FilePreview({ file }) {
    if (file.type.startsWith("image/")) {
        return (
            <img
                src={file.preview}
                alt={file.name}
                width={48}
                height={48}
                loading="lazy"
                className="aspect-square shrink-0 rounded-md object-cover"
            />
        )
    }

    return (
        <FileText className="size-10 text-muted-foreground" aria-hidden="true" />
    )
}