import React from "react";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CarouselView from "@/components/Blog/Carousel/CarouselView";
import CarouselDialog from "@/components/Guides/components/CarouselDialog";
import { formatTime } from "@/utils/timeFormat.jsx";

function GuideViewActivityCard({ activity, position, selected, onClick }) {

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    return (
        <>
            <div
                className={`group flex items-start min-h-48 space-x-4 p-4 rounded-xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-200 ${selected ? "bg-teal-50 ring-2 ring-teal-200 border-teal-200" : ""}`}
            >
                {/* Activity Number Badge */}
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 group-hover:text-teal-600 transition-colors">
                        {position}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 leading-tight">{activity.title}</h3>
                        {/* Time & Duration - Only show if available */}
                        {(activity.time || activity.duration) && (
                            <div className="flex-shrink-0 ml-4">
                                <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {activity.time && activity.duration
                                            ? `${formatTime(activity.time)} • ${activity.duration} hours`
                                            :  `${activity.duration} hours` || formatTime(activity.time)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="text-sm text-gray-600 mb-2"
                        dangerouslySetInnerHTML={{ __html: activity.description }}
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
                <div className="flex-shrink-0">
                    <CarouselView
                        classNames={{
                            carousel: "w-64 h-40 max-w-64 max-h-40",
                            item: "basis-full",
                            image: "w-64 h-40 max-w-64 max-h-40 rounded-lg shadow-sm",
                            leftArrow: "opacity-65",
                            rightArrow: "opacity-65"
                        }}
                        carouselProps={{
                            plugins: [],
                            opts: {
                                loop: true,
                                align: 'start',
                                watchDrag: activity.image.length > 1
                            }
                        }}
                        images={Array.isArray(activity.image) ? activity.image : [activity.image]}
                        onImageClick={() => setIsDialogOpen(true)}
                    />
                </div>
            </div>

            <CarouselDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                images={Array.isArray(activity.image) ? activity.image : [activity.image]} // Pass the images you want to display
            />
        </>
    );
}

export default GuideViewActivityCard;
