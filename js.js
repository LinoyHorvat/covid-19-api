const regionsCountries = {
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
// html
const btnRegions = document.querySelectorAll("button.btn-regions");
const ul = document.querySelector("ul");

btnRegions.forEach((btn) => {
  btn.addEventListener("click", () => {
    let region = btn.innerHTML.toLocaleLowerCase();
    ul.innerHTML = "";
    if (Object.keys(world[region]).length === 0) {
      getCountriesByRegion(region);
    }
    else {
      regionsCountries[region].forEach(country => {
        buildCountriesTxtBtn(country);
      })
    }
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
      world[region][country.cca2] = {};
      fetchCovidData(region, country.cca2, country.name.common);
      buildCountriesTxtBtn(country.name.common);
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
        confirmed,
        newCases,
        deaths,
        newDeaths,
        recovered,
        critical
      );
    } catch (err) {
      console.log(err);
    }
  }
}

function buildWorldObj(
  region,
  country,
  name,
  totalCases,
  newCases,
  totalDeaths,
  newDeaths,
  totalRecovered,
  inCritical
) {
  world[region][country]["name"] = name;
  world[region][country]["totalCases"] = totalCases;
  world[region][country]["newCases"] = newCases;
  world[region][country]["totalDeaths"] = totalDeaths;
  world[region][country]["newDeaths"] = newDeaths;
  world[region][country]["totalRecovered"] = totalRecovered;
  world[region][country]["inCritical"] = inCritical;
}

function buildCountriesTxtBtn(country) {
  const li = document.createElement("li");
  ul.appendChild(li);
  li.innerText = country;
}
