// import { userInfo } from 'os'

// import { readFileSync } from 'fs'

'use strict'

const assert = require('assert')
const fs = require('fs')

// ask TA about Dynamic Key
// let itemsBought = [] // map that keeps track of all the items a user has bought
let allItems = getItems()
// let itemsSold = []
let allUser = getUsers()

function getItems () {
  var allItemsData = fs.readFileSync('allItems.txt').toString()
  if (allItemsData === '' || !allItemsData) {
    return {}
  }
  return JSON.parse(allItemsData)
}

function getUsers () {
  var allUserData = fs.readFileSync('allUser.txt').toString()
  if (allUserData === '' || !allUserData) {
    return {}
  }
  return JSON.parse(allUserData)
}
/*
Before implementing the login functionality, use this function to generate a new UID every time.
*/
function genUID () {
  return Math.floor(Math.random() * 100000000)
}

// function putItemsBought (userID, value) {
//   itemsBought[userID] = value
// }

function getItemsBought (userID) {
  var ret = []
  for (let i in allItems) {
    if (allItems[i].isSold === true) {
      if (allItems[i].buyerID === userID) {
        ret.push(allItems[i])
      }
    }
  }
  // if (ret === undefined) {
  //   return null
  // }
  console.log(ret)
  return ret
}

/*
initializeUserIfNeeded adds the UID to our database unless it's already there
parameter: [uid] the UID of the user.
returns: undefined
*/
function initializeUserIfNeeded (usr, pwd, email, phoneNumber) {
  var user = {}
  user.username = usr
  user.password = pwd
  var userID = genUID()
  user.sellerID = userID
  user.userID = userID
  user.email = email
  user.number = phoneNumber
  allUser[userID] = user
  // var items = getItemsBought[user.userID]
  // if (items === undefined) {
  //   putItemsBought(userID, [])
  // }
  fs.writeFileSync('allUser.txt', JSON.stringify(allUser))
  console.log(allUser[userID].userID)
  console.log(allUser)
  return allUser[userID].userID
}

function getUserInfo (x) {
  var ret = allUser[x]
  return ret
}

// /*
// allItemsBought returns the IDs of all the items bought by a buyer
//     parameter: [buyerID] The ID of the buyer
//     returns: an array of listing IDs
// */
// function allItemsBought (buyerID) {
//   let itemsBought = {}
//   console.log('all items bought', itemsBought[buyerID])

//   return itemsBought[buyerID]
// }

function getSellerNames () {
  var ret = {}
  for (let i in allItems) {
    if (allItems[i].isSold === false) {
      var sellerID = allItems[i].sellerID
      ret[sellerID] = allItems[i].sellerName
    }
  }
  console.log('this is return from get Seller Names', ret)
  return ret
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
function createListing (sellerID, name, price, blurb, image) {
  console.log(sellerID, name, price, blurb, image)
  var productObj = {}
  productObj.sellerID = sellerID
  productObj.sellerName = allUser[sellerID].username
  productObj.prodName = name
  productObj.price = price
  productObj.blurb = blurb
  productObj.isSold = false
  productObj.image = image
  console.log(productObj)
  var listingID = genUID()
  productObj.itemId = listingID
  allItems[listingID] = productObj
  console.log('test 1', allItems)
  fs.writeFileSync('allItems.txt', JSON.stringify(allItems))
  return allItems[listingID].itemId
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
function buy (sellerID, buyerID, listingID, confirmation, email, date) {
  allItems[listingID].isSold = true
  allItems[listingID].buyerID = buyerID
  allItems[listingID].confirmation = confirmation
  allItems[listingID].buyerEmail = email
  allItems[listingID].orderDate = date
  allItems[listingID].sellerEmail = allUser[sellerID].email
  allItems[listingID].sellerNumber = allUser[sellerID].number
  fs.writeFileSync('allItems.txt', JSON.stringify(allItems))
  console.log('the new item object', allItems[listingID])

  // if (itemsBought[buyerID] === undefined) { itemsBought[buyerID] = [] }
  // itemsBought[buyerID] = itemsBought[buyerID].concat(allItems[listingID])
  // console.log('items that were bought by this buyer' + itemsBought[buyerID])
  // if (itemsSold[sellerID] === undefined) { itemsSold[sellerID] = [] }
  // itemsSold[sellerID] = itemsSold[sellerID].concat(allItems[listingID])
  // console.log('items that were sold by this seller' + itemsSold[sellerID])
  // console.log('buy ItemsBought', itemsBought[buyerID])
  // console.log('buy ItemsSold', itemsSold[sellerID])
  return undefined
}

/*
allItemsSold returns the IDs of all the items sold by a seller
    parameter: [sellerID] The ID of the seller
    returns: an array of listing IDs
*/
function allItemsSold (sellerID) {
  var itemsSold = []
  for (let i in allItems) {
    if (allItems[i].isSold === true) {
      if (allItems[i].sellerID === sellerID) {
        itemsSold.push(allItems[i])
      }
    }
  // if (itemsSold === undefined) {
  //   return null
  }
  console.log('these are the items sold', itemsSold)
  return itemsSold
}

function ItemsForSalebySeller (sellerID) {
  var itemsForSale = []
  for (let i in allItems) {
    if (allItems[i].isSold === false) {
      if (allItems[i].sellerID === sellerID) {
        itemsForSale.push(allItems[i])
      }
    }
  }
  console.log('items for sale', itemsForSale)
  return itemsForSale
}

/*
allListings returns the IDs of all the listings currently on the market
Once an item is sold, it will not be returned by allListings
    returns: an array of listing IDs
*/
function allListings () {
  var allListings = []
  for (let i in allItems) {
    if (!allItems[i].sold) {
      allListings = allListings.concat(allItems[i].itemId)
    }
    return allListings
  }
}

function shippingInfo (obj, buyerID) {
  var userShippingInfo = {}
  userShippingInfo.address = obj.address
  userShippingInfo.fullName = obj.firstName + '' + obj.lastName
  userShippingInfo.address = obj.address
  userShippingInfo.city = obj.city
  userShippingInfo.province = obj.province
  userShippingInfo.zip = obj.zip
  userShippingInfo.country = obj.country
  var listingID = obj.itemId
  allItems[listingID].shippingAddress = userShippingInfo
  allUser[buyerID].shippingAddress = userShippingInfo
  fs.writeFileSync('allItems.txt', JSON.stringify(allItems))
  return undefined
}

function searchForListings (searchTerm) {
  var searchResults = []
  searchTerm = searchTerm.toLowerCase()
  let list = allItems
  for (let i in list) {
    var searchBlurb = list[i].blurb.toLowerCase()
    var searchName = list[i].prodName.toLowerCase()
    if (searchBlurb.includes(searchTerm) || searchName.includes(searchTerm)) {
      searchResults = searchResults.concat(list[i])
    }
  }
  return searchResults
}

module.exports = {
  genUID,
  initializeUserIfNeeded,
  // putItemsBought,
  getItemsBought,
  createListing,
  getItemDescription,
  buy,
  allItemsSold,
  allListings,
  searchForListings,
  // allItemsBought,
  allItems,
  ItemsForSalebySeller,
  getUserInfo,
  shippingInfo,
  getSellerNames

    // Add all the other functions that need to be exported
}
