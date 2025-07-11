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
import { getGuide, updateGuide, deleteGuide, publishGuide } from "@/APIs/guides.js"
import { uploadFile } from "@/APIs/users.js"
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
import { useAuth } from "@/contexts/AuthProvider.jsx"
import GuideEditActivityCard from "./components/GuideEditActivityCard.jsx"
import EditableRichText from "../ui/EditableRichText.jsx"
import EditableText from "../ui/EditableText.jsx"
import toastPromise from "@/utils/toastPromise.js"
import DeleteAlert from "../ui/DeleteAlert.jsx"
import { useNavigate } from "react-router-dom"
import GuideAddActivityModal from "./components/GuideAddActivityModal.jsx";
import { Plus } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion"
import { Switch } from "../ui/switch.jsx"
import { Label } from "../ui/label.jsx"

function GuideEdit({ }) {
    const { guideID } = useParams()
    const navigate = useNavigate()

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

    const { user: userID } = useAuth()

    const [guide, setGuide] = useState(guideData)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedPlace, setSelectedPlace] = useState({ random: null, clickLocation: {} })
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [addModalState, setAddModalState] = useState({ isOpen: false, selectedDay: null, location: null });
    const [reorderMode, setReorderMode] = useState(false);

    const handleChangeHeroImage = (images) => {
        if (!images || images.length === 0) {
            setGuide((prev) => ({
                ...prev,
                hero_image: ""
            }))
        } else {
            let heroImage = { hero_image: images[0].src, file: images[0]?.file ? images[0]?.file : null }
            setGuide((prev) => ({ ...prev, ...heroImage }))
        }
    }

    const handleSaveGuide = async () => {
        await toastPromise(new Promise(async (resolve, reject) => {
            try {
                let newGuide = { ...guide };
                // Handle hero image upload
                if (newGuide?.file) {
                    const formData = new FormData();
                    formData.append("file", guide.file);
                    const heroImageUrl = await uploadFile(userID, formData);
                    newGuide.hero_image = heroImageUrl;
                    delete newGuide.file;
                }
                // Handle activity image uploads
                let updatedDays = await Promise.all(
                    newGuide.days.map(async (day) => {
                        const updatedActivities = await Promise.all(
                            day.activities.map(async (activity) => {
                                let newImages = await Promise.all(
                                    activity.image && activity.image.length > 0 ?
                                        activity.image.map(async (img) => {
                                            if (img.file) {
                                                const formData = new FormData();
                                                formData.append("file", img.file);
                                                const url = await uploadFile(userID, formData);
                                                return url
                                            }
                                            return img.src || img;
                                        })
                                        : []
                                );
                                return { ...activity, image: newImages };
                            })
                        );
                        return { ...day, activities: updatedActivities };
                    })
                );
                newGuide.days = updatedDays;
                const response = await updateGuide(guideID, newGuide);
                resolve(response)
            } catch (err) {
                reject(err);
            }
        }), {
            loading: "Saving guide",
            success: "Guide saved successfully!",
            error: (e) => { return { message: "Failed to save changes.", description: e.message || "Unexpected error occurred." } }
        })
    }

    const handleActivityLocationClick = (activity) => {
        setSelectedPlace({ random: new Date().getTime(), clickLocation: activity });
    }

    const handleDeleteGuide = async () => {
        const response = await toastPromise(
            deleteGuide(guideID),
            {
                loading: 'Deleting guide...',
                success: 'Guide deleted successfully!',
                error: (error) => ({
                    message: 'Failed to delete guide',
                    description: error?.message || 'An error occurred while deleting the guide.'
                })
            }
        );
        if (response.status === 200) navigate('/guides')
    };

    const handlePublishGuide = async () => {
        if (guideData.published) {
            const response = await toastPromise(
                publishGuide(guideID),
                {
                    loading: 'Unlisting guide...',
                    success: 'Guide unlisted successfully!',
                    error: (error) => ({
                        message: 'Failed to unlist guide',
                        description: error?.message || 'An error occurred while unlisting the guide.'
                    })
                }
            );
            if (response.status === 200) {
                setGuide((prev) => ({ ...prev, published: false }));
                return;
            }
        } else {
            const response = await toastPromise(
                publishGuide(guideID),
                {
                    loading: 'Publishing guide...',
                    success: 'Guide published successfully!',
                    error: (error) => ({
                        message: 'Failed to publish guide',
                        description: error?.message || 'An error occurred while publishing the guide.'
                    })
                }
            );
            if (response.status === 200) {
                setGuide((prev) => ({ ...prev, published: !prev.published }));
            }
        }
    }

    // Handler to add a new activity
    const handleAddActivity = (newActivity, selectedDay) => {
        console.log("Adding activity:", newActivity, "to day:", selectedDay);
        const activityToAdd = {
            ...newActivity,
            id: newActivity.id || `${Date.now()}`
        };
        setGuide((prev) => {
            const updatedDays = prev.days.map((day) => {
                if (day.date === selectedDay) {
                    return { ...day, activities: [...day.activities, activityToAdd] };
                }
                return day;
            });
            return { ...prev, days: updatedDays };
        });
        setAddModalState({ isOpen: false, selectedDay: null, location: null });
    };

    // Handler to add a new day
    const handleAddDay = () => {
        setGuide((prev) => ({
            ...prev,
            days: [
                ...prev.days,
                { date: `Day ${prev.days.length + 1}`, activities: [] }
            ]
        }));
    };

    // Handler for map click to add activity
    const handleMapAddActivity = (place, selectedDay) => {
        const newActivity = {
            id: `${Date.now()}`,
            title: place ? place.name : "",
            placeId: place ? place.placeId : "",
            location: place ? place.location : "",
            coordinates: place ? place.coordinates : [],
            rating: place ? place.rating : "",
            image: place ? [place.image] : ["/assets/dummy-image.jpg"],
            openingHours: place ? place.openingHours : "",
            website: place ? place.website : "",
            link: place ? place.link : "",
        };
        setGuide((prev) => {
            const updatedDays = prev.days.map((day) => {
                if (day.date === selectedDay) {
                    return { ...day, activities: [...day.activities, newActivity] };
                }
                return day;
            });
            return { ...prev, days: updatedDays };
        });
    };

    return (
        <>
            <TopNavbar />
            <div className="bg-gray-50">
                <div className="max-w-full mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left Panel - Itinerary Details */}
                        <div className="bg-white">
                            {/* Hero Section */}
                            <div className="relative h-80 overflow-hidden">
                                <Image
                                    key={guide.hero_image}
                                    src={guide.hero_image}
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
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-green-500 hover:!text-green-500 cursor-pointer"
                                                onClick={handleSaveGuide}
                                            >
                                                <Save className="w-4 h-4 text-green-500" />
                                                Save {!guide.published && "Draft"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className={`${guide.published ? "text-yellow-500 hover:!text-yellow-500" : "text-purple-500 hover:!text-purple-500"} cursor-pointer`}
                                                onClick={handlePublishGuide}
                                            >
                                                <Share className={`w-4 h-4 ${guide.published ? "text-yellow-500" : "text-purple-500"}`} />
                                                {guide.published ? "Unlist" : "Publish"}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-red-500 hover:!text-red-500 cursor-pointer"
                                                onClick={() => setShowDeleteAlert(true)}
                                            >
                                                <Trash className="w-4 h-4 text-red-500" />
                                                Discard Draft
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-6 left-6 text-white">
                                    <EditableText
                                        initialValue={guide.title}
                                        placeholder="Click to edit the title"
                                        onSave={(value) => setGuide((prev) => ({ ...prev, title: value }))}
                                        className="w-full text-4xl font-bold mb-2"
                                        classNames={{
                                            textArea: "md:text-4xl",
                                            placeholder: "text-white/70"
                                        }}
                                    />
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
                                            <span>Posted on {guideData.publish_date[guideData.publish_date.length - 1]} • {guideData.views} views</span>
                                            :
                                            <span className="text-yellow-400">Created on {guideData.created_at} • {guideData.views} views • Not Published</span>
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {/* Description */}
                                <EditableRichText
                                    initialContent={guideData.description}
                                    onSave={(content) => setGuide((prev) => ({ ...prev, description: content }))}
                                    placeholder="Click to edit the description"
                                    disabledExtensions={["image", "link", "heading", "horizontalRule", "textalign"]}
                                    className="text-gray-700 leading-relaxed mb-6"
                                />
                                <div className="flex items-center gap-2 py-4">
                                    <Switch
                                        id="reorderMode"
                                        checked={reorderMode}
                                        onCheckedChange={setReorderMode}
                                    />
                                    <Label
                                        htmlFor="reorderMode">
                                        Reorder Activities
                                    </Label>
                                </div>
                                {/* Days */}
                                <div className="space-y-8">
                                    <AnimatePresence>
                                        {guide.days.map((day, dayIndex) => (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={day.date}
                                                className="mb-8">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h2 className="text-2xl font-bold text-gray-900">{day.date}</h2>
                                                    <div className="flex gap-2">
                                                        {day.activities.length === 0 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setGuide((prev) => {
                                                                        const updatedDays = [...prev.days];
                                                                        updatedDays.splice(dayIndex, 1);
                                                                        const renumberedDays = updatedDays.map((day, index) => ({
                                                                            ...day,
                                                                            date: `Day ${index + 1}`
                                                                        }));
                                                                        return { ...prev, days: renumberedDays };
                                                                    });
                                                                }}
                                                                aria-label="Delete Day"
                                                                className="text-red-500 hover:!text-red-500"
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                                Delete Day
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setAddModalState({ isOpen: true, selectedDay: day.date, location: null })}
                                                            aria-label="Add Activity"
                                                        >
                                                            <Plus className="w-4 h-4 mr-1" /> Add Activity
                                                        </Button>
                                                    </div>
                                                </div>
                                                {/* <div className="space-y-4"> */}
                                                <Reorder.Group
                                                    axis="y"
                                                    values={day.activities}
                                                    onReorder={(newActivities) => {
                                                        setGuide((prev) => {
                                                            let updatedDays = [...prev.days];
                                                            updatedDays[dayIndex].activities = newActivities;
                                                            return { ...prev, days: updatedDays };
                                                        });
                                                        console.log(guide)
                                                    }}
                                                    className="space-y-4"
                                                >
                                                    {day.activities.map((activity, activityIndex) => (
                                                        <GuideEditActivityCard
                                                            key={activity.id}
                                                            activity={activity}
                                                            position={activityIndex + 1}
                                                            selected={selectedPlace.clickLocation.title === activity.title}
                                                            onSave={(updatedActivity) => {
                                                                setGuide((prev) => {
                                                                    const updatedDays = [...prev.days];
                                                                    updatedDays[dayIndex].activities[activityIndex] = updatedActivity;
                                                                    return { ...prev, days: updatedDays };
                                                                });
                                                                console.log(guide)
                                                            }}
                                                            onDelete={() => {
                                                                setGuide((prev) => {
                                                                    const updatedDays = [...prev.days];
                                                                    updatedDays[dayIndex].activities.splice(activityIndex, 1);
                                                                    return { ...prev, days: updatedDays };
                                                                })
                                                                console.log(guide)
                                                            }}
                                                            onClick={() => handleActivityLocationClick(activity)}
                                                            reorderMode={reorderMode}
                                                        />
                                                    ))}
                                                </Reorder.Group>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 mb-6 rounded-lg shadow"
                                        onClick={handleAddDay}
                                        aria-label="Add Day"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Day
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Right Panel - Map */}
                        <div className="bg-gray-100 sticky top-16 h-[calc(100vh-4rem)]">
                            <MapboxMap
                                height="100%"
                                width="100%"
                                itineraryDays={guide.days.map(day => day.date)}
                                initCenter={guide?.coordinates}
                                initViewport={guide?.viewport}
                                handlePanTo={selectedPlace}
                                disableSaveLocation={false}
                                disableSearchBar={false}
                                markers={normalizeMarkers(guide.days)}
                                onSaveLocation={handleMapAddActivity}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Add Activity Modal */}
            <GuideAddActivityModal
                open={addModalState.isOpen}
                selectedDay={addModalState.selectedDay}
                onOpenChange={(open) => setAddModalState({ isOpen: open, selectedDay: open ? addModalState.selectedDay : null, location: open ? addModalState.location : null })}
                onAddActivity={handleAddActivity}
                location={addModalState.location}
            />
            <ImageUploadSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSave={handleChangeHeroImage}
                maxFileCount={1} />

            <DeleteAlert
                isOpen={showDeleteAlert}
                onClose={setShowDeleteAlert}
                onConfirm={handleDeleteGuide}
                itemName="Guide"
                itemType="guide"
            />
        </>
    )
}

export default withSuspense(GuideEdit)