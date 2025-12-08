"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// import config from "./config/config";
// const port = config.port;
// app.listen(port, () => {
//     console.log(`Vehicle Rental Management app running on port ${port}`);
// })
exports.default = app_1.default;
