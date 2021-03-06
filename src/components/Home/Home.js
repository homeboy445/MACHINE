import React, { useState, useEffect } from "react";
import db_illustration from "../../assets/images/database.jpg";
import keyboard_icon from "../../assets/icons/keyboard.svg";
import "./Home.css";

const Home = ({ update }) => {
  const [session, updateSession] = useState("");

  useEffect(()=>{
    localStorage.clear();
  }, []);

  return (
    <div>
      <h1 className="title">MACHINE.</h1>
      <div className="home">
        <div className="home_1">
          <h1>Experience the power of SQL like never before.</h1>
          <h2>
            Managing data has just gotten way easier with this interactive SQL
            editor.
          </h2>
          <div className="home_input_btns">
            <button
              onClick={() => {
                if (!session.trim()) {
                  return;
                }
                localStorage.setItem("session", session);
                window.location.href = `/editor`;
              }}
            >
              Create Session +
            </button>
            <div className="input_bx">
              <img src={keyboard_icon} alt="" />
              <input
                type="text"
                value={session}
                onChange={(e) => {
                  updateSession(e.target.value.trim());
                }}
              />
            </div>
          </div>
          <div className="home_info">
            <div id="bar"></div>
            <h2>Made with ❤ for the Humans of Data🧐.</h2>
          </div>
        </div>
        <div className="home_img">
          <img src={db_illustration} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
