import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Pencil, X } from 'lucide-react';
import { Reorder } from "framer-motion";
import { formatTime } from '../../utils/timeFormat.jsx';

const ActivityCard = ({ activity, onNoteChange, onEditClick, onDeleteClick }) => {
  return (
    <Reorder.Item key={activity.id} value={activity} className="relative">
      <div className="absolute left-0 -ml-24 top-12 flex flex-col space-y-1 text-sm text-muted-foreground px-10">
        <div className="font-medium">{formatTime(activity.time)}</div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {activity.duration}
        </div>
      </div>
      <Card className="bg-white rounded-xl shadow-sm w-full max-w-4xl">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-grow space-y-2">
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <div className="flex items-start gap-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{activity.location}</span>
              </div>
              <textarea
                className="w-full min-h-[50px] p-2 text-sm bg-muted/50 rounded-lg border-0 resize-none placeholder:text-muted-foreground/50"
                placeholder="Add a note..."
                value={activity.notes}
                onChange={(e) => onNoteChange(activity.id, e.target.value)}
              />
            </div>
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
      <div className="absolute -right-10 top-10 flex flex-col gap-4">
        <button
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-300 transition-colors"
          onClick={onEditClick}>
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
          onClick={onDeleteClick}>
          <X className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </Reorder.Item>
  );
};

export default ActivityCard;

