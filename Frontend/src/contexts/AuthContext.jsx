import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { refreshToken as refreshTokenApi } from "../services/authService";

const ACCESS_TOKEN_TTL = 30 * 60 * 1000; // 30 minutes
const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const tokenTimerRef = useRef(null);

  const clearAuthStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiry");
    localStorage.removeItem("lastActivity");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("fullName");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("membershipScore");
    localStorage.removeItem("dob");
  };

  const logout = useCallback(() => {
    if (tokenTimerRef.current) {
      clearTimeout(tokenTimerRef.current);
      tokenTimerRef.current = null;
    }
    setUser(null);
    setIsAuthenticated(false);
    clearAuthStorage();
  }, []);

  const handleTokenExpiry = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const lastActivityStr = localStorage.getItem("lastActivity");
    const now = Date.now();
    const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : 0;

    if (!refreshToken) {
      logout();
      return;
    }

    if (lastActivity && now - lastActivity > IDLE_TIMEOUT) {
      logout();
      return;
    }

    try {
      const res = await refreshTokenApi(refreshToken);
      const { token: newAccessToken, refreshToken: newRefreshToken } =
        res?.data || {};

      if (!newAccessToken) {
        logout();
        return;
      }

      localStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      const newAccessExpiry = now + ACCESS_TOKEN_TTL;
      localStorage.setItem("accessTokenExpiry", String(newAccessExpiry));

      if (tokenTimerRef.current) {
        clearTimeout(tokenTimerRef.current);
      }
      tokenTimerRef.current = setTimeout(() => {
        void handleTokenExpiry();
      }, ACCESS_TOKEN_TTL);
    } catch (err) {
      logout();
    }
  }, [logout]);

  const login = useCallback(
    (authData) => {
      if (!authData) {
        logout();
        return;
      }

      setUser(authData);
      setIsAuthenticated(true);

      const now = Date.now();
      localStorage.setItem("lastActivity", String(now));
      const accessExpiry = now + ACCESS_TOKEN_TTL;
      localStorage.setItem("accessTokenExpiry", String(accessExpiry));

      if (tokenTimerRef.current) {
        clearTimeout(tokenTimerRef.current);
      }
      tokenTimerRef.current = setTimeout(() => {
        void handleTokenExpiry();
      }, ACCESS_TOKEN_TTL);
    },
    [handleTokenExpiry, logout]
  );

  // Khôi phục trạng thái khi reload nếu token vẫn còn hiệu lực và user không idle quá lâu
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const accessExpiryStr = localStorage.getItem("accessTokenExpiry");
    const lastActivityStr = localStorage.getItem("lastActivity");

    if (!accessToken || !refreshToken || !accessExpiryStr) {
      clearAuthStorage();
      return;
    }

    const now = Date.now();
    const accessExpiry = parseInt(accessExpiryStr, 10);
    const lastActivity = lastActivityStr ? parseInt(lastActivityStr, 10) : now;

    if (Number.isNaN(accessExpiry)) {
      logout();
      return;
    }

    if (now - lastActivity > IDLE_TIMEOUT) {
      logout();
      return;
    }

    if (now >= accessExpiry) {
      void handleTokenExpiry();
      return;
    }

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const fullName = localStorage.getItem("fullName");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const membershipScore = localStorage.getItem("membershipScore");
    const dob = localStorage.getItem("dob");

    setUser({
      username,
      role,
      id: id ? Number(id) : undefined,
      email,
      fullName,
      phoneNumber,
      membershipScore: membershipScore
        ? Number(membershipScore)
        : undefined,
      dob,
    });
    setIsAuthenticated(true);

    const remaining = accessExpiry - now;
    if (remaining > 0) {
      if (tokenTimerRef.current) {
        clearTimeout(tokenTimerRef.current);
      }
      tokenTimerRef.current = setTimeout(() => {
        void handleTokenExpiry();
      }, remaining);
    } else {
      void handleTokenExpiry();
    }
  }, [handleTokenExpiry, logout]);

  // Cập nhật lastActivity khi user thao tác
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("lastActivity", String(Date.now()));
    };

    const events = ["click", "keydown", "mousemove", "scroll"];
    events.forEach((event) =>
      window.addEventListener(event, updateActivity)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity)
      );
    };
  }, []);

  // Dọn dẹp timer khi unmount
  useEffect(
    () => () => {
      if (tokenTimerRef.current) {
        clearTimeout(tokenTimerRef.current);
      }
    },
    []
  );

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
