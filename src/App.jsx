import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Home/HomeLayout";
import LoginPage from "./Components/Login/LoginPage"

function App() {
  return (
    <>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Layout />} />

        {/* Redirect unknown routes */}
        <Route path="/login" element={<Layout />} />
        <Route path="/register" element={<Layout />} />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </>
  );
}

export default App;