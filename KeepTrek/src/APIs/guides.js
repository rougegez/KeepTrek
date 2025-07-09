import axios from './axiosConfig';

export const createDraftGuide = async (tripID) => {
    const response = await axios.post(`/guides/create/${tripID}`);
    return response
}

export const updateGuide = async (guideID, guideData) => {
    const response = await axios.put(`/guides/update/${guideID}`, guideData);
    return response;
}

export const deleteGuide = async (guideID) => {
    const response = await axios.delete(`/guides/delete/${guideID}`);
    return response
}

export const getGuide = async (guideID) => {
    const response = await axios.get(`/guides/${guideID}`);
    return response.data;
}

export const publishGuide = async (guideID) => {
    const response = await axios.patch(`/guides/publish/${guideID}`);
    return response
}

export const getGuides = async ({
    self = false,
    title = null,
    location = null,
    creator_id = null,
    publish_date = null,
    publish_date_end = null,
    page = null,
    page_size = null
}) => {
    const params = {};
    params.self = self;
    if (title) params.title = title;
    if (location) params.location = location;
    if (creator_id) params.creator_id = creator_id;
    if (publish_date) params.publish_date = publish_date;
    if (publish_date_end) params.publish_date_end = publish_date_end;
    if (page) params.page = page;
    if (page_size) params.page_size = page_size;

    const response = await axios.get('/guides', { params: params });
    return response.data;
}

export const likeGuide = async (guideID) => {
    const response = await axios.patch(`/guides/like/${guideID}`);
    return response;
}

export const saveGuide = async (guideID) => {
    const response = await axios.patch(`/guides/save/${guideID}`);
    return response;
}

export const getMyTripsWithDays = async () => {
    const response = await axios.get('/trip/my-trips-with-days');
    return response.data;
}

