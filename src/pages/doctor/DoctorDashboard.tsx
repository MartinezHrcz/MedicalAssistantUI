import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";
import {doctorDashLinks} from "../Dashnavlinks.ts";
import axios from "axios";

function DoctorDashboard(){
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    const [updatePopup, setUpdatePopup] = useState<DoctorDTO |null> (null);

    useEffect(() => {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
            setDoctor(JSON.parse(storedDoctor));
        }
    }, []);

    const handleOpenUpdatePopup = (doctor: DoctorDTO) => {
        setUpdatePopup(doctor);
    }

    const handleChange = (field: keyof DoctorDTO, value: string) => {
        if (updatePopup) {
            setUpdatePopup({ ...updatePopup, [field]: value });
        }
    };

    const handleSave = async () => {
        if (!updatePopup) {
            return;
        }
        try{
            console.log(updatePopup.id);
            const {data: updateDoctor} = await axios.post(
                `http://localhost:5249/api/doctor/${updatePopup.id}`,
                updatePopup,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setDoctor(updateDoctor);
            localStorage.setItem("doctor", JSON.stringify(updateDoctor));
            setUpdatePopup(null);
            alert("Profile updated successfully.");
        }
        catch(err){
            console.log(err);
            alert("Failed to update profile");
        }
    }

    const handleClose = () => {
        setUpdatePopup(null);
    };


    if (!doctor) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-white text-lg">Loading...</p>
        </div>);
    }
    const navLinks = doctorDashLinks;

    return(
        <div>
            <NavBar title={`Dr. ${doctor.name}'s panel`} links={navLinks} showlogout={true} />
            <h1 className="text-2xl font-semibold mb-6 text-center">
                My Data:
            </h1>
            <div className="grid grid-cols-1 gap-y-2 gap-4 px-5">
                {Object.entries(doctor).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3 shadow-sm">
                        <p className="w-full text-2xl capitalize border-b ">{key}</p>
                        <p className="w-full text-xl break-words">{value}</p>
                    </div>
                ))}
            </div>

            <div className="flex justify-center items-center flex-row gap-5">
                <button
                    onClick={() => handleOpenUpdatePopup(doctor)}
                    className="mt-4 px-4 py-2 bg-blue-600 w-full text-white rounded"
                >
                    Edit Profile
                </button>
                <button
                    className="mt-4 px-4 py-2 bg-red-600 w-full text-white rounded">
                    Delete Profile
                </button>
            </div>


            { updatePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-blue-500 p-6 rounded shadow-lg w-96 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Update My Profile</h2>

                        <input
                            type="text"
                            placeholder="Name"
                            value={updatePopup.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Address"
                            value={updatePopup.address || ""}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            value={updatePopup.phone || ""}
                            onChange={(e) => handleChange("phoneNumber", e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={updatePopup.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full p-2 rounded"
                        />

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-700 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
}

export default DoctorDashboard