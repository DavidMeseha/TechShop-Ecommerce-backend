# TikShop API Documentation 📚

## Table of Contents

- [Authentication](#-authentication-routes)
- [User Management](#-user-routes)
- [Catalog](#-catalog-routes)
- [Common](#-common-routes)
- [Product](#-product-routes)

## 🔑 Authentication Routes

### Base URL: `/api/auth`

| Method | Endpoint    | Description                 |
| ------ | ----------- | --------------------------- |
| GET    | `/check`    | Verify authentication token |
| GET    | `/guest`    | Generate guest token        |
| POST   | `/login`    | User login                  |
| POST   | `/logout`   | User logout                 |
| POST   | `/register` | User registration           |

<details>
<summary>Detailed Specifications</summary>

#### GET /check

```typescript
Headers: {
  Authorization: 'Bearer ${token}';
}
Response: {
  user: UserTokenPayload;
}
```

#### POST /login

```typescript
Body: {
  email: string;
  password: string;
}
Response: {
  user: UserTokenPayload;
  token: string;
}
```
