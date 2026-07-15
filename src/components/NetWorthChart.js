import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme';
import { formatAxis } from '../format';

export default function NetWorthChart({ propertyData, investData, horizon, label1 = "Property", label2 = "Invest" }) {
  const WIDTH = 300;
  const HEIGHT = 160;
  const PADDING_LEFT = 48;
  const PADDING_BOTTOM = 28;
  const PADDING_TOP = 8;
  const PADDING_RIGHT = 8;

  const chartW = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartH = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const allValues = [...propertyData, ...investData].map(d => d.value);
  const rawMax = Math.max(...allValues);
  const rawMin = Math.min(...allValues);
  const yMin = rawMin < 0 ? rawMin * 1.1 : 0;
  const yMax = rawMax * 1.15;
  const yRange = yMax - yMin || 1;

  function xPct(i) {
    return (i / Math.max(horizon - 1, 1)) * chartW;
  }

  function yPct(val) {
    return chartH - ((val - yMin) / yRange) * chartH;
  }

  function formatY(val) {
    return formatAxis(val);
  }

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) =>
    yMin + (yRange / (yTicks - 1)) * i
  );

  function renderLine(data, color, dashed = false) {
    const segments = [];
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = PADDING_LEFT + xPct(i);
      const y1 = PADDING_TOP + yPct(data[i].value);
      const x2 = PADDING_LEFT + xPct(i + 1);
      const y2 = PADDING_TOP + yPct(data[i + 1].value);
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      if (dashed && i % 2 === 1) continue;

      segments.push(
        <View
          key={i}
          style={{
            position: 'absolute',
            left: x1,
            top: y1,
            width: length,
            height: 2,
            backgroundColor: color,
            transform: [{ rotate: `${angle}deg` }],
            transformOrigin: '0 50%',
          }}
        />
      );
    }
    return segments;
  }

  return (
    <View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.green }]} />
          <Text style={styles.legendText}>{label1}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.blue }]} />
          <Text style={styles.legendText}>{label2}</Text>
        </View>
      </View>

      <View style={{ width: WIDTH, height: HEIGHT }}>
        {yTickValues.map((val, i) => (
          <View key={i} style={{
            position: 'absolute',
            left: PADDING_LEFT,
            top: PADDING_TOP + yPct(val),
            right: PADDING_RIGHT,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{ position: 'absolute', left: -PADDING_LEFT, width: PADDING_LEFT - 4 }}>
              <Text style={styles.axisLabel}>{formatY(val)}</Text>
            </View>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>
        ))}

        {renderLine(propertyData, COLORS.green)}
        {renderLine(investData, COLORS.blue)}

        <View style={{
          position: 'absolute',
          bottom: 0,
          left: PADDING_LEFT,
          right: PADDING_RIGHT,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          {[1, Math.floor(horizon / 2), horizon].map(yr => (
            <Text key={yr} style={styles.axisLabel}>{yr}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legendRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: COLORS.textMuted },
  axisLabel: { fontSize: 9, color: COLORS.textMuted, textAlign: 'right' },
});
