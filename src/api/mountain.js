import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // JSON Server

export const getMountains = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/mountains`);
        return response.data;
    } catch (error) {
        console.error("Error fetching mountains", error);
        return [];
    }
};
