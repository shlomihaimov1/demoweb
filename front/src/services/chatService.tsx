import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./authService";
import { BACKEND_URL } from "../globalVariables";
import { getTokens } from "./globalService";
import axios from "axios";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface ChatState {
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: User | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    const { accessToken, refreshToken } = getTokens();
    try {
      const res = await axios.get(`${BACKEND_URL}/messages/users`,
        {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
          }
      }
      );
      set({ users: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    const { accessToken, refreshToken } = getTokens();
    try {
      const res = await axios.get(`${BACKEND_URL}/messages/get/${userId}`,
        {
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
              "x-refresh-token": refreshToken,
          }
      }
      );
      set({ messages: res.data });
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: string) => {
    const { selectedUser, messages } = get();
    const { accessToken, refreshToken } = getTokens();
    if (!selectedUser) return;
    try {
      const res = await axios.post(`${BACKEND_URL}/messages/send/${selectedUser._id}`, 
        { text: messageData },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken,
          }
        });
      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) return;
    socket.on("newMessage", (newMessage: any) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
