import { useState } from "react";
import DataCollect from "./components/DataCollect";
import Layout from "./components/Layout";
import ReceiptInfo from "./components/ReceiptInfo";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null); // Store authenticated user
  const [receipt, setReceipt] = useState(null); // Store latest receipt

  const handleLogout = () => {
    setUser(null);
    setReceipt(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Layout logout={handleLogout}>
      <DataCollect userId={user.user_id} onReceiptGenerated={setReceipt} />
      <ReceiptInfo receipt={receipt} />
    </Layout>
  );
}

export default App;
