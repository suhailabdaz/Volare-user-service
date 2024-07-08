import { IUserService } from "../interfaces/iUserInterface"

export class UserController {
  private service: IUserService;

  constructor(service: IUserService) {
    this.service = service;
  }

  

  

  

  

  
 
  getUsers = async () => {
    try {
      const response = await this.service.getUsers();
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  getInstructors = async () => {
    try {
      const response = await this.service.getInstructors();
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

 
}
