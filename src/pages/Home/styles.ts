import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { colors } from '../../shared/colors';

export const Container = styled.View`
  flex: 1;
  background-color: ${colors.background.gradient.start};
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

export const Content = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: 10px;
`;

export const HeroSection = styled.View`
  margin-bottom: 30px;
  align-items: center;
  padding: 0 10px;
`;

export const WelcomeContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 25px 20px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);

  ${Platform.select({
    ios: `
      shadow-color: rgba(0, 0, 0, 0.1);
      shadow-offset: 0px 10px;
      shadow-opacity: 0.3;
      shadow-radius: 20px;
    `,
    android: `
      elevation: 15;
    `,
  })}
`;

export const WelcomeTitle = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 10px;

  ${Platform.select({
    ios: `
      text-shadow-color: rgba(0, 0, 0, 0.3);
      text-shadow-offset: 0px 2px;
      text-shadow-radius: 10px;
    `,
    android: `
      elevation: 4;
    `,
  })}
`;

export const WelcomeSubtitle = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  line-height: 24px;
`;

export const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  gap: 12px;
  padding: 0 20px;
  width: 100%;
`;

export const StatsTitle = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 15px;
  text-align: center;

  ${Platform.select({
    ios: `
      text-shadow-color: rgba(0, 0, 0, 0.2);
      text-shadow-offset: 0px 1px;
      text-shadow-radius: 5px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

export const StatCard = styled.View`
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  width: 100px;
  aspect-ratio: 1;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.2);

  ${Platform.select({
    ios: `
      shadow-color: rgba(0, 0, 0, 0.1);
      shadow-offset: 0px 5px;
      shadow-opacity: 0.2;
      shadow-radius: 15px;
    `,
    android: `
      elevation: 8;
    `,
  })}
`;

export const StatNumber = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;

  ${Platform.select({
    ios: `
      text-shadow-color: rgba(0, 0, 0, 0.2);
      text-shadow-offset: 0px 1px;
      text-shadow-radius: 3px;
    `,
    android: `
      elevation: 2;
    `,
  })}
`;

export const StatLabel = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
`;

export const FormSection = styled.View`
  background-color: white;
  border-radius: 24px;
  padding: 25px;
  margin-bottom: 20px;

  ${Platform.select({
    ios: `
      shadow-color: rgba(102, 126, 234, 0.25);
      shadow-offset: 0px 15px;
      shadow-opacity: 0.4;
      shadow-radius: 25px;
    `,
    android: `
      elevation: 20;
    `,
  })}
`;

export const FormTitle = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 22px;
  font-weight: 600;
  color: ${colors.text.primary};
  margin-bottom: 15px;
  text-align: center;
`;
