import { StyleSheet } from 'react-native';

// Theme Colors
export const colors = {
  primaryBackground: 'rgb(10, 15, 20)',
  sectionBackground: 'rgb(22, 24, 29)',
  tertiaryBackground: 'rgb(30, 35, 40)',
  secondaryDark: 'rgb(44, 40, 40)',
  textPrimary: 'rgba(255, 255, 255, 0.9)',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textPlaceholder: 'rgb(150, 150, 150)',
  errorRed: 'rgb(255, 100, 100)',
  settingsColor: 'rgb(255, 165, 0)',
  deviceColor: 'cyan',
  scenesColor: 'rgb(0, 255, 140)',
  homeColor: 'rgb(255, 0, 200)',
};

// Common Shadows
export const shadows = {
  default: {
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 5, height: 5 },
    elevation: 10,
  },
  large: {
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 10, height: 10 },
    elevation: 10,
  },
};

// Common Borders
export const borders = {
  default: {
    borderColor: 'black',
    borderWidth: 1,
  },
  accent: {
    borderWidth: 1,
  },
};

// Common Styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    padding: 20,
  },
});