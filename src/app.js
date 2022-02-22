require('dotenv').config({path:"./../.env"});
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, "../templates/views");
const moment = require("moment");

app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });

require('./db/conn');
const Weatherdata= require('./models/weatherdataSchema');

app.use(express.json());
app.use(express.urlencoded({extend: false}));
app.set("view engine", "ejs");
app.use(express.static(static_path));
app.set("views", template_path);

app.get("/", async (req, res) => {
    try {
        const Weatherlatest = await Weatherdata.findOne().sort({ date: -1 }).limit(1) ;
        if (!Weatherlatest) {
          throw new Error("Services not found");
        }
        const Weatherlatest10 = await Weatherdata.find().sort({ date: -1 }).limit(10) ;
        let temparray=[],datearray=[]

        for(i=0;i<Weatherlatest10.length;i++){
            temparray.push(Weatherlatest10[i].temp)
            datearray.push(Weatherlatest10[i].date)
        }
        
        res.render("index",{Weatherlatest:Weatherlatest,temparray:temparray,datearray:datearray });
    }
    catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
   
  });

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
