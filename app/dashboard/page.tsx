"use client";

import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet2, PencilLine, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatePickerWithRange } from "@/components/DateRangePicker";
import { AddTransactionForm } from "@/components/TransactionForm";
import EditTransactionForm from "@/components/EditTransactionDialog";

export default function Dashboard() {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState();
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);

  const openEditDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleEditClose = async (updatedTransaction) => {
      setEditDialogOpen(false);
      await fetchTransactions();
  };

  const handleDeleteTransaction = async (transaction) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    const transaction_id = transaction.id;

    console.log(transaction_id);
  
    try {
      const response = await fetch("/api/transactions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transaction_id }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
  
      toast({
        title: "Success",
        description: "Transaction deleted.",
        variant: "success",
        className: "bg-green-500 text-white",
      });
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    }
  };

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories"); // API endpoint to fetch categories
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories.");
      }

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to fetch categories.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    }
  }

  async function fetchTransactions() {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch transactions.");
      }

      // Clean up the data
      const cleanedData = data.map((transaction) => ({
        ...transaction,
        amount: parseFloat(transaction.amount),
        date: new Date(transaction.date).toISOString().split("T")[0],
      }));

      setTransactions(cleanedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

  const handleClose = () => {
    setIsDialogOpen(false);
    fetchTransactions();
  };

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentBalance = totalIncome - totalExpenses;

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter((transaction) => {
      if (selectedCategory !== "all" && transaction.category !== selectedCategory) return false;
      if (dateRange?.from && dateRange?.to) {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
      }
      return true;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      return (a.amount - b.amount) * multiplier;
    });

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-100">Welcome back, {username}!</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">৳{totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">৳{totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Current Balance</CardTitle>
            <Wallet2 className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">৳{currentBalance.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Add Transaction */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-100">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
            <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={category.category_name}>
                  {category.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value)}>
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-100">
              <SelectValue placeholder="Sort by amount" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              <SelectItem value="asc">Amount (Low to High)</SelectItem>
              <SelectItem value="desc">Amount (High to Low)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-gray-700 text-black hover:bg-gray-800 hover:text-gray-100"
            onClick={() => {
              setDateRange(undefined);
              setSelectedCategory("all");
              setSortOrder("desc");
            }}
          >
            Clear Filters
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Add New Transaction</DialogTitle>
            </DialogHeader>
            <AddTransactionForm onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Transactions Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-300">Loading transactions...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Description</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="border-gray-700">
                    <TableCell className="text-gray-300">{transaction.description}</TableCell>
                    <TableCell className={transaction.type === "income" ? "text-emerald-400" : "text-rose-400"}>
                      {transaction.type === "income" ? "+" : "-"}৳{Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-gray-300">{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                    <TableCell className="text-gray-300">{transaction.category}</TableCell>
                    <TableCell className="text-right">
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                      <DialogTrigger asChild>
                      <Button onClick={() => openEditDialog(transaction)} variant="ghost" size="icon" className="text-gray-300 hover:text-black">
                        <PencilLine className="h-4 w-4" />
                      </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-gray-100">Edit Transaction</DialogTitle>
                        </DialogHeader>
                        <EditTransactionForm transaction={selectedTransaction} onClose={handleEditClose} categoriesList={categories} />
                      </DialogContent>
                    </Dialog>
                      <Button onClick={() => handleDeleteTransaction(transaction)} variant="ghost" size="icon" className="text-gray-300 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
