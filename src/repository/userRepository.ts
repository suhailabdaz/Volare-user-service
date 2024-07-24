import { IUserRepository } from '../interfaces/iUserRepository';
import UserModel, { IUser } from '../model/schemas/user.schema';
import TravellerModel, { ITraveller } from '../model/schemas/travellers.schema';
import { User } from '../model/user.entities';
import { Traveller } from '../model/travellers.entities';

export class UserRepository implements IUserRepository {
  async deleteUser(userId: string): Promise<Object> {
    try {
      await UserModel.findByIdAndDelete(userId);
      return { success: true };
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  async getUsers() {
    try {
      // const users = UserModel.find({ role: "user" });
      const users = 'ha  mone kitti';
      return { data: users };
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  updatePassword(id: string, password: string): Promise<IUser | null> {
    try {
      return UserModel.findByIdAndUpdate(id, { password });
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  avatarUpdate(id: string, avatar: string): Promise<IUser | null> {
    try {
      return UserModel.findByIdAndUpdate(id, { avatar });
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  async findByIdAndUpdate(id: string, values: any): Promise<IUser | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, values, {
        new: true,
        runValidators: true,
      });
      return user;
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  register(userData: User): Promise<IUser | null> {
    try {
      return UserModel.create(userData);
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  async findOne(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (e: any) {
      throw new Error('db error');
    }
  }

  async addTraveller(travellerData: Traveller): Promise<ITraveller | null> {
    try {
      const traveller = await TravellerModel.create(travellerData);
      return traveller;
    } catch (e: any) {
      throw new Error('db error');
    }
  }
  async getTravellers(id: string) {
    try {
      const travellers = await TravellerModel.find({ userId: id });
      return travellers;
    } catch (e: any) {
      throw new Error('db error');
    }
  }
  async TravellerfindByIdAndUpdate(
    id: string,
    values: any
  ): Promise<ITraveller | null> {
    try {
      const Traveller = await TravellerModel.findByIdAndUpdate(id, values, {
        new: true,
        runValidators: true,
      });
      return Traveller;
    } catch (e: any) {
      throw new Error('db error');
    }
  }
  async deleteTraveller(id: string) {
    try {
      const Traveller = await TravellerModel.deleteOne({ _id: id });
      return Traveller;
    } catch (e: any) {
      throw new Error('db error');
    }
  }
}
