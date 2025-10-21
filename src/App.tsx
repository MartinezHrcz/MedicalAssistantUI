import './App.css'
import {Route, Routes} from "react-router-dom";
import {Login} from "./pages/Login.tsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.tsx";

function App() {
  return (
      <Routes>
          <Route path={"/"} element={<Login />}></Route>
          <Route path={"/dashboard"} element={<DoctorDashboard/>}></Route>
      </Routes>
  );
}

export default App
