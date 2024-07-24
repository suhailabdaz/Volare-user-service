import { Traveller } from "../model/travellers.entities";

export interface ITravellerService {
  userRegister(userData: {
    name: string;
    email: string;
  }): any;
  userLogin(email: string, password: string): any;
  verify_otp(data:{}):any;
  resend_otp(
    email: string): any;
  loginwithgoogle(data:{}):any;
  check_account(email:string):any;
  userCreate(userData:{
    name:string;
    email:string;
    password:string;
  }):any
  update_password(userdata:{
    email:string
    password:string 
  }):any
  getUser(id:string):any
  updateUser(data:{}):any
  resetPassword(data:{}):any
  addTraveller(data:{}):any
}
