export interface PatientDTO {
    id: number;
    name: string;
    address: string;
    taj:string;
    complaints: string;
    timeOfAdmission: Date;
    doctorId: number;
}
export interface MedicationDTO{
    id: string;
    title: string;
    name: string;
}

export interface PatientMedicationDTO {
    id: number;
    taj: string;
    medication: MedicationDTO[];
}