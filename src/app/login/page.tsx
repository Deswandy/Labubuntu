'use client';
import { createClient } from "@/utils/supabase/client";

export default function page() {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
        options: {
        redirectTo: `${location.origin}/dashboard`
      }
    });
    
  };

  return (
    <button onClick={handleSignIn}>
      Sign in with Google
    </button>
  );
}
