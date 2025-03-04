import { useEffect, useState } from "react";
import DataCollect from "./components/DataCollect";
import Layout from "./components/Layout";
import ReceiptInfo from "./components/ReceiptInfo";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [receipt, setReceipt] = useState(null); // Last generated receipt
  const [view, setView] = useState("Input"); // Default to Input
  const [receiptsList, setReceiptsList] = useState([]); // All receipts

  const handleLogout = () => {
    setUser(null);
    setReceipt(null);
    setReceiptsList([]);
    localStorage.removeItem("user");
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

    fetchReceipts();
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
    <Layout logout={handleLogout}>
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
      {view === "Input" ? (
        <DataCollect
          userId={user.user_id}
          onReceiptGenerated={handleReceiptGenerated}
        />
      ) : (
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
      )}
    </Layout>
  );
}

export default App;
