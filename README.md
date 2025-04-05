# TikShop Backend 🚀

Backend service for TikShop e-commerce platform built with Node.js, Express, and MongoDB.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 📋 Table of Contents
- [Related Projects](#-related-projects)
- [Technology Stack](#-technology-stack)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security](#-security)

## 🔗 Related Projects

### Frontend Applications
- **Next.js Frontend**: [Repository](https://github.com/DavidMeseha/allInOne-myShop-Front) | [Live Demo](https://techshop-commerce.vercel.app/)
- **Angular Frontend**: [Repository](https://github.com/DavidMeseha/TechShop-Angular-) | [Live Demo](https://tech-shop-angular.vercel.app/) (In Progress)

## 🛠️ Technology Stack

### Core Technologies
```json
{
  "backend": {
    "runtime": "Node.js",
    "framework": "Express.js",
    "language": "TypeScript",
    "database": "MongoDB"
  }
}
```

### Key Integrations
- **Authentication**: JWT
- **Storage**: Vercel Blob
- **Payments**: Stripe
- **Scheduling**: Node-cron
- **ORM**: Mongoose

## 🎯 Features

### 📦 Product Management
- Product catalog with categories
- Advanced search & filtering
- Reviews & ratings system
- Image management
- Inventory tracking

### 👥 User Management
- Secure authentication
- Role-based authorization
- Profile customization
- Shopping cart & wishlist
- Order history tracking

### 🛒 Order Processing
- Cart management system
- Secure payment processing
- Order status tracking
- Shipping integration
- Automated notifications

### 🌐 Internationalization
- Multi-language support
  - 🇺🇸 English (en)
  - 🇸🇦 Arabic (ar)
  - 🇫🇷 French (fr)
- RTL layout support

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= v18.0.0
MongoDB >= v5.0.0
npm >= v8.0.0
```

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/your-username/tik-shadow-backend.git
cd tik-shadow-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```env
PORT=3000
DB_URI=mongodb://localhost:27017/techshop
ACCESS_TOKEN_SECRET=your_secret
ORIGIN=http://localhost:3000
DOMAIN=your_domain
FILES_READ_WRITE_TOKEN=vercel_blob_token
STRIPE_SECRET=stripe_key
```

4. Start development server
```bash
npm run dev
```

## 🔒 Security Features

### Implementation
- CORS protection
- JWT authentication
- Request rate limiting
- Input validation
- Error handling middleware

### Best Practices
- RESTful API design
- Secure password hashing
- Environment variable protection
- XSS/CSRF prevention
- Regular security updates

## 📖 API Documentation

API documentation is available at `/api-docs` when running the server.

### Sample Endpoints
```typescript
POST   /api/auth/login
GET    /api/products
POST   /api/orders
PUT    /api/users/profile
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.