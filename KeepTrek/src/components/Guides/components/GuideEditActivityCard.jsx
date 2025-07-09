import { useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditableRichText from "../../ui/EditableRichText";
import EditableText from "@/components/ui/EditableText";
import ImageUploadSheet from "./ImageUploadSheet";
import CarouselView from "@/components/Blog/Carousel/CarouselView";
import { formatTime } from "@/utils/timeFormat.jsx";

function GuideEditActivityCard({ activity, position, selected, onClick, onSave }) {

    const [isSheetOpen, setIsSheetOpen] = useState(false);

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

    return (
        <div
            className={`group flex items-start space-x-4 p-4 rounded-xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-200 ${selected ? "bg-teal-50 ring-2 ring-teal-200 border-teal-200" : ""}`}
        >
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
                    images={activity.image ? activity.image.map((img) => { return img.src || img }) : activity.image}
                    onImageClick={() => setIsSheetOpen(true)}
                />
            </div>

            <ImageUploadSheet
                key={activity.id + isSheetOpen}
                imgs={activity.image ? activity.image.map((img) => { return { src: img.src || img, type: 'blob' } }) : activity.image}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={handleSaveImage}
                maxFileCount={3}
            />
        </div>
    );
}

export default GuideEditActivityCard;
