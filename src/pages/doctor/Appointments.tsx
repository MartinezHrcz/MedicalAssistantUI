import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";
import type {PatientDTO} from "../../types/PatientDTO.ts";
import axios from "axios";

function Appointments() {
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    const [patients, setPatients] = useState<PatientDTO[]> ([]);
    const [loading, setLoading] = useState<boolean>(true);
    const url = "http://localhost:5249/api/doctor/my_patients/";

    useEffect(() => {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
            const parsedDoctor = JSON.parse(storedDoctor);
            setDoctor(parsedDoctor);
            axios.get<PatientDTO[]>(url.concat(parsedDoctor.id.toString()))
                .then((res) => setPatients(res.data))
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        }
        else {
            setLoading(true);
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-white text-lg">Loading...</p>
            </div>);
    }



    const navLinks = [
        {name: "Profile", path: "/doctor/dashboard"},
        {name: "My patients", path: "/doctor/patients"},
        {name: "Book appointment", path: "/doctor/appointments"}
    ];

    const handleAddPatient = (patient: PatientDTO) => {
        alert("add patient");
    }

    return (
        <div>
            <NavBar title={`My appointments`} links={navLinks} />
            <div className="mt-6">
                {patients.length === 0 ? (
                    <p className="text-white">No patients found.</p>
                ) : (
                    <table className="min-w-full bg-white rounded shadow-md overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="py-2 px-4 text-left">Name</th>
                            <th className="py-2 px-4 text-left">Address</th>
                            <th className="py-2 px-4 text-left">Taj</th>
                            <th className="py-2 px-4 text-left">Complaints</th>
                            <th className="py-2 px-4 text-left">Time of Admission</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} className="border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{patient.name}</td>
                                <td className="py-2 px-4">{patient.address || "-"}</td>
                                <td className="py-2 px-4">{patient.taj}</td>
                                <td className="py-2 px-4">{patient.complaints || "-"}</td>
                                <td className="py-2 px-4">{new Date(patient.timeOfAdmission).toLocaleString()}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleAddPatient(patient)}
                                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Appointments;