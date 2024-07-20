import express from "express";
import placeholder from "./placeholder";

const route = express.Router();

route.get("/placeholder", placeholder);

export default route;
