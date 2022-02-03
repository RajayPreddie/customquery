import React, { Component } from "react";
import {
  DateRangePicker,
  SingleDatePicker,
  DayPickerRangeController,
} from "react-dates";

export const restaurantIdOptions = [
  {
    key: 1,
    text: "Restaurant 1",
    value: 1,
  },

  {
    key: 2,
    text: "Restaurant 2",
    value: 2,
  },
  {
    key: 3,
    text: "Restaurant 3",
    value: 3,
  },
  {
    key: 4,
    text: "Restaurant 4",
    value: 4,
  },
  {
    key: 5,
    text: "Restaurant 5",
    value: 5,
  },
  {
    key: 6,
    text: "Restaurant 6",
    value: 6,
  },
  {
    key: 7,
    text: "Restaurant 7",
    value: 7,
  },
  {
    key: 8,
    text: "Restaurant 8",
    value: 8,
  },
  {
    key: 9,
    text: "Restaurant 9",
    value: 9,
  },
  {
    key: 10,
    text: "Restaurant 10",
    value: 10,
  },
];

export const transactionTimeOptions = [
  {
    key: 0,
    text: "6:00",
    value: 6,
  },
  {
    key: 1,
    text: "7:00",
    value: 7,
  },
  {
    key: 2,
    text: "8:00",
    value: 8,
  },
  {
    key: 3,
    text: "9:00",
    value: 9,
  },
  {
    key: 4,
    text: "10:00",
    value: 10,
  },
  {
    key: 5,
    text: "11:00",
    value: 11,
  },
  {
    key: 6,
    text: "12:00",
    value: 12,
  },
  {
    key: 7,
    text: "13:00",
    value: 13,
  },
  {
    key: 8,
    text: "14:00",
    value: 14,
  },
  {
    key: 9,
    text: "15:00",
    value: 15,
  },
  {
    key: 10,
    text: "16:00",
    value: 16,
  },
  {
    key: 11,
    text: "17:00",
    value: 17,
  },

  {
    key: 12,
    text: "18:00",
    value: 18,
  },
  {
    key: 13,
    text: "19:00",
    value: 19,
  },
  {
    key: 14,
    text: "20:00",
    value: 20,
  },
  {
    key: 15,
    text: "21:00",
    value: 21,
  },
  {
    key: 16,
    text: "22:00",
    value: 22,
  },
  {
    key: 17,
    text: "23:00",
    value: 23,
  },
  {
    key: 18,
    text: "0:00",
    value: 24,
  },
  {
    key: 19,
    text: "1:00",
    value: 25,
  },
  {
    key: 20,
    text: "2:00",
    value: 26,
  },
  {
    key: 21,
    text: "3:00",
    value: 27,
  },
  {
    key: 22,
    text: "4:00",
    value: 28,
  },
  {
    key: 23,
    text: "5:00",
    value: 29,
  },
];

export const compareTypes = [
  {
    key: 0,
    text: "<=",
    comparetype: "LessThanOrEqual",
    value: "<=",
    
  },
  {
    key: 1,
    text: "<",
    comparetype: "LessThan",
    value: "<",
    
  },
  {
    key: 2,
    text: "=",
    comparetype: "Equal",
    value: "=",
    
  },
  {
    key: 3,
    text: ">",
    comparetype: "GreaterThan",
    value: ">",
    
  },
  {
    key: 4,
    text: ">=",
    comparetype: "GreaterThanOrEqual",
    value: ">=",
  }
];


export class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null,
    };
  }

  render() {
    return (
      <div>
        <DateRangePicker
          startDate={this.state.startDate} // momentPropTypes.momentObj or null,
          startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
          endDate={this.state.endDate} // momentPropTypes.momentObj or null,
          endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
          onDatesChange={({ startDate, endDate }) =>
            this.setState({ startDate, endDate })
          } // PropTypes.func.isRequired,
          focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={(focusedInput) => this.setState({ focusedInput })} // PropTypes.func.isRequired,
        />
      </div>
    );
  }
}
