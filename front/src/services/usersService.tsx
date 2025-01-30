import axios from "axios";
import { BACKEND_URL } from "../globalVariables";
import { getTokens } from "./globalService";

export const getUser = async (userId: String) => {

    const { accessToken, refreshToken } = getTokens();

    try {
        const response = await axios.get(`${BACKEND_URL}/users/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
            },
        });

        return response;
    } catch (error) {
        // throw error;
    }
};

export const fetchUsers = async () => {

    const { accessToken, refreshToken } = getTokens();

    try {
        const response = await axios.get(`${BACKEND_URL}/users`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
            },
        });

        return response;
    } catch (error) {
        // throw error;
    }
};

export const updateUser = async (formData: FormData) => {

        const { accessToken, refreshToken } = getTokens();

        try {
            const response = await axios.post(`${BACKEND_URL}/users/update`, formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken,
                },
            });

            return response;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
}

