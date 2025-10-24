import './App.css'
import {Route, Routes} from "react-router-dom";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.tsx";
import {StartPage} from "./pages/StartPage.tsx";
import {Login} from "./pages/Login.tsx";

function App() {
  return (
      <Routes>
          <Route path={"/"} element={<StartPage />}></Route>
          <Route path={"/login"} element={<Login/>}></Route>
          <Route path={"/dashboard"} element={<DoctorDashboard/>}></Route>
      </Routes>
  );
}

export default App
