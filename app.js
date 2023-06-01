require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const { PORT, DB_ADDRESS } = require('./config');

const app = express();

mongoose.connect(DB_ADDRESS);

app.listen(PORT);
