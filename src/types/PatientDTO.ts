export interface PatientDTO {
    id: number;
    name: string;
    address: string;
    taj:string;
    complaints: string;
    timeOfAdmission: Date;
    doctorId: number;
}
export interface CreatePatientDTO {
    name: string;
    address: string;
    taj: string;
    complaints: string;
    password: string;
}
export interface UpdatePatientDTO {
    name: string;
    address: string;
    taj: string;
    complaints: string;
}
export interface LoginPatientDTO {
    taj: string;
    password: string;
}