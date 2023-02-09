// seed.js will be run by the script `npm run seed`

// this will seed our databse with a buncha cars

// we can modify this later after building out our API a little bit.

const mongoose = require('mongoose')
const Car = require('./car')
const db = require('../../config/db')

const startCars = [
    { name: 'Nissan', model: 'Altima', year: 2022 , for_sale: true},
    { name: 'Toyota', model: 'Corolla', year: 2020 ,for_sale: true},
    { name: 'Honda', model: 'Civic', year: 2021 ,for_sale: true},
    { name: 'Mercedes-Benz', model: 'GLB-Class', year: 2023 ,for_sale: true}
]

// first we connect to the db
// then remove all cars
// then add the start cars
// and always close the connection, whether its a success or failure

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        Car.deleteMany()
            .then(deletedCars => {
                console.log('the deleted cars:', deletedCars)
                // now we add our cars to the db
                Car.create(startCars)
                    .then(newCars => {
                        console.log('the new cars', newCars)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })