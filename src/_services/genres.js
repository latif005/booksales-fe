import { API } from "../_api";

// Header autentikasi Admin
const authHeaders = {
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
};

// Mengambil semua data genre
export const getGenres = async () => {
  const { data } = await API.get("/genres");
  return data.data;
};

// Menambahkan data genre
export const createGenre = async (genre) => {
  const { data } = await API.post("/genres", genre, {
    headers: authHeaders,
  });
  return data.data;
};

// Mengubah data genre
export const updateGenre = async (id, genre) => {
  const { data } = await API.put(`/genres/${id}`, genre, {
    headers: authHeaders,
  });
  return data;
};

// Menghapus data genre
export const deleteGenre = async (id) => {
  const { data } = await API.delete(`/genres/${id}`, {
    headers: authHeaders,
  });
  return data;
};
