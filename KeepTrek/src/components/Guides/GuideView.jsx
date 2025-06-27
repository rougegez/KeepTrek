import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Clock, MapPin, Bookmark } from "lucide-react"
import TopNavbar from "../topNavBar/TopNavbar.jsx"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { getGuide } from "@/APIs/guides.js"
import { withSuspense } from "@/utils/withSuspense.jsx"
import MapboxMap from "../MapboxMap/MapboxMapGoogleSearch.jsx"
import { normalizeMarkers } from "../MapboxMap/MapUtil.jsx"
import { getUserProfile } from "@/APIs/users.js"
import GuideViewActivityCard from "./components/GuideViewActivityCard.jsx"
import Image from "@/components/ui/Image.jsx"

function GuideView() {
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

    const [selectedPlace, setSelectedPlace] = useState({random: null, clickLocation: {}})
    const [likeCount, setLikeCount] = useState(30)
    const [isLiked, setIsLiked] = useState(false)
    const [isSaved, setIsSaved] = useState(false)


    const handleLike = () => {
        setIsLiked(!isLiked)
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
    }

    const handleSave = () => {
        setIsSaved(!isSaved)
    }

    const handleActivityLocationClick = (activity) => {
        setSelectedPlace({random: new Date().getTime(), clickLocation: activity})
    }

    return (
        <>
            <TopNavbar />
            <div className="min-h-screen bg-gray-50">


                <div className="max-w-full mx-auto">
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
                                        className={`bg-white/90 backdrop-blur-sm ${isLiked ? "text-red-500" : "text-gray-700"}`}
                                    >
                                        <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                                        {likeCount}
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleSave}
                                        className={`bg-white/90 backdrop-blur-sm ${isSaved ? "text-teal-600" : "text-gray-700"}`}
                                    >
                                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                                    </Button>
                                    <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm text-gray-700">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h1 className="text-4xl font-bold mb-2">{guideData.title}</h1>
                                    <div className="flex items-center space-x-3 text-sm mb-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={creatorData.image}
                                            />
                                            <AvatarFallback>
                                                {creatorData.username}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{creatorData.username}</span>
                                    </div>
                                    <div className="text-sm text-white/80">
                                        {guideData.published ?
                                            <span>Posted on {guideData.date} • {guideData.views} views</span>
                                            :
                                            <span className="text-yellow-400">Created on {guideData.created_at} • {guideData.views} views • Not Published</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Description */}
                                <div 
                                    className="text-gray-700 leading-relaxed mb-6"
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
                                                        selected={selectedPlace?.title === activity.title}
                                                        onClick={() => handleActivityLocationClick(activity)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Map */}
                        <div className="bg-gray-100 min-h-screen sticky top-16">
                            {/* <MapView places={allPlaces} selectedPlace={selectedPlace} onPlaceSelect={setSelectedPlace} /> */}
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
                </div>
            </div>
        </>
    )
}

export default withSuspense(GuideView)
