import express from 'express'
import { callbackRoute } from './route.js';

const app = express();

const port = 5000;

app.set('view engine', 'ejs');

app.use(callbackRoute);



app.listen(port, () => console.log(`App started on port ${port}`))

