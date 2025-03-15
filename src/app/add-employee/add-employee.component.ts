import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { EmpserviceService } from '../empservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
  providers: [DatePipe]
})
export class AddEmployeeComponent {
  currentEmployees: any = [];
  employeeForm: FormGroup;
  employeeId: number | null = null;
  today: string = moment().format('YYYY-MM-DD')
  constructor(private fb: FormBuilder, private empService: EmpserviceService,private router: Router, private route: ActivatedRoute, private datePipe: DatePipe) {
    this.employeeForm = this.fb.group({
      employeeName: ['', Validators.required],
      employeeRole: ['', Validators.required],
      joiningDate: [this.today, Validators.required],
      endDate: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.employeeId = Number(params.get('id'));
      if (this.employeeId) {
        this.loadEmployeeData(this.employeeId);
      }
    });
  }
  async onSubmit() {
    if (this.employeeForm.valid) {
      const newEmployee = {
        id: new Date().getTime(), // Unique ID using timestamp
        name: this.employeeForm.value.employeeName,
        role: this.employeeForm.value.employeeRole,
        joiningDate: this.employeeForm.value.joiningDate,
        endDate: this.employeeForm.value.endDate
      };
      if(this.employeeId){
        await this.empService.updateEmployeeById(this.employeeId,newEmployee);
      }else{
        await this.empService.addEmployee(newEmployee);
      }
      // Reset the form
      this.employeeForm = this.fb.group({
        employeeName: ['', Validators.required],
        employeeRole: ['', Validators.required],
        joiningDate: [this.today, Validators.required],
        endDate: ['', Validators.required]
      });
      this.selectedRole = '';
      this.router.navigateByUrl('');
    }
  }


  showDropdown = false;
  selectedRole: string | null = null;

  roles = ['Product Designer', 'Flutter Developer', 'Full-Stack Developer', 'Senior Software developer'];

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectRole(role: string) {
    this.selectedRole = role;
    this.employeeForm.patchValue({ employeeRole: role });
    this.showDropdown = false;
  }
  @ViewChild('dateInput') dateInput!: ElementRef;
  @ViewChild('dateInputSecond') dateInputSecond!: ElementRef;

  openDatePicker(type: 'first' | 'second'): void {
    const inputElement =
      type === 'first'
        ? this.dateInput.nativeElement
        : this.dateInputSecond.nativeElement;

    if (inputElement && typeof inputElement.showPicker === 'function') {
      inputElement.showPicker(); // Chrome/Edge 99+ support
    } else {
      console.error('showPicker() is not supported in this browser.');
      inputElement.focus(); // Fallback for unsupported browsers
    }
  }

  async loadEmployeeData(employeeId: number) {
    const employee = await this.empService.getEmployeeById(employeeId);
    if (employee) {
      this.employeeForm.patchValue({
        employeeName: employee.name,
        employeeRole: employee.role,
        joiningDate: employee.joiningDate,
        endDate: employee.endDate
      });
      this.selectedRole = employee.role;
    }
  }
  formatDate(date: string): string {
    if (!date) {
      return 'Select Date'; // Display this when no date is chosen
    }
    if (date === this.today) {
      return 'Today'; // Display 'Today' if it matches the current date
    }

    return moment(date).format('D MMM, YYYY'); // Example: 5 Sep, 2022
  }

}
