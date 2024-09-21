"use-strict";

const inputplace = document.querySelector(".search-location");

const searchbtn = document.querySelector(".bx-search");
const cur_place = document.querySelector(".heading");
const time = document.querySelector(".Date-and-time");
const forecast = document.querySelector(".forecast");
const img = document.querySelector(".weather-icon-img");
const cur_temp = document.querySelector(".temp-val");
const min_temp = document.querySelector(".min-val");
const max_temp = document.querySelector(".max-val");
const feels_like = document.querySelector(".feels-like-value");
const humidity = document.querySelector(".humidity-value");
const wind = document.querySelector(".wind-value");
const pressure = document.querySelector(".pressure-value");
const errorImgPath = "./warning_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.png";
const key = "0215efd51615de3981b8e8cb80ea2d6d";
const weather_body = document.querySelector(".weather-body");
console.log(weather_body);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getTime = function () {
  const cur_time = new Date();
  // console.log(cur_time);
  // Extract hours and minutes
  let hours = cur_time.getHours();
  let minutes = cur_time.getMinutes();
  // Ensure minutes are always two digits (e.g., 09 instead of 9)
  minutes = minutes < 10 ? "0" + minutes : minutes;
  hours = hours < 10 ? "0" + hours : hours;
  const str = `${
    months[cur_time.getMonth()]
  } ${cur_time.getDate()}, ${cur_time.getFullYear()} ${hours}:${minutes}`;
  // console.log(str);
  time.innerHTML = str;
};
getTime();

const curPosition = function () {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // console.log(position);
      const { latitude: lat, longitude: lng } = position.coords;
      // console.log(lat, lng);

      fetch(
        `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data);

          getResults(data.city);
        })
        .catch((err) => {
          renderError();
        });
    },
    (err) => {
      renderError();
    }
  );

  // weather_body.classList.remove("hidden");
};
curPosition();

searchbtn.addEventListener("click", function () {
  let location = inputplace.value;
  // console.log(location);
  if (!location) {
    getTime();
    renderError();
  }

  getTime();
  weather_body.classList.remove("hidden");
  getResults(location);

  inputplace.value = "";
});

const renderError = function () {
  cur_place.innerHTML = "Country Not found";
  cur_temp.innerHTML = "-";
  min_temp.innerHTML = "-";
  max_temp.innerHTML = "-";
  pressure.innerHTML = "-";
  humidity.innerHTML = "-";
  feels_like.innerHTML = "-";
  wind.innerHTML = "-";
  img.src = errorImgPath;
  forecast.innerHTML = "-";
};

const getResults = function (location) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}`;

  fetch(url)
    .then((resp) => {
      // console.log(resp);

      if (!resp.ok) throw new Error("Invalid location");

      return resp.json();
    })
    .then((data) => {
      // console.log(data);
      cur_place.innerHTML = data.name;
      cur_temp.innerHTML = (data.main.temp - 273.16).toFixed(1) + " °C";
      min_temp.innerHTML = (data.main.temp_min - 273.16).toFixed(1);
      max_temp.innerHTML = (data.main.temp_max - 273.16).toFixed(1);
      feels_like.innerHTML = (data.main.feels_like - 273.16).toFixed(1) + " °C";
      pressure.innerHTML = data.main.pressure.toFixed(1) + " hPa";
      humidity.innerHTML = data.main.humidity.toFixed(1) + "%";
      wind.innerHTML = data.wind.speed + " m/s";
      img.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      forecast.innerHTML = data.weather[0].description;

      weather_body.classList.remove("hidden");
    })
    .catch((err) => {
      renderError();
      console.error("Something went wrong");
    });
};
