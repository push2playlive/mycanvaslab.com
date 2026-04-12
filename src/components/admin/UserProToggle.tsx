import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Switch } from "../ui/switch";
import { toast } from "sonner";

export function UserProToggle({ userId, initialStatus }: { userId: string, initialStatus: boolean }) {
  const [isPro, setIsPro] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const togglePro = async (checked: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_pro: checked })
        .eq('user_id', userId);

      if (error) {
        toast.error("Failed to update status");
      } else {
        setIsPro(checked);
        toast.success(checked ? "User promoted to PRO" : "User reverted to Standard");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={isPro} 
        onCheckedChange={togglePro} 
        disabled={loading}
      />
      <span className={isPro ? "text-green-500 font-bold text-[10px] uppercase tracking-widest" : "text-zinc-500 text-[10px] uppercase tracking-widest"}>
        {isPro ? "PRO ACTIVE" : "STANDARD"}
      </span>
    </div>
  );
}
