import * as Yup from "yup";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {useNavigate} from "react-router-dom";

type LoginFormsInput = {
    email: string;
    password: string;
}

const validation = Yup.object().shape({
    email: Yup.string().required("Field is required!").email(),
    password: Yup.string().required("Field is required!").min(8),
});

export function LoginDoctor(){
    const navigate = useNavigate();

    const handleLogin = async (values: LoginFormsInput) => {
        try {
            const payload = {email: values.email, password: values.password};

            const endpoint = "http://localhost:5249/api/doctor/login";

            const response = await axios.post(endpoint, payload);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("doctor", JSON.stringify(response.data.doctor));

            navigate("/doctor/dashboard");
        }
        catch (error) {
            console.log(error);
            alert("LoginDoctor failed.");
        }
    }

    return (
        <div className={"min-h-screen flex items-center justify-center "}>
            <div className="shadow-green-lg rounded-lg w-full max-w-md px-8 py-8 shadow-md shadow-cyan-200">
                <h2 className={"text-3xl font-bold mb-8 text-center"}>Login</h2>
                <Formik
                initialValues={{email: "", password: "",}}
                validationSchema={validation}
                onSubmit = {handleLogin}
                >
                    {()=> (
                        <Form className="space-y-6">
                            <div>
                                <label className="block mb-1 text-left text-lg">Email:</label>
                                <ErrorMessage name="email" component="div" className="text-red-500 text-left mb-1" />
                                <Field name="email" placeholder="Enter your email" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

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
                <div className="border-t border-gray-200 mt-4">
                    <label className="block mb-1 text-left text-lg mb-2 mt-2">Don't have an account?</label>
                    <button className="w-full bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition" onClick={()=> navigate("/doctor/signup")}>Sign up!</button>
                </div>
            </div>
        </div>
    );
}