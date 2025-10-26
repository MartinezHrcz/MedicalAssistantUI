import {useEffect, useState} from "react";
import type {MedicationDTO, PatientDTO} from "../../types/PatientDTO.ts";
import axios from "axios";
import NavBar from "../../components/NavBar.tsx";
import {patientDashboardLinks} from "../Dashnavlinks.ts";


function Medications(){
    const [patient, setPatient] = useState<PatientDTO|null> (null);
    const [medications, setMedication] = useState<MedicationDTO[]> ([]);
    const [loading, setLoading] = useState<boolean>(true);

    const medicationUrl = "http://localhost:5249/medication/";
    const navLinks = patientDashboardLinks;

    useEffect(() => {
        const storedpatient = JSON.parse(localStorage.getItem("patient"));
        if (storedpatient) {
            setPatient(storedpatient);
        }
    }, []);

    useEffect(() => {
        if (!patient) return;
        axios.get(medicationUrl.concat(patient?.taj), {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }
            )
            .then(res => setMedication(res.data.medications))
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [patient])

    return(
        <div className="min-h-screen w-screen">
            <NavBar title={"My Medications"} links={navLinks}></NavBar>
            <h1 className="text-2xl font-semibold mb-4 text-center text-white">
                My Medications
            </h1>

            {medications.length === 0 ? (
                <p className="text-white text-center">No medications found.</p>
            ) : (
                <table className="min-w-full bg-white rounded shadow-md overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="py-2 px-4">Title</th>
                        <th className="py-2 px-4">Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {medications.map((med) => (
                        <tr
                            key={med.id}
                            className="border-b text-black hover:bg-gray-100"
                        >
                            <td className="py-2 px-4">{med.title}</td>
                            <td className="py-2 px-4">{med.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Medications;