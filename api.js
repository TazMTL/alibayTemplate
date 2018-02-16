'use strict'

/// /////////////////////////////////////////
// EXPRESS SERVER
// this is where we set all of our apis that will be
// used in the functioning of the express server
/// //////////////////////////////////////////////

const alibay = require('./alibay')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const fs = require('fs')

app.use(bodyParser.raw({ type: '*/*', limit: '50mb' }))
app.use(express.static('images'))

/// ////////////////////////////////////////////////////////////////
// SIGN-UP AND LOGIN - this part of the code deals with signing up
/// ////////////////////////////////////////////////////////////////

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
  var email = loginInformation.email
  var phoneNumber = loginInformation.phoneNumber
  var users = JSON.parse(fs.readFileSync('allUser.txt'))
  for (let i in users) {
    if (usr == users[i].username) {
      console.log('username is taken')
      res.send('username taken, please try again, or sign-in')
      return
    } else {
      var userID = alibay.initializeUserIfNeeded(usr, pwd, email, phoneNumber)
      console.log('user has been registered')
      if (req.headers.cookie) {
        console.log('we have a cookie, now check the cookie against username')
        let cookies = parseCookies(req.headers.cookie)
        if (cookies.sessionId) {
          console.log('there is a session ID', cookies.sessionId)
          if (cookies.sessionId == users[i].userID) {
            console.log('user has the right cookie')
            res.send('success')
            return
          } else {
            var sessionId = users[i].userID
            res.set('Set-Cookie', 'sessionId=' + sessionId)
            cookieMap[sessionId] = users[i].userID
            fs.writeFileSync('allCookie.txt', JSON.stringify(cookieMap))
            res.send('success')
            return
          }
        }
      } else {
        console.log('set a new cookie')
        sessionId = users[i].userID
        res.set('Set-Cookie', 'sessionId=' + sessionId)
        cookieMap[sessionId] = users[i].userID
        fs.writeFileSync('allCookie.txt', JSON.stringify(cookieMap))
        res.send('success')
      }
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
  // console.log(users)
  for (let i in users) {
    // console.log(usr)
    // console.log(users[i].username)
    if (usr == users[i].username) {
      console.log('username matched!')
      if (users[i].password == pwd) {
        console.log('password matched!')
        if (req.headers.cookie) {
          console.log('we have a cookie, now check the cookie against username')
          let cookies = parseCookies(req.headers.cookie)
          if (cookies.sessionId) {
            console.log('there is a session ID', cookies.sessionId)
            if (cookies.sessionId == users[i].userID) {
              console.log('user has the right cookie')
              res.send('success')
              return
            } else {
              var sessionId = users[i].userID
              res.set('Set-Cookie', 'sessionId=' + sessionId)
              cookieMap[sessionId] = users[i].userID
              fs.writeFileSync('allCookie.txt', JSON.stringify(cookieMap))
              res.send('success')
              return
            }
          }
        } else {
          console.log('set a new cookie')
          sessionId = users[i].userID
          res.set('Set-Cookie', 'sessionId=' + sessionId)
          cookieMap[sessionId] = users[i].userID
          fs.writeFileSync('allCookie.txt', JSON.stringify(cookieMap))
          res.send('success')
        }
      }
    }
  }
  console.log('user not found')
  res.send('user not found')
})

function parseCookies (str) {
  let asArray = str.split('; ').map(x => x.split('='))
  let ret = {}
  asArray.forEach(lst => ret[lst[0]] = lst[1])
  return ret
}

app.get('/firstCookie', (req, res) => {
  if (req.headers.cookie) {
    console.log('we have a cookie, now check the cookie against username')
    let cookies = parseCookies(req.headers.cookie)
    if (cookies.sessionId) {
      console.log('there is a session ID', cookies.sessionId)
      var users = JSON.parse(fs.readFileSync('allUser.txt'))
      for (let i in users) {
        if (cookies.sessionId == users[i].userID) {
          console.log('user has a cookie we recognize!')
          res.send('success welcome back!')
        }
      }
    }
  }
})

/// ////////////////////////////////////////////////////////////////
// CREATING A NEW LISTING - uploading images, listings
/// ////////////////////////////////////////////////////////////////

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

app.post('/newListing', (req, res) => {
  var productInformation = JSON.parse(req.body)
  console.log('this is the req.body productinfo' + productInformation)
  var name = productInformation.name
  var price = productInformation.price
  var blurb = productInformation.blurb
  var image = productInformation.image
  var uid = {}
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  var sellerID = uid.sessionId
  var listingID = alibay.createListing(sellerID, name, price, blurb, image)
  var itemsForsale = alibay.ItemsForSalebySeller(sellerID)
  res.send('success and here are all of the items this seller has put up for sale' + JSON.stringify(itemsForsale))
}
)

/// ////////////////////////////////////////////////////////////////
// THESE ARE GET REQUESTS FOR DASHBOARD/SEARCH/LANDING
/// ////////////////////////////////////////////////////////////////

app.post('/search', (req, res) => {
  console.log(req.body.toString())
  var searchResponse = req.body.toString()
  console.log(searchResponse)
  var srchRsp = alibay.searchForListings(searchResponse)
  console.log(JSON.stringify(srchRsp))
  res.send(JSON.stringify(srchRsp))
})

app.post('/getAllItems', (req, res) => {
  res.send(alibay.allItems)
})

app.get('/itemsForSale', (req, res) => {
  var uid = {}
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  uid = uid.sessionId
  var itemsForsale = alibay.ItemsForSalebySeller(uid)
  res.send(JSON.stringify(itemsForsale))
})

app.get('/itemsSold', (req, res) => {
  var uid = {}
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  uid = uid.sessionId
  console.log('itemsSOLD uid', uid)
  var allItemsSold = alibay.allItemsSold(uid)
  console.log('this is allItemsSOLD', allItemsSold)
  res.send(JSON.stringify(allItemsSold))
})

app.get('/itemsBought', (req, res) => {
  var uid = {}
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  uid = uid.sessionId
  var allItemsBought = alibay.getItemsBought(uid)
  console.log('this is all ItemsBought', allItemsBought)
  res.send(JSON.stringify(allItemsBought))
})

/// ////////////////////////////////////////////////////////////////
// PURCHASING AND SHIPPING - this part of the code deals with buying items
/// ////////////////////////////////////////////////////////////////

app.post('/shipping', (req, res) => {
  var shippingInfo = JSON.parse(req.body)
  console.log(shippingInfo)
  var sellerId = shippingInfo.sellerId
  var uid = {}
  if (req.headers.cookie) {
    uid = parseCookies(req.headers.cookie)
  }
  var buyerId = uid.sessionId
  var itemId = shippingInfo.itemId
  var confirmation = alibay.genUID()
  var email = shippingInfo.email
  var date = shippingInfo.orderDate
  alibay.buy(sellerId, buyerId, itemId, confirmation, email, date)
  alibay.shippingInfo(shippingInfo, buyerId)
  console.log('item has been bought')
  res.send('item has been bought' + confirmation)
})

app.listen(4000, () => console.log('Listening on port 4000!'))
