import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const axiosClient = axios.create({
  baseURL: `${apiUrl}/api/v1`,
  withCredentials: true, // Để gửi cookies tự động
});

axiosClient.interceptors.request.use(
  (config) => {
    // Không cần set Authorization header vì API sử dụng cookies
    // Cookies sẽ được gửi tự động với withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xóa dữ liệu user khỏi localStorage khi unauthorized
      localStorage.removeItem("user_data");
      localStorage.removeItem("auth_token");
      
      // Chỉ redirect nếu không phải trang login
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/tglogin')) {
        window.location.href = "/";
      }
    } else if (error.code === "ERR_NETWORK") {
      console.log("Server is not responding. Please try again later.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
