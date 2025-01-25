'use client';
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/lib/AuthContext"

export function Hero() {

  const { isSignedIn } = useAuth()
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-[#1a2b2b] px-4 text-center">
      <div className="container max-w-3xl space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Expense Tracker Application
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Having expense tracker application can help you manage your money well and make progress towards your future goals.
        </p>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          Start creating a budget for yourself and start saving money!
        </p>
        <Button
          asChild
          className="bg-[#d5c4a1] text-black hover:bg-[#d5c4a1]/90"
          size="lg"
        >
          <Link href={isSignedIn ? "/dashboard" : "/signin"}>Get Started</Link>
        </Button>
      </div>
    </section>
  )
}

