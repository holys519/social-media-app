import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { createComment, fetchPostDetails } from "@/services/postService";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";
import Input from "@/components/Input";
import Icon from "@/assets/icons";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const postIdString = Array.isArray(postId) ? postId[0] : postId;
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = useRef(null);
  const commentRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    getPostDetails();
  });

  const getPostDetails = async () => {
    let res = await fetchPostDetails(postIdString);
    if (res.success) setPost(res.data);
    setStartLoading(false);
  };

  const onNewComment = async () => {
    console.log("onNewComment called");
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id as string,
      content: commentRef.current,
    };

    setLoading(true);
    let res = await createComment(data);
    setLoading(false);
    if (res.success) {
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.list}
      >
        <PostCard
          item={post}
          currentUser={user}
          router={router}
          hasShadow={false}
          showMoreIcon={false}
        />

        {/* comment input */}
        <View style={styles.inputContainer}>
          <Input
            inputRef={inputRef}
            placeholder="Add a comment..."
            onChangeText={(value) => (commentRef.current = value)}
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: hp(6.2),
              borderRadius: theme.radius.xl,
            }}
          />
          {loading ? (
            <View>
              <Loading />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
              <Icon name="send" color={theme.colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.7),
    width: hp(5.7),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: "500", // or another valid value from the accepted set
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
