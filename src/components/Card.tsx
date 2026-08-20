import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { spacing, radii, typography } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

type CardProps = {
  icon?: string;
  iconColorKey?: 'expense' | 'income' | 'savings' | 'primary';
  title: string;
  subtitle?: string;
  date?: string;
  badgeLabel?: string;
  amountLabel?: string;
  amountColorKey?: 'expense' | 'income' | 'savings' | 'textPrimary';
  progressPercent?: number;
  progressState?: 'normal' | 'warning' | 'over';
  showPercentLabel?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export const Card: React.FC<CardProps> = ({
  icon,
  iconColorKey = 'primary',
  title,
  subtitle,
  date,
  badgeLabel,
  amountLabel,
  amountColorKey = 'textPrimary',
  progressPercent,
  progressState = 'normal',
  showPercentLabel = false,
  onPress,
  style,
}) => {
  const { colors } = useTheme();

  const barColor =
    progressState === 'over'
      ? colors.expense
      : progressState === 'warning'
      ? colors.warning
      : colors.primary;

  const iconRingColor = colors[iconColorKey];
  const amountColor = colors[amountColorKey];

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, style]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.row}>
        {icon ? (
          <View style={[styles.iconCircle, { borderColor: iconRingColor }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        ) : null}

        <View style={styles.textBlock}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
            </View>

            {amountLabel ? (
              <Text style={[styles.amount, { color: amountColor }]}>{amountLabel}</Text>
            ) : null}

            {showPercentLabel && typeof progressPercent === 'number' ? (
              <View style={styles.percentRow}>
                <Text
                  style={[
                    styles.percentText,
                    { color: progressState === 'over' ? colors.expense : colors.textSecondary },
                  ]}
                >
                  {progressPercent}%
                </Text>
                {progressState === 'over' ? <Text style={styles.warningIcon}> ⚠️</Text> : null}
              </View>
            ) : null}
          </View>

          <View style={styles.subtitleRow}>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            ) : null}

            {badgeLabel ? (
              <View style={[styles.badge, { borderColor: colors.savings }]}>
                <Text style={[styles.badgeText, { color: colors.savings }]}>{badgeLabel}</Text>
              </View>
            ) : null}

            {date ? (
              <Text style={[styles.date, { color: colors.textSecondary }]}>{date}</Text>
            ) : null}
          </View>

          {typeof progressPercent === 'number' ? (
            <View style={[styles.progressTrack, { backgroundColor: colors.background }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(progressPercent, 100)}%`, backgroundColor: barColor },
                ]}
              />
            </View>
          ) : null}
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLeft: {
    flex: 1,
  },
  title: {
    ...typography.bodyLarge,
  },
  amount: {
    ...typography.bodyLarge,
    fontWeight: '700',
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  warningIcon: {
    fontSize: 14,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  subtitle: {
    ...typography.caption,
  },
  date: {
    ...typography.caption,
  },
  badge: {
    borderWidth: 1,
    borderRadius: radii.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.progressBar,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radii.progressBar,
  },
});