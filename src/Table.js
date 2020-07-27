import React from "react";
import numeral from "numeral";
import "./Table.css";
import { Box } from "@material-ui/core";

function Table({ countries }) {
  return (
    <Box className="table">
      <table>
        <tbody>
          {countries.map(({ country, cases }) => (
            <tr key={country}>
              <td>{country}</td>
              <td>{numeral(cases).format("0,0")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}

export default Table;
