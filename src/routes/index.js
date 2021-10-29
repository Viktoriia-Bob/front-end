import React from "react";
import {useAuth} from "../hooks/auth.hook";
import {AuthContext} from '../context/AuthContext'
import {useRoutes} from "../hooks/routes.hooks";

const Routes = () => {
    const {token, setTokenToLocalStorage, deleteTokenFromLocalStorage} = useAuth();
    const routes = useRoutes(token)
    return (
        <AuthContext.Provider value={{
            token, setTokenToLocalStorage, deleteTokenFromLocalStorage
        }}>
            {routes}
        </AuthContext.Provider>
    );
}

export default Routes;