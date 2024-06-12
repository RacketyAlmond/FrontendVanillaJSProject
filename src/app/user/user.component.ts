import { Component, OnInit } from '@angular/core';
import { VisitService } from '../services/visit.service';
import { Visit } from 'src/app/visit/visit.model';
import { StudentService } from '../students/student.service';
import { Student } from '../students/student.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  studentList: Student[] = [];
  filteredStudents: Student[] = [];
  student?: Student;
  visits: Visit[] = [];
  filteredVisits: Visit[] = [];
  sortedStudents: Student[] = [];
  sortedVisits: Visit[] = [];
  newVisit: Visit = { patientName: '', patientSurname: '', email: '', date: '', note: '' };
  visitToUpdate?: Visit;
  username: string = '';
  email: string = '';
  sortBy: string = 'date';
  studentSortBy: string = 'surname';
  sortDirection: { [key: string]: boolean } = { date: true, surname: true };
  studentSortDirection: { [key: string]: boolean } = { surname: true, telephone: true };
  searchTerm: string = '';
  studentSearchTerm: string = '';

  constructor(private visitService: VisitService, private studentService: StudentService) {}

  ngOnInit() {
    this.getUsername();
    //this.email();
  }

  getEmail(): void {
    this.visitService.getEmail().subscribe(email => {
      this.email = email;
      console.log("email is ");
      console.log(this.email);
      this.getVisits();
    }, error => {
      console.error('Error fetching email:', error);
    });
  }

  getUsername(): void {
    this.visitService.getUsername().subscribe(username => {
      this.username = username;
      console.log("username is ");
      console.log(this.username);
      this.getVisits();
      this.getStudents();
    }, error => {
      console.error('Error fetching username:', error);
    });
  }

  getVisits(): void {
    this.visitService.getVisits().subscribe(data => {
      this.visits = data.filter(visit => visit.patientName === this.username);
      this.filteredVisits = [...this.visits];
      this.sortVisits();
    }, error => {
      console.error('Error fetching visits:', error);
    });
  }

  getStudents(): void {
    this.studentService.getStudents().subscribe(data => {
      this.studentList = data.filter(student => student.firstname === this.username);
      this.filteredStudents = [...this.studentList];
      this.sortStudents();
    }, error => {
      console.error('Error fetching students:', error);
    });
  }

  // Sorting and filtering methods for visits
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
      default:
        this.filteredVisits.sort((a, b) => direction * (new Date(a.date).getTime() - new Date(b.date).getTime()));
        break;
    }
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

  // Sorting and filtering methods for students
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

  // Existing methods for visits...

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
}
