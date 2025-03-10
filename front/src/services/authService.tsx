import axios from "axios";
import { BACKEND_URL } from "../globalVariables";
import { getTokens } from "./globalService";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

interface AuthState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const userId = localStorage.getItem("_id");
    if (!userId) {
      console.log("User ID not found in localStorage");
      return;
    }

    if (get().socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    console.log("Connecting to socket server at", BACKEND_URL);
    const socket = io(BACKEND_URL, {
      query: {
        userId,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to socket server with socket ID:", socket.id);
      set({ socket });
    });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      console.log("Received online users:", userIds);
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      console.log("Disconnected from socket server");
      set({ socket: null });
    }
  },
}));

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

    console.log("Login successful, connecting to socket...");
    useAuthStore.getState().connectSocket();

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
};

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

    useAuthStore.getState().disconnectSocket();

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
