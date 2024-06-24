import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';
import { User } from 'src/app/models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy } from 'src/app/models/policy';
import { PoliciesService } from 'src/app/services/policies.service';
import { UserService } from 'src/app/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InsurancePolicyFormComponent } from '../insurance-policy-form/insurance-policy-form.component';
import { GenericYesNoComponent } from 'src/app/components/dialogs/generic-yes-no/generic-yes-no.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  isEdit: boolean = true;
  loading: boolean = false;
  readonly nameMaxLength = 30;
  readonly nameMinLength = 2;
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly name = new FormControl('', [Validators.required, Validators.minLength(this.nameMinLength),
  Validators.maxLength(this.nameMaxLength), Validators.pattern('^[a-zA-Z]+$')]);
  emailErrorMessage = '';
  nameErrorMessage = '';
  user: User = new User();

  displayedColumns: string[] = ['policyNumber', 'amount', 'start', 'end', 'actions'];
  dataSource: MatTableDataSource<Policy> = new MatTableDataSource<Policy>(this.user.policies);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  startStartDateFilter: Date;
  startEndDateFilter: Date;
  endStartDateFilter: Date;
  endEndDateFilter: Date;
  policyNumberFilter: string;
  minAmountFilter: number;
  maxAmountFilter: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private policyService: PoliciesService,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    let id = Number(this.route.snapshot.paramMap.get('userId'));
    if (id) {
      this.user = await this.userService.getUser(id);
      this.updateGui();
      this.name.setValue(this.user.name);
      this.email.setValue(this.user.email);
    }
    else {
      this.isEdit = false;
      this.user = new User();
    }
    this.loading = false;

  }

  onBack() {
    this.router.navigate(['user-list']);
  }

  onAddPolicy() {
    const dialogRef = this.dialog.open(InsurancePolicyFormComponent, {
      data: { userId: this.user.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.policies.push(result);
        this.updateGui();
      }
    });
  }

  editPolicy(policy: Policy) {
    const dialogRef = this.dialog.open(InsurancePolicyFormComponent, { data: { userId: this.user.id, policy: policy } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let index = this.user.policies.findIndex(p => p.id == result.id);
        if (index < 0) {
          console.error("Edit policy dialog closed with result. cannot find policy:");
          console.log(result);
          return;
        }
        this.user.policies[index] = result;
        this.updateGui();
      }
    })
  }

  deletePolicy(policy: Policy) {
    const dialogRef = this.dialog.open(GenericYesNoComponent, {
      data: {
        title: "Insurance Policy Delete",
        confirmText: "Delete Policy",
        description: `Are you sure you want to delete Policy ${policy.policyNumber}?`
      }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        let deletedPolicy = await this.policyService.deletePolicy(policy.id);
        if (deletedPolicy) {
          this.openSnackBar("Deleted Policy Successfully", "Policy Delete");
          this.user.policies = this.user.policies.filter(p => p.id != policy.id);
          this.updateGui();

        }
        else {
          this.openSnackBar("Failed to Delete Policy", "Policy Delete");
        }
      }
    })
  }

  clearFilters() {
    this.startStartDateFilter = undefined;
    this.startEndDateFilter = undefined;
    this.endEndDateFilter = undefined;
    this.endStartDateFilter = undefined;
    this.minAmountFilter = undefined;
    this.maxAmountFilter = undefined;
    this.policyNumberFilter = undefined;
    this.applyDateRangeFilter();
  }

  applyDateRangeFilter() {
    const filterValue = {
      startStartDate: this.startStartDateFilter,
      startEndDate: this.startEndDateFilter,
      endEndDate: this.endEndDateFilter,
      endStartDate: this.endStartDateFilter,
      minAmount: this.minAmountFilter,
      maxAmount: this.maxAmountFilter,
      policyNumber: this.policyNumberFilter
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  createFilter(): (policy: Policy, filter: string) => boolean {
    return (policy: Policy, filter: string): boolean => {
      const filterObj = JSON.parse(filter);
      const startStartDate = filterObj.startStartDate ? new Date(filterObj.startStartDate) : null;
      const startEndDate = filterObj.startEndDate ? new Date(filterObj.startEndDate) : null;
      const endStartDate = filterObj.endStartDate ? new Date(filterObj.endStartDate) : null;
      const endEndDate = filterObj.endEndDate ? new Date(filterObj.endEndDate) : null;
      const minAmount = filterObj.minAmount ? filterObj.minAmount : null;
      const maxAmount = filterObj.maxAmount ? filterObj.maxAmount : null;
      const policyNumber = filterObj.policyNumber ? filterObj.policyNumber : null;

      return (!startStartDate || policy.start >= startStartDate) && (!startEndDate || policy.start <= startEndDate) &&
        (!endStartDate || policy.end >= endStartDate) && (!endEndDate || policy.end <= endEndDate) &&
        (!minAmount || policy.amount >= minAmount) && (!maxAmount || policy.amount <= maxAmount) &&
        (!policyNumber || policy.policyNumber.includes(policyNumber));
    };
  }

  updateGui() {
    this.dataSource = new MatTableDataSource<Policy>(this.user.policies);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilter();
    this.applyDateRangeFilter();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'left'
    })
  }

}
