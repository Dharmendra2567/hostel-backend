const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        unique: true,
        required: true
    },
    roomType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    // amenities: [String], // Array of strings for amenities
    availability: {
        type: String,
        enum: ['available', 'booked'],
        default: 'booked'
    },
    room_image:{
        type:String,
        required:true
    }
},{timestamps:true});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
