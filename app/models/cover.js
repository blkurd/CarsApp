// import dependencies
const mongoose = require('mongoose')

// cover is a subdocument. NOT A MODEL.
// cover will be part of the covers array added to specific cars
// since we only need the schema, we can skip destructuring from mongoose

const coverSchema = new mongoose.Schema({
    weather: {
        type: String,
        required: true
    },

    description:{
        type: String
    },

    isGoodForSnow: {
        type: Boolean,
        required: true,
        default: true
    },
    condition: {
        type: String,
        // here we'll use enum, which means we can only use specific strings for this field.
        // enum is a validator on the type String that says "you can only use one of the values within this array"
        enum: ['new', 'used'],
        default: 'new'
    }
}, { timestamps: true })

module.exports = coverSchema