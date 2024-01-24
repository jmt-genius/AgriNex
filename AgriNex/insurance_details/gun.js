const gun = new Gun();

        function saveData() {
            const city = document.getElementById('city').value;
            const walletId = document.getElementById('walletId').value;

            const userData = {
                city: city,
                walletId: walletId
            };

            gun.get('users').set(userData, (ack) => {
                if (ack.err) {
                    console.error('Error saving data:', ack.err);
                    alert('Error saving data. Please try again.');
                } else {
                    console.log('Data saved successfully:', userData);
                    alert('Data saved successfully: ' + JSON.stringify(userData));

                    // Example usage
                    const apiKey = 'iHzLKtdIGVR9rpCMjvOhRRVaVFjpT3CA';
                    getWeather(apiKey, city);
                }
            });

            // Clear the form after saving data
            document.getElementById('dataForm').reset();
        }

        function getWeather(apiKey, city) {
            const baseUrl = 'http://dataservice.accuweather.com/';
            const encodedCity = encodeURIComponent(city);

            // Get Location Key
            const locationUrl = `${baseUrl}locations/v1/cities/search?q=${encodedCity}&apikey=${apiKey}`;

            fetch(locationUrl)
                .then(response => response.json())
                .then(locationData => {
                    if (locationData.length > 0) {
                        const locationKey = locationData[0].Key;

                        // Get Current Conditions
                        const currentConditionsUrl = `${baseUrl}currentconditions/v1/${locationKey}?apikey=${apiKey}`;

                        fetch(currentConditionsUrl)
                            .then(response => response.json())
                            .then(currentConditionsData => {
                                // Print Current Weather
                                console.log(`Current Weather in ${city}:`);
                                console.log(`Temperature: ${currentConditionsData[0].Temperature.Metric.Value} °C`);
                                console.log(`Conditions: ${currentConditionsData[0].WeatherText}`);

                                // Check for Wind Information
                                const windInfo = currentConditionsData[0].Wind || {};
                                const windSpeed = windInfo.Speed?.Metric.Value || "N/A";
                                console.log(`Wind Speed: ${windSpeed} m/s`);

                                // Continue with other parameters (humidity, visibility, etc.)

                                // Check for Rainfall
                                const precipitation = currentConditionsData[0].PrecipitationSummary?.Precipitation?.Metric.Value || 0;
                                console.log(`Precipitation (Rainfall): ${precipitation} mm`);
                            })
                            .catch(error => console.error(`Failed to retrieve current conditions: ${error}`));
                    } else {
                        console.log(`No location found for ${city}`);
                    }
                })
                .catch(error => console.error(`Failed to retrieve location data: ${error}`));
                
        }
