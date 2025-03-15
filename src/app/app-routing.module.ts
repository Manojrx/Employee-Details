import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeelistComponent } from './employeelist/employeelist.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo:'employeelist'
  },
  {
    path: 'employeelist',
    pathMatch: 'full',
    component: EmployeelistComponent
  },
  {
    path: 'addemployee',
    pathMatch: 'full',
    component: AddEmployeeComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
