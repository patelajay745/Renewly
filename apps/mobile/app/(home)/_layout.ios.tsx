import {NativeTabs, Icon, Label} from "expo-router/unstable-native-tabs";
import {Home, PlusCircle, Settings} from "lucide-react-native";

export default function Layout() {
  return (
    <NativeTabs backgroundColor={"red"}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon sf={{default: "house", selected: "house.fill"}} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="create-subscription">
        <Label>Create</Label>
        <Icon sf={{default: "plus.app", selected: "plus.app"}} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf={{default: "gearshape", selected: "gearshape.fill"}} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
