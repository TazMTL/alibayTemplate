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
app.use(express.static('image'))
// app.use(cors())

// this part of the code deals with signing up

app.post('/signUp', (req, res) => {
  var loginInformation = JSON.parse(req.body)

  var usr = loginInformation.username
  var pwd = loginInformation.password
  var userID = alibay.initializeUserIfNeeded(usr, pwd)

  var sessionId = '' + Math.floor(Math.random() * 1000000)
  res.set('Set-Cookie', 'sessionId=' + sessionId)
  cookieMap[sessionId] = usr
  console.log(JSON.stringify(req.body.toString()))
  res.send('You KNow da Wae!')
  console.log('success')
})

app.post('/login', (req, res) => {
  var loginInformation = JSON.parse(req.body)
  console.log('test 1', loginInformation)
  var usr = loginInformation.username
  var pwd = loginInformation.password
  var loggedIn = alibay.signIN(usr, pwd)
  res.send('' + loggedIn) // send 'success or failure to user'
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
  res.set('Set-Cookie', 'sessionId=' + genRand())
  res.send(JSON.stringify(req.headers.cookie))
})

app.get('/itemsForSale', (req, res) => {
  let uid = req.query.uid
  console.log(uid)
  // res.send(JSON.stringify(alibay.getItemsForSale(uid)))
  res.send(alibay.testItems)
})

app.get('/itemsSold', (req, res) => {
  let uid = req.query.uid
  console.log(uid)
  // res.send(JSON.stringify(alibay.getItemsSold(uid)))
  res.send(alibay.testItems)
})

app.get('/itemsBought', (req, res) => {
  let uid = req.query.uid
  console.log(uid)
  // res.send(JSON.stringify(alibay.getItemsBought(uid)))
  res.send(alibay.testItems)
})

app.post('/upics', (req, res) => {
  // console.log(req.body)
  var filename = req.query.name
  console.log()
  // var uniqueImageID = alibay.genUID()
  var imagePath = 'images/' + filename
  fs.writeFileSync(imagePath, req.body)
  // res.send('I received something!')
  console.log(imagePath)
  console.log(filename)
  res.send('upload successful' + imagePath)
})

var cookieMap = {} // maps a session id to a username

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
  var sellerID = 12345
  var price = productInformation.price
  var blurb = productInformation.blurb
  var image = productInformation.image // getPicture return image path
  var listingID = alibay.createListing(sellerID, name, price, blurb) // image)
  res.send(alibay.allItems[listingID])
}
)

app.listen(4000, () => console.log('Listening on port 4000!'))

// module.exports = {
//   productInformation,
//   loginInformation
// }
