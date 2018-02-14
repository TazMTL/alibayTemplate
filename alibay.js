'use strict'

const assert = require('assert')

let testItem = {
  prodName: 'Red Boat',
  price: 5000,
  blurb: 'a very nice red boat!',
  image: 'http://clipart-library.com/img/1699050.jpg',
  isSold: false,
  sellerID: genUID,
  itemId: genUID
}

let testItems = {
  1: {
    prodName: 'Red Boat',
    price: 5000,
    blurb: 'a very nice red boat!',
    image: 'http://clipart-library.com/img/1699050.jpg',
    isSold: false,
    sellerID: genUID(),
    itemId: genUID()},
  2: {
    prodName: 'Blue Boat',
    price: 6000,
    blurb: 'a very nice blue boat!',
    image: 'http://clipart-library.com/img/1699050.jpg',
    isSold: false,
    sellerID: genUID(),
    itemId: genUID()
  }
}

// ask TA about Dynamic Key
let itemsBought = [] // map that keeps track of all the items a user has bought
let allItems = {}
let itemsSold = []
let allUser = {}

/*
Before implementing the login functionality, use this function to generate a new UID every time.
*/
function genUID () {
  return Math.floor(Math.random() * 100000000)
}

function putItemsBought (userID, value) {
  itemsBought[userID] = value
}

function getItemsBought (userID) {
  var ret = itemsBought[userID]
  if (ret === undefined) {
    return null
  }
  return ret
}

function signIN (usr, pwd) {
  if (usr === 'bob' && pwd === '12345') {
    return 'success'
  }
  return 'failure'
}

/*
initializeUserIfNeeded adds the UID to our database unless it's already there
parameter: [uid] the UID of the user.
returns: undefined
*/
function initializeUserIfNeeded (usr, pwd) {
  var user = {}
  user.username = usr
  user.password = pwd
  var userID = genUID()
  user.userID = userID
  allUser[userID] = user
  console.log(allUser[userID])
  var items = getItemsBought[user.userID]
  if (items === undefined) {
    putItemsBought(userID, [])
  }
  return allUser[userID].userID
}

/*
allItemsBought returns the IDs of all the items bought by a buyer
    parameter: [buyerID] The ID of the buyer
    returns: an array of listing IDs
*/
function allItemsBought (buyerID) {
  console.log('all items bought', itemsBought[buyerID])

  return itemsBought[buyerID]
}

/*
createListing adds a new listing to our global state.
This function is incomplete. You need to complete it.
    parameters:
      [sellerID] The ID of the seller
      [price] The price of the item
      [blurb] A blurb describing the item
    returns: The ID of the new listing
*/
function createListing (sellerID, name, price, blurb) {
  console.log(sellerID, name, price, blurb)
  var productObj = {}
  productObj.sellerID = sellerID
  productObj.name = name
  productObj.price = price
  productObj.blurb = blurb
  productObj.isSold = false
  var listingID = genUID()
  productObj.itemId = listingID
  allItems[listingID] = productObj
  // console.log('test 1', allItems)
  return listingID
}

/*
getItemDescription returns the description of a listing
    parameter: [listingID] The ID of the listing
    returns: An object containing the price and blurb properties.
*/
function getItemDescription (listingID) {
  let itemDesc = {}
  // console.log('all Items', allItems)
  // console.log('listingID', listingID)
  // console.log('allItems-ListingID', allItems[listingID])
  itemDesc.price = allItems[listingID].price
  itemDesc.blurb = allItems[listingID].blurb
  console.log('itemDesc', itemDesc)
  return itemDesc
}

/*
buy changes the global state.
Another buyer will not be able to purchase that listing
The listing will no longer appear in search results
The buyer will see the listing in his history of purchases
The seller will see the listing in his history of items sold
    parameters:
     [buyerID] The ID of buyer
     [sellerID] The ID of seller
     [listingID] The ID of listing
    returns: undefined
*/
function buy (buyerID, sellerID, listingID) {
  allItems[listingID].isSold = true

  itemsBought[buyerID] = itemsBought[buyerID].concat(listingID)
  if (itemsSold[sellerID] === undefined) { itemsSold[sellerID] = [] }
  itemsSold[sellerID] = itemsSold[sellerID].concat(listingID)
  // console.log('buy consolelog ItemsBought', itemsBought[buyerID])
  // console.log('buy consolelog ItemsSold', itemsSold[sellerID])
  return undefined
}

/*
allItemsSold returns the IDs of all the items sold by a seller
    parameter: [sellerID] The ID of the seller
    returns: an array of listing IDs
*/
function allItemsSold (sellerID) {
  // console.log('ItemSold', itemsSold)
  // console.log('SellerID', sellerID)
  // console.log('ItemsSOld(sellerID)', itemsSold[sellerID])
  // var arr = []
  // console.log(itemsSold[sellerID].listingID)
  // var allItemsSold = arr.concat(itemsSold[sellerID].listingID)

  // for (let i of itemsSold[sellerID]) {
  //   var allItemsSold = arr.concat(itemsSold[sellerID])
  // console.log('list of items sold', allItemsSold)

  return itemsSold[sellerID]
}

/*
allListings returns the IDs of all the listings currently on the market
Once an item is sold, it will not be returned by allListings
    returns: an array of listing IDs
*/
function allListings () {
  var allListings = []
  // console.log('allItems - All LIstings', allItems)
  for (let i in allItems) {
    if (!allItems[i].sold) {
      allListings = allListings.concat(allItems[i].itemId)
    }
    return allListings
  }
}

function shippingInfo (object) {

}
/*
searchForListings returns the IDs of all the listings currently on the market
Once an item is sold, it will not be returned by searchForListings
    parameter: [searchTerm] The search string matching listing descriptions
    returns: an array of listing IDs
*/
function searchForListings (searchTerm) {
  var searchResults = []
  let list = allListings()
  console.log('list', list)
  list.forEach(id => {
    var blurb = allItems[id].blurb
    if (blurb.includes(searchTerm)) {
      searchResults = searchResults.concat(id)
    }
  })
  console.log(searchResults)
  return searchResults
}

module.exports = {
  genUID, // This is just a shorthand. It's the same as genUID: genUID.
  initializeUserIfNeeded,
  putItemsBought,
  getItemsBought,
  createListing,
  getItemDescription,
  buy,
  allItemsSold,
  allListings,
  searchForListings,
  allItemsBought,
  allItems,
  testItem,
  testItems,
  signIN
    // Add all the other functions that need to be exported
}
