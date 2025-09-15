# Hướng dẫn sử dụng tính năng Login Email

## Tổng quan

Tính năng login email đã được implement hoàn chỉnh với Google OAuth 2.0, bao gồm:

- ✅ Google OAuth login với authorization code flow
- ✅ UI đầy đủ cho trang login email
- ✅ Integration với AuthContext và useAuth hook
- ✅ Profile API endpoint
- ✅ Error handling và loading states
- ✅ Responsive design

## Cấu hình

### 1. Environment Variables

Tạo file `.env.local` với các biến sau:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://dp7vlq3z-8000.asse.devtunnels.ms

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 2. Google OAuth Setup

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Google+ API
4. Tạo OAuth 2.0 credentials
5. Thêm authorized redirect URIs:
   - `http://localhost:3000/login-email` (development)
   - `https://yourdomain.com/login-email` (production)

## Cách sử dụng

### 1. Trang Login Email

Truy cập `/login-email` để thực hiện Google OAuth login:

- Tự động redirect đến Google OAuth
- Xử lý callback với authorization code
- Hiển thị kết quả login (success/error)
- Tự động redirect về trang chủ sau khi thành công

### 2. Google Login Button Component

Sử dụng `GoogleLoginButton` component:

```tsx
import GoogleLoginButton from '@/components/GoogleLoginButton';

// Sử dụng với text mặc định
<GoogleLoginButton />

// Sử dụng với text tùy chỉnh
<GoogleLoginButton className="w-full">
  Đăng nhập với Google
</GoogleLoginButton>
```

### 3. Auth Hook Methods

Sử dụng các methods trong `useAuth` hook:

```tsx
import { useAuth } from '@/hooks/useAuth';

const { 
  loginWithGoogle,    // Google OAuth login
  loginWithTelegram,  // Telegram login
  getProfile,         // Lấy thông tin profile
  logout,             // Đăng xuất
  user,               // Thông tin user hiện tại
  isAuthenticated,    // Trạng thái đăng nhập
  isLoading,          // Trạng thái loading
  error               // Lỗi nếu có
} = useAuth();

// Google login
const handleGoogleLogin = async (code: string) => {
  const result = await loginWithGoogle({ code });
  if (result.success) {
    console.log('Login thành công:', result.user);
  }
};

// Lấy profile
const handleGetProfile = async () => {
  const result = await getProfile();
  if (result.success) {
    console.log('Profile:', result.user);
  }
};
```

## API Endpoints

### 1. Google Login
```
POST /auth/login/google
Content-Type: application/json

{
  "code": "authorization_code_from_google"
}
```

### 2. Get Profile
```
GET /auth/me
Cookie: accessToken=...; refreshToken=...
```

### 3. Logout
```
GET /auth/logout
Cookie: accessToken=...; refreshToken=...
```

## Cấu trúc Files

```
src/
├── services/api/
│   ├── GoogleService.ts          # Google OAuth service
│   └── TelegramWalletService.ts  # Telegram service (updated)
├── hooks/
│   └── useAuth.ts                # Auth hook (updated)
├── contexts/
│   └── AuthContext.tsx           # Auth context (updated)
├── components/
│   ├── GoogleLoginButton.tsx     # Google login button
│   └── LoginDemo.tsx             # Demo component
└── app/
    ├── login-email/
    │   └── page.tsx              # Email login page
    └── page.tsx                  # Home page (updated)
```

## Error Handling

Hệ thống xử lý các loại lỗi:

- **UNAUTHORIZED**: Token không hợp lệ
- **BAD_REQUEST**: Tham số request không đúng
- **USER_NOT_FOUND**: Không tìm thấy user
- **VERIFICATION_FAILED**: Xác thực thất bại
- **INTERNAL_SERVER_ERROR**: Lỗi server

## Security Features

- ✅ HttpOnly cookies cho tokens
- ✅ Secure cookies trong production
- ✅ SameSite=strict
- ✅ Auto token refresh
- ✅ CSRF protection

## Testing

1. **Development**: `npm run dev`
2. Truy cập `http://localhost:3000`
3. Click "Đăng nhập với Google"
4. Hoặc truy cập trực tiếp `http://localhost:3000/login-email`

## Troubleshooting

### Lỗi thường gặp:

1. **"Invalid client_id"**: Kiểm tra `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. **"Redirect URI mismatch"**: Kiểm tra authorized redirect URIs
3. **"Access denied"**: User từ chối authorization
4. **"Network error"**: Kiểm tra `NEXT_PUBLIC_API_URL`

### Debug:

```tsx
// Enable debug logging
console.log('Google Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```
