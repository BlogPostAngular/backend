# Windows Testing Commands

## Using PowerShell (Recommended)

### Register User

```powershell
$body = @{
    username = "testuser"
    password = "test123"
    name = "Test User"
    email = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/v1/users/register" -Method Post -Body $body -ContentType "application/json"
```

### Login User

```powershell
$body = @{
    username = "testuser"
    password = "test123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### Get User Profile (with token)

```powershell
$token = "your_access_token_here"
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:3000/v1/users/me" -Method Get -Headers $headers
```

## Using curl on Windows (Single Line)

### Register User

```cmd
curl -X POST "http://localhost:3000/v1/users/register" -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"password\":\"test123\",\"name\":\"Test User\"}"
```

### Login User

```cmd
curl -X POST "http://localhost:3000/v1/auth/login" -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"password\":\"test123\"}"
```

## Using the Test Script

We've created a PowerShell script that tests all endpoints:

```powershell
cd server
.\test-api.ps1
```

## Using VS Code REST Client

Install the "REST Client" extension, then open `api-tests.http` and click "Send Request" above each endpoint.
