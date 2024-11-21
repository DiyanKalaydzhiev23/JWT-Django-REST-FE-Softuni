import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {useServices} from "./services";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({children, initialIsLoggedIn}) => {
    const [isLoggedIn, setLoggedIn] = useState(initialIsLoggedIn);
    const {
        httpService,
        storageService,
        urlsService,
    } = useServices();

    const login = useCallback(
        async (username, password) => {
            const credentials = { username, password };
    
            // STEP 1
            const { access, refresh } = await httpService.post(urlsService.getLoginUrl(), credentials);
    
            // STEP 2
            storageService.set('accessToken', access);
            storageService.set('refreshToken', refresh);
    
            setLoggedIn(true);
        },
        [httpService, storageService, urlsService],
    );

    const register = useCallback(
        async (username, password) => {
            const credentials = {username, password};
            await httpService.post(urlsService.getRegisterUrl(), credentials);
        },
        [httpService, urlsService],
    );

    const logout = useCallback(
        () => {
        },
        [],
    );

    const value = {
        isLoggedIn,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}

export {
    useAuth,
}

export default AuthProvider;