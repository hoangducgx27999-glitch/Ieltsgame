// auth.js - Đơn giản hơn, kết nối với Pages Function

const AUTH_CONFIG = {
    API_URL: window.location.origin, // Tự động lấy từ domain hiện tại
    FREE_QUESTION_LIMIT: 200, // Tăng từ 100 lên 200
    STORAGE_KEYS: {
        USER_DATA: 'ielts_user_data',
        QUESTION_COUNT: 'ielts_question_count',
        IS_VIP: 'ielts_is_vip'
    }
};

const UserManager = {
    async register(username, password) {
        try {
            const response = await fetch(`${AUTH_CONFIG.API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Lỗi kết nối!' };
        }
    },

    async login(username, password) {
        try {
            const response = await fetch(`${AUTH_CONFIG.API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT, data.user.questionCount.toString());
                localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP, data.user.isVIP.toString());
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Lỗi kết nối!' };
        }
    },

    logout() {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP);
    },

    isLoggedIn() {
        return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA) !== null;
    },

    getCurrentUser() {
        const userData = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER_DATA);
        return userData ? JSON.parse(userData) : null;
    },

    isVIP() {
        return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.IS_VIP) === 'true';
    },

    async updateQuestionCount(count) {
        const user = this.getCurrentUser();
        if (!user) return;

        localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT, count.toString());

        try {
            await fetch(`${AUTH_CONFIG.API_URL}/api/update-count`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user.username, count })
            });
        } catch (error) {
            console.error('Update count error:', error);
        }
    }
};

const QuestionLimitManager = {
    async incrementQuestionCount() {
        if (UserManager.isVIP()) return true;

        let count = parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
        count++;
        
        await UserManager.updateQuestionCount(count);
        
        return count <= AUTH_CONFIG.FREE_QUESTION_LIMIT;
    },

    canPlayMore() {
        if (UserManager.isVIP()) return true;
        const count = parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
        return count < AUTH_CONFIG.FREE_QUESTION_LIMIT;
    },

    getRemainingQuestions() {
        if (UserManager.isVIP()) return Infinity;
        const count = parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
        return Math.max(0, AUTH_CONFIG.FREE_QUESTION_LIMIT - count);
    },

    getPlayedQuestions() {
        return parseInt(localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.QUESTION_COUNT) || '0');
    }
};

const ThemeManager = {
    FREE_THEME: 'gradient',
    VIP_THEMES: ['space', 'ocean', 'sunset', 'forest'],

    isThemeUnlocked(theme) {
        if (theme === this.FREE_THEME) return true;
        return UserManager.isVIP();
    },

    getAvailableThemes() {
        return UserManager.isVIP() ? [this.FREE_THEME, ...this.VIP_THEMES] : [this.FREE_THEME];
    },

    applyTheme(theme) {
        if (!this.isThemeUnlocked(theme)) theme = this.FREE_THEME;
        document.body.classList.remove('theme-gradient', 'theme-space', 'theme-ocean', 'theme-sunset', 'theme-forest');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('ielts_selected_theme', theme);
        return theme;
    },

    getCurrentTheme() {
        return localStorage.getItem('ielts_selected_theme') || this.FREE_THEME;
    }
};
