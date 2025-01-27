import axios from "axios";
import { BACKEND_URL } from "../globalVariables";

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email,
            password,
        });
        const { accessToken, refreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        return response;
    } catch (error) {
        console.log("Error logging in:", error);
    }
};