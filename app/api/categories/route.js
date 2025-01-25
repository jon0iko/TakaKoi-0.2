import { db } from "@/lib/actions";

export async function GET(req) {
  try {
    const query = `SELECT category_id, category_name FROM Categories ORDER BY category_name ASC`;
    const result = await db(query);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch categories." }), { status: 500 });
  }
}
