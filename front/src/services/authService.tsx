import axios from "axios";
import { BACKEND_URL } from "../globalVariables";

export const login = async (user_email: string, password: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email: user_email,
            password,
        });
        console.log(response.data);
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
    } catch (error) {
        console.log("Error registering:", error);
    }
}
