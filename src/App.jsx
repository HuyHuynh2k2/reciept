import DataCollect from "./components/DataCollect";
import Layout from "./components/Layout";
import ReceiptInfo from "./components/ReceiptInfo";

function App() {
  return (
    <>
      <Layout>
        <DataCollect />
        <ReceiptInfo />
      </Layout>
    </>
  );
}

export default App;
