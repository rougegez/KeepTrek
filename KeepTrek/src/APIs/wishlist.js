import axios from "./axiosConfig"; // Base Axios instance

// Create Item
export const createItem = async (tripID, itemData) => {
    const response = await axios.post(`/wishlist/${tripID}/new-item`, itemData);
    return response.data;
};

// Get All Items
export const getAllItems = async (tripID) => {
    const response = await axios.get(`/wishlist/${tripID}/all-items`);
    return response.data;
};

// Edit Item
export const editItem = async (tripID, itemID, editData) => {
    const response = await axios.put(`/wishlist/${tripID}/${itemID}/edit`, editData);
    return response.data;
};

// Delete Item
export const deleteItem = async (tripID, itemID) => {
    const response = await axios.delete(`/wishlist/${tripID}/${itemID}/delete-item`);
    return response.data;
};

// Upvote Item
export const upvoteItem = async (tripID, itemID) => {
    const response = await axios.put(`/wishlist/${tripID}/${itemID}/upvote`);
    return response.data;
};

// Downvote Item
export const downvoteItem = async (tripID, itemID) => {
    const response = await axios.put(`/wishlist/${tripID}/${itemID}/downvote`);
    return response.data;
};

// Upload File
export const uploadFile = async (tripID, fileData) => {
    const response = await axios.post(`/wishlist/${tripID}/upload-file`, fileData);
    return response.data;
};

// Get All Files
export const getAllFiles = async (tripID) => {
    const response = await axios.get(`/wishlist/${tripID}/all-files`);
    return response.data;
};

// Get File URL
export const getFileURL = async (tripID, fileID) => {
    const response = await axios.get(`/wishlist/${tripID}/${fileID}/url`);
    return response.data;
};

// Delete File
export const deleteFile = async (tripID, fileID) => {
    const response = await axios.delete(`/wishlist/${tripID}/${fileID}/delete-file`);
    return response.data;
};