// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Car = require('../models/car')

// custom middleware
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// ROUTES

// POST -> create a cover(and give that cover to a car)
// POST /covers/:carId
// anybody should be able to give a car a cover
// so we wont requireToken
// our cover schema, has some non-required fields, so let's use removeBlanks
router.post('/covers/:carId', removeBlanks, (req, res, next) => {
    // isolate our cover from the request, and save to variable
    const cover = req.body.cover
    // isolate and save our car's id for easy reference
    const carId = req.params.carId
    // find the car and push the new cover into the car's array
    Car.findById(carId)
        // first step is to use our custom 404 middleware
        .then(handle404)
        // handle adding cover to car
        .then(car => {
            console.log('the car: ', car)
            console.log('the cover: ', cover)
            // add cover to covers array
            car.covers.push(cover)

            // save the car
            return car.save()
        })
        // send info after updating the car
        .then(car => res.status(201).json({ car: car }))
        // pass errors along to our error handler
        .catch(next)
})

// PATCH -> update a cover
// PATCH /covers/:carId/:coverId
router.patch('/covers/:carId/:coverId', requireToken, removeBlanks, (req, res, next) => {
    // get and save the id's to variables
    const carId = req.params.carId
    const coverId = req.params.coverId

    // find our car
    Car.findById(carId)
        .then(handle404)
        .then(car => {
            // single out the cover
            const theCover = car.covers.id(cocoverId)
            // make sure the user is the car's owner
            requireOwnership(req, car)
            // update accordingly
            theCover.set(req.body.cover)

            return car.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})

// DELETE -> destroy a cover
// DELETE /covers/:carId/:coverId
router.delete('/covers/:carId/:coverId', requireToken, (req, res, next) => {
    const carId = req.params.carId
    const coverId = req.params.coverId

    // find the car
    Car.findById(carId)
        .then(handle404)
        // grab the specific cover using it's id
        .then(car => {
            // isolate the cover
            const theCover = car.covers.id(coverId)
            // make sure the user is the owner of the car
            requireOwnership(req, car)
            // call remove on our cover subdoc
            theCover.remove()
            // return the saved car
            return car.save()
        })
        // send a response
        .then(() => res.sendStatus(204))
        // pass errors to our error handler (using next)
        .catch(next)
})

// export our router
module.exports = router