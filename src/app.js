require('dotenv').config({path:"./../.env"});
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, "../templates/views");
const date = require('date-and-time')
const moment = require("moment");
app.use((req, res, next)=>{
    res.locals.moment = moment;
    next();
  });

require('./db/conn');
const Weatherdata= require('./models/weatherdataSchema');

const { Telegraf } = require('telegraf');
const bot = new Telegraf('5296633223:AAFS40bDHchCnkmT9A1jju_G58rRQIrCd-w');

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
        let temparray=[],datearray=[],humiditydata=[],soildata=[]

        for(i=0;i<Weatherlatest10.length;i++){
            temparray.push(Weatherlatest10[i].temp)
            humiditydata.push(Weatherlatest10[i].humidity)
            soildata.push(Weatherlatest10[i].soilmoist)
            datearray.push(String(date.format(Weatherlatest10[i].date,'DD.MM-HH-mm')))
            
        }
        console.log(temparray)
        console.log(datearray)
        res.render("index",{Weatherlatest:Weatherlatest,temparray:temparray.reverse(),datearray:datearray.reverse(),Weatherlatest10:Weatherlatest10,humiditydata:humiditydata.reverse(),soildata:soildata.reverse()});
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

// Telegram Bot Server
bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Hello there! Welcome to Smart Irrigation Project bot.', {
    })
})
bot.hears('status', ctx => {
    console.log(ctx.from)
    let animalMessage = `great, here you can get status`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, animalMessage, {
        reply_markup: {
            inline_keyboard: [
                [{
                        text: "latest status",
                        callback_data: 'status'
                    },
                    {
                        text: "About",
                        callback_data: 'about'
                    }
                ],

            ]
        }
    })
})
bot.action('status', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Hii stautu is 46%', {
    })
    

})
bot.action('about', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Hi By pavan shetty', {
    })

})



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});
