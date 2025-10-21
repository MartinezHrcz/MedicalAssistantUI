export interface DoctorDTO {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
}
export interface CreateDoctorDTO {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}
export interface UpdateDoctorDTO {
    name: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}
export interface LoginDoctorDTO {
    email: string;
    password: string;
}