"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { create } from "domain";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const page = usePathname();

  const createOrGetUser = async (email: string | null | undefined) => {
    const resp = await fetch(`/api/users?email=${email}&name=${session?.user?.name}`);
    const data = await resp.json();
    if (resp.status === 200) {
      setUser(data);
      setLoading(false);
    } else {
      console.error("Error fetching user:", data.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (!user && session?.user) {
      createOrGetUser(session?.user?.email);
    }
  }, [session, status, user]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
