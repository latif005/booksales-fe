import { API } from "../_api"

export const getBooks = async (search = "") => {
  const { data } = await API.get("/books", {
    params: {
      search: search
    }
  });

  return data.data;
}

export const CreateBook = async (data) => {
  try {
    const response = await API.post("/books", data)
    return response.data
  } catch (error) {
    console.log("Pesan error:", error.response?.data);
    throw error
  }
}

export const showBook = async (id) => {
  try {
    const { data } = await API.get(`/books/${id}`)
    return data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const updateBook = async (id, data) => {
  try {
    const response = await API.post(`/books/${id}`, data)
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const deleteBook = async (id) => {
  try {
    await  API.delete(`/books/${id}`)
  } catch (error) {
    console.log(error);
    throw error
  }
}