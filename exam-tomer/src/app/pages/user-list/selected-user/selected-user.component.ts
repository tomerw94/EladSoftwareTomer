import { UserService } from 'src/app/services/user.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { MatDialog } from '@angular/material/dialog';
import { GenericYesNoComponent } from 'src/app/components/dialogs/generic-yes-no/generic-yes-no.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum Mode {
  View,
  Edit,
  Add
}

@Component({
  selector: 'app-selected-user',
  templateUrl: './selected-user.component.html',
  styleUrls: ['./selected-user.component.scss']
})
export class SelectedUserComponent implements OnInit {

  @Input() user: User;
  @Output() deletedUser: EventEmitter<number> = new EventEmitter<number>(); // id of deleted user
  @Output() newUser: EventEmitter<User> = new EventEmitter<User>(); //update or create
  editedUser: User;
  mode: Mode = Mode.View;
  Mode = Mode; // variable for html

  readonly nameMaxLength = 30;
  readonly nameMinLength = 2;
  readonly email = new FormControl({ value: '', disabled: this.mode == Mode.View }, [Validators.required, Validators.email]);
  readonly name = new FormControl({ value: '', disabled: this.mode == Mode.View }, [Validators.required, Validators.minLength(this.nameMinLength),
  Validators.maxLength(this.nameMaxLength), Validators.pattern('^[a-zA-Z ]+$')]);

  emailErrorMessage = '';
  nameErrorMessage = '';
  readonly maxShowedPolicies = 20;

  isAddingUser: boolean = false;

  constructor(private userService: UserService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.updateSelectedUser();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.updateSelectedUser();
    }
  }

  updateSelectedUser() {
    this.editedUser = new User();
    this.editedUser.email = this.user.email;
    this.editedUser.name = this.user.name;
    this.mode = this.user.id ? Mode.View : Mode.Add; // only on create user the user wont have id
    this.name.setValue(this.editedUser.name);
    this.email.setValue(this.editedUser.email);
    this.enableForm(this.mode != Mode.View);
  }

  updateErrorMessage(field: string) {
    let formControl;
    if (field == 'email') {
      formControl = this.email;
    }
    else if (field == 'name') {
      formControl = this.name;
    }
    else {
      console.error("updateErrorMessage error: unknown field: " + field);
    }
    let error = '';
    if (formControl.hasError('required')) {
      error = 'You must enter a value.';
    } else if (formControl.hasError('email')) {
      error = 'Not a valid email.';
    } else if (formControl.hasError('maxlength')) {
      error = `Name is cannot be more than ${this.nameMaxLength} characters.`;
    } else if (formControl.hasError('minlength')) {
      error = `Name must be at least ${this.nameMinLength} characters.`;
    }
    else if (formControl.hasError('pattern')) {
      error = 'Name can only contain letters.'
    }
    if (field == 'email') {
      this.emailErrorMessage = error;
    }
    if (field == 'name') {
      this.nameErrorMessage = error;
    }

  }

  toggleEdit() {
    switch (this.mode) {
      case Mode.Add:
        console.error("Cannot edit while in Add mode");
        return;
      case Mode.Edit:
        this.editedUser = this.user;
        this.updateSelectedUser();
        this.mode = Mode.View;
        break;
      case Mode.View:
        this.mode = Mode.Edit;
        this.editedUser = this.user;
        break;
      default:
        console.error("toggleEdit: Unknown mode");
        break;
    }
    this.enableForm(this.mode != Mode.View);
  }

  enableForm(val: boolean) {
    if (val) {
      this.name.enable();
      this.email.enable();
    }
    else {
      this.name.disable();
      this.email.disable();
    }
  }

  async onDelete() {
    if (this.mode != Mode.Edit) {
      console.error("Cannot delete while not in Edit mode");
      return;
    }
    if (!this.editedUser.id) {
      console.error("Delete user error, invalid id");
      return;
    }
    const dialogRef = this.dialog.open(GenericYesNoComponent, {
      data: {
        title: "Delete " + this.user.name,
        confirmText: "Delete User",
        description: `Are you sure you want to delete ${this.user.name}?`
      }
    });
    dialogRef.afterClosed().subscribe(async res => {
      if (res) {
        let result = await this.userService.deleteUser(this.editedUser.id);
        if (!result) {
          console.error(`Delete user with userId: ${this.editedUser.id} failed`);
          return;
        }
        this.deletedUser.emit(this.editedUser.id);
      }

    });
  }


  async onConfirm() {
    if (this.mode == Mode.View) {
      console.error("inValid mode");
      return;
    }
    this.editedUser.name = this.name.value;
    this.editedUser.email = this.email.value;
    let receivedUser;
    if (this.mode == Mode.Add) {
      receivedUser = await this.userService.createUser(this.editedUser);
    }
    else {
      receivedUser = await this.userService.updateUser(this.editedUser);
    }
    if (receivedUser) {
      if (!receivedUser.policies) {
        receivedUser.policies = [];
      }
      this.openSnackBar(`${this.mode == Mode.Add ? "Added" : "Updated"} User Successfully`, `${this.mode == Mode.Add ? "Add" : "Update"} User`);
      this.mode = Mode.View;
      this.enableForm(false);
      this.newUser.emit(receivedUser);
    }
    else {
      this.openSnackBar(`Failed to ${this.mode == Mode.Add ? "Add" : "Update"} User`, `${this.mode == Mode.Add ? "Add" : "Update"} User`);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'left'
    })
  }

}
