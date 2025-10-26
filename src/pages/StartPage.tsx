import {useNavigate} from "react-router-dom";

export function StartPage() {
    const navigate = useNavigate();
    return(
        <>
            <div className="flex flex-col lg:flex-row items-center justify-center min-h-[95vh] px-8 text-gray-900 w-screen">
                <div className="flex flex-col items-center justify-center gap-5 w-full lg:w-1/3 mb-10">
                    <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome</h1>
                    <p className="text-xl capitalize text-gray-50 text-center max-w-sm mb-6">
                        Choose your role to continue:
                    </p>

                    <div className="flex flex-col gap-6 w-full max-w-xs">
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-2xl py-4 rounded-lg shadow-md transition-transform hover:scale-[1.05]"
                            onClick={() => navigate("/doctor/login")}
                        >
                            Doctor
                        </button>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-2xl py-4 rounded-lg shadow-md transition-transform hover:scale-[1.05]"
                            onClick={() => navigate("/patient/login")}
                        >
                            Patient
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block w-1 blur bg-blue-300 mx-20 min-h-screen"></div>

                <div className="flex flex-col justify-center items-start w-full lg:w-1/3 max-w-xl">
                    <h2 className="text-5xl font-extrabold text-blue-800 mb-6">
                        Medical Assistant
                    </h2>
                    <div className=" text-xl bg-amber-50 border-gray-200 rounded-xl shadow-lg px-6 py-6 space-y-3">
                        <p className="text-gray-700 border-b-2 pb-1">
                            Streamline your healthcare management with an intuitive interface.
                        </p>
                        <p className="text-gray-700 border-b-2 pb-1">
                            Doctors can manage patients, view appointments, and prescribe
                            medications.
                        </p>
                        <p className="text-gray-700">
                            Patients can view their medical prescriptions and stay connected with
                            their doctors.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}