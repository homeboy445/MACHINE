import React, { useState } from "react";
import Home from "./components/Home/Home";
import QueryEditor from "./components/QueryEditor/QueryEditor";

const App = () => {
  const [state, update] = useState(0);
  return (
    <div style={{ minHeight: "100vh" }}>
      {state === 0 ? <Home update={update} /> : <QueryEditor />}
    </div>
  );
};

export default App;
