import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from '@/components/ui/popover'
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { MarkerSvg, getMarkerType, getDayNumber } from '@/components/MapboxMap/MapUtil.jsx'
import { Layers } from 'lucide-react'

import { useMap } from "react-map-gl/mapbox";
import bbox from '@turf/bbox'

function PinControl({ markers, mapControls, onCheckedChange, onCheckedChangeAll }) {

    const { map: mapRef } = useMap();

    const handleViewAllPins = () => {
        if (markers) {
            const coordinates = markers.map((marker) => {
                if (marker.day) {
                    const dayIndex = getDayNumber(marker.day)
                    const markerControl = mapControls.find((m) => m.day === dayIndex)
                    if (!markerControl.checked) return null
                } else if (marker.category) {
                    const markerControl = mapControls.find((m) => m.category.toLowerCase() === marker.category)
                    if (!markerControl.checked) return null
                }
                return [marker.longitude, marker.latitude]
            })

            // filter out null values and convert to format for turf bbox
            const multiPoint = { type: 'MultiPoint', coordinates: coordinates.filter((item) => item !== null) }

            // calculate the bounding box of the feature
            const [minLng, minLat, maxLng, maxLat] = bbox(multiPoint);

            mapRef.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat]
                ],
                { padding: 100, duration: 1000 , maxZoom: 15}
            );
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button size="icon" className="shrink-0">
                    <Layers />
                </Button>
            </PopoverTrigger>
            {/* Prevent closing when outside is clicked */}
            <PopoverContent asChild onInteractOutside={(e) => e.preventDefault()}>
                <Card className="mr-4 p-0 w-64">
                    <CardHeader className="p-2 pl-6 pt-4">
                        <CardTitle className="text-base truncate">Map Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0">
                        {mapControls && mapControls.map((marker, index) => (
                            <div className="items-center flex space-x-2" key={index}>
                                {(marker?.category) ?
                                    <>
                                        <MarkerSvg color={marker.color} height={32} width={32}/>
                                        <div className="text-sm flex justify-between w-full">
                                            <p>{marker.category}</p>
                                        </div>
                                        <Checkbox checked={marker.checked} onCheckedChange={(checked) => onCheckedChange(checked, marker)} />
                                    </> :
                                    <>
                                        <MarkerSvg color={marker.color} height={32} width={32}/>
                                        <div className="text-sm flex justify-between w-full">
                                            <p>Day {marker.day}</p>
                                        </div>
                                        <Checkbox checked={marker.checked} onCheckedChange={(checked) => onCheckedChange(checked, marker)} />
                                    </>
                                }
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="pb-0 justify-center">
                        <div className="">
                            <div className="flex justify-center">
                                <Button onClick={handleViewAllPins}>
                                    Fit pins in view
                                </Button>
                            </div>
                            <div className="flex justify-between space-x-2">
                                <Button variant="link" onClick={() => onCheckedChangeAll(true)}>
                                    Select All
                                </Button>
                                <Button variant="link" onClick={() => onCheckedChangeAll(false)}>
                                    Clear All
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </PopoverContent>
        </Popover>
    )
}

export default PinControl;