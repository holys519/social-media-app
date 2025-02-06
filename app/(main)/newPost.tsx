import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import { hp, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/contexts/AuthContext";
import RichTextEditor from "../../components/RichTextEditor";
import { useRouter } from "expo-router";
import Icon from "@/assets/icons";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "@/services/imageService";
import { createOrUpdatePost } from "../..//services/postService"; // Add this line
import { useVideoPlayer, VideoView, VideoPlayer } from "expo-video";
import * as FileSystem from "expo-file-system";

const NewPost = () => {
  const authContext = useAuth();
  const user = authContext ? authContext.user : null;
  const bodyRef = useRef("");
  const editorRef = useRef<{ setContentHTML: (html: string) => void } | null>(
    null
  );
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [videoSource, setVideoSource] = useState<string | null>(null);
  const player = useVideoPlayer(
    {
      uri: videoSource ?? "",
    },
    (player) => {
      player.loop = true;
      player.play();
    }
  );
  const onPick = async (isImage: boolean) => {
    let mediaConfig: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3] as [number, number],
      quality: 0.7,
    };
    if (!isImage) {
      mediaConfig = {
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        // allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      };
    }
    let result = await ImagePicker.launchImageLibraryAsync(mediaConfig);

    if (!result.canceled && result.assets) {
      console.log("file: ", result.assets[0]);
      setFile(result.assets[0]);
      if (!isImage) {
        const pickedUri = result.assets[0].uri;
        setVideoSource(pickedUri);
      }
    }
    console.log("result 動画: ", result);
  };

  const isLocalFile = (file: any): boolean => {
    return file && typeof file === "object" && "uri" in file && "type" in file;
  };

  const getFileType = (file: any): string | null => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.type?.startsWith("video") ? "video" : "image";
    }
    return file?.includes("postVideo") ? "video" : "image";
  };

  console.log("File Type:", getFileType(file));

  const getFileUri = (file: any) => {
    if (!file) return null;
    if (isLocalFile(file)) {
      return file.uri;
    }

    const remoteUri = getSupabaseFileUrl(file)?.uri;
    console.log("remote uri: ", remoteUri);
    return remoteUri && remoteUri.endsWith(".mp4") ? remoteUri : null;
  };

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("Post", "Please choose an image or add post body");
      return;
    }

    let data = {
      file,
      body: bodyRef.current,
      userId: user?.id,
    };
    setLoading(true);
    console.log("submit data.file: ", data.file);

    let res = await createOrUpdatePost(data);
    console.log("submit res: ", res);
    setLoading(false);
    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current?.setContentHTML("");
      router.back();
    } else {
      Alert.alert("Post", "msg" in res ? res.msg : "An error occurred");
    }
  };
  console.log("file uri: ", getFileUri(file));

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <Header title="Create Post" />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          {/* Header Section: Avatar and User Information */}
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={Number(theme.radius.xl)}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user && user.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>

          {/* Rich Text Editor Section */}
          <View style={styles.textEditor}>
            <RichTextEditor
              editorRef={editorRef}
              onChange={(body: string) => (bodyRef.current = body)}
            />
          </View>
          {file && (
            <View style={styles.file}>
              {getFileType(file) == "video" ? (
                // <Video
                //   style={{ flex: 1 }}
                //   source={{ uri: getFileUri(file) }}
                //   useNativeControls
                //   resizeMode={ResizeMode.COVER}
                //   isLooping
                // />
                <VideoView
                  style={{ flex: 1 }}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                />
              ) : (
                <Image
                  source={{ uri: getFileUri(file) }}
                  resizeMode="cover"
                  style={[styles.fileImage]}
                />
              )}
              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={22} color="white" />
              </Pressable>
            </View>
          )}
          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={30} color={theme.colors.dark} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onPick(false)}>
                <Icon name="video" size={33} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Button
          buttonStyle={{ height: hp(6.2) }}
          title="Post"
          loading={loading}
          hasShadow={false}
          onPress={onSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: wp(4),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: hp(2.5),
    fontWeight: "600",
    color: theme.colors.text,
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: "500",
    color: theme.colors.textLight,
  },
  textEditor: {
    marginTop: 20,
    minHeight: 285,
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: Number(theme.radius.xl) * 1.4,
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: hp(1.9),
    fontWeight: "600",
    color: theme.colors.text,
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  viewo: {},
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.6)",
  },
  fileImage: {
    flex: 1,
    borderRadius: theme.radius.xl,
  },
  richEditor: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.gray,
  },
  richEditorContent: {
    borderRadius: theme.radius.xl,
  },
});
