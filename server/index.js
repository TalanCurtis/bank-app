require('dotenv').config()
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const massive = require('massive')

const app = express()
// Destructuring .env file
const { SERVER_PORT, SESSION_SECRET, DOMAIN, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, CONNECTION_STRING } = process.env

// Top Level middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
})

// Setting up passport to use this "strategy"
// passport.use takes in a Contructor Function ({})
passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    // this is where you make a database call
    // serializeUser get called imediatly after done
    //done(null, profile)
    const db = app.get('db');

    const { sub, name, picture } = profile._json;

    db.find_user([sub]).then(dbResponse => {
        if (dbResponse[0]) {
            done(null, dbResponse[0].id)
        } else {
            // creates user and sends it back
            db.create_user([name, picture, sub]).then(dbResponse => {
                done(null, dbResponse[0].id)
            })
        }
    });
}));
// serializeUser is gets profile passed down from passport.authenticate done(profile)
passport.serializeUser((id, done) => {
    done(null, id)
});

// deserializeUser 
// whatever you pass out through profile shows up on a req.user{}
// this where you 
passport.deserializeUser((id, done) => {
    const db = app.get('db');
    db.find_logged_in_user([id]).then(dbResponse => {
        done(null, dbResponse[0])
    })
});

// Endpoints
//// Auth 0 
app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/private'
}))
//////// This enpoint checks to see if user is still loged in
///// put this check on component did mount to see if user still valaid
app.get('/auth/me', (req, res) => {
    if (!req.user) {
        res.status(404).send('user not loged in')
    } else {
        res.status(200).send(req.user)
    }
})
// when login out if  you hit back chrome has cached your page. How do you stop?
// prevent browser from caching previos page.
app.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('http://localhost:3000/')
} )

app.listen(SERVER_PORT, () => (console.log(`Rockin port: ${SERVER_PORT}`)))
