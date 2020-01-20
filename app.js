var express = require('express');
var path = require('path');

var app = express();
const http = require('http');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let request = require('request');
const options = {json: true};

// function loaded on start
app.get('/', function(req, res) {
    const getAllBusesUrl = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus';
    request(getAllBusesUrl, options, (error, response, body) => {
        let allBuses;
        if (error || (body && body.length === 0)) {
            console.log('error: ', error);
            console.log('No buses are active, check http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetAllBus');
            res.render('search-bar', {allBuses: JSON.stringify([{error: 'No buses were found'}])});
        } else {
            for (let route of body) {
                const newArray = {
                    route: route.ROUTE,
                    lat: route.LATITUDE,
                    long: route.LONGITUDE,
                    timepoint: route.TIMEPOINT
                };
                if (allBuses) {
                    allBuses.push(newArray);
                } else {
                    allBuses = [newArray];
                }
                console.log(JSON.stringify(newArray));
            }
            res.render('search-bar', {allBuses: JSON.stringify(allBuses)});
        }
    });
});

// submit-bus-route endpoint
app.post('/submit-bus-route', function (req, res) {
    const getBusByRouteUrl = 'http://developer.itsmarta.com/BRDRestService/RestBusRealTimeService/GetBusByRoute/' + req.body.busRoute;
    request(getBusByRouteUrl, options, (error, response, body) => {
        if (error || ( body && body.length === 0)) {
            console.log('error:', error);
            res.render('no-bus-route', {routeNumber: req.body.busRoute});
        } else {
            let busRoutes;
            for (let route of body) {
                const newArray = {
                    lat: route.LATITUDE,
                    long: route.LONGITUDE,
                    routeInfo: route.TIMEPOINT};
                if (busRoutes) {
                    busRoutes.push(newArray);
                } else {
                    busRoutes = [newArray];
                }
            }
            res.render('google-maps', {buses: JSON.stringify(busRoutes), routeNumber: req.body.busRoute});
        }
    });
});

// create local server
http.createServer(app).listen(4000);
console.log('url: localhost:4000');

module.exports = app;

