
/* =====================================
   1. SELECT HTML ELEMENTS
===================================== */

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const statusMessage = document.getElementById("status-message");
const weatherCard = document.getElementById("weather-card");
const searchHistory = document.getElementById("search-history");

const HISTORY_KEY = "weatherSearchHistory";


/* =====================================
   2. SEARCH FORM EVENT
===================================== */

searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});


/* =====================================
   3. FETCH WEATHER DATA
===================================== */

async function getWeather(city) {

    statusMessage.textContent = "Loading...";
    weatherCard.hidden = true;

    try {

        if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
            throw new Error("Please configure your OpenWeatherMap API key.");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Please check the spelling.");
            }

            if (response.status === 401) {
                throw new Error("Invalid or inactive API key. Please try again later.");
            }

            throw new Error("Something went wrong. Please try again.");
        }

        const data = await response.json();

        displayWeather(data);

        saveSearch(data.name);

        statusMessage.textContent = "";

    } catch (error) {

        if (error instanceof TypeError) {
            statusMessage.textContent =
                "Unable to connect. Please check your internet connection.";
        } else {
            statusMessage.textContent = error.message;
        }

    }
}


/* =====================================
   4. DISPLAY WEATHER INFORMATION
===================================== */

function displayWeather(data) {

    document.getElementById("city-name").textContent =
        `${data.name}, ${data.sys.country}`;

    const weatherIcon = document.getElementById("weather-icon");

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt = data.weather[0].description;

    document.getElementById("weather-description").textContent =
        data.weather[0].description;

    document.getElementById("temperature").textContent =
        Math.round(data.main.temp);

    document.getElementById("feels-like").textContent =
        Math.round(data.main.feels_like);

    document.getElementById("humidity").textContent =
        data.main.humidity;

    document.getElementById("wind-speed").textContent =
        data.wind.speed;

    document.getElementById("pressure").textContent =
        data.main.pressure;

    weatherCard.hidden = false;
}


/* =====================================
   5. SAVE SEARCH HISTORY
===================================== */

function saveSearch(city) {

    let history = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
    );

    history = history.filter(
        item => item.toLowerCase() !== city.toLowerCase()
    );

    history.unshift(city);

    history = history.slice(0, 5);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    displayHistory();
}


/* =====================================
   6. DISPLAY SEARCH HISTORY
===================================== */

function displayHistory() {

    const history = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
    );

    searchHistory.innerHTML = "";

    history.forEach(city => {

        const listItem = document.createElement("li");

        listItem.textContent = city;
        listItem.setAttribute("role", "button");
        listItem.setAttribute("tabindex", "0");

        listItem.addEventListener("click", function() {
            getWeather(city);
        });

        listItem.addEventListener("keydown", function(event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                getWeather(city);
            }
        });

        searchHistory.appendChild(listItem);

    });
}


/* =====================================
   7. LOAD HISTORY WHEN PAGE OPENS
===================================== */

displayHistory();
