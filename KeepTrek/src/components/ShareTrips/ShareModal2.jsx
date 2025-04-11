// src/components/ShareTrips/ShareModal2.jsx
import React, { useState } from "react";
import { X, Clock, MapPin, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function ShareModal2({ onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleShare = () => {
    console.log("Shared!");
    // optionally close both modals:
    // handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="bg-white rounded-lg shadow-lg max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Penang Trip w/ the Boys</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* body */}
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="border-2 border-dashed rounded-lg p-8 mb-4 flex flex-col items-center justify-center text-gray-400">
            <div className="bg-gray-200 rounded-full p-2 mb-2">
              <Upload className="w-5 h-5" />
            </div>
            <span>Image</span>
          </div>

          <Textarea
            placeholder="Description..."
            className="w-full mb-6 resize-none text-gray-500"
            rows={3}
          />

          <div className="space-y-4">
            <div className="bg-gray-100 rounded-lg p-3">
              <h3 className="font-semibold mb-2">Day 1</h3>

              {/* item 1 */}
              <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">1:30 PM</span>
                      <h4 className="font-medium">Hameediyah Restaurant</h4>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">
                        164 A, Lebuh Campbell Street, 10100 George Town,
                        Pulau Pinang, Malaysia
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>1h</span>
                    </div>
                    <p className="text-sm">Nasi Kandar</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/80"
                      alt="Hameediyah Restaurant"
                      className="rounded-lg object-cover w-20 h-20"
                    />
                  </div>
                </div>
              </div>

              {/* item 2 */}
              <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">3:00 PM</span>
                      <h4 className="font-medium">Penang War Museum</h4>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">
                        Penang War Museum, Jalan Batu Maung, 11960 Batu Maung,
                        Pulau Pinang, Malaysia
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>1h</span>
                    </div>
                    <p className="text-sm">history of boom boom</p>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/80"
                      alt="Penang War Museum"
                      className="rounded-lg object-cover w-20 h-20"
                    />
                  </div>
                </div>
              </div>

              {/* item 3 */}
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">5:00 PM</span>
                      <h4 className="font-medium">Kek Lok Si Temple</h4>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="line-clamp-1">
                        Kek Lok Si Temple, Air Itam, Penang, Malaysia
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>1h 30m</span>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <img
                      src="https://via.placeholder.com/80"
                      alt="Kek Lok Si Temple"
                      className="rounded-lg object-cover w-20 h-20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="p-4 border-t">
          <Button onClick={handleShare} className="w-full">
            Share
          </Button>
        </div>
      </Card>
    </div>
  );
}
