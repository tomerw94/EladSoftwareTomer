import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy } from 'src/app/models/policy';
import { PoliciesService } from 'src/app/services/policies.service';

@Component({
  selector: 'app-insurance-policy-form',
  templateUrl: './insurance-policy-form.component.html',
  styleUrls: ['./insurance-policy-form.component.scss']
})
export class InsurancePolicyFormComponent implements OnInit {

  policy: Policy
  isEdit: boolean = true; // if false, add
  userId: number;
  loading: boolean = false;

  form: FormGroup;

  constructor(private policiesService: PoliciesService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InsurancePolicyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { policy: Policy, userId: number }
  ) {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      policyNumber: ['', Validators.required],
      amount: ['', [Validators.min(0), Validators.required]]
    }, { validators: this.formValidator } as AbstractControlOptions);
  }

  ngOnInit(): void {
    if (!this.data.userId) {
      console.error("Cannot edit or create policy without user");
      this.dialogRef.close();
    }
    if (!this.data.policy) {
      this.policy = new Policy();
      this.isEdit = false;
    }
    else {
      this.policy = this.data.policy;
      this.form.patchValue({
        startDate: this.data.policy.start || '',
        endDate: this.data.policy.end || '',
        policyNumber: this.data.policy.policyNumber || '',
        amount: this.data.policy.amount || 0
      });
    }
  }

  formValidator(group: FormGroup): { [key: string]: boolean } | null {
    const startDate = group.get('startDate')?.value;
    const endDate = group.get('endDate')?.value;
    const amount = group.get('amount')?.value;
    const policyNumber = group.get('policyNumber')?.value;
    if (endDate && startDate && endDate < startDate) {
      return { 'formInvalid': true };
    }
    if (amount < 0) {
      return { 'formInvalid': true };
    }
    if (policyNumber.length < 2) {
      return { 'formInvalid': true };
    }
    return null;
  }

  cancel() {
    this.dialogRef.close();
  }

  async onSubmit() {
    let policy;
    this.loading = true;
    this.policy.policyNumber = this.form.value.policyNumber;
    this.policy.amount = this.form.value.amount;
    this.policy.start = this.form.value.startDate;
    this.policy.end = this.form.value.endDate;
    this.policy.userId = this.data.userId;
    if (this.isEdit) {
      policy = await this.policiesService.updatePolicy(this.policy);
    }
    else {
      policy = await this.policiesService.createPolicy(this.policy);
    }
    if (policy) {
      this.openSnackBar(this.isEdit ? "Policy Updated Successfully" : "Policy Created Successfully", this.isEdit ? "Policy Update" : "Policy Create");
      this.dialogRef.close(policy);
    }
    else {
      this.openSnackBar(this.isEdit ? "Policy Updated Failed" : "Policy Created Successfully", this.isEdit ? "Policy Update" : "Policy Create");
    }
  }

  updateValidity() {
    console.log("check");
    this.form.updateValueAndValidity();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'left'
    })
  }

}
