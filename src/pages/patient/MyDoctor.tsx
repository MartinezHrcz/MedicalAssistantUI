import {useEffect, useState} from "react";
import NavBar from "../../components/NavBar.tsx";
import type {PatientDTO} from "../../types/PatientDTO.ts";
import {patientDashboardLinks} from "../Dashnavlinks.ts";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import axios from "axios";


function MyDoctor(){
    const [patient, setPatient] = useState<PatientDTO|null> (null);
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    const doctorUrl = "http://localhost:5249/api/doctor/";
    useEffect(() => {
        const storedpatient = JSON.parse(localStorage.getItem("patient"));
        if (storedpatient) {
            setPatient(storedpatient);
        }
    }, []);

    useEffect(() => {
        if (patient?.doctorId) {
            axios.get<DoctorDTO>(`${doctorUrl}${patient.doctorId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(res => setDoctor(res.data))
                .catch(err => console.log(err));
        }
    }, [patient]);

    const navLinks = patientDashboardLinks;
    if (!doctor) {
        return <div className="text-center min-h-full w-screen">
            <NavBar title={"My doctor"} links={navLinks}  />
            You don't have a doctor at the moment!
        </div>;
    }


    return(
        <div className="min-h-screen w-screen">
            <NavBar title={"My Doctor"} links={navLinks} />
            <h1 className="text-3xl font-bold mb-8 text-center">
                Medical practitioner: {doctor.name || "Doctor"}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-6 px-5">
                {Object.entries(doctor).map(([key, value]) => (
                    <div key={key} className="bg-white text-black rounded-xl shadow p-4 transition-transform transform hover:scale-[1.02]">
                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">{key}</p>
                        <p className="text-gray-900 text-lg font-medium break-words">{value || 'Not given'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyDoctor