import {isIOS} from '../utils/platformUtil';

export const fontFamilies = {
  TRAINONE: {
    normal: isIOS() ? 'TrainOne-Regular' : 'TrainOne-Regular',
  },
  ORBITRON: {
    normal: isIOS() ? 'Orbitron-Regular' : 'OrbitronRegular',
    medium: isIOS() ? 'Orbitron-Medium' : 'OrbitronMedium',
    bold: isIOS() ? 'Orbitron-Bold' : 'Orbitron-Bold',
    black: isIOS() ? 'Orbitron-Black' : 'OrbitronBlack',
    semiBold: isIOS() ? 'Orbitron-SemiBold' : 'OrbitronSemiBold',
    extraBold: isIOS() ? 'Orbitron-ExtraBold' : 'OrbitronExtraBold',
  },
  SMOOCHSANS: {
    thin: isIOS() ? 'SmoochSans-Thin' : 'SmoochSansThin',
    light: isIOS() ? 'SmoochSans-Light' : 'SmoochSansLight',
    normal: isIOS() ? 'SmoochSans-Regular' : 'SmoochSansRegular',
    medium: isIOS() ? 'SmoochSans-Medium' : 'SmoochSansMedium',
    semiBold: isIOS() ? 'SmoochSans-SemiBold' : 'SmoochSansSemiBold',
    bold: isIOS() ? 'SmoochSans-Bold' : 'SmoochSansBold',
    black: isIOS() ? 'SmoochSans-Black' : 'SmoochSansBlack',
    extraLight: isIOS() ? 'SmoochSans-ExtraLight' : 'SmoochSansExtraLight',
    extraBold: isIOS() ? 'SmoochSans-ExtraBold' : 'SmoochSansExtraBold',
  },
};