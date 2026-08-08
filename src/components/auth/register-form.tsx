"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { registerUser } from "@/actions/auth/register";
import { RegisterSchema } from "@/validations/auth";

import { GoogleLoginButton } from "./google-login-button";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RegisterValues = z.infer<typeof RegisterSchema>;

export function RegisterForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      try {
        const result = await registerUser(values);

        console.log(result);

        if (!result.success) {
          toast.error(result.message ?? "Registration failed.");
          return;
        }

        toast.success("Account created successfully.");

        console.log("Redirecting...");

        router.push("/login");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-center text-3xl font-bold">
          Create Account
        </CardTitle>

        <CardDescription className="text-center">
          Join Milkly and start shopping fresh dairy products.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google Signup */}

        <GoogleLoginButton />

        {/* Divider */}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>

          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR CREATE WITH EMAIL
            </span>
          </div>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>

            <Input
              id="name"
              placeholder="John Doe"
              autoComplete="name"
              {...register("name")}
            />

            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              {...register("email")}
            />

            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password")}
            />

            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Login Link */}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
