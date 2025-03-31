// AvailableTrips.jsx
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import AutoFillCalendar from "@/components/GrpSchedule/AutoFillCalendar"; // Updated import!
import {
  getSuggestedPeriods,
  fetchTripDetails,
  getRangeAvailabilityUsernames,
  updateTripPeriod,
  getSelectedPeriod,
} from "@/APIs/dateFinder";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AvailabilityIcon = ({ tripID, period, totalPeople }) => {
  const [usernames, setUsernames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const fetchedUsernames = await getRangeAvailabilityUsernames(
          tripID,
          period.start_date,
          period.end_date
        );
        setUsernames(fetchedUsernames);
      } catch (error) {
        console.error("Error fetching usernames:", error);
        setUsernames(["Error loading usernames"]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsernames();
  }, [tripID, period.start_date, period.end_date]);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const getAvailabilityColor = (peopleCount) => {
    const percentage = (peopleCount / totalPeople) * 100;
    if (percentage >= 80) return "text-green-500";
    else if (percentage <= 50) return "text-red-500";
    else return "text-[#C1A00E]";
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="relative flex flex-col items-start">
      <button
        onClick={handleClick}
        className={`flex items-center text-sm font-medium space-x-2 underline focus:outline-none ${getAvailabilityColor(
          period.people_count
        )}`}
      >
        <Users className="w-4 h-4" />
        <span>
          {period.people_count}/{totalPeople} Available
        </span>
      </button>
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-full mt-2 bg-white shadow-lg p-3 rounded-md w-56 z-10 border border-gray-200"
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <ul>
              {usernames?.map((username, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {username}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const PeriodCard = ({ tripID, period, totalPeople, selectedPeriod, onSelect }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  // Determine if this period is selected.
  const isSelected =
    selectedPeriod.start_date === period.start_date &&
    selectedPeriod.end_date === period.end_date;

  // Edit mode states.
  const [isEditing, setIsEditing] = useState(false);
  const [editedDates, setEditedDates] = useState(new Set());
  const [editCurrentDate, setEditCurrentDate] = useState(new Date(period.start_date));

  // Helper: initialize editedDates to include every day from period.start_date to period.end_date.
  const initializeEditedDates = () => {
    const start = new Date(period.start_date);
    const end = new Date(period.end_date);
    const dateSet = new Set();
    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      dateSet.add(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }
    return dateSet;
  };

  // Check if the selected (edited) dates form a continuous range.
  const isContinuous = () => {
    if (!isEditing) return true;
    if (editedDates.size <= 1) return true;
    const sortedDates = Array.from(editedDates).sort();
    const firstDate = new Date(sortedDates[0]);
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    const diffDays = Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
    return diffDays === editedDates.size;
  };

  const validRange = isContinuous();

  // Auto-fill the date range when exactly two dates are selected.
  useEffect(() => {
    if (isEditing && editedDates.size === 2) {
      const datesArray = Array.from(editedDates).sort();
      const startDate = new Date(datesArray[0]);
      const endDate = new Date(datesArray[1]);
      const newDateSet = new Set();
      const current = new Date(startDate);
      while (current <= endDate) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, "0");
        const day = String(current.getDate()).padStart(2, "0");
        newDateSet.add(`${year}-${month}-${day}`);
        current.setDate(current.getDate() + 1);
      }
      if (newDateSet.size !== editedDates.size) {
        setEditedDates(newDateSet);
      }
    }
  }, [editedDates, isEditing]);

  // Compute the display range dynamically.
  const getDisplayRange = () => {
    if (isEditing && editedDates.size > 0) {
      const sortedDates = Array.from(editedDates).sort();
      return { start: sortedDates[0], end: sortedDates[sortedDates.length - 1] };
    }
    return { start: period.start_date, end: period.end_date };
  };

  const { start: displayStart, end: displayEnd } = getDisplayRange();

  // Merged handleSelect: if not editing, enter edit mode; if editing, confirm update.
  const handleSelect = async () => {
    if (!isEditing) {
      // Enter edit mode and initialize dates.
      setEditedDates(initializeEditedDates());
      setIsEditing(true);
      return;
    }
    // When in editing mode, if range is valid, submit update.
    if (isEditing && validRange) {
      setIsUpdating(true);
      try {
        const datesArray = Array.from(editedDates).sort();
        const newStartDate = datesArray[0];
        const newEndDate = datesArray[datesArray.length - 1];
        const newPeriod = {
          startDate: newStartDate,
          endDate: newEndDate,
        };
        const result = await updateTripPeriod(tripID, newPeriod);
        onSelect({ start_date: newStartDate, end_date: newEndDate });
        toast.success("Trip period updated successfully!");
        console.log("Updated Trip:", result);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating trip period:", error.message);
        toast.error("Failed to update trip period.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Helper function to calculate duration in Days and Nights.
  const getDurationText = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const nights = days - 1;
    return `${days} ${days > 1 ? "Days" : "Day"} ${nights} ${nights !== 1 ? "Nights" : "Night"}`;
  };

  // Render buttons based on editing state.
  const renderButtons = () => {
    if (!isEditing) {
      return (
        <button
          onClick={handleSelect}
          className={`px-4 py-2 border rounded text-white hover:opacity-80 ${
            isUpdating
              ? "bg-[#22544f] cursor-not-allowed"
              : (isSelected ? "bg-[#22544f]" : "bg-[#4DB6AC]")
          }`}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : (isSelected ? "Selected" : "Select")}
        </button>
      );
    } else {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border rounded text-white hover:opacity-80 bg-[#4DB6AC]"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            className={`px-4 py-2 border rounded text-white hover:opacity-80 ${
              isUpdating || !validRange
                ? "bg-[#22544f] cursor-not-allowed"
                : "bg-[#4DB6AC]"
            }`}
            disabled={isUpdating || !validRange}
          >
            {isUpdating ? "Updating..." : "Confirm"}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="mb-8">
      <Card className="p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            {new Date(displayStart).toLocaleDateString("en-GB")} -{" "}
            {new Date(displayEnd).toLocaleDateString("en-GB")}
          </div>
          {renderButtons()}
        </div>
        <div className="mt-2 text-sm text-black">
          {getDurationText(displayStart, displayEnd)}
        </div>
        <div className="mt-4">
          {/* Hide availability if the selected range does not match the original period */}
          {displayStart === period.start_date && displayEnd === period.end_date && (
            <AvailabilityIcon tripID={tripID} period={period} totalPeople={totalPeople} />
          )}
        </div>
      </Card>
      {isEditing && (
        <div className="mt-2">
          {/* Use the AutoFillCalendar with autofill behavior for AvailableTrips */}
          <AutoFillCalendar
            currentDate={editCurrentDate}
            setCurrentDate={setEditCurrentDate}
            selectedDates={editedDates}
            setSelectedDates={setEditedDates}
          />
        </div>
      )}
    </div>
  );
};

const AvailableTrips = ({ tripID }) => {
  const [suggestedPeriods, setSuggestedPeriods] = useState(null);
  const [totalPeople, setTotalPeople] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState({ start_date: "", end_date: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripData = await fetchTripDetails(tripID);
        setTotalPeople(tripData.users.length);
        const periodsData = await getSuggestedPeriods(tripID);
        setSuggestedPeriods(periodsData);
        const currentPeriod = await getSelectedPeriod(tripID);
        if (currentPeriod) {
          const allPeriods = [
            ...(periodsData.other_five_seven_day_periods || []),
            ...(periodsData.most_people_period ? [periodsData.most_people_period] : []),
            ...(periodsData.longest_period_min_2_people ? [periodsData.longest_period_min_2_people] : []),
          ];
          const matchingPeriod = allPeriods.find(
            (period) =>
              period &&
              period.start_date === currentPeriod.start_date &&
              period.end_date === currentPeriod.end_date
          );
          if (matchingPeriod) {
            setSelectedPeriod({
              start_date: currentPeriod.start_date,
              end_date: currentPeriod.end_date,
            });
          } else {
            setSelectedPeriod({ start_date: "", end_date: "" });
          }
        } else {
          setSelectedPeriod({ start_date: "", end_date: "" });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [tripID]);

  // Check if at least one period card exists.
  const hasPeriodCards =
    suggestedPeriods &&
    (suggestedPeriods.most_people_period ||
      suggestedPeriods.longest_period_min_2_people ||
      (suggestedPeriods.other_five_seven_day_periods &&
        suggestedPeriods.other_five_seven_day_periods.length > 0));

  if (!suggestedPeriods) {
    return (
      <div className="mt-8">
        <LoadingSpinner />
      </div>
    );
  }

  // If no period cards exist, render nothing.
  if (!hasPeriodCards) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto ">
      <h3 className="text-xl font-bold">Available trip dates</h3>    
      <div className="max-w-md mx-auto">
        {suggestedPeriods.most_people_period && (
          <div>
            <PeriodCard
              tripID={tripID}
              period={suggestedPeriods.most_people_period}
              totalPeople={totalPeople}
              selectedPeriod={selectedPeriod}
              onSelect={setSelectedPeriod}
            />
          </div>
        )}

        {suggestedPeriods.longest_period_min_2_people && (
          <div>
            <PeriodCard
              tripID={tripID}
              period={suggestedPeriods.longest_period_min_2_people}
              totalPeople={totalPeople}
              selectedPeriod={selectedPeriod}
              onSelect={setSelectedPeriod}
            />
          </div>
        )}

        {suggestedPeriods.other_five_seven_day_periods &&
          suggestedPeriods.other_five_seven_day_periods.length > 0 && (
            <div>
              {suggestedPeriods.other_five_seven_day_periods.map((period, index) => (
                <PeriodCard
                  key={index}
                  tripID={tripID}
                  period={period}
                  totalPeople={totalPeople}
                  selectedPeriod={selectedPeriod}
                  onSelect={setSelectedPeriod}
                />
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default AvailableTrips;
