import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@/lib/actions";

export async function POST(req) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return new Response(JSON.stringify({ message: "All fields are required." }), {
      status: 400,
    });
  }

  try {
    const query = `
      SELECT * FROM users WHERE username = '${identifier}' OR email = '${identifier}';
    `;
    const [user] = await db(query);

    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid Username/Email." }), {
        status: 401,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Wrong Password." }), {
        status: 401,
      });
    }

    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // also return the user id
    return new Response(JSON.stringify({ token, userId: user.user_id, username: user.username }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "An error occurred." }), {
      status: 500,
    });
  }
}
