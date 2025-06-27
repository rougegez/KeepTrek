import { useState, useRef } from 'react'
import { X, MapPin, Clock, Globe, MapIcon, ChevronDown } from 'lucide-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx'
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from '@/components/ui/collapsible.jsx'
import { Button } from "@/components/ui/button.jsx"
import { getDayIndex } from '@/components/MapboxMap/MapUtil.jsx'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger
}
    from '@/components/ui/dropdown-menu.jsx'
import { toast } from 'sonner'
import Image from '../ui/image'

function LocationCard({ place, onClick, onSaveLocation, disableSaveLocation, itineraryDays, onDaySelected, daySelected }) {

    const [selectedDay, setSelectedDay] = useState(daySelected ?? null)
    const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false)

    const handleDaySelected = (checked, day) => {
        onDaySelected(checked ? day : null)
        setSelectedDay(checked ? day : null)
    }

    const handleSaveLocation = () => {
        if (onSaveLocation) {
            onSaveLocation()
        }
        if (!selectedDay && itineraryDays.length > 0) {
            setIsDayDropdownOpen(true)
            toast.info("Select a day to save the location to")
        }
    }

    return (
        <Card className="relative bg-white bg-opacity-90">
            <CardHeader className="pb-0 md:pb-6 pt-2 md:pt-6">
                <Button
                    className="absolute top-1 right-1 bg-transparent outline-none 
                                            shadow-none rounded-full hover:bg-black/5 p-0.5"
                    size="icon"
                    onClick={onClick}>
                    <X size={16} color="black" />
                </Button>
                {/* Image Container - Mobile */}
                {place.image && (
                    <div className="md:hidden absolute bottom-14 right-4 w-28 h-20 overflow-hidden rounded-md flex-shrink-0">
                        <a href={place.link} target="_blank" rel="noopener noreferrer">
                            <Image
                                src={place.image}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </a>
                    </div>
                )}
                <CardTitle className="text-base md:text-lg pr-24 md:pr-8 truncate">{place.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-1 px-3 md:px-6 pb-3">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div className="flex-1 space-y-1.5 md:space-y-3">
                        {/* Address */}
                        <div className="flex items-start gap-1 md:gap-2 pr-28 md:pr-0">
                            <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                            <p className="text-gray-500 text-[10px] md:text-sm line-clamp-3 md:line-clamp-none">{place.location}</p>
                        </div>

                        {/* Rating */}
                        {place.rating?.rating > 0 && (
                            <div className="flex items-center">
                                <span className="text-yellow-500 text-xs md:text-base">★</span>
                                <p className="pl-1 text-gray-500 text-[10px] md:text-sm">{place.rating.rating}</p>
                                <p className="pl-1 text-gray-500 text-[10px] md:text-sm">({place.rating.count})</p>
                            </div>
                        )}

                        {/* Opening Hours */}
                        {place.openingHours?.length > 2 && (
                            <div className="flex gap-1 md:gap-2">
                                <Clock size={12} className="flex-shrink-0 mt-0.5" />
                                <Collapsible className="flex gap-0.5">
                                    <div>
                                        <CollapsibleContent>
                                            {place.openingHours.slice(0, getDayIndex()).map((day, index) => (
                                                <div key={`pre-${index}`}>
                                                    <CollapsibleTrigger className="inline-block">
                                                        <p className="text-gray-500 text-[10px] md:text-sm leading-tight">{day}</p>
                                                    </CollapsibleTrigger>
                                                </div>
                                            ))}
                                        </CollapsibleContent>
                                        <CollapsibleTrigger>
                                            <span className="text-gray-500 text-[10px] md:text-sm leading-tight">{place.openingHours[getDayIndex()]}</span>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            {place.openingHours.slice(getDayIndex() + 1).map((day, index) => (
                                                <div key={`post-${index}`}>
                                                    <CollapsibleTrigger className="inline-block">
                                                        <p className="text-gray-500 text-[10px] md:text-sm leading-tight">{day}</p>
                                                    </CollapsibleTrigger>
                                                </div>
                                            ))}
                                        </CollapsibleContent>
                                    </div>
                                </Collapsible>
                            </div>
                        )}

                        {/* Website */}
                        {place.website && (
                            <div className="flex gap-1 md:gap-2 items-center">
                                <Globe size={12} className="flex-shrink-0" />
                                <a href={place.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-[10px] md:text-sm truncate">
                                    {place.website}
                                </a>
                            </div>
                        )}

                        {/* Google Maps Link */}
                        {!place.image && place.link && (
                            <div className="flex gap-1 md:gap-2 items-center">
                                <MapIcon size={12} className="flex-shrink-0" />
                                <a href={place.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-[10px] md:text-sm">
                                    View on Google Maps
                                </a>
                            </div>
                        )}
                        {!disableSaveLocation && (
                            <div className="flex">
                                <Button
                                    onClick={handleSaveLocation}
                                    className={`mt-1 md:mt-2 w-full md:w-auto text-[10px] md:text-sm py-1 md:py-2 h-auto ${(itineraryDays.length > 0) ? `rounded-r-none` : ``}`}
                                >
                                    Save Location
                                </Button>
                                {(itineraryDays.length > 0) && (
                                    <DropdownMenu open={isDayDropdownOpen} onOpenChange={setIsDayDropdownOpen}>
                                        <DropdownMenuTrigger asChild>
                                            <Button className="px-1 rounded-l-none mt-1 md:mt-2 w-full md:w-auto text-[10px] md:text-sm py-1 md:py-2 h-auto">
                                                <ChevronDown />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            {itineraryDays.map((day, index) => (
                                                <DropdownMenuCheckboxItem
                                                    key={index}
                                                    value={day}
                                                    checked={day === selectedDay}
                                                    onCheckedChange={(checked) => handleDaySelected(checked, day)}
                                                >
                                                    {day}
                                                </DropdownMenuCheckboxItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Image Container - Desktop */}
                    {place.image && (
                        <div className="hidden md:block w-52 h-32 overflow-hidden rounded-lg">
                            <a href={place.link} target="_blank" rel="noopener noreferrer">
                                <Image
                                    key={place.image}
                                    src={place.image}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </a>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default LocationCard;