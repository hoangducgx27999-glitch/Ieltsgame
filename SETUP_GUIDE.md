# Hướng dẫn triển khai Game IELTS lên Cloudflare

## 1. Chuẩn bị

### Yêu cầu:
- Tài khoản Cloudflare (miễn phí)
- Wrangler CLI đã cài đặt
- Node.js version 16+

### Cài đặt Wrangler:
```bash
npm install -g wrangler
```

### Đăng nhập Cloudflare:
```bash
wrangler login
```

---

## 2. Tạo D1 Database

### Bước 1: Tạo database mới
```bash
wrangler d1 create ielts-game-db
```

Sau khi chạy lệnh, bạn sẽ nhận được một ID database. **Lưu lại ID này!**

Ví dụ output:
```
✅ Successfully created DB 'ielts-game-db'
📋 Database ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Bước 2: Chạy schema để tạo tables
```bash
wrangler d1 execute ielts-game-db --file=schema.sql
```

### Bước 3: Kiểm tra database
```bash
wrangler d1 execute ielts-game-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

## 3. Tạo KV Namespace (cho payments)

```bash
wrangler kv:namespace create "PAYMENTS"
```

Lưu lại **namespace ID** nhận được.

---

## 4. Cấu hình Worker

### Bước 1: Tạo file `wrangler.toml`

Tạo file `wrangler.toml` trong thư mục project với nội dung:

```toml
name = "ielts-game-api"
main = "worker.js"
compatibility_date = "2024-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "ielts-game-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Thay bằng ID từ bước 2.1

# KV namespace binding
[[kv_namespaces]]
binding = "PAYMENTS"
id = "YOUR_KV_NAMESPACE_ID_HERE"  # Thay bằng ID từ bước 3

# CORS settings
[env.production]
vars = { ENVIRONMENT = "production" }
```

**Lưu ý:** Thay `YOUR_DATABASE_ID_HERE` và `YOUR_KV_NAMESPACE_ID_HERE` bằng các ID thực tế.

### Bước 2: Deploy Worker
```bash
wrangler deploy
```

Sau khi deploy thành công, bạn sẽ nhận được URL worker:
```
https://ielts-game-api.YOUR_USERNAME.workers.dev
```

---

## 5. Cập nhật file auth-updated.js

Mở file `auth-updated.js` và thay đổi dòng này:

```javascript
const AUTH_CONFIG = {
    API_URL: 'https://ielts-game-api.YOUR_USERNAME.workers.dev', // THAY ĐỔI URL NÀY
    // ...
};
```

Thay bằng URL worker thực tế của bạn.

---

## 6. Upload các file lên Cloudflare Pages

### Bước 1: Tạo project Pages
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn **Pages** > **Create a project**
3. Chọn **Upload assets**

### Bước 2: Upload các file
Upload các file sau:
- `game-updated.html` → đổi tên thành `game.html`
- `auth-updated.js` → đổi tên thành `auth.js`
- `login.html` (giữ nguyên)

### Bước 3: Deploy
- Click **Save and Deploy**
- Đợi deploy hoàn tất
- Bạn sẽ có URL như: `https://your-project.pages.dev`

---

## 7. Cấu hình Custom Domain (Tùy chọn)

### Nếu bạn có domain riêng:
1. Vào **Pages** > Chọn project
2. Chọn **Custom domains**
3. Add domain của bạn
4. Cấu hình DNS theo hướng dẫn

---

## 8. Test hệ thống

### Test đăng ký:
1. Truy cập `https://your-project.pages.dev/login.html`
2. Đăng ký tài khoản mới
3. Kiểm tra trong D1 database:
```bash
wrangler d1 execute ielts-game-db --command="SELECT * FROM users"
```

### Test đăng nhập:
1. Đăng nhập với tài khoản vừa tạo
2. Chơi game và kiểm tra question count có tăng không

### Test VIP upgrade:
1. Tạo một payment request
2. Kiểm tra trong KV:
```bash
wrangler kv:key list --namespace-id=YOUR_KV_NAMESPACE_ID
```

---

## 9. Quản lý Database

### Xem tất cả users:
```bash
wrangler d1 execute ielts-game-db --command="SELECT id, username, is_vip, question_count FROM users"
```

### Nâng cấp user thành VIP (manual):
```bash
wrangler d1 execute ielts-game-db --command="UPDATE users SET is_vip = 1 WHERE username = 'USERNAME'"
```

### Xem payments:
```bash
wrangler d1 execute ielts-game-db --command="SELECT * FROM payments ORDER BY created_at DESC LIMIT 10"
```

### Xác nhận payment và nâng cấp VIP:
```bash
# 1. Cập nhật payment status
wrangler d1 execute ielts-game-db --command="UPDATE payments SET status = 'verified', verified_at = datetime('now') WHERE payment_id = 'PAYMENT_ID'"

# 2. Nâng cấp user
wrangler d1 execute ielts-game-db --command="UPDATE users SET is_vip = 1 WHERE id = USER_ID"
```

---

## 10. Backup Database

### Export database:
```bash
wrangler d1 export ielts-game-db --output=backup.sql
```

### Restore database:
```bash
wrangler d1 execute ielts-game-db --file=backup.sql
```

---

## 11. Monitoring và Logs

### Xem logs của Worker:
```bash
wrangler tail
```

### Xem analytics:
1. Vào [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Chọn **Workers & Pages**
3. Chọn worker của bạn
4. Xem **Analytics**

---

## 12. Troubleshooting

### Lỗi CORS:
- Kiểm tra worker.js có CORS headers đúng không
- Refresh cache của browser

### Lỗi kết nối database:
- Kiểm tra database_id trong wrangler.toml
- Kiểm tra binding name (phải là "DB")

### User không được lưu:
- Check worker logs: `wrangler tail`
- Kiểm tra schema đã chạy chưa
- Kiểm tra API URL trong auth.js

### Payment không hoạt động:
- Kiểm tra KV namespace binding
- Kiểm tra KV namespace ID trong wrangler.toml

---

## 13. Chi phí

### Cloudflare Free Plan bao gồm:
- **Workers**: 100,000 requests/day
- **D1 Database**: 
  - 5 GB storage
  - 5 million rows read/day
  - 100,000 rows written/day
- **Pages**: Unlimited bandwidth
- **KV**: 
  - 100,000 reads/day
  - 1,000 writes/day

✅ **Hoàn toàn miễn phí cho game nhỏ!**

---

## 14. Bảo mật

### Recommendations:
1. **Password hashing**: Worker hiện dùng SHA-256, nên nâng cấp lên bcrypt khi scale
2. **Rate limiting**: Thêm rate limit cho register/login
3. **Input validation**: Đã có sẵn trong worker
4. **Session expiry**: Sessions tự động hết hạn sau 30 ngày

### Để thêm rate limiting:
```javascript
// Thêm vào worker.js
const RATE_LIMIT = 5; // 5 requests per minute
const rateLimitCache = new Map();

async function checkRateLimit(ip) {
    const now = Date.now();
    const key = `rate_${ip}`;
    const requests = rateLimitCache.get(key) || [];
    const recent = requests.filter(t => now - t < 60000);
    
    if (recent.length >= RATE_LIMIT) {
        return false;
    }
    
    recent.push(now);
    rateLimitCache.set(key, recent);
    return true;
}
```

---

## 15. Liên hệ Admin

### Khi user chuyển khoản:
1. User sẽ contact qua Zalo: 0343767490
2. Admin check banking app
3. Admin chạy command nâng cấp VIP (bước 9)

### Tự động hóa (nâng cao):
- Tích hợp Banking API (MB Bank API, Vietcombank API)
- Webhook từ bank khi có giao dịch
- Tự động verify và upgrade VIP

---

## Tóm tắt các file

```
project/
├── worker.js              # Cloudflare Worker API backend
├── schema.sql             # Database schema
├── wrangler.toml          # Worker configuration
├── auth-updated.js        # Auth với API calls
├── game-updated.html      # Game với avatar nhỏ hơn
└── login.html             # Login/Register page
```

---

## Hoàn tất!

Bây giờ game của bạn đã:
✅ Lưu user data trên Cloudflare D1
✅ Authentication hoàn chỉnh
✅ Payment flow sẵn sàng
✅ Avatar nhỏ hơn, chỉ hiện trang chủ
✅ Hoàn toàn miễn phí với Cloudflare

Chúc bạn thành công! 🎉
