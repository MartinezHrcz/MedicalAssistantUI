import './App.css'
import {Route, Routes} from "react-router-dom";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.tsx";
import {StartPage} from "./pages/StartPage.tsx";
import {LoginDoctor} from "./pages/LoginDoctor.tsx";
import {LoginPatient} from "./pages/patient/LoginPatient.tsx";

function App() {
  return (
      <Routes>
          <Route path={"/"} element={<StartPage />}></Route>
          <Route path={"/doctor_login"} element={<LoginDoctor/>}></Route>
          <Route path={"/patient_login"} element={<LoginPatient/>}></Route>
          <Route path={"/dashboard"} element={<DoctorDashboard/>}></Route>
      </Routes>
  );
}

export default App
