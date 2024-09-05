import { OAuth2Client } from 'google-auth-library';
import { UserController } from '../controller/userController';
import { UserRepository } from '../repository/userRepository';
import { UserService } from '../services/user.service';
import rabbitClient from './client';

const userRepository = new UserRepository();
const service = new UserService(userRepository);
const controller = new UserController(service);

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log('The operation in user service is', operation, data);

    switch (operation) {
      case 'login':
        response = await controller.userLogin.bind(controller)(data);
        break;
      case 'register':
        response = await controller.userCreate.bind(controller)(data);
        break;
      case 'verify-otp':
        response = await controller.verify_otp.bind(controller)(data);
        break;
      case 'resend-otp':
        response = await controller.resend_otp.bind(controller)(data);
        break;
      case 'google-login':
        response = await controller.loginwithgoogle.bind(controller)(data);
        break;
      case 'check-account':
        response = await controller.check_account.bind(controller)(data);
        break;
      case 'update-password':
        response = await controller.update_password.bind(controller)(data);
        break;
      case 'get-user':
        response = await controller.getUser.bind(controller)(data);
        break;
      case 'update-user':
        response = await controller.updateUser.bind(controller)(data);
        break;
      case 'reset-password':
        response = await controller.resetPassword.bind(controller)(data);
        break;
      case 'add-traveller':
        response = await controller.addTraveller.bind(controller)(data);
        break;
      case 'get-travellers':
        response = await controller.getTravellers.bind(controller)(data);
        break;
      case 'save-travellers':
        response = await controller.saveTravellers.bind(controller)(data);
        break;
      case 'delete-traveller':
        response = await controller.deleteTraveller.bind(controller)(data);
        break;
      case 'get-users':
        response = await controller.getUsers.bind(controller)();
        break;
      case 'upload-image':
        response = await controller.uploadImage.bind(controller)(data);
        break;
      case 'get-used-coupons':
        response = await controller.getUsedCoupons.bind(controller)(data);
        break;
        case 'apply-coupon-user':
        response = await controller.applyCoupon.bind(controller)(data);
        break;
      default:
        response = 'Request-key notfound';
        break;
    }
    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
