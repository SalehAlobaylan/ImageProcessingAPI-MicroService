"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest")); // this library to test the servers
const index_1 = __importDefault(require("../index"));
describe("GET /placeholder", () => {
    it("should serve the primary endpoint", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/placeholder")
            .query({ image: "DMASO2.jpg" });
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toBe("image/jpeg");
        console.log("first test");
    }));
});
describe("GET /placeholder", () => {
    it("should return a resized image with default dimensions", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/placeholder")
            .query({ image: "DMASO2.jpg", width: 400, height: 400 });
        console.log("second test");
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toBe("image/jpeg");
    }));
    it("should return a resized image with specified dimensions", () => __awaiter(void 0, void 0, void 0, function* () {
        const width = 200;
        const height = 200;
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/placeholder")
            .query({ image: "DMASO2.jpg", width, height });
        expect(response.status).toBe(200);
        expect(response.header["content-type"]).toBe("image/jpeg");
        console.log("third test");
    }));
    it("should return 404 for an image that does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/placeholder")
            .query({ image: "nonexistent.jpg", width: 400, height: 400 });
        console.log("fourth test");
        expect(response.status).toBe(404);
    }));
});
