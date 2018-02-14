'use strict'

const alibay = require('./alibay')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// const cors = require('cors')
// const mysql = require('mysql')
// var fs = require('fs');

app.use(bodyParser.raw({type: '*/*'}))
// app.use(cors())

app.get('/', (req, res) => {
  res.send('Success')
})

app.get('/itemsBought', (req, res) => {
  let uid = req.query.uid
  res.send(JSON.stringify(alibay.getItemsBought(uid)))
})

var cookieMap = {} // maps a session id to a username

app.post('/productDetail', (req, res) => {
  res.send(alibay.testItem)
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
  console.log(JSON.parse(req.body))
  res.send(req.body)
})

app.post('/getAllItems', (req, res) => {
  res.send(alibay.testItems)
  // res.send('success')
})

app.post('/signUp', (req, res) => {
  var loginInformation = JSON.parse(req.body)
  console.log('test 1', loginInformation)
  var usr = loginInformation.username
  var pwd = loginInformation.password
  var userID = alibay.initializeUserIfNeeded(usr, pwd)
  console.log('test 2', userID)
    //   var sessionId = '' + Math.floor(Math.random() * 1000000)
    //   res.set('Set-Cookie', 'sessionId=' + sessionId)
    //   cookieMap[sessionId] = usr
    //   console.log(JSON.stringify(req.body.toString()))
  res.send('You KNow da Wae!')
  console.log('success')
})

app.post('/login', (req, res) => {
  var loginInformation = JSON.parse(req.body)
  console.log('test 1', loginInformation)
  var usr = loginInformation.username
  var pwd = loginInformation.password
  var loggedIn = alibay.signIN(usr, pwd)
  res.send('' + loggedIn)
  console.log('success')
})

app.post('/newListing', (req, res) => {
  var productInformation = JSON.parse(req.body)
  console.log(productInformation)
  var name = productInformation.name
  var sellerID = productInformation.sellerID
  var price = productInformation.price
  var blurb = productInformation.blurb

  // console.log('test1', productInformation)
  // console.log('test2', alibay.createListing(productInformation))
  var listingID = alibay.createListing(sellerID, name, price, blurb)
  console.log(listingID)
  res.send(alibay.allItems[listingID])
}
)
// JSON.stringify(listingID)

app.listen(4000, () => console.log('Listening on port 4000!'))

// module.exports = {
//   productInformation,
//   loginInformation
// }
