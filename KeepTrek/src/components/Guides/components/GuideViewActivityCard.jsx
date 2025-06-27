import React from "react";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "@/components/ui/image";

function GuideViewActivityCard({ activity, position, selected, onClick }) {
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
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 leading-tight">{activity.title}</h3>
                    {/* Time & Duration - Only show if available */}
                    {(activity.time || activity.duration) && (
                        <div className="flex-shrink-0 ml-4">
                            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3" />
                                <span>
                                    {activity.time && activity.duration
                                        ? `${activity.time} • ${activity.duration}`
                                        : activity.time || activity.duration}
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
                <Image
                    key={activity.image}
                    src={activity.image}
                    className="w-64 h-40 object-cover rounded-lg shadow-sm"
                />
            </div>
        </div>
    );
}

export default GuideViewActivityCard;
