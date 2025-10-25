import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";
import {doctorDashLinks} from "../Dashnavlinks.ts";

function DoctorDashboard(){
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    useEffect(() => {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
            setDoctor(JSON.parse(storedDoctor));
        }
    }, []);

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
        </div>
    );
}

export default DoctorDashboard