import API from "../_api"

export const getGenres = async () => {
  const { data } = await API.get("/genres");
  return data.data
}