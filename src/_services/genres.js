
import { API } from "../_api"

// Mengambil semua data genre
export const getGenres = async () => {
  const { data } = await API.get("/genres");
  return data.data;
}

// Menambahkan data genre
export const createGenre = async (genre) => {
  const { data } = await API.post("/genres", genre);
  return data.data;
}

// Mengubah data genre
export const updateGenre = async (id, genre) => {
  const { data } = await API.put(`/genres/${id}`, genre);
  return data;
}

// Menghapus data genre
export const deleteGenre = async (id) => {
  const { data } = await API.delete(`/genres/${id}`);
  return data;
}
