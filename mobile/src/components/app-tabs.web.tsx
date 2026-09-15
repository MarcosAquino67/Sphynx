import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  type TabTriggerSlotProps,
  type TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

type TabButtonProps = TabTriggerSlotProps & {
  iosIcon: string;
  webIcon: string;
  label: string;
};

function TabButton({ iosIcon, webIcon, label, isFocused, ...props }: TabButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView type={isFocused ? 'backgroundSelected' : 'backgroundElement'} style={styles.tabButtonView}>
        <SymbolView name={{ ios: iosIcon as any, android: webIcon as any, web: webIcon as any }} size={14} />
        <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href={'/' as any} asChild>
            <TabButton iosIcon="book.fill" webIcon="book" label="Aprender" />
          </TabTrigger>
          <TabTrigger name="clasificacion" href={'/clasificacion' as any} asChild>
            <TabButton iosIcon="trophy.fill" webIcon="trophy" label="Clasificación" />
          </TabTrigger>
          <TabTrigger name="tienda" href={'/tienda' as any} asChild>
            <TabButton iosIcon="bag.fill" webIcon="bag" label="Tienda" />
          </TabTrigger>
          <TabTrigger name="perfil" href={'/perfil' as any} asChild>
            <TabButton iosIcon="person.fill" webIcon="person" label="Perfil" />
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="backgroundElement" style={styles.innerContainer}>
        <ThemedText type="smallBold" style={styles.brandText}>
          Sphynx
        </ThemedText>

        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.one,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    gap: 2,
  },
});