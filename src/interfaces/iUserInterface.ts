import { User } from "../model/user.entities";

export interface IUserService {
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
  addTraveller(travellerData:any):any
  getTravellers(id:string):any
  saveTravellers(travellerData:any):any
  deleteTraveller(id:string):any
  getUsers():any
  uploadImage(data:{user_id:string,imageName:string}):any
}
