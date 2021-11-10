'use strict';

let lon,
    lat,
    cityName = document.querySelector('.weather__location-town'),
    date = document.querySelector('.weather__date'),
    time = document.querySelector('.weather__time'),
    weatherDegreesApparent = document.querySelector('.weather__degrees-apparent'),
    windSpeed = document.querySelector('#windSpeed'),
    humidity = document.querySelector('#humidity'),
    degrees = document.querySelector('#degreesValue'),
    backgroundChangeBtn = document.querySelector('#refreshButton'),
    microphone = document.querySelector('#microphoneButton'),
    searchInput = document.querySelector('#searchInput'),
    rotatingElem = document.querySelector('#rotating'),
    bigIcon = document.querySelector('#degreeSymbol'),
    allButtons = document.querySelectorAll('.button'),
    latUnderMap = document.querySelector('.latitude'),
    lonUnderMap = document.querySelector('.longitude'),
    weatherSmallIcon = document.querySelectorAll('.weather__icon-small'),
    forecastDaySmall = document.querySelectorAll('.degrees__day'),
    forecastDegreesSmall = document.querySelectorAll('.degrees-small'),
    daysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysRU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    degreesC = document.querySelector('#C'),
    degreesF = document.querySelector('#F'),
    inputText = document.querySelector('#searchInput'),
    submitButton = document.querySelector('#searchButton'),
    langChanger = document.querySelector('.lang-menu'),
    map,
    marker,
    geocoder,
    responseDiv,
    response;

async function changeBackground() {
    const URL = 'https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=autumn&client_id=_fVmWccF3rsIJXBUbJWixSCYhGkUjeLTOzBiIkKkosY';
    const response = await fetch(URL);
    const data = await response.json();

    if (!document.body.style.backgroundImage) return document.body.style.backgroundImage = `url(${data.urls.full})`;

    const oldBackground = document.body.style.backgroundImage.split(',')[0];

    document.body.style.backgroundImage = `url(${data.urls.full}), ${oldBackground}`;
}
changeBackground();

function startTalking() {
    let SpeechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    SpeechRecognition.lang = "ru-RU";
    SpeechRecognition.interimResults = true;
    SpeechRecognition.onresult = function (event) {
        searchInput.value = event.results[0][0].transcript;
    };
    SpeechRecognition.start();

}

const appendGoogleMapsScript = (lang) => {
    document.querySelectorAll('script[src^="https://maps.googleapis.com"]').forEach(script => {
        script.remove();
    });
    if (window.google) delete google.maps;

    let newAPI = document.createElement('script');
    newAPI.src = 'https://maps.googleapis.com/maps/api/js?' + '&key=AIzaSyB7nc1BYZqShV9AFTyXIfdkhoe-CY0iiQw' + '&language=' + lang + '&callback=initMap&v=weekly';

    document.querySelector('body').appendChild(newAPI);
}

// const classnamesToWeathermap = {
//     'owf-801': ['Cloudy', 'Partly cloudy', 'Overcast', 'Переменная облачность', 'Облачно'],
//     'owf-800': ['Sunny', 'Clear', 'Солнечно', 'Ясно'],
//     'owf-802': ['Scattered clouds', 'Пасмурно'],
//     'owf-803': ['Broken clouds'],
//     'owf-804': ['Overcast clouds'],
//     'owf-501': ['Moderate rain', 'Местами дождь'],
//     'owf-903': ['Patchy rain possible', 'Слабая морось'],
//     'owf-741': ['Mist', 'Fog', 'Freezing fog', 'Дымка', 'Туман'],
//     'owf-600': ['Light snow', 'Мелкий снег'],
//     'owf-503': ['Heavy rain', 'Heavy rain at times', 'Сильный дождь']
// }

async function fetchWeather(lat, lng) {
    const api = `https://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&q=${lat},${lng}&days=3`;
    const response = await fetch(api);
    const data = await response.json();
console.log(data);
    humidity.textContent = (langChanger.value === 'RU' ? 'Влажность: ' : 'Humidity: ') + data.current.humidity + '%';
    windSpeed.textContent = (langChanger.value === 'RU' ? 'Скорость ветра: ' : 'Wind speed: ') + data.current.wind_kph.toFixed() + (langChanger.value === 'RU' ? ' км/ч' : ' km/h');
    degrees.textContent = data.current.temp_c.toFixed() + '° C';
    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    weatherDegreesApparent.textContent = (langChanger.value === 'RU' ? 'Ощущается как: ' : 'Feels like: ') + data.current.feelslike_c.toFixed() + '° C';
    date.textContent = (langChanger.value === 'RU' ? new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toLocaleDateString('ru-RU', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toLocaleDateString('en-EN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
    latUnderMap.textContent = langChanger.value === 'RU' ? 'Широта: ' + lat.toFixed(2) : 'Latitide: ' + lat.toFixed(2);
    lonUnderMap.textContent = (langChanger.value === 'RU' ? 'Долгота: ' : 'Longitude: ') + lng.toFixed(2);
    bigIcon.src = data.current.condition.icon;
    for (let i = 0; i < data.forecast.forecastday.length; i++) {
        forecastDaySmall[i].textContent = (langChanger.value === 'RU' ? daysRU[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()] : daysEN[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()]);
        forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
    }





    // for (let [classname, weatherArray] of Object.entries(classnamesToWeathermap)) {
    //     if (weatherArray.includes(data.current.condition.text)) bigIcon.classList.add('owf', classname, 'owf-2x')
    //     for (let i = 0; i < data.forecast.forecastday.length; i++) {
    //         if (weatherArray.includes(data.forecast.forecastday[i].day.condition.text))
    //             weatherSmallIcon[i].classList.add('owf', classname, 'owf-2x')
    //     }
    // }
}

function timer() {
    time.textContent = new Date().toLocaleTimeString();
}


function initMap() {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let myLatlng = { lat: lat, lng: lng };

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: { lat: lat, lng: lng },
            disableDefaultUI: true,
            mapTypeId: "roadmap",
        });
        geocoder = new google.maps.Geocoder();
        response = document.createElement("pre");
        response.id = "response";
        response.innerText = "";
        responseDiv = document.createElement("div");
        responseDiv.id = "response-container";
        responseDiv.appendChild(response);

        marker = new google.maps.Marker({
            map,
        });
        map.addListener("click", (e) => {
            geocode({ location: e.latLng });
        });
        submitButton.addEventListener("click", () =>
            geocode({ address: inputText.value }),
        );
        inputText.addEventListener("keypress", (e) => {
                if (e.key === 'Enter') {
                    geocode({ address: inputText.value });
                    changeBackground();
                }
            }
        );
        function clear() {
            marker.setMap(null);
            responseDiv.style.display = "none";
        }

        function geocode(request) {
            clear();
            geocoder
                .geocode(request)
                .then((result) => {
                    const { results } = result;

                    map.setCenter(results[0].geometry.location);
                    marker.setPosition(results[0].geometry.location);
                    marker.setMap(map);
                    responseDiv.style.display = "block";
                    response.innerText = JSON.stringify(result, null, 2);
                    return results;
                })
                .catch((e) => {
                    alert("Geocode was not successful for the following reason: " + e);
                });
        }

        let infoWindow = new google.maps.InfoWindow({
            position: myLatlng,
        });
        // Configure the click listener.
        map.addListener("click", (mapsMouseEvent) => {
            lat = mapsMouseEvent.latLng.lat();
            lng = mapsMouseEvent.latLng.lng();
            if (windSpeed.textContent.includes('Скорость ветра')) {
                const api = `https://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&q=${lat},${lng}&lang=ru&days=3`;
                fetch(api)
                    .then(response => { return response.json(); })
                    .then(data => {
                        humidity.textContent = `Влажность: ${data.current.humidity} %`;
                        windSpeed.textContent = `Скорость ветра: ${data.current.wind_kph.toFixed()} км/ч`;
                        degrees.textContent = `${(data.current.temp_c).toFixed()}° C`;
                        cityName.textContent = `${data.location.name}, ${data.location.country}`;
                        weatherDegreesApparent.textContent = `Ощущается как: ${(data.current.feelslike_c.toFixed())}° C`;
                        date.textContent = `${new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toLocaleDateString('ru-RU', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`
                        latUnderMap.textContent = `Широта: ${lat.toFixed(2)}`;
                        lonUnderMap.textContent = `Долгота: ${lng.toFixed(2)}`;


                        for (let i = 0; i < data.forecast.forecastday.length; i++) {
                            forecastDaySmall[i].textContent = `${daysRU[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()]} :`;
                            forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
                        }

                        for (let [classname, weatherArray] of Object.entries(classnamesToWeathermap)) {
                            if (weatherArray.includes(data.current.condition.text)) bigIcon.classList.add('owf', classname, 'owf-2x')
                            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                                if (weatherArray.includes(data.forecast.forecastday[i].day.condition.text))
                                    weatherSmallIcon[i].classList.add('owf', classname, 'owf-2x')
                            }
                        }
                        changeBackground();
                    })
            } else if (windSpeed.textContent.includes('Wind speed')) {
                const api = `https://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&q=${lat},${lng}&lang=en&days=3`;
                fetch(api)
                    .then(response => { return response.json(); })
                    .then(data => {

                        humidity.textContent = `Humidity: ${data.current.humidity} %`;
                        windSpeed.textContent = `Wind speed: ${data.current.wind_kph.toFixed()} км/ч`;
                        degrees.textContent = `${(data.current.temp_c).toFixed()}° C`;
                        cityName.textContent = `${data.location.name}, ${data.location.country}`;
                        weatherDegreesApparent.textContent = `Feels like: ${(data.current.feelslike_c.toFixed())}° C`;
                        date.textContent = `${new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toLocaleDateString('en-EN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`
                        latUnderMap.textContent = `Latitude: ${lat.toFixed(2)}`;
                        lonUnderMap.textContent = `Longitude: ${lng.toFixed(2)}`;


                        for (let i = 0; i < data.forecast.forecastday.length; i++) {
                            forecastDaySmall[i].textContent = `${daysEN[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()]} :`;
                            forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
                        }

                        for (let [classname, weatherArray] of Object.entries(classnamesToWeathermap)) {
                            if (weatherArray.includes(data.current.condition.text)) bigIcon.classList.add('owf', classname, 'owf-2x')
                            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                                if (weatherArray.includes(data.forecast.forecastday[i].day.condition.text))
                                    weatherSmallIcon[i].classList.add('owf', classname, 'owf-2x')
                            }
                        }
                        changeBackground();
                    })
            }
        })

        fetchWeather(lat, lng);
    })
}

langChanger.addEventListener('change', () => {
    appendGoogleMapsScript(langChanger.value);
});

langChanger.dispatchEvent(new Event('change'));


for (let button of allButtons) {
    button.addEventListener('click', () => {
        button.classList.add('buttons_clicked');
        button.classList.remove('hover');
        setTimeout(() => {
            button.classList.remove('buttons_clicked')
        }, 999);
        setTimeout(() => {
            button.classList.add('hover')
        }, 1000);
    })
}

backgroundChangeBtn.addEventListener('click', changeBackground);

microphone.addEventListener('click', startTalking);

rotatingElem.addEventListener('click', () => {
    rotatingElem.classList.add('rotating');
    setTimeout(function () {
        rotatingElem.classList.remove('rotating');
    }, 700);
});

degreesC.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        let resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&lang=ru&q=${lat},${lon}&days=4`);
        let data = await resp.json();
        if (degrees.textContent.includes('F') && weatherDegreesApparent.textContent.includes('Ощущается как')) {
            degrees.textContent = `${Math.round(data.current.temp_c)}° C`;
            weatherDegreesApparent.textContent = `Ощущается как: ${Math.round(data.current.feelslike_c)}° C`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
            }
        } else if (degrees.textContent.includes('F') && weatherDegreesApparent.textContent.includes('Feels like')) {
            degrees.textContent.includes('F') && weatherDegreesApparent.textContent.includes('Ощущается как')
            degrees.textContent = `${Math.round(data.current.temp_c)}° C`;
            weatherDegreesApparent.textContent = `Feels like: ${Math.round(data.current.feelslike_c)}° C`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
            }
        }
    })
})

degreesF.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        let resp = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&lang=ru&q=${lat},${lon}&days=4`);
        let data = await resp.json();
        if (degrees.textContent.includes('C') && weatherDegreesApparent.textContent.includes('Ощущается как')) {
            degrees.textContent = `${Math.round(data.current.temp_f.toFixed())}° F`;
            weatherDegreesApparent.textContent = `Ощущается как: ${Math.round(data.current.feelslike_f)}° F`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_f)}° F`;
            }
        } else if (degrees.textContent.includes('C') && weatherDegreesApparent.textContent.includes('Feels like')) {
            degrees.textContent = `${Math.round(data.current.temp_f.toFixed())}° F`;
            weatherDegreesApparent.textContent = `Feels like: ${Math.round(data.current.feelslike_f)}° F`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_f)}° F`;
            }
        }
    })
})

setInterval(timer, 1000);

