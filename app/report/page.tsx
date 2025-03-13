"use client";
import { useEffect, useState } from "react";
import { getSalesReport } from "@/app/lib/utils/supabase/report";

type SalesReportData = {
  month: string;
  total_orders: number;
  total_sales: number;
};

export default function SalesReport() {
  const [salesData, setSalesData] = useState<SalesReportData[]>([]);

  useEffect(() => {
    async function fetchSalesData() {
      const data = await getSalesReport();
      setSalesData(data);
    }
    fetchSalesData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Sales Report</h1>
      <pre>{JSON.stringify(salesData, null, 2)}</pre>
    </div>
  );
}
