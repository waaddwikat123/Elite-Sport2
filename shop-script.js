document.addEventListener('DOMContentLoaded', () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card');
    const footerLinks = document.querySelectorAll('#footer-filter-links a');

    // وظيفة الفلترة
    function applyFilter(cat) {
        filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === cat));
        cards.forEach(c => {
            c.style.display = (cat === 'all' || c.dataset.category === cat) ? 'block' : 'none';
        });
    }

    // فلتر الأزرار العلوية
    filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));

    // فلتر الفوتر
    footerLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        applyFilter(link.dataset.filter);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }));

    // التحقق من الرابط (Filter from Home)
    const urlFilter = new URLSearchParams(window.location.search).get('filter');
    if (urlFilter) applyFilter(urlFilter);
});

// وظيفة إضافة للسلة + التحقق من اللوجن + أنيميشن
document.addEventListener('DOMContentLoaded', () => {
    // تحديث عداد السلة عند التحميل
    updateCartBadge();

    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.product-card');
    const footerLinks = document.querySelectorAll('#footer-filter-links a');

    // --- نظام الفلترة ---
    function applyFilter(category) {
        filterBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category));
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (category === 'all' || cardCat === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
    footerLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        applyFilter(link.dataset.filter);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    }));
});

// --- وظيفة إضافة للسلة مع أنيميشن وتحقق من اللوجن ---
function addToCart(event, name, price, img) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        alert("🔒 Please Sign In first to add items to your cart!");
        localStorage.setItem('pendingItem', JSON.stringify({ name, price, img }));
        window.location.href = 'signin.html';
        return;
    }

    const btn = event.currentTarget;
    const cartIcon = document.querySelector('.cart-icon');
    
    // إحداثيات الأنيميشن
    const btnRect = btn.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyer = document.createElement('div');
    flyer.className = 'flying-item';
    document.body.appendChild(flyer);

    flyer.style.left = `${btnRect.left}px`;
    flyer.style.top = `${btnRect.top}px`;

    setTimeout(() => {
        flyer.style.left = `${cartRect.left}px`;
        flyer.style.top = `${cartRect.top}px`;
        flyer.style.transform = 'scale(0.2)';
        flyer.style.opacity = '0';
    }, 50);

    setTimeout(() => {
        flyer.remove();
        
        // حفظ في السلة مع الصورة
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ name, price, img, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartBadge();
        cartIcon.classList.add('cart-shake');
        setTimeout(() => cartIcon.classList.remove('cart-shake'), 400);
    }, 800);
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.length;
}

// --- وظائف الـ AI Modal ---
function startSmartAI() { document.getElementById('aiModal').style.display = 'flex'; }
function closeAIModal() { document.getElementById('aiModal').style.display = 'none'; }
function setGoal(goal) { document.getElementById('aiInput').value = goal; }

function processAIRecommendation() {
    const goal = document.getElementById('aiInput').value.toLowerCase();
    closeAIModal();
    let cat = goal.includes('muscle') ? 'strength' : goal.includes('yoga') ? 'yoga' : 'cardio';
    
    document.getElementById('ai-status').innerText = "Recommendation Ready! ✨";
    document.getElementById('ai-msg').innerHTML = `AI Suggests gear from <b>${cat.toUpperCase()}</b> category.`;
    
    const target = document.querySelector(`[data-category="${cat}"]`);
    target.classList.add('ai-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// وظائف الـ AI Modal
function startSmartAI() { document.getElementById('aiModal').style.display = 'flex'; }
function closeAIModal() { document.getElementById('aiModal').style.display = 'none'; }
function setGoal(goal) { document.getElementById('aiInput').value = goal; }

function processAIRecommendation() {
    const goal = document.getElementById('aiInput').value.toLowerCase();
    closeAIModal();
    const status = document.getElementById('ai-status');
    const msg = document.getElementById('ai-msg');
    
    status.innerText = "AI is thinking...";
    setTimeout(() => {
        let cat = goal.includes('muscle') ? 'strength' : goal.includes('yoga') ? 'yoga' : 'cardio';
        status.innerText = "Recommendation Ready! ✨";
        msg.innerHTML = `AI Suggests: Gear from the <b>${cat.toUpperCase()}</b> category.`;
        const firstCard = document.querySelector(`[data-category="${cat}"]`);
        firstCard.classList.add('ai-highlight');
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1000);
}
document.addEventListener('DOMContentLoaded', () => {
    // تشغيل الفحص بمجرد فتح أي صفحة
    const userText = document.getElementById('user-name-text');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    console.log("Checking login...", isLoggedIn, userName); // للـ Debugging

    if (isLoggedIn === 'true' && userName) {
        if (userText) {
            userText.innerHTML = `Welcome, <span style="color: #ff6b35;">${userName}</span>`;
        }
    }
});
function checkLoginStatus() {
    const userText = document.getElementById('user-name-text');
    const userLink = document.getElementById('user-link');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    if (isLoggedIn === 'true' && userName) {
        // تغيير النص ليصبح مرحباً بالمستخدم
        userText.innerHTML = `Welcome, <b style="color: #ff6b35;">${userName}</b>`;
        
        // اختيارياً: تغيير الرابط ليوجه لصفحة البروفايل أو تسجيل الخروج
        userLink.href = "#"; 
        
        // إضافة زر تسجيل خروج صغير عند الضغط عليه (اختياري)
        userLink.onclick = function() {
            if(confirm("Do you want to logout?")) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                window.location.reload();
            }
        };
    }
}



