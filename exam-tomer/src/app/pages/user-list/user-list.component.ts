import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { PoliciesPipe } from 'src/app/pipes/policiesPipe';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'email', 'actions'];

  users: User[] = [];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>(this.users);
  loading: boolean = false;
  selectedUser: User;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private userSerivce: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.updateUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onAddNewUser() {
    this.selectedUser = new User();
  }

  async updateUsers() {
    this.loading = true;
    this.users = await this.userSerivce.getAllUsers();
    this.dataSource = new MatTableDataSource<User>(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
  }

  async selectUser(user: User) {
    //User-list doesn't contain user policies data., Could be adjusted if preferred otherwise.
    this.selectedUser = user; // having selectedUser without policies until receive them.
    if (!user.policies) {
      this.selectedUser.policies = [];
    }
    this.selectedUser = await this.userSerivce.getUser(user.id); // updating selectedUser to contain policies.
  }

  onNewUser(newUser: User) {
    let index = this.users.findIndex(u => u.id == newUser.id);
    if (index > -1) {
      this.users[index] = newUser;
    }
    else {
      this.users.push(newUser);
    }
    this.updateUsers();
  }

  onDeletedUser(userId: number) {
    if (this.selectedUser.id == userId) {
      this.selectedUser = undefined;
    }
    this.users = this.users.filter(u => u.id != userId);
    this.updateUsers();
  }

  onUserDetails(user: User, event: Event) {
    event.stopPropagation();
    this.router.navigate(['user-details', { userId: user.id }]);
  }

}
