const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const {MONGOURI} = require('./config/keys');
const Url = require('./models/url');
const Guesturl = require('./models/guesturl');
const User = require('./models/user');
const {generateShortUrl} = require('./helper/randomStr');
const { urlencoded } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('./config/keys');
const requireLogin = require('./middleware/requireLogin');
const path = require('path');

mongoose.connect(MONGOURI);
mongoose.connection.on('connected', ()=>{
    console.log('connected to mongo database');
});
mongoose.connection.on('error', ()=>{
    console.log('error connecting', err);
});

app.use(express.json());

app.get('/all', requireLogin, (req, res)=>{
    Url.find({postedBy: req.user._id})
    .populate("postedBy", "_id email firstName lastName createdAt updatedAt")
    .sort('-createdAt')
    .then(data => {
        res.json({message: "all data", allData: data});
    })
    .catch(err => {
        console.log(err);
    })
})

app.post('/create', requireLogin, (req, res) => {
    const {longUrl, expiry} = req.body;
    if(!longUrl){
        return res.status(422).json({error: "Please enter your long url"});
    }

    let dt = new Date();
    if(expiry === "never"){
        dt = null;
    } else if(expiry == "1month"){
        dt.setMonth(dt.getMonth() + 1);
    } else if(expiry == "7days"){
        dt.setDate(dt.getDate() + 7);
    } else if(expiry == "24hours"){
        dt.setHours( dt.getHours() + 24 );
    } else if(expiry == "3min"){
        dt.setMinutes( dt.getMinutes() + 3 );
    }

    req.user.password = undefined;

    let urlShort = new Url({
        longUrl,
        shortUrl: generateShortUrl(),
        postedBy: req.user,
        expireAt: dt
    })
    urlShort.save()
    .then((data)=> {
        res.json({message: "short url created", createdRecord: data});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.post('/guestcreate', (req, res) => {
    const {longUrl} = req.body;
    if(!longUrl){
        return res.status(422).json({error: "Please enter your long url"});
    }
    let urlShort = new Guesturl({
        longUrl,
        shortUrl: generateShortUrl()
    })
    urlShort.save()
    .then((data)=> {
        res.json({message: "short url created", createdRecord: data});
    })
    .catch((err)=>{
        console.log(err);
    })
})

app.get('/:id', (req, res)=>{
    Url.findOne({shortUrl: req.params.id})
    .then((record) => {
        if(!record){
            return res.status(422).json({error: "record not found"}); 
        }
        Url.findByIdAndUpdate({_id: record._id}, {$inc:{clickCount: 1}})
        .then(updatedRecord => {
            if(!updatedRecord){
                return res.status(422).json({error: "record not updated"}); 
            }
            res.redirect(record.longUrl);
        })
    })
})

app.get('/g/:id', (req, res)=>{
    Guesturl.findOne({shortUrl: req.params.id})
    .then((record) => {
        if(!record){
            return res.status(422).json({error: "record not found"}); 
        }
        res.redirect(record.longUrl);
    })
})

app.get('/delete/:id', requireLogin, (req, res)=>{
    Url.findByIdAndDelete({_id: req.params.id})
    .then(deletedRecord => {
        return res.json({deletedRecord})
    })
})

app.post('/signup', (req, res)=> {
    const {fname, lname, email, password} = req.body;
    if(!fname || !lname || !email || !password){ 
        return res.status(422).json({error: "please add all the fields"})
    }
    User.findOne({email})
    .then(userExist => {
        if(userExist){
            return res.status(422).json({error: "user already exist with that email"})
        }
        bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newUser = new User({
                firstName: fname,
                lastName: lname,
                email,
                password: hashedPassword
            })
            newUser.save()
            .then(createdUser => {
                res.json({message: "account created"});
            })
            .catch(err => {
                console.log(err);
            })
        })
    })
    .catch(err => {
        console.log(err);
    })
})

app.post('/signin', (req, res)=> {
    const {email, password} = req.body;
    if(!email || !password){ 
        return res.status(422).json({error: "please enter all the fields"})
    }
    User.findOne({email})
    .then(userExist => {
        if(!userExist){
            return res.status(422).json({error: "No user account with this email"})
        }
        bcrypt.compare(password, userExist.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id: userExist._id}, JWT_SECRET);
                const {_id, firstName, lastName, email} = userExist;
                res.json({token, user: {_id, firstName, lastName, email}, message: "login success"});
            }else{
                return res.status(422).json({error: "Wrong password"})
            }
        })
    })
    .catch(err => {
        console.log(err);
    })
})

if(process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(PORT, ()=>{
    console.log('Server is running on', PORT);
})
