let chart;
let autoInterval = null;

async function getWeather() {
    const destination = document.getElementById("destination").value.trim();

    if (destination === "") {
        document.getElementById("weatherResult").innerText = "⚠ Enter destination city";
        return;
    }

    const apiKey = "b813ff96062d08817090c85082e5de60";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${destination}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.cod !== 200) {
            document.getElementById("weatherResult").innerText = "❌ " + data.message;
            return;
        }

        const wind = Math.round(data.wind.speed * 3.6);
        const temp = Math.round(data.main.temp);

        document.getElementById("wind").value = wind;
        document.getElementById("temp").value = temp;

        document.getElementById("weatherResult").innerText =
            `🌦 ${destination} → Wind: ${wind} km/h, Temp: ${temp}°C`;
    } catch (err) {
        document.getElementById("weatherResult").innerText = "❌ Weather API error";
    }
}

async function checkRisk() {
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const wind = document.getElementById("wind").value;
    const temp = document.getElementById("temp").value;

    if (source === "" || destination === "" || wind === "" || temp === "") {
        document.getElementById("result").innerText = "⚠ Enter all fields";
        return;
    }

    try {
        const res = await fetch(
            `/api/risk?wind=${wind}&temp=${temp}&source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`
        );

        const data = await res.text();

        document.getElementById("result").innerText =
            `✈ ${source} → ${destination} | ${data}`;

        updateChart(wind, temp);
        loadFlights();

    } catch (err) {
        document.getElementById("result").innerText = "❌ Backend error";
    }
}

async function loadFlights() {
    try {
        const res = await fetch("/api/flights");
        const data = await res.json();

        if (data.length === 0) {
            document.getElementById("history").innerHTML = "<p>No flights saved yet.</p>";
            return;
        }

        let html = `
            <h3>Saved Flight Records</h3>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Wind</th>
                    <th>Temp</th>
                    <th>Risk</th>
                    <th>Time</th>
                </tr>
        `;

        data.forEach(f => {
            let color = "white";

            if (f.risk.includes("HIGH")) color = "red";
            else if (f.risk.includes("MEDIUM")) color = "orange";
            else if (f.risk.includes("LOW")) color = "lightgreen";

            html += `
                <tr>
                    <td>${f.id}</td>
                    <td>${f.source}</td>
                    <td>${f.destination}</td>
                    <td>${f.wind}</td>
                    <td>${f.temp}</td>
                    <td style="color:${color}; font-weight:bold;">${f.risk}</td>
                    <td>${f.time}</td>
                </tr>
            `;
        });

        html += `</table>`;
        document.getElementById("history").innerHTML = html;

    } catch (err) {
        document.getElementById("history").innerHTML = "<p>❌ Could not load history</p>";
    }
}

function toggleAuto() {
    const source = document.getElementById("source").value.trim();
    const destination = document.getElementById("destination").value.trim();

    if (source === "" || destination === "") {
        document.getElementById("result").innerText =
            "⚠ Enter source and destination before Auto Mode";
        return;
    }

    if (autoInterval === null) {
        document.getElementById("result").innerText = "🔄 Auto Mode Started";

        autoInterval = setInterval(() => {
            let wind = Math.floor(Math.random() * 100);
            let temp = Math.floor(Math.random() * 55 - 10);

            document.getElementById("wind").value = wind;
            document.getElementById("temp").value = temp;

            checkRisk();
        }, 5000);
    } else {
        clearInterval(autoInterval);
        autoInterval = null;
        document.getElementById("result").innerText = "⏹ Auto Mode Stopped";
    }
}

function updateChart(wind, temp) {
    const canvas = document.getElementById("riskChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Wind Speed", "Temperature"],
            datasets: [{
                label: "Flight Condition Values",
                data: [Number(wind), Number(temp)],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

function showSection(type) {
    const box = document.getElementById("dynamicContent");
    let content = "";

    if (type === "flight") {
        content = `
            <h3>✈ Flight Monitoring</h3>
            <p>Track source, destination, wind speed, and temperature for every flight.</p>
        `;
    } else if (type === "weather") {
        content = `
            <h3>🌦 Weather Analysis</h3>
            <p>Fetches live weather for the destination city using OpenWeather API.</p>
        `;
    } else if (type === "ai") {
        content = `
            <h3>🤖 AI Prediction</h3>
            <p>Analyzes wind and temperature to classify flight risk as Low, Medium, or High.</p>
        `;
    }

    box.innerHTML = content;
    box.style.display = "block";
}