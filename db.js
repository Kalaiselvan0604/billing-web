// IndexedDB Database Operations
class Database {
    constructor() {
        this.dbName = 'TeaRestaurantDB';
        this.version = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Menu Items Store
                if (!db.objectStoreNames.contains('menuItems')) {
                    const menuStore = db.createObjectStore('menuItems', { keyPath: 'id', autoIncrement: true });
                    menuStore.createIndex('category', 'category', { unique: false });
                }

                // Bills Store
                if (!db.objectStoreNames.contains('bills')) {
                    const billsStore = db.createObjectStore('bills', { keyPath: 'id', autoIncrement: true });
                    billsStore.createIndex('date', 'date', { unique: false });
                    billsStore.createIndex('billNumber', 'billNumber', { unique: true });
                }

                // Offers Store
                if (!db.objectStoreNames.contains('offers')) {
                    db.createObjectStore('offers', { keyPath: 'id', autoIncrement: true });
                }

                // Admin Settings Store
                if (!db.objectStoreNames.contains('adminSettings')) {
                    const adminStore = db.createObjectStore('adminSettings', { keyPath: 'key' });
                }

                // Security Questions Store
                if (!db.objectStoreNames.contains('securityQuestions')) {
                    const securityStore = db.createObjectStore('securityQuestions', { keyPath: 'id' });
                }
            };
        });
    }

    // Menu Items Operations
    async addMenuItem(item) {
        const tx = this.db.transaction(['menuItems'], 'readwrite');
        const store = tx.objectStore('menuItems');
        return store.add(item);
    }

    async getAllMenuItems() {
        const tx = this.db.transaction(['menuItems'], 'readonly');
        const store = tx.objectStore('menuItems');
        return store.getAll();
    }

    async getMenuItemsByCategory(category) {
        const tx = this.db.transaction(['menuItems'], 'readonly');
        const store = tx.objectStore('menuItems');
        const index = store.index('category');
        return index.getAll(category);
    }

    async updateMenuItem(id, item) {
        const tx = this.db.transaction(['menuItems'], 'readwrite');
        const store = tx.objectStore('menuItems');
        item.id = id;
        return store.put(item);
    }

    async deleteMenuItem(id) {
        const tx = this.db.transaction(['menuItems'], 'readwrite');
        const store = tx.objectStore('menuItems');
        return store.delete(id);
    }

    // Bills Operations
    async addBill(bill) {
        const tx = this.db.transaction(['bills'], 'readwrite');
        const store = tx.objectStore('bills');
        return store.add(bill);
    }

    async getAllBills() {
        const tx = this.db.transaction(['bills'], 'readonly');
        const store = tx.objectStore('bills');
        return store.getAll();
    }

    async getBillsByDate(date) {
        const tx = this.db.transaction(['bills'], 'readonly');
        const store = tx.objectStore('bills');
        const index = store.index('date');
        return index.getAll(date);
    }

    async getBillsByMonth(year, month) {
        const allBills = await this.getAllBills();
        return allBills.filter(bill => {
            const billDate = new Date(bill.date);
            return billDate.getFullYear() === year && billDate.getMonth() === month;
        });
    }

    async getNextBillNumber() {
        const bills = await this.getAllBills();
        if (bills.length === 0) return 1;
        const maxBill = Math.max(...bills.map(b => b.billNumber || 0));
        return maxBill + 1;
    }

    // Offers Operations
    async setOffer(offer) {
        const tx = this.db.transaction(['offers'], 'readwrite');
        const store = tx.objectStore('offers');
        // Clear existing offers and add new one
        await store.clear();
        offer.id = 1;
        offer.active = true;
        offer.createdAt = new Date().toISOString();
        return store.add(offer);
    }

    async getActiveOffer() {
        const tx = this.db.transaction(['offers'], 'readonly');
        const store = tx.objectStore('offers');
        const offers = await store.getAll();
        return offers.find(o => o.active) || null;
    }

    async clearOffer() {
        const tx = this.db.transaction(['offers'], 'readwrite');
        const store = tx.objectStore('offers');
        return store.clear();
    }

    // Admin Settings Operations
    async setAdminSetting(key, value) {
        const tx = this.db.transaction(['adminSettings'], 'readwrite');
        const store = tx.objectStore('adminSettings');
        return store.put({ key, value });
    }

    async getAdminSetting(key) {
        const tx = this.db.transaction(['adminSettings'], 'readonly');
        const store = tx.objectStore('adminSettings');
        const result = await store.get(key);
        return result ? result.value : null;
    }

    // Security Questions Operations
    async initializeSecurityQuestions() {
        const tx = this.db.transaction(['securityQuestions'], 'readwrite');
        const store = tx.objectStore('securityQuestions');
        
        // Check if already initialized
        const existing = await store.get(1);
        if (existing) return;

        // Initialize with hashed answers
        const questions = {
            id: 1,
            question1: 'What is your fav job?',
            answer1: await this.hashAnswer('design'),
            question2: 'What is your first business dream?',
            answer2: await this.hashAnswer('transport'),
            question3: 'What is your second business name?',
            answer3: await this.hashAnswer('cow form')
        };
        
        return store.add(questions);
    }

    async verifySecurityQuestions(answer1, answer2, answer3) {
        const tx = this.db.transaction(['securityQuestions'], 'readonly');
        const store = tx.objectStore('securityQuestions');
        const questions = await store.get(1);
        
        if (!questions) return false;

        const hash1 = await this.hashAnswer(answer1.toLowerCase().trim());
        const hash2 = await this.hashAnswer(answer2.toLowerCase().trim());
        const hash3 = await this.hashAnswer(answer3.toLowerCase().trim());

        return questions.answer1 === hash1 && 
               questions.answer2 === hash2 && 
               questions.answer3 === hash3;
    }

    async hashAnswer(answer) {
        // Simple hash function (in production, use crypto.subtle)
        let hash = 0;
        for (let i = 0; i < answer.length; i++) {
            const char = answer.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    }

    // Password Operations
    async setPassword(password) {
        const hashedPassword = await this.hashAnswer(password);
        return this.setAdminSetting('password', hashedPassword);
    }

    async verifyPassword(password) {
        const storedHash = await this.getAdminSetting('password');
        if (!storedHash) {
            // First time setup - set default password
            await this.setPassword('Kalai@024');
            return password === 'Kalai@024';
        }
        const inputHash = await this.hashAnswer(password);
        return storedHash === inputHash;
    }
}

// Initialize database instance
const db = new Database();
let dbInitialized = false;

async function initDB() {
    if (!dbInitialized) {
        await db.init();
        await db.initializeSecurityQuestions();
        dbInitialized = true;
    }
    return db;
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        initDB().catch(console.error);
    });
}

