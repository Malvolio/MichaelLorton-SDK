import axios from "axios";
import process from "process";

export const fetch = async (url: string) => {
  const token = process.env["AUTH_TOKEN"];
  const { data } = await axios.get(`https://the-one-api.dev/v2/${url}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};
