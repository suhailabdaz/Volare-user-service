import { IUser } from "../model/schemas/user.schema";
import { User } from "../model/user.entities";
import { ITraveller } from "../model/schemas/travellers.schema";
import { Traveller } from "../model/travellers.entities";

export interface IUserRepository {
  register(userData: User): Promise<IUser | null>;
  findOne(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByIdAndUpdate(id: string, values: string): Promise<IUser | null>;
  getUsers(): any;
  updatePassword(id: string, password: string): Promise<IUser | null>;
  addTraveller(travellerData:Traveller): Promise<ITraveller | null>;
  getTravellers(id:string):any
  TravellerfindByIdAndUpdate(id: string, values: string): Promise<ITraveller | null>;
  deleteTraveller(id: string): any
}
