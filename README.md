# 🚀 IELTS Vocabulary - Deploy Cloudflare Pages

## 📦 Files trong dự án (ĐÃ SẴN SÀNG DEPLOY!)

```
✅ index.html        # Trang chủ (Landing page)
✅ login.html        # Đăng nhập/Đăng ký  
✅ game.html         # Game chính
✅ auth.js           # Authentication & VIP
✅ _redirects        # Cloudflare config
```

**Tất cả files đã được chuẩn bị sẵn, chỉ cần upload lên!**

---

## 🚀 CÁCH DEPLOY - CỰC KỲ ĐơN GIẢN!

### 🎯 Cách 1: Upload trực tiếp (5 PHÚT)

1. **Vào Cloudflare**
   - Truy cập: https://dash.cloudflare.com
   - Đăng nhập (hoặc đăng ký miễn phí)

2. **Tạo Pages**
   - Click: **Workers & Pages** (menu bên trái)
   - Click: **Create application**
   - Chọn: **Pages** tab
   - Click: **Upload assets**

3. **Upload files**
   - Kéo thả 5 files vào:
     - ✅ index.html
     - ✅ login.html  
     - ✅ game.html
     - ✅ auth.js
     - ✅ _redirects (có thể bỏ qua)
   - Đặt tên project (vd: `ielts-vocab`)
   - Click **Deploy site**

4. **XONG!** 🎉
   - Đợi 30 giây
   - Truy cập URL: `https://ielts-vocab.pages.dev`

---

### 🎯 Cách 2: Deploy từ GitHub (TỰ ĐỘNG)

```bash
# 1. Khởi tạo Git
git init
git add .
git commit -m "Initial commit"

# 2. Push lên GitHub (tạo repo trước trên GitHub.com)
git branch -M main  
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# 3. Connect Cloudflare Pages
# - Vào https://dash.cloudflare.com
# - Workers & Pages → Create → Connect to Git
# - Chọn repo → Deploy
```

**Lợi ích**: Mỗi lần push code mới tự động deploy lại!

---

## 🎮 Cấu trúc Website

```
https://your-site.pages.dev/
├── /              → Trang chủ (index.html)
├── /login.html    → Đăng nhập  
└── /game.html     → Game
```

**Flow người dùng:**
1. Vào trang chủ → Click "Bắt đầu học" hoặc "Đăng nhập"
2. Đăng ký/Đăng nhập (hoặc chơi với tư cách khách)
3. Vào game → Bắt đầu học!

---

## ✨ Tính năng đã hoàn thiện

### 🆓 FREE User
- ✅ Chơi **100 câu hỏi**
- ✅ Giao diện **Gradient** (mặc định)
- ✅ Lưu tiến độ, từ yêu thích, câu sai
- ✅ Hiển thị số câu còn lại trên màn hình

### 💎 VIP User  
- ⭐ **Không giới hạn** câu hỏi
- ⭐ **Mở khóa tất cả theme** (Space, Ocean, Sunset, Forest)
- ⭐ Tất cả tính năng đầy đủ

### 📱 Nâng cấp VIP
**Liên hệ Zalo: 0343767490**

---

## 🔧 Quản lý VIP

### Cách nâng cấp user lên VIP:

1. User liên hệ **Zalo: 0343767490** với username
2. Hướng dẫn user mở Console (F12) và chạy:
   ```javascript
   UserManager.upgradeToVIP()
   ```
3. Reload trang → Đã là VIP! ⭐

### Kiểm tra trạng thái:
```javascript
// Kiểm tra VIP
UserManager.isVIP()  // true/false

// Xem số câu còn lại
QuestionLimitManager.getRemainingQuestions()

// Reset số câu (testing)
QuestionLimitManager.resetCount()
```

---

## 🆘 Khắc phục sự cố

| Vấn đề | Giải pháp |
|--------|-----------|
| Không vào được game sau khi đăng nhập | Kiểm tra file `game.html` đã upload chưa |
| Lỗi "Cannot find auth.js" | Upload lại file `auth.js` |
| Không đăng nhập được | F12 → Console xem lỗi, thử `localStorage.clear()` |
| Mất tiến độ | Không xóa cookies/cache, dùng cùng trình duyệt |
| Theme VIP bị khóa | Chạy `UserManager.upgradeToVIP()` trong Console |

---

## 🎨 Tùy chỉnh (Tùy chọn)

### Thay đổi giới hạn FREE

File `auth.js`, dòng 3:
```javascript
FREE_QUESTION_LIMIT: 100, // Đổi thành 200, 500, v.v.
```

### Thay đổi theme mặc định

File `auth.js`, dòng 155:
```javascript
FREE_THEME: 'gradient', // Đổi: space, ocean, sunset, forest
```

---

## 📱 Custom Domain

1. Cloudflare Pages → Chọn project
2. **Custom domains** → Set up a domain
3. Nhập domain (vd: `vocabulary.com`)
4. Cấu hình DNS theo hướng dẫn
5. Đợi 5-10 phút → Xong!

---

## 📞 Liên hệ & Hỗ trợ

### 💎 Nâng cấp VIP
**Zalo: 0343767490**

### 🐛 Báo lỗi / Hỗ trợ kỹ thuật  
**Zalo: 0343767490**

---

## ✅ Checklist Deploy

- [x] Files đã sẵn sàng (index.html, login.html, game.html, auth.js)
- [ ] Upload lên Cloudflare Pages
- [ ] Test: Vào `/` → Trang chủ hiển thị OK
- [ ] Test: Click "Đăng nhập" → Trang login OK
- [ ] Test: Đăng ký tài khoản → Thành công
- [ ] Test: Đăng nhập → Vào game OK
- [ ] Test: Chơi 1 câu → Đếm số câu còn lại
- [ ] Test: Nâng cấp VIP → Mở khóa theme

---

**🎉 Chúc bạn deploy thành công!**

Mọi thắc mắc liên hệ **Zalo: 0343767490**
