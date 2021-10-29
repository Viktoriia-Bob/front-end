import { makeRequest } from "../../hooks/request.hook";
import { useCallback } from "react";

export const useWishlist = (token, setSongsInWishlist) => {
  const handleAddToWishlist = useCallback(
    async (id) => {
      await makeRequest("PUT", `/wishlists/add-song?songId=${id}`, {}, token);
      makeRequest("GET", "/wishlists/get-songs-from-wishlist", {}, token).then(
        (response) => {
          setSongsInWishlist(response);
        }
      );
    },
    [token, setSongsInWishlist]
  );
  const handleDeleteFromWishlist = useCallback(
    async (id) => {
      await makeRequest(
        "PUT",
        `/wishlists/delete-song?songId=${id}`,
        {},
        token
      );
      makeRequest("GET", "/wishlists/get-songs-from-wishlist", {}, token).then(
        (response) => {
          setSongsInWishlist(response);
        }
      );
    },
    [token, setSongsInWishlist]
  );
  return { handleAddToWishlist, handleDeleteFromWishlist };
};
