import axios from "axios";
import { BACKEND_URL } from "../globalVariables";
import { getTokens } from "./globalService";
import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

interface AuthState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
  addUser: (userId: string) => void;
  removeUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const socket = io(BASE_URL, {
      query: {
        userId: localStorage.getItem("_id"),
      },
    });

    socket.on("connect", () => {
      console.log("Connected to socket server");
      set({ socket });
    });

    socket.on("onlineUsers", (users: string[]) => {
      set({ onlineUsers: users });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
      set({ socket: null });
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  addUser: (userId: string) => {
    set((state) => ({ onlineUsers: [...state.onlineUsers, userId] }));
  },

  removeUser: (userId: string) => {
      set((state) => ({ onlineUsers: state.onlineUsers.filter((user) => user !== userId) }));
  }
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

    const { addUser } = useAuthStore.getState();
    addUser(_id);
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
  } catch (error) {
    console.log("Error registering:", error);
  }
};

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

    const { removeUser } = useAuthStore.getState();
    removeUser(localStorage.getItem("_id") as string);
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
