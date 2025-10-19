import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes'; 

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use(protectedRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});