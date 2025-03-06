import { useEffect, useState } from "react";
import DataCollect from "./components/DataCollect";
import Layout from "./components/Layout";
import ReceiptInfo from "./components/ReceiptInfo";
import Login from "./components/Login";
import PaymentSummary from "./components/PaymentSummary";
import "./index.css"; // Ensure CSS is imported

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [receipt, setReceipt] = useState(null);
  const [view, setView] = useState("Input");
  const [receiptsList, setReceiptsList] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({});
  const [taxSummary, setTaxSummary] = useState({});
  const [topCategory, setTopCategory] = useState({});
  const [totalSpending, setTotalSpending] = useState({});
  const [averageReceipt, setAverageReceipt] = useState({});
  const [topPaymentMethod, setTopPaymentMethod] = useState({});
  const [avgTax, setAvgTax] = useState({});
  const [receiptCount, setReceiptCount] = useState({});
  const [topTaxCategory, setTopTaxCategory] = useState({});
  const [paymentMethodSpending, setPaymentMethodSpending] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null); // Track expanded sidebar section

  const handleMonthlyTrendFetch = () => {
    const fetchMonthlyTrend = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/monthly_trend?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setMonthlyTrend(data);
          setView("mainpage_monthly_trend");
        } else {
          console.error("Fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchMonthlyTrend();
  };

  const handlePaymentMethodSpendingFetch = () => {
    const fetchPaymentMethodSpending = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/payment_method_spending?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setPaymentMethodSpending(data);
          setView("mainpage_payment_method_spending");
        } else {
          console.error("Fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchPaymentMethodSpending();
  };

  const handleTopTaxCategoryFetch = () => {
    const fetchTopTaxCategory = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/top_tax_category?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTopTaxCategory(data);
          setView("mainpage_top_tax_category");
        } else {
          console.error("Fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchTopTaxCategory();
  };

  const handleReceiptCountFetch = () => {
    const fetchReceiptCount = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/receipt_count?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setReceiptCount(data);
          setView("mainpage_receipt_count");
        } else {
          console.error("Fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchReceiptCount();
  };

  const handleAvgTaxFetch = () => {
    const fetchAvgTax = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/avg_tax?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setAvgTax(data);
          setView("mainpage_avg_tax");
        } else {
          console.error("Fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchAvgTax();
  };

  const handleTopPaymentMethodFetch = () => {
    const fetchTopPaymentMethod = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/top_payment_method?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTopPaymentMethod(data);
          setView("mainpage_top_payment_method");
        } else {
          console.error("Top payment method fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchTopPaymentMethod();
  };

  const handleAverageReceiptFetch = () => {
    const fetchAverageReceipt = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/average_receipt?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setAverageReceipt(data);
          setView("mainpage_average_receipt");
        } else {
          console.error("Average receipt fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchAverageReceipt();
  };

  const handleTotalSpendingFetch = () => {
    const fetchTotalSpending = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/total_spending?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTotalSpending(data);
          setView("mainpage_total_spending");
        } else {
          console.error("Total spending fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchTotalSpending();
  };

  const handleTopCategoryFetch = () => {
    const fetchTopCategory = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/top_category?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTopCategory(data);
          setView("mainpage_top_category");
        } else {
          console.error("Top category fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchTopCategory();
  };

  const handlePaymentSummaryUpdate = (month, year) => {
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

  const handleTaxSummaryFetch = () => {
    const fetchTaxSummary = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/tax_summary?userId=${user.user_id}`
        );
        if (res.ok) {
          const data = await res.json();
          setTaxSummary(data);
          setView("mainpage_tax_summary");
        } else {
          console.error("Tax summary fetch failed:", await res.json());
        }
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    fetchTaxSummary();
  };

  const handleLogout = () => {
    setUser(null);
    setReceipt(null);
    setReceiptsList([]);
    setPaymentSummary({});
    setTaxSummary({});
    setTopCategory({});
    setTotalSpending({});
    setAverageReceipt({});
    setTopPaymentMethod({});
    setAvgTax({});
    setReceiptCount({});
    setTopTaxCategory({});
    setPaymentMethodSpending([]);
    setMonthlyTrend([]);
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
    setReceipt(newReceipt);
    setReceiptsList((prevReceipts) => [...prevReceipts, newReceipt]);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout className="mainpage_layout" logout={handleLogout}>
      <div className="app-container">
        <div className="sidebar">
          <div className="sidebar-section">
            <button
              className="sidebar-header"
              onClick={() => toggleSection("receiptManagement")}
            >
              Receipt Management{" "}
              {expandedSection === "receiptManagement" ? "▼" : "▶"}
            </button>
            {expandedSection === "receiptManagement" && (
              <div className="sidebar-options">
                <button onClick={() => setView("Input")}>Input</button>
                <button onClick={() => setView("Receipt")}>Receipts</button>
              </div>
            )}
          </div>
          <div className="sidebar-section">
            <button
              className="sidebar-header"
              onClick={() => toggleSection("summaryStats")}
            >
              Summary Stats {expandedSection === "summaryStats" ? "▼" : "▶"}
            </button>
            {expandedSection === "summaryStats" && (
              <div className="sidebar-options">
                <button onClick={() => setView("mainpage_payment_summary")}>
                  Monthly Payment Summary
                </button>
                <button onClick={handleTotalSpendingFetch}>
                  Total Spending
                </button>
                <button onClick={handleTaxSummaryFetch}>Tax Summary</button>
                <button onClick={handleAverageReceiptFetch}>
                  Average Receipt
                </button>
                <button onClick={handleReceiptCountFetch}>Receipt Count</button>
                <button onClick={handleAvgTaxFetch}>Average Tax</button>
              </div>
            )}
          </div>
          <div className="sidebar-section">
            <button
              className="sidebar-header"
              onClick={() => toggleSection("categoryInsights")}
            >
              Category Insights{" "}
              {expandedSection === "categoryInsights" ? "▼" : "▶"}
            </button>
            {expandedSection === "categoryInsights" && (
              <div className="sidebar-options">
                <button onClick={handleTopCategoryFetch}>Top Category</button>
                <button onClick={handleTopTaxCategoryFetch}>
                  Top Tax Category
                </button>
              </div>
            )}
          </div>
          <div className="sidebar-section">
            <button
              className="sidebar-header"
              onClick={() => toggleSection("trends")}
            >
              Trends {expandedSection === "trends" ? "▼" : "▶"}
            </button>
            {expandedSection === "trends" && (
              <div className="sidebar-options">
                <button onClick={handlePaymentMethodSpendingFetch}>
                  Payment Method Spending
                </button>
                <button onClick={handleMonthlyTrendFetch}>Monthly Trend</button>
                <button onClick={handleTopPaymentMethodFetch}>
                  Top Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="content-area">
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
            paymentSummary.total_payments !== undefined ? (
              <div className="payment-summary">
                <PaymentSummary
                  setPaymentSummary={handlePaymentSummaryUpdate}
                />
                <h2>Payment Summary</h2>
                <p>Month: {paymentSummary.month}</p>
                <p>Year: {paymentSummary.year}</p>
                <p>
                  Total Payments: $
                  {parseFloat(paymentSummary.total_payments).toFixed(2)}
                </p>
              </div>
            ) : (
              <PaymentSummary setPaymentSummary={handlePaymentSummaryUpdate} />
            )
          ) : view === "mainpage_tax_summary" ? (
            <div className="tax-summary">
              <h2>Total Tax Summary</h2>
              <p>
                Total Tax Paid: $
                {parseFloat(taxSummary.total_tax || 0).toFixed(2)}
              </p>
            </div>
          ) : view === "mainpage_top_category" ? (
            <div className="top-category">
              <h2>Top Spending Category</h2>
              <p>Category: {topCategory.category_name || "None"}</p>
              <p>
                Total Spent: $
                {parseFloat(topCategory.total_spent || 0).toFixed(2)}
              </p>
            </div>
          ) : view === "mainpage_total_spending" ? (
            <div className="total-spending">
              <h2>Total Spending</h2>
              <p>
                Total Spent: $
                {parseFloat(totalSpending.total_spending || 0).toFixed(2)}
              </p>
            </div>
          ) : view === "mainpage_average_receipt" ? (
            <div className="average-receipt">
              <h2>Average Receipt Amount</h2>
              <p>
                Average: $
                {parseFloat(averageReceipt.average_amount || 0).toFixed(2)}
              </p>
            </div>
          ) : view === "mainpage_top_payment_method" ? (
            <div className="top-payment-method">
              <h2>Most Used Payment Method</h2>
              <p>Method: {topPaymentMethod.payment_method || "None"}</p>
              <p>Uses: {topPaymentMethod.usage_count || 0}</p>
            </div>
          ) : view === "mainpage_avg_tax" ? (
            <div className="avg-tax">
              <h2>Average Tax Per Receipt</h2>
              <p>Average Tax: ${parseFloat(avgTax.avg_tax || 0).toFixed(2)}</p>
            </div>
          ) : view === "mainpage_receipt_count" ? (
            <div className="receipt-count">
              <h2>Total Receipts Count</h2>
              <p>Total Receipts: {receiptCount.total_receipts || 0}</p>
            </div>
          ) : view === "mainpage_top_tax_category" ? (
            <div className="top-tax-category">
              <h2>Most Expensive Category by Tax</h2>
              <p>Category: {topTaxCategory.category_name || "None"}</p>
              <p>
                Total Tax: $
                {parseFloat(topTaxCategory.total_tax || 0).toFixed(2)}
              </p>
            </div>
          ) : view === "mainpage_payment_method_spending" ? (
            <div className="payment-method-spending">
              <h2>Payment Method Spending</h2>
              {paymentMethodSpending.map((item, index) => (
                <div key={index}>
                  <p>Method: {item.payment_method}</p>
                  <p>Total Spent: ${parseFloat(item.total_spent).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : view === "mainpage_monthly_trend" ? (
            <div className="monthly-trend">
              <h2>Monthly Spending Trend</h2>
              {monthlyTrend.map((item, index) => (
                <div key={index}>
                  <p>
                    {item.month}/{item.year}: $
                    {parseFloat(item.monthly_total).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="receipt-status">No receipts yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
