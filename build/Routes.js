"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const placeholder_1 = __importDefault(require("./placeholder"));
const route = express_1.default.Router();
route.get("/placeholder", placeholder_1.default);
exports.default = route;
