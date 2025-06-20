import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SkillForm from "./pages/SkillForm";
import PodChat from "./pages/PodChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SkillForm />} />
        <Route path="/pod/:podId/:anonName" element={<PodChat />} />
      </Routes>
    </Router>
  );
}

export default App;
