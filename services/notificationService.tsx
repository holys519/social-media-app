import { supabase } from "@/lib/supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("notification error: ", error);
      return { success: false, msg: "Could not like the posts" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("notification error: ", error);
    return { success: false, msg: "Could not like the posts" };
  }
};

export const fetchNotifications = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        sender: senderId(id, name, image)
        `
      )
      .eq("receiverId", receiverId)
      .order("create_at", { ascending: false })
      .single();

    if (error) {
      console.log("fetchNotifications error: ", error);
      return { success: false, msg: "Could not fetch notifications" };
    }

    return { success: true, data: { ...data, comments: data.comments ?? [] } }; // コメントがない場合、空配列を返す
  } catch (error) {
    console.log("fetchNotifications error: ", error);
    return { success: true, msg: "Could not fetch notifications" };
  }
};
