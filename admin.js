// Admin Panel Functions

async function loadAdminData() {
    await loadMenuItemsForAdmin();
    await loadAdminStatistics();
    await loadGlobalOffer();
}

async function loadMenuItemsForAdmin() {
    try {
        const database = await initDB();
        let items = await database.getAllMenuItems();
        
        // If no items exist, initialize with default menu items
        if (items.length === 0) {
            // Import default menu items from menu.js
            const defaultMenuItems = [
                // Tea
                { name: 'Masala Chai', category: 'tea', price: 15, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop' },
                { name: 'Green Tea', category: 'tea', price: 20, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
                { name: 'Black Tea', category: 'tea', price: 15, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
                { name: 'Lemon Tea', category: 'tea', price: 18, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop' },
                { name: 'Ginger Tea', category: 'tea', price: 20, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop' },
                
                // Coffee
                { name: 'Filter Coffee', category: 'coffee', price: 25, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
                { name: 'Cappuccino', category: 'coffee', price: 40, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
                { name: 'Espresso', category: 'coffee', price: 35, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop' },
                { name: 'Latte', category: 'coffee', price: 45, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
                { name: 'Black Coffee', category: 'coffee', price: 20, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop' },
                
                // Vada
                { name: 'Medu Vada', category: 'vada', price: 30, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
                { name: 'Masala Vada', category: 'vada', price: 35, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
                { name: 'Rava Vada', category: 'vada', price: 30, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
                { name: 'Onion Vada', category: 'vada', price: 35, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop' },
                
                // Samosa
                { name: 'Aloo Samosa', category: 'samosa', price: 25, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
                { name: 'Punjabi Samosa', category: 'samosa', price: 30, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
                { name: 'Samosa Chat', category: 'samosa', price: 40, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
                { name: 'Mini Samosa', category: 'samosa', price: 20, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop' },
                
                // Juice
                { name: 'Orange Juice', category: 'juice', price: 40, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
                { name: 'Apple Juice', category: 'juice', price: 45, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
                { name: 'Mango Juice', category: 'juice', price: 50, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
                { name: 'Pineapple Juice', category: 'juice', price: 45, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
                { name: 'Mixed Fruit Juice', category: 'juice', price: 55, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop' },
                
                // Ice Cream
                { name: 'Vanilla Ice Cream', category: 'icecream', price: 60, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
                { name: 'Chocolate Ice Cream', category: 'icecream', price: 65, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
                { name: 'Strawberry Ice Cream', category: 'icecream', price: 65, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
                { name: 'Butterscotch Ice Cream', category: 'icecream', price: 70, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
                { name: 'Kulfi', category: 'icecream', price: 50, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' }
            ];
            
            // Add all default items
            for (const item of defaultMenuItems) {
                await database.addMenuItem(item);
            }
            
            // Reload items
            items = await database.getAllMenuItems();
        }
        
        displayMenuItemsForAdmin(items);
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

function displayMenuItemsForAdmin(items) {
    const menuList = document.getElementById('menuList');
    if (!menuList) return;

    if (items.length === 0) {
        menuList.innerHTML = '<p class="loading">No menu items found. Add your first item!</p>';
        return;
    }

    menuList.innerHTML = items.map(item => `
        <div class="menu-item-card">
            <div class="menu-item-card-header">
                <div class="menu-item-card-name">${item.name}</div>
                <span class="menu-item-card-category">${item.category}</span>
            </div>
            <img src="${item.image || 'https://via.placeholder.com/200x150'}" 
                 alt="${item.name}" 
                 class="menu-item-card-image"
                 onerror="this.src='https://via.placeholder.com/200x150'">
            <div class="menu-item-card-price">₹${item.price.toFixed(2)}</div>
            <div class="menu-item-card-actions">
                <button onclick="editMenuItem(${item.id})" class="btn btn-primary btn-small">Edit</button>
                <button onclick="deleteMenuItem(${item.id})" class="btn btn-danger btn-small">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddItemForm() {
    const form = document.getElementById('addItemForm');
    if (form) {
        form.style.display = 'flex';
        // Reset form
        document.getElementById('itemForm').reset();
    }
}

function closeAddItemForm() {
    const form = document.getElementById('addItemForm');
    if (form) {
        form.style.display = 'none';
    }
}

async function saveMenuItem(event) {
    event.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const image = document.getElementById('itemImage').value;

    if (!name || !category || !price || price <= 0) {
        alert('Please fill all fields correctly');
        return;
    }

    try {
        const database = await initDB();
        const item = {
            name: name.trim(),
            category: category,
            price: price,
            image: image || null
        };

        await database.addMenuItem(item);
        closeAddItemForm();
        await loadMenuItemsForAdmin();
        
        // Reload menu on main page if it exists
        if (typeof loadMenuItems === 'function') {
            await loadMenuItems();
        }
        
        alert('Menu item added successfully!');
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Error saving menu item. Please try again.');
    }
}

async function editMenuItem(id) {
    try {
        const database = await initDB();
        const items = await database.getAllMenuItems();
        const item = items.find(i => i.id === id);
        
        if (!item) {
            alert('Item not found');
            return;
        }

        // Populate form
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemImage').value = item.image || '';
        
        // Show form
        showAddItemForm();
        
        // Change form to update mode
        const form = document.getElementById('itemForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            await updateMenuItem(id, e);
        };
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Update Item';
    } catch (error) {
        console.error('Error loading item for edit:', error);
    }
}

async function updateMenuItem(id, event) {
    event.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const image = document.getElementById('itemImage').value;

    if (!name || !category || !price || price <= 0) {
        alert('Please fill all fields correctly');
        return;
    }

    try {
        const database = await initDB();
        const item = {
            name: name.trim(),
            category: category,
            price: price,
            image: image || null
        };

        await database.updateMenuItem(id, item);
        closeAddItemForm();
        await loadMenuItemsForAdmin();
        
        // Reload menu on main page if it exists
        if (typeof loadMenuItems === 'function') {
            await loadMenuItems();
        }
        
        // Reset form handler
        const form = document.getElementById('itemForm');
        form.onsubmit = saveMenuItem;
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Save Item';
        
        alert('Menu item updated successfully!');
    } catch (error) {
        console.error('Error updating menu item:', error);
        alert('Error updating menu item. Please try again.');
    }
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) {
        return;
    }

    try {
        const database = await initDB();
        await database.deleteMenuItem(id);
        await loadMenuItemsForAdmin();
        
        // Reload menu on main page if it exists
        if (typeof loadMenuItems === 'function') {
            await loadMenuItems();
        }
        
        alert('Menu item deleted successfully!');
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item. Please try again.');
    }
}

async function setGlobalOffer() {
    const percentage = parseFloat(document.getElementById('adminOfferPercent').value) || 0;
    
    if (percentage < 0 || percentage > 100) {
        alert('Offer percentage must be between 0 and 100');
        return;
    }

    try {
        const database = await initDB();
        await database.setOffer({ percentage: percentage });
        
        const currentOfferDiv = document.getElementById('currentGlobalOffer');
        if (currentOfferDiv) {
            if (percentage > 0) {
                currentOfferDiv.textContent = `Active: ${percentage}% OFF`;
                currentOfferDiv.style.color = 'var(--primary-color)';
            } else {
                currentOfferDiv.textContent = 'No active offer';
                currentOfferDiv.style.color = '#666';
            }
        }
        
        alert('Offer set successfully!');
    } catch (error) {
        console.error('Error setting offer:', error);
        alert('Error setting offer. Please try again.');
    }
}

async function loadGlobalOffer() {
    try {
        const database = await initDB();
        const offer = await database.getActiveOffer();
        
        const adminOfferPercent = document.getElementById('adminOfferPercent');
        const currentOfferDiv = document.getElementById('currentGlobalOffer');
        
        if (offer) {
            if (adminOfferPercent) adminOfferPercent.value = offer.percentage;
            if (currentOfferDiv) {
                if (offer.percentage > 0) {
                    currentOfferDiv.textContent = `Active: ${offer.percentage}% OFF`;
                    currentOfferDiv.style.color = 'var(--primary-color)';
                } else {
                    currentOfferDiv.textContent = 'No active offer';
                    currentOfferDiv.style.color = '#666';
                }
            }
        } else {
            if (adminOfferPercent) adminOfferPercent.value = 0;
            if (currentOfferDiv) {
                currentOfferDiv.textContent = 'No active offer';
                currentOfferDiv.style.color = '#666';
            }
        }
    } catch (error) {
        console.error('Error loading offer:', error);
    }
}

async function loadAdminStatistics() {
    try {
        const database = await initDB();
        const allBills = await database.getAllBills();
        
        const today = new Date().toISOString().split('T')[0];
        const todayBills = allBills.filter(b => b.date === today);
        const todayRevenue = todayBills.reduce((sum, b) => sum + b.total, 0);
        
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthBills = allBills.filter(b => {
            const billDate = new Date(b.date);
            return billDate >= monthStart;
        });
        const monthRevenue = monthBills.reduce((sum, b) => sum + b.total, 0);
        
        const todayRevenueEl = document.getElementById('todayRevenue');
        const monthRevenueEl = document.getElementById('monthRevenue');
        const todayBillsEl = document.getElementById('todayBills');
        const monthBillsEl = document.getElementById('monthBills');
        
        if (todayRevenueEl) todayRevenueEl.textContent = `₹${todayRevenue.toFixed(2)}`;
        if (monthRevenueEl) monthRevenueEl.textContent = `₹${monthRevenue.toFixed(2)}`;
        if (todayBillsEl) todayBillsEl.textContent = todayBills.length.toString();
        if (monthBillsEl) monthBillsEl.textContent = monthBills.length.toString();
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

