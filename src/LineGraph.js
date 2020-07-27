import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltip: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tootltipItem, data) {
        return numeral(tootltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "l",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ caseType }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const chartData = buildChartData(data, caseType);
          setData(chartData);
        });
    };

    fetchData();
  }, [caseType]);

  const buildChartData = (data, cases = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[cases][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[cases][date];
    }
    return chartData;
  };

  return (
    <Box className="graph">
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                data: data,
                backgroundColor: "rgba(255, 0, 0, 0.75)",
                borderColor: "rgb(255, 0, 0)",
              },
            ],
          }}
          options={options}
        ></Line>
      )}
    </Box>
  );
}

export default LineGraph;
