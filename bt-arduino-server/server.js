var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var utils = require('./helpers/utils');

var User = require('./models/User');

const app = express();
const router = express.Router();

mongoose.connect('mongodb://localhost:27017/bt-arduino');
const connection = mongoose.connection;

app.use(session({
    secret: 'blu3t00t4_4rduin0',
    resave: true,
    saveUninitialized: true
}));

app.use(cors());
app.use(bodyParser.json());

var auth = function(req,res,next){
    if(req.session && req.session.loggedIn){
        return next();
    }else{
        res.sendStatus(401);
    }
}

connection.once('open',() => {
    console.log("DB connection established!")
});

router.route('/login').get((req,res) => {
    if(!req.query.username ||!req.query.password){
        res.send('login failed');
    }else{
        utils.checkLogin(User,req.query.username, req.query.password).then(
            result => {
                if(result){
                    req.session.user = req.session.user;
                    req.session.loggedIn = true;
                    res.send("login success!");
                }else{
                    res.send('login failed');
                }
            },
            error => {
                console.log(error);
                res.send('login failed');
            }
        )
    }
});

router.route('/register').get((req,res) => {
    if(!req.query.username ||!req.query.password){
        res.send('registration failed');
    }else{
        utils.createLogin(User,req.query.username, req.query.password).then(
            result => {
                if(result){
                    res.send("registration success, please login.");
                }else{
                    res.send('registration failed');
                }
            },
            error => {
                console.log(error);
                res.send('registration failed');
            }
        )
    }
});

// Logout endpoint
router.route('/logout').get((req, res) => {
    req.session.destroy();
    res.send("logout success!");
});

router.route('/testLogin').get(auth,(req,res) => {
    res.send("You are logged in");
});

app.use('/', router);

app.listen(4000, () => console.log('Server Up'));