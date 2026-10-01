import { HeaderCircleButton } from '@/components/shared/HeaderCircleButton';

interface HeaderBackButtonProps {
  onPress: () => void;
}

export const HeaderBackButton = ({ onPress }: HeaderBackButtonProps) => (
  <HeaderCircleButton
    symbol="chevron.backward"
    accessibilityLabel="Go back"
    onPress={onPress}
    iconPaddingRight={2}
  />
);

/** Item for `unstable_headerLeftItems`; `hidesSharedBackground` removes the native iOS 26 glass background that would duplicate the button's own background. */
export const headerBackButtonItem = (onPress: () => void) => ({
  type: 'custom' as const,
  element: <HeaderBackButton onPress={onPress} />,
  hidesSharedBackground: true,
});
