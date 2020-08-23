var API_KEY = 'd5d03f46134bce677df28495ee94d1cf';

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`).then(function (response) {
        return response.json();
    }).then(function (res) {
        var weather = {
            temp: res.main.temp + ' °C',
            humidity: res.main.humidity + '%',
            weather: res.weather[0].description,
            icon: "http://openweathermap.org/img/wn/" + res.weather[0].icon + "@2x.png",
            country: res.sys.country,
            city: res.name
        }
        $('.weather-img')[0].src = weather.icon;
        $('.weather-temp')[0].innerText = weather.temp;
        $('.weather-humidity')[0].innerText = weather.humidity;
        $('.weather-country')[0].innerText = weather.country;
        $('.weather-city')[0].innerText = weather.city;
    });
}

function handleSuccess(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    getWeather(lat, lon);
};
function handleFail() {

};
navigator.geolocation.getCurrentPosition(handleSuccess, handleFail);