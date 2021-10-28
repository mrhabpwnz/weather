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
    daysEN = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    daysRU = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота','Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    changeLangButtonEN = document.querySelector('#en'),
    changeLangButtonRU = document.querySelector('#ru'),
    changeDegreesC = document.querySelector('#C'),
    changeDegreesF = document.querySelector('#F'),
    map,
    marker,
    geocoder,
    responseDiv,
    response;


function initMap() {
    navigator.geolocation.getCurrentPosition(position => {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: { lat: lat, lng: lng },
            disableDefaultUI: true,
            mapTypeId: "roadmap",
        });
        geocoder = new google.maps.Geocoder();

        const inputText = document.querySelector('#searchInput');
        const submitButton = document.querySelector('#searchButton');
        response = document.createElement("pre");
        response.id = "response";
        response.innerText = "";
        responseDiv = document.createElement("div");
        responseDiv.id = "response-container";
        responseDiv.appendChild(response);


        // map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
        marker = new google.maps.Marker({
            map,
        });
        map.addListener("click", (e) => {
            geocode({ location: e.latLng });
        });
        submitButton.addEventListener("click", () =>
            geocode({ address: inputText.value })
        );
        inputText.addEventListener("keypress", (e) => {
                if(e.key === 'Enter') {geocode({ address: inputText.value })}
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
                    setTimeout(() => {

                    })
                    return results;
                })
                .catch((e) => {
                    alert("Geocode was not successful for the following reason: " + e);
                });
        }
    })}

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;

        function timer() {
            time.textContent = new Date().toLocaleTimeString();
        }
        setInterval(timer, 1000);

        const api = `http://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&q=${lat},${lon}&lang=ru&days=4`;
        fetch(api)
            .then(response => {return response.json();})
            .then(data => {
                console.log(data);
                humidity.textContent = `Влажность: ${data.current.humidity} %`;
                windSpeed.textContent = `Скорость ветра: ${data.current.wind_kph.toFixed()} км/ч`;
                degrees.textContent = `${(data.current.temp_c).toFixed()}° C`;
                cityName.textContent = `${data.location.name}, ${data.location.country}`;
                weatherDegreesApparent.textContent = `Ощущается как: ${(data.current.feelslike_c.toFixed())}° C`;
                date.textContent = `${new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toLocaleDateString('ru-RU', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}`
                latUnderMap.textContent = `Широта: ${lat.toFixed(2)}`;
                lonUnderMap.textContent = `Долгота: ${lon.toFixed(2)}`;


                for (let i = 0; i < data.forecast.forecastday.length; i++) {
                    forecastDaySmall[i].textContent = `${daysRU[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()+1]} :`;
                    forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
                }

                if(`${data.current.condition.text}` === 'Cloudy' || 'Partly cloudy' || 'Overcast' || 'Переменная облачность' || 'Облачно') {
                    bigIcon.classList.add('owf', 'owf-801', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Sunny' || 'Clear' || 'Солнечно' || 'Ясно') {
                    bigIcon.classList.add('owf', 'owf-800', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Scattered clouds' || 'Пасмурно') {
                    bigIcon.classList.add('owf', 'owf-802', 'owf-2x');
                } else if (`${data.current.condition.text}` === 'Broken clouds') {
                    bigIcon.classList.add('owf', 'owf-803', 'owf-2x');
                } else if (`${data.current.condition.text}` === 'Overcast clouds') {
                    bigIcon.classList.add('owf', 'owf-804', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Moderate rain' || 'Местами дождь') {
                    bigIcon.classList.add('owf', 'owf-501', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Patchy rain possible' || 'Слабая морось'){
                    bigIcon.classList.add('owf', 'owf-903', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Light snow'){
                    bigIcon.classList.add('owf', 'owf-600', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Mist' || 'Fog' || 'Freezing fog'){
                    bigIcon.classList.add('owf', 'owf-741', 'owf-2x');
                } else if(`${data.current.condition.text}` === 'Heavy rain' || 'Heavy rain at times') {
                    bigIcon.classList.add('owf', 'owf-503', 'owf-2x');
                }

                for(let i = 0; i < data.forecast.forecastday.length; i++) {
                    if(data.forecast.forecastday[i].day.condition.text === 'Sunny' || 'Clear' || 'Солнечно' || 'Ясно') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-800', 'owf-3x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Cloudy' || 'Partly cloudy' || 'Overcast' || 'Переменная облачность' || 'Облачно') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-801', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Broken clouds') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-803', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Scattered clouds' || 'Пасмурно') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-802', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Overcast clouds') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-804', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Moderate rain' || 'Местами дождь') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-501', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Patchy rain possible' || 'Слабая морось') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-903', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Light snow') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-600', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Mist' || 'Fog' || 'Freezing fog' || 'Дымка' || 'Туман') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-741', 'owf-2x');
                    } else if(data.forecast.forecastday[i].day.condition.text === 'Heavy rain || Heavy rain at times') {
                        weatherSmallIcon[i].classList.add('owf', 'owf-503', 'owf-2x');
                    } else {
                        weatherSmallIcon[i].classList.add('owf', 'owf-801', 'owf-2x');
                    }
                }
            })
    })


function startTalking() {
    let SpeechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    SpeechRecognition.lang = "ru-RU";
    SpeechRecognition.interimResults = true;
    SpeechRecognition.onresult = function(event){
        searchInput.value = event.results[0][0].transcript;
    };
    SpeechRecognition.start();

}

async function changeBackground() {
    const URL = 'https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=autumn&client_id=_fVmWccF3rsIJXBUbJWixSCYhGkUjeLTOzBiIkKkosY';
    const response = await fetch(URL);
    const data = await response.json();

    if (!document.body.style.backgroundImage) return document.body.style.backgroundImage = `url(${data.urls.full})`;

    const oldBackground = document.body.style.backgroundImage.split(',')[0];

    document.body.style.backgroundImage = `url(${data.urls.full}), ${oldBackground}`;
}
changeBackground();





backgroundChangeBtn.addEventListener('click', changeBackground );

microphone.addEventListener('click', startTalking);

rotatingElem.addEventListener('click', () => {
        rotatingElem.classList.add('rotating');
    setTimeout(function () {
        rotatingElem.classList.remove('rotating');
    }, 700);
});

    for(let button of allButtons) {
        button.addEventListener('click',() => {
            button.classList.add('buttons_clicked');
            button.classList.remove('hover');
            setTimeout(() => {
                button.classList.remove('buttons_clicked')
            }, 999);
            setTimeout(() => {
                button.classList.add('hover')
            }, 1000);
})
    }}

changeLangButtonEN.addEventListener('click',  () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
            let resp = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&lang=en&q=${lat},${lon}&days=4`);
            let data = await resp.json();
            if (weatherDegreesApparent.textContent.includes('Ощущается как')) {
                date.textContent = `${new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toDateString()}`
                humidity.textContent = `Humidity: ${data.current.humidity} %`;
                windSpeed.textContent = `Wind speed: ${data.current.wind_kph.toFixed()} km/h`;
                weatherDegreesApparent.textContent = `Feels like: ${(data.current.feelslike_c.toFixed())}° C`;
                latUnderMap.textContent = `Latitude: ${lat.toFixed(2)}`;
                lonUnderMap.textContent = `Longitude: ${lon.toFixed(2)}`;
                for (let i = 0; i < data.forecast.forecastday.length; i++) {
                    forecastDaySmall[i].textContent = `${daysEN[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()+1]} :`;
                }
                searchInput.placeholder = 'Search city';



                let newScript = document.createElement('script');
                newScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB7nc1BYZqShV9AFTyXIfdkhoe-CY0iiQw&language=en&callback=initMap&v=weekly';
                document.body.appendChild(newScript);

            }

    })
})

changeLangButtonRU.addEventListener('click',() => {
    navigator.geolocation.getCurrentPosition(async position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        let resp = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&lang=ru&q=${lat},${lon}&days=4`);
        let data = await resp.json();
        if (weatherDegreesApparent.textContent.includes('Feels like')) {
            date.textContent = `${new Date(data.location.localtime.substr(0, 10).replace(new RegExp('-', 'g'), ', ')).toLocaleDateString('ru-RU', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}`
            humidity.textContent = `Влажность: ${data.current.humidity} %`;
            windSpeed.textContent = `Скорость ветра: ${data.current.wind_kph.toFixed()} км/ч`;
            weatherDegreesApparent.textContent = `Ощущается как: ${(data.current.feelslike_c.toFixed())}° C`;
            latUnderMap.textContent = `Широта: ${lat.toFixed(2)}`;
            lonUnderMap.textContent = `Долгота: ${lon.toFixed(2)}`;
            searchInput.placeholder = 'Найти город';
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDaySmall[i].textContent = `${daysRU[new Date(data.forecast.forecastday[i].date.replace(new RegExp('-', 'g'), ', ')).getDay()+1]} :`;
            }

            let newScript = document.createElement('script');
            newScript.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB7nc1BYZqShV9AFTyXIfdkhoe-CY0iiQw&language=ru&callback=initMap&v=weekly';
            document.body.appendChild(newScript);

            let scriptList = document.getElementsByTagName('script');
            for(let i = 0; i < scriptList.length; i++) {
                if(scriptList[i].outerHTML.includes('https://maps.googleapis.com/maps/api/js?key=AIzaSyB7nc1BYZqShV9AFTyXIfdkhoe-CY0iiQw&amp;language=ru&amp;callback=initMap&amp;v=weekly' || 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB7nc1BYZqShV9AFTyXIfdkhoe-CY0iiQw&amp;language=en&amp;callback=initMap&amp;v=weekly')) {
                    document.body.removeChild(newScript)
                }
            }



        }

    })
} )
let scriptList = document.getElementsByTagName('script');
console.log(scriptList)
changeDegreesC.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        let resp = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&lang=ru&q=${lat},${lon}&days=4`);
        let data = await resp.json();
        if (degrees.textContent.includes('F') && weatherDegreesApparent.textContent.includes('Ощущается как')) {
            degrees.textContent = `${Math.round(data.current.temp_c)}° C`;
            weatherDegreesApparent.textContent = `Ощущается как: ${Math.round(data.current.feelslike_c)}° C`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
            }
        } else if(degrees.textContent.includes('F') && weatherDegreesApparent.textContent.includes('Feels like')) {
            degrees.textContent.includes('F') && weatherDegreesApparent.textContent.includes('Ощущается как')
                degrees.textContent = `${Math.round(data.current.temp_c)}° C`;
                weatherDegreesApparent.textContent = `Feels like: ${Math.round(data.current.feelslike_c)}° C`;
                for (let i = 0; i < data.forecast.forecastday.length; i++) {
                    forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_c)}° C`;
                }
        }
    })
})

changeDegreesF.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(async position => {
        lon = position.coords.longitude;
        lat = position.coords.latitude;
        let resp = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=db4b88ed321d4ab3a8b162900212510&lang=ru&q=${lat},${lon}&days=4`);
        let data = await resp.json();
        if (degrees.textContent.includes('C') && weatherDegreesApparent.textContent.includes('Ощущается как')) {
            degrees.textContent = `${Math.round(data.current.temp_f.toFixed())}° F`;
            weatherDegreesApparent.textContent = `Ощущается как: ${Math.round(data.current.feelslike_f)}° F`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_f)}° F`;
            }
        } else if(degrees.textContent.includes('C') && weatherDegreesApparent.textContent.includes('Feels like')) {
            degrees.textContent = `${Math.round(data.current.temp_f.toFixed())}° F`;
            weatherDegreesApparent.textContent = `Feels like: ${Math.round(data.current.feelslike_f)}° F`;
            for (let i = 0; i < data.forecast.forecastday.length; i++) {
                forecastDegreesSmall[i].textContent = `${Math.round(data.forecast.forecastday[i].day.avgtemp_f)}° F`;
            }
        }
    })
})


