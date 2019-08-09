const TelegramBot = require('node-telegram-bot-api');
const NodeGeocoder = require('node-geocoder');
const axios = require('axios');
// replace the value below with the Telegram token you receive from @BotFather
const token = '843470852:AAEJLtjTr05KqzUfTY4H4dadlxKuJlP1pWI';
 
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
bot.on("polling_error", (err) => console.log(err));
var options = {
  provider: 'mapquest',
  apiKey:"YaEC42xM4X9hdPi9ABwfDHuqLksF6j9c",
  httpAdapter: 'https',
  formatter: null
};
var geocoder = NodeGeocoder(options);
bot.onText(/\/weather (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    geocoder.geocode(match[1])
        .then(function(res) {
            bot.sendMessage(chatId, "Wait up. Getting your data.");
            // console.log(res);
            const lat = res[0].latitude;
            const lon = res[0].longitude;
            const location = "https://api.darksky.net/forecast/032cb3132b9c440de5990c8388cf62ef/"+lat+","+lon;
            axios.get(location)
                .then( (data) => {
                    // console.log(data.data);
                    const temperature = Math.round((data.data.currently.temperature-32)*(5/9));
                    const summary = data.data.currently.summary;
                    const resp = "The current temperature is "+temperature+" °C. The forecast is "+summary;
                    // const resp = "Check the console";
                    bot.sendMessage(chatId, resp);
                });
            
        })
        .catch(function(err) {
            console.log(err);
            resp="Error + " +err;
            bot.sendMessage(chatId, resp);
        });
  
  // send back the matched "whatever" to the chat
});
