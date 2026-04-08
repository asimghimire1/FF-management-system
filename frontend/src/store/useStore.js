import { create } from "zustand";

const useStore = create((set) => ({
  // Auth state
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  // Login action
  login: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, isAuthenticated: true });
  },

  // Logout action
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Load user from token
  loadUser: (user) => {
    set({ user });
  },

  // Matches state
  matches: [],
  setMatches: (matches) => set({ matches }),

  // Teams state
  teams: [],
  setTeams: (teams) => set({ teams }),

  // Registrations state
  registrations: [],
  setRegistrations: (registrations) => set({ registrations }),

  // Loading state
  loading: false,
  setLoading: (loading) => set({ loading }),

  // Error state
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

export default useStore;
