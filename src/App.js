import React, { useState, useEffect } from "react";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  Typography,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData, prettyPrintStats } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseType, setCaseType] = useState("cases");

  const onCountryChange = async (e) => {
    // Fetch info for the seledcted country
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    // Fetch data for first load and set worldwide datadd
    fetch("https://disease.sh/v3/covid-19/all", { signal: signal })
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    // Fetch countries
    const abortController = new AbortController();
    const signal = abortController.signal;
    const fetchCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries", {
        signal: signal,
      })
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          console.log(data);
          setCountries(countries);
        });
    };
    fetchCountriesData();

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return (
    <Grid container className="app">
      <Grid item xs={12} md={8} className="app__left">
        {/* title + dropdown */}
        <Box mb={3} className="app__header">
          <h1 className="app__title">COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem key="worldwide" value="worldwide">
                Worldwide
              </MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2} className="app__stats">
          {/* info cards */}
          <Grid item xs={12} md={4}>
            <InfoBox
              isOrange
              active={caseType === "cases"}
              onClick={(e) => setCaseType("cases")}
              title="Coronavirus Cases"
              cases={prettyPrintStats(countryInfo.todayCases)}
              total={prettyPrintStats(countryInfo.cases)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <InfoBox
              isGreen
              active={caseType === "recovered"}
              onClick={(e) => setCaseType("recovered")}
              title="Recovered"
              cases={prettyPrintStats(countryInfo.todayRecovered)}
              total={prettyPrintStats(countryInfo.recovered)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <InfoBox
              isRed
              active={caseType === "deaths"}
              onClick={(e) => setCaseType("deaths")}
              title="Deaths"
              cases={prettyPrintStats(countryInfo.todayDeaths)}
              total={prettyPrintStats(countryInfo.deaths)}
            />
          </Grid>
        </Grid>
        {/* map */}
        <Map
          countries={mapCountries}
          caseType={caseType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </Grid>

      <Grid item xs={12} md={4} className="app__right">
        <Card>
          <CardContent>
            <Typography variant="h6" className="app__right__title--1">
              Live cases by country
            </Typography>
            {/* table */}
            <Table countries={tableData} />
            <Typography variant="h6" className="app__right__title--2">
              Worldwide new {caseType}
            </Typography>
            {/* graph */}
            <LineGraph caseType={caseType} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default App;
