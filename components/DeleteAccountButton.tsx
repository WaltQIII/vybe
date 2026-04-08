"use client";

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountButton() {
  const [step, setStep] = useState<"idle" | "confirm" | "deleting">("idle");
  const [confirmText, setConfirmText] = useState("");
  const supabase = createClient();
  const router = useRouter();

  async function handleDelete() {
    if (confirmText !== "DELETE") return;
    setStep("deleting");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("profiles").delete().eq("id", user.id);
      }

      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setStep("idle");
    }
  }

  if (step === "idle") {
    return (
      <button
        type="button"
        onClick={() => setStep("confirm")}
        className="rounded border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100"
      >
        Delete My Account
      </button>
    );
  }

  return (
    <div className="rounded border border-red-300 bg-red-50 p-3">
      <p className="mb-2 text-xs font-bold text-red-700">
        Are you sure? Type DELETE to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="Type DELETE"
        className="ms-input mb-2 !border-red-300"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={confirmText !== "DELETE" || step === "deleting"}
          className="rounded bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
        >
          {step === "deleting" ? "Deleting..." : "Permanently Delete"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("idle");
            setConfirmText("");
          }}
          className="rounded border border-gray-300 px-4 py-2 text-xs text-[#666] hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
