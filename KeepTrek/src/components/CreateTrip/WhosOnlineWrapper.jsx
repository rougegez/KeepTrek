import { useState, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import useWebSocket, {ReadyState} from "react-use-websocket";
import { useQuery } from "react-query";
import { getShortToken } from "@/APIs/auth";
import { create } from "zustand";

export function WhosOnlineWrapper() {
    const location = useLocation();
    let currentPage = location.pathname.split("/")[1]
    const { tripID } = useParams();
    const [isIdle, setIsIdle] = useState(false);

    const { data : token, refetch, isStale } = useQuery(
        ["whosonlineShortToken"],
        () => getShortToken("whos-online"),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        }
    );

    const setLastJsonMessage = useWhosOnlineStore((state) => state.setLastJsonMessage);

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
        `ws://localhost:8000/trip/whois-online?trip_id=${tripID}&token=${token}`,
        {
            onOpen: () => {
                sendJsonMessage({ "current_page": currentPage, "is_idle": isIdle });
            },
            onMessage: (event) => {
                setLastJsonMessage(JSON.parse(event.data));
            },
            shouldReconnect: (closeEvent) => {
                if (closeEvent.code === 1000) {
                    return false;
                }
                return true;
            },
            share: true,
            onError: (event) => {
                if (isStale || token === "" || token === undefined) {
                    refetch();
                }
            },
            reconnectAttempts: 10,
            reconnectInterval: (attemptNumber) =>
                Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
        },
        !(token == "" || token === undefined)
    );

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({ "current_page": currentPage, "is_idle": isIdle });
        }
    }, [location.pathname]);

    useEffect(() => {
        if (lastJsonMessage) {
            setLastJsonMessage(lastJsonMessage);
        }
    }, [lastJsonMessage]);
    

    const { } = useIdleTimer({
        onIdle: () => {
            setIsIdle(true);
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({ "current_page": currentPage, "is_idle": true });
            }
        },
        onActive: () => {
            setIsIdle(false);
            if (readyState === ReadyState.OPEN) {
                sendJsonMessage({ "current_page": currentPage, "is_idle": false });
            }
        },
        timeout: 10 * 60 * 5, // 10 minutes
    });

    return <Outlet />
}



/**
 * A hook that retrieves the last message from the websocket
 * containing the idle state and current page of users in the trip
 *
 * @returns {Object} returns an array of objects containing
 *                   user_id, current_page and is_idle 
 */
export const useWhosOnline = () => {
    const whosOnline = useWhosOnlineStore((state) => state.lastJsonMessage);
    return { whosOnline : whosOnline};
}

const useWhosOnlineStore = create((set) => ({
    lastJsonMessage: "",
    setLastJsonMessage: (message) => set({ lastJsonMessage: message }),
}));