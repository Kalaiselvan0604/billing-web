// Default Menu Data
const defaultMenuItems = [
    // Tea Items
    { id: 1, name: 'Masala Chai', price: 25, category: 'tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop', description: 'Spiced Indian tea' },
    { id: 2, name: 'Green Tea', price: 30, category: 'tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', description: 'Fresh green tea' },
    { id: 3, name: 'Lemon Tea', price: 25, category: 'tea', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop', description: 'Refreshing lemon tea' },
    { id: 4, name: 'Ginger Tea', price: 30, category: 'tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=400&fit=crop', description: 'Warming ginger tea' },
    
    // Coffee
    { id: 5, name: 'Hot Coffee', price: 40, category: 'coffee', image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop', description: 'Hot brewed coffee' },
    { id: 6, name: 'Cold Coffee', price: 50, category: 'coffee', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', description: 'Iced coffee' },
    { id: 7, name: 'Cappuccino', price: 55, category: 'coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', description: 'Espresso with steamed milk' },
    
    // Vada
    { id: 8, name: 'Vada Pav', price: 25, category: 'vada', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70946?w=400&h=400&fit=crop', description: 'Mumbai street food' },
    { id: 9, name: 'Medu Vada', price: 30, category: 'vada', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70946?w=400&h=400&fit=crop', description: 'South Indian vada' },
    
    // Fresh Juice
    { id: 10, name: 'Orange Juice', price: 60, category: 'juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', description: 'Fresh orange juice' },
    { id: 11, name: 'Apple Juice', price: 60, category: 'juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', description: 'Fresh apple juice' },
    { id: 12, name: 'Mango Juice', price: 70, category: 'juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', description: 'Fresh mango juice' },
    { id: 13, name: 'Watermelon Juice', price: 65, category: 'juice', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop', description: 'Fresh watermelon juice' },
    
    // Ice Cream
    { id: 14, name: 'Vanilla Ice Cream', price: 80, category: 'icecream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', description: 'Classic vanilla' },
    { id: 15, name: 'Chocolate Ice Cream', price: 85, category: 'icecream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', description: 'Rich chocolate' },
    { id: 16, name: 'Strawberry Ice Cream', price: 85, category: 'icecream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', description: 'Fresh strawberry' },
    { id: 17, name: 'Butterscotch Ice Cream', price: 90, category: 'icecream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop', description: 'Creamy butterscotch' }
];

// Load menu from localStorage or use default
let menuItems = JSON.parse(localStorage.getItem('teaRestaurantMenu')) || defaultMenuItems;
// Save default menu if localStorage was empty
if (!localStorage.getItem('teaRestaurantMenu')) {
    localStorage.setItem('teaRestaurantMenu', JSON.stringify(defaultMenuItems));
}

// Cart Data
let cart = [];
let currentCategory = 'all';
let discountApplied = false;
let discountAmount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    renderMenu();
    setupEventListeners();
});

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
}

// Render Menu
function renderMenu() {
    const menuContainer = document.getElementById('menuItems');
    const filteredItems = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);
    
    menuContainer.innerHTML = filteredItems.map(item => `
        <div class="menu-item">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" onclick="addToCart(${item.id})" onerror="this.src='https://via.placeholder.com/200?text=${encodeURIComponent(item.name)}'">
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">₹${item.price.toFixed(2)}</div>
            <div class="menu-item-category">${item.category}</div>
        </div>
    `).join('');
}

// Category Filter
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.category;
        renderMenu();
    });
});

// Add to Cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    updateCart();
}

// Update Cart Display
function updateCart() {
    const cartContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/50'">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateSummary();
}

// Increase Quantity
function increaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrease Quantity
function decreaseQuantity(itemId) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity--;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCart();
        }
    }
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCart();
}

// Update Summary
function updateSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax - discountAmount;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₹${tax.toFixed(2)}`;
    document.getElementById('discount').textContent = `-₹${discountAmount.toFixed(2)}`;
    document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
}

// Clear Cart
document.getElementById('clearCart').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        discountApplied = false;
        discountAmount = 0;
        document.getElementById('discountCode').value = '';
        updateCart();
    }
});

// Apply Discount
document.getElementById('applyDiscount').addEventListener('click', () => {
    const code = document.getElementById('discountCode').value.trim().toUpperCase();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Sample discount codes
    const discountCodes = {
        'TEA10': 0.10,  // 10% discount
        'TEA20': 0.20,  // 20% discount
        'WELCOME': 0.15, // 15% discount
        'VIP': 0.25      // 25% discount
    };
    
    if (code && discountCodes[code]) {
        discountApplied = true;
        discountAmount = subtotal * discountCodes[code];
        updateSummary();
        alert(`Discount code "${code}" applied! ${(discountCodes[code] * 100)}% off`);
    } else if (code) {
        alert('Invalid discount code!');
    } else {
        discountApplied = false;
        discountAmount = 0;
        updateSummary();
    }
});

// Generate Bill
document.getElementById('generateBill').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Please add items to cart first!');
        return;
    }
    
    const customerName = document.getElementById('customerName').value.trim() || 'Walk-in Customer';
    const customerPhone = document.getElementById('customerPhone').value.trim() || 'N/A';
    const tableNumber = document.getElementById('tableNumber').value.trim() || 'N/A';
    
    generateInvoice(customerName, customerPhone, tableNumber);
});

// Save Menu to localStorage
function saveMenuToStorage() {
    localStorage.setItem('teaRestaurantMenu', JSON.stringify(menuItems));
}

// Save Bill to localStorage
function saveBillToStorage(billData) {
    let bills = JSON.parse(localStorage.getItem('teaRestaurantBills')) || [];
    bills.push(billData);
    localStorage.setItem('teaRestaurantBills', JSON.stringify(bills));
}

// Generate Invoice
function generateInvoice(customerName, customerPhone, tableNumber) {
    const invoiceBody = document.getElementById('invoiceBody');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax - discountAmount;
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-8);
    const now = new Date();
    
    // Save bill to localStorage
    const billData = {
        invoiceNumber,
        date: now.toISOString(),
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        subtotal,
        tax,
        discount: discountAmount,
        total,
        customerInfo: {
            name: customerName,
            phone: customerPhone,
            table: tableNumber
        }
    };
    saveBillToStorage(billData);
    
    invoiceBody.innerHTML = `
        <div class="invoice-restaurant">
            <h3>Tea Restaurant</h3>
            <p>123 Tea Street, City - 123456</p>
            <p>Phone: +91 1234567890 | Email: info@tearestaurant.com</p>
        </div>
        
        <div class="invoice-details">
            <div class="invoice-details-row">
                <span><strong>Invoice No:</strong></span>
                <span>${invoiceNumber}</span>
            </div>
            <div class="invoice-details-row">
                <span><strong>Date:</strong></span>
                <span>${now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div class="invoice-details-row">
                <span><strong>Time:</strong></span>
                <span>${now.toLocaleTimeString('en-US')}</span>
            </div>
            <div class="invoice-details-row">
                <span><strong>Customer Name:</strong></span>
                <span>${customerName}</span>
            </div>
            <div class="invoice-details-row">
                <span><strong>Phone:</strong></span>
                <span>${customerPhone}</span>
            </div>
            <div class="invoice-details-row">
                <span><strong>Table No:</strong></span>
                <span>${tableNumber}</span>
            </div>
        </div>
        
        <div class="invoice-items">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>₹${item.price.toFixed(2)}</td>
                            <td>₹${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="invoice-total">
            <div class="invoice-total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="invoice-total-row">
                <span>Tax (5%):</span>
                <span>₹${tax.toFixed(2)}</span>
            </div>
            ${discountAmount > 0 ? `
            <div class="invoice-total-row">
                <span>Discount:</span>
                <span>-₹${discountAmount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="invoice-total-row final">
                <span>Total Amount:</span>
                <span>₹${total.toFixed(2)}</span>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666;">
            <p>Thank you for visiting Tea Restaurant!</p>
            <p style="font-size: 0.9rem; margin-top: 5px;">Visit us again soon ☕</p>
        </div>
    `;
    
    document.getElementById('invoiceModal').classList.add('active');
    document.getElementById('printBill').style.display = 'block';
    
    // Auto-clear cart after billing
    setTimeout(() => {
        cart = [];
        discountApplied = false;
        discountAmount = 0;
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('tableNumber').value = '';
        document.getElementById('discountCode').value = '';
        updateCart();
        alert('Bill generated successfully! Cart cleared.');
    }, 500);
}

// Print Invoice
document.getElementById('printInvoice').addEventListener('click', () => {
    window.print();
});

// Close Invoice
document.getElementById('closeInvoice').addEventListener('click', () => {
    document.getElementById('invoiceModal').classList.remove('active');
});

// New Order
document.getElementById('newOrder').addEventListener('click', () => {
    cart = [];
    discountApplied = false;
    discountAmount = 0;
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('tableNumber').value = '';
    document.getElementById('discountCode').value = '';
    document.getElementById('invoiceModal').classList.remove('active');
    document.getElementById('printBill').style.display = 'none';
    updateCart();
});

// Render Admin Items List
function renderAdminItemsList() {
    const adminList = document.getElementById('adminItemsList');
    adminList.innerHTML = menuItems.map(item => `
        <div class="admin-item-card">
            <img src="${item.image}" alt="${item.name}" class="admin-item-image" onerror="this.src='https://via.placeholder.com/100'">
            <div class="admin-item-info">
                <div class="admin-item-name">${item.name}</div>
                <div class="admin-item-details">
                    <span>₹${item.price.toFixed(2)}</span>
                    <span class="admin-item-category">${item.category}</span>
                </div>
            </div>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="openEditModal(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" onclick="deleteMenuItem(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Open Edit Modal
let editingItemId = null;
function openEditModal(itemId) {
    const item = getMenuItemById(itemId);
    if (!item) return;
    
    editingItemId = itemId;
    document.getElementById('addItemName').value = item.name;
    document.getElementById('addItemPrice').value = item.price;
    document.getElementById('addItemCategory').value = item.category;
    document.getElementById('addItemImage').value = item.image;
    document.getElementById('addItemDescription').value = item.description || '';
    
    document.querySelector('#addItemForm button').innerHTML = '<i class="fas fa-save"></i> Update Item';
    document.querySelector('.admin-form-section h3').textContent = 'Edit Item';
    
    // Scroll to form
    document.querySelector('.admin-form-section').scrollIntoView({ behavior: 'smooth' });
}

// Reset Add Form
function resetAddForm() {
    document.getElementById('addItemForm').reset();
    document.querySelector('#addItemForm button').innerHTML = '<i class="fas fa-plus"></i> Add Item';
    document.querySelector('.admin-form-section h3').textContent = 'Add New Item';
    editingItemId = null;
}

// Setup Event Listeners
function setupEventListeners() {
    // Close modal on outside click
    document.getElementById('invoiceModal').addEventListener('click', (e) => {
        if (e.target.id === 'invoiceModal') {
            document.getElementById('invoiceModal').classList.remove('active');
        }
    });
    
    // Admin Panel Toggle
    document.getElementById('toggleAdmin').addEventListener('click', () => {
        const adminPanel = document.getElementById('adminPanel');
        adminPanel.style.display = adminPanel.style.display === 'none' ? 'block' : 'none';
        if (adminPanel.style.display === 'block') {
            renderAdminItemsList();
        }
    });
    
    // Close Admin Panel
    document.getElementById('closeAdmin').addEventListener('click', () => {
        document.getElementById('adminPanel').style.display = 'none';
        resetAddForm();
    });
    
    // Turnover Toggle
    document.getElementById('toggleTurnover').addEventListener('click', () => {
        const turnoverModal = document.getElementById('turnoverModal');
        turnoverModal.style.display = turnoverModal.style.display === 'none' ? 'flex' : 'none';
        if (turnoverModal.style.display === 'flex') {
            renderMonthlyTurnover();
        }
    });
    
    // Close Turnover Modal
    document.getElementById('closeTurnover').addEventListener('click', () => {
        document.getElementById('turnoverModal').style.display = 'none';
    });
    
    // Close turnover on outside click
    document.getElementById('turnoverModal').addEventListener('click', (e) => {
        if (e.target.id === 'turnoverModal') {
            document.getElementById('turnoverModal').style.display = 'none';
        }
    });
    
    // Add Item Form Submit
    document.getElementById('addItemForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('addItemName').value.trim();
        const price = document.getElementById('addItemPrice').value;
        const category = document.getElementById('addItemCategory').value;
        const image = document.getElementById('addItemImage').value.trim();
        const description = document.getElementById('addItemDescription').value.trim();
        
        if (editingItemId) {
            editMenuItem(editingItemId, name, price, category, image, description);
            alert('Item updated successfully!');
        } else {
            addMenuItem(name, price, category, image, description);
            alert('Item added successfully!');
        }
        
        resetAddForm();
        renderAdminItemsList();
    });
}

// Initialize cart display
updateCart();

// ========== CRUD Operations ==========

// Add Menu Item
function addMenuItem(name, price, category, image, description) {
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
    const newItem = {
        id: newId,
        name,
        price: parseFloat(price),
        category,
        image,
        description: description || ''
    };
    menuItems.push(newItem);
    saveMenuToStorage();
    renderMenu();
    return newItem;
}

// Edit Menu Item
function editMenuItem(id, name, price, category, image, description) {
    const item = menuItems.find(i => i.id === id);
    if (item) {
        item.name = name;
        item.price = parseFloat(price);
        item.category = category;
        item.image = image;
        item.description = description || '';
        saveMenuToStorage();
        renderMenu();
        return item;
    }
    return null;
}

// Delete Menu Item
function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        menuItems = menuItems.filter(i => i.id !== id);
        saveMenuToStorage();
        renderMenu();
        // Update admin list if admin panel is open
        if (document.getElementById('adminPanel').style.display === 'block') {
            renderAdminItemsList();
        }
        return true;
    }
    return false;
}

// Get Menu Item by ID
function getMenuItemById(id) {
    return menuItems.find(i => i.id === id);
}

// ========== Monthly Turnover ==========

// Get Monthly Turnover
function getMonthlyTurnover() {
    const bills = JSON.parse(localStorage.getItem('teaRestaurantBills')) || [];
    const monthlyData = {};
    
    bills.forEach(bill => {
        const date = new Date(bill.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = {
                month: monthName,
                monthKey: monthKey,
                totalSales: 0,
                orderCount: 0,
                bills: []
            };
        }
        
        monthlyData[monthKey].totalSales += bill.total;
        monthlyData[monthKey].orderCount += 1;
        monthlyData[monthKey].bills.push(bill);
    });
    
    // Convert to array and sort by month (newest first)
    return Object.values(monthlyData).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

// Render Monthly Turnover
function renderMonthlyTurnover() {
    const turnoverData = getMonthlyTurnover();
    const turnoverContainer = document.getElementById('turnoverList');
    
    if (turnoverData.length === 0) {
        turnoverContainer.innerHTML = `
            <div class="empty-turnover">
                <i class="fas fa-chart-line"></i>
                <p>No sales data available</p>
            </div>
        `;
        return;
    }
    
    turnoverContainer.innerHTML = turnoverData.map(month => `
        <div class="turnover-month-card">
            <div class="turnover-month-header">
                <h3>${month.month}</h3>
                <span class="turnover-badge">${month.orderCount} Orders</span>
            </div>
            <div class="turnover-month-details">
                <div class="turnover-stat">
                    <span class="turnover-label">Total Sales:</span>
                    <span class="turnover-value">₹${month.totalSales.toFixed(2)}</span>
                </div>
                <div class="turnover-stat">
                    <span class="turnover-label">Average Order:</span>
                    <span class="turnover-value">₹${(month.totalSales / month.orderCount).toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join('');
}


