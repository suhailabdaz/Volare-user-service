import { IUserRepository } from '../interfaces/iUserRepository';
import UserModel, { IUser } from '../model/schemas/user.schema';
import TravellerModel, { ITraveller } from '../model/schemas/travellers.schema';
import { User } from '../model/user.entities';
import { Traveller } from '../model/travellers.entities';
import { Coupon } from '../model/coupon.entities';
import mongoose from 'mongoose';

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
      const users = UserModel.find();
      return users;
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

  async uploadImage(userId: string, image_link: string) {
    try {
      const user = await UserModel.findByIdAndUpdate(userId, {
        image_link,
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
  async applyCoupon(userId: string, coupon: Coupon): Promise<IUser | null> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await UserModel.findById(userId).session(session);
      if (user) {
        user.usedCoupons.push(coupon.coupon_code);
        await user.save({ session });
      }
      await session.commitTransaction();

      return user;
    } catch (e: any) {
      await session.abortTransaction();
      console.error('Error applying coupon to user', e);
      throw e;
    } finally {
      session.endSession();
    }
  }
}
