"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const authValidation_1 = __importDefault(require("../../middleware/authValidation"));
const router = express_1.default.Router();
router.get("/users", (0, authValidation_1.default)("admin"), user_controller_1.userControllers.getUser);
router.put("/users/:userId", (0, authValidation_1.default)("admin", "customer"), user_controller_1.userControllers.userUpdate);
router.delete("/users/:userId", (0, authValidation_1.default)("admin"), user_controller_1.userControllers.deleteUser);
exports.userRoutes = router;
