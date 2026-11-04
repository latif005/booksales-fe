import { API } from "../_api"

export const getAuthors = async () => {
  const { data } = await API.get("/authors");
  return data.data
}

// Menambahkan data author
export const createAuthor = async (author) => {
  const { data } = await API.post("/authors", author);
  return data.data;
}