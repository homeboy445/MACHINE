import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "react-loader-spinner";
import Home from "./components/Home/Home";
import QueryEditor from "./components/QueryEditor/QueryEditor";
import ShareResultPage from "./components/ShareResultPage/ShareResultPage";

const RedirectToHome = () => {
  useEffect(() => {
    window.location.href = "/";
  }, []);
  return <h1>Page Not Found!</h1>;
};

const App = () => {
  const [loading, updateStatus] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      updateStatus(false);
    }, 3000);
  }, []);

  return (
    <div>
      {loading ? (
        <Loader
          type="TailSpin"
          color="#427ef7"
          height={250}
          width={250}
          style={{
            position: "absolute",
            left: "40%",
            top: "40%",
          }}
          timeout={4000}
        />
      ) : null}
      <div
        style={{
          minHeight: "100vh",
          scrollBehavior: "smooth",
          opacity: loading ? 0.01 : 1,
          pointerEvents: loading ? "none" : "all",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<QueryEditor />} />
          <Route path="/sql-share/:id" element={<ShareResultPage />} />
          <Route path="*" element={<RedirectToHome />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
