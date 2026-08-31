import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "../context/ThemeContext";

type Segment = { label: string; value: number; color: string };

type DonutChartProps = {
  data: Segment[];
  centerLabel: string;
  centerValue: string;
};

const SIZE = 180;
const STROKE_WIDTH = 24;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const DonutChart: React.FC<DonutChartProps> = ({ data, centerLabel, centerValue }) => {
  const { colors } = useTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulativePercent = 0;

  return (
    <View style={styles.wrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={colors.border}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {total > 0 &&
          data.map((segment, index) => {
            const percent = segment.value / total;
            const segmentLength = percent * CIRCUMFERENCE;
            const offset = CIRCUMFERENCE * (1 - cumulativePercent);
            cumulativePercent += percent;

            return (
              <Circle
                key={index}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={segment.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${segmentLength} ${CIRCUMFERENCE}`}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                fill="none"
                rotation="-90"
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
            );
          })}
      </Svg>
      <View style={styles.centerOverlay}>
        <Text style={[styles.centerValue, { color: colors.textPrimary }]}>{centerValue}</Text>
        <Text style={[styles.centerLabel, { color: colors.textSecondary }]}>{centerLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", marginVertical: 16 },
  centerOverlay: { position: "absolute", alignItems: "center" },
  centerValue: { fontSize: 22, fontWeight: "700" },
  centerLabel: { fontSize: 12 },
});