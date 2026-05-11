import axios from "axios";

const API_URL = "http://localhost:8080";

// AUTH
export const signupUser = (data) =>
  axios.post(`${API_URL}/auth/signup`, data);

export const loginUser = (data) =>
  axios.post(`${API_URL}/auth/login`, data);

// FILE UPLOAD
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ TOKEN MISSING");
    throw new Error("User not logged in");
  }

  return await axios.post(
    `${API_URL}/upload/file`, // ✅ FIXED
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// 🔥 ADMIN CREATE USER
export const adminCreateUser = (data) => {
  const token = localStorage.getItem("token");

  return axios.post(`${API_URL}/users/admin-create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 🔥 GET ALL USERS
export const getAllUsers = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const deleteUser = (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// INSTITUTION
export const createInstitution = (data) => {
  return axios.post(`${API_URL}/institutions`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInstitutions = () => {
  return axios.get(`${API_URL}/institutions`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateInstitutionStatus = (id, status) => {
  return axios.patch(
    `${API_URL}/institutions/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
};

/// SETTINGS
export const getMySettings = () => {
  const token = localStorage.getItem("token");
  return fetch("http://localhost:8080/settings/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.json());
};

export const updateMySettings = (data) => {
  const token = localStorage.getItem("token");
  return fetch("http://localhost:8080/settings/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(res => res.json());
};


// 🔥 CREATE SUPPORT TICKET
export const createSupportTicket = (data) => {
  const token = localStorage.getItem("token");

  return axios.post(`${API_URL}/support`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 🔥 PROFILE APIs

export const getMyProfile = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${API_URL}/profile/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateMyProfile = (data) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API_URL}/profile/update`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// 🔥 DELETE MY ACCOUNT
export const deleteMyAccount = (password) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API_URL}/users/delete-me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { password }, // ⚠ important (DELETE me body aise bhejte hain)
  });
};


