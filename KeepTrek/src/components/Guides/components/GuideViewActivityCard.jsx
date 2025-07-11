import React from "react";
import { Clock, MapPin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getItinerary, updateItinerary } from "@/APIs/itinerary";
import { toast } from "sonner";
import { motion } from "framer-motion";

function GuideViewActivityCard({ activity, position, selected, onClick, tripsWithDays, selectedTrip, setSelectedTrip, selectedTripDays, setSelectedTripDays }) {

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    // Handler to add activity to a trip's day
    const handleAddToTripDay = async (tripID, dayDate) => {
      try {
        // 1. Fetch the itinerary for the trip
        const itinerary = await getItinerary(tripID);
        // 2. Find the correct day
        const days = itinerary.days ? [...itinerary.days] : [];
        const dayIdx = days.findIndex((d) => d.date === dayDate);
        if (dayIdx === -1) {
          toast.error("Day not found in trip");
          return;
        }
        // 3. Prepare the activity object (clone, new id)
        const newActivity = {
          ...activity,
          id: `${Date.now()}`,
        };
        days[dayIdx].activities = Array.isArray(days[dayIdx].activities)
          ? [...days[dayIdx].activities, newActivity]
          : [newActivity];
        // 4. Update the itinerary
        const payload = { days };
        console.log('Calling updateItinerary with:', tripID, payload);
        // await updateItinerary(tripID, payload);
        // toast.success("Activity added to your trip!");
      } catch (err) {
        toast.error("Failed to add activity", { description: err?.message });
      }
    };

    return (
        <>
            <motion.div
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
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full [&_svg]:size-5"
                        >
                            <MoreHorizontal className=" text-gray-500 hover:text-gray-800" />
                        </Button>
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
                                  <DropdownMenuItem key={day.day_number}
                                    onClick={() => handleAddToTripDay(trip.tripID, day.date)}
                                  >
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
            </motion.div>

            <CarouselDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                images={Array.isArray(activity.image) ? activity.image : [activity.image]} // Pass the images you want to display
            />
        </>
    );
}

export default GuideViewActivityCard;
