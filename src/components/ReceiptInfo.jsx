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

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      {/* Store Name */}
      <h2 className="text-xl font-bold text-center mb-4">
        {mockData.receiptStore}
      </h2>

      {/* Receipt Details */}
      <div className="text-sm text-gray-700 space-y-2">
        <p>
          📅 <strong>Date:</strong> {mockData.receiptDate}
        </p>
        <p>
          💳 <strong>Payment Method:</strong> {mockData.receiptPaymentMethod}
        </p>
        <p>
          📂 <strong>Category:</strong> {mockData.receiptCategory}
        </p>
      </div>

      {/* Items Table */}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1 text-left">Item</th>
            <th className="border border-gray-300 px-2 py-1">Qty</th>
            <th className="border border-gray-300 px-2 py-1">Price</th>
            <th className="border border-gray-300 px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {mockData.receiptItems.length > 0 ? (
            mockData.receiptItems.map((item, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 px-2 py-1">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  ${item.price.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-2">
                No items
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Grand Total */}
      <div className="text-right text-lg font-bold mt-4">
        🧾 Grand Total: $
        {mockData.receiptItems
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
      </div>
    </div>
  );
}
