import bcrypt from "bcryptjs";
import { db } from "@/lib/actions";

export async function POST(req) {
  const { username, email, phone, password } = await req.json();

  if (!username || !email || !password || !phone) {
    return new Response(JSON.stringify({ message: "All fields are required." }), {
      status: 400,
    });
  }

  if (password.length < 6) {
    return new Response(
      JSON.stringify({ message: "Password must be at least 6 characters." }),
      { status: 400 }
    );
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, email, password, phone)
      VALUES ('${username}', '${email}', '${hashedPassword}', '${phone}')
      RETURNING user_id;
    `;

    // get the result and see if there is any error
    try {
        await db(query);
    }
    catch (error) {
        if (error.code === "23505") {
            return new Response(
                JSON.stringify({ message: "Username or email already exists." }),
                { status: 400 }
            );
        }
        else if (error.code === "23514") {
            return new Response(
                JSON.stringify({ message: "Invalid phone number. Number must be valid in Bangladesh." }),
                { status: 400 }
            );
        }
    }
    


    return new Response(JSON.stringify({ message: "User created successfully." }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: "User already exists or an error occurred." }),
      { status: 400 }
    );
  }
}
