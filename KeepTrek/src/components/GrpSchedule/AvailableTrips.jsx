// AvailableTrips.jsx
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import Calendar from "@/components/GrpSchedule/Calendar";
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

  const handleEditToggle = () => {
    if (!isEditing) {
      // Initialize editedDates when entering edit mode.
      setEditedDates(initializeEditedDates());
    }
    setIsEditing(!isEditing);
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

  const handleSelect = async () => {
    // If in edit mode and range is invalid, do nothing.
    if (isEditing && !validRange) return;
    setIsUpdating(true);
    try {
      let newStartDate = period.start_date;
      let newEndDate = period.end_date;
      if (isEditing && editedDates.size > 0) {
        const datesArray = Array.from(editedDates).sort();
        newStartDate = datesArray[0];
        newEndDate = datesArray[datesArray.length - 1];
      }
      const newPeriod = {
        startDate: newStartDate,
        endDate: newEndDate,
      };
      const result = await updateTripPeriod(tripID, newPeriod);
      onSelect({ start_date: newStartDate, end_date: newEndDate });
      toast.success("Trip period updated successfully!");
      console.log("Updated Trip:", result);
      if (isEditing) setIsEditing(false);
    } catch (error) {
      console.error("Error updating trip period:", error.message);
      toast.error("Failed to update trip period.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Define the button label text for non-loading states.
  const buttonLabel = !isEditing && isSelected ? "Selected" : "Select";

  // Determine if the select button should be disabled.
  const buttonDisabled = !isEditing
    ? (isSelected || isUpdating)
    : (!validRange || isUpdating);

  // Tooltip message for invalid range (when editing).
  const tooltipMessage = "Please select a continuous date range. A trip cannot skip days.";

  return (
    <div className="mb-8">
      <Card className="p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="font-medium">
            {new Date(period.start_date).toLocaleDateString("en-GB")} -{" "}
            {new Date(period.end_date).toLocaleDateString("en-GB")}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEditToggle}
              className="px-2 py-1 border rounded text-sm bg-[#4DB6AC] text-white"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && !validRange ? (
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={handleSelect}
                    className="px-4 py-2 border rounded text-white bg-[#22544f] cursor-not-allowed"
                    disabled={true}
                  >
                    {isUpdating ? "Updating..." : buttonLabel}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{tooltipMessage}</TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={handleSelect}
                className={`px-4 py-2 border rounded text-white hover:opacity-80 ${
                  (!isEditing && (isSelected || isUpdating))
                    ? "bg-[#22544f] cursor-not-allowed"
                    : "bg-[#4DB6AC]"
                }`}
                disabled={buttonDisabled}
              >
                {isUpdating ? "Updating..." : buttonLabel}
              </button>
            )}
          </div>
        </div>
        <div className="mt-4">
          <AvailabilityIcon
            tripID={tripID}
            period={period}
            totalPeople={totalPeople}
          />
        </div>
      </Card>
      {isEditing && (
        <div className="mt-2">
          <Calendar
            currentDate={editCurrentDate}
            setCurrentDate={setEditCurrentDate}
            selectedDates={editedDates}
            setSelectedDates={setEditedDates}
            readOnly={false}
            showControls={false}
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
          <h4 className="text-lg font-semibold mb-2">
            Best Option
            </h4>
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
          <h4 className="text-lg font-semibold mb-2">
            Longest Overlapping Availability
          </h4>
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
            <h4 className="text-lg font-semibold mb-2">
              Alternative Options
            </h4>
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
