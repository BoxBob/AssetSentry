import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import InvestorPage from "./pages/InvestorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/investor" element={<InvestorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
