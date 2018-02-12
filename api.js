const alibay = require('./alibay')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.raw({
  type: '*/*'
}))


app.get('/itemsBought', (req, res) => {
  let uid = req.query.uid
    res.send(JSON.stringify(alibay.getItemsBought(uid)))
})

var cookieMap = {}; // maps a session id to a username

app.post('/login', (req, res) => {
    var loginInformation = JSON.parse(req.body.toString());
    var usr = loginInformation.username;
    var pwd = loginInformation.password;
    var sessionId = "" + Math.floor(Math.random() * 1000000);

    if ((usr == "sue" && pwd == "romeo") ||
        (usr == "bob" && pwd == "juliet")) {
        res.set("Set-Cookie", "sessionId=" + sessionId);
        cookieMap[sessionId] = usr;
        res.send("success");
    } else {
        res.send("fail");
    }
})

var productMap = {}; // maps a session id to a username

app.post('/addItem', (req, res) => {
    var productInformation = JSON.parse(req.body.toString());
    var productName = productInformation.name;
    var productPrice = productInformation.price;
    var productId = "" + Math.floor(Math.random() * 1000000);
        res.send("success");
        res.send("fail");
    }
})
app.listen(3000, () => console.log('Listening on port 3000!'))
