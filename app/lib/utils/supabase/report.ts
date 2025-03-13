import { createClient } from "./client";

export async function getSalesReport() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("order")
    .select("created_at, amount");

    console.log("📊 Sales Report Data:", data);
    console.error("🚨 Error:", error);

  if (error) {
    console.error("Error fetching sales data:", error);
    return [];
  }

  

  const salesMap = new Map<string, { month: string; total_orders: number; total_sales: number }>();

  data.forEach(({ created_at, amount }) => {
    const month = new Date(created_at).toISOString().slice(0, 7);
    if (!salesMap.has(month)) {
      salesMap.set(month, { month, total_orders: 0, total_sales: 0 });
    }
    salesMap.get(month)!.total_orders += 1;
    salesMap.get(month)!.total_sales += amount;
  });

  return Array.from(salesMap.values());
}
