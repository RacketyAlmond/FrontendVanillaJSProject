import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { VisitService } from '../services/visit.service';
import { Visit } from '../visit/visit.model'; // Adjust the import path as needed
import { StudentService } from '../students/student.service';
import { Student } from '../students/student.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  studentList: Student[] = [];
  filteredStudents: Student[] = [];
  student?: Student;
  visits: Visit[] = [];
  filteredVisits: Visit[] = [];
  newVisit: Visit = { patientName: '', patientSurname: '', email: '', date: '', note: '' };
  visitToUpdate?: Visit;
  studentToUpdate?: Student;
  searchTerm: string = '';
  studentSearchTerm: string = '';
  sortBy: string = 'date';
  studentSortBy: string = 'surname';
  sortDirection: { [key: string]: boolean } = { date: true, surname: true };
  studentSortDirection: { [key: string]: boolean } = { surname: true, telephone: true };
  selectedFiles: File[] = [];
  files: any[] = [];

  constructor(private visitService: VisitService, private studentService: StudentService) {}

  ngOnInit() {
    this.getVisits();
    this.getStudents();
  }

  getStudents(): void {
    this.studentService.getStudents()
      .subscribe(studentList => {
        this.studentList = studentList || [];
        this.filteredStudents = this.studentList;
        this.sortStudents();
      });
  }


  add(firstname: string, lastname: string, email: string, telephone: string, note: string): void {
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    note = note.trim();

    this.studentService.addStudent({ firstname, lastname, email, telephone, note } as Student)
      .subscribe({
        next: (student: Student) => {
          this.studentList.push(student);
          this.filteredStudents.push(student);
          this.sortStudents();
        },
        error: () => {},
        complete: () => {
          this.studentService.totalItems.next(this.studentList.length);
          console.log(this.studentList.length);
        }
      });
  }

  delete(student: Student): void {
    this.studentList = this.studentList.filter(c => c !== student);
    this.filteredStudents = this.filteredStudents.filter(c => c !== student); // Update filteredStudents
    this.studentService.deleteStudent(student).subscribe(() => {
      this.studentService.totalItems.next(this.studentList.length);
      console.log(this.studentList.length);
    });
  }

  scrollToVisitList() {
    const visitList = document.getElementById('visit-list');
    if (visitList) {
      visitList.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToPrescriptionList() {
    const prescriptionList = document.getElementById('prescription-list');
    if (prescriptionList) {
      prescriptionList.scrollIntoView({ behavior: 'smooth' });
    }
  }

  updateVisitAndUpdateScroll(visit: Visit) {
    this.populateVisitForUpdate(visit);
    this.scrollToUpdate();
  }


  scrollToUpdate() {
    const prescriptionList = document.getElementById('update-list');
    if (prescriptionList) {
      prescriptionList.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteAll(): void {
    this.studentService.deleteStudents().subscribe(() => {
      this.studentList.length = 0;
      this.filteredStudents.length = 0;
    });
  }

  update(firstname: string, lastname: string, email: string, telephone: string, note: string, chosenToUpdateStudent: Student): void {
    let id = chosenToUpdateStudent.id;
    firstname = firstname.trim();
    lastname = lastname.trim();
    email = email.trim();
    telephone = telephone.trim();
    note = note.trim();
    console.log(id);
    if (id != undefined) {
      this.studentService.updateStudent({ firstname, lastname, email, telephone } as Student, id)
        .subscribe({
          next: (student: Student) => {
            let index = this.studentList.indexOf(chosenToUpdateStudent);
            this.studentList[index] = student;
            this.filteredStudents[index] = student;
            this.sortStudents();
          },
          error: () => { },
          complete: () => {
            this.studentService.totalItems.next(this.studentList.length);
            console.log(this.studentList.length);
          }
        });
    }
  }

  toggleStudentSort(criteria: string): void {
    this.studentSortBy = criteria;
    this.studentSortDirection[criteria] = !this.studentSortDirection[criteria];
    this.sortStudents();
  }

  sortStudents(): void {
    const direction = this.studentSortDirection[this.studentSortBy] ? 1 : -1;
    switch (this.studentSortBy) {
      case 'surname':
        this.filteredStudents.sort((a, b) => direction * a.lastname.localeCompare(b.lastname));
        break;
      case 'telephone':
        this.filteredStudents.sort((a, b) => direction * a.telephone.localeCompare(b.telephone));
        break;
      default:
        this.filteredStudents.sort((a, b) => direction * a.lastname.localeCompare(b.lastname));
        break;
    }
  }

  filterStudents(): void {
    const searchTermLower = this.studentSearchTerm.toLowerCase();
    this.filteredStudents = this.studentList.filter(student =>
      student.firstname.toLowerCase().includes(searchTermLower) ||
      student.lastname.toLowerCase().includes(searchTermLower) ||
      student.email.toLowerCase().includes(searchTermLower) ||
      student.telephone.toLowerCase().includes(searchTermLower)
    );
  }

  filterVisits(): void {
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredVisits = this.visits.filter(visit =>
      visit.patientName.toLowerCase().includes(searchTermLower) ||
      visit.patientSurname.toLowerCase().includes(searchTermLower) ||
      visit.email.toLowerCase().includes(searchTermLower) ||
      visit.date.toLowerCase().includes(searchTermLower)
    );
  }

  @ViewChild('prescriptionForm') prescriptionForm!: ElementRef;



  addStudentToVisit(visit: Visit) {
    window.scrollTo(0, 0);

    this.prescriptionForm.nativeElement['patient-Name'].value = visit.patientName;
    this.prescriptionForm.nativeElement['patient-Surname'].value = visit.patientSurname;
    this.prescriptionForm.nativeElement['emailStudent'].value = visit.email;
    this.prescriptionForm.nativeElement['dateStudent'].value = visit.date;

  }


  getUsers(): void{

  }

  getVisits(): void {
    this.visitService.getVisits().subscribe(data => {
      this.visits = data;
      this.filteredVisits = data;
      this.sortVisits();
    }, error => {
      console.error('Error fetching visits:', error);
    });
  }

  addVisit(): void {
    if (!this.newVisit.patientName.trim() || !this.newVisit.patientSurname.trim() || !this.newVisit.date.trim()) {
      return;
    }
    this.visitService.addVisit(this.newVisit).subscribe((visit: Visit) => {
      this.visits.push(visit);
      this.filteredVisits.push(visit);
      this.sortVisits();
      this.newVisit = { patientName: '', patientSurname: '', email: '', date: '', note: '' };
    });
  }

  deleteVisit(visit: Visit): void {
    this.visits = this.visits.filter(v => v !== visit);
    this.filteredVisits = this.filteredVisits.filter(v => v !== visit);
    this.visitService.deleteVisit(visit).subscribe();
  }

  populateVisitForUpdate(visit: Visit): void {
    this.visitToUpdate = { ...visit };
    this.studentToUpdate = visit.student ? { ...visit.student } : undefined;
  }

  updateVisit(): void {
    if (this.visitToUpdate) {
      this.visitService.updateVisit(this.visitToUpdate).subscribe(updatedVisit => {
        const index = this.visits.findIndex(v => v.id === updatedVisit.id);
        if (index !== -1) {
          this.visits[index] = updatedVisit;
          this.filteredVisits[index] = updatedVisit;
          this.sortVisits();
        }
        this.visitToUpdate = undefined;
      });
    }
  }


  updateStudent(): void {
    if (this.studentToUpdate && this.visitToUpdate?.student) {
      this.studentService.updateStudent(this.studentToUpdate, 34).subscribe(updatedStudent => {
        if (this.visitToUpdate) {
          this.visitToUpdate.student = updatedStudent;
          this.visitService.updateVisit(this.visitToUpdate).subscribe(updatedVisit => {
            const index = this.visits.findIndex(v => v.id === updatedVisit.id);
            if (index !== -1) {
              this.visits[index] = updatedVisit;
              this.filteredVisits[index] = updatedVisit;
              this.sortVisits();
            }
            this.studentToUpdate = undefined;
          });
        }
      });
    }
    else {
      console.log("updateStudent condition not met")
    }
  }

  toggleSort(criteria: string): void {
    this.sortBy = criteria;
    this.sortDirection[criteria] = !this.sortDirection[criteria];
    this.sortVisits();
  }

  sortVisits(): void {
    const direction = this.sortDirection[this.sortBy] ? 1 : -1;
    switch (this.sortBy) {
      case 'date':
        this.filteredVisits.sort((a, b) => direction * (new Date(a.date).getTime() - new Date(b.date).getTime()));
        break;
      case 'surname':
        this.filteredVisits.sort((a, b) => direction * a.patientSurname.localeCompare(b.patientSurname));
        break;
      case 'id':
        this.filteredStudents.sort((a, b) => {
          if (a.id !== undefined && b.id !== undefined) {
            return direction * (a.id - b.id);
          } else {
            return 0;
          }
        });
        break;
      case 'firstname':
        this.filteredStudents.sort((a, b) => direction * a.firstname.localeCompare(b.firstname));
        break;
      default:
        this.filteredVisits.sort((a, b) => direction * (new Date(a.date).getTime() - new Date(b.date).getTime()));
        break;
    }
  }


}
