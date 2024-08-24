"use client";
// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MyProvider } from "@/contexts/MyContext";
import Login from "@/pages/user/login";
import Debug from "@/pages/debug";

function App() {
  return (
    <MyProvider>
      <Router>
        <Routes>
          <Route path="/user/login" element={<Login />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Router>
    </MyProvider>
  );
}

export default App;
