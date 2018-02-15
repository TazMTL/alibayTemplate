'use strict'

// EXPRESS SERVER
// this is where we set all of our apis that will be
// used in the functioning of the express server

const alibay = require('./alibay')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
// const cors = require('cors')
// const mysql = require('mysql')

app.use(bodyParser.raw({ type: '*/*', limit: '50mb' }))
app.use(express.static('images'))
// app.use(cors())

// this part of the code deals with signing up

var cookieMap = getCookie() // maps a session id to a username

function getCookie () {
  var allCookies = fs.readFileSync('allCookie.txt').toString()
  if (allCookies === '' || !allCookies) {
    return {}
  }
  return JSON.parse(allCookies)
}

app.post('/signUp', (req, res) => {
  var loginInformation = JSON.parse(req.body)
  console.log('loginInfo', loginInformation)
  var usr = loginInformation.username
  var pwd = loginInformation.password
  var users = JSON.parse(fs.readFileSync('allUser.txt'))
  for (let i in users) {
    if (usr == users[i].username) {
      console.log('users[i] name:', users[i].username)
      console.log('user name that is logging in:', usr)
      res.send('Username TAKEN')
    } else {
      var userID = alibay.initializeUserIfNeeded(usr, pwd) // math random for a unique session ID
      var sessionId = userID
      res.set('Set-Cookie', 'sessionId=' + sessionId)
      cookieMap[sessionId] = userID
      fs.writeFileSync('allCookie.txt', JSON.stringify(cookieMap))
      res.send('success')
    }
  }
})

app.post('/login', (req, res) => {
  var loginInformation = JSON.parse(req.body)
  console.log('test 1', loginInformation)
  var usr = loginInformation.username
  var pwd = loginInformation.password
  // var loggedIn = alibay.signIN(usr, pwd)
  var users = JSON.parse(fs.readFileSync('allUser.txt'))
  console.log(users)
  for (let i in users) {
    if (usr == users[i].username) {
      if (users[i].password == pwd) {
        if (req.headers.cookie) {
          let cookies = parseCookies(req.headers.cookie)
          if (cookies.sessionId) {
            res.send('Thank you ' + users[i].username + '! you are logged in!!! Your session id is ' + cookies.sessionId)
            return
          }
        }
        var sessionId = users[i].userID
        res.set('Set-Cookie', 'sessionId=' + sessionId)
        cookieMap[sessionId] = users[i].userID
        fs.writeFileSync('allCookie.txt', JSON.stringify(cookieMap))
        res.send('success')
      }
    }
  }
  console.log('user not found')
  return res.send('Wrong password/username!')
})

function parseCookies (str) {
  let asArray = str.split('; ').map(x => x.split('='))
  let ret = {}
  asArray.forEach(lst => ret[lst[0]] = lst[1])
  return ret
}

app.get('/', (req, res) => {
  if (req.headers.cookie) {
    let cookies = parseCookies(req.headers.cookie)
    if (cookies.sessionId) {
      res.send('Your session id is ' + cookies.sessionId)
      return
    }
  }
  res.set('Set-Cookie', 'sessionId=' + alibay.genUID())
  res.send(JSON.stringify(req.headers.cookie))
})

app.get('/itemsForSale', (req, res) => {
  let uid = ''
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  console.log(uid)
  res.send(JSON.stringify(alibay.getItemsForSale(uid)))
  // res.send(alibay.testItems)
})

app.get('/itemsSold', (req, res) => {
  let uid = ''
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  console.log(uid)
  res.send(JSON.stringify(alibay.allItemsSold(uid)))
  // res.send(alibay.testItems)
})

app.get('/itemsBought', (req, res) => {
  let uid = ''
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  console.log(uid)
  res.send(JSON.stringify(alibay.getItemsBought(uid)))
  // res.send(alibay.testItems)
})

app.post('/upics', (req, res) => {
  // console.log(req.body)
  var filename = req.query.name
  // var uniqueImageID = alibay.genUID()
  var imagePath = 'images/' + filename
  fs.writeFileSync(imagePath, req.body)
  // res.send('I received something!')
  console.log(imagePath)
  console.log(filename)
  res.send('upload successful' + imagePath)
})

app.post('/shipping', (req, res) => {
  console.log(req.body)
  var shippingInfo = JSON.parse(req.body)
//   console.log(shippingInfo)
//   res.send('Your Address: ' + shippingInfo. + 'Confirmation Number ' + alibay.genUID())
  res.send({
    shippingInfo
  })
    // add it to user profile
})

app.post('/search', (req, res) => {
  console.log(req.body.toString())
  var searchResponse = req.body.toString()
  console.log(searchResponse)
  var srchRsp = alibay.searchForListings(searchResponse)
  console.log(JSON.stringify(srchRsp))
  res.send(JSON.stringify(srchRsp))
  // res.send('' + searchResponse)
})

app.post('/getAllItems', (req, res) => {
  res.send(alibay.allItems)
})

app.post('/newListing', (req, res) => {
  var productInformation = JSON.parse(req.body) // Noe has to send product information
  console.log(productInformation)
  var name = productInformation.name
  let uid = ''
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  console.log(uid)
  var sellerID = uid
  var price = productInformation.price
  var blurb = productInformation.blurb
  var image = productInformation.image // getPicture return image path
  var listingID = alibay.createListing(sellerID, name, price, blurb, image)
  res.send(alibay.allItems[listingID])
}
)

app.listen(4000, () => console.log('Listening on port 4000!'))

// module.exports = {
//   productInformation,
//   loginInformation
// }
