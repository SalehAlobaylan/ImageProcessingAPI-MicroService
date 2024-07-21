import request from "supertest"; // this library to test the servers
import app from "../index";
import path from "path";
import { getImageBuffer, getCachedimgPath } from "../placeholder";

describe("GET /placeholder", () => {
  it("should serve the primary endpoint", async (): Promise<void> => {
    const response = await request(app)
      .get("/placeholder")
      .query({ image: "DMASO2.jpg" });
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("image/jpeg");
    console.log("first test");
  });
});

describe("GET /placeholder", () => {
  it("should return a resized image with default dimensions", async (): Promise<void> => {
    const response = await request(app)
      .get("/placeholder")
      .query({ image: "DMASO2.jpg", width: 400, height: 400 });
    console.log("second test");
    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("image/jpeg");
  });

  it("should return a resized image with specified dimensions", async (): Promise<void> => {
    const width = 200;
    const height = 200;
    const response = await request(app)
      .get("/placeholder")
      .query({ image: "DMASO2.jpg", width, height });

    expect(response.status).toBe(200);
    expect(response.header["content-type"]).toBe("image/jpeg");
    console.log("third test");
  });

  it("should return 404 for an image that does not exist", async (): Promise<void> => {
    const response = await request(app)
      .get("/placeholder")
      .query({ image: "nonexistent.jpg", width: 400, height: 400 });
    console.log("fourth test");
    expect(response.status).toBe(404);
  });
});

describe("getImageBuffer function", () => {
  it("should return a buffer for a valid image path", (): void => {
    const imgPath = path.join(__dirname, "../../full", "DMASO2.jpg");
    const buffer = getImageBuffer(imgPath);
    expect(buffer).toBeInstanceOf(Buffer);
    console.log("Fifth test");
  });
});

describe("getCachedimgPath function", () => {
  it("should return the correct cached image path", (): void => {
    const prevPath = path.join(__dirname, "../../full", "DMASO2.jpg");
    const width = 400;
    const height = 400;
    const cachedPath = getCachedimgPath(prevPath, width, height);
    const expectedPath = path.join(
      __dirname,
      "../../thumb",
      "DMASO2-400x400.jpg",
    );
    expect(cachedPath).toBe(expectedPath);
    console.log("Sixth test");
  });
});
