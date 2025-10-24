import {useNavigate} from "react-router-dom";

export function StartPage() {
    const navigate = useNavigate();
    return(
        <>
            <div className="flex h-auto min-h-[95vh] w-full gap-10">
                <div className="flex flex-col justify-center items-center basis-1/3 gap-20">
                    <button className="btn btn-primary w-full h-auto py-5 text-2xl" onClick={()=>navigate("/doctor/login")}>
                        Doctor
                    </button>
                    <button className="btn btn-primary w-full py-5 text-2xl" onClick={()=>navigate("/patient/login")}>
                        Patient
                    </button>
                </div>

                <div className="w-px bg-gray-300"></div>

                <div className="flex flex-col justify-center basis-2/3 gap-20">
                    <h1>
                        Medical Assistant
                    </h1>
                    <div className="bg-gray-300 border border-black-300 rounded-lg px-3 py-3">
                        <p>sdfjlsfjlskfj</p>
                        <p>lksjdflsj</p>
                        <p>slkdfjlsdk</p>
                    </div>
                </div>
            </div>
        </>
    );
}