const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const configRoutes = require('./routes/configRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Vite default port
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

app.get('/', (req, res) => {
    res.send('Smart College Canteen API is running...');
});

app.set('socketio', io);

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
