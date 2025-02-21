import { createContext, useContext, useState } from "react";

// Context
const UserDataContext = createContext();

// Provider
export const UserDataProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    return (
        <UserDataContext.Provider value={{userData, setUserData}}>
            {children}
        </UserDataContext.Provider>
    )
};

// Custom Hook
export const useUserDataHook = () => {
    return useContext(UserDataContext);
}

