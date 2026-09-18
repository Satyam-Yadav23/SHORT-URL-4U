import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/mongo.config.js';
import ShortUrl from './src/models/shortUrlmodel.js';
import auth_routes from './src/routes/auth.routes.js';
import user_routes from './src/routes/user.routes.js';
import shortUrlRoutes from './src/routes/shortUrl.route.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import { errorHandler } from './src/utils/errorHandler.js';
import cors from 'cors';
import { attachUser } from './src/utils/attachUser.js';
import cookieParser from 'cookie-parser';
import qrRoutes from './src/routes/qr.routes.js'
import dns from 'dns';

dns.setServers(
  (process.env.DNS_SERVERS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean)
);

dotenv.config({ path: './.env' });
const app = express();

   const allowedOrigins = [
     "https://shorturl4u.vercel.app",
    "https://short-url-4-u-url-shortener-3arfanuzb.vercel.app",
     "http://localhost:5173",
   ];

   app.use(cors({
     origin: function (origin, callback) {
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error("Not allowed by CORS"));
       }
     },
     credentials: true
   }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(attachUser);

app.use('/api/create', shortUrlRoutes);
app.use('/api/user', user_routes);
app.use('/api/auth', auth_routes);
app.use("/api/qr", qrRoutes);
// redirect route
app.get('/:id', redirectFromShortUrl);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});