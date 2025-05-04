import React, { useState , useEffect, memo} from 'react';
import Image from '@/components/ui/image.jsx';
import { fetchPlaceDetails } from '@/APIs/fetchPlaceDetails.js';

const GoogleMapImage = memo(function GoogleMapImage({
    placeId,
    src,
    alt,
    onNewImage,
    ...props }) {
    const [source, setSource] = useState(src);
    const [refetchAttempted, setRefetchAttempted] = useState(false);

    const handleError = async (e) => {
    if (placeId && !refetchAttempted) {
            try {
                const data = await fetchPlaceDetails(placeId); 
                if (data?.image && data?.image !== src) {
                    setSource(data.image);
                    onNewImage(data.image);
                }
            } catch {
                setSource(alt);
            }
            setRefetchAttempted(true);
        }
        else {
            setSource(alt);
        }
    };

    return (
        <Image
            key={source}
            src={source}
            onError={handleError}
            {...props}
        />
    );
})

export default GoogleMapImage;