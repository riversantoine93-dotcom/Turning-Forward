import { createClient } from "@/lib/supabase";

export type CourseProgress = Record<string, string | boolean | number>;

export async function loadCloudProgress(userId: string): Promise<CourseProgress> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("course_progress")
    .select("progress")
    .eq("user_id", userId)
    .eq("course_slug", "turning-forward")
    .maybeSingle();

  if (error) throw error;
  return (data?.progress as CourseProgress | null) ?? {};
}

export async function saveCloudProgress(userId: string, progress: CourseProgress) {
  const supabase = createClient();
  const { error } = await supabase.from("course_progress").upsert(
    {
      user_id: userId,
      course_slug: "turning-forward",
      progress,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_slug" }
  );

  if (error) throw error;
}
