import { db } from "@/lib/actions"; // Replace with your actual database utility

export async function POST(req) {
  try {
    // Parse the request body to get the user_id
    const { user_id } = await req.json();

    // Validate the input
    if (!user_id) {
      return new Response(JSON.stringify({ message: "User ID is required." }), {
        status: 400,
      });
    }

    // Directly include user_id in the SQL query (be cautious about SQL injection risks)
    const query = `
      SELECT 
        t.transaction_id AS id,
        t.description,
        t.amount,
        t.type,
        t.date,
        c.category_name AS category
      FROM 
        Transactions t
      JOIN 
        Categories c
      ON 
        t.category_id = c.category_id
      WHERE 
        t.user_id = ${user_id}
      ORDER BY 
        t.date DESC;
    `;

    const result = await db(query);
    console.log(result);
    // Return the fetched transactions
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions:", error);

    // Handle errors
    return new Response(JSON.stringify({ message: "Failed to fetch transactions." }), {
      status: 500,
    });
  }
}
