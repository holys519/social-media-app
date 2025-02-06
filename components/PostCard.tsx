import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Avatar from "./Avatar";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "@/services/imageService";
import { useVideoPlayer, VideoView, VideoPlayer } from "expo-video";
import { Image } from "expo-image";
import { router } from "expo-router";

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

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {
  console.log("post item: ", item);
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
    if (item?.files && item?.file?.includes("postVideos")) {
      setVideoSource(getSupabaseFileUrl(item?.file)?.uri || null); // nullチェックを追加
    } else {
      setVideoSource(null); // 動画がない場合はvideoSourceをnullに設定
    }
  }, [item]);

  const player = useVideoPlayer(
    {
      uri: videoSource ?? "",
    },
    (player) => {
      player.loop = true;
      player.play();
    }
  );
  console.log("uri取得できてるかな？", getSupabaseFileUrl(item?.file)?.uri);
  const openPostDtails = () => {};
  // const createAt = moment(item?.created_at).format("MMM D");
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
            <Text style={styles.postTime}>{item?.created_at}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={openPostDtails}>
          <Icon
            name="threedotshorizontal"
            size={hp(3.4)}
            strokeWidth={3}
            color={theme.colors.text}
          />
        </TouchableOpacity>
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
            transition={100}
            style={styles.postMedia}
            // contentFit="cover"
          />
        )}
        {/* post Video */}
        {item?.files && item?.file?.includes("postVideos") && (
          // <Video
          //   source={getSupabaseFileUrl(item?.file)}
          //   transition={100}
          //   style={[styles.postMedia, {height: hp(30)}]}
          //   contentFit="cover"
          // />
          <VideoView
            style={{ flex: 1 }}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
          />
        )}
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: Number(theme.radius.xxl) * 1.1,
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
    borderRadius: 10,
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
