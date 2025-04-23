import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dummy_image from '/assets/dummy-image.jpg'

function Image({ 
    src, 
    alt = dummy_image, 
    onError, 
    ...props }) {
    const [imageSrc, setImageSrc] = useState(src);
    const [errored, setErrored] = useState(false);

    const handleError = (e) => {
        if (!errored) {
            setImageSrc(alt);
            setErrored(true);
            onError(e)
        }
    };

    return (
        <img
            src={imageSrc}
            onError={handleError}
            {...props}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
};

export default Image;
