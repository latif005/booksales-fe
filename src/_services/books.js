import { API } from "../_api";

// Header autentikasi Admin
const authHeaders = {
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
};

// Mengambil semua data buku
export const getBooks = async (search = "") => {
  const { data } = await API.get("/books", {
    params: {
      search: search,
    },
  });

  return data.data;
};

// Menambahkan data buku
export const CreateBook = async (data) => {
  try {
    const response = await API.post("/books", data, {
      headers: {
        ...authHeaders,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Pesan error:", error.response?.data);
    throw error;
  }
};

// Mengambil detail buku
export const showBook = async (id) => {
  try {
    const { data } = await API.get(`/books/${id}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Mengubah data buku
export const updateBook = async (id, data) => {
  try {
    const response = await API.post(`/books/${id}`, data, {
      headers: {
        ...authHeaders,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Menghapus data buku
export const deleteBook = async (id) => {
  try {
    await API.delete(`/books/${id}`, {
      headers: authHeaders,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
