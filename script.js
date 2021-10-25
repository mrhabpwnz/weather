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
    latitude = document.querySelector('.latitude'),
    longitude = document.querySelector('.longitude'),
    backgroundChangeBtn = document.querySelector('#refreshButton'),
    microphone = document.querySelector('#microphoneButton'),
    searchInput = document.querySelector('#searchInput'),
    rotatingElem = document.querySelector('#rotating'),
    smallIcon = document.querySelectorAll('.weather__icon-small'),
    bigIcon = document.querySelector('#degreeSymbol'),
    allButtons = document.querySelectorAll('.button'),
    map,
    marker,
    geocoder,
    responseDiv,
    response;


function startTalking() {
    let SpeechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    SpeechRecognition.lang = "ru-RU";
    SpeechRecognition.interimResults = true;
    SpeechRecognition.onresult = function(event){
        searchInput.value = event.results[0][0].transcript;
    };
    SpeechRecognition.start();

}


function initMap() {
    navigator.geolocation.getCurrentPosition(position => {
        const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
    })

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: -34.397, lng: 150.644 },
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
                return results;
            })
            .catch((e) => {
                alert("Geocode was not successful for the following reason: " + e);
            });
    }

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



window.addEventListener('load', () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            function timer() {
                let newDate = new Date();
                time.textContent = newDate.toLocaleTimeString();
            }
            setInterval(timer, 1000);
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=en&appid=7997b5a3d9701835ffb85f2de130e554`;
            fetch(api)
                .then(response => {return response.json();})
                .then(data => {
                    console.log(data);
                    humidity.textContent = `Влажность: ${data.main.humidity} %`;
                    windSpeed.textContent = `Скорость ветра: ${data.wind.speed.toFixed()} м/с`;
                    degrees.textContent = `${(data.main.temp - 273.15).toFixed()} °`;
                    cityName.textContent = `${data.name}, ${data.sys.country}`;
                    weatherDegreesApparent.textContent = `Ощущается как: ${(data.main.feels_like - 273.15).toFixed()} °`;
                    date.textContent = new Date().toDateString();
                    longitude.textContent = `Долгота: ${lon.toFixed(2)}`;
                    latitude.textContent = `Широта: ${lat.toFixed(2)}`;

                    if(`${data.weather[0].description}` === 'sky is clear') {
                        bigIcon.classList.add('owf', 'owf-800', 'owf-2x');
                    } else if(`${data.weather[0].description}` === 'few clouds') {
                        bigIcon.classList.add('owf', 'owf-801', 'owf-2x');
                    } else if(`${data.weather[0].description}` === 'scattered clouds') {
                        bigIcon.classList.add('owf', 'owf-802', 'owf-2x');
                    } else if (`${data.weather[0].description}` === 'broken clouds') {
                        bigIcon.classList.add('owf', 'owf-803', 'owf-2x');
                    } else if (`${data.weather[0].description}` === 'overcast clouds') {
                        bigIcon.classList.add('owf', 'owf-804', 'owf-2x');}



                    let today = new Date()
                    let dateTomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
                    let dateAfterTomorrow = new Date(today.getTime() + (24 * 60 * 60 * 2000));
                    let dateAfterAfterTomorrow = new Date(today.getTime() + (24 * 60 * 60 * 3000));

                    async function makeForecast() {
                    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=en&cnt=30&appid=7997b5a3d9701835ffb85f2de130e554`;
                    let resp = await fetch(url);
                    let data = await resp.json();
                    console.log(data);
                    for(let item of data.list) {
                        console.log(item.dt_txt)

                         }
                    }
                    makeForecast();



                })

        })
    }
});


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
            setTimeout(() => {
                button.classList.remove('buttons_clicked')
            }, 500)
})
    }



