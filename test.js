const alibay = require('./alibay')
const assert = require('assert')

function test () {
  let sellerID = alibay.genUID()
  let buyerID = alibay.genUID()

  alibay.initializeUserIfNeeded(sellerID)
  alibay.initializeUserIfNeeded(buyerID)

  let listing1ID = alibay.createListing(sellerID, 500000, 'A very nice boat')
  console.log('test 10 success')
  let listing2ID = alibay.createListing(sellerID, 1000, 'Faux fur gloves')
  console.log('test 12 success')
  let listing3ID = alibay.createListing(sellerID, 100, 'Running shoes')
  console.log('test 15 success')
  let product2Description = alibay.getItemDescription(listing2ID)
  console.log('test 16 success')

  alibay.buy(buyerID, sellerID, listing2ID)
  console.log('test 19 success')
  alibay.buy(buyerID, sellerID, listing3ID)
  console.log('test 21 success')

  let allSold = alibay.allItemsSold(sellerID)
  console.log('test 24 success')
  let soldDescriptions = allSold.map(alibay.getItemDescription)
  console.log('test 26 success')
  let allBought = alibay.allItemsBought(buyerID)
  console.log('test 28 success')

  let allBoughtDescriptions = allBought.map(alibay.getItemDescription)
  console.log('test 31 success', allBoughtDescriptions)
  let listings = alibay.allListings()
  console.log('test 33 success', listings)
  let boatListings = alibay.searchForListings('boat')
  console.log('test 35 success', boatListings)
  let shoeListings = alibay.searchForListings('shoes')
  console.log('test 37 success', shoeListings)
  let boatDescription = alibay.getItemDescription(listings[0])
  console.log('test 39 success', boatDescription)
  let boatBlurb = boatDescription.blurb
  console.log('test 41 success', boatBlurb)
  let boatPrice = boatDescription.price
  console.log('test 43 success', boatPrice)
  assert(allSold.length == 2) // The seller has sold 2 items
  assert(allBought.length == 2) // The buyer has bought 2 items
  assert(listings.length == 1) // Only the boat is still on sale
  assert(boatListings.length == 1) // The boat hasn't been sold yet
  assert(shoeListings.length == 0) // The shoes have been sold
  assert(boatBlurb == 'A very nice boat')
  assert(boatPrice == 500000)
}
test()
