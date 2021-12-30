const mongoose = require('mongoose');

const weatherdataSchema = new mongoose.Schema({
    date:{
        type: Date,
        required: true,
    },
    temp:{
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
    soilmoist: {
        type: Number,
        required: true,
    },
    motorstatus: {
        type: Boolean,
        required: true,
    }
});

const Weatherdata = mongoose.model('weatherdata',weatherdataSchema);

module.exports= Weatherdata;