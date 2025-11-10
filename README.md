# Tea Restaurant Billing System

A Progressive Web App (PWA) billing system for a tea restaurant with offline functionality, menu management, cart operations, turnover tracking, and admin authentication.

## Features

- **Menu Management**: Tea, Coffee, Vada, Samosa, Juice, Ice Cream with multiple varieties
- **Cart Operations**: Full CRUD operations for cart items
- **Billing System**: Touch-to-add items, apply offers, process payments
- **Turnover Tracking**: Daily and monthly reports with PDF download
- **Offline Support**: Works completely offline using IndexedDB
- **Responsive Design**: Optimized for both mobile and laptop
- **Admin Panel**: Menu management, offer settings, statistics
- **Password Recovery**: Security questions-based password recovery

## Technology Stack

- HTML5, CSS3, JavaScript (Vanilla)
- IndexedDB for offline data storage
- jsPDF for PDF generation
- PWA (Progressive Web App) with Service Worker

## Setup Instructions

1. **Clone or Download** this repository

2. **Open** `index.html` in a web browser

3. **For GitHub Pages Deployment**:
   - Push this repository to your GitHub account
   - Go to repository Settings > Pages
   - Select source branch (usually `main` or `master`)
   - Your site will be available at `https://yourusername.github.io/repository-name`

## Usage

### Billing
1. Browse menu items by category
2. Touch/click items to add to cart
3. Adjust quantities or remove items
4. Apply offer percentage if needed
5. Click "Pay" to process bill

### Admin Panel
- **Login**: Use GitHub email: `mechkalai2004@gmail.com` and password: `Kalai@024`
- **Menu Management**: Add, edit, or delete menu items
- **Offer Management**: Set festival offers (percentage-based)
- **Statistics**: View today's and monthly revenue

### Reports
- **Daily Turnover**: View and download daily reports as PDF
- **Monthly Turnover**: View monthly breakdown and download PDF

### Password Recovery
If you forget your password:
1. Go to "Forgot Password" page
2. Answer the 3 security questions:
   - What is your fav job? (Answer: design)
   - What is your first business dream? (Answer: transport)
   - What is your second business name? (Answer: cow form)
3. Set a new password

## Offline Functionality

This app works completely offline:
- All data is stored in IndexedDB
- Service Worker caches all assets
- No internet connection required after first load

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (Chrome, Safari, Firefox)

## File Structure

```
/
├── index.html              # Main billing interface
├── admin.html              # Admin dashboard
├── login.html              # GitHub authentication
├── forgot-password.html   # Password recovery
├── daily-turnover.html     # Daily reports
├── monthly-turnover.html   # Monthly reports
├── css/
│   ├── style.css          # Main styles
│   ├── admin.css          # Admin styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js             # Main application logic
│   ├── cart.js            # Cart operations
│   ├── menu.js            # Menu management
│   ├── db.js              # IndexedDB operations
│   ├── auth.js            # Authentication
│   ├── admin.js           # Admin operations
│   ├── turnover.js       # Turnover calculations
│   ├── pdf.js             # PDF generation
│   └── service-worker.js  # PWA offline support
├── images/                # Menu item images
├── manifest.json          # PWA manifest
└── README.md             # This file
```

## Default Menu Items

The app comes with pre-loaded menu items:
- **Tea**: Masala Chai, Green Tea, Black Tea, Lemon Tea, Ginger Tea
- **Coffee**: Filter Coffee, Cappuccino, Espresso, Latte, Black Coffee
- **Vada**: Medu Vada, Masala Vada, Rava Vada, Onion Vada
- **Samosa**: Aloo Samosa, Punjabi Samosa, Samosa Chat, Mini Samosa
- **Juice**: Orange, Apple, Mango, Pineapple, Mixed Fruit
- **Ice Cream**: Vanilla, Chocolate, Strawberry, Butterscotch, Kulfi

## Notes

- Images are loaded from Unsplash (open source)
- All data is stored locally in your browser
- No server or backend required
- Perfect for offline use

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

