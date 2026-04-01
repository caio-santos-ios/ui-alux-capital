import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;
export const uriBase = url;
export const baseURL = `${uriBase}/api`;

export const api = axios.create({
  baseURL
});
