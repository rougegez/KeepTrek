import axios from "./axiosConfig";

// Login API
export const loginUser = async (credentials) => {
  const response = await axios.post("/auth/login", credentials,
    {headers: {
      'Content-Type': 'application/json'
    }}
  );
  return response.data;
};

// Register API
export const registerUser = async (userData) => {
  const response = await axios.post("/users/register", userData);
  return response.data;
};

export const CurrentUser = async () => {
  try {
    const response = await axios.get("/auth/currentUser"); // Ensure the route matches your backend
    console.log("Current User ID:", response.data); // Logs the user ID
    return response.data; // Returns the user ID
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

// // Function to get the current user
// export const getCurrentUser = async () => {
//   try {
//       // Get the token from local storage or any other storage mechanism you use
//       const token = localStorage.getItem('token');

//       if (!token) {
//           throw new Error('No token found');
//       }

//       // Set up the headers with the Authorization token
//       const config = {
//           headers: {
//               'Authorization': `Bearer ${token}`
//           }
//       };

//       // Make the request to the backend
//       const response = await axios.get('/auth/current-user', config);

//       // Return the user data
//       return response.data;
//   } catch (error) {
//       console.error('Error fetching current user:', error);
//       throw error;
//   }
// };