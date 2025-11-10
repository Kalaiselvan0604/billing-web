// Cart Management
let cart = [];
let currentOffer = null;

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function addToCart(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    const existingItem = cart.find(c => c.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    saveCart();
    showCartNotification();
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    saveCart();
}

function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        removeFromCart(itemId);
    } else {
        saveCart();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        currentOffer = null;
        saveCart();
        updateOfferDisplay();
    }
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    let discount = 0;
    
    if (currentOffer && currentOffer.percentage > 0) {
        discount = (subtotal * currentOffer.percentage) / 100;
    }
    
    return {
        subtotal,
        discount,
        total: subtotal - discount
    };
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const offerRow = document.getElementById('offerRow');
    const offerDiscount = document.getElementById('offerDiscount');
    const offerPercent = document.getElementById('offerPercent');
    const payButton = document.getElementById('payButton');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Cart is empty</p>';
        if (subtotalEl) subtotalEl.textContent = '₹0.00';
        if (totalEl) totalEl.textContent = '₹0.00';
        if (payButton) payButton.disabled = true;
        if (offerRow) offerRow.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price.toFixed(2)} × ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const totals = calculateTotal();
    
    if (subtotalEl) subtotalEl.textContent = `₹${totals.subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${totals.total.toFixed(2)}`;
    
    if (currentOffer && currentOffer.percentage > 0) {
        if (offerRow) offerRow.style.display = 'flex';
        if (offerDiscount) offerDiscount.textContent = `-₹${totals.discount.toFixed(2)}`;
        if (offerPercent) offerPercent.textContent = currentOffer.percentage;
    } else {
        if (offerRow) offerRow.style.display = 'none';
    }
    
    if (payButton) payButton.disabled = cart.length === 0;
}

function applyOffer() {
    const percentage = parseFloat(document.getElementById('offerPercentage').value) || 0;
    
    if (percentage < 0 || percentage > 100) {
        alert('Offer percentage must be between 0 and 100');
        return;
    }

    currentOffer = {
        percentage: percentage,
        appliedAt: new Date().toISOString()
    };

    updateCartDisplay();
    updateOfferDisplay();
    saveOffer();
}

function updateOfferDisplay() {
    const offerSection = document.getElementById('offerSection');
    const currentOfferDiv = document.getElementById('currentOffer');
    
    if (currentOffer && currentOffer.percentage > 0) {
        if (offerSection) offerSection.style.display = 'block';
        if (currentOfferDiv) {
            currentOfferDiv.innerHTML = `
                <strong>Active Offer: ${currentOffer.percentage}% OFF</strong>
                <button onclick="clearOffer()" class="btn btn-secondary" style="margin-left: 1rem; padding: 0.25rem 0.75rem;">Clear</button>
            `;
        }
    } else {
        if (currentOfferDiv) currentOfferDiv.innerHTML = '';
    }
}

function clearOffer() {
    currentOffer = null;
    if (document.getElementById('offerPercentage')) {
        document.getElementById('offerPercentage').value = 0;
    }
    updateCartDisplay();
    updateOfferDisplay();
    saveOffer();
}

function saveOffer() {
    localStorage.setItem('currentOffer', JSON.stringify(currentOffer));
}

function loadOffer() {
    const savedOffer = localStorage.getItem('currentOffer');
    if (savedOffer) {
        currentOffer = JSON.parse(savedOffer);
        if (document.getElementById('offerPercentage') && currentOffer) {
            document.getElementById('offerPercentage').value = currentOffer.percentage;
        }
    }
    updateOfferDisplay();
}

function showCartNotification() {
    // Simple visual feedback
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.style.transform = 'scale(1.1)';
        setTimeout(() => {
            payButton.style.transform = 'scale(1)';
        }, 200);
    }
}

// Make functions available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.applyOffer = applyOffer;
window.clearOffer = clearOffer;

// Initialize cart on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        loadCart();
        loadOffer();
    });
}

