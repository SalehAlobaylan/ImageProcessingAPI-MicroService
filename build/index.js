"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Routes_1 = __importDefault(require("./Routes"));
// primary endpoint
const app = (0, express_1.default)();
const port = 3000;
//Start express server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Set up Routes
    app.get("/placeholder", Routes_1.default);
});
// Exporting app to use it in the unit testing
exports.default = app;
//     Here to use the API and test it
// http://localhost:3000/placeholder?image=DMASO1.jpg&width=400&height=400
