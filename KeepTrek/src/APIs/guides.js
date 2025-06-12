import axios from './axiosConfig';

export const createDraftGuide = async (tripID) => {
    const response = await axios.post(`/guides/create/${tripID}`);
    return response
}

export const getGuide = async (guideID) => {
    const response = await axios.get(`/guides/${guideID}`);
    return response.data;
}