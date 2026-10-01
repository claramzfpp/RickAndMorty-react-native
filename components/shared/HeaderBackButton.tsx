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

/** Item para `unstable_headerLeftItems`; `hidesSharedBackground` remove o fundo de vidro nativo do iOS 26 que duplicaria o fundo do botão. */
export const headerBackButtonItem = (onPress: () => void) => ({
  type: 'custom' as const,
  element: <HeaderBackButton onPress={onPress} />,
  hidesSharedBackground: true,
});
