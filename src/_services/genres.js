import API from "../_api"

export const getGenres = async () => {
  const { data } = await API.get("/genres");
  return data.data
}

// Menambahkan data genre
export const createGenre = async (genre) => {
  const { data } = await API.post("/genres", genre);
  return data.data;
}