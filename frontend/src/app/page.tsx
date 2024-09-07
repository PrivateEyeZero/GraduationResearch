"use client";
// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "@/pages/auth/login";
import Debug from "@/pages/debug";
import Register from "@/pages/auth/register";
import DiscordAuth from "@/pages/auth/discord";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/discord" element={<DiscordAuth />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Router>
  );
}

export default App;
