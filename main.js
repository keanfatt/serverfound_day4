//Load the required libs
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const keys = require('./keys.json');
const request = require('request');
const querystring = require('querystring');

//Tunables
const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000);

//Create an instance of express
const app = express();


//configure handlebars
app.engine('hbs', handlebars({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended:true}));

app.get('/city', (req, resp) => {
    const cityName = req.query['q'];
    //console.log('>> q = ', req.query['q']);
    const unitType = req.query['units'];
    const params = {
        q: cityName,
        units: unitType,
        appid: keys.appid,
    }

    // console.info(params);
    // console.log('params: ', querystring.encode(params))
    
    request.get('http://api.openweathermap.org/data/2.5/weather', 
    { qs: params },
    (err, weatherResp, body) => {
        const result = JSON.parse(body);
        // console.info(result.weather);
        // console.info(result.main);
        // console.info(unitType);
        // console.info(result.coord);
        let isMetric;
        if(unitType == "metric")
            isMetric = true;
        else
            isMetric = false;

        resp.status(200);
        resp.type('text/html')
         resp.render('weather', {
             city: result.name,
             weather: result.weather,
             temperature: result.main,
             metric: isMetric,
             location:result.coord,
             mapkey:keys.mapid
         })
    }
);
})

//load static resources from content
app.get(/.*/, express.static(__dirname +'/content'));
app.get(/.*/, express.static(__dirname + '/weather'));

//Error
app.use((req, resp) =>{
    resp.status(404);
    resp.type('text/html');
    resp.sendFile(__dirname + '/content/404.html');
    
    })


//start the server
app.listen(PORT, () => {
    console.info(`Application started at ${new Date()} on port ${PORT}`);
});
