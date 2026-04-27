# Blog Post API Server

Backend API for the Blog Post Angular application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Open the `.env` file in the server folder
2. Replace `<YOUR_PASSWORD_HERE>` with your actual MongoDB password
3. Update other settings if needed

### 3. Run the Server

Development mode (with auto-restart):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run on `http://localhost:4200`

## API Endpoints

### Authentication

#### Register

- **POST** `/v1/users/register`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "password": "password123",
    "name": "John Doe",
    "email": "john@example.com" (optional)
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "access_token": "jwt_token_here",
      "refresh_token": "refresh_token_here",
      "user": { ... }
    }
  }
  ```

#### Login

- **POST** `/v1/auth/login`
- **Body:**
  ```json
  {
    "username": "johndoe",
    "password": "password123"
  }
  ```
- **Response:** Same as register

#### Refresh Token

- **POST** `/v1/auth/refresh-token`
- **Body:**
  ```json
  {
    "refresh_token": "refresh_token_here"
  }
  ```

#### Logout

- **POST** `/v1/auth/logout`
- **Headers:** `Authorization: Bearer {access_token}`

### User Profile

#### Get Current User

- **GET** `/v1/users/me`
- **Headers:** `Authorization: Bearer {access_token}`

#### Update Current User

- **PUT** `/v1/users/me`
- **Headers:** `Authorization: Bearer {access_token}`
- **Body:**
  ```json
  {
    "personal_info": {
      "fullName": "John Doe Updated",
      "bio": "My bio"
    },
    "social_links": {
      "twitter": "https://twitter.com/johndoe"
    }
  }
  ```

### Health Check

- **GET** `/health`

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT authentication with access & refresh tokens
- ✅ Environment variables for sensitive data
- ✅ CORS enabled
- ✅ Input validation

## Next Steps

You mentioned you'll handle CRUD operations later. When ready, you can add routes for:

- Blog posts (create, read, update, delete)
- Comments
- Categories
- Articles

The authentication middleware is already set up in `middleware/auth.js` - just add `auth` middleware to any protected routes.
echo "# backend" >> README.md
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/BlogPostAngular/backend.git
git push -u origin main