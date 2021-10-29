import { makeRequest } from "../../hooks/request.hook";
import { useCallback } from "react";

export const useSelectFilter = (filter, token, setSongs) => {
  const handleSelectFilter = useCallback(
    (e) => {
      switch (filter) {
        case `genres`:
          makeRequest(
            "GET",
            `/songs/filter-by-genre/${e.target.value}`,
            {},
            token
          ).then((response) => {
            setSongs(response);
          });
          break;
        case `authors`:
          makeRequest(
            "GET",
            `/songs/filter-by-author/${e.target.value}`,
            {},
            token
          ).then((response) => {
            setSongs(response);
          });
          break;
        case `skinTones`:
          makeRequest(
            "GET",
            `/songs/filter-by-author-skin-tone/${e.target.value}`,
            {},
            token
          ).then((response) => {
            setSongs(response);
          });
          break;
        default:
          setSongs([]);
      }
    },
    [filter, setSongs, token]
  );

  return { handleSelectFilter };
};
