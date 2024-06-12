import { Component, OnInit } from '@angular/core';
import { Visit } from "./visit.model";
import { VisitService } from '../services/visit.service';

@Component({
  selector: 'app-visit',
  templateUrl: './visit.component.html',
  styleUrls: ['./visit.component.css']
})
export class VisitComponent implements OnInit {
  visits: Visit[] = [];
  newVisit: Visit = { patientName: '', patientSurname: '', email: '', date: '', note: '' };

  constructor(private visitService: VisitService) { }

  ngOnInit() {
    this.getVisits();
  }

  getVisits(): void {
    this.visitService.getVisits()
      .subscribe(visits => this.visits = visits);
  }

  addVisit(): void {
    if (!this.newVisit.patientName.trim() || !this.newVisit.patientSurname.trim() || !this.newVisit.date.trim()) {
      return;
    }
    this.visitService.addVisit(this.newVisit)
      .subscribe((visit: Visit) => {
        this.visits.push(visit);
        this.newVisit = { patientName: '', patientSurname: '', email: '', date: '', note: '' }; // Reset newVisit object
      });
  }

  deleteVisit(visit: Visit): void {
    this.visits = this.visits.filter(v => v !== visit);
    this.visitService.deleteVisit(visit).subscribe();
  }
}
