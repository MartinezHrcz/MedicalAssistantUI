import {useEffect, useState} from "react";
import NavBar from "../../components/NavBar.tsx";
import type {PatientDTO} from "../../types/PatientDTO.ts";

function DoctorDashboard(){
    const [doctor, setDoctor] = useState<PatientDTO|null> (null);
    useEffect(() => {
        const storedDoctor = localStorage.getItem("patient");
        if (storedDoctor) {
            setDoctor(JSON.parse(storedDoctor));
        }
    }, []);

    if (!doctor) {
        return <div>Loading...</div>;
    }
    const navLinks = [
        {name: "Home", path: "/patient/dashboard"},
        {name: "About", path: "/patients"},
        {name: "Contact", path: "/appointments"}
    ];

    return(
        <div>
            <NavBar title={"NAVBAR"} links={navLinks} showlogout={true} />
            <h1 className="text-2xl font-semibold mb-6 text-center">
                Signed in as: {doctor.name || "Patient"}
            </h1>
            <div className="grid grid-cols-1 gap-y-2 gap-4 px-5">
                {Object.entries(doctor).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-3 shadow-sm">
                        <p className="w-full text-2xl capitalize border-b">{key}</p>
                        <p className="w-full text-xl break-words">{value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoctorDashboard