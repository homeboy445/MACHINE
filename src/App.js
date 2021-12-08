import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
  return (
    <div style={{ minHeight: "100vh", scrollBehavior: "smooth" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<QueryEditor />} />
        <Route path="/sql-share/:id" element={<ShareResultPage />} />
        <Route path="*" element={<RedirectToHome />} />
      </Routes>
    </div>
  );
};

export default App;
