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
