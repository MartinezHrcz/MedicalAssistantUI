import {useEffect, useState} from "react";
import NavBar from "../../components/NavBar.tsx";
import type {PatientDTO} from "../../types/PatientDTO.ts";
import {patientDashboardLinks} from "../Dashnavlinks.ts";
import axios from "axios";


function PatientDashboard() {
    const [patient, setPatient] = useState<PatientDTO|null> (null);
    useEffect( () => {
        const fetchPatient = async () => {
            const storedPatient = localStorage.getItem("patient");
            if (storedPatient) {
                const parsedPatient = JSON.parse(storedPatient);
                setPatient(JSON.parse(storedPatient));
                try {
                    const res = await axios.get<PatientDTO>(
                        `http://localhost:5249/api/patient/${parsedPatient.id}`,
                        {
                            headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
                        }
                    );
                    setPatient(res.data);
                    localStorage.setItem("patient", JSON.stringify(res.data));
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchPatient();
    }, []);

    if (!patient) {
        return <div>Loading...</div>;
    }
    const navLinks = patientDashboardLinks;

    return(
        <div>
            <NavBar title={"NAVBAR"} links={navLinks} showlogout={true} />
            <h1 className="text-2xl font-semibold mb-6 text-center">
                Signed in as: {patient.name || "Patient"}
            </h1>
            <div className="grid grid-cols-1 gap-y-2 gap-4 px-5">
                {Object.entries(patient).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3 shadow-sm">
                        <p className="w-full text-2xl capitalize border-b">{key}</p>
                        <p className="w-full text-xl break-words">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PatientDashboard;