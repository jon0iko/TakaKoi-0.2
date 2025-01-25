"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number.",
  }),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
});

export function AddTransactionForm({ onClose }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: "",
      type: "expense",
      category: "", // Initially empty
      date: new Date().toISOString().split("T")[0],
    },
  });
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]); // State to store fetched categories
  const userId = localStorage.getItem("userId");

  // Fetch categories from the server
  useEffect(() => {
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

    fetchCategories();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/transactions/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          user_id: userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Error",
          description: data.message || "An error occurred.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Transaction added successfully.",
        variant: "success",
        className: "bg-green-500 text-white",
      });

      form.reset({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter description"
                  {...field}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </FormControl>
              <FormMessage className="text-rose-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </FormControl>
              <FormMessage className="text-rose-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem
                        value="income"
                        className="border-gray-600 text-blue-400"
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-gray-300">
                      Income
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <RadioGroupItem
                        value="expense"
                        className="border-gray-600 text-blue-400"
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-gray-300">
                      Expense
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-rose-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)} // Update form value with category_id
                value={field.value} // Controlled input
              >
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue>
                      {field.value
                        ? categories.find(
                            (category) =>
                              category.category_id === Number(field.value)
                          )?.category_name
                        : "Select a category"}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.category_id.toString()}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-rose-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </FormControl>
              <FormMessage className="text-rose-400" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
