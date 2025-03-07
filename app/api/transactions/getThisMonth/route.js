import { db } from "@/lib/actions"; 

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ message: "User ID is required." }), { status: 400 });
    }

    const query = `
      SELECT 
        t.transaction_id AS id,
        t.description,
        t.amount,
        t.type,
        TO_CHAR(t.date, 'YYYY-MM-DD') AS date,
        t.category_id,
        c.category_name AS category
      FROM Transactions t
      JOIN Categories c ON t.category_id = c.category_id
      WHERE t.user_id = ${user_id} 
      AND DATE_PART('year', t.date AT TIME ZONE 'GMT+6') = DATE_PART('year', CURRENT_TIMESTAMP AT TIME ZONE 'GMT+6')
      AND DATE_PART('month', t.date AT TIME ZONE 'GMT+6') = DATE_PART('month', CURRENT_TIMESTAMP AT TIME ZONE 'GMT+6')
      ORDER BY t.date DESC
    `;

    const result = await db(query);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions for this month:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch transactions." }), { status: 500 });
  }
}
