"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log("Session: ", session);
    if (status === "authenticated") {
      console.log("Already logged in. Redirecting to home page...");
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
