import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";
import {doctorDashLinks} from "../Dashnavlinks.ts";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function DoctorDashboard(){
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    const [updatePopup, setUpdatePopup] = useState<DoctorDTO |null> (null);
    const [deletePopup, setDeletePopup] = useState(false);
    const [passwordPopup, setPasswordPopup] = useState(false);
    const [passwords, setPasswords] = useState({oldPassword: "", newPassword: ""});
    const deleteurl = `http://localhost:5249/api/doctor/delete/`;
    const navigate = useNavigate();

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

    const handleDelete = async () => {
        try{
            await axios.delete(deleteurl.concat(doctor?.id), {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            })
            setDoctor(null);
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
                `http://localhost:5249/api/doctor/pwd_update/${doctor?.id}`,
                passwords,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
            );

            alert("Password updated successfully!");
            setPasswords({ oldPassword: "", newPassword: "" });
            setPasswordPopup(false);
        } catch (err) {
            console.error(err || err.response);
            if (err.response?.status !== 400) {
                alert("Failed to update password.");
            } else {
                alert("Old password is incorrect.");
            }
        }
    };

    if (!doctor) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-white text-lg">Loading...</p>
        </div>);
    }
    const navLinks = doctorDashLinks;

    return(
        <div className="min-h-screen w-screen">
            <NavBar title={`Dr. ${doctor.name}'s panel`} links={navLinks} showlogout={true} />
            <h1 className="text-3xl font-bold mb-8 text-center">
                Signed in as: <span className="text-blue-200"> {doctor.name || "Patient"} </span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-6 px-5">
                {Object.entries(doctor).map(([key, value]) => (
                    <div key={key} className="bg-white text-black rounded-xl shadow p-4 transition-transform transform hover:scale-[1.02]">
                        <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">{key}</p>
                        <p className="text-gray-900 text-lg font-medium break-words">{value}</p>
                    </div>
                ))}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-gray-300">
                    <button
                        onClick={() => handleOpenUpdatePopup(doctor)}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl transition-all shadow-md"
                    >
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setDeletePopup(true)}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-xl transition-all shadow-md">
                        Delete Profile
                    </button>
                </div>
            </div>




            { updatePopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-blue-600 rounded-2xl shadow-2xl w-[420px] p-6 sm:p-8 space-y-5 border border-blue-200">
                        <h2 className="text-2xl font-bold text-center text-white">
                            Update Profile
                        </h2>
                        <div className="space-y-6">
                            <input
                                type="text"
                                placeholder="Name"
                                value={updatePopup.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={updatePopup.address || ""}
                                onChange={(e) => handleChange("address", e.target.value)}
                                className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={updatePopup.phone || ""}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={updatePopup.email || ""}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className="w-full bg-white p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                            />

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white text-lg rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-lg transition"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPasswordPopup(true)}
                                    className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-lg rounded-lg shadow transition"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {
                deletePopup && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                        <div className="bg-gray-200 rounded-2xl shadow-2xl w-[380px] p-6 sm:p-8 border-4 border-red-600 text-center space-y-6">
                            <h2 className="text-2xl font-bold text-red-600">Delete profile?</h2>
                            <p className="text-gray-700 text-base">
                                Are you sure you want to delete your profile? <br />
                                This action <span className="font-semibold">cannot be undone.</span>
                            </p>

                            <div className="flex justify-between gap-3 pt-4">
                                <button
                                    onClick={() => handleDelete()}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-lg rounded-lg transition">
                                    Delete Profile
                                </button>
                                <button
                                    onClick={() => setDeletePopup(false)}
                                    className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white text-lg rounded-lg transition">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {passwordPopup && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-blue-600  rounded-2xl shadow-2xl w-[420px] p-6 sm:p-8 space-y-5 border border-blue-200">
                        <h2 className="text-2xl font-bold text-center text-white">
                            Update Password
                        </h2>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={passwords.oldPassword}
                            onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
                        />

                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setPasswordPopup(false)}
                                className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white text-lg rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePassword}
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-lg rounded-lg transition"
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

export default DoctorDashboard