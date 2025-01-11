const apikey = '2afe51936c64eff506e6679e83b5b2a2'; //  API key

document.addEventListener('DOMContentLoaded', () => {
    const getWeatherButton = document.getElementById('getweather');
    const cityInput = document.getElementById('city');
    const weatherdataDiv = document.getElementById('weatherdata');
    const temperaturePara = document.getElementById('temperature');
    const descriptionPara = document.getElementById('description');
    const iconImg = document.getElementById('icon');
    const errormessage = document.getElementById('errormessage');
    const loadingMessage = document.createElement('p');

    loadingMessage.textContent = "Loading...";
    loadingMessage.id = "loading";
    document.body.appendChild(loadingMessage);

    console.log(getWeatherButton); 
    console.log(cityInput);        
    
    let isCelsius = true;  // tracks the current unit (celsius or fahrenheit)
    let temperatureInCelsius = 0; // stores the celsius temperature

    // fetch weather data
    getWeatherButton.addEventListener('click', async () => {
        const city = cityInput.value.trim();    
        console.log(`City entered: ${city}`);
        if (!city) {
            errormessage.textContent = 'Please enter a city name';
            errormessage.classList.remove('hidden');
            return;
        }

        loadingMessage.classList.remove('hidden'); // shows loading

        errormessage.classList.add('hidden');
        weatherdataDiv.classList.add('hidden');

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`
            );

            if (!response.ok) {
                throw new Error('Check spelling or try another city');
            }

            const data = await response.json();
            temperatureInCelsius = data.main.temp - 273.15; // converts kelvin to celsius

            // display celsius by default
            updateTemperatureDisplay();

            descriptionPara.textContent = `Description: ${data.weather[0].description}`;
            iconImg.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

            weatherdataDiv.classList.remove('hidden');
            errormessage.textContent = '';
        } catch (error) {
            errormessage.textContent = error.message;
            errormessage.classList.remove('hidden');
        } finally {
            loadingMessage.classList.add('hidden'); // hide loading
        }
    });

    // toggle temperature units
    const toggleUnitsButton = document.getElementById('toggleUnits');
    toggleUnitsButton.addEventListener('click', () => {
        isCelsius = !isCelsius;
        updateTemperatureDisplay();
    });

    // update temperature display
    function updateTemperatureDisplay() {
        if (isCelsius) {
            temperaturePara.textContent = `Temperature: ${temperatureInCelsius.toFixed(2)} °C`;
            toggleUnitsButton.textContent = 'Switch to F';
        } else {
            const temperatureInFahrenheit = (temperatureInCelsius * 9) / 5 + 32;
            temperaturePara.textContent = `Temperature: ${temperatureInFahrenheit.toFixed(2)} °F`;
            toggleUnitsButton.textContent = 'Switch to C';
        }
    }
});