const request = require("supertest");
const bcrypt = require("bcrypt");
const { User } = require("../../../models/user");

describe("/api/auth", () => {
  let server;
  let user;
  let email;
  let password;

  const exe = () => {
    return request(server).post("/api/auth").send({ email, password });
  };

  beforeEach(async () => {
    server = require("../../../app");

    email = "email@dev.io";
    password = "12345";

    user = await new User({
      name: "name1",
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  it("should return 400 if email is not provided", async () => {
    email = null;

    const res = await exe();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is not provided", async () => {
    password = null;

    const res = await exe();

    expect(res.status).toBe(400);
  });

  it("should return 400 if email is invalid", async () => {
    email = "abc@mail.io";

    const res = await exe();

    expect(res.status).toBe(400);
  });

  it("should return 400 if password is invalid", async () => {
    password = "11111";

    const res = await exe();

    expect(res.status).toBe(400);
  });

  it("should return 200 if we have a valid request", async () => {
    const res = await exe();

    expect(res.status).toBe(200);
  });

  it("should return true if the hashed and user password are the same", async () => {
    const validPassword = "12345";

    const auth = await bcrypt.compare(validPassword, user.password);

    expect(auth).toEqual(true);
  });

  it("should return false if the hashed and user password are not the same", async () => {
    const invalidPassword = "11111";

    const auth = await bcrypt.compare(invalidPassword, user.password);

    expect(auth).toEqual(false);
  });
});
