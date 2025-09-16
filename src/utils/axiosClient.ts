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
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshResponse = await axiosClient.post('/auth/refresh');
        const refreshData = refreshResponse.data;
        
        if (refreshData.success && refreshData.data) {
          // Retry the original request with new token
          return axiosClient(originalRequest);
        } else {
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        localStorage.removeItem("user_data");
        localStorage.removeItem("auth_token");
        
        // Chỉ redirect nếu không phải trang login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/tglogin')) {
          window.location.href = "/";
        }
        
        return Promise.reject(refreshError);
      }
    } else if (error.code === "ERR_NETWORK") {
      console.log("Server is not responding. Please try again later.");
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
