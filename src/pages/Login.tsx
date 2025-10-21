import * as Yup from "yup";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {useNavigate} from "react-router-dom";

type LoginFormsInput = {
    email: string;
    password: string;
}

const validation = Yup.object().shape({
    email: Yup.string().required("Email is required!").email(),
    password: Yup.string().required("Password is required!").min(8),
});

export function Login(){
    const navigate = useNavigate();

    const handleLogin = async (values: LoginFormsInput) => {
        try {
            const payload = {email: values.email, password: values.password};

            const endpoint = "http://localhost:5249/api/doctor/login";

            const response = await axios.post(endpoint, payload);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("doctor", JSON.stringify(response.data.doctor));

            navigate("/dashboard");
        }
        catch (error) {
            console.log(error);
            alert("Login failed.");
        }
    }

    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <div className="bg-white shadow-md rounded-lg w-full max-w-md">
                <h2 className={"text-2x1 font bold mb-6 text-center"}>Login</h2>
                <Formik
                initialValues={{email: "", password: "",}}
                validationSchema={validation}
                onSubmit = {handleLogin}
                >
                    {()=> (
                        <Form className="space-y-6">
                            <div>
                                <label className="block mb-1">Email:</label>
                                <Field name="email" type="text" className="w-full px-2" />
                                <ErrorMessage name="email" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block mb-1">Password:</label>
                                <Field name="password" type="text" className="w-full px-2" />
                                <ErrorMessage name="password" component="div" className="text-red-500" />
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