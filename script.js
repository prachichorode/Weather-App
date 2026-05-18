let weatherChart;
let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    locationBtn = document.getElementById('locationBtn'),
    api_key = '98e3278d456e5138c2c059410addd5ff'; // Active API Key

let currentWeatherCard = document.getElementById('currentWeatherCard');
let fiveDaysForcastCard = document.getElementById('forecastContainer'); 
let apiCard = document.getElementById('aqiCard');
let sunriseCard = document.getElementById('sunriseCard');

let humidityVal = document.getElementById('humidityval'), 
    pressureVal = document.getElementById('pressureval'),
    visibilityVal = document.getElementById('visibilityval'),
    WindSpeedVal = document.getElementById('windspeedval'),
    FeelsVal = document.getElementById('feelsval'),
    hourlyForecastCard = document.getElementById('hourlyForecastCard');

let aquilist = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(name, lat, lon, country, state) {
    // Sahi URL format bina kisi error ke
    let FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + api_key + '&units=metric';
    let WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + api_key + '&units=metric';
    let AIR_POLLUTION_API_URL = 'https://api.openweathermap.org/data/2.5/air_pollution?lat=' + lat + '&lon=' + lon + '&appid=' + api_key;
    
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // 1. Air Quality Data Fetch
    fetch(AIR_POLLUTION_API_URL)
    .then(res => {

        if(!res.ok){
            throw new Error("AQI API Failed");
        }

        return res.json();
    })
        .then(data => {
            let { pm2_5, pm10, so2, co, no, no2, nh3, o3 } = data.list[0].components;
            let aqi = data.list[0].main.aqi;

            if (apiCard) {
                apiCard.innerHTML = `
                    <div class="card-head">
                        <p>Air Quality Index</p>
                        <p class="air-index aqi-${aqi}">${aquilist[aqi - 2]}</p>
                    </div>
                    <div class="air-indices">
                        <i class="fa-solid fa-wind fa-3x"></i>
                        <div class="item"><p>PM2.5</p><h2>${pm2_5.toFixed(1)}</h2></div>
                        <div class="item"><p>PM10</p><h2>${pm10.toFixed(1)}</h2></div>
                        <div class="item"><p>SO2</p><h2>${so2.toFixed(1)}</h2></div>
                        <div class="item"><p>CO</p><h2>${co.toFixed(1)}</h2></div>
                        <div class="item"><p>NO</p><h2>${no.toFixed(1)}</h2></div>
                        <div class="item"><p>NO2</p><h2>${no2.toFixed(1)}</h2></div>
                    </div>
                `;
            }
        }).catch(() => console.log('AQI Failed'));

    // 2. Current Weather Data Fetch
    fetch(WEATHER_API_URL)
    .then(res => {

        if(!res.ok){
            throw new Error("Weather API Failed");
        }

        return res.json();
    })
        .then(data => {
            let date = new Date(); 
            let tempCelsius = data.main.temp.toFixed(2);
            let description = data.weather[0].description;
            let weatherMain = data.weather[0].main;
            if(weatherMain === "Clear"){
                document.body.style.backgroundImage =
                "url('https://images.unsplash.com/photo-1501973801540-537f08ccae7b')";
            }
            else if(weatherMain === "Clouds"){
                document.body.style.backgroundImage =
                "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda')";
            }
            else if(weatherMain === "Rain"){
                document.body.style.backgroundImage =
                "url('https://images.unsplash.com/photo-1519692933481-e162a57d6721')";
            }
            else if(weatherMain === "Thunderstorm"){
                document.body.style.backgroundImage =
                "url('https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28')";
            }
            else if(weatherMain === "Snow"){
                document.body.style.backgroundImage =
                "url('https://images.unsplash.com/photo-1517299321609-52687d1bc55a')";
            }
            else{
                document.body.style.backgroundImage =
                "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')";
            }
            let iconCode = data.weather[0].icon;

            if (currentWeatherCard) {
                currentWeatherCard.innerHTML = `
                    <div class="current-weather">
                        <div class="details">
                            <p>Now</p>
                            <h2>${tempCelsius}&deg;C</h2>
                            <p style="text-transform: capitalize;">${description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="weather icon">
                        </div>
                    </div>
                    <hr>
                    <div class="card-footer">
                        <p><i class="fa-regular fa-calendar"></i> ${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}</p>
                        <p><i class="fa-solid fa-location-dot"></i> ${name}, ${country}</p>
                    </div>
                `;
            }

            let { sunrise, sunset } = data.sys;
            let { timezone, visibility } = data;
            let { humidity, pressure, feels_like } = data.main;
            let { speed } = data.wind;
            
            let sTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
            let sSetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');

            if (sunriseCard) {
                sunriseCard.innerHTML = `
                    <div class="card-head">
                        <p>Sunrise & Sunset</p>
                    </div>
                    <div class="sunrise-sunset">
                        <div class="item">
                            <div class="icon"><i class="fa-solid fa-sun fa-2x"></i></div>
                            <div><p>Sunrise</p><h2>${sTime}</h2></div>
                        </div>
                        <div class="item">
                            <div class="icon"><i class="fa-solid fa-moon fa-2x"></i></div>
                            <div><p>Sunset</p><h2>${sSetTime}</h2></div>
                        </div>
                    </div>
                `;
            }
            
            if (humidityVal) humidityVal.innerHTML = humidity + '%';
            if (pressureVal) pressureVal.innerHTML = pressure + ' hPa';
            if (visibilityVal) visibilityVal.innerHTML = (visibility / 1000).toFixed(1) + ' km';
            if (WindSpeedVal) WindSpeedVal.innerHTML = speed + ' m/s';
            if (FeelsVal) FeelsVal.innerHTML = feels_like.toFixed(2) + '&deg;C';
        }).catch(() => console.log("Weather Fetch Failed"));

    // 3. 5-Day Forecast Data Fetch (Isse loops chalenge aur 5 baar apne aap add ho jayega)
    fetch(FORECAST_API_URL)
    .then(res => {

        if(!res.ok){
            throw new Error("Forecast API Failed");
        }

        return res.json();
    })
        .then(data => {
            let hourlyForecast = data.list;
            let labels = [];
            let temps = [];
            for(let i = 0; i < 8; i++){
                let time = new Date(hourlyForecast[i].dt_txt);
                let hour = time.getHours();
                labels.push(hour + ":00");
                temps.push(hourlyForecast[i].main.temp);
            }
            let ctx = document.getElementById('weatherChart');
            if(weatherChart){
                weatherChart.destroy();
            }
            weatherChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Temperature °C',
                        data: temps,
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: 'white'
                            }
                        },
                        y: {
                            ticks: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
            if (hourlyForecastCard) {
                hourlyForecastCard.innerHTML = '';
                for(let i = 0; i < 5; i++){
                    if(!hourlyForecast[i]) break;
                    let hrForeCastDate = new Date(hourlyForecast[i].dt_txt);
                    let hr = hrForeCastDate.getHours();
                    let a = 'AM';
                    if(hr >= 12) a = 'PM';
                    if(hr == 0) hr = 12;
                    if(hr > 12) hr = hr - 12;
                    
                    hourlyForecastCard.innerHTML += `
                        <div class="card">
                            <p>${hr} ${a}</p>
                            <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="weather icon">
                            <p>${hourlyForecast[i].main.temp.toFixed(2)}&deg;C</p>
                        </div>
                    `;
                }
            }

            let uniqueForecastDays = [];
            let fiveDaysForecast = data.list.filter(forecast => { 
                let forecastDate = new Date(forecast.dt_txt).getDate(); 
                if (!uniqueForecastDays.includes(forecastDate)) {
                    uniqueForecastDays.push(forecastDate);
                    return true;
                }
                return false;
            });

            if (fiveDaysForcastCard) {
                fiveDaysForcastCard.innerHTML = '';
                for (let i = 0; i < fiveDaysForecast.length; i++) {
                    let date = new Date(fiveDaysForecast[i].dt_txt);
                    fiveDaysForcastCard.innerHTML += `
                        <div class="forecast-item">
                            <div class="icon-wrapper">
                                <img src="https://openweathermap.org/img/wn/${fiveDaysForecast[i].weather[0].icon}.png" alt=""> 
                                <span>${fiveDaysForecast[i].main.temp.toFixed(2)}&deg;C</span>
                            </div>
                            <p style="text-transform: capitalize; margin: 0 10px;">${fiveDaysForecast[i].weather[0].description}</p>
                            <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        </div>
                    `; 
                }
            }
        }).catch(() => console.log("Forecast Failed"));
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    if (!cityName) return;
    
    let GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&limit=1&appid=' + api_key;

    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data.length) return alert('No coordinates found for ' + cityName);
            let { name, lat, lon, country, state } = data[0];
            getWeatherDetails(name, lat, lon, country, state);
        }).catch(() => alert("Coordinates Fetch Failed"));
}

function getUserCoordinates() {

    // Browser geolocation supported hai ya nahi
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        getWeatherDetails("Mumbai", 19.0760, 72.8777, "IN", "Maharashtra");
        return;
    }

    console.log("Getting location...");
    navigator.geolocation.getCurrentPosition(

        // SUCCESS
        position => {

            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;

            let REVERSE_GEOCODING_URL =
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

            fetch(REVERSE_GEOCODING_URL)
                .then(res => {

                    if (!res.ok) {
                        throw new Error("Failed reverse geocoding");
                    }

                    return res.json();
                })

                .then(data => {
                    console.log(data);
                    if (!data || data.length === 0) {
                        getWeatherDetails(
                            "Mumbai",
                            latitude,
                            longitude,
                            "IN",
                            "Maharashtra"
                        );
                         return;
                        }
                        let cityName = data[0].name || "Current Location";
                        let country = data[0].country || "IN";
                        let state = data[0].state || "";
                        getWeatherDetails(
                            cityName,
                            latitude,
                            longitude,
                            country,
                            state
                        );
                    })

                .catch(error => {

                    console.log(error);

                    alert("Failed to fetch location data");

                    getWeatherDetails(
                        "Mumbai",
                        19.0760,
                        72.8777,
                        "IN",
                        "Maharashtra"
                    );
                });
        },

        // ERROR
        error => {

            console.log(error);

            if (error.code === 1) {
                alert("Location permission denied");
            }
            else if (error.code === 2) {
                alert("Location unavailable");
            }
            else if (error.code === 3) {
                alert("Location request timeout");
            }
            else {
                alert("Failed to get current location");
            }

            // Default city
            getWeatherDetails(
                "Mumbai",
                19.0760,
                72.8777,
                "IN",
                "Maharashtra"
            );
        },

        // OPTIONS
        {
            enableHighAccuracy: false,
                timeout: 15000,
                maximumAge: 60000

        }
    );
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);

let themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')){
        themeToggle.innerHTML = "🌙 Dark Mode";
    }
    else{
        themeToggle.innerHTML = "☀️ Light Mode";
    }
});