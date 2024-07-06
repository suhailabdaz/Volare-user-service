"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoDB_config_1 = require("./config/mongoDB.config");
class App {
    constructor() {
        (0, mongoDB_config_1.connectDB)();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map