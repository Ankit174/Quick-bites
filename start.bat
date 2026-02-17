@echo off
echo Starting Smart College Canteen...

:: Start Server
start "Server" cmd /k "cd server && npm run dev"

:: Start Client
start "Client" cmd /k "cd client && npm run dev"

echo Application started!
echo Server running at http://localhost:5000
echo Client running at http://localhost:5173
