import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmpserviceService } from '../empservice.service';

@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.scss']
})
export class EmployeelistComponent {
  constructor(private router: Router, private employeeService: EmpserviceService) {

  }

  ngOnInit() {
    this.getEmployee();
  }

  async getEmployee() {
    const allEmployees = await this.employeeService.getAllEmployees();
    const today = new Date().toISOString().split('T')[0];

    // Filter employees
    this.currentEmployees = allEmployees.filter(employee => !employee.endDate || employee.endDate >= today);
    this.previousEmployees = allEmployees.filter(employee => employee.endDate && employee.endDate < today);
  }

  currentEmployees: any = [];

  previousEmployees: any = [];

  draggedDistance: number[] = [];
  previousDraggedDistance: number[] = [];
  startX: number | null = null;
  showDeleteMessage = false; // New flag for delete message

  startSwipe(index: number, type: string, event: MouseEvent | TouchEvent): void {
    this.startX = this.getClientX(event);
    if (type === 'current') {
      this.draggedDistance[index] = 0;
    } else if (type === 'previous') {
      this.previousDraggedDistance[index] = 0;
    }
  }

  onSwipe(index: number, type: string, event: MouseEvent | TouchEvent): void {
    if (this.startX === null) return;
    const movement = Math.max(0, this.startX - this.getClientX(event));
    event.preventDefault();

    if (type === 'current') {
      this.draggedDistance[index] = movement;
    } else if (type === 'previous') {
      this.previousDraggedDistance[index] = movement;
    }
  }

  endSwipe(index: number, type: string): void {
    const threshold = 100; // Improved threshold for smoother deletion
    if (type === 'current') {
      if (this.draggedDistance[index] > threshold) {
        this.deleteEmployee(index, 'current');
      }
      this.draggedDistance[index] = 0;
    } else if (type === 'previous') {
      if (this.previousDraggedDistance[index] > threshold) {
        this.deleteEmployee(index, 'previous');
      }
      this.previousDraggedDistance[index] = 0;
    }
    this.startX = null;
  }

  // deleteEmployee(index: number, type: string): void {
  //   if (type === 'current') {
  //     this.currentEmployees.splice(index, 1);
  //   } else if (type === 'previous') {
  //     this.previousEmployees.splice(index, 1);
  //   }
  //   this.showDeleteMessage = true;
  //   setTimeout(() => this.showDeleteMessage = false, 3000); // Auto-hide after 3 seconds
  // }

  addEmployee(): void {
    this.router.navigateByUrl('/add-employee');

  }

  // Utility for handling both mouse and touch events
  private getClientX(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  }

  // showDeleteMessage = false;
  deletedEmployee: any = null; // Store deleted employee temporarily
  deletedEmployeeType: string = ''; // Track employee type

  // deleteEmployee(index: number, type: string): void {
  //   if (type === 'current') {
  //     this.deletedEmployee = this.currentEmployees.splice(index, 1)[0];
  //     this.deletedEmployeeType = 'current';
  //   } else if (type === 'previous') {
  //     this.deletedEmployee = this.previousEmployees.splice(index, 1)[0];
  //     this.deletedEmployeeType = 'previous';
  //   }

  //   this.showDeleteMessage = true;

  //   // Auto-hide delete message after 5 seconds
  //   setTimeout(() => {
  //     this.showDeleteMessage = false;
  //     this.deletedEmployee = null;
  //   }, 5000);
  // }

  async deleteEmployee(index: number, type: string): Promise<void> {
    let deletedEmployee;

    if (type === 'current') {
      deletedEmployee = this.currentEmployees.splice(index, 1)[0];
      this.deletedEmployeeType = 'current';
    } else if (type === 'previous') {
      deletedEmployee = this.previousEmployees.splice(index, 1)[0];
      this.deletedEmployeeType = 'previous';
    }

    if (deletedEmployee) {
      await this.employeeService.deleteEmployee(deletedEmployee.id); // Delete from IndexedDB
    }

    this.deletedEmployee = deletedEmployee;
    this.showDeleteMessage = true;

    // Auto-hide delete message after 5 seconds
    setTimeout(() => {
      this.showDeleteMessage = false;
      this.deletedEmployee = null;
    }, 5000);
  }

  undoDelete(): void {
    if (this.deletedEmployee) {
      if (this.deletedEmployeeType === 'current') {
        this.currentEmployees.push(this.deletedEmployee);
      } else if (this.deletedEmployeeType === 'previous') {
        this.previousEmployees.push(this.deletedEmployee);
      }
    }

    this.showDeleteMessage = false;
    this.deletedEmployee = null;
  }
  editEmployee(employeeId: number){
    this.router.navigate(['/edit-employee', employeeId]);
  }
}

