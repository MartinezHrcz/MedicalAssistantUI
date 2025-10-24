import * as Yup from "yup";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {useNavigate} from "react-router-dom";

type LoginFormsInput = {
    taj: string;
    password: string;
}

const validation = Yup.object().shape({
    taj: Yup.string().required("Field is required!").matches(/^\d{3}-\d{3}-\d{3}$/, "TAJ format 123-456-789"),
    password: Yup.string().required("Field is required!").min(8),
});

export function LoginPatient(){
    const navigate = useNavigate();

    const handleLogin = async (values: LoginFormsInput) => {
        try {
            const payload = {taj: values.taj, password: values.password};

            const endpoint = "http://localhost:5249/api/patient/login";

            const response = await axios.post(endpoint, payload);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("patient", JSON.stringify(response.data.patient));

            navigate("/patient/dashboard");
        }
        catch (error) {
            console.log(error);
            alert("Login failed.");
        }
    }

    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <div className="shadow-green-lg rounded-lg w-full max-w-md px-8 py-8 shadow-md shadow-cyan-200">
                <h2 className={"text-3xl font-bold mb-8 text-center"}>Login</h2>
                <Formik
                    initialValues={{taj: "", password: "",}}
                    validationSchema={validation}
                    onSubmit = {handleLogin}
                >
                    {()=> (
                        <Form className="space-y-6">
                            <div>
                                <label className="block mb-1 text-left text-lg">Email:</label>
                                <ErrorMessage name="taj" component="div" className="text-red-500 text-left mb-1" />
                                <Field name="taj" placeholder="Enter your TAJ number" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                            </div>
                            <div>
                                <label className="block mb-1 text-left text-lg">Password:</label>
                                <ErrorMessage name="password" component="div" className="text-red-500 bg-red text-left mb-1" />
                                <Field name="password" placeholder="Enter your password" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                                Login
                            </button>
                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    );
}