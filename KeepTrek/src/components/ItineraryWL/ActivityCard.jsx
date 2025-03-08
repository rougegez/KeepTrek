import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Reorder } from "framer-motion";
import { formatTime } from '../../utils/timeFormat.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Button } from '../ui/button.jsx';
import { useMediaQuery } from 'react-responsive';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActivityCard = ({ activity, onNoteChange, onEditClick, onDeleteClick, onLocationClick }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Reorder.Item key={activity.id} value={activity} className="relative">
      <div className="absolute left-0 -ml-24 top-12 flex flex-col space-y-1 text-sm text-muted-foreground px-10">
        {/* Time */}
        {activity.time && <div className="font-medium">{formatTime(activity.time)}</div>}

        {/* Duration */}
        {activity.duration &&
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {activity.duration} h
          </div>}
          </div>

      <Card className="bg-white rounded-xl shadow-sm w-full">
        <CardContent className="p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
            {/* Image for mobile - moved to top with overlapping menu */}
            {isMobile && (
              <div className="w-full relative">
                <a href={activity.link} target="_blank" rel="noreferrer noopener">
                  <img
                    src={activity.image}
                    alt=""
                    className="w-full h-24 rounded-lg object-cover"
                  />
                </a>
                {/* Menu positioned over the image */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/80 hover:bg-white rounded-full cursor-pointer">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEditClick} className="text-[#439f96]"><Pencil className="w-4 h-4 text-[#439f96]" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDeleteClick} className="text-red-500"><Trash className="w-4 h-4 text-red-500" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}

            <div className="flex-grow space-y-2">
              {/* Title row with menu for desktop */}
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{activity.title}</h3>
                
                {/* Menu for desktop view
                {!isMobile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={onEditClick} className="text-[#439f96]"><Pencil className="w-4 h-4 text-[#439f96]" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={onDeleteClick} className="text-red-500"><Trash className="w-4 h-4 text-red-500" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )} */}
              </div>

              {/* Address */}
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  size="icon"
                  onClick={() => onLocationClick(activity)}
                  {...(activity.coordinates && activity.coordinates.length > 1 ? {} : {disabled: true})}
                >
                  <MapPin className="h-4 w-4" />
                </Button>
                <span>{activity.location}</span>
              </div>

              {/* Notes */}
              <Textarea
                className="w-full min-h-[50px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
                placeholder="Add a note..."
                value={activity.notes}
                onChange={(e) => onNoteChange(activity.id, e.target.value)}
              />
            </div>

            {/* Image for desktop - on the right with overlapping menu */}
            {!isMobile && (
              <div className="flex-none relative">
                <a href={activity.link} target="_blank" rel="noreferrer noopener">
                  <img
                    src={activity.image}
                    alt=""
                    className="w-52 h-32 rounded-lg object-cover"
                  />
                </a>
                {/* Menu positioned over the image */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/80 hover:bg-white rounded-full cursor-pointer">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onEditClick} className="text-[#439f96]"><Pencil className="w-4 h-4 text-[#439f96]" />Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDeleteClick} className="text-red-500"><Trash className="w-4 h-4 text-red-500" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Reorder.Item>
  );
};

export default ActivityCard;