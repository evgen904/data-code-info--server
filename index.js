require('dotenv').config()
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.NODE_ENV === "development" ? ['http://localhost:8080'] : ['https://www.data-code-info.ru'],
  credentials: true
}));
app.use('/api', router);
app.use(errorMiddleware)

const start = async () => {
  try {
    const mongooseConnect = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
    if (process.env.NODE_ENV === "production") {
      mongooseConnect["user"] = process.env.DB_USER
      mongooseConnect["pass"] = process.env.DB_PSW
    }
    await mongoose.connect(process.env.DB_URL, mongooseConnect)
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))

    app.use(express.static(__dirname))
    app.use(express.static(path.relative(__dirname, 'client')))

    app.get('*', (req, res) => {
      res.sendfile(path.join(__dirname, 'client', 'index.html'))
    })

  } catch (e) {
    console.log(e)
  }
}

start()
