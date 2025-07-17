import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Clock, MapPin, Bookmark, ChevronDown } from "lucide-react"
import TopNavbar from "../topNavBar/TopNavbar.jsx"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { getGuide, likeGuide, saveGuide } from "@/APIs/guides.js"
import { withSuspense } from "@/utils/withSuspense.jsx"
import MapboxMap from "../MapboxMap/MapboxMapGoogleSearch.jsx"
import { normalizeMarkers } from "../MapboxMap/MapUtil.jsx"
import { getUserProfile } from "@/APIs/users.js"
import GuideViewActivityCard from "./components/GuideViewActivityCard.jsx"
import Image from "@/components/ui/image.jsx"
import { useAuth } from "@/contexts/AuthProvider.jsx"
import { toast } from "sonner"
import styles from "@/components/Blog/Blog.module.css"
import { getMyTripsWithDays } from "@/APIs/guides";
import { useMediaQuery } from "react-responsive";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

function GuideView() {

    const { user , isLoggedIn } = useAuth()
    const { guideID } = useParams()
    const { data: guideData } = useQuery(
        ["guide", guideID], () =>
        getGuide(guideID), {
        refetchOnWindowFocus: false,
        suspense: true
    })

    const { data: creatorData } = useQuery(
        ["userProfile", guideData?.creatorID],
        () => getUserProfile(guideData?.creatorID), {
        refetchOnWindowFocus: false,
        suspense: true
    })

    const { data: userData } = useQuery(
        ["userProfile", user],
        () => getUserProfile(user), {
        enabled: isLoggedIn,
        refetchOnWindowFocus: false,
        suspense: true
    })

    const [selectedPlace, setSelectedPlace] = useState({ random: null, clickLocation: {} })
    const [likeCount, setLikeCount] = useState(guideData.likes)
    const [isLiked, setIsLiked] = useState(userData?.likes.includes(guideID))
    const [isSaved, setIsSaved] = useState(userData?.saved.includes(guideID))
    const [tripsWithDays, setTripsWithDays] = useState([])
    const [selectedTrip, setSelectedTrip] = useState(null)
    const [selectedTripDays, setSelectedTripDays] = useState([])
    const [likePending, setLikePending] = useState(false)
    const [savePending, setSavePending] = useState(false)

    const isMobile = useMediaQuery({ query: "(max-width: 1170px)" });
    const [isMapExpanded, setIsMapExpanded] = useState(true);

    const getMapHeight = () => (isMapExpanded ? "65vh" : "10vh");

    const MapToggleButton = () => (
        <Button
            className="absolute right-4 -bottom-5 z-[100] rounded-full p-2 bg-white border border-gray-200 text-muted-foreground shadow-lg transition-transform"
            onClick={(e) => {
                e.stopPropagation();
                setIsMapExpanded(!isMapExpanded);
            }}
            style={{ width: isMobile ? "44px" : "36px", height: isMobile ? "44px" : "36px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)" }}
            aria-label={isMapExpanded ? "Collapse Map" : "Expand Map"}
            title={isMapExpanded ? "Collapse Map" : "Expand Map"}
        >
            <ChevronDown
                size={isMobile ? 24 : 20}
                className={`transition-transform duration-300 ${isMapExpanded ? "rotate-180" : "rotate-0"}`}
            />
        </Button>
    );


    const handleLike = async () => {
        if (!isLoggedIn) {
            toast.error("You must be logged in to like a guide.");
            return;
        }
        if (likePending) return;
        setLikePending(true);
        const currentLike = isLiked;
        const currentLikeCount = likeCount;
        setIsLiked(!currentLike);
        setLikeCount(currentLike ? currentLikeCount - 1 : currentLikeCount + 1);
        await likeGuide(guideID).catch((error) => {
            toast.error(`Failed to ${!currentLike ? "like" : "unlike"} the guide`, {
                description: error?.message || `An error occurred while ${!currentLike ? "liking" : "unliking"} the guide.`
            });
            setIsLiked(currentLike);
            setLikeCount(currentLikeCount);
        });
        setLikePending(false);
    }

    const handleSave = async () => {
        if (!isLoggedIn) {
            toast.error("You must be logged in to save a guide.");
            return;
        }
        if (savePending) return;
        setSavePending(true);
        const currentSaved = isSaved;
        setIsSaved(!currentSaved);
        await saveGuide(guideID).catch((error) => {
            toast.error(`Failed to ${!currentSaved ? "save" : "unsave"} the guide`, {
                description: error?.message || `An error occurred while ${!currentSaved ? "saving" : "unsaving"} the guide.`
            })
            setIsSaved(currentSaved);
        });
        setSavePending(false);
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href)
        toast.success("Guide link copied to clipboard!");
    }

    const handleActivityLocationClick = (activity) => {
        setSelectedPlace({ random: new Date().getTime(), clickLocation: activity })
    }

    useEffect(() => {
        getMyTripsWithDays()
            .then(data => {
                setTripsWithDays(data);
                console.log("Trips with days:", data);
            })
            .catch(error => {
                console.error("Error fetching trips with days:", error);
            });
    }, []);


    return (
        <>
            <TopNavbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-full mx-auto">
                    {isMobile ? (
                        <>
                            <motion.div
                                className="fixed flex-shrink top-14 w-full z-40 bg-background"
                                initial={{ height: "75vh" }}
                                animate={{ height: getMapHeight(), transition: { duration: 0.2, ease: "easeInOut" } }}
                            >
                                <MapboxMap
                                    height="100%"
                                    width="100%"
                                    itineraryDays={guideData.days}
                                    initCenter={guideData?.coordinates}
                                    initViewport={guideData?.viewport}
                                    handlePanTo={selectedPlace}
                                    disableSaveLocation={true}
                                    disableSearchBar={true}
                                    markers={normalizeMarkers(guideData.days)}
                                />
                                <MapToggleButton />
                            </motion.div>
                            <motion.div
                                className="flex-shrink-0 w-full bg-background relative z-30 overflow-y-auto"
                                animate={{ marginTop: getMapHeight(), transition: { duration: 0.3, ease: "easeInOut" } }}
                            >
                                    <div className="p-4">
                                        {/* Hero Section */}
                                        <div className="relative h-56 overflow-hidden rounded-lg mb-4">
                                            <Image
                                                key={guideData.hero_image}
                                                src={guideData.hero_image}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                            {/* Action Buttons */}
                                            <div className="absolute top-4 right-4 flex items-center space-x-2">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleLike}
                                                    disabled={likePending}
                                                    className={`bg-white/90 backdrop-blur-sm ${isLiked ? "text-red-500" : "text-gray-700"}`}
                                                >
                                                    <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                                                    {likeCount}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={handleSave}
                                                    disabled={savePending}
                                                    className={`bg-white/90 backdrop-blur-sm ${isSaved ? "text-teal-600" : "text-gray-700"}`}
                                                >
                                                    <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={handleShare} 
                                                    className="bg-white/90 backdrop-blur-sm text-gray-700"
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {/* Title Overlay */}
                                            <div className="absolute bottom-4 left-4 text-white">
                                                <h1 className="text-2xl font-bold mb-1">{guideData.title}</h1>
                                                <div className="flex items-center space-x-2 text-xs mb-1">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage src={creatorData.image} />
                                                        <AvatarFallback>{creatorData.username}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{creatorData.username}</span>
                                                </div>
                                                <div className="text-xs text-white/80">
                                                    {guideData.published ? (
                                                        <span>Posted on {guideData.publish_date[guideData.publish_date.length - 1]} • {guideData.views} views</span>
                                                    ) : (
                                                        <span className="text-yellow-400">Created on {guideData.created_at} • {guideData.views} views • Not Published</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* Description */}
                                        <div
                                            className={`${styles.tiptap} text-gray-700 leading-relaxed mb-4`}
                                            dangerouslySetInnerHTML={{ __html: guideData.description }}
                                        />
                                        {/* Days */}
                                        <div className="space-y-6">
                                            {guideData.days.map((day) => (
                                                <div key={day.date} className="mb-2">
                                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{day.date}</h2>
                                                    <div className="space-y-4">
                                                        {day.activities.map((activity, index) => (
                                                            <GuideViewActivityCard
                                                                key={index}
                                                                activity={activity}
                                                                position={index + 1}
                                                                selected={selectedPlace?.clickLocation.title === activity.title}
                                                                onClick={() => handleActivityLocationClick(activity)}
                                                                tripsWithDays={tripsWithDays}
                                                                selectedTrip={selectedTrip}
                                                                setSelectedTrip={setSelectedTrip}
                                                                selectedTripDays={selectedTripDays}
                                                                setSelectedTripDays={setSelectedTripDays}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                            </motion.div>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Left Panel - Itinerary Details */}
                            <div className="bg-white">
                                {/* Hero Section */}
                                <div className="relative h-80 overflow-hidden">
                                    <Image
                                        key={guideData.hero_image}
                                        src={guideData.hero_image}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                                    {/* Action Buttons */}
                                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleLike}
                                            disabled={likePending}
                                            className={`bg-white/90 backdrop-blur-sm ${isLiked ? "text-red-500" : "text-gray-700"}`}
                                        >
                                            <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                                            {likeCount}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={savePending}
                                            className={`bg-white/90 backdrop-blur-sm ${isSaved ? "text-teal-600" : "text-gray-700"}`}
                                        >
                                            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={handleShare} 
                                            className="bg-white/90 backdrop-blur-sm text-gray-700"
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {/* Title Overlay */}
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h1 className="text-4xl font-bold mb-2">{guideData.title}</h1>
                                        <div className="flex items-center space-x-3 text-sm mb-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={creatorData.image} />
                                                <AvatarFallback>{creatorData.username}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{creatorData.username}</span>
                                        </div>
                                        <div className="text-sm text-white/80">
                                            {guideData.published ? (
                                                <span>Posted on {guideData.publish_date[guideData.publish_date.length - 1]} • {guideData.views} views</span>
                                            ) : (
                                                <span className="text-yellow-400">Created on {guideData.created_at} • {guideData.views} views • Not Published</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="p-6">
                                    {/* Description */}
                                    <div
                                        className={`${styles.tiptap} text-gray-700 leading-relaxed mb-6`}
                                        dangerouslySetInnerHTML={{ __html: guideData.description }}
                                    />
                                    {/* Days */}
                                    <div className="space-y-8">
                                        {guideData.days.map((day) => (
                                            <div key={day.date}>
                                                <h2 className="text-2xl font-bold text-gray-900 mb-6">{day.date}</h2>
                                                <div className="space-y-4">
                                                    {day.activities.map((activity, index) => (
                                                        <GuideViewActivityCard
                                                            key={index}
                                                            activity={activity}
                                                            position={index + 1}
                                                            selected={selectedPlace?.clickLocation.title === activity.title}
                                                            onClick={() => handleActivityLocationClick(activity)}
                                                            tripsWithDays={tripsWithDays}
                                                            selectedTrip={selectedTrip}
                                                            setSelectedTrip={setSelectedTrip}       
                                                            selectedTripDays={selectedTripDays}
                                                            setSelectedTripDays={setSelectedTripDays}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {/* Right Panel - Map */}
                            <div className="bg-gray-100 sticky top-16 h-[calc(100vh-4rem)]">
                                <MapboxMap
                                    height="100%"
                                    width="100%"
                                    itineraryDays={guideData.days}
                                    initCenter={guideData?.coordinates}
                                    initViewport={guideData?.viewport}
                                    handlePanTo={selectedPlace}
                                    disableSaveLocation={true}
                                    disableSearchBar={true}
                                    markers={normalizeMarkers(guideData.days)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default withSuspense(GuideView)
