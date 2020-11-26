import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

async function serverPost(endpoint, options) {
  try {
    const { data } = await api.post(endpoint, options);

    return data;
  } catch (e) {
    return undefined;
  }
}

export { serverPost };
