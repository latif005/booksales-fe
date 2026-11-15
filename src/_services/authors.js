import { API } from "../_api";

// Header autentikasi Admin
const authHeaders = {
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
};

// Mengambil semua data author
export const getAuthors = async () => {
  const { data } = await API.get("/authors");
  return data.data;
};

// Menambahkan data author
export const createAuthor = async (author) => {
  const { data } = await API.post("/authors", author, {
    headers: authHeaders,
  });
  return data.data;
};

// Mengubah data author
export const updateAuthor = async (id, author) => {
  const { data } = await API.put(`/authors/${id}`, author, {
    headers: authHeaders,
  });
  return data;
};

// Menghapus data author
export const deleteAuthor = async (id) => {
  const { data } = await API.delete(`/authors/${id}`, {
    headers: authHeaders,
  });
  return data;
};
