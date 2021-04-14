// ---------
// CONSTANTS
// ---------
const WEATHER_API_KEY = 'a1d6db9ef71d433d95205809213003';
const TOP_CAPITALS = ['London', 'Tokyo', 'Paris',
                      'Rome', 'New York', 'Berlin',
                      'Buenos Aires', 'Bangkok', 'Rio de Janeiro', 'Viena'];
const FAHRENHEIT_COUNTRIES = ['United States', 'United States of America', 'Bahamas',
                              'Cayman Islands', 'Liberia', 'Palau',
                              'Micronesia', 'Marshall Islands'];

// -----------
// DOM LINKS
// -----------
const city = document.querySelector('.city');
const temperature = document.querySelector('.temperature');
const conditionText = document.querySelector('.condition-text');
const conditionIcon = document.querySelector('.condition-icon');

const newLocation = document.getElementById('new-location');
// Query location on ENTER even if input value hasn't changed
newLocation.addEventListener('keyup', e => e.key === 'Enter' && queryLocation(e.target.value));

const switchBtn = document.querySelector('.switch-unit');
switchBtn.addEventListener('click', switchUnit);

const geolocationBtn = document.querySelector('.get-geolocation');
geolocationBtn.addEventListener('click', () => {
  // Retrieving geolocation's weather conditions reset app's behavior to
  // always display user's current location conditions
  localStorage.removeItem('location');
  localStorage.removeItem('unit');

  queryGeolocation(printError);
});

const info = document.querySelector('.info');
const favIcon = document.querySelector("link[rel='shortcut icon']");

// ----------
// INITIALIZATION
// ----------

initLocation();

function initLocation() {
  let savedLocation = localStorage.getItem('location');
  
  if (savedLocation) {
    fetchWeatherAPI(savedLocation).then(switchToSavedUnit);
  } else {
    queryGeolocation(() => {
      // A random capital is picked if geolocation is not available
      queryRandomCapital();
      printError();
    });
  }
}

// ----------
// USER REQUESTS
// ----------
function switchToSavedUnit(temp) {
  let savedUnit = localStorage.getItem('unit');

  if (savedUnit && savedUnit !== extractTempUnit(temp)) {
    switchUnit();
  }
}

function switchUnit() {
  let converted = convertTemperature(temperature.textContent);

  temperature.textContent = converted;
  localStorage.setItem('unit', extractTempUnit(converted));

  changePageTitle(converted);
}

// ---------
// FETCH INFORMATION
// ---------
function queryGeolocation(fallback) {
  if ('geolocation' in navigator) {  
    navigator.geolocation.getCurrentPosition(queryPosition, fallback);
  } else {
    fallback();
  }
}

// position is a GeolocationAPI object
function queryPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  
  fetchWeatherAPI(lat + ',' + lon).then(switchToSavedUnit);
}

function queryLocation(location) {
  localStorage.setItem('location', location);
  fetchWeatherAPI(location);
}

function queryRandomCapital() {
  let capital = TOP_CAPITALS[Math.floor(Math.random() * 10)];
  fetchWeatherAPI(capital);
}

function fetchWeatherAPI(query) {
  let url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${query}`;
  return fetch(url)
  .then(response => response.json())
  .then(processWeather)
  .catch(console.log);
}

// -----------
// DISPLAY INFORMATION
// ------------
function processWeather(response) {
  let loc = response.location;
  let cur = response.current;

  let is_fahrenheit = FAHRENHEIT_COUNTRIES.includes(loc.country);
  let temp = is_fahrenheit ? cur.temp_f + '°F' : cur.temp_c + '°C';

  printLocation(loc.name, loc.region, loc.country);
  printWeather(cur.condition.text, temp);
  changePageTitle(temp, loc.name);
  displayIcon(cur.condition.icon);

  return temp;
}

function printLocation(name, region, country) {
  city.textContent = name + ', ' + region + ', ' + country;
}

function printWeather(text, temp) {
  temperature.textContent = temp;
  conditionText.textContent = text;
}

function printError() {
  info.textContent = 'Geolocation not available or blocked.';
}

// Display weather icon on body and page title
function displayIcon(host) {
  let url = 'http:' + host;
  conditionIcon.style.backgroundImage = `url('${url}')`;
  favIcon.href = url;
}

// Accepts 'same' as parameter for
function changePageTitle(temp, new_city = null) {
  let city = new_city ? new_city : document.title.split(',')[0];
  document.title = city + ', ' + temp + ' - Weather App';
}

// -----------
// HELPER FUNCTIONS
// -----------

function convertTemperature(temp) {
  let [value, unit] = [extractTempValue(temp), extractTempUnit(temp)]
  let converted;

  if (unit === 'C') {
    converted = removeZero((value * (9/5) + 32).toFixed(1)) + '°F';
  } else if (unit === 'F') {
    converted = removeZero(((value - 32) * (5/9)).toFixed(1)) + '°C';
  }

  return converted;
}

function  removeZero(num) {
  let [digits, decimals] = num.split('.');
  return decimals == 0 ? digits : num;
}

function extractTempValue(temp) {
  return temp.split('°')[0];
}

function extractTempUnit(temp) {
  return temp.split('°')[1];
}