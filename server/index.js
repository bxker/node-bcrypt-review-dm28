require('dotenv').config()
const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')

//controllers
const {register, login, logout, getSession} = require('./controllers/authController');

//dotenv
const {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env; 

//body parser
app.use(express.json());
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        //week before expire
        maxAge: 1000*60*60*24*7
    }
}));

//db connection
massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('DB Connected')
})

app.post('/auth/register', register)
app.post('/auth/login', login)
app.post('/auth/logout', logout)
app.get('/auth/user', getSession)

app.listen(SERVER_PORT, () => console.log('Server Listening'))