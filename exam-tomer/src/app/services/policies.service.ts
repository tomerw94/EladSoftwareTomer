import { Injectable } from '@angular/core';
import { Policy } from '../models/policy';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class PolicyDto {
  startDate: string;
  endDate: string;
  insuranceAmount: number;
  policyNumber: string;
  id: number;
  userId: number;
  constructor(init?: Partial<PolicyDto>) {
    Object.assign(this, init);
  }

}

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  readonly urlBase = "/api/InsurancePolicy/";

  constructor(private httpClient: HttpClient) { }

  async getPolicy(id: number): Promise<Policy> {
    try {
      let policyDto = await firstValueFrom(this.httpClient.get<PolicyDto>(this.urlBase + id));
      return this.policyFromDto(policyDto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async getAllPolicies(): Promise<Policy[]> {
    try {
      let policyDto = await firstValueFrom(this.httpClient.get<PolicyDto[]>(this.urlBase));
      return policyDto.map(d => this.policyFromDto(d));
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async getPoliciesOfUser(userId: number): Promise<Policy[]> {
    try {
      let policyDto = await firstValueFrom(this.httpClient.get<PolicyDto[]>(this.urlBase + userId));
      return policyDto.map(d => this.policyFromDto(d));
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async deletePolicy(id: number): Promise<Policy> {
    try {
      let policyDto = await firstValueFrom(this.httpClient.delete<PolicyDto>(this.urlBase + id));
      return this.policyFromDto(policyDto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async updatePolicy(policy: Policy) {
    try {
      let policyDto = await firstValueFrom(this.httpClient.put<PolicyDto>(this.urlBase, this.dtoFromPolicy(policy)));
      return this.policyFromDto(policyDto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async createPolicy(policy: Policy): Promise<Policy> {
    try {
      let policyDto = await firstValueFrom(this.httpClient.post<PolicyDto>(this.urlBase, this.dtoFromPolicy(policy)));
      return this.policyFromDto(policyDto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  policyFromDto(dto: PolicyDto): Policy {
    return new Policy({
      id: dto.id,
      start: new Date(dto.startDate),
      end: new Date(dto.endDate),
      policyNumber: dto.policyNumber,
      amount: dto.insuranceAmount,
      userId: dto.userId
    })
  }

  dtoFromPolicy(policy: Policy) {
    return new PolicyDto({
      id: policy.id,
      startDate: (new Date(policy.start).toISOString()),
      endDate: (new Date(policy.end).toISOString()),
      policyNumber: policy.policyNumber,
      insuranceAmount: policy.amount,
      userId: policy.userId
    })
  }

}
