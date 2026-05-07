/* =========================================
   1. فحص حالة الدخول وتحديث الهيدر
   ========================================= */
function updateHeaderUI() {
    const authArea = document.getElementById('user-auth-area');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    console.log("Checking Login Status:", isLoggedIn, userName); // للتأكد في الـ Console

    if (isLoggedIn === 'true' && userName && authArea) {
        // إذا كان مسجل دخول، امسح "Sign In" وضع "Welcome" مع أيقونة البروفايل
        authArea.innerHTML = `
            <a href="profile.html" class="user-link-item" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-circle-user" style="color: #ff6b35; font-size: 22px;"></i>
                <span style="font-weight: 800;">Welcome, <span style="color: #ff6b35;">${userName}</span></span>
            </a>
        `;
    }
}

/* =========================================
   2. تحديث عداد السلة
   ========================================= */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countBadge = document.getElementById('cart-count');
    if (countBadge) {
        countBadge.innerText = cart.length;
    }
}

/* =========================================
   3. تشغيل الوظائف عند تحميل الصفحة
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderUI();
    updateCartCount();
    
    // أنيميشن الهيرو
    const content = document.querySelector('.hero-content');
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        setTimeout(() => {
            content.style.transition = 'all 1s ease-out';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 200);
    }
});

/* =========================================
   4. تأثير السكرول للهيدر
   ========================================= */
window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// دالة تسجيل الخروج (تستخدم في صفحة البروفايل)
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }
}