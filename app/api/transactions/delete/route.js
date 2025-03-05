import { db } from "@/lib/actions"; 

export async function POST(req) {
  try {
    const { transaction_id } = await req.json();

    if (!transaction_id) {
      return new Response(JSON.stringify({ message: "Transaction ID is required." }), { status: 400 });
    }

    const query = `DELETE FROM Transactions WHERE transaction_id = ${transaction_id}`;
    
    await db(query);

    return new Response(JSON.stringify({ message: "Transaction deleted successfully!" }), { status: 200 });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return new Response(JSON.stringify({ message: "Failed to delete transaction." }), { status: 500 });
  }
}
