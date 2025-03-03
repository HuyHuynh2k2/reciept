import { useEffect, useState } from "react";

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function DataCollect({ userId, onReceiptGenerated }) {
  const [items, setItems] = useState([
    { itemId: uid(), itemName: "", itemQuantity: 1, itemPrice: 0 },
  ]);
  const [store, setStore] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [tax, setTax] = useState("0");
  const [errors, setErrors] = useState({});

  const addItem = () => {
    setItems([
      ...items,
      { itemId: uid(), itemName: "", itemQuantity: 1, itemPrice: 0 },
    ]);
  };

  const deleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.itemId !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.itemId === id
          ? {
              ...item,
              [field]: field === "itemName" ? value : parseFloat(value) || 0,
            }
          : item
      )
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!store.trim()) newErrors.store = "Store name is required";
    if (!date) newErrors.date = "Date is required";
    if (!paymentMethod || paymentMethod === "empty")
      newErrors.paymentMethod = "Payment method is required";
    if (!category || category === "empty")
      newErrors.category = "Category is required";

    const itemErrors = items.map((item) => {
      const itemError = {};
      if (!item.itemName.trim()) itemError.name = "Item name is required";
      if (item.itemQuantity <= 0)
        itemError.quantity = "Quantity must be greater than 0";
      if (item.itemPrice <= 0) itemError.price = "Price must be greater than 0";
      return itemError;
    });

    if (itemErrors.some((error) => Object.keys(error).length > 0)) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRenderReceipt = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalAmount =
      items.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0) +
      (parseFloat(tax) || 0);

    const receiptData = {
      userId,
      totalAmount,
      taxAmount: parseFloat(tax) || 0,
      merchantName: store,
      categoryName: category,
      receiptDate: date,
      paymentMethod,
      items: items.map((item) => ({
        description: item.itemName,
        amount: item.itemPrice * item.itemQuantity,
        quantity: item.itemQuantity,
      })),
    };

    try {
      const res = await fetch("http://localhost:3001/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(receiptData),
      });
      const savedReceipt = await res.json();
      if (res.ok) {
        onReceiptGenerated(savedReceipt);
      } else {
        setErrors({
          api: savedReceipt.message || `HTTP error! Status: ${res.status}`,
        });
      }
    } catch (err) {
      setErrors({ api: `Network error: ${err.message}` });
    }
  };

  return (
    <form>
      <div>
        <p>Store Name:</p>
        <input
          onChange={(e) => setStore(e.target.value)}
          type="text"
          value={store}
          placeholder="Enter store name (e.g., Safeway)"
        />
        {errors.store && <p className="error">{errors.store}</p>}
      </div>
      <div>
        <p>Date:</p>
        <input
          onChange={(e) => setDate(e.target.value)}
          type="date"
          value={date}
        />
        {errors.date && <p className="error">{errors.date}</p>}
      </div>
      <div>
        <p>Payment Method:</p>
        <select
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          <option value="empty">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="credit-card">Credit Card</option>
          <option value="debit-card">Debit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        {errors.paymentMethod && (
          <p className="error">{errors.paymentMethod}</p>
        )}
      </div>
      <div>
        <p>Category:</p>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="empty">Select Category</option>
          <option value="groceries">Groceries</option>
          <option value="entertainment">Entertainment</option>
          <option value="dining">Dining</option>
          <option value="utilities">Utilities</option>
        </select>
        {errors.category && <p className="error">{errors.category}</p>}
      </div>
      <div>
        <p>Tax:</p>
        <input
          type="number"
          step="0.01"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
        />
        {errors.tax && <p className="error">{errors.tax}</p>}
      </div>

      {items.map((item, index) => (
        <div key={item.itemId} className="form-items">
          <h3>Item {index + 1}</h3>
          <div>
            <p>Item Name:</p>
            <input
              onChange={(e) =>
                handleItemChange(item.itemId, "itemName", e.target.value)
              }
              type="text"
              placeholder="Enter item (e.g., Oranges)"
              value={item.itemName}
            />
            {errors.items?.[index]?.name && (
              <p className="error">{errors.items[index].name}</p>
            )}
          </div>
          <div>
            <p>Quantity:</p>
            <input
              onChange={(e) =>
                handleItemChange(item.itemId, "itemQuantity", e.target.value)
              }
              type="number"
              placeholder="Quantity"
              value={item.itemQuantity}
            />
            {errors.items?.[index]?.quantity && (
              <p className="error">{errors.items[index].quantity}</p>
            )}
          </div>
          <div>
            <p>Price:</p>
            <input
              onChange={(e) =>
                handleItemChange(item.itemId, "itemPrice", e.target.value)
              }
              type="number"
              placeholder="Price"
              step="0.01"
              value={item.itemPrice}
            />
            {errors.items?.[index]?.price && (
              <p className="error">{errors.items[index].price}</p>
            )}
          </div>
          <button type="button" onClick={() => deleteItem(item.itemId)}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
      ))}

      <button type="button" onClick={addItem}>
        <i className="fa-solid fa-plus"></i>
      </button>
      <button type="button" onClick={handleRenderReceipt}>
        Generate Receipt
      </button>
      {errors.api && <p className="error">{errors.api}</p>}
    </form>
  );
}
