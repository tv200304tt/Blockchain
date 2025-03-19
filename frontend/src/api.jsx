import axios from "axios";

// Cấu hình base URL cho API (cập nhật địa chỉ IP hoặc localhost phù hợp)
const API_URL = "http://localhost:5000"; // Hoặc "http://192.168.1.XX:5000" (thay XX bằng IP thực tế)

// Tạo instance axios với base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Timeout 10 giây để tránh lỗi kết nối lâu
});

// Function để mine block
export const mineBlock = async () => {
  try {
    const response = await api.post("/mine");
    return response.data;
  } catch (error) {
    console.error("Mining failed:", error.message);
    throw error;
  }
};

// Function để lấy toàn bộ blockchain
export const getChain = async () => {
  try {
    const response = await api.get("/chain");
    return response.data;
  } catch (error) {
    console.error("Failed to get chain:", error.message);
    throw error;
  }
};

// Function để lấy posts (nếu cần)
export const getPosts = async () => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Failed to get posts:", error.message);
    throw error;
  }
};

// Function để thêm post (nếu cần)
export const addPost = async (postData) => {
  try {
    const response = await api.post("/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Failed to add post:", error.message);
    throw error;
  }
};