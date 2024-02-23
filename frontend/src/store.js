import { create } from "zustand";
import { getCookie } from "./cookies";
import { jwtDecode } from "jwt-decode";

const getUserFromCookie = () => {
  const token = getCookie("accessToken") || null;
  if (token) {
    return jwtDecode(token);
  } else {
    return null;
  }
};

export const useGlobalStore = create((set) => ({
  user: getUserFromCookie(),
  setUser: (newUser) => set((state) => ({ user: newUser })),
  removeUser: () => set({ user: null }),
}));
