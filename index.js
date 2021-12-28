const express = require('express');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const connectDB = require('./config/db');
const morgan = require('morgan');
const passport = require('passport');
const userRoutes = require('./routes/users')
const notaRoutes = require('./routes/notas')
const portadaRoutes = require('./routes/portadas');
const borradorRoutes = require('./routes/borrador');
const cors = require("cors");
const session = require('express-session');
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/yelp-camp';
const MongoStore = require('connect-mongo');
const path = require('path');

connectDB();



require('./config/passport')(passport);
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const sessionConfig = {
  store: MongoStore.create({
    mongoUrl: dbUrl,
    secret: 'secret',
    touchAfter: 24 * 60 * 60,
  }),
  name: 'session',
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    //secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}


app.use(session(sessionConfig));


app.use(passport.initialize());
app.use(passport.session());


app.use('/', userRoutes)
app.use('/', portadaRoutes)
app.use('/nota', notaRoutes)
app.use('/borrador', borradorRoutes)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server runing in ${process.env.NODE_ENV} mode on port ${PORT}`))
