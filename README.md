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

The server will run on `http://localhost:3000`

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

---

## 🚀 Deployment & CI/CD Guide

This project is deployed to a Google Cloud Compute Engine instance using Docker and GitHub Actions.

### CI/CD Flow (GitHub Actions)

1. **Trigger:** Any code pushed to the `main` branch automatically triggers `.github/workflows/ci-cd.yml`.
2. **Package:** GitHub Actions creates a compressed `.tar` archive of the codebase (excluding `node_modules` and `.git`).
3. **Transfer:** It securely copies the archive to the server at `~/app-blog/server` using SCP.
4. **Deploy:** It logs into the server via SSH, extracts the code, and runs `docker compose -f docker-compose.prod.yml up -d --build`.
5. **Clean up:** Old Docker images are pruned to save disk space.

*To view deployment logs, check the **"Actions"** tab in your GitHub repository.*

### 💻 Server Access Guide

You can access the server terminal using one of two methods:

**Method 1: Google Cloud Console (Easiest)**
1. Open the Google Cloud Console.
2. Go to **Compute Engine > VM instances**.
3. Click the **SSH** button next to your instance.

**Method 2: Local Terminal**
If your SSH keys are set up locally:
```bash
ssh saapril1177@<YOUR_SERVER_IP>
```

### 🛠️ Useful Server Commands

Once logged into your server terminal, use these commands to manage the application:

**1. Navigate to the App Directory:**
```bash
cd ~/app-blog/server/docker
```

**2. View Running Containers:**
```bash
docker compose -f docker-compose.prod.yml ps
```

**3. View Live Logs:**
```bash
# View all logs
docker compose -f docker-compose.prod.yml logs -f

# View only the API logs
docker compose -f docker-compose.prod.yml logs -f api
```
*(Press `Ctrl + C` to exit logs)*

**4. Restart the Application:**
```bash
docker compose -f docker-compose.prod.yml restart
```

**5. Manually Deploy (Without GitHub):**
```bash
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```