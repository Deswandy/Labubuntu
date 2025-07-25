'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ClearOAuthCode() {
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('code') || url.searchParams.has('state')) {
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      router.replace(url.pathname); // removes query params without reloading
    }
  }, []);

  return null;
}
