import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { create } from 'zustand';
import { useQuery} from 'react-query';
import { getShortToken } from '@/APIs/auth';
import { useIdleTimer } from 'react-idle-timer';
import { useParams } from 'react-router-dom';

export const useItinerary = () => {

    const token = useItineraryStore((state) => state.token);
    const setToken = useItineraryStore((state) => state.setToken);
    const days = useItineraryStore((state) => state.days);
    const setDays = useItineraryStore((state) => state.setDays);
    const getDayAndActivity = useItineraryStore((state) => state.getDayAndActivity);
    const updateActivity = useItineraryStore((state) => state.updateActivity);
    const updateDay = useItineraryStore((state) => state.updateDay);
    const changeActivityDay = useItineraryStore((state) => state.changeActivityDay);

    const { tripID } = useParams();

    const { } = useIdleTimer({
        onActive: () => {
            refetch();
        },
        timeout: 1000 * 60 * 10, // 10 minutes
    });

    const { refetch, isStale } = useQuery(
        ['itineraryShortToken'],
        () => getShortToken('itinerary'),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            suspense: true,
            onSuccess: (data) => {
                setToken(data)
            },
            refetchOnWindowFocus: false, 
        }
    )

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        `wss://keeptrek-backend.onrender.com/itinerary/ws/${tripID}?token=${token}`,
        // `ws://localhost:8000/itinerary/ws/${tripID}?token=${token}`,
        {
            shouldReconnect: (closeEvent) => {
                console.log(closeEvent);
                if (closeEvent.code === 1000) {
                    return false;
                }
                return true;
            },
            share: true,
            onError: (event) => {
                if (isStale || token === '') {
                    refetch()
                }
            },
            reconnectAttempts: 10,
            reconnectInterval: (attemptNumber) =>
                Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
        },
    );

    // Whenever the WebSocket changes, store it
    useEffect(() => {
        useItineraryStore.setState({ sendJsonMessage });
    }, [sendJsonMessage]);

    // When the server sends new data, update "days"—but do not broadcast back
    useEffect(() => {
        if (lastJsonMessage?.days) {
            // Manually update store but skip the “auto-broadcast” by calling the internal setter
            useItineraryStore.setState({ days: lastJsonMessage.days });
        }
    }, [lastJsonMessage]);


    return {
        days: days,
        getDayAndActivity: getDayAndActivity,
        setDays: setDays,
        sendJsonMessage: sendJsonMessage,
        lastJsonMessage: lastJsonMessage,
        updateActivity: updateActivity,
        updateDay: updateDay,
        changeActivityDay: changeActivityDay,
        readyState: readyState
    };
}

export const useItineraryStore = create((set, get) => ({
    token: '',
    days: [],
    setToken: (newToken) => set({ token: newToken }),
    setDays: (newDays) => {
        set({ days: newDays });
        // Broadcast to the server (avoid loops only if you trust the server not to echo unchanged data)
        const { tripID, sendJsonMessage } = get();
        if (sendJsonMessage) {
            sendJsonMessage({ tripID, days: newDays });
        }
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
                } else {
                    return day;
                }
            });
            get().setDays(updatedDays);
            return { days: updatedDays };
        });
    },
    updateDay: (newDay) => {
        set((state) => {
            const updatedDays = state.days.map((day) => {
                if (day.date === newDay.date) {
                    return newDay
                }
                return day;
            })
            get().setDays(updatedDays);
            return { days: updatedDays };
        })
    },     
    changeActivityDay: (activity, newDay, addToStart) => {
        set((state) => {
            const { date: currentDate, activity: foundActivity } = get().getDayAndActivity(activity?.id ?? activity);
            if (!currentDate || !foundActivity) return state;
            
            while (true) {
                const foundDay = state.days.find((day) => day.date === newDay);
                if (foundDay) {
                    break
                }
                return state;
            }
                
            const updatedDays = state.days.map((day) => {
                if (day.date === currentDate) {
                    return {
                        ...day,
                        activities: day.activities.filter((a) => a.id !== foundActivity.id),
                    };
                }
                if (addToStart && day.date === newDay) {
                    return { ...day, activities: [foundActivity, ...day.activities] };
                }
                if (day.date === newDay) {
                    return { ...day, activities: [...day.activities, foundActivity] };
                }
                return day;
            });

            get().setDays(updatedDays);
            return { days: updatedDays };
        });
    },
    sendJsonMessage: () => { },
}));
