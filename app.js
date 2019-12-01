document.addEventListener("DOMContentLoaded", function() {
  const apiKey = "bbec0d1829218955d05c457c1d23fee5";
  let myCity = "Kraków";
  let temp, description, city, icon;
  let today = new Date();

  //Current weather
  let currentWeatherHtml = document.querySelector(".wrapperContent");
  let currentDateHtml = currentWeatherHtml.firstElementChild;
  let descHtml = currentWeatherHtml.lastElementChild;
  let cityHtml = document.querySelector(".wrapperContent p:nth-child(2)");
  let tempHtml = document.querySelector(".wrapperContent p:nth-child(4)");

  //Next 5 days weather
  let futureWeatherHtml = document.querySelectorAll(
    ".fiveDaysWeather div p:first-child"
  );

  ////Get and set weather info
  const weather = async () => {
    //Retrieve weather data from API
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${myCity}&units=metric&appid=${apiKey}`;
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status);
    }
    let data = await response.json();
    return data;
  };
  const setValues = data => {
    /*Initialize variables with specific values.
          Returns an array
        */
    temp = Math.round(data.main.temp);
    description = data.weather[0].description;
    city = data.name;
    icon = data.weather[0].icon;
    return [temp, description, city, icon];
  };

  ////Get date info
  function getFullDay(date) {
    //Returns the name of the given weekday
    return date.toLocaleString("en-us", { weekday: "long" });
  }
  const getNextFiveDays = function(startDate, daysNum) {
    //Returns an array with daysNum number of days from startDate
    var xDays = [];
    for (var i = 0; i <= daysNum; i++) {
      var currentDate = new Date();
      currentDate.setDate(startDate.getDate() + i);
      xDays.push(getFullDay(currentDate));
    }
    return xDays;
  };
  ////Set date info
  const dates = {
    weekDay: getNextFiveDays()[0],
    day: today.getDate(),
    month: today.getMonth(),
    year: today.getFullYear(),
    nextFiveDays: getNextFiveDays(today, 5)
  };
  ////Inject data into html
  const setHtml = data => {
    //Insert weather info into html document
    tempHtml.innerHTML = data[0] + "&deg C";
    descHtml.innerHTML = data[1].charAt(0).toUpperCase() + data[1].slice(1);
    cityHtml.innerHTML = city;
    //Insert date info into html
    currentDateHtml.innerHTML = `${dates.day}.${dates.month}.${dates.year}`;
    for (var i = 0; i <= 6; i++) {
      if (futureWeatherHtml[i]) {
        futureWeatherHtml[i].innerHTML = dates.nextFiveDays[i + 1];
      }
    }
    //Set img src for wrapper icon - day icons
    document.getElementById("image").src =
      "https://openweathermap.org/img/wn/" + data[3] + "@2x.png";
  };
  ////Navigation - set and display weather for clciked element
  const navCities = document.querySelectorAll(".navigation li a");
  function showNavCity(e) {
    //Sets url myCity var to nav element innerHTML
    myCity = e.target.innerHTML;
    run();
  }
  navCities.forEach(navcity => navcity.addEventListener("click", showNavCity));
  navCities.forEach(navcity => navcity.addEventListener("click", hideMenu));

  function hideMenu() {
    let x = document.getElementById("show-menu");
    if (x.checked == true) {
      x.checked = false;
    }
  }

 ////5 days weather forecast
  async function getWeatherForNextDays(city) {
    let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    const weather = await response.json();
    const today = new Date().getDate();
    const dailyWeather = weather.list.filter(element => {
      return (
        new Date(element.dt * 1000).getDate() !== today &&
        element.dt_txt.includes("15:00:00")
      );
    });

    const degrees = document.getElementsByClassName("degrees");
    const dayNames = document.getElementsByClassName("dayName");
    const icons = document.getElementsByClassName("icon");

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    for (let i = 0; i < dayNames.length - 1; i++) {
      degrees[i].innerHTML = Math.round(dailyWeather[i].main.temp) + "&deg C";
      const date = new Date(dailyWeather[i].dt * 1000);
      dayNames[i].innerHTML = days[date.getDay()];
      icons[
        i
      ].src = `http://openweathermap.org/img/wn/${dailyWeather[i].weather[0].icon}@2x.png`;
    }

    const setLastDay = () => {
      degrees[4].innerHTML =
        Math.round(weather.list[weather.list.length - 1].main.temp) + "&deg C";
      const date = new Date(weather.list[weather.list.length - 1].dt * 1000);
      dayNames[4].innerHTML = days[date.getDay()];
      icons[4].src = `http://openweathermap.org/img/wn/${
        weather.list[weather.list.length - 1].weather[0].icon
      }@2x.png`;
    };

    setLastDay();
  }
  ////Main function
  const run = function() {
    weather()
      .then(res => {
        getWeatherForNextDays(myCity);
        return res;
      })
      .then(res => setValues(res))
      .then(res => setHtml(res))
      .catch(err => {
        if (err.message === "404") {
          console.log("Resource not found");
        } else {
          console.log("An error has occured");
        }
      });
  };
  run();
});
