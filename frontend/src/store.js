import { create } from "zustand";
import { getCookie } from "./cookies";
import { jwtDecode } from "jwt-decode";

const getUserFromCookie = () => {
  const token = getCookie("accessToken") || null;
  const clientId = getCookie("clientId") || null;
  if (token && clientId) {
    return { userInfo: jwtDecode(token), clientId };
  } else {
    return null;
  }
};

export const useGlobalStore = create((set) => ({
  user: getUserFromCookie(),
  setUser: (userInfo, clientId) =>
    set((state) => ({ user: { userInfo, clientId } })),
  removeUser: () => set({ user: null }),
}));
