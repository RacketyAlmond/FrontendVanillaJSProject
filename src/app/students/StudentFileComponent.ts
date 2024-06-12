import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-file',  // Change this to the appropriate selector
  templateUrl: './student-file.component.html', // Ensure the template path is correct
  styleUrls: ['./student-file.component.css']   // Ensure the stylesheet path is correct
})
export class StudentFileComponent implements OnInit {
  selectedFiles: File[] = [];
  files: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getFiles();
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFiles(): void {
    const formData: FormData = new FormData();
    for (const file of this.selectedFiles) {
      formData.append('files', file, file.name);
    }
    this.http.post('/api/files/upload', formData).subscribe(response => {
      console.log('Files uploaded successfully');
      this.getFiles();
    }, error => {
      console.error('Error uploading files', error);
    });
  }

  getFiles(): void {
    this.http.get<any[]>('/api/files').subscribe(files => {
      this.files = files;
    }, error => {
      console.error('Error fetching files', error);
    });
  }

  downloadFile(fileName: string): void {
    this.http.get(`/api/files/download/${fileName}`, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Error downloading file', error);
    });
  }
}
