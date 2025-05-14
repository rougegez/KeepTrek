import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useQuery } from 'react-query';
import { getShortToken } from '@/APIs/auth';
import { useParams, Outlet } from 'react-router-dom';
import { useIdleTimer } from 'react-idle-timer';
import { useItineraryStore } from '@/hooks/useItinerary'; // Ensure the store export is available
import { toast } from 'sonner';

export default function ItinerarySocketWrapper() {
    const { tripID } = useParams();
    const [shouldWebSocketConnect, setShouldWebSocketConnect] = useState(false);

    const { data: token, refetch, isStale } = useQuery(
        ['itineraryShortToken'],
        () => getShortToken('itinerary'),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                if (data) {
                    setShouldWebSocketConnect(true);
                } else {
                    setShouldWebSocketConnect(false);
                }
            },

        }
    );

    const { } = useIdleTimer({
        onActive: () => {
            setShouldWebSocketConnect(true);
        },
        onIdle: () => {
            setShouldWebSocketConnect(false);
        },
        timeout: 1000 * 60 * 10, // 10 minutes
    });

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        // `ws://localhost:8000/itinerary/ws/${tripID}?token=${token}`,
        `wss://keeptrek-backend.onrender.com/itinerary/ws/${tripID}?token=${token}`,
        {
            shouldReconnect: (closeEvent) => {
                if (closeEvent.code === 1000) {
                    return false;
                }
                return true;
            },
            onError: (event) => {
                if (isStale || token === '') {
                    refetch();
                }
            },
            reconnectAttempts: 5,
            reconnectInterval: (attemptNumber) => {
                const interval = Math.min(Math.pow(3, attemptNumber) * 1000, 30000);
                toast.error(`Itinerary reconnecting in ${interval / 1000} seconds...`, { duration: interval });
                return interval;
            },
            onReconnectStop: () => {
                toast.error('Connection failed.', {
                    action: {
                        label: 'Retry',
                        onClick: () => {
                            refetch();
                        },
                    },
                    duration : Infinity
                });
            },
        },
        shouldWebSocketConnect
    );

    useEffect(() => {
        if (lastJsonMessage?.days) {
            useItineraryStore.setState({ days: lastJsonMessage.days });
        }
    }, [lastJsonMessage]);

    // Store websocket values in Zustand for other components to use
    useEffect(() => {
        useItineraryStore.setState({ sendJsonMessage, readyState });
    }, [sendJsonMessage, readyState]);

    return <Outlet />;
}