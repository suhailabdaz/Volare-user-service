"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(`${process.env.MONGO_URI}/${process.env.MONGODB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, sslValidate: false });
        console.log(`UserDB-connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=mongoDB.config.js.map