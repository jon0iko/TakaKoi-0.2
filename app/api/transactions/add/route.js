import { db } from "@/lib/actions";

export async function POST(req) {
  const { user_id, description, amount, type, category, date } =
    await req.json();

  // Validate incoming data
  if (!user_id || !description || !amount || !type || !category || !date) {
    return new Response(
      JSON.stringify({ message: "All fields are required." }),
      {
        status: 400,
      }
    );
  }

  // Ensure amount is a positive number
  if (isNaN(amount) || Number(amount) <= 0) {
    return new Response(
      JSON.stringify({ message: "Amount must be a positive number." }),
      { status: 400 }
    );
  }

  // Validate transaction type
  if (!["income", "expense"].includes(type)) {
    return new Response(
      JSON.stringify({ message: "Type must be either 'income' or 'expense'." }),
      { status: 400 }
    );
  }

  try {
    // Insert transaction into the database using  the data in the query
    const query = `
    INSERT INTO transactions (user_id, description, amount, type, category_id, date)
    VALUES (
        ${user_id}, 
        '${description.replace(/'/g, "''")}', 
        ${Number(amount)}, 
        '${type}', 
        ${category}, 
        '${date}'
    )
    RETURNING transaction_id;
    `;
    const result = await db(query);

    return new Response(
      JSON.stringify({
        message: "Transaction added successfully.",
        transaction_id: result[0].transaction_id,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while adding the transaction.",
      }),
      { status: 500 }
    );
  }
}
