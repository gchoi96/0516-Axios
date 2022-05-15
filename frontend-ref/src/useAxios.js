import axios from "axios";

export default function useAxios() {
  const myAxios = axios.create({
    baseURL: "http://localhost:4000/",
    headers: {
      Authorization: `Bearer ${
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : ""
      }`,
    },
  });

  return [myAxios];
}
