import axios from "axios";
const URL = "http://localhost:3001";

const axiosInstance = axios.create({
  baseURL: URL,
  headers: { Accept: "application/json", "Content-Type": "application/json" },
});

export const makeRequest = (method, url, body = {}, token = "", params = {}) => {
  return axiosInstance({
    url,
    params,
    method,
    data: JSON.stringify(body),
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  })
    .then(({ data }) => data)
    .catch(({ message }) => {
      throw message;
    });
};
