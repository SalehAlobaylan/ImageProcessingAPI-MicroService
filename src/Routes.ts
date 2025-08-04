import express from "express";
import placeholder from "./placeholder";

const route = express.Router(); // API Endpoint

route.get("/placeholder", placeholder);

export default route;
