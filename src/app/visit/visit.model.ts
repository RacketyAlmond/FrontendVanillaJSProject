import { Student } from 'src/app/students/student.model';

export interface Visit {
  id?: number;
  patientName: string;
  patientSurname: string;
  email: string;
  date: string;
  note: string;
  student?: Student; // Optional student field
}
