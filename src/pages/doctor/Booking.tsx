import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";
import type {PatientDTO} from "../../types/PatientDTO.ts";
import axios from "axios";
import {doctorDashLinks} from "../Dashnavlinks.ts";

function Booking() {
    const [doctor, setDoctor] = useState<DoctorDTO | null>(null);
    const [patients, setPatients] = useState<PatientDTO[]> ([]);
    const [loading, setLoading] = useState<boolean>(true);
    const addpatientUrl = "http://localhost:5249/api/doctor/addpatient/";
    const url = "http://localhost:5249/api/patient";

    useEffect(() => {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
            const parsedDoctor = JSON.parse(storedDoctor);
            setDoctor(parsedDoctor);
            axios.get<PatientDTO[]>(url , {
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((res) => setPatients(res.data.filter(patient => patient.doctorId === null)))
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



    const navLinks = doctorDashLinks;

    const handleAddPatient = (patient: PatientDTO) => {
        try{
            if (!doctor?.id){ return;}
            axios.put(`${addpatientUrl}${doctor.id}-${patient.id}`, {}, {
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
        <div className="min-h-screen w-screen">
            <NavBar title={`Waiting room`} links={navLinks} />
            <div className="mt-6 overflow-x-auto px-10">
                {patients.length === 0 ? (
                    <p className="text-white text-center py-10">No patients are waiting.</p>
                ) : (
                    <table className="min-w-full bg-white rounded-b-2xl overflow-hidden">
                        <thead className="bg-blue-600 text-white text-xl">
                        <tr className="text-left uppercase text-sm font-medium">
                            <th className="py-2 px-4 ">Name</th>
                            <th className="py-2 px-4 ">Address</th>
                            <th className="py-2 px-4 ">Taj</th>
                            <th className="py-2 px-4 ">Complaints</th>
                            <th className="py-2 px-4 ">Time of Admission</th>
                            <th className="py-2 px-4 ">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="text-black">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-blue-100 transition text-gray-700">
                                <td className="py-2 px-4">{patient.name}</td>
                                <td className="py-2 px-4">{patient.address || "-"}</td>
                                <td className="py-2 px-4">{patient.taj}</td>
                                <td className="py-2 px-4">{patient.complaints || "-"}</td>
                                <td className="py-2 px-4">{new Date(patient.timeOfAdmission).toLocaleString()}</td>
                                <td className="py-2 px-4">
                                    <button
                                        onClick={() => handleAddPatient(patient)}
                                        className="bg-green-500 text-white py-1 rounded hover:bg-green-700 transition"
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

export default Booking;