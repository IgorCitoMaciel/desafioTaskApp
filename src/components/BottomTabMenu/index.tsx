import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../shared/colors';
import { TabContainer, TabItem, IconContainer } from './styles';

export function BottomTabMenu({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <TabContainer>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let icon = '';
        switch (route.name) {
          case 'Home':
            icon = 'home';
            break;
          case 'TaskList':
            icon = 'list';
            break;
        }

        return (
          <TabItem
            key={route.key}
            onPress={onPress}
            isFocused={isFocused}
            activeOpacity={0.7}
          >
            <IconContainer isFocused={isFocused}>
              <Ionicons
                name={icon}
                size={isFocused ? 28 : 24}
                color={isFocused ? 'white' : colors.text.secondary}
              />
            </IconContainer>
          </TabItem>
        );
      })}
    </TabContainer>
  );
}
