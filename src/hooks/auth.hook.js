import { useState, useCallback, useEffect } from "react";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);

  const setTokenToLocalStorage = useCallback((jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        token: jwtToken,
      })
    );
  }, []);

  const deleteTokenFromLocalStorage = useCallback(() => {
    setToken(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));

    if (data && data.token) {
      setTokenToLocalStorage(data.token);
    }
  }, [setTokenToLocalStorage]);

  return { setTokenToLocalStorage, deleteTokenFromLocalStorage, token };
};
