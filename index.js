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
  origin: ['http://localhost:8080'],
  credentials: true
}));
app.use('/api', router);
app.use(errorMiddleware)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
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
