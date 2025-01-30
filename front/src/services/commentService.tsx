import axios from "axios";
import { BACKEND_URL } from "../globalVariables";
import { getTokens } from "./globalService";

export const createComment = async (postData: FormData) => {
    const { accessToken, refreshToken } = getTokens();
    try {
        const response = await axios.post(
            `${BACKEND_URL}/comments`,
            postData,
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
        console.error("Error creating comment:", error);
        throw error;
    }
};

export const fetchComments = async (postID: string) => {
    const { accessToken, refreshToken } = getTokens();

    try {
        const response = await axios.get(
            `${BACKEND_URL}/comments/${postID}`,
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


export const updateComment = async (commentData: FormData) => {
    const { accessToken, refreshToken } = getTokens();
    const commentID = commentData.get("commentId") as string;

    console.log(commentID)
    try {
        const response = await axios.put(
            `${BACKEND_URL}/comments/${commentID}`,
            commentData,
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
        console.error("Error updating comment:", error);
        throw error;
    }
};

export const deleteComment = async (commentID: string) => {
    const { accessToken, refreshToken } = getTokens();
    try {
        const response = await axios.delete(
            `${BACKEND_URL}/comments/${commentID}`,
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
        console.error("Error deleting comment:", error);
        throw error;
    }
};