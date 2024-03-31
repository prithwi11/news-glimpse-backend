const express = require('express')()
const {OPEN_WEATHER_BASE_URL, CURRENT_TIME_API_SUFFIX, FORECAST_API_SUFFIX, PORT} = require('./constants')
require('dotenv').config()
const bodyParser = require('body-parser')
const axios = require('axios')
const socketio = require('socket.io')


const app = express()
const server = require('http').createServer(app)
const io = socketio(server)

app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(bodyParser.json())

io.on('connection', socket => {
    socket.on('get-current-weather', data => {
        const lat = data.lat;
        const long = data.long;
        const openWeatherResponse = {};

        const api_url = OPEN_WEATHER_BASE_URL + CURRENT_TIME_API_SUFFIX;
        const params = 'lat=' + lat + '&lon=' + long + '&appid=' + process.env.OPEN_WEATHER_KEY;
        const request_url = api_url + '?' + params;

        axios.get(request_url)
            .then(response => {
                socket.emit('current-weather-response', {
                    success: true,
                    status: 200,
                    message: 'data fetched successfully',
                    response: response.data
                });
            })
            .catch(error => {
                console.error(error);
                socket.emit('current-weather-response', {
                    success: false,
                    status: 500,
                    message: 'Some Problem occurred',
                    response: null
                });
            });
    });
});

io.on('connection', socket => {
    socket.on('forecast-weather', data => {
        const lat = data.lat;
        const long = data.long;
        const openWeatherResponse = {};

        const api_url = OPEN_WEATHER_BASE_URL + CURRENT_TIME_API_SUFFIX;
        const params = 'lat='+lat+'&lon='+long+'&appid='+process.env.OPEN_WEATHER_KEY
        const request_url = api_url + '?' + params;

        axios.get(request_url)
            .then(response => {
                socket.emit('forecast-weather-response', {
                    success: true,
                    status: 200,
                    message: 'data fetched successfully',
                    response: response.data
                });
            })
            .catch(error => {
                console.error(error);
                socket.emit('forecast-weather-response', {
                    success: false,
                    status: 500,
                    message: 'Some Problem occurred',
                    response: null
                });
            });
    });
});

app.post('/get-current-weather', (req, res) => {
    const reqBody = req.body
    const lat = reqBody.lat
    const long = reqBody.long
    const openWeatherResponse = {}

    const api_url = OPEN_WEATHER_BASE_URL + CURRENT_TIME_API_SUFFIX
    const params = 'lat='+lat+'&lon='+long+'&appid='+process.env.OPEN_WEATHER_KEY
    const request_url = api_url + '?' + params
    
    axios.get(request_url)
        .then(response => {
            res.json({'success' : true, 'status' : 200, 'message' : 'data fetched successfully', response : response.data})
            })
        .catch(error => {
            console.log(error)
            res.json({'success' : false, 'status' : 500, 'message' : 'Some Problem occurred', response : null})
        })
    
})

app.post('/forecast-weather', (req, res) => {
    const reqBody = req.body
    const city = reqBody.city
    const country = reqBody.country
    const openWeatherResponse = {}

    const api_url = OPEN_WEATHER_BASE_URL + FORECAST_API_SUFFIX
    const params = 'q='+city+','+country+'&appid='+process.env.OPEN_WEATHER_KEY
    const request_url = api_url + '?' + params
    
    axios.get(request_url)
        .then(response => {
            res.json({'success' : true, 'status' : 200, 'message' : 'data fetched successfully', response : response.data})
            })
        .catch(error => {
            console.log(error)
            res.json({'success' : false, 'status' : 500, 'message' : 'Some Problem occurred', response : null})
        })
    
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})