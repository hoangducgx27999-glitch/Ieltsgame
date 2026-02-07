// Client-side Authentication & Storage (No Worker Required)
// Using localStorage for demo purposes

const AUTH_CONFIG = {
    FREE_QUESTION_LIMIT: 100,
    STORAGE_KEYS: {
        USER_DATA: 'ielts_user_data',
        QUESTION_COUNT: 'ielts_question_count',
        IS_VIP: 'ielts_is_vip',
        THEME_UNLOCKED: 'ielts_theme_unlocked'
    }
};

// User management
const UserManager = {
    // Đăng ký
    register(username, password) {
        // Kiểm tra username đã tồn tại
        const users = this.getAllUsers();
        if (users[username]) {
            return { success: false, message: 'Tên đăng nhập đã tồn tại!' };
        }

        // Validation
        if (username.length < 3 || username.length > 20) {
            return { success: false, message: 'Tên đăng nhập phải từ 3-20 ký tự!' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự!' };
        }

        // Lưu user mới
        users[username] = {
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            isVIP: false,
            questionCount: 0,
            stats: {
                totalWords: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                accuracy: 0,
                streak: 0
            }
        };

        localStorage.setItem('ielts_users_db', JSON.stringify(users));
        return { success: true, message: 'Đăng ký thành công!' };
    },

    // Đăng nhập
    login(username, password) {
        const users = this.getAllUsers();
        const user = users[username];

        if (!user) {
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' };
        }

        // Lưu session
        const session = {
            username: username,
            isVIP: user.isVIP,
            loginAt: new Date().toISOString()
        };

        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(session));
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT, user.questionCount.toString());
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP, user.isVIP.toString());

        return { 
            success: true, 
            message: 'Đăng nhập thành công!',
            user: session
        };
    },

    // Đăng xuất
    logout() {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.THEME_UNLOCKED);
    },

    // Kiểm tra đăng nhập
    isLoggedIn() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
        return userData !== null;
    },

    // Lấy user hiện tại
    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    },

    // Kiểm tra VIP
    isVIP() {
        const isVIP = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP);
        return isVIP === 'true';
    },

    // Lấy tất cả users (từ localStorage)
    getAllUsers() {
        const usersData = localStorage.getItem('ielts_users_db');
        return usersData ? JSON.parse(usersData) : {};
    },

    // Hash password đơn giản (demo only)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    },

    // Cập nhật stats
    updateStats(stats) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;

        const users = this.getAllUsers();
        if (users[currentUser.username]) {
            users[currentUser.username].stats = stats;
            localStorage.setItem('ielts_users_db', JSON.stringify(users));
        }
    },

    // Nâng cấp VIP
    upgradeToVIP() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const users = this.getAllUsers();
        if (users[currentUser.username]) {
            users[currentUser.username].isVIP = true;
            localStorage.setItem('ielts_users_db', JSON.stringify(users));
            
            // Update session
            currentUser.isVIP = true;
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(currentUser));
            localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP, 'true');
            
            return true;
        }
        return false;
    }
};

// Question limit manager
const QuestionLimitManager = {
    // Tăng số câu đã chơi
    incrementQuestionCount() {
        if (UserManager.isVIP()) {
            return true; // VIP không giới hạn
        }

        let count = parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
        count++;
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT, count.toString());

        // Cập nhật vào user database
        const currentUser = UserManager.getCurrentUser();
        if (currentUser) {
            const users = UserManager.getAllUsers();
            if (users[currentUser.username]) {
                users[currentUser.username].questionCount = count;
                localStorage.setItem('ielts_users_db', JSON.stringify(users));
            }
        }

        return count <= AUTH_CONFIG.FREE_QUESTION_LIMIT;
    },

    // Kiểm tra còn câu hỏi không
    canPlayMore() {
        if (UserManager.isVIP()) {
            return true;
        }

        const count = parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
        return count < AUTH_CONFIG.FREE_QUESTION_LIMIT;
    },

    // Lấy số câu còn lại
    getRemainingQuestions() {
        if (UserManager.isVIP()) {
            return Infinity;
        }

        const count = parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
        return Math.max(0, AUTH_CONFIG.FREE_QUESTION_LIMIT - count);
    },

    // Lấy số câu đã chơi
    getPlayedQuestions() {
        return parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
    },

    // Reset count (chỉ dùng khi test)
    resetCount() {
        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT, '0');
        
        const currentUser = UserManager.getCurrentUser();
        if (currentUser) {
            const users = UserManager.getAllUsers();
            if (users[currentUser.username]) {
                users[currentUser.username].questionCount = 0;
                localStorage.setItem('ielts_users_db', JSON.stringify(users));
            }
        }
    }
};

// Theme manager
const ThemeManager = {
    FREE_THEME: 'gradient', // Theme mặc định cho free user
    
    VIP_THEMES: ['space', 'ocean', 'sunset', 'forest'],

    // Kiểm tra theme có được unlock không
    isThemeUnlocked(theme) {
        if (theme === this.FREE_THEME) {
            return true; // Theme mặc định luôn unlock
        }

        if (UserManager.isVIP()) {
            return true; // VIP unlock tất cả
        }

        return false; // Free user chỉ dùng được theme mặc định
    },

    // Lấy danh sách themes khả dụng
    getAvailableThemes() {
        if (UserManager.isVIP()) {
            return [this.FREE_THEME, ...this.VIP_THEMES];
        }
        return [this.FREE_THEME];
    },

    // Apply theme
    applyTheme(theme) {
        if (!this.isThemeUnlocked(theme)) {
            theme = this.FREE_THEME; // Fallback về theme mặc định
        }

        // Remove all theme classes
        document.body.classList.remove('theme-gradient', 'theme-space', 'theme-ocean', 'theme-sunset', 'theme-forest');
        
        // Add selected theme
        document.body.classList.add(`theme-${theme}`);
        
        // Save preference
        localStorage.setItem('ielts_selected_theme', theme);

        return theme;
    },

    // Get current theme
    getCurrentTheme() {
        const saved = localStorage.getItem('ielts_selected_theme');
        return saved || this.FREE_THEME;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserManager, QuestionLimitManager, ThemeManager, AUTH_CONFIG };
}
