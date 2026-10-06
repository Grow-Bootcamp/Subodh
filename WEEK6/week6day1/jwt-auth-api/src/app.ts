import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import protectedRoutes from './routes/protected.routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// JSON body parsing
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);

// 404 for any unmatched route -> forwarded to the error handler
app.use(notFoundHandler);

// Centralized error handling (must stay last)
app.use(errorHandler);

export default app;
