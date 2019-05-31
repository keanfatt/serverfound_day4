const request = require('request');
const keys = require('./keys.json');
const querystring = require('querystring');

const params = {
    q: "London",
    appid: keys.appid,
}

console.info(params);
console.log('params: ', querystring.encode(params))

request.get('http://api.openweathermap.org/data/2.5/weather', 
    { qs: params },
    (err, fixerResp, body) => {
        const result = JSON.parse(body);
        console.log(body);
    }
);