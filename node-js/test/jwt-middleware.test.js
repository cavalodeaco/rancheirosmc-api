const loginMock = require("./mocks/login.mock");

const tokens = loginMock({});

const JWTMiddleware = require("../src/middleware/jwt-middleware");

describe("The JWTMiddleware.validateToken method on production", function () {
  process.env = {
    ...process.env,
    ENV: "production",
  };

  it("should run without exceptions and call next for a successful auth", async () => {
    const nextReturn = await new JWTMiddleware().validateToken(
      { headers: tokens },
      undefined,
      () => "SUCCESS"
    );
    expect(nextReturn).toBe("SUCCESS");
  });

  it("should throw an exceptions if tokens not in request header", async () => {
    try {
      await new JWTMiddleware().validateToken(
        { headers: {} },
        undefined,
        () => {}
      );
    } catch ({ message }) {
      expect(message.message).toMatch(/No tokens found/);
    }
  });
});
