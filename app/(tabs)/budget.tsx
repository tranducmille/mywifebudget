import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Target, 
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  DollarSign
} from 'lucide-react-native';

interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  color: string;
}

export default function Budget() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: '1', category: 'Food', allocated: 800, spent: 650, color: '#FF6B6B' },
    { id: '2', category: 'Transport', allocated: 300, spent: 240, color: '#4ECDC4' },
    { id: '3', category: 'Bills', allocated: 1200, spent: 1100, color: '#45B7D1' },
    { id: '4', category: 'Entertainment', allocated: 200, spent: 180, color: '#96CEB4' },
    { id: '5', category: 'Shopping', allocated: 400, spent: 450, color: '#FFEAA7' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    allocated: '',
  });

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;

  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Healthcare', 'Other'];
  const categoryColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#A8E6CF', '#FFB6C1'];

  const addBudget = () => {
    if (!newBudget.category || !newBudget.allocated) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const existingBudget = budgets.find(b => b.category === newBudget.category);
    if (existingBudget) {
      Alert.alert('Error', 'Budget for this category already exists');
      return;
    }

    const colorIndex = budgets.length % categoryColors.length;
    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      allocated: parseFloat(newBudget.allocated),
      spent: 0,
      color: categoryColors[colorIndex],
    };

    setBudgets([...budgets, budget]);
    setNewBudget({ category: '', allocated: '' });
    setShowAddModal(false);
  };

  const deleteBudget = (id: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setBudgets(budgets.filter(budget => budget.id !== id));
        }},
      ]
    );
  };

  const getProgressPercentage = (spent: number, allocated: number) => {
    return Math.min((spent / allocated) * 100, 100);
  };

  const getStatusIcon = (spent: number, allocated: number) => {
    const percentage = (spent / allocated) * 100;
    if (percentage >= 100) {
      return <AlertTriangle size={20} color="#FF3B30" />;
    } else if (percentage >= 80) {
      return <TrendingUp size={20} color="#FF9500" />;
    }
    return <CheckCircle size={20} color="#34C759" />;
  };

  const BudgetCard = ({ budget }: { budget: Budget }) => {
    const percentage = getProgressPercentage(budget.spent, budget.allocated);
    const isOverBudget = budget.spent > budget.allocated;
    const remaining = budget.allocated - budget.spent;

    return (
      <TouchableOpacity style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetHeaderLeft}>
            <View style={[styles.categoryIcon, { backgroundColor: budget.color }]}>
              <Text style={styles.categoryIconText}>
                {budget.category.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.budgetCategory}>{budget.category}</Text>
              <Text style={styles.budgetAmount}>
                ${budget.spent.toFixed(2)} of ${budget.allocated.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.budgetHeaderRight}>
            {getStatusIcon(budget.spent, budget.allocated)}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editButton}>
                <Edit3 size={16} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => deleteBudget(budget.id)}
              >
                <Trash2 size={16} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${percentage}%`,
                  backgroundColor: isOverBudget ? '#FF3B30' : budget.color,
                },
              ]}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={[styles.remainingAmount, { color: remaining >= 0 ? '#34C759' : '#FF3B30' }]}>
              {remaining >= 0 ? `$${remaining.toFixed(2)} left` : `$${Math.abs(remaining).toFixed(2)} over`}
            </Text>
            <Text style={styles.progressPercentage}>
              {percentage.toFixed(0)}%
            </Text>
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
          <Text style={styles.title}>Budget</Text>
          <Text style={styles.subtitle}>Manage your spending limits</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Overview Card */}
        <View style={styles.overviewCard}>
          <LinearGradient
            colors={isDark ? ['#1C1C1E', '#2C2C2E'] : ['#007AFF', '#5AC8FA']}
            style={styles.overviewGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.overviewTitle}>Monthly Budget Overview</Text>
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatLabel}>Total Allocated</Text>
                <Text style={styles.overviewStatAmount}>
                  ${totalAllocated.toLocaleString()}
                </Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatLabel}>Total Spent</Text>
                <Text style={styles.overviewStatAmount}>
                  ${totalSpent.toLocaleString()}
                </Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewStatLabel}>Remaining</Text>
                <Text style={[
                  styles.overviewStatAmount,
                  { color: remainingBudget >= 0 ? '#30D158' : '#FF453A' }
                ]}>
                  ${remainingBudget.toLocaleString()}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Budget Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Budget Categories</Text>
            <Text style={styles.sectionSubtitle}>{budgets.length} categories</Text>
          </View>

          {budgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}

          {budgets.length === 0 && (
            <View style={styles.emptyState}>
              <Target size={64} color={isDark ? '#8E8E93' : '#8E8E93'} />
              <Text style={styles.emptyStateTitle}>No budgets set</Text>
              <Text style={styles.emptyStateSubtitle}>
                Create your first budget to start tracking your spending
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowAddModal(true)}
              >
                <Text style={styles.emptyStateButtonText}>Create Budget</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Tips</Text>
          <View style={styles.tipsContainer}>
            <View style={styles.tipCard}>
              <CheckCircle size={24} color="#34C759" />
              <Text style={styles.tipText}>
                Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings
              </Text>
            </View>
            <View style={styles.tipCard}>
              <TrendingUp size={24} color="#007AFF" />
              <Text style={styles.tipText}>
                Review and adjust your budgets monthly based on your spending patterns
              </Text>
            </View>
            <View style={styles.tipCard}>
              <AlertTriangle size={24} color="#FF9500" />
              <Text style={styles.tipText}>
                Set up notifications when you reach 80% of your budget limit
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Budget Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Budget</Text>
            <TouchableOpacity onPress={addBudget}>
              <Text style={styles.modalSaveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryOptions}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newBudget.category === category && styles.categoryOptionActive,
                      ]}
                      onPress={() => setNewBudget({ ...newBudget, category })}
                    >
                      <View 
                        style={[
                          styles.categoryOptionIcon,
                          { backgroundColor: categoryColors[categories.indexOf(category) % categoryColors.length] }
                        ]}
                      >
                        <Text style={styles.categoryOptionIconText}>
                          {category.charAt(0)}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.categoryOptionText,
                          newBudget.category === category && styles.categoryOptionTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Budget Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Budget Amount</Text>
              <View style={styles.amountInput}>
                <DollarSign size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                <TextInput
                  style={styles.amountTextInput}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                  value={newBudget.allocated}
                  onChangeText={(text) => setNewBudget({ ...newBudget, allocated: text })}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.budgetPreview}>
              <Text style={styles.budgetPreviewTitle}>Budget Preview</Text>
              {newBudget.category && newBudget.allocated && (
                <View style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <View 
                      style={[
                        styles.previewIcon,
                        { backgroundColor: categoryColors[categories.indexOf(newBudget.category) % categoryColors.length] }
                      ]}
                    >
                      <Text style={styles.previewIconText}>
                        {newBudget.category.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.previewCategory}>{newBudget.category}</Text>
                      <Text style={styles.previewAmount}>
                        ${parseFloat(newBudget.allocated || '0').toFixed(2)} monthly
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    flex: 1,
    alignItems: 'center',
  },
  overviewStatLabel: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  overviewStatAmount: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  budgetCard: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIconText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: isDark ? '#2C2C2E' : '#E5E5EA',
    borderRadius: 4,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: isDark ? '#8E8E93' : '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: isDark ? '#FFF' : '#000',
    marginLeft: 12,
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: isDark ? '#000' : '#F2F2F7',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#2C2C2E' : '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#FFF' : '#000',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalSaveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderWidth: 1,
    borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
    minWidth: 80,
  },
  categoryOptionActive: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  categoryOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryOptionIconText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryOptionText: {
    fontSize: 12,
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: '#007AFF',
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
  },
  amountTextInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
  },
  budgetPreview: {
    marginTop: 20,
  },
  budgetPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 12,
  },
  previewCard: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewIconText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 2,
  },
  previewAmount: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
});