import { makeRequest } from "../../hooks/request.hook";
import { useCallback } from "react";

export const useCart = (token, setSongsInCart) => {
  const handleAddToCart = useCallback(
    async (id) => {
      await makeRequest(
        "PUT",
        `/cart-with-songs/add-song?songId=${id}`,
        {},
        token
      );
      makeRequest(
        "GET",
        "/cart-with-songs/get-songs-from-cart",
        {},
        token
      ).then((response) => {
        setSongsInCart(response);
      });
    },
    [token, setSongsInCart]
  );
  const handleDeleteFromCart = useCallback(
    async (id) => {
      await makeRequest(
        "PUT",
        `/cart-with-songs/delete-song?songId=${id}`,
        {},
        token
      );
      makeRequest(
        "GET",
        "/cart-with-songs/get-songs-from-cart",
        {},
        token
      ).then((response) => {
        setSongsInCart(response);
      });
    },
    [token, setSongsInCart]
  );
  return { handleAddToCart, handleDeleteFromCart };
};
