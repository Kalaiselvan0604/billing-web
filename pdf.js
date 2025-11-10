// PDF Generation for Reports

async function downloadDailyPDF() {
    try {
        const date = document.getElementById('reportDate').value;
        const database = await initDB();
        const bills = await database.getBillsByDate(date);
        
        if (bills.length === 0) {
            alert('No bills found for this date.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        // Header
        doc.setFontSize(20);
        doc.setTextColor(76, 175, 80);
        doc.text('Tea Restaurant', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Daily Turnover Report', 105, 30, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Date: ${dateStr}`, 105, 40, { align: 'center' });

        let y = 50;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        const lineHeight = 7;

        // Summary
        const total = bills.reduce((sum, bill) => sum + bill.total, 0);
        const average = total / bills.length;

        doc.setFontSize(14);
        doc.text('Summary', margin, y);
        y += lineHeight + 2;

        doc.setFontSize(11);
        doc.text(`Total Revenue: ₹${total.toFixed(2)}`, margin, y);
        y += lineHeight;
        doc.text(`Total Bills: ${bills.length}`, margin, y);
        y += lineHeight;
        doc.text(`Average Bill: ₹${average.toFixed(2)}`, margin, y);
        y += lineHeight + 5;

        // Bills
        doc.setFontSize(14);
        doc.text('Bill Details', margin, y);
        y += lineHeight + 2;

        doc.setFontSize(10);

        bills.forEach((bill, index) => {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(11);
            doc.text(`Bill #${bill.billNumber}`, margin, y);
            y += lineHeight;
            
            doc.setFontSize(9);
            doc.text(`Date: ${new Date(bill.timestamp).toLocaleString()}`, margin, y);
            y += lineHeight;

            bill.items.forEach(item => {
                const itemText = `${item.name} × ${item.quantity}`;
                const priceText = `₹${(item.price * item.quantity).toFixed(2)}`;
                doc.text(itemText, margin + 5, y);
                doc.text(priceText, 180, y);
                y += lineHeight;
            });

            if (bill.offer > 0) {
                doc.text(`Offer (${bill.offer}%): -₹${bill.discount.toFixed(2)}`, margin + 5, y);
                y += lineHeight;
            }

            doc.setFontSize(10);
            doc.text(`Total: ₹${bill.total.toFixed(2)}`, margin + 5, y);
            y += lineHeight + 3;

            if (index < bills.length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.line(margin, y, 190, y);
                y += 5;
            }
        });

        // Footer
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Page ${i} of ${totalPages}`,
                105,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        doc.save(`Daily_Report_${date.replace(/-/g, '_')}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

async function downloadMonthlyPDF() {
    try {
        const monthString = document.getElementById('reportMonth').value;
        const [year, month] = monthString.split('-').map(Number);
        const database = await initDB();
        const bills = await database.getBillsByMonth(year, month - 1);
        
        if (bills.length === 0) {
            alert('No bills found for this month.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const monthStr = `${monthNames[month - 1]} ${year}`;

        // Header
        doc.setFontSize(20);
        doc.setTextColor(76, 175, 80);
        doc.text('Tea Restaurant', 105, 20, { align: 'center' });
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Monthly Turnover Report', 105, 30, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Month: ${monthStr}`, 105, 40, { align: 'center' });

        let y = 50;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        const lineHeight = 7;

        // Summary
        const total = bills.reduce((sum, bill) => sum + bill.total, 0);
        const average = total / bills.length;
        const daysInMonth = new Date(year, month, 0).getDate();
        const avgDaily = total / daysInMonth;

        doc.setFontSize(14);
        doc.text('Summary', margin, y);
        y += lineHeight + 2;

        doc.setFontSize(11);
        doc.text(`Total Revenue: ₹${total.toFixed(2)}`, margin, y);
        y += lineHeight;
        doc.text(`Total Bills: ${bills.length}`, margin, y);
        y += lineHeight;
        doc.text(`Average Bill: ₹${average.toFixed(2)}`, margin, y);
        y += lineHeight;
        doc.text(`Average Daily Revenue: ₹${avgDaily.toFixed(2)}`, margin, y);
        y += lineHeight + 5;

        // Daily Breakdown
        const dailyGroups = {};
        bills.forEach(bill => {
            const date = bill.date;
            if (!dailyGroups[date]) {
                dailyGroups[date] = { total: 0, count: 0 };
            }
            dailyGroups[date].total += bill.total;
            dailyGroups[date].count += 1;
        });

        doc.setFontSize(14);
        doc.text('Daily Breakdown', margin, y);
        y += lineHeight + 2;

        doc.setFontSize(10);
        const sortedDates = Object.keys(dailyGroups).sort();
        sortedDates.forEach(date => {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = 20;
            }

            const group = dailyGroups[date];
            const dateObj = new Date(date);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            doc.text(`${dateStr}: ₹${group.total.toFixed(2)} (${group.count} bills)`, margin + 5, y);
            y += lineHeight;
        });

        y += 5;

        // Bills List (condensed)
        doc.setFontSize(14);
        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }
        doc.text('All Bills', margin, y);
        y += lineHeight + 2;

        doc.setFontSize(9);
        bills.forEach((bill, index) => {
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }

            const dateObj = new Date(bill.timestamp);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            doc.text(
                `#${bill.billNumber} - ${dateStr} - ₹${bill.total.toFixed(2)}`,
                margin,
                y
            );
            y += lineHeight;
        });

        // Footer
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Page ${i} of ${totalPages}`,
                105,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        doc.save(`Monthly_Report_${year}_${String(month).padStart(2, '0')}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

