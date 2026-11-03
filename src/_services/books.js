import API from "../_api"

export const getBooks = async () => {
  const { data } = await API.get("/books");
  return data.data
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