import Cookies from "js-cookie";

export const getCookie = (key) => {
  return Cookies.get(key);
};

export const removeCookie = (key) => {
  Cookies.remove(key);
};

export const setCookie = (key, value) => {
  return Cookies.set(key, value, { expires: 1 });
};
