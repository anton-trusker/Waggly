import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { WeightRecord } from '@/types/passport';
import { designSystem } from '@/constants/designSystem';
import { format } from 'date-fns';

interface WeightHistoryChartProps {
    data: WeightRecord[];
    unit?: string;
    height?: number;
    width?: number;
}

export default function WeightHistoryChart({
    data,
    unit = 'kg',
    height = 220,
    width = Dimensions.get('window').width - 40
}: WeightHistoryChartProps) {
    // Process data: sort by date ascending
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

    if (sortedData.length < 2) {
        return (
            <View style={[styles.container, { height }]}>
                <Text style={styles.emptyText}>Not enough data for chart</Text>
            </View>
        );
    }

    // Example Chart Config
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate Domain
    const weights = sortedData.map(d => d.weight);
    const minWeight = Math.min(...weights) * 0.95; // 5% buffer
    const maxWeight = Math.max(...weights) * 1.05;

    // Scales
    const xScale = (index: number) => (index / (sortedData.length - 1)) * chartWidth + padding;
    const yScale = (weight: number) =>
        chartHeight - ((weight - minWeight) / (maxWeight - minWeight)) * chartHeight + padding;

    // Generate Path
    const pathD = sortedData.map((d, i) =>
        `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.weight)}`
    ).join(' ');

    return (
        <View style={styles.container}>
            <Svg width={width} height={height}>
                {/* Grid Lines (Horizontal) */}
                {[0, 0.5, 1].map((t) => {
                    const y = chartHeight * t + padding; // simplistic grid
                    return (
                        <Line
                            key={t}
                            x1={padding}
                            y1={y}
                            x2={width - padding}
                            y2={y}
                            stroke={designSystem.colors.neutral[200] as any}
                            strokeDasharray="4 4"
                        />
                    );
                })}

                {/* Line */}
                <Path
                    d={pathD}
                    fill="none"
                    stroke={designSystem.colors.primary[500] as any}
                    strokeWidth="3"
                />

                {/* Data Points */}
                {sortedData.map((d, i) => (
                    <Circle
                        key={d.id}
                        cx={xScale(i)}
                        cy={yScale(d.weight)}
                        r="4"
                        fill="white"
                        stroke={designSystem.colors.primary[500] as any}
                        strokeWidth="2"
                    />
                ))}

                {/* Y Axis Labels (Min, Max) */}
                <SvgText
                    x={padding - 10}
                    y={yScale(minWeight)}
                    fill={designSystem.colors.text.secondary}
                    fontSize="10"
                    textAnchor="end"
                >
                    {minWeight.toFixed(1)}
                </SvgText>
                <SvgText
                    x={padding - 10}
                    y={yScale(maxWeight)}
                    fill={designSystem.colors.text.secondary}
                    fontSize="10"
                    textAnchor="end"
                >
                    {maxWeight.toFixed(1)}
                </SvgText>

                {/* X Axis Labels (Start, End Dates) */}
                <SvgText
                    x={xScale(0)}
                    y={height - 10}
                    fill={designSystem.colors.text.secondary}
                    fontSize="10"
                    textAnchor="middle"
                >
                    {format(new Date(sortedData[0].date), 'MMM d')}
                </SvgText>
                <SvgText
                    x={xScale(sortedData.length - 1)}
                    y={height - 10}
                    fill={designSystem.colors.text.secondary}
                    fontSize="10"
                    textAnchor="middle"
                >
                    {format(new Date(sortedData[sortedData.length - 1].date), 'MMM d')}
                </SvgText>
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        paddingVertical: 10,
    },
    emptyText: {
        color: designSystem.colors.text.secondary,
        fontStyle: 'italic',
    },
});
