import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import {
  getSuggestedPeriods,
  fetchTripDetails,
  getRangeAvailabilityEmails,
  updateTripPeriod,
} from "@/APIs/dateFinder";

const AvailabilityIcon = ({ tripID, period, totalPeople }) => {
  const [emails, setEmails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    if (isOpen) {
      setIsOpen(false);
      setEmails(null);
      return;
    }

    setLoading(true);
    setIsOpen(true);

    try {
      const fetchedEmails = await getRangeAvailabilityEmails(
        tripID,
        period.start_date,
        period.end_date
      );
      setEmails(fetchedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      setEmails(["Error loading emails"]);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (peopleCount) => {
    const percentage = (peopleCount / totalPeople) * 100;
    if (percentage >= 80) {
      return "text-green-500"; // Green for 80% and above
    } else if (percentage <= 50) {
      return "text-red-500"; // Red for 50% and below
    } else {
      return "text-[#C1A00E]"; // Gold for anything in between
    }
  };

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
        <div className="absolute top-full mt-2 bg-white shadow-lg p-3 rounded-md w-56 z-10 border border-gray-200">
          {loading ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : (
            <ul>
              {emails?.map((email, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const PeriodCard = ({ tripID, period, totalPeople }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelect = async () => {
    setIsUpdating(true);
    try {
      const newPeriod = {
        startDate: period.start_date,
        endDate: period.end_date,
      };
      const result = await updateTripPeriod(tripID, newPeriod);
      alert("Trip period updated successfully!");
      console.log("Updated Trip:", result);
    } catch (error) {
      console.error("Error updating trip period:", error.message);
      alert("Failed to update trip period.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-4 flex items-center">
      <div>
        <div className="font-medium">
          {new Date(period.start_date).toLocaleDateString()} -{" "}
          {new Date(period.end_date).toLocaleDateString()}
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
          isUpdating ? "bg-gray-400" : "bg-[#4DB6AC]"
        }`}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Select"}
      </button>
    </Card>
  );
};

const AvailableTrips = ({ tripID }) => {
  const [suggestedPeriods, setSuggestedPeriods] = useState(null);
  const [totalPeople, setTotalPeople] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tripData = await fetchTripDetails(tripID);
        setTotalPeople(tripData.users.length);

        const periodsData = await getSuggestedPeriods(tripID);
        setSuggestedPeriods(periodsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tripID]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    const parsedDate = new Date(date);
    return isNaN(parsedDate)
      ? "Invalid Date"
      : parsedDate.toLocaleDateString("en-GB");
  };

  if (!suggestedPeriods) return <div>Loading suggested periods...</div>;

  const {
    most_people_period,
    longest_period_min_2_people,
    other_five_seven_day_periods,
  } = suggestedPeriods;

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-xl font-bold">Recommended Periods</h3>

      {most_people_period && (
        <PeriodCard
          tripID={tripID}
          period={most_people_period}
          totalPeople={totalPeople}
        />
      )}

      {longest_period_min_2_people && (
        <PeriodCard
          tripID={tripID}
          period={longest_period_min_2_people}
          totalPeople={totalPeople}
        />
      )}

      {other_five_seven_day_periods &&
        other_five_seven_day_periods.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold">Five to Seven Day Periods</h4>
            {other_five_seven_day_periods.map((period, index) => (
              <PeriodCard
                key={index}
                tripID={tripID}
                period={period}
                totalPeople={totalPeople}
              />
            ))}
          </div>
        )}
    </div>
  );
};

export default AvailableTrips;
