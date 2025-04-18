import api from "./axiosInstance";
import jwtDecode from "jwt-decode";

/**
 * Get user profile data
 * @returns {Promise<Object>} - Response with success status and user data
 */
export const getProfile = async () => {
  try {
    // Get token and decode to get userLoggedInId
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "Authentication token not found",
      };
    }

    const decoded = jwtDecode(token);
    console.log("Decoded token for profile fetch:", decoded);
    const userId = decoded.userLoggedInId;

    if (!userId) {
      console.error("User ID not found in token for profile fetch");
      return {
        success: false,
        message: "User ID not found in token",
      };
    }

    // Make the GET request with the correct endpoint
    console.log(`Fetching profile data from /hikers/${userId}`);
    const response = await api.get(`/hikers/${userId}`);
    console.log("Profile fetch response:", response.data);

    if (response.data.status === 200) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to fetch profile",
      };
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    console.error("Error response:", error.response?.data);

    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching profile",
      error: error.response?.data || error.message,
    };
  }
};

// Update the updateProfile function to ensure password is properly included
export const updateProfile = async (profileData, ktpFile, profilePictureFile) => {
  try {
    // Get token and decode to get userLoggedInId
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return {
        success: false,
        message: "Authentication token not found",
      };
    }

    let decoded;
    try {
      decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
    } catch (tokenError) {
      console.error("Error decoding token:", tokenError);
      return {
        success: false,
        message: "Invalid authentication token",
      };
    }

    const userId = decoded.userLoggedInId;

    if (!userId) {
      console.error("User ID not found in token");
      return {
        success: false,
        message: "User ID not found in token",
      };
    }

    // Create FormData object
    const formData = new FormData();

    // Create the hiker object with phoneNumber instead of phone to match the server's expected format
    const hikerData = {
      id: userId,
      name: profileData.name,
      phoneNumber: profileData.phone,
      email: profileData.email,
    };

    // Always include password in the request, even if it's empty
    // The server will handle empty password appropriately
    hikerData.password = profileData.password || "";

    console.log("Sending hiker data (with password):", {
      ...hikerData,
      password: hikerData.password ? "********" : "(empty string)",
    });

    // Append the hiker data as a JSON string with the key "hiker"
    formData.append("hiker", JSON.stringify(hikerData));

    // Add KTP file if provided with the key "ktp"
    if (ktpFile) {
      console.log("Adding KTP file:", ktpFile.name, "Type:", ktpFile.type);
      formData.append("ktp", ktpFile);
    }

    // Add profile picture if provided with the key "profile_picture"
    if (profilePictureFile) {
      console.log("Adding profile picture:", profilePictureFile.name, "Type:", profilePictureFile.type);
      formData.append("profile_picture", profilePictureFile);
    }

    // Log FormData contents for debugging (without showing actual password)
    console.log("FormData entries:");
    for (const pair of formData.entries()) {
      if (pair[0] === "hiker") {
        // Parse the JSON to check if password is included, but don't log the actual password
        const hikerJson = JSON.parse(pair[1]);
        console.log(
          `${pair[0]}: ${JSON.stringify({
            ...hikerJson,
            password: hikerJson.password ? "********" : "(empty string)",
          })}`
        );
      } else {
        console.log(`${pair[0]}: [File]`);
      }
    }

    // Make the PATCH request without setting Content-Type header
    console.log("Sending PATCH request to /hikers");

    const response = await api.patch("/hikers", formData);

    console.log("Profile update response:", response.data);

    if (response.data.status === 200) {
      return {
        success: true,
        message: response.data.message || "Profile updated successfully",
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to update profile",
      };
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    }

    // More detailed error message
    let errorMessage = "An error occurred while updating profile";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
      error: error.toString(),
      errorDetails: {
        name: error.name,
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
        request: error.request ? "Request was made but no response received" : null,
      },
    };
  }
};
