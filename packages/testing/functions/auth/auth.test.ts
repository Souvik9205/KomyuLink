import axios from "axios";
import { config } from "dotenv";

config();
const API = process.env.SERVER_URL || "http://localhost:8080/api";

if (!API) {
  throw new Error("Error fetching API URL from environment variables.");
}

const axiosClient = axios.create({
  validateStatus: () => true,
});
const registeredEmail = "registered@example.com";
const registeredPassword = "password123";
const registeredName = "Test User";

const testEmail = "newuser@example.com";

describe("Register User(email provider) Tests", () => {
  it("All valid fields should be provided", async () => {
    const response = await axiosClient.post(`${API}/auth/register`, {});
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("All fields are required");
  });

  it("Invalid email format should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/register`, {
      email: "invalid-email",
      password: "password123",
      name: "Test User",
    });
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Invalid email format");
  });

  it("Already registered user should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/register`, {
      email: registeredEmail,
      password: "password123",
      name: "Test User",
    });
    expect(response.status).toBe(409);
    expect(response.data.message).toBe("User already registered");
  });

  it("Registered successfully with valid fields", async () => {
    const response = await axiosClient.post(`${API}/auth/register`, {
      email: testEmail,
      password: "password123",
      name: "Test User",
    });
    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      "OTP sent successfully. Please check your email."
    );
  });
});

describe("Verify User(email provider) Tests", () => {
  it("All valid fields should be provided", async () => {
    const response = await axiosClient.post(`${API}/auth/verify`, {});
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("OTP and email are required");
  });

  it("Invalid email format should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/verify`, {
      email: "invalid-email",
      otp: "123456",
    });
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Invalid email format");
  });

  it("Already registered user should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/verify`, {
      email: registeredEmail,
      otp: "123456",
    });
    expect(response.status).toBe(409);
    expect(response.data.message).toBe("User already registered");
  });

  it("OTP not found for this email", async () => {
    const response = await axiosClient.post(`${API}/auth/verify`, {
      otp: "123456",
      email: "randomemail@email.com",
    });
    expect(response.status).toBe(404);
    expect(response.data.message).toBe("OTP not found for this email");
  });

  it("Invalid OTP should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/verify`, {
      otp: "invalid-otp",
      email: testEmail,
    });
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Invalid OTP");
  });
});

describe("Resend OTP Tests", () => {
  it("Not Email Provided, should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/user/resend-otp`, {});
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Email is required");
  });
  it("Invalid Email Format, should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/user/resend-otp`, {
      email: "invalid-email",
    });
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Invalid email format");
  });
  it("Already registered user should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/user/resend-otp`, {
      email: registeredEmail,
    });
    expect(response.status).toBe(409);
    expect(response.data.message).toBe("User already registered");
  });
  it("No OTP found for this email", async () => {
    const response = await axiosClient.post(`${API}/auth/user/resend-otp`, {
      email: "nonexistent@example.com",
    });
    expect(response.status).toBe(404);
    expect(response.data.message).toBe("No OTP found for this email");
  });
  it("OTP resesnt successfully", async () => {
    const response = await axiosClient.post(`${API}/auth/user/resend-otp`, {
      email: testEmail,
    });
    expect(response.status).toBe(200);
    expect(response.data.message).toBe(
      "New OTP sent successfully. Please check your email."
    );
  });
});

describe("Login User(email provider) Tests", () => {
  it("All valid fields should be provided", async () => {
    const response = await axiosClient.post(`${API}/auth/login`, {});
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Email and password are required");
  });

  it("Invalid email format should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/login`, {
      email: "invalid-email",
      password: "password123",
    });
    expect(response.status).toBe(400);
    expect(response.data.message).toBe("Invalid email format");
  });

  it("Non registered user should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/login`, {
      email: "nonregistered@example.com",
      password: "password123",
    });
    expect(response.status).toBe(404);
    expect(response.data.message).toBe("User not found");
  });

  it("Invalid Password should return error", async () => {
    const response = await axiosClient.post(`${API}/auth/login`, {
      email: registeredEmail,
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
    expect(response.data.message).toBe("Invalid password");
  });

  it("Successful login with valid credentials should return cookie token", async () => {
    const response = await axiosClient.post(`${API}/auth/login`, {
      email: registeredEmail,
      password: registeredPassword,
    });
    expect(response.status).toBe(200);
    expect(response.data.message).toBe("Login successful");
    const setCookieHeader = response.headers["set-cookie"];
    expect(Array.isArray(setCookieHeader)).toBe(true);
    const tokenCookie = setCookieHeader?.find((cookie: string) =>
      cookie.startsWith("token=")
    );
    expect(tokenCookie).toBeDefined();
  });
});

afterAll(async () => {
  try {
    await axiosClient.get(
      `${API}/cleanup/otp/${encodeURIComponent(testEmail)}`
    );
  } catch (error) {
    console.error("Error removing test user:", error);
  }
});
