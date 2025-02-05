# TikShop Backend

Backend service for TikShop e-commerce platform built with Node.js, Express, and MongoDB.

## 🔗 Related Projects & Live Links

### Frontend Applications
- [Next.js Frontend](https://github.com/DavidMeseha/allInOne-myShop-Front)
- [Angular Frontend](https://github.com/DavidMeseha/TechShop-Angular-) (In Progress)

### Live Demos
- [Next.js Demo](https://techshop-commerce.vercel.app/)
- [Angular Demo](https://tech-shop-angular.vercel.app/) (In Progress)

## 🛠️ Technology Stack

### Core
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database layer
- **TypeScript** - Type safety

### Integrations
- **JWT** - Authentication
- **Vercel Blob** - File storage
- **Stripe** - Payment processing
- **Node-cron** - Task scheduling

## 🎯 Features

### Product Management
- Product catalog with categories and tags
- Product attributes and variants
- Search functionality
- Reviews and ratings
- Image upload and management

### User Management
- Authentication & authorization
- Profile management
- Shopping cart functionality
- Wishlist & favorites
- Order history

### Order Processing
- Cart management
- Stripe payment integration
- Order status tracking
- Shipping management

### Internationalization
- Multi-language support (EN, AR, FR)
- Localized content
- RTL support

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm

### Installation

1. Clone the repository:
2. Install dependencies:
3. Configure environment variables:
bash
cp .env

env
PORT=3000
DB_URI=mongodb://localhost:27017/tikshop
ACCESS_TOKEN_SECRET=your_secret
ORIGIN=http://localhost:3000
DOMAIN=your_domain
FILES_READ_WRITE_TOKEN=vercel_token
STRIPE_SECRET=stripe_key

4. Start development server:
npm run dev

## 🌐 Internationalization

Supported languages:
- English (en)
- Arabic (ar)
- French (fr)

Translation files are located in `src/locales/`

## 🔒 Security Features

- CORS protection
- JWT authentication
- Input validation
- Rate limiting
- Error handling

### Best Practices
- RESTful API design
- Proper error handling
- Input validation
- Type safety
- Clean & Simple architecture
