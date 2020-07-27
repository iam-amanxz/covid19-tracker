import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";
import { Box } from "@material-ui/core";
import "./Map.css";

const caseTypeColors = {
  cases: {
    hex: "#FFA800",
    multiplier: 800,
  },
  recovered: {
    hex: "#00FF47",
    multiplier: 1200,
  },
  deaths: {
    hex: "#FF0000",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));

  return sortedData;
};

export const showDataOnMap = (data, caseType = "cases") =>
  data.map((country) => (
    <Circle
      key={country.population}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={caseTypeColors[caseType].hex}
      fillColor={caseTypeColors[caseType].hex}
      radius={
        Math.sqrt(country[caseType]) * caseTypeColors[caseType].multiplier
      }
    >
      <Popup>
        <Box>
          <Box
            className="popup__flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <Box className="popup__country">{country.country}</Box>
          <Box className="popup__cases">
            <strong> Cases:</strong> {numeral(country.cases).format("0,0")}
          </Box>
          <Box className="popup__recovered">
            <strong>Recovered: </strong>
            {numeral(country.recovered).format("0,0")}
          </Box>
          <Box className="popup__deaths">
            <strong> Deaths:</strong> {numeral(country.deaths).format("0,0")}
          </Box>
        </Box>
      </Popup>
    </Circle>
  ));

export const prettyPrintStats = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
