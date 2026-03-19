// Simple donut/pie chart component using SVG
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { FontSize, FontWeight, Spacing } from '@/constants/theme';

interface DonutChartProps {
  data: { value: number; color: string; label: string }[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({
  data,
  size = 180,
  strokeWidth = 28,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) return null;

  let startAngle = -90;
  const paths = data.map((segment) => {
    const percentage = segment.value / total;
    const angle = percentage * 360;
    const endAngle = startAngle + angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    ].join(' ');

    startAngle = endAngle;

    return { d, color: segment.color };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G>
          {paths.map((path, i) => (
            <Path
              key={i}
              d={path.d}
              fill="none"
              stroke={path.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          ))}
        </G>
      </Svg>
      {centerLabel && (
        <View style={[styles.center, { width: size, height: size }]}>
          <Text style={[styles.centerValue, { color: colors.textPrimary }]}>
            {centerValue}
          </Text>
          <Text style={[styles.centerLabel, { color: colors.textMuted }]}>
            {centerLabel}
          </Text>
        </View>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        {data.map((item, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  center: {
    position: 'absolute',
    top: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerValue: {
    fontSize: FontSize.h2,
    fontWeight: FontWeight.bold,
  },
  centerLabel: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.regular,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: FontSize.caption,
    fontWeight: FontWeight.medium,
  },
});
