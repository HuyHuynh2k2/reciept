import { useEffect, useState } from "react";

const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default function DataCollect() {
  const [items, setItems] = useState([
    { itemId: uid(), itemName: "", itemQuantity: 0, itemPrice: 0 },
  ]);

  const [store, setStore] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [category, setCategory] = useState("");
  const [reciept, setReciept] = useState({
    recieptStore: "",
    recieptDate: "",
    recieptPaymentMethod: "",
    recieptCategory: "",
    recieptItems: [],
  });
  const [errors, setErrors] = useState({});

  // const [receiptList, setRecepitList] = useState([]);

  const addItem = () => {
    setItems([...items, { itemId: uid(), itemName: "", itemPrice: 0 }]);
  };

  const deleteItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.itemId !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.itemId === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRenderReceipt = (e) => {
    e.preventDefault();

    // Validate form before proceeding
    if (!validateForm()) {
      return; // Do not proceed if the form is invalid
    }

    // Set the receipt data
    setReciept({
      recieptStore: store,
      recieptDate: date,
      recieptPaymentMethod: paymentMethod,
      recieptCategory: category,
      recieptItems: items,
    });

    /*
    // Get existing receipts from localStorage, or initialize with an empty array if no data exists
    const savedReceipts = JSON.parse(localStorage.getItem("receipts") || "[]");

    // Add the new receipt to the array of saved receipts
    const updatedReceipts = [
      ...savedReceipts,
      {
        recieptStore: store,
        recieptDate: date,
        recieptPaymentMethod: paymentMethod,
        recieptCategory: category,
        recieptItems: items,
      },
    ];

    // Save the updated array of receipts to localStorage
    localStorage.setItem("receipts", JSON.stringify(updatedReceipts));

    // Optionally, log it to see the change in the console
    console.log("Receipts saved to localStorage:", updatedReceipts);
    */
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

  useEffect(() => console.log(reciept), [reciept]);

  return (
    <>
      <form>
        <div>
          <p>Store Name: </p>
          <input
            onChange={(e) => setStore(e.target.value)}
            type="text"
            value={store}
            placeholder="Enter store name (e.g., Safeway)"
          />
          {errors.store && <p className="error">{errors.store}</p>}
        </div>

        <div>
          <p>Date: </p>
          <input
            onChange={(e) => setDate(e.target.value)}
            type="date"
            value={date}
          />
          {errors.date && <p className="error">{errors.date}</p>}
        </div>

        <div>
          <p>Payment Method: </p>
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
          <p>Category: </p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <option value="empty">Select Category</option>
            <option value="groceries">Groceries</option>
            <option value="entertainment">Entertainment</option>
            <option value="dining">Dining</option>
            <option value="utilities">Utilities</option>
          </select>
          {errors.category && <p className="error">{errors.category}</p>}
        </div>

        {/* Render all items */}
        {items.map((item, index) => (
          <div key={item.itemId} className="form-items">
            <h3 className="item-number">Item {index + 1}</h3>
            <div className="item-name">
              <p>Item Name: </p>
              <input
                onChange={(e) => {
                  handleItemChange(item.itemId, "itemName", e.target.value);
                }}
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
                onChange={(e) => {
                  handleItemChange(item.itemId, "itemQuantity", e.target.value);
                }}
                type="number"
                className="item-quantity"
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
                onChange={(e) => {
                  handleItemChange(item.itemId, "itemPrice", e.target.value);
                }}
                type="number"
                className="item-price"
                placeholder="Price"
                step="0.01"
                value={item.itemPrice}
              />
              {errors.items?.[index]?.price && (
                <p className="error">{errors.items[index].price}</p>
              )}
            </div>

            <div>
              <button
                type="button" // Make sure to use type="button" to prevent form submission
                onClick={() => deleteItem(item.itemId)}
                className="delete-item-button"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addItem()}
          className="add-item-button"
        >
          <i className="fa-solid fa-plus"></i>
        </button>

        <button
          type="button"
          onClick={handleRenderReceipt}
          className="generate-current-recipt-button"
        >
          Generate Current Receipt
        </button>
      </form>
    </>
  );
}
