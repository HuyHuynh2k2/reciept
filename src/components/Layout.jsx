import "../index.css";

export default function Layout(props) {
  const { children } = props;

  const header = (
    <header>
      <div className="header-bar">
        <p className="header-group">palmleaf</p>
        <button className="header-about">About</button>
      </div>
      <div className="header-title">
        <h1>Receipt Tracking</h1>
        <i className="fa-solid fa-receipt"></i>
      </div>
    </header>
  );

  return (
    <>
      {header}
      {children}
    </>
  );
}
