import { useState, useEffect , useCallback} from 'react';
import useWebSocket from 'react-use-websocket';
import { create } from 'zustand';

export const useItineraryStore = create((set, get) => ({
    tripID: '',
    days: [],
    // setTripID
    setTripID: (newTripID) => set({tripID : newTripID }),
    // setDays
    setDays: (newDays) => set({ days: newDays }),
    // retrieve slice by key (using date as the key)
    getDayByDate: (date) => get().days.find((d) => d.date === date),
    // update slice by key (using date as the key)
    updateDayByDate: (date, updatedDay) =>
        set((state) => {
            const updatedDays = state.days.map((day) =>
                day.date === date ? updatedDay : day
            );
            return { days: updatedDays };
        }),
}));

export const useItinerary = () => {

    const tripID = useItineraryStore((state) => state.tripID);
    const days = useItineraryStore((state) => state.days);
    const setDays = useItineraryStore((state) => state.setDays);
    const setTripID = useItineraryStore((state) => state.setTripID);

    const { sendJsonMessage, lastJsonMessage , readyState} = useWebSocket(
        `ws://127.0.0.1:8000/itinerary/ws/${tripID}`,
        {
        shouldReconnect: () => true,
        share: true,
        }
    );

    useEffect(() => {
        if (lastJsonMessage != null) {
            setDays(lastJsonMessage.days);
        }
    }, [lastJsonMessage]);

    return { setTripID, days, setDays, sendJsonMessage, lastJsonMessage}
}
