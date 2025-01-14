document.addEventListener('DOMContentLoaded', function() {
    fetch('/check_login')
        .then(response => response.text())
        .then(data => {
            console.log(data)
            if (data === '0') {
                window.location.href = "/login";
            }else{
                fetch('/get-fullHistory')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    drawChart('stratagemHero', data.stratagemHero)
                    drawChart('aimTrainer',    data.aimTrainer, 10)
                    drawChart('simonSays',     data.simonSays)
                    drawChart('typingGame',    data.typingGame)
                })
                .catch((error) => {
                    console.error('Error getting the response:', error);
                })
            }
        })
        .catch((error) => {
            console.error('Error getting the response:', error);
        })

        function drawChart(id, data, y_tick= 1) {
            if (data.length === 0) {
                return document.getElementById(id).innerHTML = "<h3>Please play the game for the history to be shown</h3>";
            }
            let x =[];
            let y =[];
   
            data.forEach(element => {
                x.push(element.date);
                y.push(element.score);
            });
            var data = [{
                x: x,
                y: y,
                mode: "lines+markers",
                type: 'scatter'
            }];
            
            var layout = {
                width: calculateDesiredWidth(55) > 600 ? calculateDesiredWidth(55) : 600,
                height: 350,
                margin: {
                    l: 30,
                    r: 30,
                    t: 20,
                    b: 50 
                },
                paper_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent background color
                plot_bgcolor: 'rgba(0, 0, 0, 0)', // Transparent plot area color
                padding: {
                    l: 30,
                    r: 30,
                    t: 20,
                    b: 50 
                },
                yaxis: {
                    dtick: y_tick, // Ensures that the step between ticks is 1 unit, thus showing only whole numbers
                    tickformat: ".0f" // Formats the ticks to show no decimal places
                }
            };
            var config = {
                showLink: true,
                plotlyServerURL: "https://chart-studio.plotly.com", 
                staticPlot: true
            };

            Plotly.newPlot(`${id}`, data, layout, config);   
        }


        function calculateDesiredWidth(percentageToLeaveOut) {
            const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const desiredWidth = screenWidth - (screenWidth * (percentageToLeaveOut / 100));
            return desiredWidth;
        }
    });