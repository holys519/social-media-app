import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email?: string;
  [key: string]: any;
}

const AuthContext = createContext<{
  user: User | null;
  setAuth: (authUser: User) => void;
  setUserData: (userData: User) => void;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (authUser: User) => {
    setUser(authUser);
  };

  const setUserData = (userData: User) => {
    // console.log("old user: ", user?.email);
    setUser({ ...userData });
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
