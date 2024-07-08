import { IUserService } from "../interfaces/iUserInterface";
import { IUserRepository } from "../interfaces/iUserRepository";
import { User } from "../model/user.entities";
import jwt, { Secret } from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export class UserService implements IUserService {
  private repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  deleteUser(userId: string): Promise<Object> {
    return this.repository.deleteUser(userId);
  }

  getInstructors() {
    return this.repository.getInstructors();
  }

  getUsers() {
    return this.repository.getUsers();
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
    userId: string
  ) {
    const user = await this.repository.findById(userId);
    const isPasswordMatch = await user?.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      throw new Error("Invalid Password");
    }
    const password = await bcrypt.hash(newPassword || "", 10);
    await this.repository.updatePassword(userId, password);
    return;
  }

  
  async updateUserInfo(id: string, name: string) {
    const user = await this.repository.findByIdAndUpdate(id, name);
    if (user) {
      const response = { status: 201, msg: "User info updated successfully" };
      return response;
    } else {
      throw new Error("User not found");
    }
  }

  async activateUser(data: { token: string; activationCode: string }) {
    const { token, activationCode } = data;
    const newUser = jwt.verify(token, process.env.JWT_SECRET as Secret) as {
      user: User;
      activationCode: string;
    };

    if (newUser.activationCode !== activationCode) {
      throw new Error("Invalid Code.");
    }

    const existUser = await this.repository.findOne(newUser.user.email);

    if (existUser) {
      return null;
    }
    return this.repository.register(newUser.user);
  }

  async userRegister(userData: User) {
    try {
      const isEmailExist = await this.repository.findOne(userData.email);
      if (isEmailExist) {
        if (!userData) {
          throw new Error("Email Already Exists");
        } else {
          const accessToken = isEmailExist.SignAccessToken();
          const refreshToken = isEmailExist.SignRefreshToken();
          return { accessToken, refreshToken, user: isEmailExist };
        }
      } else {
        if (!userData) {
          // const activationToken = CreateActivationToken(userData);
          // return activationToken;
        }
        const user = await this.repository.register(userData);
        const accessToken = user?.SignAccessToken();
        const refreshToken = user?.SignRefreshToken();
        return { accessToken, refreshToken, user };
      }
    } catch (err) {
      return null;
    }
  }

  async userLogin(email: string, password: string) {
    const user = await this.repository.findOne(email);
    if (!user) {
      throw new Error("invalid email");
    }

    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
      throw new Error("invalid password");
    }
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    return { accessToken, refreshToken, user };
  }

  async getUser(id: string): Promise<User | any> {
    const user = await this.repository.findById(id);
    return user;
  }
}
