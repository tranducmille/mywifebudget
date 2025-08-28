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
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  Wallet,
  Target,
  Calendar,
  Bell
} from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function Dashboard() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Sample data - would come from state management/database
  const monthlyBalance = 4250;
  const monthlyIncome = 6500;
  const monthlyExpenses = 2250;
  const savingsGoal = 10000;
  const currentSavings = 6750;

  const expenseCategories = [
    { name: 'Food', population: 35, color: '#FF6B6B', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Transport', population: 20, color: '#4ECDC4', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Bills', population: 25, color: '#45B7D1', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Entertainment', population: 15, color: '#96CEB4', legendFontColor: isDark ? '#FFF' : '#333' },
    { name: 'Other', population: 5, color: '#FFEAA7', legendFontColor: isDark ? '#FFF' : '#333' },
  ];

  const monthlyTrend = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [2200, 1800, 2100, 2400, 1900, 2250],
      color: (opacity = 1) => `rgba(70, 183, 209, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const styles = createStyles(isDark);

  const StatCard = ({ title, amount, icon: Icon, trend, trendUp, gradient }: any) => (
    <TouchableOpacity style={styles.statCard}>
      <LinearGradient
        colors={gradient}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.statHeader}>
          <Icon size={24} color="#FFF" />
          <Text style={styles.statTitle}>{title}</Text>
        </View>
        <Text style={styles.statAmount}>${amount.toLocaleString()}</Text>
        {trend && (
          <View style={[styles.trendContainer, { backgroundColor: trendUp ? 'rgba(52, 199, 89, 0.2)' : 'rgba(255, 59, 48, 0.2)' }]}>
            {trendUp ? <TrendingUp size={14} color="#34C759" /> : <TrendingDown size={14} color="#FF3B30" />}
            <Text style={[styles.trendText, { color: trendUp ? '#34C759' : '#FF3B30' }]}>
              {trend}
            </Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const FloatingAction = ({ icon: Icon, onPress, color, style }: any) => (
    <TouchableOpacity style={[styles.floatingAction, { backgroundColor: color }, style]} onPress={onPress}>
      <Icon size={24} color="#FFF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.subtitle}>Here's your financial overview</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={isDark ? '#FFF' : '#333'} />
          </TouchableOpacity>
        </View>

        {/* Balance Overview */}
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#007AFF', '#5AC8FA']}
            style={styles.balanceGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>${monthlyBalance.toLocaleString()}</Text>
            <View style={styles.balanceDetails}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Income</Text>
                <Text style={[styles.balanceItemAmount, styles.incomeColor]}>
                  +${monthlyIncome.toLocaleString()}
                </Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemLabel}>Expenses</Text>
                <Text style={[styles.balanceItemAmount, styles.expenseColor]}>
                  -${monthlyExpenses.toLocaleString()}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Monthly Income"
            amount={monthlyIncome}
            icon={TrendingUp}
            trend="+12%"
            trendUp={true}
            gradient={['#34C759', '#30D158']}
          />
          <StatCard
            title="Monthly Expenses"
            amount={monthlyExpenses}
            icon={TrendingDown}
            trend="-5%"
            trendUp={true}
            gradient={['#FF9500', '#FFCC02']}
          />
        </View>


        {/* Expense Categories Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expense Categories</Text>
          <View style={styles.chartContainer}>
            <PieChart
              data={expenseCategories}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>

        {/* Monthly Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Expense Trend</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={monthlyTrend}
              width={screenWidth - 40}
              height={200}
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

        {/* Savings Goal Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Goal Progress</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Emergency Fund</Text>
              <Text style={styles.goalAmount}>
                ${currentSavings.toLocaleString()} / ${savingsGoal.toLocaleString()}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(currentSavings / savingsGoal) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((currentSavings / savingsGoal) * 100)}% Complete
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom padding for floating actions */}
        <View style={{ height: 100 }} />
      </ScrollView>
      </SafeAreaView>

      {/* Floating Quick Actions */}
      <View style={styles.floatingActionsContainer}>
        <FloatingAction
          icon={CreditCard}
          color="#FF3B30"
          style={styles.floatingAction1}
          onPress={() => {}}
        />
        <FloatingAction
          icon={Wallet}
          color="#34C759"
          style={styles.floatingAction2}
          onPress={() => {}}
        />
        <FloatingAction
          icon={Target}
          color="#007AFF"
          style={styles.floatingAction3}
          onPress={() => {}}
        />
        <FloatingAction
          icon={Calendar}
          color="#FF9500"
          style={styles.floatingAction4}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#F2F2F7',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#8E8E93' : '#8E8E93',
    letterSpacing: -0.2,
  },
  notificationButton: {
    padding: 14,
    borderRadius: 28,
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceCard: {
    marginBottom: 30,
    borderRadius: 24,
    height: 180,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceGradient: {
    padding: 28,
    flex: 1,
    justifyContent: 'center',
  },
  balanceLabel: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    opacity: 0.9,
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    letterSpacing: -1,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    flex: 1,
  },
  balanceItemLabel: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    opacity: 0.8,
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  balanceItemAmount: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    letterSpacing: -0.3,
  },
  incomeColor: {
    color: '#30D158',
  },
  expenseColor: {
    color: '#FF453A',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    height: 140,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statGradient: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-between',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTitle: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
    opacity: 0.9,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statAmount: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  floatingActionsContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -120 }],
    zIndex: 1000,
  },
  floatingAction: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingAction1: {
    transform: [{ scale: 1 }],
  },
  floatingAction2: {
    transform: [{ scale: 0.9 }],
  },
  floatingAction3: {
    transform: [{ scale: 0.85 }],
  },
  floatingAction4: {
    transform: [{ scale: 0.8 }],
  },
  chartContainer: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 20,
  },
  goalCard: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 20,
    padding: 24,
    height: 120,
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
    fontSize: 19,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: isDark ? '#FFF' : '#000',
    letterSpacing: -0.2,
  },
  goalAmount: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});