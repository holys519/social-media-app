import { createContext, useState, useContext } from 'react';

const AuthContext = createContext<{
    user: any;
    setAuth: (authUser: any) => void;
    setUserData: (userData: any) => void;
} | null>(null);

import { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);

    const setAuth = (authUser: any) => {
        setUser(authUser);
    }

    const setUserData = (userData: any) => {
        setUser({...userData});
    }

    return (
        <AuthContext.Provider value={{user, setAuth, setUserData}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);