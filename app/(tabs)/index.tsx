import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Wallet,
  Target,
  Calendar,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Sample data
  const monthlyBalance = 4250;
  const monthlyIncome = 6500;
  const monthlyExpenses = 2250;
  const savingsGoal = 10000;
  const currentSavings = 6750;

  const expenseCategories = [
    { name: 'Food', population: 35, color: '#6366F1', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Transport', population: 20, color: '#8B5CF6', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Bills', population: 25, color: '#06B6D4', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Entertainment', population: 15, color: '#10B981', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Other', population: 5, color: '#F59E0B', legendFontColor: isDark ? '#FFF' : '#333' },
  ];

  const monthlyTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [2200, 1800, 2100, 2400, 1900, 2250],
      color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const styles = createStyles(isDark);

  const MetricCard = ({ title, amount, change, changeType, icon: Icon, iconBg }: any) => (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={[styles.metricIcon, { backgroundColor: iconBg }]}>
          <Icon size={20} color="#FFF" />
        </View>
        <View style={styles.metricChange}>
          {changeType === 'up' ? (
            <ArrowUpRight size={16} color="#10B981" />
          ) : (
            <ArrowDownRight size={16} color="#EF4444" />
          )}
          <Text style={[styles.changeText, { color: changeType === 'up' ? '#10B981' : '#EF4444' }]}>
            {change}
          </Text>
        </View>
      </View>
      <Text style={styles.metricAmount}>${amount.toLocaleString()}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
  );

  const QuickActionCard = ({ title, subtitle, icon: Icon, color, onPress }: any) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Icon size={24} color="#FFF" />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
      <ArrowUpRight size={18} color={isDark ? '#8E8E93' : '#8E8E93'} />
    </TouchableOpacity>
  );

  const CategoryItem = ({ name, amount, percentage, color }: any) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryLeft}>
        <View style={[styles.categoryDot, { backgroundColor: color }]} />
        <Text style={styles.categoryName}>{name}</Text>
      </View>
      <View style={styles.categoryRight}>
        <Text style={styles.categoryAmount}>${amount}</Text>
        <Text style={styles.categoryPercentage}>{percentage}%</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Dashboard</Text>
              <Text style={styles.subtitle}>Financial Overview</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton}>
                <Eye size={20} color={isDark ? '#FFF' : '#1F2937'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Bell size={20} color={isDark ? '#FFF' : '#1F2937'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Settings size={20} color={isDark ? '#FFF' : '#1F2937'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Balance Overview */}
          <View style={styles.balanceSection}>
            <View style={styles.balanceCard}>
              <LinearGradient
                colors={isDark ? ['#1F2937', '#374151'] : ['#FFFFFF', '#F9FAFB']}
                style={styles.balanceGradient}
              >
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>Total Balance</Text>
                  <TouchableOpacity style={styles.balanceToggle}>
                    <Eye size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.balanceAmount}>${monthlyBalance.toLocaleString()}</Text>
                <View style={styles.balanceSubInfo}>
                  <View style={styles.balanceItem}>
                    <View style={styles.balanceIndicator}>
                      <View style={[styles.balanceIndicatorDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.balanceIndicatorText}>Income</Text>
                    </View>
                    <Text style={styles.balanceIndicatorAmount}>+${monthlyIncome.toLocaleString()}</Text>
                  </View>
                  <View style={styles.balanceItem}>
                    <View style={styles.balanceIndicator}>
                      <View style={[styles.balanceIndicatorDot, { backgroundColor: '#EF4444' }]} />
                      <Text style={styles.balanceIndicatorText}>Expenses</Text>
                    </View>
                    <Text style={styles.balanceIndicatorAmount}>-${monthlyExpenses.toLocaleString()}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsGrid}>
              <MetricCard
                title="Monthly Income"
                amount={monthlyIncome}
                change="+12.5%"
                changeType="up"
                icon={TrendingUp}
                iconBg="#10B981"
              />
              <MetricCard
                title="Monthly Expenses"
                amount={monthlyExpenses}
                change="-8.2%"
                changeType="up"
                icon={TrendingDown}
                iconBg="#6366F1"
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <QuickActionCard
                title="Add Expense"
                subtitle="Record new transaction"
                icon={CreditCard}
                color="#EF4444"
                onPress={() => {}}
              />
              <QuickActionCard
                title="Add Income"
                subtitle="Log income source"
                icon={Wallet}
                color="#10B981"
                onPress={() => {}}
              />
              <QuickActionCard
                title="Set Budget"
                subtitle="Create spending limit"
                icon={Target}
                color="#6366F1"
                onPress={() => {}}
              />
              <QuickActionCard
                title="View Reports"
                subtitle="Analyze spending"
                icon={Calendar}
                color="#F59E0B"
                onPress={() => {}}
              />
            </View>
          </View>

          {/* Spending Breakdown */}
          <View style={styles.spendingSection}>
            <View style={styles.spendingHeader}>
              <Text style={styles.sectionTitle}>Spending Breakdown</Text>
              <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>View All</Text>
                <ArrowUpRight size={16} color="#6366F1" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.spendingCard}>
              <View style={styles.chartSection}>
                <PieChart
                  data={expenseCategories}
                  width={screenWidth - 80}
                  height={180}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute
                />
              </View>
              
              <View style={styles.categoriesSection}>
                {expenseCategories.slice(0, 3).map((category, index) => (
                  <CategoryItem
                    key={index}
                    name={category.name}
                    amount={(category.population * 64).toFixed(0)}
                    percentage={category.population}
                    color={category.color}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Monthly Trend */}
          <View style={styles.trendSection}>
            <Text style={styles.sectionTitle}>Expense Trend</Text>
            <View style={styles.trendCard}>
              <LineChart
                data={monthlyTrend}
                width={screenWidth - 80}
                height={160}
                yAxisLabel="$"
                chartConfig={{
                  backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                  backgroundGradientFrom: isDark ? '#1F2937' : '#FFFFFF',
                  backgroundGradientTo: isDark ? '#374151' : '#F9FAFB',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                  labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(31, 41, 55, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#6366F1"
                  }
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>

          {/* Savings Goal */}
          <View style={styles.savingsSection}>
            <Text style={styles.sectionTitle}>Savings Goal</Text>
            <View style={styles.savingsCard}>
              <View style={styles.savingsHeader}>
                <View>
                  <Text style={styles.savingsTitle}>Emergency Fund</Text>
                  <Text style={styles.savingsSubtitle}>Target: ${savingsGoal.toLocaleString()}</Text>
                </View>
                <View style={styles.savingsAmount}>
                  <Text style={styles.savingsCurrentAmount}>${currentSavings.toLocaleString()}</Text>
                  <Text style={styles.savingsPercentage}>
                    {Math.round((currentSavings / savingsGoal) * 100)}%
                  </Text>
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6']}
                    style={[styles.progressFill, { width: `${(currentSavings / savingsGoal) * 100}%` }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
                <Text style={styles.progressLabel}>
                  ${(savingsGoal - currentSavings).toLocaleString()} remaining
                </Text>
              </View>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Floating Quick Actions */}
        <View style={styles.floatingContainer}>
          <TouchableOpacity style={[styles.floatingButton, styles.primaryAction]}>
            <Plus size={28} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.floatingButton, styles.secondaryAction, { backgroundColor: '#10B981' }]}>
            <Wallet size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.floatingButton, styles.secondaryAction, { backgroundColor: '#EF4444' }]}>
            <CreditCard size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.floatingButton, styles.secondaryAction, { backgroundColor: '#F59E0B' }]}>
            <Target size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: isDark ? 0 : 1,
    borderColor: isDark ? 'transparent' : '#E2E8F0',
  },
  balanceSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  balanceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.4 : 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#334155' : 'transparent',
  },
  balanceGradient: {
    padding: 32,
    minHeight: 200,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balanceToggle: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)',
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '800',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 24,
    letterSpacing: -1.5,
  },
  balanceSubInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  balanceIndicatorText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  balanceIndicatorAmount: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    letterSpacing: -0.3,
  },
  metricsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    minHeight: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#334155' : 'transparent',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.2,
  },
  metricAmount: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: -0.1,
  },
  quickActionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.06,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#334155' : 'transparent',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  quickActionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: -0.1,
  },
  spendingSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
    letterSpacing: -0.1,
  },
  spendingCard: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#334155' : 'transparent',
  },
  chartSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  categoriesSection: {
    gap: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: 'Inter-Medium',
    color: isDark ? '#F8FAFC' : '#0F172A',
    letterSpacing: -0.2,
  },
  categoryRight: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  categoryPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: 0.1,
  },
  trendSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  trendCard: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#334155' : 'transparent',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  savingsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  savingsCard: {
    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: isDark ? 1 : 0,
    borderColor: isDark ? '#334155' : 'transparent',
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  savingsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: isDark ? '#94A3B8' : '#64748B',
    letterSpacing: -0.1,
  },
  savingsAmount: {
    alignItems: 'flex-end',
  },
  savingsCurrentAmount: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#F8FAFC' : '#0F172A',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  savingsPercentage: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
    letterSpacing: 0.1,
  },
  progressContainer: {
    gap: 12,
  },
  progressTrack: {
    height: 8,
    backgroundColor: isDark ? '#334155' : '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#94A3B8' : '#64748B',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  floatingContainer: {
    position: 'absolute',
    right: 24,
    bottom: 120,
    alignItems: 'center',
    gap: 16,
  },
  floatingButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  primaryAction: {
    width: 64,
    height: 64,
    backgroundColor: '#6366F1',
  },
  secondaryAction: {
    width: 52,
    height: 52,
  },
});