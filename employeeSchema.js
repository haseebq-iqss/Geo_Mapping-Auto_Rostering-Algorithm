const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere' // Index for geospatial queries
    }
});

const Employee = mongoose.model('employee', employeeSchema);

module.exports = Employee;
