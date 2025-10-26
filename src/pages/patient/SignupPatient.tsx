import * as Yup from "yup";
import axios from "axios";
import {Formik, Form, Field, ErrorMessage } from "formik";
import {useNavigate} from "react-router-dom";

type LoginFormsInput = {
    name: string;
    taj: string;
    address?: string;
    complaints?: string;
    password: string;
}

const validation = Yup.object().shape({
    name: Yup.string().required("Name is required")
        .matches(/^[A-Za-zÀ-ž s'-]{2,50}$/,
"Name should only contain letters, spaces or hypens!"),
    taj: Yup.string().required("Field is required!")
        .matches(/^\d{3}-\d{3}-\d{3}$/,
"TAJ format 123-456-789"),
    password: Yup.string().required("Field is required!").min(8)
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Password should be at least 8 characters long, have at least 1 uppercase 1 lowercase and a special character.")
});

export function SignupPatient(){
    const navigate = useNavigate();

    const handleSignup = async (values: LoginFormsInput) => {
        try {
            const payload = {
                name: values.name,
                taj: values.taj,
                address: values.address,
                complaints: values.complaints,
                password: values.password};

            const endpoint = "http://localhost:5249/api/patient";

            const response = await axios.post(endpoint, payload);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("patient", JSON.stringify(response.data.patient));

            navigate("/patient/login");
        }
        catch (error) {
            console.log(error);
            alert("Sign up failed.");
        }
    }
    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <div className="relative shadow-green-lg rounded-lg w-full max-w-md px-8 py-8 shadow-md shadow-cyan-200">
                <button className="absolute right-5 border border-red-600 text-center "
                        onClick={()=> navigate("/patient/login")}>X</button>
                <h2 className={"text-3xl font-bold mb-8 text-center"}>Sign up</h2>
                <Formik
                    initialValues={{name: "",taj: "", address:"", complaints:"", password: ""}}
                    validationSchema={validation}
                    onSubmit = {handleSignup}
                >
                    {()=> (
                        <Form className="space-y-6">
                            <div>
                                <label className="block mb-1 text-left text-lg">Name:</label>
                                <ErrorMessage name="name" component="div" className="text-red-500 text-left mb-1" />
                                <Field name="name" placeholder="John Doe" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                            </div>

                            <div>
                                <label className="block mb-1 text-left text-lg">Taj:</label>
                                <ErrorMessage name="taj" component="div" className="text-red-500 text-left mb-1" />
                                <Field name="taj" placeholder="Enter your Taj" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                            </div>
                            <div>
                                <label className="block mb-1 text-left text-lg">Address:</label>
                                <Field name="address" placeholder="Example street 6." type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block mb-1 text-left text-lg">Password:</label>
                                <ErrorMessage name="password" component="div" className="text-red-500 bg-red text-left mb-1" />
                                <Field name="password" placeholder="Enter your password" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

                            </div>

                            <div>
                                <label className="block mb-1 text-left text-lg">Complaints:</label>
                                <Field name="complaints" placeholder="Short description of your complaints" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

export default SignupPatient;