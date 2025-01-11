const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const fetchPlaceDetails = async (placeId) => {
    try {
        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=photos,displayName,formattedAddress,location,types,viewport,googleMapsLinks,currentOpeningHours,rating,userRatingCount,websiteUri&key=${GOOGLE_MAPS_API_KEY}`
        )
        const data = await response.json()

        // Find a photo that is attributed to the place
        let image = data.photos[0].name
        photoLoop: for (let i = 0; i < data.photos.length; i++) {
            for (let j = 0; j < data.photos[i].authorAttributions.length; j++) {
                if (data.photos[i].authorAttributions[j].displayName === data.displayName.text) {
                    image = data.photos[i].name
                    break photoLoop
                }
            }
        }
        try {
            const responseImg = await fetch(`https://places.googleapis.com/v1/${image}/media?key=${GOOGLE_MAPS_API_KEY}&maxHeightPx=1920`)
            image = responseImg.url
        } catch (error) {
            console.error('Error fetching place image:', error)
        }
        const newPlace = {
            name: data.displayName.text,
            address: data.formattedAddress,
            coordinates: [data.location.longitude, data.location.latitude],
            rating: {rating : data.rating, count : data.userRatingCount},
            website: data.websiteUri,
            openingHours: data.currentOpeningHours?.weekdayDescriptions,
            link: data.googleMapsLinks.placeUri,
            image: image
        }
        return newPlace
    } catch (error) {
        console.error('Error fetching place information:', error)
    }
}

export {fetchPlaceDetails}