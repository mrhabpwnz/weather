'use strict';

let lon,
    lat,
    cityName = document.querySelector('.weather__location-town'),
    date = document.querySelector('.weather__date'),
    time = document.querySelector('.weather__time'),
    weatherDegreesApparent = document.querySelector('.weather__degrees-apparent'),
    FDegrees = document.querySelector('#F'),
    CDegrees = document.querySelector('#C'),
    windSpeed = document.querySelector('#windSpeed'),
    humidity = document.querySelector('#humidity'),
    degrees = document.querySelector('#degreesValue'),
    latitude = document.querySelector('.latitude'),
    longitude = document.querySelector('.longitude'),
    backgroundChangeBtn = document.querySelector('#refreshButton'),
    microphone = document.querySelector('#microphoneButton'),
    map,
    marker,
    geocoder,
    responseDiv,
    response,
    infoWindow;


function startTalking() {
    if(window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition){
        console.log('Браузер поддерживает данную технологию');
    }else{
        console.log('Не поддерживается данным браузером');
    }
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

}

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

//     infoWindow = new google.maps.InfoWindow();
//
//     const locationButton = document.createElement("button");
//     locationButton.textContent = "Pan to Current Location";
//     locationButton.classList.add("custom-map-control-button");
//     map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//
//     locationButton.addEventListener("click", () => {
//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const pos = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude,
//                     };
//
//                     map.setCenter(pos);
//                 },
//                 () => {
//                     handleLocationError(true, infoWindow, map.getCenter());
//                 }
//             );
//         } else {
//             // Browser doesn't support Geolocation
//             handleLocationError(false, infoWindow, map.getCenter());
//         }
//
//     });
}




async function changeBackground() {
    const URL = 'https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=_fVmWccF3rsIJXBUbJWixSCYhGkUjeLTOzBiIkKkosY';
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
                    degrees.textContent = `${(data.main.temp / 31.3).toFixed()} °`;
                    cityName.textContent = `${data.name}, ${data.sys.country}`;
                    weatherDegreesApparent.textContent = `Ощущается как: ${(data.main.feels_like / 31.3).toFixed()} °`;
                    date.textContent = new Date().toDateString();
                    longitude.textContent = `Долгота: ${lon.toFixed(2)}`;
                    latitude.textContent = `Широта: ${lat.toFixed(2)}`;


                })

        })
    }
})


backgroundChangeBtn.addEventListener('click', changeBackground );
microphone.addEventListener('click', startTalking);
