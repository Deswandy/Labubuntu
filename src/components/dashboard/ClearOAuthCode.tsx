'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from "@/utils/supabase/client"

export function ClearOAuthCode() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const cleanUrl = () => {
      const url = new URL(window.location.href);
      if (url.searchParams.has('code') || url.searchParams.has('state')) {
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        router.replace(url.pathname); // remove query params
      }
    };

    cleanUrl();
  }, [router]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // use push instead of forward
      }
    };

    checkUser();
  }, [router, supabase]);

  return null;
}
