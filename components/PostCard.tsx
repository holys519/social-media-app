import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import React, { useState, useEffect, useMemo } from "react";
import { theme } from "@/constants/theme";
import { hp, stripHtmlTags, wp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { downloadFile, getSupabaseFileUrl } from "@/services/imageService";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import { createPostLike, removePostLike } from "@/services/postService";
import Loading from "./Loading";

const textStyles = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};
const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

interface PostCardProps {
  item: any;
  currentUser: { id: string; name: string; image: string };
  router: any;
  hasShadow?: boolean;
  showMoreIcon?: boolean;

  showDelete?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete = () => {},
  onEdit = () => {},
}) => {
  // console.log("post item: ", item);
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };
  const [videoSource, setVideoSource] = useState<string | null>(null);

  useEffect(() => {
    if (item?.file && item?.file.includes("postVideos")) {
      setVideoSource(getSupabaseFileUrl(item?.file)?.uri || null);
    } else {
      setVideoSource(null);
    }
  }, [item]);

  const [commentsCount, setCommentsCount] = useState(
    item?.comments?.length ?? 0
  );

  useEffect(() => {
    setCommentsCount(item?.comments?.length ?? 0);
  }, [item?.comments]);

  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });

  const [likes, setLikes] = useState<{ userId: string; postId: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLikes(item?.postLikes || []);
  }, [item?.postLikes]);

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({
      pathname: "/postDetails",
      params: { postId: String(item?.id) },
    });
  };

  const onLike = async () => {
    if (liked) {
      // remove like
      let res = await removePostLike(item?.id, currentUser?.id);
      if (res.success) {
        let updatedLikes = likes.filter(
          (like) => like.userId != currentUser?.id
        );
        setLikes([...updatedLikes]);
      } else {
        Alert.alert("Post", "something went wrong!");
      }
    } else {
      // createLike
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      let res = await createPostLike(data);
      if (res.success) {
        setLikes([...likes, data]);
      } else {
        Alert.alert("Post", "something went wrong!");
      }
    }
  };
  const liked = useMemo(() => {
    return likes.some((like) => like.userId === currentUser?.id);
  }, [likes, currentUser?.id]);
  console.log("post item: ", item);

  const onShare = async () => {
    let content: { message: string; url?: string } = {
      message: stripHtmlTags(item?.body),
    };
    if (item?.file) {
      // download then share the local uri
      setLoading(true);
      let url = await downloadFile(getSupabaseFileUrl(item?.file)?.uri);
      setLoading(false);
      if (url) {
        content.url = url;
      }
    }
    Share.share(content);
  };
  const createAt = moment(item?.created_at).format("MMM D");

  // console.log("post item: ", item?.comments);

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.heander}>
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={Number(theme.radius.md)}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createAt}</Text>
          </View>
        </View>

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threedotshorizontal"
              size={hp(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}

        {showDelete && currentUser.id == item?.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit}>
              <Icon
                name="edit"
                size={hp(3.4)}
                strokeWidth={3}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Icon
                name="delete"
                size={hp(3.4)}
                strokeWidth={3}
                color={theme.colors.rose}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>
        {/* post image */}
        {item?.file && item?.file.includes("postImages") && (
          <Image
            source={{ uri: getSupabaseFileUrl(item?.file)?.uri || "" }}
            style={styles.postMedia}
            resizeMode="cover"
          />
        )}
        {/* post Video */}
        {item?.file && item?.file.includes("postVideos") && (
          <VideoView
            style={styles.postMedia}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={true}
            isTVSelectable
          />
        )}
      </View>

      {/* like &  */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes?.length}</Text>
        </View>

        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{commentsCount}</Text>
        </View>
        <View style={styles.footerButton}>
          {loading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: Number(theme.radius.lg),
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  heander: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: "500",
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: "500",
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: Number(theme.radius.xl),
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
