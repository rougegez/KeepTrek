import { create } from 'zustand';

export const useItinerary = () => {
    const days = useItineraryStore((state) => state.days);
    const setDays = useItineraryStore((state) => state.setDays);
    const getDays = useItineraryStore((state) => state.getDays);
    const getDayAndActivity = useItineraryStore((state) => state.getDayAndActivity);
    const addActivity = useItineraryStore((state) => state.addActivity);
    const updateActivity = useItineraryStore((state) => state.updateActivity);
    const updateDay = useItineraryStore((state) => state.updateDay);
    const changeActivityDay = useItineraryStore((state) => state.changeActivityDay);
    const sendJsonMessage = useItineraryStore((state) => state.sendJsonMessage);
    const readyState = useItineraryStore((state) => state.readyState);


    return {
        days: days,
        getDayAndActivity: getDayAndActivity,
        getDays: getDays,
        addActivity: addActivity,
        setDays: setDays,
        sendJsonMessage: sendJsonMessage,
        updateActivity: updateActivity,
        updateDay: updateDay,
        changeActivityDay: changeActivityDay,
        readyState: readyState
    };
}

export const useItineraryStore = create((set, get) => ({
    days: [],
    setDays: (newDays) => {
        set({ days: newDays });
        const { sendJsonMessage } = get();
        if (sendJsonMessage) {
            sendJsonMessage({days: newDays });
        }
    },
    addActivity: (newActivity, dayDate) => {
        set((state) => {
            const updatedDays = state.days.map((day) => {
                if (day.date === dayDate) {
                    return { ...day, activities: [...day.activities, newActivity] };
                }
                return day;
            });
            get().setDays(updatedDays);
            return { days: updatedDays };
        });
    },
    getDays: () => {
        const { days } = get();
        return days.map((day) => {
            return day.date;
        })
    },
    getDayAndActivity: (activityId) => {
        const foundDay = get().days.find((day) =>
            day.activities.some((a) => a.id === activityId)
        );
        if (!foundDay) return { date: null, day: null, activity: null };
        const activity = foundDay.activities.find((a) => a.id === activityId);
        return { date: foundDay.date, day: foundDay, activity: activity };
    },
    updateActivity: (editedActivity) => {
        set((state) => {
            const updatedDays = state.days.map((day) => {
                const idx = day.activities.findIndex((a) => a.id === editedActivity.id);
                if (idx !== -1) {
                    const newActivities = [...day.activities];
                    newActivities[idx] = editedActivity;
                    return { ...day, activities: newActivities };
                }
                return day;
            });
            get().setDays(updatedDays);
            return { days: updatedDays };
        });
    },
    updateDay: (newDay) => {
        set((state) => {
            const updatedDays = state.days.map((day) =>
                day.date === newDay.date ? newDay : day
            );
            get().setDays(updatedDays);
            return { days: updatedDays };
        });
    },
    changeActivityDay: (activity, newDay, addToStart) => {
        set((state) => {
            const { date: currentDate, activity: foundActivity } = get().getDayAndActivity(
                activity?.id ?? activity
            );
            if (!currentDate || !foundActivity) return state;

            const updatedDays = state.days.map((day) => {
                if (day.date === currentDate) {
                    return { ...day, activities: day.activities.filter((a) => a.id !== foundActivity.id) };
                }
                if (day.date === newDay)
                    return addToStart
                        ? { ...day, activities: [foundActivity, ...day.activities] }
                        : { ...day, activities: [...day.activities, foundActivity] };
                return day;
            });

            get().setDays(updatedDays);
            return { days: updatedDays };
        });
    },
    // Initially empty functions for websocket values; will be updated by ItinerarySocketManager.
    sendJsonMessage: () => { },
    readyState: null,
}));