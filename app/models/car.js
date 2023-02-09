const mongoose = require('mongoose')


const carSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		
		model: {
			type: String,
			required: true
		},
		year: {
			type: Number,
			required: true
		},
		for_sale: {
			type: Boolean,
			required: true
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
			
		},
	},
	{
		timestamps: true,
		// since we're adding virtuals to our car model
		// we need to tell express to include them when we want them
		toObject: { virtuals: true },
		toJSON: { virtuals: true }
	}
)

// virtuals go here
// remember these are virtual properties, that use existing data, to add a property whenever we retrieve these documents.
carSchema.virtual('fullTitle').get(function(){

return `${this.name} model: ${this.model}`


})
module.exports = mongoose.model('Car', carSchema)