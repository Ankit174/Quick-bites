const axios = require('axios');

async function registerStaff() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
            name: "Staff User",
            email: "staff@example.com",
            password: "password123",
            phone: "9876543210",
            role: "staff"
        });
        console.log("Registration Successful:", response.data);
    } catch (error) {
        if (error.response) {
            console.log("Registration Failed:", error.response.data);
        } else {
            console.log("Error:", error.message);
        }
    }
}

registerStaff();
