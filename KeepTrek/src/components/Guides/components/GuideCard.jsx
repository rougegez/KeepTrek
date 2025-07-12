import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Clock,
    Calendar,
    MoreVertical,
    ExternalLink,
    Pencil,
    Trash,
    Copy,
    Heart,
    Bookmark,
    Eye,
    User
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Image from '../../ui/image';
import { motion } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import DeleteAlert from '../../ui/DeleteAlert';
import { deleteGuide , exportGuide } from '@/APIs/guides';
import toastPromise from '@/utils/toastPromise';
import { likeGuide, saveGuide } from '@/APIs/guides';
import { useQuery } from 'react-query';
import { useAuth } from '@/contexts/AuthProvider';
import { getUserProfile } from '@/APIs/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function GuideCard({ guide, self = false, onDelete }) {

    const { user, isLoggedIn } = useAuth();
    const { data: userData } = useQuery(
        ['userProfile', user],
        () => getUserProfile(user),
        {
            refetchOnWindowFocus: false
        }
    );

    const { data: creatorData, isLoading: isCreatorLoading } = useQuery(
        ['userProfile', guide.creatorID],
        () => getUserProfile(guide.creatorID),
        {
            refetchOnWindowFocus: false
        }
    )

    let status = guide.published
    if (guide.publish_date.length > 0 && !guide.published) {
        status = 'unlisted'
    }

    const statusColors = {
        false: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900',
        true: 'bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900',
        unlisted: 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900'
    };

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [likePending, setLikePending] = useState(false);
    const [savePending, setSavePending] = useState(false);
    const [isLiked, setIsLiked] = useState(userData?.likes.includes(guide.id));
    const [isSaved, setIsSaved] = useState(userData?.saved.includes(guide.id));

    const navigate = useNavigate();

    const handleDeleteGuide = async (e) => {
        const response = await toastPromise(
            deleteGuide(guide.id),
            {
                loading: 'Deleting guide...',
                success: 'Guide deleted successfully!',
                error: (error) => {
                    return {
                        message: "Failed to delete guide",
                        description: error?.message || 'An error occurred while deleting the guide.'
                    }
                }
            });
        if (response.status === 200) {
            onDelete();
        }
    }

    const handleLike = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error("You must be logged in to like a guide.");
            return;
        }
        if (likePending) return;
        setLikePending(true);
        const currentLike = isLiked;
        setIsLiked(!currentLike);
        await likeGuide(guide.id).catch((error) => {
            toast.error(`Failed to ${!currentLike ? "like" : "unlike"} the guide`, {
                description: error?.message || `An error occurred while ${!currentLike ? "liking" : "unliking"} the guide.`
            });
            setIsLiked(currentLike);
        });
        setLikePending(false);
    }

    const handleSave = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error("You must be logged in to save a guide.");
            return;
        }

        if (savePending) return;
        setSavePending(true);
        const currentSaved = isSaved;
        setIsSaved(!currentSaved);
        await saveGuide(guide.id).catch((error) => {
            toast.error(`Failed to ${!currentSaved ? "save" : "unsave"} the guide`, {
                description: error?.message || `An error occurred while ${!currentSaved ? "saving" : "unsaving"} the guide.`
            })
            setIsSaved(currentSaved);
        });
        setSavePending(false);
    }

    const handleExportTrip = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            toast.error("You must be logged in to export a guide as a trip.");
            return;
        }
        const response = await toastPromise(
            exportGuide(guide.id),
            {
                loading: 'Exporting guide as trip...',
                success: {
                        message: 'Guide exported as trip successfully!',
                        action: {
                            label: 'View Trip',
                            onClick: () => {navigate(`/itinerary/${response.data.id}`)},
                        }
                },
                error: (error) => {
                    return {
                        message: "Failed to export guide as trip",
                        description: error?.message || 'An error occurred while exporting the guide as a trip.'
                    }
                }
            }
        );    
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
            >
                <Card className="overflow-hidden m-2 hover:shadow-xl">
                    <NavLink to={`/guides/view/${guide.id}`}>
                        <div className="relative h-48">
                            <Image
                                src={guide.hero_image}
                                className="w-full h-full object-cover"
                            />
                            {self ? (
                                <Badge className={`absolute top-2 right-2 ${statusColors[status]}`}>
                                    {guide.published ? 'Published' : guide.publish_date.length > 0 ? 'Unlisted' : 'Draft'}
                                </Badge>
                            ) : (
                                <div className="absolute top-2 right-2 flex gap-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleLike}
                                        disabled={likePending}
                                        className={`group bg-white/40 border-none backdrop-blur-sm hover:bg-white/60 ${isLiked ? "text-red-500" : "text-gray-700 hover:text-red-500"}`}
                                    >
                                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current group-hover:fill-none" : "group-hover:fill-current"}`} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={savePending}
                                        className={`group bg-white/40 border-none backdrop-blur-sm hover:bg-white/60 ${isSaved ? "text-teal-600" : "text-gray-700 hover:text-teal-600"}`}
                                    >
                                        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current group-hover:fill-none" : "group-hover:fill-current"}`} />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between gap-x-2">
                                <CardTitle className="text-2xl font-semibold line-clamp-1">
                                    {guide.title}
                                </CardTitle>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-4 w-4" />
                                        {guide.likes || 0}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        {guide.views || 0}
                                    </div>
                                </div>
                            </div>
                            <CardDescription className="text-gray-700 text-sm line-clamp-1">
                                {guide.description ?
                                    <div dangerouslySetInnerHTML={{ __html: guide.description }} />
                                    : <span className="italic text-gray-500">No description yet</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>{guide.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {guide.duration?.days != null ? `${guide.duration.days}D` : "-"}
                                    {" "}
                                    {guide.duration?.nights != null ? `${guide.duration.nights}N` : ""}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={creatorData?.image} />
                                    <AvatarFallback className="text-gray-500">
                                        {creatorData?.username?.charAt(0).toUpperCase() || <User className="size-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="ml-2 text-sm text-gray-600">
                                    {isCreatorLoading ? "Loading..." : creatorData?.username || "Unknown"}
                                </span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
                                    >
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.open(`/guides/view/${guide.id}`, '_blank');
                                        }}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        View in new tab
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={handleExportTrip}
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Export as Trip
                                    </DropdownMenuItem>
                                    {self && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                <NavLink to={`/guides/edit/${guide.id}`}>
                                                    Edit Guide
                                                </NavLink>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowDeleteAlert(true);
                                                }}
                                            >
                                                <Trash className="h-4 w-4 mr-2 text-red-500" />
                                                <span className="text-red-500">Delete Guide</span>
                                            </DropdownMenuItem>
                                        </>
                                    )}

                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardFooter>
                    </NavLink>
                </Card >
            </motion.div>

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