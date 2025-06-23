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
    Copy 
} from 'lucide-react';
import { NavLink , useNavigate } from 'react-router-dom';
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
import { deleteGuide } from '@/APIs/guides';
import toastPromise from '@/utils/toastPromise';

export default function GuideCard({ guide, self = false, onDelete }) {

    const status = guide.status || 'draft';
    const statusColors = {
        draft: 'bg-yellow-100 text-yellow-800',
        published: 'bg-green-100 text-green-800',
    };

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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


    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Card className="overflow-hidden m-2">
                    <NavLink to={`/guides/view/${guide.id}`}>
                        <div className="relative h-48">
                            <Image
                                src={guide.hero_image}
                                className="w-full h-full object-cover"
                            />
                            {self && (
                                <Badge className={`absolute top-2 right-2 ${statusColors[status]}`}>
                                    {guide.published ? 'Published' : 'Draft'}
                                </Badge>
                            )}
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-2xl font-semibold">{guide.title}</CardTitle>
                            <CardDescription className="text-gray-700 text-sm line-clamp-1">
                                {guide.description ? guide.description : <span className="italic text-gray-500">No description yet</span>}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>{guide.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                <Clock className="w-4 h-4" />
                                <span>{guide.duration.days}D {guide.duration.nights}N</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Created at: {guide.created_at}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end items-center">
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
                                    <DropdownMenuItem>
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