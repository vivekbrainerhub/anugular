import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  newUser: boolean = false;
  userObj: User = new User();
  userList: User[] = [];
  selectedUser: User | null = null;

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    const localData = localStorage.getItem('userData');
    this.userList = localData ? JSON.parse(localData) : [];
  }

  changeView() {
    this.newUser = !this.newUser;
  }

  onSave() {
    if (!this.userObj.fName || !this.userObj.lName || !this.userObj.uName) {
      alert('Please fill out all required fields.');
      return;
    }

    this.userObj.userId =
      this.userList.length > 0
        ? Math.max(...this.userList.map((user) => user.userId)) + 1
        : 1;

    this.userList = [...this.userList, { ...this.userObj }];
    localStorage.setItem('userData', JSON.stringify(this.userList));
    this.toastr.success('User added successfully', 'Success');
    this.userObj = new User();
  }

  deleteUser(index: number) {
    this.userList.splice(index, 1);
    this.userList = [...this.userList]; 
    localStorage.setItem('userData', JSON.stringify(this.userList));
    this.toastr.warning('User deleted successfully', 'Deleted');
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
  }

  saveEditedUser() { 
    if (this.selectedUser) {
      const index = this.userList.findIndex((u) => u.userId === this.selectedUser?.userId);
      if (index !== -1) {
        this.userList[index] = { ...this.selectedUser };
        localStorage.setItem('userData', JSON.stringify(this.userList));
        this.toastr.info('User updated successfully', 'Updated');
      }
      this.selectedUser = null;
    }
  }

  closeModal() {
    this.selectedUser = null;
  }
} 

class User {
  userId: number;
  fName: string;
  lName: string;
  uName: string;
  city: string;
  state: string;
  zip: number;
  isAgree: boolean;

  constructor() {
    this.userId = 0;
    this.fName = '';
    this.lName = '';
    this.uName = '';
    this.city = '';
    this.state = '';
    this.zip = 0;
    this.isAgree = false;
  }
}
