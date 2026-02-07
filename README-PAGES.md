# IELTS Vocabulary App - Cloudflare Pages (No Worker)

Ứng dụng học từ vựng IELTS - Phiên bản đơn giản chỉ cần Cloudflare Pages, không cần Worker hay D1 Database.

## 🚀 Tính năng

### ✨ Tài khoản FREE
- ✅ Chơi 100 câu hỏi
- ✅ Giao diện mặc định (gradient)
- ✅ Lưu tiến độ trong localStorage
- ✅ Theo dõi từ yêu thích
- ✅ Ghi nhận câu sai

### 💎 Tài khoản VIP
- ⭐ Không giới hạn số câu hỏi
- ⭐ Mở khóa tất cả giao diện (Space, Ocean, Sunset, Forest)
- ⭐ Tất cả tính năng FREE

### 📱 Liên hệ nâng cấp VIP
**Zalo: 0343767490** (Nhà phát hành)

## 📁 Cấu trúc thư mục

```
ielts-vocabulary-app/
├── index.html       # Trang game chính
├── login.html       # Trang đăng nhập/đăng ký
├── auth.js          # Xử lý authentication
└── README.md        # Tài liệu này
```

## 🛠️ Hướng dẫn deploy lên Cloudflare Pages

### Cách 1: Deploy từ GitHub (Khuyên dùng)

1. **Tạo GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ielts-vocabulary.git
   git push -u origin main
   ```

2. **Deploy lên Cloudflare Pages**
   - Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Vào **Workers & Pages** → **Create application**
   - Chọn **Pages** → **Connect to Git**
   - Chọn repository vừa tạo
   - Build settings:
     - **Build command**: để trống
     - **Build output directory**: `/`
   - Click **Save and Deploy**

3. **Hoàn thành!**
   - Cloudflare sẽ deploy và cung cấp URL: `https://your-project.pages.dev`
   - Mỗi lần push code mới, tự động deploy lại

### Cách 2: Deploy trực tiếp (Không cần Git)

1. **Đăng nhập Cloudflare**
   - Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Chọn **Workers & Pages** → **Create application**

2. **Upload files**
   - Chọn **Pages** → **Upload assets**
   - Kéo thả 3 files: `index.html`, `login.html`, `auth.js`
   - Đặt tên project
   - Click **Deploy site**

3. **Hoàn thành!**
   - Truy cập URL được cung cấp

## 📖 Cách sử dụng

### 1. Đăng ký tài khoản
- Truy cập `login.html`
- Click tab "Đăng ký"
- Nhập tên đăng nhập (3-20 ký tự) và mật khẩu (tối thiểu 6 ký tự)
- Click "Đăng ký"

### 2. Đăng nhập
- Nhập tên đăng nhập và mật khẩu
- Click "Đăng nhập"
- Tự động chuyển sang game

### 3. Chơi không cần đăng nhập
- Click "Chơi với tư cách khách"
- Giới hạn: 100 câu, giao diện mặc định
- Tiến độ lưu trong trình duyệt (mất khi xóa cache)

### 4. Nâng cấp VIP
- Liên hệ Zalo: **0343767490**
- Cung cấp tên đăng nhập
- Nhận tài khoản VIP với đầy đủ tính năng

## 🔐 Bảo mật & Lưu trữ

### LocalStorage được sử dụng để lưu:
- **Thông tin user**: Username, trạng thái VIP
- **Tiến độ**: Số câu đã chơi, điểm số, độ chính xác
- **Từ yêu thích**: Danh sách từ đã lưu
- **Câu sai**: Lịch sử câu trả lời sai
- **Database user**: Tất cả tài khoản (hash password đơn giản)

⚠️ **Lưu ý**: 
- Dữ liệu lưu trong trình duyệt
- Xóa cache/cookies sẽ mất dữ liệu
- Mỗi trình duyệt/thiết bị có dữ liệu riêng

## 🎨 Giao diện có sẵn

### FREE User
- **Gradient** (mặc định) - Gradient màu tím xanh

### VIP User (Unlock all)
- **Space** - Không gian với sao lấp lánh
- **Ocean** - Đại dương với bong bóng
- **Sunset** - Hoàng hôn ấm áp
- **Forest** - Rừng xanh mát

## 🎮 Chế độ chơi

1. **🔊 Phát âm** - Nghe và chọn từ đúng
2. **🎯 EN→VI** - Dịch tiếng Anh sang tiếng Việt
3. **✍️ VI→EN** - Dịch tiếng Việt sang tiếng Anh
4. **📝 Điền từ** - Điền từ vào câu ví dụ

## 📊 Tính năng đặc biệt

- ✅ 3500 từ vựng IELTS (Band 5.0-7.0)
- ✅ Từ điển tích hợp với phát âm
- ✅ Lưu từ yêu thích
- ✅ Theo dõi câu sai
- ✅ Thống kê tiến độ học
- ✅ Responsive cho mobile
- ✅ Hoạt động offline (sau lần tải đầu tiên)

## 🔧 Tùy chỉnh

### Thay đổi giới hạn FREE user
Mở `auth.js` và sửa:
```javascript
const AUTH_CONFIG = {
    FREE_QUESTION_LIMIT: 100, // Thay đổi số này
    // ...
};
```

### Thay đổi theme mặc định
Mở `auth.js` và sửa:
```javascript
const ThemeManager = {
    FREE_THEME: 'gradient', // Thay bằng: space, ocean, sunset, forest
    // ...
};
```

## 🆘 Troubleshooting

### Không đăng nhập được
- Kiểm tra username/password
- Xóa localStorage và đăng ký lại: `localStorage.clear()`

### Mất tiến độ
- Kiểm tra không xóa cache/cookies
- Đăng nhập lại bằng tài khoản cũ

### Không mở khóa được theme VIP
- Kiểm tra trạng thái VIP: Mở Console và gõ `UserManager.isVIP()`
- Test VIP: Mở Console và gõ `UserManager.upgradeToVIP()`

### Reset số câu đã chơi (Testing)
Mở Console và gõ:
```javascript
QuestionLimitManager.resetCount()
```

## 📱 Custom Domain

### Thêm domain của bạn
1. Vào Cloudflare Pages Dashboard
2. Chọn project → **Custom domains**
3. Click **Set up a custom domain**
4. Nhập domain của bạn
5. Follow hướng dẫn cấu hình DNS

## 💡 Tips

### Backup dữ liệu
```javascript
// Export tất cả dữ liệu
const backup = {
    users: localStorage.getItem('ielts_users_db'),
    favorites: localStorage.getItem('ielts_favorites'),
    mistakes: localStorage.getItem('ielts_mistakes')
};
console.log(JSON.stringify(backup));
// Copy và lưu lại
```

### Restore dữ liệu
```javascript
// Paste backup object vào đây
const backup = { /* paste here */ };
localStorage.setItem('ielts_users_db', backup.users);
localStorage.setItem('ielts_favorites', backup.favorites);
localStorage.setItem('ielts_mistakes', backup.mistakes);
```

## 📞 Liên hệ

### Nâng cấp VIP
- 📱 **Zalo: 0343767490**
- 💬 Nhà phát hành

### Báo lỗi / Góp ý
- Liên hệ qua Zalo
- Hoặc tạo Issue trên GitHub

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

---

**Chúc bạn học tốt! 📚✨**
