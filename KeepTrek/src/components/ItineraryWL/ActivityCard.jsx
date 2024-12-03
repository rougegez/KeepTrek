import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Pencil, Trash } from 'lucide-react';
import { Reorder } from "framer-motion";
import { formatTime } from '../../utils/timeFormat.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Button } from '../ui/button.jsx';

const ActivityCard = ({ activity, onNoteChange, onEditClick, onDeleteClick }) => {
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

        {/* Card */}
      </div>
      <Card className="bg-white rounded-xl shadow-sm w-full max-w-4xl">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-grow space-y-2">

              {/* Title */}
              <h3 className="text-lg font-semibold">{activity.title}</h3>

              {/* Address */}
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
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

            {/* Image */}
            <div className="flex-none">
              <img
                src={activity.image}
                alt=""
                className="w-48 h-28 rounded-lg object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="absolute -right-12 top-10 flex flex-col gap-4">
        {/* Edit Button */}
        <Button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition-colors"
          size="icon"
          onClick={onEditClick}>
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </Button>
        {/* Delete Button */}
        <Button
          className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
          size="icon"
          onClick={onDeleteClick}>
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Reorder.Item>
  );
};

export default ActivityCard;

