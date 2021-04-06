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
  'United States', 'United States of America', 'Bahamas', 'Cayman Islands',
  'Liberia', 'Palau', 'Micronesia', 'Marshall Islands'
];

// -----------
// DOM LINKS
// -----------
const city = document.querySelector('.city');
const temperature = document.querySelector('.temperature');
const conditionText = document.querySelector('.condition-text');
const conditionIcon = document.querySelector('.condition-icon');
const newLocation = document.getElementById('new-location');
const updateBtn = document.querySelector('.update');
const switchBtn = document.querySelector('.switch-unit');


// ----------
// INITIALIZATION
// ----------
newLocation.value = localStorage.getItem('location');

if ('geolocation' in navigator) {  
  // console.log('Have geolocation');
  navigator.geolocation.getCurrentPosition(printGeolocation, printRandomLocation);
} else {
  // console.log('No geolocation');
  printRandomLocation();
}

// ----------
// USER REQUESTS
// ----------
newLocation.addEventListener('keyup', e => e.key === 'Enter' && updateLocation());
// newLocation.addEventListener('change', updateLocation);
switchBtn.addEventListener('click', switchUnit);

function updateLocation() {
  // console.log(e.key);
  let location = newLocation.value;
  localStorage.setItem('location', location);
  fetchWeatherAPI(location);
}

function switchUnit() {
  temperature.textContent = convertTemperature(temperature.textContent);
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
  // console.log(obj);
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
  conditionText.textContent = text;

  switchUnit = () => {
    
  }
}

function displayIcon(url) {
  url = 'http:' + url;
  console.log(url);
  conditionIcon.style.backgroundImage = `url('${url}')`;
  console.log(conditionIcon.style.backgroundImage);
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

function convertTemperature(temp) {
  const removeZero = (num) => {
    let [digits, decimal] = num.split('.');
    return decimal == 0 ? digits : num;
  }

  let [value, unit] = temp.split('°');
  let converted;
  if (unit === 'C') {
    converted = removeZero((value * (9/5) + 32).toFixed(1)) + '°F';
  } else if (unit === 'F') {
    converted = removeZero(((value - 32) * (5/9)).toFixed(1)) + '°C';
  }

  return converted;
}