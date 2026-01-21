import { create } from "zustand";
import { api } from "../services/api";

export const useChat = create((set, get) => ({
  // ======================
  // 🌗 THEME
  // ======================
  darkMode: false,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

  // ======================
  // 🪟 PANELS
  // ======================
  showProfile: false,
  showSettings: false,
  onlineUsers: [],
  setOnlineUsers: (users) => set({ onlineUsers: users }),

  // ======================
// 📱 MOBILE UI
// ======================
showSidebar: true,
openChatMobile: () => set({ showSidebar: false }),
openSidebarMobile: () => set({ showSidebar: true }),


typingUsers: {},
setTyping: (chatId, userId) =>
  set((state) => ({
    typingUsers: {
      ...state.typingUsers,
      [chatId]: userId,
    },
  })),

clearTyping: (chatId) =>
  set((state) => {
    const t = { ...state.typingUsers };
    delete t[chatId];
    return { typingUsers: t };
  }),

  closeChat: () =>
  set({
    selectedChat: null,
    messages: [],
    showSidebar: true, 
  }),


  toggleProfile: () =>
    set((s) => ({
      showProfile: !s.showProfile,
      showSettings: false,
    })),

  toggleSettings: () =>
    set((s) => ({
      showSettings: !s.showSettings,
      showProfile: false,
    })),

  closePanels: () =>
    set({
      showProfile: false,
      showSettings: false,
    }),

  // ======================
  // 👤 USER PROFILE (UI only for now)
  // ======================
  userProfile: {
    name: "You",
    avatar: null,
    about: "Hey there! I am using Mucchatlu",
  },

  updateAvatar: (file) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        avatar: URL.createObjectURL(file),
      },
    })),

  updateProfile: (data) =>
  set((state) => ({
    userProfile: {
      ...state.userProfile,
      ...data,
    },
  })),


  // ======================
  // 💬 REAL CHATS FROM BACKEND
  // ======================
  chats: [],
  selectedChat: null,
  messages: [],

  search: "",
  setSearch: (v) => set({ search: v }),

  // ======================
  // 📥 LOAD CHATS FROM BACKEND
  // ======================
  loadChats: async () => {
    try {
      const res = await api.get("/chats");
      set({ chats: res.data });
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  },

  // ======================
  // 📥 LOAD MESSAGES FOR CHAT
  // ======================
  loadMessages: async (chat) => {
    try {
      set({ selectedChat: chat, messages: [] });

      const res = await api.get(`/messages/${chat._id}`);
      set({ messages: res.data });
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  },

  // ======================
  // ➕ ADD MESSAGE (FROM API OR SOCKET)
  // ======================
  addMessage: (msg) =>
    set((state) => ({
      messages:
        state.selectedChat && msg.chat === state.selectedChat._id
          ? [...state.messages, msg]
          : state.messages,

      chats: state.chats.map((c) =>
        c._id === msg.chat
          ? { ...c, lastMessage: msg }
          : c
      ),
    })),

  // ======================
  // 📌 PIN / 🔕 MUTE (UI ONLY)
  // ======================
togglePin: async (chatId) => {
  try {
    await api.patch(`/chats/${chatId}/pin`);

    set((state) => ({
      chats: state.chats.map((c) =>
        c._id === chatId ? { ...c, pinned: !c.pinned } : c
      ),
    }));
  } catch (err) {
    console.error("Failed to pin chat", err);
  }
},

deleteChat: async (chatId) => {
  try {
    await api.delete(`/chats/${chatId}`);

    set((state) => ({
      chats: state.chats.filter((c) => c._id !== chatId),
      selectedChat:
        state.selectedChat?._id === chatId ? null : state.selectedChat,
    }));
  } catch (err) {
    console.error("Failed to delete chat", err);
  }
},

toggleMute: async (chatId) => {
  try {
    await api.patch(`/chats/${chatId}/mute`);

    set((state) => ({
      chats: state.chats.map((c) =>
        c._id === chatId ? { ...c, muted: !c.muted } : c
      ),
    }));
  } catch (err) {
    console.error("Failed to mute chat", err);
  }
},

clearChat: async (chatId) => {
  try {
    await api.delete(`/chats/${chatId}/clear`);

    set((state) => ({
      messages:
        state.selectedChat?._id === chatId ? [] : state.messages,
    }));
  } catch (err) {
    console.error("Failed to clear chat", err);
  }
},
}));


