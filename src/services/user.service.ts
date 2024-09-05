import { IUserService } from '../interfaces/iUserInterface';
import { IUserRepository } from '../interfaces/iUserRepository';
import { User } from '../model/user.entities';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { generateOtp } from '../utils/generateOtp';
import { sendOtpEmail } from '../utils/emailOtp';
import { OAuth2Client } from 'google-auth-library';
import { MongoError } from 'mongodb';
import { IUser } from '../model/schemas/user.schema';
import { Coupon } from '../model/coupon.entities';

export class UserService implements IUserService {
  private repository: IUserRepository;
  private client;

  constructor(repository: IUserRepository) {
    this.repository = repository;
    this.client = new OAuth2Client(process.env.CLIENT_ID);
  }

  // helper function send otp if user is new
  async userRegister(userData: User) {
    try {
      const otp = generateOtp();
      await sendOtpEmail(userData.email, otp);
      return {
        isLogin: false,
        message: 'otp send successfully',
        success: true,
        otp,
        user_data: userData,
      };
    } catch (err) {
      return null;
    }
  }

  async userCreate(userData: User) {
    try {
      const user_data = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
      const user = await this.repository.register(user_data);
      if (!user) {
        throw new Error('User creation failed');
      }
      const accessToken = user.SignAccessToken();
      const refreshToken = user.SignRefreshToken();
      return { user, accessToken, refreshToken };
    } catch (err) {
      return null;
    }
  }

  async userLogin(email: string, password: string) {
    console.log('login server', email, password);
    const user = await this.repository.findOne(email);
    if (!user) {
      return { success: false, message: 'Invalid Credentials' };
    }
    if (!user.password) {
      return { success: false, message: 'Invalid Credentials' };
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      return { success: false, message: 'Invalid Credentials' };
    }
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    return {
      success: true,
      message: 'User found',
      user,
      accessToken,
      refreshToken,
    };
  }

  async verify_otp(Data: User) {
    try {
      console.log('in the verify otp', Data);
      console.log('ready to send success message');
      return {
        message: 'User data saved successfully',
        success: true,
      };
    } catch (err) {
      return null;
    }
  }

  async resend_otp(email: string) {
    try {
      console.log('Redend otp', email);
      const otp = generateOtp();
      await sendOtpEmail(email, otp);
      return { success: true, newOtp: otp };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

  async loginwithgoogle(credential: any): Promise<any> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: credential.credential,
        audience: process.env.CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new Error('Invalid Google credentials');
      console.log('payload', payload);

      const email = payload.email;
      const name = payload.name;

      if (!email) throw new Error('Email not available in Google credentials');

      let user = await this.repository.findOne(email);
      console.log('google auth', user);

      if (!user) {
        user = await this.repository.register({
          email,
          name,
        } as User);
      }
      if (user) {
        const accessToken = user.SignAccessToken();
        const refreshToken = user.SignRefreshToken();

        console.log('saved user details', user);
        return { success: true, user_data: user, accessToken, refreshToken };
      }
      throw new Error('Error logging in with Google');
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error logging in with Google: ${error.message}`);
      }
      throw error;
    }
  }
  //check whether the user is registered or not
  async check_account(email: string): Promise<any> {
    try {
      console.log(email, 'in nhe user serivce');
      const user = await this.repository.findOne(email);
      if (user) {
        return {
          isLogin: true,
          success: true,
          message: 'user found',
          email: email,
          user_data: user,
        };
      } else {
        const userData = { email: email };
        const response = this.userRegister(userData);
        return response;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

  async update_password(userdata: { email: string; password: string }) {
    try {
      const user = await this.repository.findOne(userdata.email);
      if (!user) {
        throw new Error('User not found');
      }
      console.log(user);
      const userId = String(user?._id);
      const password = await bcrypt.hash(userdata.password || '', 10);
      const updated = await this.repository.updatePassword(userId, password);
      console.log(updated, 'updated uses');
      return { success: true, user_data: updated };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

  // get userdeatils fromn the userdatabase
  async getUser(id: string) {
    try {
      const user = await this.repository.findById(id);
      return { success: true, user_data: user };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

  async getUsers() {
    try {
      const users = await this.repository.getUsers();
      return { success: true, users: users };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }




  async updateUser(data: { values: any; id: string }) {
    try {
      const user = await this.repository.findByIdAndUpdate(
        data.id,
        data.values
      );
      return { success: true, user_data: user };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }
  async resetPassword(data: { values: any; id: string }) {
    try {
      const user = await this.repository.findById(data.id);
      if (user) {
        const newPassword = data.values.currentPassword;
        const isPasswordCorrect = await bcrypt.compare(
          newPassword,
          user.password || ''
        );
        const userId = String(data.id);
        if (isPasswordCorrect) {
          const password = await bcrypt.hash(newPassword || '', 10);
          const updated = await this.repository.updatePassword(
            userId,
            password
          );
          return { success: true, user_data: updated };
        } else {
          return { success: false, message: 'Password incorrect' };
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error reseting password');
      }
      throw error;
    }
  }

  async addTraveller(travellerData: any) {
    try {
      const traveller = await this.repository.addTraveller(travellerData);
      return { success: true, traveller: traveller };
    } catch (error) {
      if ((error = 'Error: db error')) {
        return { success: false, message: 'traveller already added' };
      } else {
        console.error('Error adding traveller:');
        throw error;
      }
    }
  }

  async getTravellers(id: string) {
    try {
      const travellers = await this.repository.getTravellers(id);
      return { success: true, travellers: travellers };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }
  async saveTravellers(travellerData: any) {
    try {
      const id = travellerData._id;
      const travellers = await this.repository.TravellerfindByIdAndUpdate(
        id,
        travellerData
      );
      return { success: true, travellers: travellers };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }
  async deleteTraveller(id: string) {
    try {
      const traveller = await this.repository.deleteTraveller(id);
      return { success: true, traveller: id };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

  async uploadImage(data:{user_id:string,imageName:string}) {
    try {
      const userId = data.user_id;
      const image_link = data.imageName
      const imageLink = await this.repository.uploadImage(userId,image_link);
      return { success: true, image_link:image_link };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }
  async getUsedCoupons(userId: string) {
      try{
        const user = await this.repository.findById(userId)

        if(!user){
          throw new Error 
        }
        const usedCoupons = user.usedCoupons;

        return usedCoupons  
          }catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error resending OTP: ${error.message}`);
      }
      throw error;
    }
  }

  async applyCoupon(data:{userId: string, coupon: Coupon}) {
      try{
          const user = await this.repository.applyCoupon(data.userId,data.coupon)
          return user
      }catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error resending OTP: ${error.message}`);
        }
        throw error;
      }
  }
}
