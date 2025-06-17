import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock , Calendar} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import Image from '../ui/image';
import { motion } from 'framer-motion';

function GuideCard({ guide, self = false }) {

    const status = guide.status || 'draft'; // Default to 'draft' if status is not set
    const statusColors = {
        draft: 'bg-yellow-100 text-yellow-800',
        published: 'bg-green-100 text-green-800',
    };


    return (
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
                </NavLink>
            </Card >
        </motion.div>
    )
}

export default GuideCard;