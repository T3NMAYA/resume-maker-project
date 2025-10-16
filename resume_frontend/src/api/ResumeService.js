import axios from "axios";

export const baseURL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: baseURL,
});

// Add Axios interceptor to include Authorization header for authenticated requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const generateResume = async (description) => {
  try {
    if (!description || description.trim() === "") {
      throw new Error("Description cannot be empty");
    }
    const response = await axiosInstance.post("/api/v1/resume/generate", {
      userDescription: description,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating resume:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserResumes = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/resume/list");
    return response.data;
  } catch (error) {
    console.error("Error fetching user resumes:", error.response?.data || error.message);
    throw error;
  }
};