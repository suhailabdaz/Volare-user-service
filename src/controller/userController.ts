import { IUserService } from '../interfaces/iUserInterface';

export class UserController {
  private service: IUserService;

  constructor(service: IUserService) {
    this.service = service;
  }

  userLogin = async (data: any) => {
    try {
      const response = await this.service.userLogin(data.email, data.password);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  userCreate = async (data: any) => {
    try {
      const response = await this.service.userCreate(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };
  verify_otp = async (data: any) => {
    try {
      const response = await this.service.verify_otp(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  resend_otp = async (data: any) => {
    try {
      const response = await this.service.resend_otp(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  loginwithgoogle = async (data: any) => {
    try {
      const response = await this.service.loginwithgoogle(data);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  check_account = async (email: string) => {
    try {
      const response = await this.service.check_account(email);
      return response;
    } catch (e: any) {
      console.log(e);
    }
  };

  update_password = async (userData: { email: string; password: string }) => {
    try {
      const response = await this.service.update_password(userData);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  resetPassword = async (data: { values: any; id: string }) => {
    try {
      const response = await this.service.resetPassword(data);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  getUser = async (id: string) => {
    try {
      const response = await this.service.getUser(id);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };
  updateUser = async (data: { values: any; id: string }) => {
    try {
      const response = await this.service.updateUser(data);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  uploadImage = async (data:{user_id:string,imageName:string} ) => {
    try {
      const response = await this.service.uploadImage(data);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };
  addTraveller = async (travellerData: any) => {
    try {
      const response = await this.service.addTraveller(travellerData);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  getTravellers = async (id: string) => {
    try {
      const response = await this.service.getTravellers(id);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  saveTravellers = async (travellerData: any) => {
    try {
      const response = await this.service.saveTravellers(travellerData);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };
  deleteTraveller = async (id: string) => {
    try {
      const response = await this.service.deleteTraveller(id);
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  getUsers = async () => {
    try {
      const response = await this.service.getUsers();
      return response;
    } catch (e: any) {
      console.error(e);
    }
  };

  
}
