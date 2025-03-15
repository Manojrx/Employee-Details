import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { find } from 'rxjs';
import { EmpserviceService } from './empservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  modifiedValue: string = '';
  pageTitle: string | null = null;
  employeeId: number;
  isValidRoute: boolean = true;
  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmpserviceService,) {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id')); 
   
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;

      if (currentUrl.includes('/employeelist')) {
        this.pageTitle = 'Employee List';
      } else if (currentUrl.includes('/add-employee')) {
        this.pageTitle = 'Add Employee Details';
      } else if(currentUrl.includes('/edit-employee')) {
        this.pageTitle = 'Edit Employee';
      }else{
        this.pageTitle = '' ;
      }
    });
  }
  
  deleteItem() {
    const employeeId = Number(this.route.snapshot.paramMap.get('id')) ||
      Number(window.location.pathname.split('/').pop()); 

    if (!isNaN(employeeId) && employeeId > 0) { 
      this.employeeService.deleteEmployee(employeeId).then(() => {
        console.log(`Employee with ID ${employeeId} deleted successfully`);
        this.router.navigateByUrl('/employeelist');
      }).catch(error => {
        console.error('Error deleting employee:', error);
      });
    } else {
      console.warn('Invalid Employee ID:', employeeId);
    }
  }




}
