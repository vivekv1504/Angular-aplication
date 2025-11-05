# 🍷 SipStop - Premium Alcohol Store Web Application

A full-featured Angular 20 web application for managing an online alcohol store with separate interfaces for store owners and customers.

## 🚀 Features

### User Authentication
- **Signup**: New users can create accounts with role selection (Customer or Store Owner)
- **Login**: Secure authentication with role-based routing
- Credentials stored in JSON files (`assets/users.json`)
- Session-based authentication using sessionStorage

### For Store Owners (Admin Panel)
- **CRUD Operations** for alcohol products:
  - ✨ Create new products
  - 📖 View all products in a table format
  - ✏️ Edit existing products
  - 🗑️ Delete products
- Search and filter products
- Real-time stock monitoring with visual indicators
- Product data stored in `assets/products.json`

### For Customers
- Browse products in an elegant grid layout
- Search products by name or description
- Filter products by category
- Add products to shopping cart
- Manage cart items (update quantity, remove items)
- Complete checkout process with:
  - Shipping information form
  - Payment details form
  - Order confirmation

## 📋 Demo Credentials

### Store Owner
- **Email**: owner@sipstop.com
- **Password**: owner123

### Customer
- **Email**: customer@sipstop.com
- **Password**: customer123

## 🛠️ Technology Stack

- **Framework**: Angular 20
- **Language**: TypeScript
- **Styling**: CSS3 with modern gradients and animations
- **State Management**: RxJS (BehaviorSubject)
- **Routing**: Angular Router with guards
- **HTTP Client**: Angular HttpClient
- **Data Storage**: JSON files in assets folder

## 📁 Project Structure

```
sipstop/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/              # Login component
│   │   │   ├── signup/             # Signup component
│   │   │   ├── admin-dashboard/    # Admin CRUD interface
│   │   │   ├── customer-products/  # Product browsing
│   │   │   ├── cart/               # Shopping cart
│   │   │   └── checkout/           # Checkout process
│   │   ├── services/
│   │   │   ├── auth.ts             # Authentication service
│   │   │   ├── product.ts          # Product management service
│   │   │   └── cart.ts             # Cart management service
│   │   ├── models/
│   │   │   ├── user.ts             # User interface
│   │   │   ├── product.ts          # Product interface
│   │   │   ├── cart-item.ts        # Cart item interface
│   │   │   └── order.ts            # Order interface
│   │   ├── guards/
│   │   │   └── auth-guard.ts       # Route protection guard
│   │   ├── app.routes.ts           # Application routes
│   │   └── app.config.ts           # App configuration
│   └── assets/
│       ├── users.json              # User accounts storage
│       ├── products.json           # Product catalog
│       ├── cart.json               # Cart data
│       └── orders.json             # Order history
```

## 🎨 Key Features Explained

### Authentication System
- Role-based authentication (Customer vs Owner)
- Session persistence using sessionStorage
- Protected routes with Angular guards
- Automatic redirection based on user role

### Admin Dashboard (Store Owner)
- Full CRUD operations for products
- Modal-based forms for add/edit operations
- Real-time product search
- Stock level indicators (green for adequate, orange for low stock)
- Responsive table design

### Customer Experience
- Beautiful product grid with hover effects
- Category-based filtering
- Real-time search functionality
- Smooth cart management
- Multi-step checkout process
- Order confirmation with unique order number

### Data Persistence
- LocalStorage for cart items
- SessionStorage for user authentication
- JSON files for product and user data
- In a production environment, these would be replaced with backend APIs

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Navigate to the project directory:
```bash
cd sipstop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:4200
```

## 🔐 Security Notes

**Important**: This is a demonstration application. In a production environment:
- Never store passwords in plain text
- Use proper backend APIs with secure authentication (JWT, OAuth)
- Implement HTTPS
- Add input validation and sanitization
- Use environment variables for sensitive data
- Implement proper CORS policies

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1400px+)
- Tablets (768px - 1024px)
- Mobile devices (< 768px)

## 🎯 Future Enhancements

Potential improvements for production:
- Backend API integration (Node.js/Express, ASP.NET Core, etc.)
- Database integration (MongoDB, PostgreSQL, etc.)
- Image upload functionality for products
- Order tracking system
- Email notifications
- Payment gateway integration (Stripe, PayPal)
- User profile management
- Product reviews and ratings
- Wishlist functionality
- Advanced analytics dashboard for owners

## 🤝 Contributing

This is a demonstration project. Feel free to fork and modify for your own use.

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Developer

Created as a demonstration of Angular 20 capabilities, showcasing:
- Component architecture
- Service-based state management
- Routing with guards
- Reactive programming with RxJS
- Modern CSS styling
- TypeScript best practices

---

**Enjoy using SipStop! 🍷✨**
