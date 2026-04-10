import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  signup: (email, username, password) =>
    api.post("/auth/signup", { email, username, password }),
  login: (email, password) => api.post("/auth/login", { email, password }),
  adminSignup: (email, username) =>
    api.post("/admin/auth/signup", { email, username }),
  adminLogin: (email, password) => api.post("/admin/auth/login", { email, password }),
};

// Teams endpoints
export const teamAPI = {
  createTeam: (name, leaderName, players) =>
    api.post("/teams", { name, leaderName, players }),
  getMyTeams: () => api.get("/teams/my-teams"),
  getTeamById: (teamId) => api.get(`/teams/${teamId}`),
  updateTeam: (teamId, data) => api.put(`/teams/${teamId}`, data),
  deleteTeam: (teamId) => api.delete(`/teams/${teamId}`),
};

// Matches endpoints
export const matchAPI = {
  createMatch: (data) => api.post("/matches", data),
  getAllMatches: () => api.get("/matches"),
  getMatchById: (matchId) => api.get(`/matches/${matchId}`),
  updateStatus: (matchId, status) =>
    api.patch(`/matches/${matchId}/status`, { status }),
};

// Registrations endpoints
export const registrationAPI = {
  registerForMatch: (teamId, matchId, roundNumber) =>
    api.post("/registrations", { teamId, matchId, roundNumber }),
  getMyRegistrations: () => api.get("/registrations/my-registrations"),
  getRegistrationsByMatch: (matchId) =>
    api.get(`/registrations/match/${matchId}`),
};

// Payments endpoints
export const paymentAPI = {
  uploadScreenshot: (paymentId, file) => {
    const formData = new FormData();
    formData.append("paymentId", paymentId);
    formData.append("screenshot", file);
    return api.post("/payments/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getMyPayments: () => api.get("/payments/my-payments"),
  getPendingPayments: () => api.get("/payments/admin/pending"),
};

// Leaderboards endpoints
export const leaderboardAPI = {
  uploadLeaderboard: (matchId, roundNumber, file) => {
    const formData = new FormData();
    formData.append("matchId", matchId);
    formData.append("roundNumber", roundNumber || 1);
    formData.append("leaderboardImage", file);
    return api.post("/leaderboards/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getLeaderboardByMatch: (matchId) => api.get(`/leaderboards/match/${matchId}`),
  getLeaderboardById: (leaderboardId) => api.get(`/leaderboards/${leaderboardId}`),
  updateLeaderboard: (leaderboardId, data) =>
    api.put(`/leaderboards/${leaderboardId}`, data),
};

// Admin endpoints
export const adminAPI = {
  approvePayment: (paymentId) =>
    api.patch("/admin/payments/approve", { paymentId }),
  rejectPayment: (paymentId, rejectionReason) =>
    api.patch("/admin/payments/reject", { paymentId, rejectionReason }),
  assignSlot: (registrationId, slotNumber) =>
    api.patch("/admin/slots/assign", { registrationId, slotNumber }),
  getMatchSlots: (matchId) => api.get(`/admin/slots/${matchId}`),
};

export default api;
