// src/components/ShareTrips/ShareModal.jsx
import React, { useState, lazy, Suspense } from "react";
import { MapPin, Calendar, Clock, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// lazy‐load the nested modal
const ShareModal2 = lazy(() => import("./ShareModal2"));

export default function ShareModal({
  tripName = "Penang Trip w/ the Boys",
  location = "Penang, Malaysia",
  startDate = "23/12/2024",
  endDate = "25/12/2024",
  days = 3,
  participants = 10,
  onClose,
}) {
  const [showNested, setShowNested] = useState(false);

  const handleShare = () => {
    // open the nested modal (will suspend on first render)
    setShowNested(true);
  };

  return (
    <>
      {/* BACKDROP + MAIN MODAL */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">
              Share your experience to the World!
            </h2>
            <p className="text-sm text-gray-600">
              You have recently completed "{tripName}" at {startDate}.
            </p>
            <p className="text-sm text-gray-600">
              Had a great time? Why not share your experience and inspire others!
            </p>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x150"
              alt={tripName}
              className="w-full h-[150px] object-cover"
            />
            <div className="p-3 space-y-2">
              <h3 className="font-semibold">{tripName}</h3>
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {startDate} - {endDate}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{days} days</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{participants}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-28 bg-gray-100 hover:bg-gray-200 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleShare}
              className="w-28 flex items-center justify-center bg-teal-500 hover:bg-teal-600"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </Card>
      </div>

      {/* NESTED MODAL (lazy‐loaded) */}
      {showNested && (
        <Suspense
          fallback={
            // full‐screen spinner until ShareModal2 loads/renders
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <LoadingSpinner className="h-8 w-8 text-white" />
            </div>
          }
        >
          <ShareModal2 onClose={() => setShowNested(false)} />
        </Suspense>
      )}
    </>
  );
}
