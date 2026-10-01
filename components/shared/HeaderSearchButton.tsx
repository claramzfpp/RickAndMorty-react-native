import { HeaderCircleButton } from '@/components/shared/HeaderCircleButton';

interface HeaderSearchButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

export const HeaderSearchButton = ({ onPress, isActive = false }: HeaderSearchButtonProps) => (
  <HeaderCircleButton
    symbol={isActive ? { ios: 'xmark', android: 'close', web: 'close' } : { ios: 'magnifyingglass', android: 'search', web: 'search' }}
    accessibilityLabel={isActive ? 'Close search' : 'Open search'}
    onPress={onPress}
  />
);

/** Item para `unstable_headerRightItems`; mesmo estilo do `headerBackButtonItem`. */
export const headerSearchButtonItem = (onPress: () => void, isActive = false) => ({
  type: 'custom' as const,
  element: <HeaderSearchButton onPress={onPress} isActive={isActive} />,
  hidesSharedBackground: true,
});
