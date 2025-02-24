import { useEffect } from "react";

export default function ReceiptInfo() {
  // Mock data for testing
  const mockData = {
    receiptStore: "SuperMart",
    receiptDate: "2025-02-15",
    receiptPaymentMethod: "Credit Card",
    receiptCategory: "Groceries",
    receiptItems: [
      { name: "Milk", quantity: 2, price: 3.5 },
      { name: "Bread", quantity: 1, price: 2.0 },
      { name: "Eggs", quantity: 1, price: 5.0 },
    ],
  };

  const date = {
    month: "",
    day: 0,
    year: 0,
  };

  const formatDate = (dateString) => {
    const parts = dateString.split("-");

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    date.month = months[month];
    date.day = day;
    date.year = year;
  };

  return (
    <div className="receipt-render-container">
      <div className="receipt-header">
        <i className="fa-solid fa-basket-shopping"></i>
        <p className="reciept-store">{mockData.receiptStore}</p>
        {formatDate(mockData.receiptDate)}
        <p className="receipt-date">
          {date.month}, {date.day} {date.year}
        </p>
      </div>
      <div className="receipt-body">
        <div className="receipt-body-payment">
          <p>Payement Method:</p>
          <p>{mockData.receiptPaymentMethod}</p>
          <p>Category:</p>
          <p>{mockData.receiptCategory}</p>
        </div>
        <div className="receipt-body-items">
          {mockData.receiptItems.map((item, itemId) => {
            return (
              <div key={itemId} className="receipt-item-row">
                <p>
                  {item.name} x{item.quantity}
                </p>
                <p>${item.price.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
