import React from "react";
import { Clock, MapPin, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CarouselView from "@/components/Blog/Carousel/CarouselView";
import CarouselDialog from "@/components/Guides/components/CarouselDialog";
import { formatTime } from "@/utils/timeFormat.jsx";
import styles from "@/components/Blog/Blog.module.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "react-responsive";

function GuideViewActivityCard({ activity, position, selected, onClick, tripsWithDays, selectedTrip, setSelectedTrip, selectedTripDays, setSelectedTripDays }) {

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    return (
        <>
            <div
                className={`group flex ${isMobile ? 'flex-col' : 'items-start'} min-h-48 space-x-4 p-4 rounded-xl transition-all hover:bg-gray-50 border border-transparent hover:border-gray-200 relative ${selected ? "bg-teal-50 ring-2 ring-teal-200 border-teal-200" : ""}`}
            >
                {/* Activity Number Badge */}
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 group-hover:text-teal-600 transition-colors">
                        {position}
                    </div>
                </div>

                {/* Responsive Content */}
                {isMobile ? (
                  <div className="flex flex-col w-full">
                    {/* Image at top, full width, short height */}
                    <div className="w-full mb-2">
                      <CarouselView
                        classNames={{
                          carousel: "w-full h-32 max-w-full max-h-32",
                          item: "basis-full",
                          image: "w-full h-32 max-w-full max-h-32 rounded-lg shadow-sm object-cover",
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
                    {/* Title and content below image */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 leading-tight text-base">{activity.title}</h3>
                        {(activity.time || activity.duration) && (
                          <div className="flex-shrink-0 ml-2">
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
                        className={`${styles.tiptap} text-sm text-gray-600 mb-1`}
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
                  </div>
                ) : (
                  <div className="flex-1 flex flex-row items-center min-w-0 space-x-2">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 leading-tight">{activity.title}</h3>
                        {/* Time & Duration - Only show if available */}
                        {(activity.time || activity.duration) && (
                          <div className="flex-shrink-0 ml-2">
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
                        className={`${styles.tiptap} text-sm text-gray-600 mb-1`}
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
                          carousel: "w-56 h-36 max-w-56 max-h-36",
                          item: "basis-full",
                          image: "w-56 h-36 max-w-56 max-h-36 rounded-lg shadow-sm",
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
                )}

                {/* Meatball Menu absolutely at top right */}
                <div className="absolute top-2 right-2 z-10">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none flex items-center justify-center" style={{ minWidth: 32, minHeight: 32 }}>
                          {/* Horizontal three-dot icon */}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#888', display: 'inline-block' }} />
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#888', display: 'inline-block' }} />
                            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#888', display: 'inline-block' }} />
                          </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Add to your trip</DropdownMenuLabel>
                      {tripsWithDays && tripsWithDays.length > 0 ? (
                        tripsWithDays.map((trip) => (
                          <DropdownMenuSub key={trip.tripID}>
                            <DropdownMenuSubTrigger
                              onClick={() => {
                                setSelectedTrip(trip);
                                setSelectedTripDays(trip.days);
                              }}
                            >
                              {trip.tripName}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {trip.days && trip.days.length > 0 ? (
                                trip.days.map((day) => (
                                  <DropdownMenuItem key={day.day_number}>
                                    {day.date}
                                  </DropdownMenuItem>
                                ))
                              ) : (
                                <DropdownMenuItem disabled>No days</DropdownMenuItem>
                              )}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No trips found</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
