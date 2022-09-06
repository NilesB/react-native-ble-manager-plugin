import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
} from "@expo/config-plugins";

import { withBLEAndroidManifest } from "./withBLEAndroidManifest";
import {
  BackgroundMode,
  withBLEBackgroundModes,
} from "./withBLEBackgroundModes";
import { withBluetoothPermissions } from "./withBluetoothPermissions";

const pkg = { name: "react-native-ble-manager", version: "UNVERSIONED" }; //require('react-native-ble-plx/package.json')

/**
 * Apply BLE configuration for Expo SDK 42 projects.
 */
const withBLE: ConfigPlugin<
  {
    isBackgroundEnabled?: boolean;
    neverForLocation?: boolean;
    modes?: BackgroundMode[];
    bluetoothAlwaysPermission?: string | false;
    bluetoothPeripheralPermission?: string | false;
  } | void
> = (config, props = {}) => {
  const _props = props || {};
  const isBackgroundEnabled = _props.isBackgroundEnabled ?? false;
  const neverForLocation = _props.neverForLocation ?? false;

  // iOS
  config = withBluetoothPermissions(config, _props);
  config = withBLEBackgroundModes(config, _props.modes || []);

  // Android
  config = AndroidConfig.Permissions.withPermissions(config, [
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_ADMIN",
    "android.permission.BLUETOOTH_CONNECT", // since Android SDK 31
    "android.permission.BLUETOOTH_SCAN",
  ]);
  config = withBLEAndroidManifest(config, {
    isBackgroundEnabled,
    neverForLocation,
  });

  return config;
};

export { BackgroundMode };

export default createRunOncePlugin(withBLE, pkg.name, pkg.version);
