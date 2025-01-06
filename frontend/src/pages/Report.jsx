import Heading from "../components/Heading";
import ReactDatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

// eslint-disable-next-line react/prop-types
export default function Report({ title, track }) {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="xl:max-w-[50%] max-xl:mx-auto w-full bg-white dark:bg-gray-800 my-5">
        <div className="p-4 flex items-center justify-between">
          
          <ReactDatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full 2xl:w-[20vw] px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF6500]"
            placeholderText="Select a date"
          />
          <button
  className="bg-[#FF6500] text-white px-4 py-2 rounded-full transition duration-200 ease-in-out hover:bg-orange-600 active:bg-[#FF6500] focus:outline-none"
>
  Generate Report
</button>

        </div>
      </div>
    </div>
  );
}
