const mongoose = require('mongoose');

const cabSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    seatingCapacity: {
        type: Number,
        required: true,
        min: 1,
        max: 6 // Maximum seating capacity of 6
    },
    passengers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ]
});

const Cab = mongoose.model('Cab', cabSchema);

module.exports = Cab;
