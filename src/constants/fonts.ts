import {isIOS} from '../utils/platformUtil';

export const fontFamilies = {
  TRAINONE: {
    normal: isIOS() ? 'TrainOne-Regular' : 'TrainOneRegular',
  },
  ORBITRON: {
    normal: isIOS() ? 'Orbitron-Regular' : 'OrbitronRegular',
    medium: isIOS() ? 'Orbitron-Medium' : 'OrbitronMedium',
    bold: isIOS() ? 'Orbitron-Bold' : 'OrbitronBold',
    black: isIOS() ? 'Orbitron-Black' : 'OrbitronBlack',
    semiBold: isIOS() ? 'Orbitron-SemiBold' : 'OrbitronSemiBold',
    extraBold: isIOS() ? 'Orbitron-ExtraBold' : 'OrbitronExtraBold',
  },
};