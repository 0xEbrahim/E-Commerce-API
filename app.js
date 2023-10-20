import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import './config/db.js'
const app = express();
import authRoutes from './routes/authRoutes.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js';
const PORT = process.env.PORT || 3000 ;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}));



app.use('/api/user', authRoutes);
app.use(notFound)
app.use(errorHandler)
app.listen(PORT, () => {
    console.log("listening on port " + PORT);
})

