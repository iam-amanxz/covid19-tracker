import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { Box } from "@material-ui/core";
import "./Map.css";
import { showDataOnMap } from "./util";

function Map({ countries, caseType, center, zoom }) {
  return (
    <Box mt={2} className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, caseType)}
      </LeafletMap>
    </Box>
  );
}

export default Map;
