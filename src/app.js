require('dotenv').config({path:"./../.env"});
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname, '../public');

require('./db/conn');
const Weatherdata= require('./models/weatherdataSchema');

app.use(express.json());
app.use(express.urlencoded({extend: false}));
app.use(express.static(static_path));

app.post('/se', async (req, res) => {
    const {  temp, humidity, soilmoist, motorstatus } = req.body;
    let date= new Date();
    if(temp && humidity && soilmoist )
    {
        try {
            const weatherdata = new Weatherdata({
            date, temp, humidity, soilmoist, motorstatus
            });
            await weatherdata.save();
            console.log("data inseted");
            res.status(200).send("data sent successfully")
        }

        catch (err) {
            console.error(err);
        }
    }
    else{console.log("Values can't be empty")}
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
