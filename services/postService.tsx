import { supabase } from "@/lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost = async (post: any) => {
  try {
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";
      // postService.tsx
      let fileResult = await uploadFile(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();
    if (error) {
      console.log("createPost error: ", error);
      return { success: false, msg: "Could not create your post" };
    }
    return { success: true, data: data };
  } catch (error) {
    console.log("createPost error: ", error);
    return { success: false, msg: "Could not create your post" };
  }
};

export const fetchPosts = async (limit = 10, userId: string) => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
        *,
        user: users (id, name, image),
        postLikes (*)
        `
        )
        .order("created_at", { ascending: false })
        .eq("userId", userId)
        .limit(limit);

      if (error) {
        console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch the posts" };
      }

      return { success: true, data: data };
    } else {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
    *,
    user: users (id, name, image),
    postLikes (*)
    `
        )
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch the posts" };
      }

      return { success: true, data: data };
    }
  } catch (error) {
    console.log("fetchPosts error: ", error);
    return { success: false, msg: "Could not fetch the posts" };
  }
};
export const fetchPostDetails = async (postId: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      user: users (id, name, image),
      postLikes (*),
      comments (*, user: users(id, name, image))
      ` // comments のリレーション名を明示
    )
    .eq("id", postId)
    .single();

  if (error) {
    console.log("fetchPostDetails error: ", error);
    return { success: false, msg: "Could not fetch the post details" };
  }

  return { success: true, data: { ...data, comments: data.comments ?? [] } }; // コメントがない場合、空配列を返す
};

export const createPostLike = async (postLike: {
  postId: string;
  userId: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not like the posts" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the posts" };
  }
};

export const removePostLike = async (postId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId)
      .single();

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not like the posts" };
    }

    return { success: true };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not like the posts" };
  }
};

interface Comment {
  postId: string;
  userId: string;
  content: string;
  createdAt?: string;
}

export const createComment = async (comment: Comment) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (error) {
      console.log("postLike error: ", error);
      return { success: false, msg: "Could not create your comment" };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("postLike error: ", error);
    return { success: false, msg: "Could not create your comment" };
  }
};

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.log("removeComment error: ", error);
      return { success: false, msg: "Could not remove the comment" };
    }

    return { success: true, data: commentId };
  } catch (error) {
    console.log("removeComment error: ", error);
    return { success: false, msg: "Could not remove the comment" };
  }
};

export const removePost = async (postId) => {
  try {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.log("removePost error: ", error);
      return { success: false, msg: "Could not remove the post" };
    }

    return { success: true, data: postId };
  } catch (error) {
    console.log("removePost error: ", error);
    return { success: false, msg: "Could not remove the post" };
  }
};
