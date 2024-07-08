import { UserController } from "../controller/userController";
import { UserRepository } from "../repository/userRepository";
import { UserService } from "../services/user.service";
import rabbitClient from "./client";

const userRepository = new UserRepository()
const service = new UserService(userRepository)
const controller = new UserController(service)

export default class MessageHandler {
  static async handle(
    operation: string,
    data: any,
    correlationId: string,
    replyTo: string
  ) {
    let response = data;
    console.log("The operation in user service is", operation, data);

    switch (operation) {
      case "login":
        response = await controller.getUsers.bind(controller)();
        break;
      

      default:
        response = "Request-key notfound";
        break;
    }

    //Produce the response back to the client
    await rabbitClient.produce(response, correlationId, replyTo);
  }
}
