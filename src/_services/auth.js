
import { useJwt } from "react-jwt";
import { API } from "../_api";

export const login = async ({ email, password }) => {
  try {
    const { data } = await API.post('/login', { email, password })
    return data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const logout = async ({ token }) => {
  try {
    const { data } = await API.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Fungsi Registrasi
export const register = async ({ name, username, email, password }) => {
  try {
    const { data } = await API.post('/register', {
      name,
      username,
      email,
      password
    })

    return data
  } catch (error) {
    console.log(error);
    throw error
  }
}

export const useDecodeToken = (token) => {
  const { decodedToken, isExpired } = useJwt(token);

  try {
    if (isExpired) {
      return {
        success: false,
        message: "Token expired",
        data: null
      }
    }

    return {
      success: true,
      message: "Token valid",
      data: decodedToken
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
      data: null
    }
  }
}

// Mengambil informasi user yang sedang login
export const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");

  if (!userInfo) {
    return null;
  }

  try {
    return JSON.parse(userInfo);
  } catch (error) {
    return null;
  }
};

// Mengecek apakah user sudah login
export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  const userInfo = getUserInfo();

  return !!token && !!userInfo;
};

// Mengambil role user
export const getUserRole = () => {
  const userInfo = getUserInfo();

  return userInfo?.role || null;
};