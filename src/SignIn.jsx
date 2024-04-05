import React, { useState } from "react";
import { supabase } from "./supabaseClient";
import FinKeepLogo from "./assets/FinkeepLogo2.png";
import "./SignIn.css";

const SignIn = ({ onLoginUpdate }) => {
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userInput.email,
        password: userInput.password,
      });

      if (error) {
        setMessage("Login failed. Please check your credentials.");
      } else {
        setMessage("Login Successful.");
        onLoginUpdate(true);
        // setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setMessage("An unexpected error occurred.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <>
      <section className="sign-in">
        <div className="signin-container">
          <div className="signin-image">
            <figure>
              <img src={FinKeepLogo} alt="LogIn Pic" />
            </figure>
          </div>
          <div className="signin-form">
            <h2 className="form-title">Sign In</h2>
            <form className="signin-form" onSubmit={handleSubmit}>
              <div className="email">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userInput.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="password">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userInput.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" onKeyPress={handleKeyPress}>
                Sign In
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
