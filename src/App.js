import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import QueryEditor from "./components/QueryEditor/QueryEditor";

const RedirectToHome = () => {
  useEffect(() => {
    window.location.href = "/";
  }, []);
  return <h1>Page Not Found!</h1>;
};

const App = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<QueryEditor />} />
        <Route
          path="*"
          element={<RedirectToHome />}
        />
      </Routes>
    </div>
  );
};

export default App;
