export default function ReceiptInfo({ receipt }) {
  if (!receipt) return <p className="receipt-status">No receipt yet</p>;

  const formatDate = (dateString) => {
    if (!dateString || typeof dateString !== "string") return "Invalid Date";
    const parts = dateString.split("-");
    if (parts.length !== 3) return "Invalid Date";
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
          <p>${receipt.receiptTax ? receipt.receiptTax.toFixed(2) : "0.00"}</p>
          <p>Total:</p>
          <p>
            ${receipt.receiptTotal ? receipt.receiptTotal.toFixed(2) : "0.00"}
          </p>
        </div>
        <div className="receipt-body-items">
          {receipt.receiptItems && Array.isArray(receipt.receiptItems) ? (
            receipt.receiptItems.map((item, index) => (
              <div key={index} className="receipt-item-row">
                <p>
                  {item.description} x{item.quantity || 1}
                </p>
                <p>${item.amount ? item.amount.toFixed(2) : "0.00"}</p>
              </div>
            ))
          ) : (
            <p>No items available</p>
          )}
        </div>
      </div>
    </div>
  );
}
