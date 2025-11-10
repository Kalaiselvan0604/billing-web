// Turnover Management
let billCounter = 0;

async function processPayment() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    try {
        const database = await initDB();
        const billNumber = await database.getNextBillNumber();
        const totals = calculateTotal();
        
        const bill = {
            billNumber: billNumber,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: totals.subtotal,
            discount: totals.discount,
            total: totals.total,
            offer: currentOffer ? currentOffer.percentage : 0,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        await database.addBill(bill);
        
        // Clear cart and offer
        cart = [];
        currentOffer = null;
        saveCart();
        saveOffer();
        updateCartDisplay();
        updateOfferDisplay();
        
        alert(`Bill #${billNumber} processed successfully! Total: ₹${totals.total.toFixed(2)}`);
        
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error processing payment. Please try again.');
    }
}

async function loadDailyTurnover(date) {
    try {
        const database = await initDB();
        const bills = await database.getBillsByDate(date);
        
        displayDailyBills(bills, date);
    } catch (error) {
        console.error('Error loading daily turnover:', error);
    }
}

function displayDailyBills(bills, date) {
    const billsList = document.getElementById('billsList');
    const dailyTotal = document.getElementById('dailyTotal');
    const dailyBillsCount = document.getElementById('dailyBillsCount');
    const dailyAverage = document.getElementById('dailyAverage');

    if (!billsList) return;

    if (bills.length === 0) {
        billsList.innerHTML = '<p class="loading">No bills found for this date.</p>';
        if (dailyTotal) dailyTotal.textContent = '₹0.00';
        if (dailyBillsCount) dailyBillsCount.textContent = '0';
        if (dailyAverage) dailyAverage.textContent = '₹0.00';
        return;
    }

    const total = bills.reduce((sum, bill) => sum + bill.total, 0);
    const average = total / bills.length;

    if (dailyTotal) dailyTotal.textContent = `₹${total.toFixed(2)}`;
    if (dailyBillsCount) dailyBillsCount.textContent = bills.length.toString();
    if (dailyAverage) dailyAverage.textContent = `₹${average.toFixed(2)}`;

    billsList.innerHTML = bills.map(bill => `
        <div class="bill-card">
            <div class="bill-header">
                <div>
                    <div class="bill-number">Bill #${bill.billNumber}</div>
                    <div class="bill-date">${new Date(bill.timestamp).toLocaleString()}</div>
                </div>
                <div class="bill-total">₹${bill.total.toFixed(2)}</div>
            </div>
            <div class="bill-items">
                ${bill.items.map(item => `
                    <div class="bill-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            ${bill.offer > 0 ? `
                <div class="bill-item">
                    <span>Offer (${bill.offer}%)</span>
                    <span>-₹${bill.discount.toFixed(2)}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function loadMonthlyTurnover(monthString) {
    try {
        const [year, month] = monthString.split('-').map(Number);
        const database = await initDB();
        const bills = await database.getBillsByMonth(year, month - 1);
        
        displayMonthlyBills(bills, year, month);
    } catch (error) {
        console.error('Error loading monthly turnover:', error);
    }
}

function displayMonthlyBills(bills, year, month) {
    const billsList = document.getElementById('billsList');
    const monthlyTotal = document.getElementById('monthlyTotal');
    const monthlyBillsCount = document.getElementById('monthlyBillsCount');
    const monthlyAverage = document.getElementById('monthlyAverage');
    const monthlyDailyAvg = document.getElementById('monthlyDailyAvg');
    const dailyBreakdown = document.getElementById('dailyBreakdown');

    if (!billsList) return;

    if (bills.length === 0) {
        billsList.innerHTML = '<p class="loading">No bills found for this month.</p>';
        if (monthlyTotal) monthlyTotal.textContent = '₹0.00';
        if (monthlyBillsCount) monthlyBillsCount.textContent = '0';
        if (monthlyAverage) monthlyAverage.textContent = '₹0.00';
        if (monthlyDailyAvg) monthlyDailyAvg.textContent = '₹0.00';
        if (dailyBreakdown) dailyBreakdown.innerHTML = '<p class="loading">No data available.</p>';
        return;
    }

    const total = bills.reduce((sum, bill) => sum + bill.total, 0);
    const average = total / bills.length;

    // Group by date
    const dailyGroups = {};
    bills.forEach(bill => {
        const date = bill.date;
        if (!dailyGroups[date]) {
            dailyGroups[date] = { total: 0, count: 0 };
        }
        dailyGroups[date].total += bill.total;
        dailyGroups[date].count += 1;
    });

    const daysInMonth = new Date(year, month, 0).getDate();
    const avgDaily = total / daysInMonth;

    if (monthlyTotal) monthlyTotal.textContent = `₹${total.toFixed(2)}`;
    if (monthlyBillsCount) monthlyBillsCount.textContent = bills.length.toString();
    if (monthlyAverage) monthlyAverage.textContent = `₹${average.toFixed(2)}`;
    if (monthlyDailyAvg) monthlyDailyAvg.textContent = `₹${avgDaily.toFixed(2)}`;

    // Display daily breakdown
    if (dailyBreakdown) {
        const sortedDates = Object.keys(dailyGroups).sort();
        dailyBreakdown.innerHTML = sortedDates.map(date => {
            const group = dailyGroups[date];
            const dateObj = new Date(date);
            return `
                <div class="daily-breakdown-item">
                    <span>${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span><strong>₹${group.total.toFixed(2)}</strong> (${group.count} bills)</span>
                </div>
            `;
        }).join('');
    }

    // Display all bills
    billsList.innerHTML = bills.map(bill => `
        <div class="bill-card">
            <div class="bill-header">
                <div>
                    <div class="bill-number">Bill #${bill.billNumber}</div>
                    <div class="bill-date">${new Date(bill.timestamp).toLocaleString()}</div>
                </div>
                <div class="bill-total">₹${bill.total.toFixed(2)}</div>
            </div>
            <div class="bill-items">
                ${bill.items.map(item => `
                    <div class="bill-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            ${bill.offer > 0 ? `
                <div class="bill-item">
                    <span>Offer (${bill.offer}%)</span>
                    <span>-₹${bill.discount.toFixed(2)}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Make functions available globally
if (typeof window !== 'undefined') {
    window.processPayment = processPayment;
    window.loadDailyTurnover = loadDailyTurnover;
    window.loadMonthlyTurnover = loadMonthlyTurnover;
}

