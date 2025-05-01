import axios from 'axios';
import { create } from 'zustand';
import { hsvToHex } from '../utils/hsvToHex';
import { hexToHsv } from '../utils/hexToHsv';

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export interface CustomEffectPayload {
  functionNumber: number;
  speed?: number;
  colors?: HsvColor[];
  moving?: boolean,
  reverse?: boolean,
  blend?: boolean,
}

interface LastState {
  selectedColor: string;
  effectNumber: string | number;
  effectName: string;
  brightness: number;
  customEffect?: CustomEffectPayload;
}

export interface Effect {
  name: string;
  functionNumber: number;
  speedParams: number;
  colorParams: number;
  description?: string;
  sampleGradient?: string[];
  blend?: boolean,
  reverse?: boolean,
  moving?: boolean,
}

export interface Device {
  status: string;
  selectedColor: string;
  color: string;
  effectNumber: string | number;
  effectName: string;
  brightness: number;
  deviceName: string;
  roomName: string;
  effectCount: number;
  effectsList: Effect[];
  lastState?: LastState;
  favoriteColors: string[];
  favoriteEffects: FavoriteCustomEffect[];
}

interface FavoriteCustomEffect {
  name: string;
  functionNumber: number;
  speed?: number;
  colors?: HsvColor[];
  moving?: boolean;
  reverse?: boolean;
  blend?: boolean;
}

export interface SceneDeviceState {
  selectedColor?: string;
  effectNumber: string | number;
  effectName: string;
  brightness: number;
  custom: boolean;
  customEffect?: CustomEffectPayload;
}

interface Scene {
  name: string; // e.g., "Cozy Evening"
  devices: Record<string, SceneDeviceState>; // IP -> state
}

interface DeviceState {
  devices: Record<string, Device>;
  scenes: Scene[];
  syncMode: boolean;
  toggleSyncMode: () => void;
  addDevice: (deviceIP: string) => Promise<void>;
  fetchDeviceData: (deviceIP: string, retries?: number) => Promise<void>;
  fetchDeviceStatus: (deviceIP: string) => Promise<boolean>;
  setSelectedColor: (deviceIP: string, color: string) => void;
  setEffect: (deviceIP: string, functionNumber: number) => Promise<void>;
  setColor: (deviceIP: string, color: { h: number; s: number; v: number }) => Promise<void>;
  setBrightness: (deviceIP: string, brightness: number) => Promise<void>;
  setCustomEffect: (
    deviceIP: string,
    functionNumber: number,
    speed?: number,
    colors?: HsvColor[],
    moving?: boolean,
    reverse?: boolean,
    blend?: boolean
  ) => Promise<void>;
  cycleEffect: (deviceIP: string) => Promise<void>;
  toggleOnOff: (deviceIP: string) => Promise<void>;
  setDeviceName: (deviceIP: string, name: string) => void;
  removeDevice: (deviceIP: string) => void;
  addFavoriteColor: (deviceIP: string, color: string) => void;
  removeFavoriteColor: (deviceIP: string, index: number) => void;
  replaceFavoriteColor: (deviceIP: string, index: number, color: string) => void;
  addFavoriteEffect: (deviceIP: string, effect: FavoriteCustomEffect) => void;
  removeFavoriteEffect: (deviceIP: string, index: number) => void;
  applyFavoriteEffect: (deviceIP: string, index: number) => Promise<void>;
  addScene: (name: string, deviceConfigs: { ip: string; state: Partial<SceneDeviceState> }[]) => void;
  removeScene: (index: number) => void;
  applyScene: (index: number) => Promise<void>;
  updateScene: (index: number, name: string, deviceConfigs: { ip: string; state: Partial<SceneDeviceState> }[]) => void
}

const useDeviceStore = create<DeviceState>((set, get) => ({
  devices: {},
  syncMode: false,
  scenes: [],

  toggleSyncMode: () => set((state) => ({ syncMode: !state.syncMode })),

  addDevice: async (deviceIP: string) => {
  set((state) => ({
    devices: {
      ...state.devices,
      [deviceIP]: {
        status: "Loading...",
        selectedColor: "#FFFFFF",
        color: "Unknown",
        effectNumber: 0,
        effectName: "Unknown",
        brightness: 0,
        deviceName: "Unknown",
        effectCount: 0,
        roomName: "Unknown",
        effectsList: [],
        favoriteColors: ["#FFFFFF"],
        favoriteEffects: [],
      },
    },
  }));

  await get().fetchDeviceData(deviceIP);
  await get().fetchDeviceStatus(deviceIP);
},

  setDeviceName: (deviceIP: string, name: string) => {
    set((state) => ({
      devices: {
        ...state.devices,
        [deviceIP]: { ...state.devices[deviceIP], deviceName: name },
      },
    }));
  },

  removeDevice: (deviceIP: string) => {
    set((state) => {
      const newDevices = { ...state.devices };
      delete newDevices[deviceIP];
      return { devices: newDevices };
    });
  },

  fetchDeviceData: async (deviceIP: string, retries: number = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.get<{ effects: Effect[]; deviceName?: string; roomName?: string; functionCount?: number }>(
          `http://${deviceIP}/ledData`
        );
        set((state) => ({
          devices: {
            ...state.devices,
            [deviceIP]: {
              ...state.devices[deviceIP],
              effectsList: response.data.effects || [],
              // deviceName: response.data.deviceName || "Unknown",
              roomName: response.data.roomName || "Unknown",
              effectCount: response.data.functionCount || 0,
            },
          },
        }));
        console.log(`Fetched device data for ${deviceIP}:`, response.data);
        return;
      } catch (error) {
        console.error(`Attempt ${attempt} failed for ${deviceIP}:`, error);
        if (attempt === retries) {
          set((state) => ({
            devices: {
              ...state.devices,
              [deviceIP]: {
                ...state.devices[deviceIP],
                effectsList: [],
                deviceName: "Unavailable",
                roomName: "Unavailable",
              },
            },
          }));
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  },

  fetchDeviceStatus: async (deviceIP: string) => {
    try {
      const response = await axios.get(`http://${deviceIP}/status`);
      const { color, brightness } = response.data;
      const mappedBrightness = Math.round((brightness / 255) * 100);
      const hexColor = color && color.h !== undefined
        ? hsvToHex(color.h, color.s, color.v) // ESP32 HSV 0-255
        : "#FFFFFF";
      console.log(`Status for ${deviceIP}:`, response.data);
      set((state) => ({
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...state.devices[deviceIP],
            ...response.data,
            color: hexColor,
            selectedColor: hexColor,
            effectName: response.data.effectName || "Unknown",
            brightness: mappedBrightness,
            lastState: state.devices[deviceIP]?.lastState,
          },
        },
      }));
      return true;
    } catch (error) {
      console.error(`Error fetching status from ${deviceIP}:`, error);
      return false;
    }
  },

  setSelectedColor: (deviceIP: string, color: string) => {
    const { syncMode, devices } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];
    set((state) => {
      const updatedDevices = { ...state.devices };
      deviceIPs.forEach((ip) => {
        updatedDevices[ip] = {
          ...updatedDevices[ip],
          selectedColor: color,
        };
      });
      return { devices: updatedDevices };
    });
  },

  setEffect: async (deviceIP: string, functionNumber: number) => {
    const { syncMode, devices, setBrightness, fetchDeviceStatus } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];
    if (devices[deviceIP].brightness === 0) setBrightness(deviceIP, 100);

    try {
      const payload = { functionNumber };
      const requests = deviceIPs.map(ip =>
        axios.post(`http://${ip}/setEffect`, payload)
      );
      await Promise.all(requests);
      await Promise.all(deviceIPs.map(ip => fetchDeviceStatus(ip)));
      deviceIPs.forEach(ip => {
      set((state) => ({
        devices: {
          ...state.devices,
          [ip]: {
            ...state.devices[ip],
            lastState: {
              selectedColor: state.devices[ip].selectedColor,
              effectNumber: functionNumber,
              effectName: state.devices[ip].effectName || 'Unknown',
              brightness: state.devices[ip].brightness,
              customEffect: undefined,
            },
          },
        },
      }));
    });
    } catch (error) {
      console.error(`Error setting effect on ${deviceIP}:`, error);
    }
  },

  setColor: async (deviceIP: string, color: { h: number; s: number; v: number }) => {
    const { syncMode, devices, setBrightness, fetchDeviceStatus } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];
    if (devices[deviceIP].brightness === 0) setBrightness(deviceIP, 100);

    try {
      const payload = { h: color.h, s: color.s, v: color.v };
      const requests = deviceIPs.map(ip =>
        axios.post(`http://${ip}/setColor`, payload)
      );
      await Promise.all(requests);
      await Promise.all(deviceIPs.map(ip => fetchDeviceStatus(ip)));
      deviceIPs.forEach(ip => {
        set((state) => ({
          devices: {
            ...state.devices,
            [ip]: {
              ...state.devices[ip],
              lastState: {
                selectedColor: hsvToHex(color.h, color.s, color.v),
                effectNumber: state.devices[ip].effectCount,
                effectName: "Solid Color",
                brightness: state.devices[ip].brightness,
                customEffect: undefined,
              },
            },
          },
        }));
      });
    } catch (error) {
      console.error(`Error setting color on ${deviceIP}:`, error);
    }
  },

  setBrightness: async (deviceIP: string, brightness: number) => {
    const { syncMode, devices, fetchDeviceStatus } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];

    const clampedBrightness = Math.max(0, Math.min(100, brightness));
    const mappedBrightness = Math.round((clampedBrightness * 255) / 100);

    try {
      const payload = { brightness: mappedBrightness };
      const requests = deviceIPs.map(ip =>
        axios.post(`http://${ip}/setBrightness`, payload)
      );
      await Promise.all(requests);
      await Promise.all(deviceIPs.map(ip => fetchDeviceStatus(ip)));
    } catch (error) {
      console.error(`Error setting brightness on ${deviceIP}:`, error);
    }
  },

  cycleEffect: async (deviceIP: string) => {
    const { syncMode, devices, setBrightness, fetchDeviceStatus } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];
    if (devices[deviceIP].brightness === 0) setBrightness(deviceIP, 100);

    try {
      const requests = deviceIPs.map(ip =>
        axios.post(`http://${ip}/cycleEffect`)
      );
      await Promise.all(requests);
      await Promise.all(deviceIPs.map(ip => fetchDeviceStatus(ip)));
    } catch (error) {
      console.error(`Error cycling effect on ${deviceIP}:`, error);
    }
  },

  toggleOnOff: async (deviceIP: string) => {
    const { syncMode, devices, setColor, setEffect, setCustomEffect, setBrightness, fetchDeviceStatus } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];
    const device = devices[deviceIP];
    const isOff = device.effectName === "LEDs Off";

    console.log(`Status ${device.selectedColor}`);
    console.log(`Status ${device.effectName}`);
    console.log(`Status ${device.effectNumber}`);
    console.log(`Status ${device.brightness}`);

    if (!isOff) {
      const lastState: LastState = {
        selectedColor: device.selectedColor,
        effectNumber: device.effectNumber,
        effectName: device.effectName,
        brightness: device.brightness,
        customEffect: device.effectName !== "Solid Color" && device.lastState?.customEffect
          ? device.lastState.customEffect
          : undefined,
      };
      set((state) => ({
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...state.devices[deviceIP],
            lastState,
          },
        },
      }));
      try {
        const requests = deviceIPs.map(ip =>
          axios.post(`http://${ip}/onOff`, {}, { timeout: 2000 })
        );
        await Promise.all(requests);
        await Promise.all(deviceIPs.map(ip => fetchDeviceStatus(ip)));
      } catch (error) {
        console.error(`Error turning on/off ${deviceIP}:`, error);
        return;
      }
    }


    else {
      const lastState = device.lastState;
      if (device.brightness === 0) setBrightness(deviceIP, 100);
      if (lastState) {
        try {
          if (lastState.customEffect) {
            await setCustomEffect(
              deviceIP,
              lastState.customEffect.functionNumber,
              lastState.customEffect.speed,
              lastState.customEffect.colors
            );
          } else if (lastState.effectName === "Solid Color" && lastState.selectedColor) {
            const hsv = hexToHsv(lastState.selectedColor);
            await setColor(deviceIP, hsv);
          } else if (lastState.effectNumber !== undefined && lastState.effectName !== "Solid Color" && lastState.effectName !== "LEDs Off") {
            await setEffect(deviceIP, lastState.effectNumber as number);
            await fetchDeviceStatus(deviceIP);
          } else {
            await setColor(deviceIP, hexToHsv("#FFFFFF"));
          }
        } catch (error) {
          console.error(`Error restoring state for ${deviceIP}:`, error);
        }
      } else {
        await setColor(deviceIP, hexToHsv("#FFFFFF"));
      }
    }
  },

  setCustomEffect: async (
    deviceIP: string,
    functionNumber: number,
    speed?: number,
    colors?: HsvColor[],
    moving?: boolean,
    reverse?: boolean,
    blend?: boolean,
  ) => {
    const { syncMode, devices, setBrightness, fetchDeviceStatus } = get();
    const deviceIPs = syncMode ? Object.keys(devices) : [deviceIP];
    if (devices[deviceIP].brightness === 0) setBrightness(deviceIP, 100);
    try {
      const payload: CustomEffectPayload = { functionNumber };
      if (speed !== undefined) payload.speed = speed;
      if (colors) payload.colors = colors;
      if (moving) payload.moving = moving;
      if (reverse) payload.reverse = reverse;
      if (blend) payload.blend = blend;
      console.log(payload);
      const requests = deviceIPs.map(ip =>
        axios.post(`http://${ip}/setCustomEffect`, payload, { timeout: 2000 })
      );
      await Promise.all(requests);
      await Promise.all(deviceIPs.map(ip => fetchDeviceStatus(ip)));
      deviceIPs.forEach(ip => {
        set((state) => ({
          devices: {
            ...state.devices,
            [ip]: {
              ...state.devices[ip],
              lastState: {
                selectedColor: state.devices[ip].selectedColor,
                effectNumber: functionNumber,
                effectName: state.devices[ip].effectName || 'Custom',
                brightness: state.devices[ip].brightness,
                customEffect: payload,
              },
            },
          },
        }));
      });
    } catch (error) {
      console.error(`Error setting custom effect on ${deviceIP}:`, error);
    }
  },
  
  addFavoriteColor: (deviceIP: string, color: string) => {
    set((state) => {
      const device = state.devices[deviceIP];
      if (!device) return state;
      if (device.favoriteColors.length >= 10) return state; // Max 10
      const updatedFavorites = [...device.favoriteColors, color];
      return {
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...device,
            favoriteColors: updatedFavorites,
          },
        },
      };
    });
  },

  removeFavoriteColor: (deviceIP: string, index: number) => {
    set((state) => {
      const device = state.devices[deviceIP];
      if (!device || index < 0 || index >= device.favoriteColors.length) return state;
      const updatedFavorites = device.favoriteColors.filter((_, i) => i !== index);
      return {
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...device,
            favoriteColors: updatedFavorites,
          },
        },
      };
    });
  },

  replaceFavoriteColor: (deviceIP: string, index: number, color: string) => {
    set((state) => {
      const device = state.devices[deviceIP];
      if (!device || index < 0 || index >= device.favoriteColors.length) return state;
      const updatedFavorites = [...device.favoriteColors];
      updatedFavorites[index] = color; // Replace at index
      return {
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...device,
            favoriteColors: updatedFavorites,
          },
        },
      };
    });
  },

  addFavoriteEffect: (deviceIP: string, effect: FavoriteCustomEffect) => {
    set((state) => {
      const device = state.devices[deviceIP];
      if (!device || device.favoriteEffects.length >= 10) return state; // Max 10
      const updatedEffects = [...device.favoriteEffects, effect];
      return {
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...device,
            favoriteEffects: updatedEffects,
          },
        },
      };
    });
  },

  removeFavoriteEffect: (deviceIP: string, index: number) => {
    set((state) => {
      const device = state.devices[deviceIP];
      if (!device || index < 0 || index >= device.favoriteEffects.length) return state;
      const updatedEffects = device.favoriteEffects.filter((_, i) => i !== index);
      return {
        devices: {
          ...state.devices,
          [deviceIP]: {
            ...device,
            favoriteEffects: updatedEffects,
          },
        },
      };
    });
  },

  applyFavoriteEffect: async (deviceIP: string, index: number) => {
    const { devices, setCustomEffect } = get();
    const device = devices[deviceIP];
    if (!device || index < 0 || index >= device.favoriteEffects.length) return;
    const effect = device.favoriteEffects[index];
    await setCustomEffect(
      deviceIP,
      effect.functionNumber,
      effect.speed,
      effect.colors,
      effect.moving,
      effect.reverse,
      effect.blend
    );
  },

  addScene: (name: string, deviceConfigs: { ip: string; state: Partial<SceneDeviceState> }[]) => {
    set((storeState) => {
      const devicesState: Record<string, SceneDeviceState> = {};
      deviceConfigs.forEach(({ ip, state: configState }) => {
        const device = storeState.devices[ip];
        if (device) {
          devicesState[ip] = {
            selectedColor: configState.selectedColor || device.selectedColor || '#FFFFFF',
            effectNumber: configState.effectNumber ?? device.effectNumber ?? 0,
            effectName: configState.effectName || device.effectName || 'Unknown',
            brightness: configState.brightness ?? device.brightness ?? 100,
            custom: configState.custom ?? device.effectName === 'Solid Color' ? false : true,
            customEffect: configState.customEffect || device.lastState?.customEffect,
          };
        }
      });
      const newScene: Scene = { name, devices: devicesState };
      return {
        scenes: [...storeState.scenes, newScene],
      };
    });
  },

  removeScene: (index: number) => {
    set((state) => {
      if (index < 0 || index >= state.scenes.length) return state;
      const updatedScenes = state.scenes.filter((_, i) => i !== index);
      return { scenes: updatedScenes };
    });
  },

  applyScene: async (index: number) => {
    const { scenes, setColor, setEffect, setCustomEffect, setBrightness } = get();
    if (index < 0 || index >= scenes.length) return;
    const scene = scenes[index];
    const requests: Promise<void>[] = [];

    Object.entries(scene.devices).forEach(([ip, state]) => {
      if (state.custom === true && state.customEffect) {
        requests.push(
          setCustomEffect(
            ip,
            state.customEffect.functionNumber,
            state.customEffect.speed,
            state.customEffect.colors,
            state.customEffect.moving,
            state.customEffect.reverse,
            state.customEffect.blend
          )
        );
      } else if (state.effectName === "Solid Color") {
        if (state.selectedColor) {
          const hsv = hexToHsv(state.selectedColor);
          requests.push(setColor(ip, hsv));
        }
      } else {
        requests.push(setEffect(ip, Number(state.effectNumber)));
      }
      requests.push(setBrightness(ip, state.brightness));
    });

    try {
      await Promise.all(requests);
    } catch (error) {
      console.error("Error applying scene:", error);
    }
  },
  updateScene: (index: number, name: string, deviceConfigs: { ip: string; state: Partial<SceneDeviceState> }[]) => {
    set((state) => {
      if (index < 0 || index >= state.scenes.length) return state;
      const devicesState: Record<string, SceneDeviceState> = {};
      deviceConfigs.forEach(({ ip, state: configState }) => {
        const device = state.devices[ip];
        if (device) {
          devicesState[ip] = {
            selectedColor: configState.selectedColor || device.selectedColor || '#FFFFFF',
            effectNumber: configState.effectNumber ?? device.effectNumber ?? 0,
            effectName: configState.effectName || device.effectName || 'Unknown',
            brightness: configState.brightness ?? device.brightness ?? 100,
            custom: configState.custom ?? device.effectName === 'Solid Color' ? false : true,
            customEffect: configState.customEffect || device.lastState?.customEffect,
          };
        }
      });
      const updatedScene: Scene = { name, devices: devicesState };
      const updatedScenes = [...state.scenes];
      updatedScenes[index] = updatedScene;
      return {
        scenes: updatedScenes,
      };
    });
  },

}));

export default useDeviceStore;