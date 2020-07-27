import React from "react";
import { Card, CardContent, Typography, Box } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({
  isRed,
  isOrange,
  isGreen,
  active,
  title,
  cases,
  total,
  ...props
}) {
  return (
    <Card
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      } ${isOrange && "infoBox--orange"} ${isGreen && "infoBox--green"}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography
          align="center"
          className="infoBox__title"
          color="textSecondary"
        >
          {title}
        </Typography>

        <Box my={1}>
          <h2 align="center" className="infoBox__cases">
            {cases}
          </h2>
        </Box>

        <Typography
          align="center"
          className="infoBox__total"
          color="textSecondary"
        >
          {total} total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
