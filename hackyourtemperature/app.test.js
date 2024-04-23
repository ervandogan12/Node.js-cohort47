import request from "supertest";
import app from "./app.js";


describe("POST /weather", () => {

  describe("when passed a cityName and countryCode ", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app).post("/weather").send({ 
        cityName: "Ankara", 
        countryCode: "tr" 
      })
      expect(response.statusCode).toBe(200)
    })
  })

})