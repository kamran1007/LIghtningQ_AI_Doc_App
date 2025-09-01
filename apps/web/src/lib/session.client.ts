// session.client.ts  (NO "use server")

const SESSION_KEY = "app_session";

export const setSession = (session: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
};

export const getClientSession = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
};
