const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=200&q=80';

let products = JSON.parse(localStorage.getItem('adminProducts')) || [
  { id: 1, name: 'Nike Air Max 270', category: 'Footwear', price: 149.99, stock: 45, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80', description: 'Premium running shoes.' },
  { id: 2, name: 'Adidas Running Shoes', category: 'Footwear', price: 129.99, stock: 12, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=200&q=80', description: 'Lightweight training shoes.' },
  { id: 3, name: 'Adjustable Dumbbells', category: 'Equipment', price: 89.99, stock: 0, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=200&q=80', description: 'Home workout dumbbells.' },
  { id: 4, name: 'Yoga Mat Pro', category: 'Yoga', price: 39.99, stock: 80, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=200&q=80', description: 'Anti-slip yoga mat.' },
  { id: 5, name: 'Protein Powder', category: 'Nutrition', price: 54.99, stock: 28, image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=200&q=80', description: 'Sports nutrition supplement.' }
];

let orders = JSON.parse(localStorage.getItem('adminOrders')) || [
  { id: 'ORD-2461', customer: 'John Smith', products: 'Nike Air Max 270, Yoga Mat Pro', total: 189.98, date: '2026-05-14', status: 'Pending' },
  { id: 'ORD-2460', customer: 'Sarah Johnson', products: 'Protein Powder', total: 54.99, date: '2026-05-13', status: 'Delivered' },
  { id: 'ORD-2459', customer: 'Mike Wilson', products: 'Adjustable Dumbbells', total: 89.99, date: '2026-05-12', status: 'Cancelled' },
  { id: 'ORD-2458', customer: 'Emma Davis', products: 'Adidas Running Shoes', total: 129.99, date: '2026-05-11', status: 'Delivered' }
];

let users = JSON.parse(localStorage.getItem('adminUsers')) || [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', orders: 23, status: 'Active' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', orders: 15, status: 'Active' },
  { id: 3, name: 'Mike Wilson', email: 'mike.w@example.com', orders: 8, status: 'Inactive' },
  { id: 4, name: 'Emma Davis', email: 'emma.davis@example.com', orders: 31, status: 'Active' }
];

const messages = [
  { user: 'John Smith', text: 'When will my order be delivered?', time: '5 min ago', unread: true },
  { user: 'Sarah Johnson', text: 'I need help with product returns.', time: '12 min ago', unread: true },
  { user: 'Mike Wilson', text: 'Thank you for the quick delivery!', time: '1 hour ago', unread: false },
  { user: 'Emma Davis', text: 'Is the yoga mat available in blue?', time: '2 hours ago', unread: false }
];

const activities = [
  { icon: '🛒', text: 'New order #ORD-2461 placed', time: '2 min ago' },
  { icon: '⚠️', text: 'Product "Running Shoes" stock is low', time: '15 min ago' },
  { icon: '👤', text: 'New user registration: Alex Turner', time: '30 min ago' },
  { icon: '🚚', text: 'Order #ORD-2460 shipped', time: '1 hour ago' }
];

const productsTable = document.getElementById('productsTable');
const ordersTable = document.getElementById('ordersTable');
const usersTable = document.getElementById('usersTable');
const productSearch = document.getElementById('productSearch');
const categoryFilter = document.getElementById('categoryFilter');
const modal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const toast = document.getElementById('toast');

function saveData() {
  localStorage.setItem('adminProducts', JSON.stringify(products));
  localStorage.setItem('adminOrders', JSON.stringify(orders));
  localStorage.setItem('adminUsers', JSON.stringify(users));
}

function money(value) {
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStockStatus(stock) {
  if (stock <= 0) return 'Out Stock';
  if (stock <= 15) return 'Low Stock';
  return 'In Stock';
}

function badgeClass(status) {
  return status.toLowerCase().replaceAll(' ', '-');
}

function initials(name) {
  return name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function renderStats() {
  const totalRevenue = orders
    .filter(order => order.status !== 'Cancelled')
    .reduce((sum, order) => sum + Number(order.total), 0);

  document.getElementById('totalProducts').textContent = products.length.toLocaleString();
  document.getElementById('totalOrders').textContent = orders.length.toLocaleString();
  document.getElementById('totalRevenue').textContent = `$${Math.round(totalRevenue).toLocaleString()}`;
  document.getElementById('totalUsers').textContent = users.length.toLocaleString();
}

function renderProducts() {
  const search = productSearch.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  productsTable.innerHTML = filtered.map(product => {
    const status = getStockStatus(product.stock);
    return `
      <tr>
        <td>
          <div class="product-cell">
            <img class="product-img" src="${product.image || DEFAULT_IMAGE}" alt="${product.name}" onerror="this.src='${DEFAULT_IMAGE}'">
            <strong>${product.name}</strong>
          </div>
        </td>
        <td>${product.category}</td>
        <td>${money(product.price)}</td>
        <td>${product.stock}</td>
        <td><span class="badge ${badgeClass(status)}">${status}</span></td>
        <td>
          <div class="action-group">
            <button class="icon-btn view" onclick="viewProduct(${product.id})" title="View">👁</button>
            <button class="icon-btn edit" onclick="editProduct(${product.id})" title="Edit">✎</button>
            <button class="icon-btn delete" onclick="deleteProduct(${product.id})" title="Delete">🗑</button>
          </div>
        </td>
      </tr>`;
  }).join('') || `<tr><td colspan="6">No products found.</td></tr>`;
}

function renderOrders() {
  ordersTable.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.customer}</td>
      <td>${order.products}</td>
      <td>${money(order.total)}</td>
      <td>${order.date}</td>
      <td><span class="badge ${badgeClass(order.status)}">${order.status}</span></td>
      <td>
        <select onchange="updateOrderStatus('${order.id}', this.value)">
          <option ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
    </tr>`).join('');
}

function renderUsers() {
  usersTable.innerHTML = users.map(user => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="user-avatar">${initials(user.name)}</div>
          <strong>${user.name}</strong>
        </div>
      </td>
      <td>${user.email}</td>
      <td>${user.orders}</td>
      <td><span class="badge ${badgeClass(user.status)}">${user.status}</span></td>
      <td>
        <div class="action-group">
          <button class="icon-btn view" onclick="alert('User: ${user.name}\nEmail: ${user.email}')">👁</button>
          <button class="icon-btn edit" onclick="toggleUser(${user.id})">⛔</button>
          <button class="icon-btn delete" onclick="deleteUser(${user.id})">🗑</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderMessages() {
  document.getElementById('messagesList').innerHTML = messages.map(msg => `
    <div class="message-item ${msg.unread ? 'unread' : ''}">
      <div class="user-avatar">${initials(msg.user)}</div>
      <div class="message-body">
        <strong>${msg.user}<small>${msg.time}</small></strong>
        <p>${msg.text}</p>
      </div>
    </div>`).join('');

  document.getElementById('activityList').innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-dot">${activity.icon}</div>
      <div>
        <strong>${activity.text}</strong><br>
        <small>${activity.time}</small>
      </div>
    </div>`).join('');
}

function openModal(title = 'Add Product') {
  document.getElementById('modalTitle').textContent = title;
  modal.classList.add('show');
}

function closeModal() {
  modal.classList.remove('show');
  productForm.reset();
  document.getElementById('productId').value = '';
}

function editProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productCategory').value = product.category;
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productStock').value = product.stock;
  document.getElementById('productImage').value = product.image || '';
  document.getElementById('productDescription').value = product.description || '';
  openModal('Edit Product');
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  products = products.filter(product => product.id !== id);
  saveData();
  renderAll();
  showToast('Product deleted successfully');
}

function viewProduct(id) {
  const product = products.find(item => item.id === id);
  alert(`${product.name}\nCategory: ${product.category}\nPrice: ${money(product.price)}\nStock: ${product.stock}\n\n${product.description || ''}`);
}

function updateOrderStatus(id, status) {
  const order = orders.find(item => item.id === id);
  if (order) order.status = status;
  saveData();
  renderAll();
  showToast('Order status updated');
}

function toggleUser(id) {
  const user = users.find(item => item.id === id);
  if (!user) return;
  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  saveData();
  renderAll();
  showToast('User status updated');
}

function deleteUser(id) {
  if (!confirm('Delete this user?')) return;
  users = users.filter(user => user.id !== id);
  saveData();
  renderAll();
  showToast('User deleted');
}

function drawBarChart(canvasId, labels, values, color = '#ff6b35') {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth * devicePixelRatio;
  const height = canvas.height = canvas.offsetHeight * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  ctx.clearRect(0, 0, w, h);

  const padding = 34;
  const max = Math.max(...values, 1);
  const barWidth = (w - padding * 2) / values.length * 0.58;

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = padding + ((h - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  }

  values.forEach((value, index) => {
    const x = padding + index * ((w - padding * 2) / values.length) + barWidth * 0.35;
    const barHeight = (value / max) * (h - padding * 2);
    const y = h - padding - barHeight;
    ctx.fillStyle = color;
    roundRect(ctx, x, y, barWidth, barHeight, 8);
    ctx.fill();
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(labels[index], x + barWidth / 2, h - 10);
  });
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height);
  ctx.lineTo(x, y + height);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function renderCharts() {
  drawBarChart('salesChart', ['Jan', 'Feb', 'Mar', 'Apr', 'May'], [4200, 5100, 6800, 5400, 8200], '#ff6b35');
  drawBarChart('ordersChart', ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], [32, 45, 38, 52, 61, 48, 39], '#2563eb');
}

function renderAll() {
  renderStats();
  renderProducts();
  renderOrders();
  renderUsers();
  renderMessages();
  renderCharts();
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = document.getElementById('productId').value;
  const productData = {
    id: id ? Number(id) : Date.now(),
    name: document.getElementById('productName').value.trim(),
    category: document.getElementById('productCategory').value,
    price: Number(document.getElementById('productPrice').value),
    stock: Number(document.getElementById('productStock').value),
    image: document.getElementById('productImage').value.trim() || DEFAULT_IMAGE,
    description: document.getElementById('productDescription').value.trim()
  };

  if (id) {
    products = products.map(product => product.id === Number(id) ? productData : product);
    showToast('Product updated successfully');
  } else {
    products.unshift(productData);
    showToast('Product added successfully');
  }

  saveData();
  closeModal();
  renderAll();
});

document.getElementById('openProductModal').addEventListener('click', () => openModal('Add Product'));
document.getElementById('closeProductModal').addEventListener('click', closeModal);
document.getElementById('cancelProduct').addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
productSearch.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);

document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
document.getElementById('logoutBtn').addEventListener('click', () => showToast('Logged out from admin dashboard'));

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(item => item.classList.remove('active'));
    link.classList.add('active');
    document.getElementById('sidebar').classList.remove('open');
  });
});

window.addEventListener('resize', renderCharts);
renderAll();
