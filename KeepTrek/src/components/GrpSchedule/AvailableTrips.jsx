import { useEffect, useRef, useState } from "react"; 
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import {
  getSuggestedPeriods,
  fetchTripDetails,
  getRangeAvailabilityUsernames,
  updateTripPeriod,
  getSelectedPeriod,
} from "@/APIs/dateFinder";
import { toast } from "sonner";

const AvailabilityIcon = ({ tripID, period, totalPeople }) => {
  const [usernames, setUsernames] = useState(null);
  const [loading, setLoading] = useState(true); // Start in loading state
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef(null);

  // Preload usernames when the component mounts
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
    setIsOpen((prev) => !prev); // Toggle popup visibility
  };

  const getAvailabilityColor = (peopleCount) => {
    const percentage = (peopleCount / totalPeople) * 100;
    if (percentage >= 80) {
      return "text-green-500";
    } else if (percentage <= 50) {
      return "text-red-500";
    } else {
      return "text-[#C1A00E]";
    }
  };

  // Close popup if clicking outside of it
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
            <span className="text-sm text-gray-500">Loading...</span>
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

const PeriodCard = ({
  tripID,
  period,
  totalPeople,
  selectedPeriod,
  onSelect,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isSelected =
    selectedPeriod.start_date === period.start_date &&
    selectedPeriod.end_date === period.end_date;

  const handleSelect = async () => {
    if (isSelected) {
      return;
    }

    setIsUpdating(true);
    try {
      const newPeriod = {
        startDate: period.start_date,
        endDate: period.end_date,
      };

      const result = await updateTripPeriod(tripID, newPeriod);

      onSelect({ start_date: period.start_date, end_date: period.end_date });

      toast.success("Trip period updated successfully!");
      console.log("Updated Trip:", result);
    } catch (error) {
      console.error("Error updating trip period:", error.message);
      toast.error("Failed to update trip period.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-4 flex items-center">
      <div>
        <div className="font-medium">
          {new Date(period.start_date).toLocaleDateString("en-GB")} -{" "}
          {new Date(period.end_date).toLocaleDateString("en-GB")}
        </div>
        <AvailabilityIcon
          tripID={tripID}
          period={period}
          totalPeople={totalPeople}
        />
      </div>
      <button
        onClick={handleSelect}
        className={`ml-auto px-4 py-2 border rounded text-white hover:opacity-80 ${
          isSelected || isUpdating
            ? "bg-[#22544f] cursor-not-allowed"
            : "bg-[#4DB6AC]"
        }`}
        disabled={isSelected || isUpdating}
      >
        {isUpdating ? "Updating..." : isSelected ? "Selected" : "Select"}
      </button>
    </Card>
  );
};

const AvailableTrips = ({ tripID }) => {
  const [suggestedPeriods, setSuggestedPeriods] = useState(null);
  const [totalPeople, setTotalPeople] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState({
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripData = await fetchTripDetails(tripID);
        setTotalPeople(tripData.users.length);

        const periodsData = await getSuggestedPeriods(tripID);
        setSuggestedPeriods(periodsData);

        const currentPeriod = await getSelectedPeriod(tripID);

        const matchingPeriod = periodsData.other_five_seven_day_periods
          .concat(
            periodsData.most_people_period,
            periodsData.longest_period_min_2_people
          )
          .find(
            (period) =>
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tripID]);

  if (!suggestedPeriods) return <div>Loading suggested periods...</div>;

  const {
    most_people_period,
    longest_period_min_2_people,
    other_five_seven_day_periods,
  } = suggestedPeriods;

  return (
    <div className="space-y-4 mt-8 max-w-md mx-auto">

  {most_people_period && (
    <div className="mb-4">
      <h4 className="text-lg font-semibold mb-2">
        5-7 day with most people available
      </h4>
      <PeriodCard
        tripID={tripID}
        period={most_people_period}
        totalPeople={totalPeople}
        selectedPeriod={selectedPeriod}
        onSelect={setSelectedPeriod}
      />
    </div>
  )}

  {longest_period_min_2_people && (
    <div className="mb-4">
      <h4 className="text-lg font-semibold mb-2">
        Longest period with at least 2 people <br />available
      </h4>
      <PeriodCard
        tripID={tripID}
        period={longest_period_min_2_people}
        totalPeople={totalPeople}
        selectedPeriod={selectedPeriod}
        onSelect={setSelectedPeriod}
      />
    </div>
  )}

  {other_five_seven_day_periods &&
    other_five_seven_day_periods.length > 0 && (
      <div>
        <h4 className="text-lg font-semibold mb-2">Other Five to Seven Day Periods</h4>
        {other_five_seven_day_periods.map((period, index) => (
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

  );
};

export default AvailableTrips;
