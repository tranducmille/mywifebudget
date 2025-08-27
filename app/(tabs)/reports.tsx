import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { TrendingUp, TrendingDown, Download, Share as ShareIcon, Calendar, Target, DollarSign, CreditCard, Zap, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

interface ReportData {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  topCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  monthlyTrend: {
    labels: string[];
    datasets: Array<{
      data: number[];
      color: (opacity?: number) => string;
    }>;
  };
}

export default function Reports() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [selectedPeriod, setSelectedPeriod] = useState('3M');
  const periods = ['1M', '3M', '6M', '1Y', 'ALL'];

  // Sample data - would come from actual app state
  const reportData: ReportData = {
    period: selectedPeriod,
    totalIncome: 19500,
    totalExpenses: 13750,
    netSavings: 5750,
    topCategories: [
      { name: 'Food & Dining', amount: 4200, percentage: 30.5, color: '#FF6B6B' },
      { name: 'Bills & Utilities', amount: 3600, percentage: 26.2, color: '#4ECDC4' },
      { name: 'Transportation', amount: 2100, percentage: 15.3, color: '#45B7D1' },
      { name: 'Entertainment', amount: 1850, percentage: 13.4, color: '#96CEB4' },
      { name: 'Shopping', amount: 1200, percentage: 8.7, color: '#FFEAA7' },
      { name: 'Healthcare', amount: 800, percentage: 5.8, color: '#A8E6CF' },
    ],
    monthlyTrend: {
      labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      datasets: [{
        data: [4200, 3800, 4600, 4100, 4400, 4750],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      }],
    },
  };

  const savingsRate = (reportData.netSavings / reportData.totalIncome) * 100;
  const expenseRatio = (reportData.totalExpenses / reportData.totalIncome) * 100;

  const handleExportData = async () => {
    try {
      const csvData = generateCSVReport();
      await Share.share({
        message: csvData,
        title: `HomeBudget Pro Report - ${selectedPeriod}`,
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const generateCSVReport = () => {
    return `HomeBudget Pro Financial Report - ${selectedPeriod}
    
Period: ${selectedPeriod}
Total Income: $${reportData.totalIncome.toLocaleString()}
Total Expenses: $${reportData.totalExpenses.toLocaleString()}
Net Savings: $${reportData.netSavings.toLocaleString()}
Savings Rate: ${savingsRate.toFixed(1)}%

Top Spending Categories:
${reportData.topCategories.map(cat => 
  `${cat.name}: $${cat.amount.toLocaleString()} (${cat.percentage}%)`
).join('\n')}`;
  };

  const PeriodSelector = ({ period }: { period: string }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive,
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.periodButtonTextActive,
        ]}
      >
        {period}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon size={24} color={color} />
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
        {trend && (
          <View style={styles.trendBadge}>
            <Text style={[styles.trendText, { color }]}>{trend}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const InsightCard = ({ title, description, type, action }: any) => {
    const getInsightIcon = () => {
      switch (type) {
        case 'warning':
          return <AlertCircle size={24} color="#FF9500" />;
        case 'success':
          return <CheckCircle size={24} color="#34C759" />;
        case 'tip':
          return <Zap size={24} color="#007AFF" />;
        default:
          return <TrendingUp size={24} color="#8E8E93" />;
      }
    };

    return (
      <TouchableOpacity style={styles.insightCard} onPress={action}>
        <View style={styles.insightHeader}>
          {getInsightIcon()}
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>{title}</Text>
            <Text style={styles.insightDescription}>{description}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Financial Reports</Text>
          <Text style={styles.subtitle}>Analyze your spending patterns</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <ShareIcon size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Period Selection */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <PeriodSelector key={period} period={period} />
          ))}
        </View>

        {/* Financial Overview */}
        <View style={styles.overviewCard}>
          <LinearGradient
            colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#007AFF', '#5AC8FA']}
            style={styles.overviewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.overviewTitle}>Financial Summary</Text>
            <Text style={styles.overviewPeriod}>{selectedPeriod} Overview</Text>
            
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>
                  ${reportData.totalIncome.toLocaleString()}
                </Text>
                <Text style={styles.overviewStatLabel}>Total Income</Text>
              </View>
              
              <View style={styles.overviewDivider} />
              
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatValue}>
                  ${reportData.totalExpenses.toLocaleString()}
                </Text>
                <Text style={styles.overviewStatLabel}>Total Expenses</Text>
              </View>
              
              <View style={styles.overviewDivider} />
              
              <View style={styles.overviewStat}>
                <Text style={[
                  styles.overviewStatValue,
                  { color: reportData.netSavings >= 0 ? '#30D158' : '#FF453A' }
                ]}>
                  ${reportData.netSavings.toLocaleString()}
                </Text>
                <Text style={styles.overviewStatLabel}>Net Savings</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <StatCard
              title="Savings Rate"
              value={`${savingsRate.toFixed(1)}%`}
              subtitle="of total income"
              icon={Target}
              trend={savingsRate >= 20 ? '+5.2%' : '-2.1%'}
              color={savingsRate >= 20 ? '#34C759' : '#FF9500'}
            />
            
            <StatCard
              title="Expense Ratio"
              value={`${expenseRatio.toFixed(1)}%`}
              subtitle="of total income"
              icon={CreditCard}
              trend={expenseRatio <= 80 ? '-3.5%' : '+8.2%'}
              color={expenseRatio <= 80 ? '#34C759' : '#FF3B30'}
            />
          </View>
        </View>

        {/* Spending Categories Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={reportData.topCategories.map(cat => ({
                name: cat.name,
                population: cat.amount,
                color: cat.color,
                legendFontColor: isDark ? '#FFF' : '#333',
                legendFontSize: 12,
              }))}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          
          {/* Category Breakdown */}
          <View style={styles.categoryBreakdown}>
            {reportData.topCategories.slice(0, 4).map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
                <View style={styles.categoryRight}>
                  <Text style={styles.categoryAmount}>
                    ${category.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    {category.percentage}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Trends</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={reportData.monthlyTrend}
              width={screenWidth - 40}
              height={220}
              yAxisLabel="$"
              chartConfig={{
                backgroundColor: isDark ? '#1C1C1E' : '#FFF',
                backgroundGradientFrom: isDark ? '#1C1C1E' : '#FFF',
                backgroundGradientTo: isDark ? '#2C2C2E' : '#F2F2F7',
                decimalPlaces: 0,
                color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#007AFF"
                }
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* AI Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Insights</Text>
          <View style={styles.insightsContainer}>
            <InsightCard
              type="warning"
              title="High Dining Spending"
              description="You've spent 23% more on food this month. Consider meal planning to save $200-300."
            />
            
            <InsightCard
              type="success"
              title="Great Progress!"
              description="Your savings rate of 29.5% is above the recommended 20%. Keep it up!"
            />
            
            <InsightCard
              type="tip"
              title="Budget Opportunity"
              description="You have $450 left in your entertainment budget. Perfect time for that weekend trip!"
            />
          </View>
        </View>

        {/* Goals Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals Progress</Text>
          <View style={styles.goalsContainer}>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Emergency Fund</Text>
                <Text style={styles.goalAmount}>$6,750 / $10,000</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressBg}>
                  <View style={[styles.goalProgressFill, { width: '67.5%' }]} />
                </View>
                <Text style={styles.goalProgressText}>67.5% Complete</Text>
              </View>
            </View>
            
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>Vacation Fund</Text>
                <Text style={styles.goalAmount}>$2,400 / $5,000</Text>
              </View>
              <View style={styles.goalProgress}>
                <View style={styles.goalProgressBg}>
                  <View style={[styles.goalProgressFill, { width: '48%' }]} />
                </View>
                <Text style={styles.goalProgressText}>48% Complete</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  periodButtonTextActive: {
    color: '#FFF',
  },
  overviewCard: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  overviewGradient: {
    padding: 24,
  },
  overviewTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewPeriod: {
    color: '#FFF',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 24,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  overviewStatValue: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  overviewStatLabel: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
  overviewDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 16,
  },
  metricsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statContent: {
    flex: 1,
    marginLeft: 16,
  },
  statTitle: {
    fontSize: 16,
    color: isDark ? '#8E8E93' : '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  trendBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  categoryBreakdown: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#FFF' : '#000',
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightContent: {
    flex: 1,
    marginLeft: 16,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
    lineHeight: 20,
  },
  goalsContainer: {
    gap: 16,
  },
  goalCard: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
  },
  goalAmount: {
    fontSize: 16,
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
  },
  goalProgress: {
    alignItems: 'center',
  },
  goalProgressBg: {
    width: '100%',
    height: 8,
    backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
  },
  goalProgressFill: {
    height: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  goalProgressText: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
  },
});