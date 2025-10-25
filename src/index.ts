import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API de Autenticação e Tarefas está a funcionar!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});