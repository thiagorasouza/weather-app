// ---------
// CONSTANTS
// ---------
const WEATHER_API_KEY = 'a1d6db9ef71d433d95205809213003';
const LOCATION_API_KEY = '39e837d4df957a236ccf3189f7ed13cc';
// const OPEN_WEATHER_KEY = '927173a69293c796dcf621f0eb2c045a';

const TOP_CAPITALS = [
  'London', 'Tokyo', 'Paris', 
  'Rome', 'New York', 'Berlin', 
  'Buenos Aires', 'Bangkok', 'Rio de Janeiro', 'Viena'
];

const FAHRENHEIT_COUNTRIES = [
  'United States', 'Bahamas', 'Cayman Islands',
  'Liberia', 'Palau', 'Micronesia', 'Marshall Islands'
];

// -----------
// DOM LINKS
// -----------
const city = document.querySelector('.city');
const temperature = document.querySelector('.temperature');
const condition = document.querySelector('.condition');

// ----------
// BROWSER GEOLOCATION
// ----------
if ('geolocation' in navigator) {  
  // console.log('Have geolocation');
  navigator.geolocation.getCurrentPosition(printGeolocation, printRandomLocation);
} else {
  // console.log('No geolocation');
  printRandomLocation();
}

// ---------
// FETCH INFORMATION
// ---------
function printGeolocation(position) {
  // console.log(position);
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  // console.log(lat, lon);  
  fetchWeatherAPI(lat + ',' + lon);
}

function fetchWeatherAPI(query) {
  let url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}`;
  fetchAPI(url, processWeatherAPI);
}

function processWeatherAPI(obj) {
  let loc = obj.location;
  let cur = obj.current;
  printLocation(loc.name, loc.region, loc.country);
  printWeather(loc.country, cur.condition.text, cur.temp_c, cur.temp_f, cur.last_updated);
  displayIcon(cur.condition.icon);
}

function fetchLocationAPI(query) {
  let url = `http://api.positionstack.com/v1/reverse?access_key=${LOCATION_API_KEY}&query=${query}&limit=1`;
  // todo
}

// function fetchOpenWeather() {
//   let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}`;
//   // todo
// }

function fetchAPI(url, callback) {
  fetch(url)
    .then(response => response.json())
    .then(callback)
    .catch(console.log);
}

// -----------
// DISPLAY INFORMATION
// ------------
function printRandomLocation() {
  printLocation(TOP_CAPITALS[Math.floor(Math.random() * 10)]);
}

function printLocation(name, region, country) {
  city.textContent = name + ', ' + region + ', ' + country;
}

function printWeather(country, text, celsius, fahrenheit, stamp) {
  // console.log(temp);
  let temp;
  if (FAHRENHEIT_COUNTRIES.includes(country)) {
    temp = fahrenheit + '°F';
  } else {
    temp = celsius + '°C';
  }
  temperature.textContent = temp;
  condition.textContent = text;
}

function displayIcon(url) {
  // todo
}

// -----------
// HELP FUNCTIONS
// -----------
function randomCoordinates() {
  let randomCoord = max => (Math.random() < 0.5 ? -1 : 1) * (Math.random() * max).toFixed(8)
  return {
    lat: randomCoord(90),
    lon: randomCoord(180)
  }
}