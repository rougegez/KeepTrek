import React, { useState } from 'react';
import Image from '@/components/ui/image.jsx';
import { fetchPlaceDetails } from '@/APIs/fetchPlaceDetails.js';

function GoogleMapImage({
    placeId,
    src,
    alt,
    newImage,
    ...props }) {
    const [source, setSource] = useState(src);

    const handleError = async (e) => {
        if (placeId) {
            try {
                const data = await fetchPlaceDetails(placeId);
                setSource(data?.image);
                newImage(data?.image);
            } catch {
                setSource(alt);
            }
        }
        else {
            setSource(alt);
        }
    };

    return (
        <Image
            src={source}
            alt={alt}
            onError={handleError}
            {...props}
        />
    );
}

export default GoogleMapImage;