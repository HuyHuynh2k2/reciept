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

app.listen(3001, () => console.log("Server running on port 3001"));
