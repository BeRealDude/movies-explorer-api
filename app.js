require('dotenv').config();

const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');

const { errorCenter } = require('./middlewares/error-center');

const routes = require('./routes');

const { PORT, DB_ADDRESS } = require('./config');

const app = express();
app.use(express.json());

app.use(cors());

mongoose.connect(DB_ADDRESS);

app.use(routes);

app.use(errorCenter);

app.listen(PORT);
