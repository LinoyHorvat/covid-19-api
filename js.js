const regionsCountries = {
  asia: [],
  europe: [],
  africa: [],
  americas: [],
  world: [],
};
const regionsCountriesShort = {
  asia: [],
  europe: [],
  africa: [],
  americas: [],
  world: [],
};
const world = {
  asia: {},
  europe: {},
  africa: {},
  americas: {},
};
let region = "asia";
let status = "Confirmed";
let myChart = null;

// html
const btnRegions = document.querySelectorAll("button.btn-regions");
const btnStatus = document.querySelectorAll("button.btn-data");
const ul = document.querySelector("ul");
let ctx = document.getElementById("myChart").getContext("2d");
let chart = document.querySelector(".chart-div");
let countryStatus = document.querySelector(".country-data")
let statues = document.querySelectorAll(".status");

hideStatus();

btnRegions.forEach((btn) => {
  btn.addEventListener("click", () => {
    region = btn.innerHTML.toLocaleLowerCase();
    ul.innerHTML = "";
    if (Object.keys(world[region]).length === 0) {
      getCountriesByRegion(region);
    } else {
      regionsCountries[region].forEach((country) => {
        buildCountriesTxtBtn(country);
      });
    }
    buildDataForChart(region, status);
  });
});

btnStatus.forEach((btn) => {
  btn.addEventListener("click", () => {
    status = btn.innerHTML.toLocaleLowerCase();
    buildDataForChart(region, status);
  });
});

async function getCountriesByRegion(region) {
  try {
    const result = await fetch(
      `https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${region}`
    );
    const data = await result.json();
    data.forEach((country) => {
      regionsCountries[region].push(country.name.common);
      regionsCountriesShort[region].push(country.cca2);
      world[region][country.cca2] = {};
      fetchCovidData(region, country.cca2, country.name.common);
      buildCountriesTxtBtn(country.name.common, country.cca2);
    });
  } catch (err) {
    console.log(err);
  }
}

async function fetchCovidData(region, country, name) {
  if (country != "XK") {
    try {
      const result = await fetch(
        `https://intense-mesa-62220.herokuapp.com/http://corona-api.com/countries/${country}`
      );
      const data = await result.json();
      const { confirmed, deaths, critical, recovered } = data.data.latest_data;
      const { confirmed: newCases, deaths: newDeaths } = data.data.today;
      buildWorldObj(
        region,
        country,
        name,
        confirmed + newCases,
        deaths + newDeaths,
        recovered,
        critical
      );
    } catch (err) {
      console.log(err);
    }
    buildDataForChart(region, status).then;
  }
}

function buildWorldObj(
  region,
  country,
  name,
  confirmed,
  deaths,
  recovered,
  critical
) {
  world[region][country]["name"] = name;
  world[region][country]["confirmed"] = confirmed;
  world[region][country]["deaths"] = deaths;
  world[region][country]["recovered"] = recovered;
  world[region][country]["critical"] = critical;
}

function buildCountriesTxtBtn(country, countryCodeName) {
  const li = document.createElement("li");
  ul.appendChild(li);
  li.innerText = country;
  li.addEventListener("click", () => {
    buildCountryData(countryCodeName);
  });
}

async function buildDataForChart(region, status) {
  const data = [];
  regionsCountriesShort[region].forEach((country) => {
    data.push(world[region][country][status]);
  });
  await buildChart(region, status, data);
}

async function buildChart(region, status, data) {
  hideStatus();
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: regionsCountries[region],
      datasets: [
        {
          label: `${status}`,
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  chart.style.display = "block";
}
function hideStatus(){
  countryStatus.style.display = "none";
  countryStatus.style.height = "0px";
  statues.forEach(status =>{
    status.style.display = "none";
  })
}

function buildCountryData(countryCodeName) {
  chart.style.display = "none";
  statues[0].innerText = world[region][countryCodeName].name;
  statues[1].innerText =
    "Confirmed: " + world[region][countryCodeName].confirmed;
  statues[2].innerText = "Deaths: " + world[region][countryCodeName].deaths;
  statues[3].innerText = "Recovered: " + world[region][countryCodeName].recovered;
  statues[4].innerText = "Critical: " + world[region][countryCodeName].critical;
  countryStatus.style.display = "block";
  countryStatus.style.height = "40vh";
  statues.forEach(status =>{
    status.style.display = "block";})
}
