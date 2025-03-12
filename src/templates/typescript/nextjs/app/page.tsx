"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Welcome to Movement Labs</CardTitle>
          <CardDescription>Get started building your DApp</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            This is a starter template for building decentralized applications with Movement Labs.
            Edit <code className="text-sm font-mono">app/page.tsx</code> to get started.
          </p>
          <Button className="w-full">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
