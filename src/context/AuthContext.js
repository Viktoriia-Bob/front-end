import {createContext} from 'react'

function noop(token) {}

export const AuthContext = createContext({
    token: undefined,
    setTokenToLocalStorage: noop,
    deleteTokenFromLocalStorage: noop
})