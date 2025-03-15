import { Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';

export interface Employee {
  id: number;
  name: string;
  role: string;
  joiningDate: string;
  endDate?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class EmpserviceService {
  private db: IDBPDatabase | undefined;

  constructor() { 
    this.initDB();
  }
  async initDB() {
    this.db = await openDB('EmployeeDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('employees')) {
          db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
        }
      }
    });
  }
    // Add Employee
    async addEmployee(employee: any): Promise<void> {
      if (!this.db) await this.initDB();
      await this.db?.add('employees', employee);
  }
  // Update Employee by ID
  async updateEmployeeById(id: number, updatedData: any): Promise<void> {
    if (!this.db) await this.initDB();

    const transaction = this.db?.transaction('employees', 'readwrite');
    const store = transaction?.objectStore('employees');

    if (!store) {
      console.error('Object store "employees" not found.');
      return;
    }
    const existingEmployee = await store.get(id);
    if (existingEmployee) {
      await store.put({ ...existingEmployee, ...updatedData, id });
      console.log(`Employee with ID ${id} updated successfully.`);
    }
  }
    // Get All Employees
    async getAllEmployees(): Promise<Employee[]> {
      if (!this.db) await this.initDB();
      return await this.db?.getAll('employees') || [];
    }
  
    // Delete Employee
    async deleteEmployee(id: number): Promise<void> {
      if (!this.db) await this.initDB();
      await this.db?.delete('employees', id);
    }
    async getEmployeeById(employeeId: number): Promise<any> {
      const employees = await this.getAllEmployees();
      return employees.find(emp => emp.id === employeeId);
    }
}
