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
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const placeholder = express_1.default.Router();
// I'm gonna add the comments after experimenting somethings firstly :)
// here i extracted the path and store it as a buffer
const getImageBuffer = (imgPath) => {
    return fs_1.default.readFileSync(imgPath);
};
try {
    // now we want to make sure that the img sizes cached so in this function
    // we use basename method to store the name of the path then store it in
    // the thumb file with the customized sizes beside it
    const getCachedimgPath = (prevPath, width, height) => {
        const fileName = path_1.default.basename(prevPath, path_1.default.extname(prevPath));
        return path_1.default.join(__dirname, "../thumb", `${fileName}-${width}x${height}.jpg`);
    };
    // here we going to define a GET route at the path
    placeholder.get("/placeholder", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // defining the sizes by using query and setting it 400 by default
        const imgName = req.query.image;
        const width = parseInt(req.query.width, 10) || 400;
        const height = parseInt(req.query.height, 10) || 400;
        if (!imgName) {
            res.status(400).send("Image name is required");
            return;
        }
        const imgPath = path_1.default.join(__dirname, "../full", imgName);
        console.log(imgPath); // just testing the path right after defining it
        if (!fs_1.default.existsSync(imgPath)) {
            res.status(404).send("Image not found");
            return;
        }
        const cachedimgPath = getCachedimgPath(imgPath, width, height);
        if (fs_1.default.existsSync(cachedimgPath)) {
            // Serve the cached image
            res.sendFile(cachedimgPath);
            return;
        }
        //Here storing the image before resizing it
        const imageBuffer = getImageBuffer(imgPath);
        const resizedImage = yield (0, sharp_1.default)(imageBuffer) // using sharp library to resize it
            .resize(width, height)
            .toBuffer(); // i could also change the type of the image here by usimg .jpeg for example
        // but i already have my final type
        fs_1.default.writeFileSync(cachedimgPath, resizedImage);
        res.set("Content-Type", "image/jpg"); //tells the client that the content being sent is a JPG image
        res.send(resizedImage);
    }));
}
catch (error) {
    console.log('Internal Server Error');
}
exports.default = placeholder;
