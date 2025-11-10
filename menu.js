// Menu Management
let menuItems = [];
let currentCategory = 'all';

// Default menu items with images from open source
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

async function loadMenuItems() {
    try {
        const database = await initDB();
        const items = await database.getAllMenuItems();
        
        if (items.length === 0) {
            // Initialize with default items
            for (const item of defaultMenuItems) {
                await database.addMenuItem(item);
            }
            menuItems = await database.getAllMenuItems();
        } else {
            menuItems = items;
        }
        
        renderMenu();
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    const filteredItems = currentCategory === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === currentCategory);

    if (filteredItems.length === 0) {
        menuGrid.innerHTML = '<p class="loading">No items found in this category.</p>';
        return;
    }

    menuGrid.innerHTML = filteredItems.map(item => `
        <div class="menu-item" onclick="addToCart(${item.id})" data-id="${item.id}">
            <img src="${item.image || 'https://via.placeholder.com/200x150?text=' + encodeURIComponent(item.name)}" 
                 alt="${item.name}" 
                 class="menu-item-image"
                 onerror="this.src='https://via.placeholder.com/200x150?text=${encodeURIComponent(item.name)}'">
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

function setupCategoryTabs() {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            renderMenu();
        });
    });
}

// Make functions available globally
window.loadMenuItems = loadMenuItems;
window.setupCategoryTabs = setupCategoryTabs;

// Initialize menu on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        loadMenuItems();
        setupCategoryTabs();
    });
}

