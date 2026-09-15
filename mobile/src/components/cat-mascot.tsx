import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const FUR = '#E5A15D';
const FUR_DARK = '#C98A44';
const INNER_EAR = '#F9CDBE';
const FEATURE = '#5B3A29';

type Props = {
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function CatMascot({ size = 96, style }: Props) {
  const earW = size * 0.24;
  const earH = size * 0.26;
  const innerEarH = earH * 0.55;
  const eyeD = size * 0.1;
  const eyeY = size * 0.34;
  const eyeGap = size * 0.28;
  const earGap = size * 0.06;

  return (
    <View style={[{ width: size, height: size * 1.1 }, style]}>
      <View
        style={[
          styles.ear,
          {
            borderBottomWidth: earH,
            borderLeftWidth: earW,
            borderRightWidth: earW,
            left: earGap,
            top: 0,
            width: 0,
            height: 0,
          },
        ]}
      />
      <View
        style={[
          styles.ear,
          {
            borderBottomWidth: earH,
            borderLeftWidth: earW,
            borderRightWidth: earW,
            right: earGap,
            top: 0,
            width: 0,
            height: 0,
          },
        ]}
      />
      <View style={{ position: 'absolute', left: earGap + earW * 0.45, top: earH - 1, width: 0, height: 0 }}>
        <View
          style={{
            borderBottomWidth: innerEarH,
            borderLeftWidth: earW * 0.5,
            borderRightWidth: earW * 0.5,
            width: 0,
            height: 0,
          }}
        />
      </View>

      <View
        style={[
          styles.head,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            top: earH * 0.62,
            alignSelf: 'center',
          },
        ]}>
        <View style={[styles.eye, { width: eyeD, height: eyeD, borderRadius: eyeD / 2, left: size * 0.27, top: eyeY }]} />
        <View style={[styles.eye, { width: eyeD, height: eyeD, borderRadius: eyeD / 2, right: size * 0.27, top: eyeY }]} />
        <View
          style={{
            position: 'absolute',
            top: size * 0.52,
            left: size / 2 - size * 0.045,
            width: size * 0.09,
            height: size * 0.05,
            backgroundColor: INNER_EAR,
            borderRadius: size * 0.03,
          }}
        />
        <View
          style={[
            styles.blush,
            { width: size * 0.16, height: size * 0.07, left: size * 0.18, top: size * 0.56 },
          ]}
        />
        <View
          style={[
            styles.blush,
            { width: size * 0.16, height: size * 0.07, right: size * 0.18, top: size * 0.56 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ear: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: FUR,
  },
  head: {
    position: 'absolute',
    backgroundColor: FUR,
    borderWidth: 2,
    borderColor: FUR_DARK,
  },
  eye: {
    position: 'absolute',
    backgroundColor: FEATURE,
  },
  blush: {
    position: 'absolute',
    backgroundColor: INNER_EAR,
    borderRadius: 8,
    opacity: 0.7,
  },
});