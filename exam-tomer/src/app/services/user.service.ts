import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { firstValueFrom, map, tap } from 'rxjs';
import { Policy } from '../models/policy';
import { PolicyDto } from './policies.service';

export class UserDto {
  name: string;
  email: string;
  id: number;
  insurancePolicies: PolicyDto[];
  constructor(init?: Partial<UserDto>) {
    Object.assign(this, init);
  }

}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly urlBase = "/api/Users/"
  constructor(private httpClient: HttpClient) { }

  async getUser(id: number): Promise<User> {
    console.log("getting user with id: " + id);
    try {
      let dto = await firstValueFrom(this.httpClient.get<UserDto>(this.urlBase + id));
      return this.DtoToUser(dto);
    }
    catch (e) {
      console.error(e);
      return null;
    }

  }

  async getAllUsers(): Promise<User[]> {
    console.log("getting users");
    try {
      let dto = await firstValueFrom(this.httpClient.get<UserDto[]>(this.urlBase));
      return dto.map(d => this.DtoToUser(d));
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async deleteUser(id: number): Promise<User> {
    console.log("deleting user with id: " + id);
    try {
      let dto = await firstValueFrom(this.httpClient.delete<UserDto>(this.urlBase + id));
      return this.DtoToUser(dto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async updateUser(user: User): Promise<User> {
    console.log("updating user with id: " + user.id);
    try {
      let dto = await firstValueFrom(this.httpClient.put<UserDto>(this.urlBase, user));
      return this.DtoToUser(dto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  async createUser(user: User): Promise<User> {
    console.log("creating user");
    try {
      let dto = await firstValueFrom(this.httpClient.post<UserDto>(this.urlBase, user));
      return this.DtoToUser(dto);
    }
    catch (e) {
      console.error(e);
      return null;
    }
  }

  DtoToUser(dto: UserDto) {
    return new User({
      id: dto.id,
      email: dto.email,
      name: dto.name,
      policies: dto.insurancePolicies.map(p => {
        return new Policy({
          id: p.id,
          amount: p.insuranceAmount,
          policyNumber: p.policyNumber,
          start: new Date(p.startDate),
          end: new Date(p.endDate),
          userId: p.userId
        })
      })
    })
  }

  userToDto(user: User): UserDto {
    return new UserDto({
      id: user.id,
      name: user.name,
      email: user.email,
      insurancePolicies: user.policies.map(p => {
        return new PolicyDto({
          insuranceAmount: p.amount,
          id: p.id,
          userId: p.userId,
          startDate: p.start.toISOString(),
          endDate: p.end.toISOString(),
          policyNumber: p.policyNumber
        })
      })
    })
  }

}
