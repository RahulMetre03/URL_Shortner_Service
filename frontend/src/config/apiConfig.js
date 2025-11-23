
export const BASE_URL = "http://localhost:5000/api";

export const API = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },
  LINKS: {
    GET_ALL: (userId) => `${BASE_URL}/links?userId=${userId}`,
    GET: (code,userId) => `${BASE_URL}/links/${code}?userId=${userId}`,
    DELETE: (id, userId) => `${BASE_URL}/links/${id}?userId=${userId}`,
    ADD: (userId) => `${BASE_URL}/links?userId=${userId}`,
  }
};
