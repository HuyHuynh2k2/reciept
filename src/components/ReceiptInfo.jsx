export default function ReceiptInfo({ receipt }) {
  if (!receipt) return <p>No receipt yet</p>;

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
    return `${months[month]}, ${day} ${year}`;
  };

  return (
    <div className="receipt-render-container">
      <div className="receipt-header">
        <i className="fa-solid fa-basket-shopping"></i>
        <p className="receipt-store">{receipt.receiptStore}</p>
        <p className="receipt-date">{formatDate(receipt.receiptDate)}</p>
      </div>
      <div className="receipt-body">
        <div className="receipt-body-payment">
          <p>Payment Method:</p>
          <p>{receipt.receiptPaymentMethod}</p>
          <p>Category:</p>
          <p>{receipt.receiptCategory}</p>
          <p>Tax:</p>
          <p>${receipt.receiptTax.toFixed(2)}</p>
          <p>Total:</p>
          <p>${receipt.receiptTotal.toFixed(2)}</p>
        </div>
        <div className="receipt-body-items">
          {receipt.receiptItems.map((item, index) => (
            <div key={index} className="receipt-item-row">
              <p>
                {item.description} x{item.quantity || 1}{" "}
                {/* Fallback to 1 if quantity is missing */}
              </p>
              <p>${item.amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
