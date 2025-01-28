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

export const createPost = async (user: any, content: string, image: string) => {
    const { accessToken, refreshToken } = getTokens();

    const postData = {
        user,
        content,
        image,
    };

    try {
        const response = await axios.post(
            `${BACKEND_URL}/posts`,
            postData,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const fetchPosts = async () => {
    const { accessToken, refreshToken } = getTokens();

    try {
        const response = await axios.get(
            `${BACKEND_URL}/posts`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken,
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const postsByUser = async (userId: string) => {

    const { accessToken, refreshToken } = getTokens();

    try {
        const response = await axios.get(
            `${BACKEND_URL}/posts?sender=${userId}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                    "x-refresh-token": refreshToken,
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }

};
