import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" })); // Allow frontend origin
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Washington20@", // Ensure this matches your MySQL root password
  database: "receipt",
});

const query = async (sql, params) => {
  try {
    const [results] = await db.query(sql, params);
    return results;
  } catch (err) {
    throw err;
  }
};

// Test DB connection
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ message: "Database connected!", result: rows[0].result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Database connection failed", error: err.message });
  }
});

app.post("/api/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    console.log("Signup attempt:", { firstName, lastName, email, password });
    const result = await query("SELECT * FROM User WHERE email = ?", [email]);
    console.log("Query result (existing check):", result);
    const [existing] = result;
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    console.log("No existing user found, proceeding to hash password");
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("Hashed password:", passwordHash);
    const resultInsert = await query(
      "INSERT INTO User (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, passwordHash]
    );
    console.log("Insert result:", resultInsert);
    res.json({
      user: {
        user_id: resultInsert.insertId,
        first_name: firstName,
        last_name: lastName,
        email,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await query("SELECT * FROM User WHERE email = ?", [email]);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/api/receipts", async (req, res) => {
  const {
    userId,
    totalAmount,
    taxAmount,
    merchantName,
    categoryName,
    receiptDate,
    paymentMethod,
    items,
  } = req.body;
  console.log("Receipt attempt:", {
    userId,
    totalAmount,
    taxAmount,
    merchantName,
    categoryName,
    receiptDate,
    paymentMethod,
    items,
  });

  try {
    let [dateRow] = await query("SELECT date_id FROM Date WHERE date = ?", [
      receiptDate,
    ]);
    console.log("Date query result:", dateRow);
    if (!dateRow) {
      const dateResult = await query(
        "INSERT INTO Date (date, month, year) VALUES (?, MONTH(?), YEAR(?))",
        [receiptDate, receiptDate, receiptDate]
      );
      console.log("Date insert result:", dateResult);
      dateRow = { date_id: dateResult.insertId };
    }

    let [merchant] = await query(
      "SELECT merchant_id FROM Merchant WHERE merchant_name = ?",
      [merchantName]
    );
    console.log("Merchant query result:", merchant);
    if (!merchant) {
      const merchantResult = await query(
        "INSERT INTO Merchant (merchant_name) VALUES (?)",
        [merchantName]
      );
      console.log("Merchant insert result:", merchantResult);
      merchant = { merchant_id: merchantResult.insertId };
    }

    let [category] = await query(
      "SELECT category_id FROM Category WHERE category_name = ?",
      [categoryName]
    );
    console.log("Category query result:", category);
    if (!category) {
      const categoryResult = await query(
        "INSERT INTO Category (category_name) VALUES (?)",
        [categoryName]
      );
      console.log("Category insert result:", categoryResult);
      category = { category_id: categoryResult.insertId };
    }

    const receiptResult = await query(
      "INSERT INTO Receipt (user_id, total_amount, tax_amount, merchant_id, category_id, receipt_date, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        totalAmount,
        taxAmount,
        merchant.merchant_id,
        category.category_id,
        dateRow.date_id,
        paymentMethod,
      ]
    );
    console.log("Receipt insert result:", receiptResult);
    const receiptId = receiptResult.insertId;

    for (const item of items) {
      console.log("Processing item:", item);
      await query(
        "INSERT INTO ReceiptItem (receipt_id, description, amount) VALUES (?, ?, ?)",
        [receiptId, item.description, item.amount]
      );
    }

    res.json({
      receiptStore: merchantName,
      receiptDate,
      receiptPaymentMethod: paymentMethod,
      receiptCategory: categoryName,
      receiptTax: taxAmount,
      receiptTotal: totalAmount,
      receiptItems: items.map((item) => ({
        description: item.description,
        quantity: item.quantity || 1,
        amount: item.amount,
      })),
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
/*
app.get("/api/all_receipts", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const rows = await query("SELECT * FROM Receipt WHERE user_id = ?", [
      userId,
    ]);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
*/

app.get("/api/all_receipts", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    // Fetch receipt data
    const receipts = await query(
      `
      SELECT 
          r.receipt_id,
          r.user_id,
          r.total_amount,
          r.tax_amount,
          m.merchant_name,
          c.category_name,
          d.date,
          r.payment_method
      FROM Receipt r
      LEFT JOIN Merchant m ON r.merchant_id = m.merchant_id
      LEFT JOIN Date d ON r.receipt_date = d.date_id
      LEFT JOIN Category c ON r.category_id = c.category_id
      WHERE r.user_id = ?
      `,
      [userId]
    );

    // Fetch items for each receipt
    const receiptsWithItems = await Promise.all(
      receipts.map(async (receipt) => {
        const itemsResult = await query(
          "SELECT description, amount FROM ReceiptItem WHERE receipt_id = ?",
          [receipt.receipt_id]
        );
        console.log(`Items for receipt_id ${receipt.receipt_id}:`, itemsResult); // Debug log
        const items = Array.isArray(itemsResult) ? itemsResult : [];
        return {
          receiptStore: receipt.merchant_name || "Unknown Store",
          receiptDate: receipt.date || "1970-01-01",
          receiptPaymentMethod: receipt.payment_method || "N/A",
          receiptCategory: receipt.category_name || "N/A",
          receiptTax: parseFloat(receipt.tax_amount) || 0,
          receiptTotal: parseFloat(receipt.total_amount) || 0,
          receiptItems: items.map((item) => ({
            description: item.description || "Unknown Item",
            quantity: 1, // Assuming quantity is not stored; adjust if added
            amount: parseFloat(item.amount) || 0,
          })),
        };
      })
    );

    console.log("Receipts sent:", receiptsWithItems); // Debug log
    res.json(receiptsWithItems);
  } catch (err) {
    console.error("Error fetching receipts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/payment_summary", async (req, res) => {
  console.log("Received request with query:", req.query);
  try {
    const { userId, month, year } = req.query;
    if (!userId || !month || !year) {
      return res
        .status(400)
        .json({ message: "userId, month, and year are required" });
    }

    const results = await query(
      `
      SELECT 
          d.month,
          d.year,
          SUM(r.total_amount) AS total_payments
      FROM Receipt r
      LEFT JOIN Date d ON r.receipt_date = d.date_id
      WHERE r.user_id = ? AND (d.month = ? OR d.month IS NULL) AND (d.year = ? OR d.year IS NULL)
      GROUP BY d.month, d.year
      `,
      [userId, parseInt(month), parseInt(year)]
    );
    console.log("Query results:", results);

    const summary =
      results.length > 0
        ? results[0]
        : { month: parseInt(month), year: parseInt(year), total_payments: 0 };
    console.log("Payment summary:", summary);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching payment summary:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/tax_summary", async (req, res) => {
  console.log("Received tax summary request with query:", req.query);
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const results = await query(
      `
      SELECT 
          SUM(r.tax_amount) AS total_tax
      FROM Receipt r
      WHERE r.user_id = ?
      `,
      [userId]
    );
    console.log("Tax query results:", results);

    const summary = results.length > 0 ? results[0] : { total_tax: 0 };
    console.log("Tax summary:", summary);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching tax summary:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/top_category", async (req, res) => {
  console.log("Received top category request with query:", req.query);
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const results = await query(
      `
      SELECT 
          c.category_name,
          SUM(r.total_amount) AS total_spent
      FROM Receipt r
      LEFT JOIN Category c ON r.category_id = c.category_id
      WHERE r.user_id = ?
      GROUP BY c.category_id, c.category_name
      ORDER BY total_spent DESC
      LIMIT 1
      `,
      [userId]
    );
    console.log("Top category query results:", results);

    const summary =
      results.length > 0
        ? results[0]
        : { category_name: "None", total_spent: 0 };
    console.log("Top category summary:", summary);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching top category:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/total_spending", async (req, res) => {
  console.log("Received total spending request with query:", req.query);
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const results = await query(
      `
      SELECT 
          SUM(r.total_amount) AS total_spending
      FROM Receipt r
      WHERE r.user_id = ?
      `,
      [userId]
    );
    console.log("Total spending query results:", results);

    const summary = results.length > 0 ? results[0] : { total_spending: 0 };
    console.log("Total spending summary:", summary);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching total spending:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/average_receipt", async (req, res) => {
  console.log("Received average receipt request with query:", req.query);
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const results = await query(
      `
      SELECT 
          AVG(r.total_amount) AS average_amount
      FROM Receipt r
      WHERE r.user_id = ?
      `,
      [userId]
    );
    console.log("Average receipt query results:", results);

    const summary = results.length > 0 ? results[0] : { average_amount: 0 };
    console.log("Average receipt summary:", summary);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching average receipt:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/top_payment_method", async (req, res) => {
  console.log("Received top payment method request with query:", req.query);
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const results = await query(
      `
      SELECT 
          r.payment_method,
          COUNT(*) AS usage_count
      FROM Receipt r
      WHERE r.user_id = ?
      GROUP BY r.payment_method
      ORDER BY usage_count DESC
      LIMIT 1
      `,
      [userId]
    );
    console.log("Top payment method query results:", results);

    const summary =
      results.length > 0
        ? results[0]
        : { payment_method: "None", usage_count: 0 };
    console.log("Top payment method summary:", summary);
    res.json(summary);
  } catch (err) {
    console.error("Error fetching top payment method:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/avg_tax", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const results = await query(
      `
      SELECT AVG(tax_amount) AS avg_tax
      FROM Receipt
      WHERE user_id = ?
      `,
      [userId]
    );
    const summary = results.length > 0 ? results[0] : { avg_tax: 0 };
    res.json(summary);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/receipt_count", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const results = await query(
      `
      SELECT COUNT(*) AS total_receipts
      FROM Receipt
      WHERE user_id = ?
      `,
      [userId]
    );
    const summary = results.length > 0 ? results[0] : { total_receipts: 0 };
    res.json(summary);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/top_tax_category", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const results = await query(
      `
      SELECT c.category_name, SUM(r.tax_amount) AS total_tax
      FROM Receipt r
      LEFT JOIN Category c ON r.category_id = c.category_id
      WHERE r.user_id = ?
      GROUP BY c.category_id, c.category_name
      ORDER BY total_tax DESC
      LIMIT 1
      `,
      [userId]
    );
    const summary =
      results.length > 0 ? results[0] : { category_name: "None", total_tax: 0 };
    res.json(summary);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/payment_method_spending", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const results = await query(
      `
      SELECT payment_method, SUM(total_amount) AS total_spent
      FROM Receipt
      WHERE user_id = ?
      GROUP BY payment_method
      ORDER BY total_spent DESC
      `,
      [userId]
    );
    res.json(
      results.length > 0
        ? results
        : [{ payment_method: "None", total_spent: 0 }]
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get("/api/monthly_trend", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    const results = await query(
      `
      SELECT d.month, d.year, SUM(r.total_amount) AS monthly_total
      FROM Receipt r
      LEFT JOIN Date d ON r.receipt_date = d.date_id
      WHERE r.user_id = ?
      GROUP BY d.year, d.month
      ORDER BY d.year, d.month
      `,
      [userId]
    );
    res.json(
      results.length > 0 ? results : [{ month: 0, year: 0, monthly_total: 0 }]
    );
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
