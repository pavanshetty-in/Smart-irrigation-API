require('dotenv').config;
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT;
const static_path = path.join(__dirname, '../public');

require('./db/conn');

app.use(express.json());
app.use(express.urlencoded({extend: false}));
app.use(express.static(static_path));

app.post('/setdata', async (req, res) => {
    const { date, time, temp, humidity, soilmoist, motorstatus } = req.body;
    try {
        const weatherdata = new Weatherdata({
            date, time, temp, humidity, soilmoist, motorstatus
        });
        await weatherdata.save();
    }
    catch (err) {
        console.error(err);
    }
})

app.listen(PORT, () => {
    console.log('listening on port ${PORT}');
});
