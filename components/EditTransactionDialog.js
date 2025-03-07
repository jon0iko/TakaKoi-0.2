"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function EditTransactionForm({ transaction, onClose, categoriesList }) {

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);


  const [formData, setFormData] = useState({
    description: transaction.description || "",
    amount: transaction.amount?.toString() || "",
    category: transaction.category_id || "",
    date: transaction.date,
  });


  useEffect(() => {
    if (categoriesList) {
      setCategories(categoriesList);
    }
  }, [categoriesList]); 

  // useEffect(() => {
  //   if (transaction) {
  //     console.log("Updating form with transaction:", transaction); // Debugging log
  //     setFormData({
  //       description: transaction.description,
  //       amount: transaction.amount?.toString() || "",
  //       category: transaction.category || "",
  //       date: transaction.date || new Date().toISOString().split("T")[0],
  //     });
  //   }
  // }, [transaction]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Debugging log
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
      return;
    }

    // add transaction_id to formData
    formData.transaction_id = transaction.id;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/transactions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transaction, ...formData }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
        variant: "success",
        className: "bg-green-500 text-white",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description Input */}
      <div>
        <label className="text-gray-300">Description</label>
        <Input
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-gray-100"
        />
      </div>

      {/* Amount Input */}
      <div>
        <label className="text-gray-300">Amount</label>
        <Input
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          className="bg-gray-700 border-gray-600 text-gray-100"
        />
      </div>

      {/* Category Select */}
      <div>
        <label className="text-gray-300">Category</label>
        <Select name="category" value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700 text-white">
            {categories.map((category) => (
              <SelectItem key={category.category_id} value={category.category_id.toString()}>
                {category.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Input */}
      <div>
        <label className="text-gray-300">Date</label>
        <Input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-gray-100"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
