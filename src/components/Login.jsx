import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const endpoint = isSignup
      ? "http://localhost:3001/api/signup"
      : "http://localhost:3001/api/login";

    const body = isSignup
      ? { firstName, lastName, email, password }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
      } else {
        setError(data.message || `HTTP error! Status: ${res.status}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{isSignup ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        {isSignup && (
          <>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>
      <button onClick={() => setIsSignup(!isSignup)} className="toggle-button">
        <i className="fa-solid fa-exchange-alt"></i>{" "}
        {isSignup ? "Switch to Login" : "Switch to Sign Up"}
      </button>
    </div>
  );
}
