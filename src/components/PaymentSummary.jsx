import { useState } from "react";

export default function PaymentSummary({ setPaymentSummary }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentSummary(month, year);
  };

  return (
    <div className="payment-summary">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="month">Month:</label>
          <input
            type="text"
            id="month"
            name="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="year">Year:</label>
          <input
            type="text"
            id="year"
            name="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
