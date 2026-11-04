
import { API } from "../_api"

// Mengambil semua data author
export const getAuthors = async () => {
  const { data } = await API.get("/authors");
  return data.data;
}

// Menambahkan data author
export const createAuthor = async (author) => {
  const { data } = await API.post("/authors", author);
  return data.data;
}

// Mengubah data author
export const updateAuthor = async (id, author) => {
  const { data } = await API.put(`/authors/${id}`, author);
  return data;
}

// Menghapus data author
export const deleteAuthor = async (id) => {
  const { data } = await API.delete(`/authors/${id}`);
  return data;
}
