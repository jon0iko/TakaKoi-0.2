"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

export default function ExpenseCharts({ totalIncome, totalExpenses, transactions, categoriesList }) {
  const [currentPage, setCurrentPage] = useState(1); // ✅ Expense Distribution is Default
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesList) {
      setCategories(categoriesList);
    }
  }, [categoriesList]);

  // 🎨 Generate soft, vibrant colors dynamically based on category index
  const generateColor = (index) => {
    const baseColors = [
      { hue: 210, name: "blue" },    // 🔵 Bills & Utilities
      { hue: 45, name: "yellow" },   // 🟡 Personal
      { hue: 10, name: "orange" },   // 🟠 Healthcare
      { hue: 140, name: "green" },   // 🟢 Education
      { hue: 180, name: "teal" },    // 🟦 Transport
      { hue: 330, name: "pink" },    // 🌸 Investment
      { hue: 0, name: "red" },       // 🔴 Other
    ];
    
    // Cycle through the base colors and generate different lightness levels
    const base = baseColors[index % baseColors.length];
    const lightness = 50 + (index % 3) * 10; // Vary the lightness for different shades

    return `hsl(${base.hue}, 70%, ${lightness}%)`; // 🎨 Dynamic Shade Generation
  };

  // Data for the budget vs expense chart
  const budgetData =
    totalIncome > 0
      ? [
          { name: "Expense", value: totalExpenses, color: "#fb7185" }, // Soft Red for Expense
          { name: "Remaining", value: Math.max(totalIncome - totalExpenses, 0), color: "#60a5fa" }, // Light Blue for Remaining
        ]
      : [{ name: "Expense", value: totalExpenses, color: "#fb7185" }];

  // Calculate expense distribution by category
  const categoryTotals = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {});

  const expenseData = Object.keys(categoryTotals).map((category, index) => ({
    name: category,
    value: categoryTotals[category],
    color: generateColor(index), // ✅ Use dynamically generated shades
  }));

  return (
    <Card className="w-full bg-gray-800 border-gray-700 h-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-gray-100">
          {currentPage === 0 ? "Income Vs Expense" : "Expense Distribution"}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={currentPage === 0 ? budgetData : expenseData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={currentPage === 1 ? 50 : 0}
              dataKey="value"
              labelLine={false} // ✅ Removed Labels Beside Chart
            >
              {(currentPage === 0 ? budgetData : expenseData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend wrapperStyle={{ marginTop: 16 }} /> 
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-end w-full mt-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300 hover:text-gray-100"
            onClick={() => setCurrentPage((prev) => (prev === 0 ? 1 : 0))}
          >
            {currentPage === 1 ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
