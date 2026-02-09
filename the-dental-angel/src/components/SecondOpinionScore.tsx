import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/theme';

interface SecondOpinionScoreProps {
  score: number; // 0-100
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function SecondOpinionScore({
  score,
  size = 'medium',
  showLabel = true,
}: SecondOpinionScoreProps) {
  // Size configurations (labelSize min 12px for accessibility)
  const sizes = {
    small: { diameter: 60, strokeWidth: 4, fontSize: 18, labelSize: 12 },
    medium: { diameter: 100, strokeWidth: 6, fontSize: 28, labelSize: 14 },
    large: { diameter: 140, strokeWidth: 8, fontSize: 36, labelSize: 14 },
  };

  const config = sizes[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Color based on score
  const getScoreColor = () => {
    if (score >= 80) return COLORS.success;
    if (score >= 60) return COLORS.primary500;
    if (score >= 40) return COLORS.warning;
    return COLORS.neutral400;
  };

  // Plain-English label based on score
  const getScoreLabel = () => {
    if (score >= 80) return 'Very Common';
    if (score >= 60) return 'Common';
    if (score >= 40) return 'Depends on\nYour Situation';
    return 'Worth a\nSecond Look';
  };

  // Message based on score
  const getScoreMessage = () => {
    if (score >= 80) return 'Most dentists would recommend this';
    if (score >= 60) return 'Many dentists would recommend this';
    if (score >= 40) return 'Worth discussing options with your dentist';
    return 'Consider getting another opinion';
  };

  const scoreColor = getScoreColor();

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.title}>Second Opinion Score</Text>}

      <View style={[styles.circleContainer, { width: config.diameter, height: config.diameter }]}>
        <Svg width={config.diameter} height={config.diameter}>
          {/* Background circle */}
          <Circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke="#E7E5E4"
            strokeWidth={config.strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={config.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${config.diameter / 2} ${config.diameter / 2})`}
          />
        </Svg>

        {/* Label in center */}
        <View style={styles.scoreTextContainer}>
          <Text
            style={[styles.scoreLabel, { fontSize: size === 'small' ? 10 : 13, color: scoreColor }]}
          >
            {getScoreLabel()}
          </Text>
        </View>
      </View>

      {showLabel && <Text style={styles.message}>{getScoreMessage()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 12,
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreLabel: {
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    lineHeight: 14,
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SecondOpinionScore;
