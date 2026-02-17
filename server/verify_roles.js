const axios = require('axios');

async function verifyRoleRegistration() {
    try {
        console.log("Testing Role Registration...");

        // 1. Register Student
        const studentEmail = `student${Math.floor(Math.random() * 1000)}@example.com`;
        const studentRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: "New Student",
            email: studentEmail,
            password: "password123",
            phone: "1231231234",
            role: "student"
        });
        console.log(`Student Registered: ${studentRes.data.user.role === 'student' ? 'PASS' : 'FAIL'}`);

        // 2. Register Staff
        const staffEmail = `staff${Math.floor(Math.random() * 1000)}@example.com`;
        const staffRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: "New Staff",
            email: staffEmail,
            password: "password123",
            phone: "1231231234",
            role: "staff"
        });
        console.log(`Staff Registered: ${staffRes.data.user.role === 'staff' ? 'PASS' : 'FAIL'}`);

        // 3. Register Admin
        const adminEmail = `admin${Math.floor(Math.random() * 1000)}@example.com`;
        const adminRes = await axios.post('http://localhost:5000/api/auth/register', {
            name: "New Admin",
            email: adminEmail,
            password: "password123",
            phone: "1231231234",
            role: "admin"
        });
        console.log(`Admin Registered: ${adminRes.data.user.role === 'admin' ? 'PASS' : 'FAIL'}`);

    } catch (error) {
        console.error("Verification Failed:", error.response ? error.response.data : error.message);
    }
}

verifyRoleRegistration();
