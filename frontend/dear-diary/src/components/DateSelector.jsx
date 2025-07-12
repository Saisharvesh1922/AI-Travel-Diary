import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import { MdDateRange, MdClose } from "react-icons/md";

const DateSelector = ({ date, setDate }) => {
  const [openDatePicker, setOpenDatePicker] = useState(false);

  useEffect(() => {
    if (!date) {
      setDate(new Date().getTime());
    }
  }, [date, setDate]);

  return (
    <div>
      <button
        onClick={() => setOpenDatePicker(true)}
        className="inline-flex items-center gap-2 bg-sky-200/40 hover:bg-sky-200/70 px-2 py-1 rounded text-primary"
      >
        <MdDateRange className="text-lg" />
        {date
          ? moment(date).format("Do MMM YYYY")
          : moment().format("Do MMM YYYY")}
      </button>

      {openDatePicker && (
        <div className="bg-sky-200/40 p-5 rounded-lg relative pt-9">
          <button onClick={() => setOpenDatePicker(false)}>
            <MdClose />
          </button>
          <DayPicker
            captionLayout="dropdown-buttons"
            mode="single"
            selected={date ? new Date(date) : undefined} // convert timestamp back to Date
            onSelect={(selected) => {
              if (selected) setDate(new Date(selected).getTime()); // store as timestamp
            }}
            pagedNavigation
          />
        </div>
      )}
    </div>
  );
};

export default DateSelector;
