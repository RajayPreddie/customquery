import _ from "lodash";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import {
  Accordion,
  Header,
  Icon,
  Label,
  Button,
  Menu,
  Message,
  Form,
  Grid,
  Table,
  Container,
  Segment,
  Input,
  Dropdown,
  Pagination,
} from "semantic-ui-react";
import {
  Calendar,
  restaurantIdOptions,
  times,
  compareTypes,
  tableHeaders /*, postData, getData, formatValues */,
} from "./Utility";
import React, { Component, useEffect, useState } from "react";
import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
} from "react-dates";
import "./react_dates_overrides.css";
import moment from "moment";
import { ReactDatez } from "react-datez";
import Accordians from "./components/Accordians.js";

const App = () => {
  // TODO: Bar plot

  // TODO: average number of transactions and average total sales
  // TODO: each bar of plot is an hour of day, e.g. 9 - 10 pm
  // TODO: for each business day and each restaurant -> compute total transaction amount and total amount of transactions for each hour of day
  // TODO: Calc average of hourly totals for each restaurant/business day
  // TODO: metric options
  // TODO: organize components
  // TODO: clean up the UI - pagination, table, background
  // TODO: fix times

  // setting up the bar plot
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  // Below are the variables used for storing user input for the restaurant operations data search

  // stores resaurant IDs from the user input
  const [restaurantIds, setRestaurantIds] = useState([]);

  // stores the start date and end date from the user input
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  // setting up parameters for the calendar
  const { startDate, endDate } = dateRange;
  const [focusedInput, setFocusedInput] = useState();

  // Transcation Time Options
  const [toHour, setToHour] = useState("5:00 am");
  const [fromHour, setFromHour] = useState("6:00 am");

  // Metric Options
  const [inputMetrics, setInputMetrics] = useState([
    {
      alias: "",
      number: 0,
      compareType: "",
    },
  ]);

  // stores the results of the users search
  const [results, setResults] = useState([]);

  // the current page of table data being used
  const [activePage, setActivePage] = useState(1);

  // the number of items on the table page
  const itemsPerPage = 10;

  // stores the average sales for each hour for each business day
  const [resultAvgs, setResultAvgs] = useState([]);

  // Accordian active page
  const [activeIndex, setActiveIndex] = useState({ activeIndex: 0 });

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex({ activeIndex: newIndex });
  };

  // create date range: good
  const makeDateRange = (startDate, endDate) => {
    return {
      startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    };
  };

  // adjust the from or to hour by 24 hours if between 0:00 and 5:00 in the morning
  const adjustHour = (hour) => {
    // convert string hours to integers
    const intHour = parseInt(moment(hour, "h:mm a").format("H"));

    // closing hour is when the restaurant closes
    // hours per day is used for shifting the morning hours before 5 am by 24 hours
    const closingHour = 5;
    const hoursPerDay = 24;
    const shiftedHour = intHour + hoursPerDay;
    return intHour <= closingHour ? shiftedHour : intHour;
  };

  // convert time to
  // create the range of hours: good
  const makeHourRange = (fromHour, toHour) => {
    // Transaction time range
    return {
      fromHour: adjustHour(fromHour),
      toHour: adjustHour(toHour),
    };
  };

  // create the metrics criteria
  const makeMetrics = (inputMetrics) => {
    return inputMetrics.map((inputMetric) => {
      return {
        metricCode: metricDefinitions
          .find((metric) => metric.alias === inputMetric.alias)
          .metricCode.toString(),
        compareType: compareTypes
          .find((comparison) => comparison.value === inputMetric.compareType)
          .comparetype.toString(),
        value:
          inputMetric.alias.indexOf("%") !== -1
            ? parseInt(inputMetric.number) / 100
            : parseInt(inputMetric.number),
      };
    });
  };

  async function postData(url = "", requestData) {
    // fetching from the provided url
    // retrieving metrics from provided url
    // no caching because it can cause issues
    // this is usually done asyncronously because
    // you can be taking a lot of data. Slow down processes
    // Async is great to do more things at once while waiting for a lot of data

    // return is an async object: your promised the response ( don't know what it is)
    const response = await fetch(url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // converts API response to a json format
    return response.json();
  }

  const onSubmit = () => {
    const hourRange = makeHourRange(fromHour, toHour);
    const dateRange = makeDateRange(startDate, endDate);

    const requestData = {
      // restaurandIDs input
      restaurantIds: restaurantIds,

      // Calendar range input
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
      // Transaction time range
      fromHour: hourRange.fromHour,
      toHour: hourRange.toHour,
      // Metrics
      metricCriteria: makeMetrics(inputMetrics),
    };

    postData(
      "https://customsearchquerytoolapi.azurewebsites.net/Search/Query",
      requestData
    )
      .then((data) => {
        setResults(data);
        calcAvg(data);
      })
      .catch((err) => console.log("Error"));
  };

  // set the date ranges onDatesChange
  const onDatesChange = (startDate, endDate) => {
    setDateRange({ startDate: startDate, endDate: endDate });
  };
  // set the focused input onFocusChange
  const onFocusChange = (focusedInput) => {
    setFocusedInput(focusedInput);
  };

  const [metricDefinitions, setMetricDefinitions] = useState([]);

  metricDefinitions.map((m, index) => {
    return {
      key: index,
      text: m.alias, // what user sees
      value: m.metricCode,
    };
  });

  // use keyword async
  async function getData(url = "") {
    // fetching from the provided url
    // retrieving metrics from provided url
    // no caching because it can cause issues
    // this is usually done asyncronously because
    // you can be taking a lot of data. Slow down processes
    // Async is great to do more things at once while waiting for a lot of data

    // return is an async object: your promised the response ( don't know what it is)
    const response = await fetch(url, {
      method: "GET",
      cache: "no-cache",
    });
    // converts API response to a json format
    return response.json();
  }
  // use this as a hook for fetching
  useEffect(() => {
    // call async function here
    getData(
      "https://customsearchquerytoolapi.azurewebsites.net/Search/MetricDefinitions"
    )
      .then((data) => {
        setMetricDefinitions(data); // this is asynchronous
        // having console here, must wait for data
      })
      .catch((err) => {
        console.log("Error");
      }); //.finally is another thing to do after catching

    // this is a dependency
    // this is trick, to trigger useEffect once when page loads.
  }, []);

  const addMetric = () => {
    const maxNumMetrics = 5;
    // add a metric if there is space left.
    if (inputMetrics.length <= maxNumMetrics) {
      const newInputMetrics = [
        ...inputMetrics,
        {
          alias: "",
          number: 0,
          compareType: "",
        },
      ];
      setInputMetrics(newInputMetrics);
    }
  };
  const setMetric = (dataValue, index, property) => {
    const newInputMetrics = [];

    for (let i = 0; i < inputMetrics.length; i++) {
      newInputMetrics.push(inputMetrics[i]);
    }
    newInputMetrics[index][property] = dataValue;
    setInputMetrics(newInputMetrics);
  };

  const deleteMetric = (index) => {
    if (inputMetrics.length > 1) {
      setInputMetrics(inputMetrics.filter((metric, i) => i !== index));
    }
    console.log(inputMetrics);
  };
  /**
   * @brief
   */
  const changePage = (data) => {
    setActivePage(data.activePage);
  };

  // console.log(inputMetrics);

  // BAR PLOT
  // labels: use dates for the labels
  // create time range: if 6 am to 5 am, 23 separate hour increments. Make method to calc difference
  // For nowing what time range a thing is in: just use the first number and am/pm
  // ex- every time between 5 and 6 will start with 5
  // for 6 am to 5 am, map through every each one, getting totals for each hour
  // divide each total by length of results.
  // store the averages for each hour in a key value object.
  // if a certain key is not there, just add it into the object with a 0 initial value.

  // have an object that holds total transactions and total sales for each hour

  // calculating the average:
  // divide by the number of days
  // for 5 pm to 6 pm, get the total transactions for that, divide by number of days

  const findNumDays = (startDate, endDate) => {
    // bar plot will show a particular business day "YYYY-MM-DDTHH:mm:ss.SSSZ"
    /*     console.log(fromHour)
    const tempStartDate = moment(startDate).format("YYYY-MM-DD") + "T" + moment(fromHour,"hh:mm a").format("HH:mm:ss.SSSZ")
    const tempEndDate = moment(endDate).format("YYYY-MM-DD") + "T" + moment(toHour,"hh:mm a").format("HH:mm:ss.SSSZ")
    console.log(tempStartDate)
    const start = moment(tempStartDate); //todays date
    const end = moment(tempEndDate); // another date */
    const start = moment(startDate);
    const end = moment(endDate);
    const duration = moment.duration(end.diff(start));
    const days = duration.asDays() + 1;
    // console.log(days);

    return days;
  };
  /**
   * @brief For each business day and restaurant, calculate the averge sales
   *  and number of transactions for each hour
   */
  const calcAvg = (results) => {
    // storing the number of days between start and end date
    const numDays = findNumDays(startDate, endDate);

    // data structure to store the averages.
    const newResultAvgs = [];

    // look at each transaction and calculate the average sales and number of transactions
    // for each day and each hour
    results.map((result) => {
      // get the transactions order time
      const time = moment(result["orderTime"]).format("h:00 a");
      // find the average number of transactions and sales for each time
      if (time in newResultAvgs) {
        newResultAvgs[time.toString()].avgNumTransactions +=
          1 / (restaurantIds.length * numDays);
        newResultAvgs[time.toString()].avgSales +=
          result.totalAmount / (restaurantIds.length * numDays);
      } else {
        newResultAvgs[time.toString()] = {
          avgNumTransactions: 1 / (restaurantIds.length * numDays),
          avgSales: result.totalAmount / (restaurantIds.length * numDays),
        };
      }
    });

    // update the resulting averages
    setResultAvgs(newResultAvgs);
  };

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  // export from Utility
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Restaurant Statistics",
      },
    },
  };

  const labels = times.map((time) => time.text);
  const data = {
    labels,
    datasets: [
      {
        label: "Average Number of Transactions",
        data: labels.map((label) => {
          if (Object.keys(resultAvgs).length > 0 && label in resultAvgs) {
            return Number(Math.floor(resultAvgs[label].avgNumTransactions));
          } else {
            return 0;
          }
        }),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Average Total Sales($)",
        data: labels.map((label) => {
          if (Object.keys(resultAvgs).length > 0 && label in resultAvgs) {
            return Number(Math.round(resultAvgs[label].avgSales * 100) / 100).toFixed(2);
          } else {
            return 0;
          }
        }),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="App">
      <Grid padded>
        <Grid.Row>
          <Grid.Column>
            <Container>
            
              <Segment padded>
              <Header as="h1" >
                  {" "}
                  Custom Query Search Tool
                </Header>
              
              
               
                <Form onSubmit={(e, data) => onSubmit()} size = "medium">
                  {'                        '}
                  <Form.Field>
                    <Dropdown
                      placeholder="Restaurant IDs"
                      options={restaurantIdOptions}
                      multiple
                      selection
                      value={restaurantIds}
                      onChange={(event, data) => setRestaurantIds(data.value)}
                    />
                  </Form.Field>

                  <Form.Field>
                    <DateRangePicker
                      isOutsideRange={() => false}
                      startDate={startDate}
                      startDateId="your_unique_start_date_id"
                      endDate={endDate}
                      endDateId="your_unique_end_date_id"
                      onDatesChange={({ startDate, endDate }) =>
                        onDatesChange(startDate, endDate)
                      }
                      focusedInput={focusedInput}
                      onFocusChange={(focusedInput) =>
                        onFocusChange(focusedInput)
                      }
                    />

                    <Icon name="calendar" size="large" />
                    {"       "}
                    <Label> Transactions From </Label>
                    <Dropdown
                      scrolling
                      options={times}
                      value={fromHour.toString()}
                      onChange={(e, data) => setFromHour(data.value)}
                    />
                    <Label> To </Label>
                    <Dropdown
                      scrolling
                      options={times}
                      value={toHour.toString()}
                      onChange={(e, data) => setToHour(data.value)}
                    />
                  </Form.Field>

                  {
                    //consider cleaning up

                    inputMetrics.map((metric, index) => {
                      return (
                        <Form.Group key={index} widths="equal">
                          {inputMetrics.length > 1 ? (
                            <Button
                              color="red"
                              type="button"
                              onClick={() => deleteMetric(index)}
                            >
                              <Icon name="delete" />{" "}
                            </Button>
                          ) : null}
                          <div className="ui fluid selection dropdown">
                            <Form.Field>
                              <Dropdown
                                fluid
                                placeholder="Metrics"
                                value={inputMetrics[index]["alias"]}
                                options={metricDefinitions.map(
                                  (metricDef, i) => {
                                    return {
                                      key: i,
                                      text: metricDef.alias,
                                      value: metricDef.alias,
                                    };
                                  }
                                )}
                                onChange={(e, data) =>
                                  setMetric(data.value, index, "alias")
                                }
                              />
                            </Form.Field>
                            {"  "}
                          </div>

                          <div className="ui fluid selection dropdown">
                            <Form.Field>
                              <Dropdown
                                fluid
                                placeholder={"Compare Type"}
                                options={compareTypes}
                                value={inputMetrics[index]["c"]}
                                onChange={(e, data) => {
                                  setMetric(data.value, index, "compareType");
                                }}
                              />
                            </Form.Field>
                          </div>
                          <Form.Field>
                            <Input
                              fluid
                              placeholder={
                                metric.alias.indexOf("$") !== -1
                                  ? "$0.00"
                                  : metric.alias.toString().indexOf("%") !== -1
                                  ? "%"
                                  : "Quantity"
                              }
                              value={inputMetrics[index]["number"]}
                              onChange={(e, data) => {
                                setMetric(data.value, index, "number");
                              }}
                            />
                          </Form.Field>
                        </Form.Group>
                      );
                    })
                  }
                  {
                    // make function for checking if max metrics reached
                    inputMetrics.length < 5 ? (
                      <Button
                        color="green"
                        type="button"
                        onClick={() => addMetric()}
                      >
                        <Icon name="plus" /> Add Metric
                      </Button>
                    ) : null
                  }
                  <Form.Field>
                    <Form.Field></Form.Field>
                    <Button color="blue" type="submit">
                      {" "}
                      Submit{" "}
                    </Button>
                  </Form.Field>
                </Form>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Container>
        <Accordians
          plotOptions={options}
          plotData={data}
          results={results}
          tableHeaders={tableHeaders}
          activePage={activePage}
          onPageChange={changePage}
          itemsPerPage={itemsPerPage}
        />
      </Container>
    </div>
  );
};

export default App;
