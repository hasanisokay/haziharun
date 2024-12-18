import { TOKEN_COOKIE } from "@/constants/constantNames.mjs";
import {
  invalidCredentialsResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/constants/routeResponses.mjs";
import dbConnect from "@/services/dbConnect.mjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import bcrypt from 'bcrypt';
export const POST = async (req) => {
  try {
    const body = await req.json();
    const db = await dbConnect();
    const userCollection = await db.collection("users");
    const user = await userCollection.findOne(
      {
        username: body.username,
      },
      {
        projection: {
          password: 1,
          _id: 1,
          username: 1,
          role: 1,
          photoUrl: 1,
          name: 1,
          status: 1,
        },
      }
    );
    if (!user) {
      return invalidCredentialsResponse("Wrong username or password.");
    }
    const passwordMatch = await bcrypt.compare(body?.password, user?.password);
    if (!passwordMatch) {
      return invalidCredentialsResponse("Wrong password.");
    }
    if (user.status === "suspended" || user.status === "blocked") {
      return unauthorizedResponse("Your account is blocked. Contact Support.");
    }
    const secret = new TextEncoder().encode(process.env.JWT_ENCRYPTION_KEY);
    const token = await new SignJWT({
      sub: user._id,
      username: user.username,
      status: user.status,
      photoUrl: user.photoUrl,
      name: user.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("365d")
      .sign(secret);
    (await cookies()).set({
      name: TOKEN_COOKIE,
      value: `Bearer ${token}`,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 365,
    });
    delete user.password;
    return successResponse(user, "Login Success.");
  } catch (e) {
    return serverErrorResponse(e.message);
  }
};
