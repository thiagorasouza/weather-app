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
const geolocationBtn = document.querySelector('.get-geolocation');
const info = document.querySelector('.info');
const favIcon = document.querySelector("link[rel='shortcut icon']");
// console.log(geolocationBtn);


// ----------
// INITIALIZATION
// ----------
let savedLocation = localStorage.getItem('location');
if (savedLocation) {
  fetchWeatherAPI(savedLocation);
} else {
  getGeolocation(() => {
    printRandomLocation();
    printInfo();
  });
}

// ----------
// USER REQUESTS
// ----------
newLocation.addEventListener('keyup', e => e.key === 'Enter' && updateLocation());
// newLocation.addEventListener('change', updateLocation);
switchBtn.addEventListener('click', switchUnit);
geolocationBtn.addEventListener('click', () => {
  localStorage.removeItem('location');
  getGeolocation(printInfo);
});

function getGeolocation(fallback) {
  // let notBlocked = false;
  if ('geolocation' in navigator) {  
    navigator.geolocation.getCurrentPosition(printGeolocation, fallback);
  }
  // console.log(notBlocked);
  // return notBlocked;
}

function updateLocation() {
  // console.log(e.key);
  let location = newLocation.value;
  localStorage.setItem('location', location);
  fetchWeatherAPI(location);
}

function switchUnit() {
  let converted = convertTemperature(temperature.textContent);
  temperature.textContent = converted;
  changeTitle('same', converted);
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

function printRandomLocation() {
  let location = TOP_CAPITALS[Math.floor(Math.random() * 10)];
  fetchWeatherAPI(location);
}

function fetchWeatherAPI(query) {
  let url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}`;
  fetchAPI(url, processWeatherAPI);
}

function processWeatherAPI(obj) {
  // console.log(obj);
  let loc = obj.location;
  let cur = obj.current;

  let temp;
  if (FAHRENHEIT_COUNTRIES.includes(loc.country)) {
    temp = cur.temp_f + '°F';
  } else {
    temp = cur.temp_c + '°C';
  }
  printLocation(loc.name, loc.region, loc.country);
  printWeather(loc.country, cur.condition.text, temp, cur.last_updated);
  changeTitle(loc.name, temp);
  displayIcon(cur.condition.icon);
}

function fetchAPI(url, callback) {
  fetch(url)
    .then(response => response.json())
    .then(callback)
    .catch(console.log);
}

// -----------
// DISPLAY INFORMATION
// ------------

function printLocation(name, region, country) {
  city.textContent = name + ', ' + region + ', ' + country;
}

function printWeather(country, text, temp, stamp) {
  temperature.textContent = temp;
  conditionText.textContent = text;
}

function printInfo() {
  info.textContent = 'Geolocation not available or blocked.';
}

function displayIcon(url) {
  url = 'http:' + url;
  conditionIcon.style.backgroundImage = `url('${url}')`;
  favIcon.href = url;
  // console.log(url);
  // console.log(conditionIcon.style.backgroundImage);
}

function changeTitle(city, temp) {
  if (city == 'same') {
    city = document.title.split(',')[0];
  }
  document.title = city + ', ' + temp + ' - Weather App';
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