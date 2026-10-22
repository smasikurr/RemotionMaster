import { Config } from "@remotion/cli/config";

// Set default video encoding options
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setCrf(17);
Config.setPixelFormat("yuv420p");
Config.setConcurrency(4);

// Override webpack configuration for smooth bundling
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      fallback: {
        ...currentConfiguration.resolve?.fallback,
      },
    },
  };
});
