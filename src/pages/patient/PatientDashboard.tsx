import {useEffect, useState} from "react";
import NavBar from "../../components/NavBar.tsx";
import type {PatientDTO} from "../../types/PatientDTO.ts";
import {patientDashboardLinks} from "../Dashnavlinks.ts";
import axios from "axios";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import {useNavigate} from "react-router-dom";


function PatientDashboard() {
    const [patient, setPatient] = useState<PatientDTO|null> (null);
    const [updatePopup, setUpdatePopup] = useState<PatientDTO |null> (null);
    const [deletePopup, setDeletePopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false);
    const [passwords, setPasswords] = useState({oldPassword: "", newPassword: ""});
    const deleteurl = `http://localhost:5249/api/patient/`;
    const navigate = useNavigate();


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

    const handleOpenUpdatePopup = (patient: PatientDTO) => {
        setUpdatePopup(patient);
    }

    const handleChange = (field: keyof PatientDTO, value: string) => {
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
            const {data: updatePatient} = await axios.put(
                `http://localhost:5249/api/patient/${updatePopup.id}`,
                updatePopup,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setPatient(updatePatient);
            localStorage.setItem("patient", JSON.stringify(updatePatient));
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

    const handleDelete = async () => {
        try{
            await axios.delete(deleteurl.concat(patient?.id), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            setPatient(null);
            setUpdatePopup(null);
            alert("Profile deleted successfully.");
            navigate('/');
        }
        catch(err){
            console.log(err);
            alert("Failed to delete profile");
        }
    }

    const handleUpdatePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword) {
            alert("Please fill in both fields.");
            return;
        }

        try {
            await axios.put(
                `http://localhost:5249/api/patient/pwdupdate/${patient?.id}`,
                passwords,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            alert("Password updated successfully!");
            setPasswords({ oldPassword: "", newPassword: "" });
            setPasswordPopup(false);
        } catch (err) {
            console.error(err.response || err);
            if (err.response?.status !== 400) {
                alert("Failed to update password.");
            } else {
                alert("Old password is incorrect.");
            }
        }
    };

    if (!patient) {
        return <div>Loading...</div>;
    }
    const navLinks = patientDashboardLinks;

    return(
        <div className="min-h-screen w-screen">
            <NavBar title={"Profile"} links={navLinks} showlogout={true} />
            <h1 className="text-2xl font-semibold mb-6 text-center">
                Signed in as: {patient.name || "Patient"}
            </h1>
            <div className="grid grid-cols-1 gap-y-2 gap-4 px-5">
                {Object.entries(patient).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3 shadow-sm">
                        <p className="w-full text-2xl uppercase border-b">{key}</p>
                        <p className="w-full text-xl break-words">{value || 'Not given'}</p>
                    </div>
                ))}
                <div className="flex justify-center items-center flex-row gap-5">
                    <button
                        onClick={() => handleOpenUpdatePopup(patient)}
                        className="mt-4 px-4 py-2 bg-blue-600 w-full text-white rounded"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setDeletePopup(true)}
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
                            placeholder="Complaints"
                            value={updatePopup.complaints || ""}
                            onChange={(e) => handleChange("complaints", e.target.value)}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Taj"
                            value={updatePopup.taj}
                            onChange={(e) => handleChange("taj", e.target.value)}
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
                            <button
                                type="button"
                                onClick={() => setPasswordPopup(true)}
                                className="px-4 py-2 bg-yellow-500 w-full text-white rounded"
                            >
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )
            }

            {
                deletePopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-blue-500 p-6 rounded shadow-lg w-96 space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Delete profile?</h2>
                            <div className="flex justify-center items-center flex-row gap-5">
                                <button
                                    onClick={() => handleDelete()}
                                    className="px-4 py-2 bg-red-600 w-full text-white rounded">
                                    Yes
                                </button>
                                <button
                                    onClick={() => setDeletePopup(false)}
                                    className="px-4 py-2 bg-green-600 w-full text-white rounded">
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
                {passwordPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-blue-500 p-6 rounded shadow-lg w-96 space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Update Password</h2>
                            <input
                                type="password"
                                placeholder="Old Password"
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                                className="w-full p-2 rounded"
                            />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                className="w-full p-2 rounded"
                            />

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => setPasswordPopup(false)}
                                    className="px-4 py-2 bg-gray-700 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdatePassword}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {passwordPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-blue-500 p-6 rounded shadow-lg w-96 space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Update Password</h2>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                            className="w-full p-2 rounded"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full p-2 rounded"
                        />

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setPasswordPopup(false)}
                                className="px-4 py-2 bg-gray-700 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePassword}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientDashboard;