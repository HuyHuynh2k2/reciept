import { useEffect, useState } from "react";
import DataCollect from "./components/DataCollect";
import Layout from "./components/Layout";
import ReceiptInfo from "./components/ReceiptInfo";
import Login from "./components/Login";
import PaymentSummary from "./components/PaymentSummary";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [receipt, setReceipt] = useState(null);
  const [view, setView] = useState("Input");
  const [receiptsList, setReceiptsList] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({});

  const handleLogout = () => {
    setUser(null);
    setReceipt(null);
    setReceiptsList([]);
    localStorage.removeItem("user");
  };

  const handlePaymentSummaryUpdate = (month, year) => {
    // Fetch the payment summary based on the month and year
    const fetchPaymentSummary = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/payment_summary?userId=${user.user_id}&month=${month}&year=${year}`
        );
        if (res.ok) {
          const data = await res.json();
          setPaymentSummary(data);
        } else {
          console.error("Payment summary fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchPaymentSummary();
  };

  useEffect(() => {
    const fetchReceipts = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `http://localhost:3001/api/all_receipts?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setReceiptsList(data);
        } else {
          console.error("Fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    const fetchPaymentSummary = async () => {
      if (!user) return;
      const currentDate = new Date();
      try {
        const res = await fetch(
          `http://localhost:3001/api/payment_summary?userId=${
            user.user_id
          }&month=${
            currentDate.getMonth() + 1
          }&year=${currentDate.getFullYear()}`
        );
        if (res.ok) {
          const data = await res.json();
          setPaymentSummary(data);
        } else {
          console.error("Payment summary fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };

    fetchReceipts();
    fetchPaymentSummary();
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const handleReceiptGenerated = (newReceipt) => {
    setReceipt(newReceipt); // Update last generated receipt
    setReceiptsList((prevReceipts) => [...prevReceipts, newReceipt]); // Append to all receipts
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout className="mainpage_layout" logout={handleLogout}>
      <div className="option_button_bar">
        <button
          className="mainpage_input_button"
          onClick={() => setView("Input")}
        >
          Input
        </button>
        {console.log("receiptsList", receiptsList)}
        <button
          className="mainpage_receipt_button"
          onClick={() => setView("Receipt")}
        >
          Receipt
        </button>

        <button onClick={() => setView("mainpage_payment_summary")}>
          Monthly Payment Summary
        </button>
      </div>
      {view === "Input" ? (
        <DataCollect
          userId={user.user_id}
          onReceiptGenerated={handleReceiptGenerated}
        />
      ) : view === "Receipt" ? (
        <>
          {receiptsList.length > 0 ? (
            <div>
              {receiptsList.map((receipt, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <ReceiptInfo receipt={receipt} />
                </div>
              ))}
            </div>
          ) : (
            <p className="receipt-status">No receipts yet</p>
          )}
        </>
      ) : view === "mainpage_payment_summary" ? (
        paymentSummary.total_payments !== undefined ? ( // Check if data exists
          <>
            <PaymentSummary setPaymentSummary={handlePaymentSummaryUpdate} />
            <div>
              <h2>Payment Summary</h2>
              <p>Month: {paymentSummary.month}</p>
              <p>Year: {paymentSummary.year}</p>
              <p>
                Total Payments: $
                {parseFloat(paymentSummary.total_payments).toFixed(2)}
              </p>
            </div>
          </>
        ) : (
          <PaymentSummary setPaymentSummary={handlePaymentSummaryUpdate} />
        )
      ) : (
        <p className="receipt-status">No receipts yet</p>
      )}
    </Layout>
  );
}

export default App;
