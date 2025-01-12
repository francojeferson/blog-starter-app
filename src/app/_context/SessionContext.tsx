"use client";
// context/SessionContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (sessionId: string) => void;
  confirmOrder: () => void;
}

interface StoredSession {
  sessionId: string;
  expiry: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const setSessionWithExpiry = (sessionId: string) => {
  const item: StoredSession = {
    sessionId: sessionId,
    expiry: new Date().getTime() + EXPIRY_TIME,
  };
  localStorage.setItem("session", JSON.stringify(item));
};

const getSessionWithExpiry = (): string | null => {
  const itemStr = localStorage.getItem("session");
  if (!itemStr) return null;

  const item: StoredSession = JSON.parse(itemStr);
  if (new Date().getTime() > item.expiry) {
    localStorage.removeItem("session");
    return null;
  }
  return item.sessionId;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  useEffect(() => {
    const storedSessionId = getSessionWithExpiry();
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  useEffect(() => {
    if (sessionId && orderConfirmed) {
      setSessionWithExpiry(sessionId);
    }
  }, [sessionId, orderConfirmed]);

  const confirmOrder = () => {
    setOrderConfirmed(true);
  };

  return (
    <SessionContext.Provider
      value={{
        sessionId,
        setSessionId: (value: string) => setSessionId(value),
        confirmOrder: () => confirmOrder(),
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
