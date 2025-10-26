import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";
import type {MedicationDTO, PatientDTO, PatientMedicationDTO} from "../../types/PatientDTO.ts";
import axios from "axios";

function Appointments() {
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    const [patients, setPatients] = useState<PatientDTO[]> ([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [addMedicationPopup, setAddMedicationPopup] = useState<{
        patient: PatientDTO | null,
        title: string, name: string } | null>
    (null);

    const [medicationPopup, setMedicationPopup] = useState<{
        patient: PatientDTO | null;
        medications: MedicationDTO[];
    } | null>(null);

    const url = "http://localhost:5249/api/doctor/my_patients/";
    const removepatientUrl = "http://localhost:5249/api/doctor/removepatient/";
    const addMedicationUrl = "http://localhost:5249/api/doctor/medication/";
    const removeMedicationUrl = "http://localhost:5249/api/doctor/medication/";

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

    const handleShowMedications = async (patient: PatientDTO) => {
        try {
            const res = await axios.get<PatientMedicationDTO>(
                `http://localhost:5249/medication/${encodeURIComponent(patient.taj)}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            // @ts-ignore
            setMedicationPopup({ patient, medications: res.data.medications });
        } catch (err) {
            console.log(err);
            alert("Failed to fetch medications!");
        }
    };

    const handleOpenMedication = (patient: PatientDTO) => {
        setAddMedicationPopup({ patient, title: "", name: "" });
    };

    const handleAddMedication = async () => {
        if (!addMedicationPopup?.patient) return;

        try {
            await axios.put(
                `${addMedicationUrl}${addMedicationPopup.patient.taj}_${encodeURIComponent(addMedicationPopup.title)}_${encodeURIComponent(addMedicationPopup.name)}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setAddMedicationPopup(null);
            alert("Medication added successfully!");
        } catch (err) {
            console.log(err);
            alert("Failed to add medication!");
        }
    };

    const handleRemoveMedication = async (medId: string) => {
        if (!medicationPopup?.patient) return;
        try {
            await axios.delete(
                `${removeMedicationUrl}${encodeURIComponent(medicationPopup.patient.taj)}_${medId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            // Remove from local state
            setMedicationPopup({
                ...medicationPopup,
                medications: medicationPopup.medications.filter((m) => m.id !== medId),
            });
        } catch (err) {
            console.log(err);
            alert("Failed to remove medication!");
        }
    };


    return (
        <div className="min-h-screen w-screen">
            <NavBar title={`My appointments`} links={navLinks} />
            <div className="mt-6 overflow-x-auto px-10">
                {patients.length === 0 ? (
                    <p className="text-white text-center py-10">No appointments made for today.</p>
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
                        <tbody className="divide-y text-left divide-gray-500">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-blue-100 transition text-gray-700">
                                <td className="py-2 px-4 text-gray-800 font-medium">{patient.name}</td>
                                <td className="py-2 px-4">{patient.address || "-"}</td>
                                <td className="py-2 px-4">{patient.taj}</td>
                                <td className="py-2 px-4">{patient.complaints || "-"}</td>
                                <td className="py-2 px-4">{new Date(patient.timeOfAdmission).toLocaleString()}</td>
                                <td className="py-2 px-4 flex gap-2">
                                    <button
                                        onClick={() => handleRemovePatient(patient)}
                                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                                    >
                                        Remove Patient
                                    </button>

                                    <button
                                        onClick={() => handleOpenMedication(patient)}
                                        className="bg-green-500 text-white py-1 rounded hover:bg-green-700 transition"
                                    >
                                        Add Medication
                                    </button>

                                    <button onClick={() => handleShowMedications(patient)}
                                            className="bg-blue-600 text-white py-1 rounded hover:bg-blue-800 transition">
                                        Show meds
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>


            {medicationPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-blue-600 rounded-2xl shadow-2xl w-[420px] p-6 sm:p-8 space-y-5 border max-h-[80vh] border-blue-200">
                        <h2 className="text-2xl font-semibold mb-4">Medications for {medicationPopup.patient?.name}</h2>
                        {medicationPopup.medications.length === 0 ? (
                            <p className="text-white">No medications found.</p>
                        ) : (
                            <div className="overflow-y-auto" style={{ maxHeight: "calc(3 * 4rem)" }}>
                                <table className="min-w-full bg-white rounded shadow-md overflow-hidden">
                                    <thead className="bg-gray-700 text-white sticky top-0">
                                    <tr>
                                        <th className="py-2 px-4">Title</th>
                                        <th className="py-2 px-4">Name</th>
                                        <th className="py-2 px-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {medicationPopup.medications.map((med) => (
                                        <tr key={med.id} className="border-b text-black hover:bg-gray-100">
                                            <td className="py-2 px-4 font-medium text-gray-800">{med.title}</td>
                                            <td className="py-2 px-4 text-gray-700">{med.name}</td>
                                            <td className="py-2 px-4 flex justify-center">
                                                <button
                                                    onClick={() => handleRemoveMedication(med.id)}
                                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg transition">
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                        )}
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setMedicationPopup(null)}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white text-lg rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {addMedicationPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-blue-600 rounded-2xl shadow-2xl w-[420px] p-6 sm:p-8 space-y-5 border border-blue-200">
                        <h2 className="text-xl font-semibold mb-4">Add Medication for {addMedicationPopup.patient?.name}</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={addMedicationPopup.title}
                            onChange={e => setAddMedicationPopup({ ...addMedicationPopup, title: e.target.value })}
                            className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={addMedicationPopup.name}
                            onChange={e => setAddMedicationPopup({ ...addMedicationPopup, name: e.target.value })}
                            className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setAddMedicationPopup(null)}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white text-lg rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMedication}
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-lg transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Appointments;