# IELTS Game - Cloudflare D1 Integration

## Tóm tắt các thay đổi

### 🎯 Những gì đã được cập nhật:

#### 1. **Backend với Cloudflare Worker** (`worker.js`)
- API authentication đầy đủ (đăng ký, đăng nhập, đăng xuất)
- Kết nối với D1 Database để lưu user data
- Hệ thống payment với KV storage
- Session management với token
- CORS configured sẵn

#### 2. **Database Schema** (`schema.sql`)
- Table `users`: Lưu thông tin user, VIP status, question count
- Table `sessions`: Quản lý login sessions
- Table `payments`: Theo dõi giao dịch thanh toán
- Indexes để tối ưu performance

#### 3. **Auth System mới** (`auth-updated.js`)
- Thay localStorage bằng API calls
- Sync data với server
- Payment management
- Token-based authentication

#### 4. **Game UI Updates** (`game-updated.html`)
- Avatar button **nhỏ hơn**: 40px thay vì 50px
- Avatar **chỉ hiển thị ở trang chủ**, ẩn khi đang chơi game
- Popup điều chỉnh vị trí phù hợp với avatar nhỏ hơn

---

## 📋 Các file trong package

```
cloudflare-integration/
│
├── worker.js              # Cloudflare Worker (API Backend)
├── schema.sql             # D1 Database Schema
├── wrangler.toml.example  # Config mẫu cho Worker
├── auth-updated.js        # Auth system mới với API
├── game-updated.html      # Game với avatar nhỏ hơn
├── login.html             # (Giữ nguyên - không thay đổi)
│
├── SETUP_GUIDE.md         # Hướng dẫn chi tiết setup
└── README.md              # File này
```

---

## 🚀 Quick Start

### 1. Tạo D1 Database
```bash
wrangler d1 create ielts-game-db
wrangler d1 execute ielts-game-db --file=schema.sql
```

### 2. Tạo KV Namespace
```bash
wrangler kv:namespace create "PAYMENTS"
```

### 3. Deploy Worker
- Tạo `wrangler.toml` (xem `wrangler.toml.example`)
- Điền database_id và kv_namespace_id
- Deploy: `wrangler deploy`

### 4. Update API URL
- Mở `auth-updated.js`
- Thay `API_URL` bằng URL worker của bạn

### 5. Upload lên Cloudflare Pages
- Upload `game-updated.html` (đổi tên → `game.html`)
- Upload `auth-updated.js` (đổi tên → `auth.js`)
- Upload `login.html`

**Xem chi tiết trong `SETUP_GUIDE.md`**

---

## ✨ Tính năng mới

### User Management
- ✅ Đăng ký/Đăng nhập qua API
- ✅ Lưu user data trên cloud (D1)
- ✅ Session management với token
- ✅ Auto sync question count

### Payment System
- ✅ Tạo payment request
- ✅ Lưu transaction trong database
- ✅ Manual verification qua Zalo
- ✅ Auto upgrade VIP sau verify

### UI Improvements
- ✅ Avatar nhỏ hơn (40x40px)
- ✅ Avatar chỉ hiện ở trang chủ
- ✅ Ẩn avatar khi đang chơi
- ✅ Popup responsive hơn

---

## 💡 So sánh với version cũ

| Feature | Version cũ (localStorage) | Version mới (Cloudflare D1) |
|---------|---------------------------|------------------------------|
| Storage | Browser localStorage | Cloud Database |
| Persistence | Chỉ trên 1 device | Sync mọi device |
| Security | Client-side only | Server-side validated |
| Payment | Manual messaging | Structured flow |
| Scale | Giới hạn | Unlimited |
| Cost | Free | **Vẫn free** với Cloudflare |

---

## 🎨 Thay đổi Avatar

### Kích thước
```css
/* Trước */
width: 50px;
height: 50px;
font-size: 1.8rem;

/* Sau */
width: 40px;
height: 40px;
font-size: 1.4rem;
```

### Hiển thị
```css
/* Ẩn khi đang chơi game */
body.playing #avatarButton {
    display: none;
}
```

### JavaScript
```javascript
// Khi start game
document.body.classList.add('playing');

// Khi về trang chủ
document.body.classList.remove('playing');
```

---

## 🔒 Bảo mật

### Password
- Hashed bằng SHA-256
- Never stored in plain text
- ⚠️ Nên nâng cấp lên bcrypt khi production

### Session
- Token-based authentication
- Auto expire sau 30 ngày
- Stored trong database

### API
- CORS configured
- Input validation
- Rate limiting recommended

---

## 💰 Chi phí Cloudflare Free Plan

| Service | Free Tier Limit |
|---------|----------------|
| Workers | 100,000 requests/day |
| D1 Database | 5GB storage, 5M reads/day |
| Pages | Unlimited bandwidth |
| KV Storage | 100K reads/day |

✅ **Hoàn toàn đủ cho game nhỏ - MIỄN PHÍ 100%**

---

## 📝 Admin Tasks

### Nâng cấp user thành VIP (manual)
```bash
wrangler d1 execute ielts-game-db --command="UPDATE users SET is_vip = 1 WHERE username = 'USERNAME'"
```

### Xem danh sách users
```bash
wrangler d1 execute ielts-game-db --command="SELECT id, username, is_vip, question_count FROM users"
```

### Xem payments chưa verify
```bash
wrangler d1 execute ielts-game-db --command="SELECT * FROM payments WHERE status = 'pending'"
```

### Xác nhận payment
```bash
wrangler d1 execute ielts-game-db --command="UPDATE payments SET status = 'verified' WHERE payment_id = 'PAY123'"
```

---

## 🐛 Troubleshooting

### "Failed to fetch" error
- Kiểm tra API_URL trong auth-updated.js
- Kiểm tra CORS headers trong worker.js
- Clear browser cache

### User không được lưu
- Check worker logs: `wrangler tail`
- Verify database binding trong wrangler.toml
- Kiểm tra schema đã chạy chưa

### Payment không hoạt động
- Kiểm tra KV binding
- Verify namespace ID trong wrangler.toml

**Xem thêm trong `SETUP_GUIDE.md`**

---

## 📞 Support

### Liên hệ Admin
- Zalo: **0343767490**
- Để upgrade VIP, verify payment, technical support

---

## 🎯 Next Steps (Tương lai)

1. **Auto Payment Verification**
   - Tích hợp Banking API
   - Webhook từ bank
   - Auto upgrade VIP

2. **Enhanced Security**
   - Bcrypt password hashing
   - Rate limiting
   - 2FA authentication

3. **Analytics**
   - User activity tracking
   - Game statistics
   - Performance monitoring

4. **Social Features**
   - Leaderboard
   - Achievements
   - User profiles

---

## 📚 Documentation

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

## License

Proprietary - All rights reserved

---

**Chúc bạn deploy thành công! 🚀**
