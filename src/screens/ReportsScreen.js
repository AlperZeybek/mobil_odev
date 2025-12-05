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
import { colors } from '../styles/colors';
import { layout } from '../styles/layout';

const screenWidth = Dimensions.get('window').width;

/**
 * Reports screen with statistics and charts
 */
export const ReportsScreen = () => {
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
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
    style: {
      borderRadius: layout.borderRadius,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: layout.paddingLarge,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: layout.marginLarge,
    marginBottom: layout.margin,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadius,
    padding: layout.padding,
    marginBottom: layout.marginLarge,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chart: {
    borderRadius: layout.borderRadius,
  },
  emptyState: {
    padding: layout.paddingLarge * 2,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

