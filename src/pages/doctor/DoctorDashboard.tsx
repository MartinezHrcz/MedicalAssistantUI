import {useEffect, useState} from "react";
import type {DoctorDTO} from "../../types/DoctorDTO.ts";
import NavBar from "../../components/NavBar.tsx";

function DoctorDashboard(){
    const [doctor, setDoctor] = useState<DoctorDTO|null> (null);
    useEffect(() => {
        const storedDoctor = localStorage.getItem("doctor");
        if (storedDoctor) {
            setDoctor(JSON.parse(storedDoctor));
        }
    }, []);

    if (!doctor) {
        return <div>Loading...</div>;
    }
    const navLinks = [
        {name: "Home", path: "/dashboard"},
        {name: "About", path: "/patients"},
        {name: "Contact", path: "/appointments"}
    ];

    return(
        <div>
            <NavBar title={"NAVBAR"} links={navLinks} showlogout={true} />
            <h1 className="text-2x1">Doctor Dashboard</h1>
            <div className="space-y-2">
                {Object.entries(doctor).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                        <strong>{key}: </strong> {value}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoctorDashboard