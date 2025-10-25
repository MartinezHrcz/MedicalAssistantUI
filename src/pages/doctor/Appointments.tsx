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
    const removepatientUrl = "http://localhost:5249/api/doctor/removepatient/";

    useEffect(() => {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
            const parsedDoctor = JSON.parse(storedDoctor);
            setDoctor(parsedDoctor);
            axios.get<PatientDTO[]>(url.concat(parsedDoctor.id.toString()), {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
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
        {name: "Book patient", path: "/doctor/booking"},
        {name: "My appointments", path: "/doctor/appointments"}
    ];

    const handleRemovePatient = async (patient: PatientDTO) => {
        try{
            await axios.put(`${removepatientUrl}${doctor.id}-${patient.id}`, {}, {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setPatients((prev) => prev.filter((p) => p.id !== patient.id));
        }
        catch(err){
            console.log(err);
            alert("Something went wrong!");
        }
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
                            <th className="py-2 px-4 ">Name</th>
                            <th className="py-2 px-4 ">Address</th>
                            <th className="py-2 px-4 ">Taj</th>
                            <th className="py-2 px-4 ">Complaints</th>
                            <th className="py-2 px-4 ">Time of Admission</th>
                            <th className="py-2 px-4 ">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id} className="border-b text-black hover:bg-gray-100">
                                <td className="py-2 px-4">{patient.name}</td>
                                <td className="py-2 px-4">{patient.address || "-"}</td>
                                <td className="py-2 px-4">{patient.taj}</td>
                                <td className="py-2 px-4">{patient.complaints || "-"}</td>
                                <td className="py-2 px-4">{new Date(patient.timeOfAdmission).toLocaleString()}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleRemovePatient(patient)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition transition-all duration-700"
                                    >
                                        Remove
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