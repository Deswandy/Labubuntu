"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    const supabase = createClient();
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete item.");
    } else {
      startTransition(() => {
        router.refresh();
      });
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:underline text-sm mt-2 bg-red-200 px-2 rounded-2xl"
    >
      {isPending ? "Deleting..." : "X Delete"}
    </button>
  );
}
