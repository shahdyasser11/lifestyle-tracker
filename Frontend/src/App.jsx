import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Home/HomeLayout";
import LoginPage from "./Components/Login/LoginPage"
import NutritionLayout from "./Components/Nutrition/NutritionLayout/NutritionLayout";
import HomePage from "./Components/HomePage/HomePage"

function App() {
  return (
    <>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Layout />} />

        {/* Redirect unknown routes */}
        <Route path="/login" element={<Layout />} />
        <Route path="/register" element={<Layout />} />
        <Route path="/nutrition" element={<NutritionLayout />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}

      </Routes>
    </>
  );
}

export default App;