import axios from "axios";
import { BACKEND_URL } from "../globalVariables";
import { getTokens } from "./globalService";

export const login = async (user_email: string, password: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: user_email,
            password,
        });
        const { accessToken, refreshToken, _id, username, email, profilePicture } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("_id", _id);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        localStorage.setItem("profilePicture", profilePicture);

        return response;
    } catch (error) {
        console.log("Error logging in:", error);
    }
};

export const register = async (formData: FormData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/register`, formData);
        return response;
    } catch (error: any) {
        if (error.response) {
            // Return the error response so we can handle it in the component
            return error.response;
        }
        throw error;
    }
}

export const verify = async () => {
    try {
        const { accessToken, refreshToken } = getTokens();

        const response = await axios.get(
            `${BACKEND_URL}/auth/verify`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken,
                },
            });
        return response;
    } catch (error) {
        console.log("Error validating user:", error);
    }
}
export const logout = async () => {
    try {
        const { refreshToken } = getTokens();

        const response = await axios.post(`${BACKEND_URL}/auth/logout`, {
            refreshToken,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("_id");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        localStorage.removeItem("profilePicture");

        return response;
    } catch (error) {
        console.log("Error logging out:", error);
    }
};

export const refresh = async () => {
    try {
        const { refreshToken } = getTokens();

        const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {
            refreshToken,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);

        return response;
    } catch (error) {
        console.log("Error refreshing token:", error);
    }
};

export const googleLogin = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/google`, {
        credential: credentialResponse.credential
      });
      
      const { accessToken, refreshToken, _id, username, email, profilePicture } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("_id", _id);
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      localStorage.setItem("profilePicture", profilePicture);
      
      return response;
    } catch (error) {
      console.log("Error logging in with Google:", error);
    }
  };