import { API } from "../_api";

export const getTransactions = async () => {
  const { data } = await API.get("/transactions", {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  return data.data 
}

export const createTransaction = async (data) => {
  try {
    const response = await API.post("/transactions", data, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return response.data
  } catch (error) {
    console.log(error);
    throw error
  }
}

// Mengambil riwayat transaksi Customer
export const getMyHistory = async () => {
  try {
    const response = await API.get("/transactions/my-history", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Mengambil detail transaksi Customer
export const getTransactionById = async (id) => {
  try {
    const response = await API.get(`/transactions/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Menghapus transaksi (Admin)
export const deleteTransaction = async (id) => {
  try {
    const response = await API.delete(`/transactions/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};