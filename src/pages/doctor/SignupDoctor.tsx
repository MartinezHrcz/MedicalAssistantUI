import * as Yup from "yup";
import axios from "axios";
import {Formik, Form, Field, ErrorMessage } from "formik";
import {useNavigate} from "react-router-dom";

type LoginFormsInput = {
    name: string;
    email: string;
    address?: string;
    phone: string;
    password: string;
}

const validation = Yup.object().shape({
    name: Yup.string().required("Name is required")
        .matches(/^[A-Za-zÀ-ž s'-]{2,50}$/,
            "Name should only contain letters, spaces or hypens!"),
    email: Yup.string().required("Email is required")
        .email("Enter a valid email address"),
    phone: Yup.string().required("Phone number is required"),
    password: Yup.string().required("Field is required!").min(8)
        .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            "Password should be at least 8 characters long, have at least 1 uppercase 1 lowercase and a special character.")
});

export function SignupDoctor(){
    const navigate = useNavigate();

    const handleSignup = async (values: LoginFormsInput) => {
        try {
            const payload = {
                name: values.name,
                address: values.address,
                phone: values.phone,
                email: values.email,
                password: values.password
            };

            const endpoint = "http://localhost:5249/api/doctor";

            const response = await axios.post(endpoint, payload);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("doctor", JSON.stringify(response.data.doctor));

            navigate("/doctor/login");
        }
        catch (error) {
            console.log(error);
            alert("Sign up failed.");
        }
    }
    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <div className="shadow-green-lg rounded-lg w-full max-w-md px-8 py-8 shadow-md shadow-cyan-200">
                <h2 className={"text-3xl font-bold mb-8 text-center"}>Sign up</h2>
                <Formik
                    initialValues={{name: "",email: "", phone:"", address:"", password: ""}}
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
                                <label className="block mb-1 text-left text-lg">Email:</label>
                                <ErrorMessage name="email" component="div" className="text-red-500 text-left mb-1" />
                                <Field name="email" placeholder="example@gmail.com" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block mb-1 text-left text-lg">Phone number:</label>
                                <ErrorMessage name="phone" component="div" className="text-red-500 text-left mb-1" />
                                <Field name="phone" placeholder="06301112222" type="text" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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

                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                                Sign up!
                            </button>
                        </Form>
                    )}

                </Formik>
            </div>
        </div>
    );
}

export default SignupDoctor;