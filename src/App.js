import _ from "lodash";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import {
  Icon,
  Label,
  Button,
  Form,
  Grid,
  Container,
  Segment,
  Input,
  Dropdown,
} from "semantic-ui-react";
import {
  Calendar,
  restaurantIdOptions,
  transactionTimeOptions,
  compareTypes /*, postData, getData, formatValues */,
} from "./Utility";
import React, { Component, useEffect, useState } from "react";
import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
} from "react-dates";
import moment from "moment";
import { ReactDatez } from "react-datez";

const App = () => {
  // TODO: style -  only one component per file.

  // Components:
  // TODO: At meeting: better options for the calendar.
  // TODO: make requests to API (Application Programming Interface - connection between computers or computer programs)
  // Restaurand IDs

  // PROPS: addRestaurant,

  const [restaurantIds, setRestaurantIds] = useState([]);

  // Calendar

  const [dateInput, setDateInput] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const { startDate, endDate } = dateRange;
  const [focusedInput, setFocusedInput] = useState();

  // creates times in am/pm
  const dates = transactionTimeOptions.map((transactionTime) => {
    const dateTemp = moment(transactionTime.text, "HH:mm").format("hh:mm a");
    const dateString =
      dateTemp.substring(0, 1) === "0" ? dateTemp.substring(1) : dateTemp;
    return {
      key: transactionTime.key,
      text: dateString,
      value: dateString,
    };
  });

  // Transcation Time Options

  const [toHour, setToHour] = useState("5:00 am");
  const [fromHour, setFromHour] = useState("6:00 am");

  // Metric Options
  const [inputMetrics, setInputMetrics] = useState([
    {
      key: 0,
      alias: "",
      number: 0,
      compareType: "",
    },
  ]);

  const [equality, setEquality] = useState("=");

  // Numerical value: two types, decimal and whole number: 2 decimals or 0
  const [number, setNumber] = useState(0);

  // create date range
  const makeDateRange = () => {
    return {
      startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
      endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
    };
  };

  // create the range of hours
  const makeHourRange = () => {
    // convert string hours to integers
    const fromHourInt = parseInt(moment(fromHour, "h:mm a").format("H"));
    const toHourInt = parseInt(moment(toHour, "h:mm a").format("H"));

    // 5:00 is when the restaurant shifts end
    const endShift = 5;
    // shift the hours between 0:00 and 5:00 by 24 hours
    const hoursInDay = 24;

    // Transaction time range
    return {
      fromHour:
        fromHour.indexOf("am") !== -1 && fromHourInt <= endShift
          ? fromHourInt + hoursInDay
          : fromHourInt,
      toHour:
        toHour.indexOf("am") !== -1 && toHourInt <= endShift
          ? toHourInt + hoursInDay
          : toHourInt,
    };
  };

  // create the metrics criteria
  const makeMetrics = () => {
    return [
      {
        metricCode: metricDefinitions
          .find((metric) => metric.alias === inputMetrics.alias)
          .metricCode.toString(),
        compareType: compareTypes
          .find((comparison) => comparison.value === equality)
          .comparetype.toString(),
        value: parseInt(number),
      },
    ];
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
    const hourRange = makeHourRange();
    const dateRange = makeDateRange();

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
      metricCriteria: makeMetrics(),
    };

    console.log("Before:", requestData);

    postData(
      "https://customsearchquerytoolapi.azurewebsites.net/Search/Query",
      requestData
    )
      .then((response) => console.log(response))
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

  const [metricCriteria, setMetricCriteria] = useState([{}]);

  const [metricDefinitions, setMetricDefinitions] = useState([]);

  const [searchTest, setSearchTest] = useState([]);

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

  // Table columns:
  // RestaurantId, BusDt, OrderNumber, OrderTime,
  // TransactionTotalAmount, TransactionNetAmount, ItemSoldQty
  // BeverageQty, DiscountAmount, ItemDeletedAmount,
  // DiscountRatio, RefundAmount

  const addMetric = () => {
    if (inputMetrics.length <= 5) {
      const newMetric = {
        key: inputMetrics.length,
        alias: "",
        compareType: "",
        number: 0,
      };
      setInputMetrics([...inputMetrics, newMetric]);
    } else {
      alert("No more metrics");
    }
  };

  const deleteMetric = (metricId) => {
    if (inputMetrics.length > 1) {
      setInputMetrics(inputMetrics.filter((metric) => metric.id !== metricId))
    }
  }

  return (
    <div className="App">
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Container>
              <Segment>
                <Form onSubmit={(e, data) => onSubmit()}>
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
                      startDate={startDate} // momentPropTypes.momentObj or null,
                      startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
                      endDate={endDate} // momentPropTypes.momentObj or null,
                      endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
                      onDatesChange={({ startDate, endDate }) =>
                        onDatesChange(startDate, endDate)
                      } // PropTypes.func.isRequired,
                      focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                      onFocusChange={(focusedInput) =>
                        onFocusChange(focusedInput)
                      } // PropTypes.func.isRequired,
                    />
                    {"       "}
                    <Label> Transactions From </Label>
                    <Dropdown
                      scrolling
                      options={dates}
                      defaultValue={fromHour.toString()}
                      onChange={(e, data) => setFromHour(data.value)}
                    />
                    <Label> To </Label>
                    <Dropdown
                      scrolling
                      options={dates}
                      defaultValue={toHour.toString()}
                      onChange={(e, data) => setToHour(data.value)}
                    />
                  </Form.Field>
                  <Button type="button" onClick={(e, data) => addMetric()}>
                    <Icon name="plus" /> Add Metric
                  </Button>
                  {inputMetrics.map((metric) => (
                    <Form.Group>
                      <Form.Field>
                        <Dropdown
                          placeholder="Metrics"
                          options={metricDefinitions.map((metric, index) => {
                            return {
                              key: index,
                              text: metric.alias,
                              value: metric.alias,
                            };
                          })}
                          defaultValue={metric.alias}
                          onChange={(e, data) =>
                            setInputMetrics([
                              ...inputMetrics,
                              metric.alias = data.value,
                            ])
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <Dropdown
                          placeholder={"="}
                          options={compareTypes}
                          value={metric.compareType}
                          onChange={(e, data) =>
                            setInputMetrics([
                              ...inputMetrics,
                              metric.compareType = data.value
                            ])
                          }
                        />
                      </Form.Field>
                      <Form.Field>
                        <Input
                          placeholder={
                            metric.alias.indexOf("$") !== -1
                              ? "$0.00"
                              : metric.alias
                                  .toString()
                                  .indexOf("%") !== -1
                              ? "%"
                              : "Quantity"
                          }
                          value={metric.number}
                          onChange={(e, data) =>
                            setInputMetrics([
                              ...inputMetrics,
                              metric.number = data.value,
                            ])
                          }
                        />
                      </Form.Field>

                      <Button type = "button" onClick={deleteMetric(metric.key)}>
                        <Icon name="minus" />{" "}
                      </Button>
                    </Form.Group>
                  ))}

                  <Form.Field>
                    <Form.Field></Form.Field>
                    <Button type="submit"> Submit </Button>
                  </Form.Field>
                  <Form.Field>
                    <Button
                      type="button"
                      onClick={(event, data) => {
                        setMetricCriteria(); // array rerenders every time we add something
                      }}
                    >
                      Add Criteria
                    </Button>
                  </Form.Field>

                  <Form.Field>
                    <Button>Delete Criteria option</Button>
                  </Form.Field>
                </Form>
              </Segment>
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default App;
