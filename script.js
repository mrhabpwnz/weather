'use strict';

window.addEventListener('load', () => {
    let lon;
    let lat;
    let cityName = document.querySelector('.weather__location-town');
    let countryName = document.querySelector('.weather__location-country');
    let date = document.querySelector('.weather__date');
    let time = document.querySelector('.weather__time');
    let weatherDegreesApparent = document.querySelector('.weather__degrees-apparent');
    let weatherDegreesValue = document.querySelector('.weather__degrees-value');
    let weatherDegreesSymbol = document.querySelector('.weather__degrees-symbol');
    let windSpeed = document.querySelector('#windSpeed');
    let humidity = document.querySelector('#humidity');
    let degrees = document.querySelector('#degreesValue');
    let latitude = document.querySelector('.latitude');
    let longitude = document.querySelector('.longitude');

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            function timer() {
                let newDate = new Date();
                time.textContent = newDate.toLocaleTimeString();
            }
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7997b5a3d9701835ffb85f2de130e554`;
            fetch(api)
                .then(response => {return response.json();})
                .then(data => {
                    console.log(data);
                    humidity.textContent = `Влажность: ${data.main.humidity} %`;
                    windSpeed.textContent = `Скорость ветра: ${data.wind.speed.toFixed()} м/с`;
                    degrees.textContent = data.main.temp;
                    cityName.textContent = `${data.name}, ${data.sys.country}`;
                    weatherDegreesApparent.textContent = `Ощущается как: ${data.main.feels_like}`;
                    date.textContent = new Date().toDateString();
                    let watches = setInterval(timer, 1000);
                    longitude.textContent = `Долгота: ${lon.toFixed(2)}`;
                    latitude.textContent = `Широта: ${lat.toFixed(2)}`;
                })

        })
    }
    ymaps.ready(init);
    function init(){
        var myMap = new ymaps.Map("map", {
            center: [55.76, 37.64],
            zoom: 7
        });
    }
})


