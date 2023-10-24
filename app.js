import 'dotenv/config'
import express from "express";
import morgan from 'morgan';
import bodyParser from "body-parser";
import './config/db.js'
import authRoutes from './routes/authRoutes.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoute.js';
import blogRouter from "./routes/blogRoute.js"
import prodCategoryRouter from "./routes/prodCategoryRoute.js"
import blogCategoryRouter from "./routes/blogCategoryRoute.js"
const PORT = process.env.PORT || 3000 ;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser())
app.use(morgan("dev"))

app.use('/api/user', authRoutes);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/prod-category', prodCategoryRouter)
app.use('/api/blog-category', blogCategoryRouter);

app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})

