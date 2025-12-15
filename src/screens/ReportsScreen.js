import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { StatCard } from '../components/StatCard';
import {
  getAllSessions,
  getSessionsFromLast7Days,
  getSummaryStats,
} from '../data/database';
import { getLastNDays } from '../utils/dateUtils';
import { prepareBarChartData, preparePieChartData } from '../utils/chartUtils';
import { useTheme } from '../context/ThemeContext';
import { layout } from '../styles/layout';

const screenWidth = Dimensions.get('window').width;

/**
 * Reports screen with statistics and charts
 */
export const ReportsScreen = () => {
  const { colors, mode } = useTheme();
  const styles = createStyles(colors);
  const [stats, setStats] = useState({
    todayTotal: 0,
    allTimeTotal: 0,
    totalDistractions: 0,
  });
  const [last7DaysSessions, setLast7DaysSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [summaryStats, sessions7Days, allSessionsData] = await Promise.all([
        getSummaryStats(),
        getSessionsFromLast7Days(),
        getAllSessions(),
      ]);

      setStats(summaryStats);
      setLast7DaysSessions(sessions7Days);
      setAllSessions(allSessionsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const last7Days = getLastNDays(7);
  const barChartData = prepareBarChartData(last7DaysSessions, last7Days);
  const pieChartData = preparePieChartData(allSessions);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) =>
      mode === 'dark'
        ? `rgba(129, 135, 255, ${opacity})`
        : `rgba(91, 103, 234, ${opacity})`,
    labelColor: (opacity = 1) =>
      mode === 'dark'
        ? `rgba(229, 231, 235, ${opacity})`
        : `rgba(26, 32, 44, ${opacity})`,
    style: {
      borderRadius: layout.borderRadius,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 0.1,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.sectionTitle}>Statistics</Text>
      
      <StatCard
        title="Today's Focus Time"
        value={stats.todayTotal}
        unit="minutes"
        color={colors.primary}
      />
      
      <StatCard
        title="All Time Focus"
        value={stats.allTimeTotal}
        unit="minutes"
        color={colors.secondary}
      />
      
      <StatCard
        title="Total Distractions"
        value={stats.totalDistractions}
        unit="count"
        color={stats.totalDistractions > 0 ? colors.warning : colors.success}
      />

      {last7DaysSessions.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Last 7 Days</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={barChartData}
              width={screenWidth - layout.paddingLarge * 2}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={true}
              fromZero={true}
              style={styles.chart}
            />
          </View>
        </>
      )}

      {pieChartData.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Category Distribution</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={pieChartData}
              width={screenWidth - layout.paddingLarge * 2}
              height={220}
              chartConfig={chartConfig}
              accessor="duration"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </View>
        </>
      )}

      {allSessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No sessions yet. Start focusing to see your statistics!
          </Text>
        </View>
      )}

      {allSessions.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Session History</Text>
          {allSessions.map((session) => {
            const start = new Date(session.start_time);
            const end = session.end_time ? new Date(session.end_time) : null;
            const dateLabel = start.toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            const timeLabel = start.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View key={session.id?.toString() ?? `${session.start_time}-${session.category}`} style={styles.historyItem}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyCategory}>{session.category || 'Unknown'}</Text>
                  <Text style={styles.historyDuration}>
                    {session.duration_minutes ?? 0} min
                  </Text>
                </View>
                <View style={styles.historyRow}>
                  <Text style={styles.historyMeta}>
                    {dateLabel} • {timeLabel}
                  </Text>
                  <Text style={styles.historyMeta}>
                    Distractions: {session.distraction_count ?? 0}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    contentContainer: {
      padding: layout.paddingLarge,
      paddingBottom: layout.paddingXL,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginTop: layout.marginXL,
      marginBottom: layout.marginMD,
      letterSpacing: -0.3,
    },
    chartContainer: {
      backgroundColor: colors.surface,
      borderRadius: layout.borderRadiusMD,
      padding: layout.paddingMD,
      marginBottom: layout.marginLarge,
      alignItems: 'center',
      ...layout.shadowMedium,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    chart: {
      borderRadius: layout.borderRadius,
    },
    emptyState: {
      padding: layout.paddingXL * 2,
      alignItems: 'center',
      marginTop: layout.marginXL,
    },
    emptyStateText: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '500',
    },
    historySection: {
      marginTop: layout.marginXL,
      paddingTop: layout.padding,
      borderTopWidth: 1,
      borderTopColor: colors.borderLight,
    },
    historyItem: {
      backgroundColor: colors.surface,
      borderRadius: layout.borderRadius,
      padding: layout.padding,
      marginBottom: layout.marginXS,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    historyRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    historyCategory: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    historyDuration: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    historyMeta: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
