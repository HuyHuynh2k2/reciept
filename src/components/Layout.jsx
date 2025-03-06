import "../index.css";

export default function Layout(props) {
  const { children, logout } = props;

  const header = (
    <header className="app-header">
      <div className="header-bar">
        <p className="header-group">palmleaf</p>
        <button onClick={logout} className="header-logout">
          Log Out
        </button>
      </div>
      <div className="header-title">
        <h1>Receipt Tracking</h1>
        <i className="fa-solid fa-receipt"></i>
      </div>
    </header>
  );

  return (
    <div className="layout-container">
      {header}
      <main className="layout-content">{children}</main>
    </div>
  );
}
