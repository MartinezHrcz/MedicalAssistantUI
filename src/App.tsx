import './App.css'
import {Route, Routes} from "react-router-dom";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.tsx";
import {StartPage} from "./pages/StartPage.tsx";
import {LoginDoctor} from "./pages/doctor/LoginDoctor.tsx";
import {LoginPatient} from "./pages/patient/LoginPatient.tsx";
import PatientDashboard from "./pages/patient/PatientDashboard.tsx";
import SignupPatient from "./pages/patient/SignupPatient.tsx";
import SignupDoctor from "./pages/doctor/SignupDoctor.tsx";
import Appointments from "./pages/doctor/Appointments.tsx";

function App() {
  return (
      <Routes>
          <Route path={"/"} element={<StartPage />}></Route>
          <Route path={"/patient/signup"} element={<SignupPatient/>}></Route>
          <Route path={"/doctor/signup"} element={<SignupDoctor/>}></Route>
          <Route path={"/doctor/login"} element={<LoginDoctor/>}></Route>
          <Route path={"/patient/login"} element={<LoginPatient/>}></Route>
          <Route path={"/doctor/dashboard"} element={<DoctorDashboard/>}></Route>
          <Route path={"/patient/dashboard"} element={<PatientDashboard/>}></Route>
          <Route path={"/doctor/appointments"} element={<Appointments/>}></Route>
      </Routes>
  );
}

export default App
