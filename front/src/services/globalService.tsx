import axios from "axios";
import { BACKEND_URL } from "../globalVariables";

export const getTokens = () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
        throw new Error("Tokens are missing");
    }

    return { accessToken, refreshToken };
};

export const updateImage = async (formData: FormData) => {

    const { accessToken, refreshToken } = getTokens();

    try {
        const response = await axios.post(`${BACKEND_URL}/global/updateImage`, formData, {
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "x-refresh-token": refreshToken,
            },
        });

        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}
