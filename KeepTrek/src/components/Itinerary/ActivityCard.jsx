import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  MoreHorizontal,
  Pencil,
  Trash,
  GripVertical,
  MapPin,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { Reorder, useDragControls } from "framer-motion";
import { formatTime } from "../../utils/timeFormat.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "../ui/button.jsx";
import { useMediaQuery } from "react-responsive";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import GoogleMapImage from "@/components/MapboxMap/GoogleMapImage.jsx";

import { useItinerary } from "@/hooks/useItinerary.jsx";
import { getDayColor, getMaxDay, MarkerSvg, normalizeMarkers } from "@/components/MapboxMap/MapUtil.jsx";

const ActivityCard = ({
  activity,
  onNoteChange,
  onEditClick,
  onDeleteClick,
  onLocationClick,
  canModify = false,
  largeMode = false,
}) => {
  const {
    days,
    updateDay,
    getDayAndActivity,
    changeActivityDay,
    updateActivity,
  } = useItinerary();
  const { day: currentDay } = getDayAndActivity(activity.id);
  const activityIndex = currentDay.activities.findIndex(
    (a) => a.id === activity.id
  );
  const { maxDay } = getMaxDay(normalizeMarkers(days));
  let color = "#4db6ac"
  color = getDayColor(currentDay.date, maxDay);


  const controls = useDragControls();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const handleCardClick = (e) => {
    // Don't trigger location click if clicking on interactive elements
    if (
      e.target.tagName.toLowerCase() === "textarea" ||
      e.target.tagName.toLowerCase() === "button" ||
      e.target.closest(".dropdown-menu") ||
      !activity.coordinates ||
      activity.coordinates.length <= 1
    ) {
      return;
    }
    onLocationClick(activity);
  };

  const handleUpButtonClick = () => {
    if (activityIndex !== 0) {
      currentDay.activities[activityIndex] =
        currentDay.activities[activityIndex - 1];
      currentDay.activities[activityIndex - 1] = activity;
      updateDay(currentDay);
    }
    if (activityIndex === 0) {
      const newDayDate =
        "Day " + (parseInt(currentDay.date.replace(/[A-z]+/g, "")) - 1);
      changeActivityDay(activity, newDayDate);
    }
  };

  const handleDownButtonClick = () => {
    if (activityIndex !== currentDay.activities.length - 1) {
      currentDay.activities[activityIndex] =
        currentDay.activities[activityIndex + 1];
      currentDay.activities[activityIndex + 1] = activity;
      updateDay(currentDay);
    }
    if (activityIndex === currentDay.activities.length - 1) {
      const newDayDate =
        "Day " + (parseInt(currentDay.date.replace(/[A-z]+/g, "")) + 1);
      changeActivityDay(activity, newDayDate, true);
    }
  };

  const handleNewImage = (newImage) => {
    if (newImage) {
      updateActivity({ ...activity, image: newImage });
    }
  };

  return (
    <Reorder.Item
      key={activity.id}
      dragListener={false}
      dragControls={controls}
      value={activity}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative"
    >
      {/* Time and Duration - Outside both card views*/}
      {isMobile ? (
        // Mobile: Horizontal layout to the left of the card
        <div className="flex items-center space-x-2 mb-1 text-sm text-muted-foreground">
          {/* Time */}
          {activity.time && (
            <div className="font-medium">{formatTime(activity.time)}</div>
          )}

          {/* Duration */}
          {activity.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {activity.duration} h
            </div>
          )}
        </div>
      ) : (
        // Desktop: Vertical layout to the left of the card
        <div
          className={`absolute left-0 -ml-24 top-12 flex flex-col space-y-1 text-sm ${largeMode ? "text-base" : "text-sm"
            } text-muted-foreground pl-10 pr-0`}
        >
          {/* Time */}
          {activity.time && (
            <div className="font-medium">{formatTime(activity.time)}</div>
          )}

          {/* Duration */}
          {activity.duration && (
            <div className="flex items-center gap-1">
              <Clock className={`${largeMode ? "w-5 h-5" : "w-4 h-4"}`} />
              {activity.duration} h
            </div>
          )}
        </div>
      )}

      <Card
        className={`bg-white rounded-xl shadow-sm w-full max-w-4xl ${largeMode ? "p-1" : ""
          } ${isMobile ? 'px-2 mb-2' : ''}`}
      >
        <CardContent className={`py-4 pr-4 pl-0 ${largeMode ? "py-6" : ""}`}>
          <div className="flex w-full gap-x-0 gap-y-4">
            {canModify ? (
              <div
                className={`mx-0 flex items-center ${largeMode ? "w-12" : "w-10"
                  } justify-center ${!isMobile ? `cursor-grab` : null}`}
                onPointerDown={(event) => {
                  if (!isMobile) {
                    controls.start(event);
                    event.preventDefault();
                  }
                }}
              >
                {/* Drag Handle for desktop, buttons for mobile */}
                {!isMobile ? (
                  <GripVertical
                    className={`mx-0 p-0 my-4 ${largeMode ? "w-5 h-5" : "w-4 h-4"
                      } text-gray-400 cursor-grab`}
                    onPointerDown={(event) => {
                      controls.start(event);
                      event.preventDefault();
                    }}
                  />
                ) : (
                  <div className="flex flex-col gap-y-1 w-9">
                    <Button
                      variant="ghost"
                      onClick={handleUpButtonClick}
                      className="h-28"
                      disabled={
                        currentDay.date === "Day 1" && activityIndex === 0
                      }
                    >
                      <ArrowBigUp className="text-[#439f96] w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleDownButtonClick}
                      className="h-28"
                      disabled={
                        days[days.length - 1].date === currentDay.date &&
                        activityIndex === currentDay.activities.length - 1
                      }
                    >
                      <ArrowBigDown className="text-red-500 w-6 h-6" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-4" />
            )}

            <div
              className={`flex flex-grow ${isMobile ? "flex-col" : "flex-row"
                } gap-4`}
              // onClick={handleCardClick}
            >
              {/* Image for mobile - moved to top with overlapping menu */}
              {isMobile && (
                <div
                  className="w-full relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GoogleMapImage
                      placeId={activity?.placeId}
                      src={activity.image}
                      onNewImage={handleNewImage}
                      className="w-full h-28 rounded-lg object-cover shadow"
                    />
                  </a>
                  {/* Menu positioned over the image */}
                  {canModify && (
                    <div className="absolute top-2 right-2 dropdown-menu">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white/80 hover:bg-white rounded-full cursor-pointer"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={onEditClick}
                            className="text-[#439f96] cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-[#439f96]" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={onDeleteClick}
                            className="text-red-500 cursor-pointer"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-grow space-y-2">
                {/* Title row with menu for desktop */}
                <div className="flex items-center justify-start gap-x-2">
                  <MarkerSvg 
                    height={24} 
                    width={16} 
                    color={color}
                    onClick={handleCardClick}
                    whileTap={{ scale: 0.90 }}
                    whileHover={{ scale: 1.1 }}
                    className={`shrink-0 ${activity.coordinates && activity.coordinates.length > 1
                  ? "cursor-pointer hover:bg-gray-50"
                  : ""}`}
                    >
                    <text
                      x="13.5"
                      y="13.5"
                      textAnchor="middle"
                      dominantBaseline="central"
                      style={{ fontSize: '18px', fill: '#ffffff', fontWeight: 'bold' }}
                    >
                      {activityIndex + 1}
                    </text>
                  </MarkerSvg>
                  <h3
                    className={`${largeMode ? "text-xl" : "text-sm md:text-lg"
                      } font-semibold`}
                  >
                    {activity.title}
                  </h3>
                </div>

                {/* Address */}
                <div className="flex items-start gap-1 text-xs md:text-sm text-muted-foreground">
                  <span className={largeMode ? "text-base" : ""}>
                    {activity.location}
                  </span>
                </div>

                {/* Notes */}
                <Textarea
                  className={`w-full min-h-[50px] p-2 ${largeMode ? "text-base min-h-[70px]" : "text-xs md:text-sm"
                    } bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50`}
                  placeholder="Add a note..."
                  value={activity.notes}
                  onChange={(e) => onNoteChange(activity.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  readOnly={!canModify}
                  aria-label="Activity Notes"
                />
              </div>

              {/* Image for desktop - on the right with overlapping menu */}
              {!isMobile && (
                <div
                  className="flex-none relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={activity.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GoogleMapImage
                      placeId={activity?.placeId}
                      src={activity.image}
                      onNewImage={handleNewImage}
                      className={`${largeMode ? "w-64 h-40" : "w-52 h-32"
                        } rounded-lg object-cover`}
                    />
                  </a>
                  {/* Menu positioned over the image */}
                  {canModify && (
                    <div className="absolute top-2 right-2 dropdown-menu">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white/80 rounded-full cursor-pointer"
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={onEditClick}
                            className="text-[#439f96] cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 text-[#439f96]" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={onDeleteClick}
                            className="text-red-500 cursor-pointer"
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Reorder.Item>
  );
};

export default ActivityCard;
