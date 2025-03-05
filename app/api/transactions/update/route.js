import { db } from "@/lib/actions"; 

export async function POST(req) {
  try {
    const { transaction_id, description, amount, category, date } = await req.json();

    if (!transaction_id || !description || !amount || !category || !date) {
      return new Response(JSON.stringify({ message: "All fields are required." }), { status: 400 });
    }

    const query = `
      UPDATE Transactions 
      SET description = '${description}', 
          amount = ${amount}, 
          category_id = ${category}, 
          date = '${date}' 
      WHERE transaction_id = ${transaction_id}
    `;

    await db(query);

    return new Response(JSON.stringify({ message: "Transaction updated successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return new Response(JSON.stringify({ message: "Failed to update transaction." }), { status: 500 });
  }
}
