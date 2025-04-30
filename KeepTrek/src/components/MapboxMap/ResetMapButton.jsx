import { Button } from "@/components/ui/button";
import { useMap } from "react-map-gl/mapbox";
import { RotateCw } from "lucide-react";

function ResetMapButton({
    initCenter = [101.6160160887531, 3.0644537753819425], 
    initZoom = 15,
}) {

    const { map: mapRef } = useMap();

    const handleResetMap = () => {
        mapRef.flyTo({
            center: initCenter.length ? initCenter : [101.6160160887531, 3.0644537753819425],
            zoom: initZoom,
            duration: 0
        })
    }


    return (
        <Button
            size="icon"
            onClick={handleResetMap}>
            <RotateCw />
        </Button>
    )
}

export default ResetMapButton