import request from "supertest";
import app from "../app.js";


describe("POST /weather", () => {

  describe("when passed a cityName and countryCode ", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/weather").send({ 
        cityName: "Ankara", 
        countryCode: "tr" 
      })
      expect(response.statusCode).toBe(200)
    })

    test("should specify json as the content type in the http header", async () => {
      const response = await request(app).post("/weather").send({ 
        cityName: "Ankara", 
        countryCode: "tr"
      })
      expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
    })
  })

  describe("when the cityName or countryCode is missing", () => {
    test("should return a 400 status code", async () => {
      const response = await request(app).post("/weather").send({ cityName: "Amsterdam" })
      expect(response.statusCode).toBe(400)
    })
    })

})