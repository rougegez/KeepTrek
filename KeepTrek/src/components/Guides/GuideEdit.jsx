import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Heart,
    Share2,
    Clock,
    MapPin,
    Bookmark,
    MoreHorizontal,
    Pencil,
    Trash,
    ImageIcon,
    Save,
    Share
} from "lucide-react"
import TopNavbar from "../topNavBar/TopNavbar.jsx"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { getGuide } from "@/APIs/guides.js"
import { withSuspense } from "@/utils/withSuspense.jsx"
import MapboxMap from "../MapboxMap/MapboxMapGoogleSearch.jsx"
import { normalizeMarkers } from "../MapboxMap/MapUtil.jsx"
import { getUserProfile } from "@/APIs/users.js"
import Image from "../ui/image.jsx"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import ImageUploadSheet from "./components/ImageUploadSheet.jsx"

function GuideEdit({ }) {
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

    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState(null)

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
                                    src={guideData.hero_image}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex items-center space-x-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 bg-white/80 rounded-full cursor-pointer"
                                            >
                                                <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() => setIsSheetOpen(true)}
                                            >
                                                <ImageIcon className="w-4 h-4 " />
                                                Change Banner
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem
                                                className="text-green-500 cursor-pointer"
                                            >
                                                <Save className="w-4 h-4 text-green-500" />
                                                Save Draft
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-purple-500 cursor-pointer"
                                            >
                                                <Share className="w-4 h-4 text-purple-500" />
                                                Publish
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator/>
                                            <DropdownMenuItem
                                                className="text-red-500 cursor-pointer"
                                            >
                                                <Trash className="w-4 h-4 text-red-500" />
                                                Discard Draft
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
                                <p className="text-gray-700 leading-relaxed mb-8">{guideData.description}</p>

                                {/* Days */}
                                <div className="space-y-8">
                                    {guideData.days.map((day) => (
                                        <div key={day.date}>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{day.date}</h2>

                                            <div className="space-y-4">
                                                {day.activities.map((activity, index) => (
                                                    <div
                                                        key={index}
                                                        className={`group flex items-start space-x-4 p-4 rounded-xl cursor-pointer transition-all hover:bg-gray-50 border border-transparent hover:border-gray-200 ${selectedPlace?.name === activity.name
                                                            ? "bg-teal-50 ring-2 ring-teal-200 border-teal-200"
                                                            : ""
                                                            }`}
                                                        onClick={() => setSelectedPlace(activity)}
                                                    >
                                                        {/* Activity Number Badge */}
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 bg-gray-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600 group-hover:text-teal-600 transition-colors">
                                                                {index + 1}
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <h3 className="font-semibold text-gray-900 leading-tight">{activity.title}</h3>
                                                                {/* Time & Duration - Only show if available */}
                                                                {(activity.time || activity.duration) && (
                                                                    <div className="flex-shrink-0 ml-4">
                                                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                                                            <Clock className="h-3 w-3" />
                                                                            <span>
                                                                                {activity.time && activity.duration
                                                                                    ? `${activity.time} • ${activity.duration}`
                                                                                    : activity.time || activity.duration}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <p className="text-sm text-gray-600 leading-relaxed mb-2">{activity.description}</p>

                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                <span>Click to view on map</span>
                                                            </div>
                                                        </div>

                                                        {/* Image */}
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={activity.image || "/placeholder.svg"}
                                                                alt={activity.name}
                                                                className="w-64 h-40 object-cover rounded-lg shadow-sm"
                                                            />
                                                        </div>
                                                    </div>
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

            <ImageUploadSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={(image) => console.log(image)}
                maxFileCount={3}/>
        </>
    )
}

export default withSuspense(GuideEdit)