import { useState } from "react";
import { Clock, MapPin, MoreHorizontal, Pencil, Trash, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditableRichText from "../../ui/EditableRichText";
import EditableText from "@/components/ui/EditableText";
import ImageUploadSheet from "./ImageUploadSheet";
import CarouselView from "@/components/Blog/Carousel/CarouselView";
import { formatTime } from "@/utils/timeFormat.jsx";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import GuideEditActivityModal from "./GuideEditActivityModal";
import { Reorder, useDragControls } from "framer-motion";

function GuideEditActivityCard({ activity, position, selected, onClick, onSave , onDelete, reorderMode}) {

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSaveImage = (images) => {
        if (!images || images.length === 0) {
            onSave({ ...activity, image: null });
        } else {
            let newImages = images.map(img => ({
                src: img.src,
                file: img.file || null
            }));
            onSave({ ...activity, image: newImages });
        }
        setIsSheetOpen(false);
    }

    const handleEditActivity = (updatedActivity) => {
        onSave(updatedActivity);
        setIsEditModalOpen(false);
    }

    const controls = useDragControls();

    return (
        <Reorder.Item
            key={activity.id}
            value={activity}
            dragListener={false}
            dragControls={controls}
            whileDrag={{ scale: 1.02}}
            className={`group flex relative items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 ${selected ? "bg-teal-50 ring-2 ring-teal-200 border-teal-200" : ""}`}
            >
            {/* Drag Handle (only in reorder mode) */}
            {reorderMode && (
                <div
                    className="flex shrink-0 self-stretch items-center cursor-grab active:cursor-grabbing rounded focus:outline-none"
                    onPointerDown={(e) => {controls.start(e);e.preventDefault();}}
                >
                    <GripVertical className="w-5 h-5 text-gray-400" />
                </div>
            )}

            {/* Activity Number Badge */}
            <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 group-hover:text-teal-600 transition-colors">
                    {position}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2 ">
                    <EditableText
                        initialValue={activity.title}
                        placeholder="Click to edit activity title"
                        onSave={(value) => onSave({ ...activity, title: value })}
                        className="w-full font-semibold text-gray-900 leading-tight cursor-pointer"
                    />
                    {/* Time & Duration - Only show if available */}
                    {(activity.time || activity.duration) && (
                        <div className="flex-shrink-0 ml-4">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3" />
                                <span>
                                    {activity.time && activity.duration
                                        ? `${formatTime(activity.time)} • ${activity.duration} hours`
                                        : `${activity.duration} hours` || formatTime(activity.time)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <EditableRichText
                    initialContent={activity.description}
                    onSave={(content) => onSave({ ...activity, description: content })}
                    placeholder="Click to edit the description"
                    disabledExtensions={["image", "link", "heading", "horizontalRule", "textalign"]}
                    className="text-sm text-gray-600 leading-relaxed mb-2"
                />

                <Badge
                    className="cursor-pointer"
                    onClick={onClick}
                >
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>Click to view on map</span>
                </Badge>
            </div>

            {/* Image */}
            <div className="">
                <CarouselView
                    classNames={{
                        carousel: "w-64 h-40 max-w-64 max-h-40",
                        item: "basis-full",
                        image: "w-64 h-40 max-w-64 max-h-40 rounded-lg",
                        leftArrow: "opacity-65",
                        rightArrow: "opacity-65"
                    }}
                    carouselProps={{
                        plugins: [],
                        opts: {
                            loop: true,
                            align: 'start'
                        }
                    }}
                    images={Array.isArray(activity.image) ? activity.image.map((img) => { return img.src || img }) : activity.image}
                    onImageClick={() => setIsSheetOpen(true)}
                />
            </div>

            <div className="absolute top-2 right-2 z-49">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full [&_svg]:size-5"
                        >
                            <MoreHorizontal className=" text-gray-500 hover:text-gray-800" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            <Pencil className="mr-1"/>
                            Edit Activity
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {onDelete(activity)}}
                            className="text-red-600 hover:!text-red-600"
                        >
                            <Trash className="mr-1 text-red-600" />
                            Delete Activity
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ImageUploadSheet
                key={activity.id + isSheetOpen}
                imgs={activity.image ? activity.image.map((img) => { return { src: img.src || img, type: 'blob' } }) : activity.image}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={handleSaveImage}
                maxFileCount={3}
            />

            <GuideEditActivityModal
                key={isEditModalOpen}
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                activity={activity}
                onSave={handleEditActivity}
            />
        </Reorder.Item>
    );
}

export default GuideEditActivityCard;
