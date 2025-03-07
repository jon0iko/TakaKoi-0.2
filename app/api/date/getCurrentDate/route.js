import { db } from "@/lib/actions"; 

export async function GET(req) {
  try {
    const query = `
      SELECT TO_CHAR(NOW() AT TIME ZONE 'Asia/Dhaka', 'DD FMMonth, FMDay') AS current_date;
    `;

    const result = await db(query);

    if (!result || result.length === 0) {
      return new Response(JSON.stringify({ message: "Failed to fetch date." }), { status: 500 });
    }

    return new Response(JSON.stringify({ date: result[0].current_date }), { status: 200 });
  } catch (error) {
    console.error("Error fetching current date:", error);
    return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
  }
}
