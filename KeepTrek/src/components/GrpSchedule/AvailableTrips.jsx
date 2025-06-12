// AvailableTrips.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, useQueries } from "react-query";
import { Card } from "@/components/ui/card";
import { Users, Info } from "lucide-react";
import AutoFillCalendar from "@/components/GrpSchedule/AutoFillCalendar";
import {
  getSuggestedPeriods,
  fetchTripDetails,
  getRangeAvailabilityUsernames,
  updateTripPeriod,
  getSelectedPeriod,
} from "@/APIs/dateFinder";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AvailabilityIcon = ({ period, totalPeople, usernames, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

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

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <LoadingSpinner />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  const peopleCount = usernames?.length ?? 0;

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  const getAvailabilityColor = (peopleCount) => {
    if (totalPeople === 0) return "text-gray-500";
    const percentage = (peopleCount / totalPeople) * 100;
    if (percentage >= 80) return "text-green-500";
    if (percentage <= 50) return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="relative flex flex-col items-start">
      <button
        onClick={handleClick}
        className={`flex items-center text-sm font-medium space-x-2 underline focus:outline-none ${getAvailabilityColor(
          peopleCount
        )}`}
      >
        <Users className="w-4 h-4" />
        <span>
          {peopleCount}/{totalPeople} Available
        </span>
      </button>
      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-full mt-2 bg-white shadow-lg p-3 rounded-md w-56 z-10 border border-gray-200"
        >
          <ul>
            {usernames?.map((username, index) => (
              <li key={index} className="text-sm text-gray-700">
                {username}
              </li>
            )) ?? <li>No one is available.</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

const PeriodCard = ({
  tripID,
  period,
  totalPeople,
  selectedPeriod,
  onSelect,
}) => {
  const queryClient = useQueryClient();
  const isSelected =
    selectedPeriod?.start_date === period.start_date &&
    selectedPeriod?.end_date === period.end_date;

  // Edit mode states.
  const [isEditing, setIsEditing] = useState(false);
  const [editedDates, setEditedDates] = useState(new Set());
  const [editCurrentDate, setEditCurrentDate] = useState(
    new Date(period.start_date)
  );

  const { mutate: updatePeriod, isLoading: isUpdating } = useMutation(
    ({ newPeriod, shouldCloseEditor }) => updateTripPeriod(tripID, newPeriod),
    {
      onSuccess: (data, { newPeriod, shouldCloseEditor }) => {
        toast.success("Trip period updated successfully!");
        onSelect({
          start_date: newPeriod.startDate,
          end_date: newPeriod.endDate,
        });
        if (shouldCloseEditor) {
          setIsEditing(false);
        }
        queryClient.invalidateQueries(["selectedPeriod", tripID]);
        queryClient.invalidateQueries(["suggestedPeriods", tripID]);
      },
      onError: (error) => {
        console.error("Error updating trip period:", error.message);
        toast.error("Failed to update trip period.", {
          description: <p>{error.message}</p>,
        });
      },
    }
  );

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
    const diffDays =
      Math.round((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
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
      return {
        start: sortedDates[0],
        end: sortedDates[sortedDates.length - 1],
      };
    }
    return { start: period.start_date, end: period.end_date };
  };

  const { start: displayStart, end: displayEnd } = getDisplayRange();

  const handleSelect = () => {
    if (isEditing) {
      // "Update" action
      if (validRange) {
        const datesArray = Array.from(editedDates).sort();
        const newStartDate = datesArray[0];
        const newEndDate = datesArray[datesArray.length - 1];
        const newPeriod = {
          startDate: newStartDate,
          endDate: newEndDate,
        };
        updatePeriod({ newPeriod, shouldCloseEditor: true });
      }
    } else {
      // "Select" or "Edit" action
      setIsEditing(true);
      setEditedDates(initializeEditedDates());
    }
  };

  // Helper function to calculate duration in Days and Nights.
  const getDurationText = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    const days = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const nights = days - 1;
    return `${days} ${days > 1 ? "Days" : "Day"} ${nights} ${
      nights !== 1 ? "Nights" : "Night"
    }`;
  };

  const getButtonText = () => {
    if (isEditing) return isUpdating ? "Updating..." : "Update";
    if (isSelected) return "Edit";
    return "Select & Edit";
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
              : isSelected
              ? "bg-[#22544f]"
              : "bg-[#4DB6AC]"
          }`}
          disabled={isUpdating}
        >
          {getButtonText()}
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
            {getButtonText()}
          </button>
        </div>
      );
    }
  };

  return (
    <Card
      className={`p-4 flex justify-between items-center gap-4 ${
        isEditing ? "flex-col" : "flex-col sm:flex-row"
      }`}
    >
      <div className="flex-grow">
        <h4 className="font-semibold text-lg">
          {new Date(displayStart).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}{" "}
          -{" "}
          {new Date(displayEnd).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h4>
        <p className="text-sm text-gray-600">
          {getDurationText(displayStart, displayEnd)}
        </p>
        <div className="mt-2">
          <AvailabilityIcon
            tripID={tripID}
            period={period}
            totalPeople={totalPeople}
            usernames={period.usernames}
            isLoading={period.isLoading}
          />
        </div>
      </div>
      <div className="flex-shrink-0">{renderButtons()}</div>
      {isEditing && (
        <div className="w-full sm:w-auto mt-4 sm:mt-0">
          <AutoFillCalendar
            currentDate={editCurrentDate}
            setCurrentDate={setEditCurrentDate}
            selectedDates={editedDates}
            setSelectedDates={setEditedDates}
          />
        </div>
      )}
    </Card>
  );
};

const getDuration = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const AvailableTrips = ({
  tripID,
  durationFilter,
  setDurationFilter,
  isParentLoading,
}) => {
  const { data: periodsData, isLoading: isLoadingPeriods } = useQuery(
    ["suggestedPeriods", tripID, durationFilter],
    () => getSuggestedPeriods(tripID, durationFilter),
    {
      enabled: !isParentLoading,
    }
  );

  const allPeriods = useMemo(() => {
    return periodsData?.suggested_periods || [];
  }, [periodsData]);

  const { data: tripDetails, isLoading: isLoadingDetails } = useQuery(
    ["tripDetails", tripID],
    () => fetchTripDetails(tripID)
  );

  const { data: selectedPeriod, isLoading: isLoadingSelectedPeriod } = useQuery(
    ["selectedPeriod", tripID],
    () => getSelectedPeriod(tripID),
    {
      initialData: { start_date: null, end_date: null },
    }
  );

  const [localSelectedPeriod, setLocalSelectedPeriod] =
    useState(selectedPeriod);

  useEffect(() => {
    setLocalSelectedPeriod(selectedPeriod);
  }, [selectedPeriod]);

  const availabilityQueries = useQueries(
    allPeriods.map((period) => ({
      queryKey: [
        "rangeAvailabilityUsernames",
        tripID,
        period.start_date,
        period.end_date,
      ],
      queryFn: () =>
        getRangeAvailabilityUsernames(
          tripID,
          period.start_date,
          period.end_date
        ),
      staleTime: 5 * 60 * 1000,
    }))
  );

  const periodsWithAccurateAvailability = useMemo(() => {
    return allPeriods
      .map((period, index) => {
        const queryResult = availabilityQueries[index];
        const usernames = queryResult.data;
        return {
          ...period,
          people_count: usernames?.length ?? 0,
          usernames: usernames,
          isLoading: queryResult.isLoading,
        };
      })
      .filter(
        (p) =>
          !durationFilter ||
          getDuration(p.start_date, p.end_date) === durationFilter
      );
  }, [allPeriods, availabilityQueries, durationFilter]);

  const { bestPeriod, otherPeriods } = useMemo(() => {
    if (periodsWithAccurateAvailability.length === 0) {
      return { bestPeriod: null, otherPeriods: [] };
    }

    // Note: Backend already sorts, but we can re-sort here if needed after re-calculating availability
    const sortedPeriods = [...periodsWithAccurateAvailability].sort((a, b) => {
      if (a.people_count !== b.people_count) {
        return b.people_count - a.people_count;
      }
      return (
        getDuration(b.start_date, b.end_date) -
        getDuration(a.start_date, a.end_date)
      );
    });

    const best = sortedPeriods.find((p) => p.people_count > 0);
    const others = sortedPeriods.filter((p) => p !== best);

    return { bestPeriod: best, otherPeriods: others };
  }, [periodsWithAccurateAvailability]);

  const isLoadingSuggestions = availabilityQueries.some((q) => q.isLoading);
  const totalPeople = tripDetails?.users?.length ?? 0;
  const isLoading = isParentLoading || isLoadingPeriods || isLoadingDetails;

  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center">
        <h3 className="text-xl font-bold text-center mb-4">
          Available trip dates
        </h3>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-center mb-4">
        Available trip dates
      </h3>
      <div className="flex justify-center items-center space-x-2 mb-4">
        <span className="text-sm font-medium">Filter by duration (days):</span>
        <select
          value={durationFilter || ""}
          onChange={(e) =>
            setDurationFilter(
              e.target.value ? parseInt(e.target.value, 10) : null
            )
          }
          className="px-3 py-1 text-sm rounded-md bg-gray-200 text-gray-700"
        >
          <option value="">All</option>
          {Array.from({ length: 29 }, (_, i) => i + 2).map((days) => (
            <option key={days} value={days}>
              {days}
            </option>
          ))}
        </select>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-500" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Selecting "All" may take some time to load.</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
        <div className="space-y-4">
          {periodsWithAccurateAvailability.length > 0 ? (
            <>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 className="flex items-center text-lg font-semibold mb-2 text-blue-800">
                      <span>Best Suggestion</span>
                      {isLoadingSuggestions && (
                        <div className="ml-2">
                          <LoadingSpinner />
                        </div>
                      )}
                    </h3>
                  </TooltipTrigger>
                  {isLoadingSuggestions && (
                    <TooltipContent>
                      <p>
                        Finding the best suggestion based on availability...
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
                {bestPeriod && (
                  <PeriodCard
                    key={`${bestPeriod.start_date}-${bestPeriod.end_date}`}
                    tripID={tripID}
                    period={bestPeriod}
                    totalPeople={totalPeople}
                    selectedPeriod={localSelectedPeriod}
                    onSelect={setLocalSelectedPeriod}
                  />
                )}
                {!isLoadingSuggestions && !bestPeriod && (
                  <p className="text-gray-500">
                    No suggestions with available people found.
                  </p>
                )}
              </div>

              {otherPeriods.length > 0 && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="flex items-center text-lg font-semibold mb-2 text-gray-800">
                        <span>Other Suggestions</span>
                        {isLoadingSuggestions && (
                          <div className="ml-2">
                            <LoadingSpinner />
                          </div>
                        )}
                      </h3>
                    </TooltipTrigger>
                    {isLoadingSuggestions && (
                      <TooltipContent>
                        <p>Loading availability for other suggestions...</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {otherPeriods.map((period) => (
                      <PeriodCard
                        key={`${period.start_date}-${period.end_date}`}
                        tripID={tripID}
                        period={period}
                        totalPeople={totalPeople}
                        selectedPeriod={localSelectedPeriod}
                        onSelect={setLocalSelectedPeriod}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">
              {durationFilter
                ? `No suggested trips with a duration of ${durationFilter} days. Try a different filter.`
                : "No suggested trip periods available yet. Once your group members add their availability, you'll see suggestions here."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableTrips;
