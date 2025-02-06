import { theme } from "@/constants/theme";
import Home from "./Home";
import Image from "./Image";
import ArrowLeft from "./ArrowLeft";
import ArrowRight from "./ArrowRight";
import Mail from "./Mail";
import Call from "./Call";
import Cameras from "./Cameras";
import Delete from "./Delete";
import Edit from "./Edit";
import Heart from "./Heart";
import Location from "./Location";
import Lock from "./Lock";
import Plus from "./Plus";
import Search from "./Search";
import Send from "./Send";
import Share from "./Share";
import User from "./User";
import Logout from "./logout";
import Video from "./Video";
import ThreeDotsHorizontal from "./ThreeDotsHorizontal";

const icons = {
  home: Home,
  image: Image,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  mail: Mail,
  call: Call,
  camera: Cameras,
  delete: Delete,
  edit: Edit,
  heart: Heart,
  location: Location,
  lock: Lock,
  logout: Logout,
  plus: Plus,
  search: Search,
  send: Send,
  share: Share,
  user: User,
  video: Video,
  threedotshorizontal: ThreeDotsHorizontal,
};
type IconProps = {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
  color?: string;
  [key: string]: any;
};

const Icon = ({ name, ...props }: IconProps) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={theme.colors.textLight}
      {...props}
    />
  );
};

export default Icon;

// const styles = StyleSheet.create({})
