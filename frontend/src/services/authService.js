import api from "./api";
import { mapApiUser } from "./apiMappers";

async function login(credentials) {
  const response = await api.post("/auth/login", credentials);
  return {
    user: mapApiUser(response.data.user),
    token: response.data.access_token,
  };
}

export const authService = {
  login,
  async register(data) {
    const response = await api.post("/auth/register", data);
    return {
      user: mapApiUser(response.data.user),
      token: response.data.access_token,
    };
  },
  async fetchCurrentUser() {
    const response = await api.get("/auth/me");
    return mapApiUser(response.data);
  },
  requestPasswordReset: (email) => api.post("/auth/password-reset", { email }),
};
