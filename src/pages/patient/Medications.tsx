import {useEffect, useState} from "react";
import type {MedicationDTO, PatientDTO} from "../../types/PatientDTO.ts";
import axios from "axios";
import NavBar from "../../components/NavBar.tsx";
import {patientDashboardLinks} from "../Dashnavlinks.ts";


function Medications(){
    const [patient, setPatient] = useState<PatientDTO|null> (null);
    const [medications, setMedication] = useState<MedicationDTO[]> ([]);

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
    }, [patient])

    return(
        <div className="min-h-screen w-screen">
            <NavBar title={"Prescriptions"} links={navLinks}></NavBar>
            <h1 className="text-2xl font-semibold mb-4 text-center text-white">
                My Medications
            </h1>
            <div className="mt-6 overflow-x-auto px-10">
                {medications.length === 0 ? (
                    <p className="text-white text-center">No prescriptions found.</p>
                ) : (
                    <table className="min-w-full bg-white rounded-b-2xl overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                        <tr className=" uppercase text-sm font-medium">
                            <th className="py-2 px-4">Used for</th>
                            <th className="py-2 px-4">Name of medication</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-500">
                        {medications.map((med) => (
                            <tr
                                key={med.id}
                                className="hover:bg-blue-100 transition text-gray-700"
                            >
                                <td className="py-2 px-4 text-gray-800 font-medium">{med.title}</td>
                                <td className="py-2 px-4">{med.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
}

export default Medications;