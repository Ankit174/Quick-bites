const axios = require('axios');

async function verifyAccess() {
    try {
        // 1. Login
        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: "staff@example.com",
            password: "password123"
        });
        const token = loginRes.data.token;
        console.log("Login successful. Token received.");

        // 2. Access Protected Staff Route
        console.log("Accessing /api/orders (Staff Only)...");
        const ordersRes = await axios.get('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Access Successful! Orders count:", ordersRes.data.length);

        // 3. Verify /me endpoint
        console.log("Verifying /auth/me...");
        const meRes = await axios.get('http://localhost:5000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Me Endpoint User:", meRes.data);

    } catch (error) {
        if (error.response) {
            console.log("Verification Failed:", error.response.data);
            console.log("Status:", error.response.status);
        } else {
            console.log("Error:", error.message);
        }
    }
}

verifyAccess();
