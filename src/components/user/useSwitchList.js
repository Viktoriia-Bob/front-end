import { makeRequest } from "../../hooks/request.hook";
import { useCallback } from "react";

export const useSwitchList = (token, filter, setSongs) => {
  const handleClick = useCallback(
    (filter) => {
      switch (filter) {
        case `all`:
          makeRequest("GET", `/songs/`, {}, token).then((response) => {
            setSongs(response);
          });
          break;
        case `wishlist`:
          makeRequest(
            "GET",
            `/wishlists/get-songs-from-wishlist`,
            {},
            token
          ).then((response) => {
            setSongs(response);
          });
          break;
        case `bought`:
          makeRequest("GET", `/users/list-of-bought-songs/`, {}, token).then(
            (response) => {
              setSongs(response);
            }
          );
          break;
        default:
          makeRequest("GET", `/songs/`, {}, token).then((response) => {
            setSongs(response);
          });
      }
    },
    [setSongs, token]
  );
  return { handleClick };
};
