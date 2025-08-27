import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Alert,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Camera,
  Receipt,
  Trash2,
  Edit3,
  DollarSign,
  Tag
} from 'lucide-react-native';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

export default function Expenses() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = createStyles(isDark);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      amount: 85.50,
      category: 'Food',
      description: 'Grocery shopping',
      date: '2024-12-26',
      type: 'expense',
    },
    {
      id: '2',
      amount: 2500.00,
      category: 'Salary',
      description: 'Monthly salary',
      date: '2024-12-25',
      type: 'income',
    },
    {
      id: '3',
      amount: 45.00,
      category: 'Transport',
      description: 'Uber ride',
      date: '2024-12-24',
      type: 'expense',
    },
    {
      id: '4',
      amount: 120.00,
      category: 'Bills',
      description: 'Electricity bill',
      date: '2024-12-23',
      type: 'expense',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', 'Food', 'Transport', 'Bills', 'Entertainment', 'Salary', 'Other'];

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'expense' as 'expense' | 'income',
  });

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || expense.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const addTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const transaction: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      description: newTransaction.description,
      date: new Date().toISOString().split('T')[0],
      type: newTransaction.type,
    };

    setExpenses([transaction, ...expenses]);
    setNewTransaction({ amount: '', category: 'Food', description: '', type: 'expense' });
    setShowAddModal(false);
  };

  const deleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setExpenses(expenses.filter((expense) => expense.id !== id));
        }},
      ]
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: '#FF6B6B',
      Transport: '#4ECDC4',
      Bills: '#45B7D1',
      Entertainment: '#96CEB4',
      Salary: '#34C759',
      Other: '#FFEAA7',
    };
    return colors[category] || '#8E8E93';
  };

  const TransactionItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View 
          style={[
            styles.categoryIcon, 
            { backgroundColor: getCategoryColor(item.category) }
          ]}
        >
          <Receipt size={20} color="#FFF" />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text 
          style={[
            styles.transactionAmount,
            { color: item.type === 'income' ? '#34C759' : '#FF3B30' }
          ]}
        >
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteTransaction(item.id)}
          >
            <Trash2 size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryFilter = ({ category }: { category: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        filterCategory === category && styles.categoryFilterActive,
      ]}
      onPress={() => setFilterCategory(category)}
    >
      <Text
        style={[
          styles.categoryFilterText,
          filterCategory === category && styles.categoryFilterTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Track your expenses and income</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFiltersContainer}
        contentContainerStyle={styles.categoryFilters}
      >
        {categories.map((category) => (
          <CategoryFilter key={category} category={category} />
        ))}
      </ScrollView>

      {/* Transactions List */}
      <FlatList
        data={filteredExpenses}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.transactionsContent}
      />

      {/* Add Transaction Modal */}
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
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <TouchableOpacity onPress={addTransaction}>
              <Text style={styles.modalSaveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Transaction Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.typeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newTransaction.type === 'expense' && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newTransaction.type === 'expense' && styles.typeButtonTextActive,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newTransaction.type === 'income' && styles.typeButtonActive,
                  ]}
                  onPress={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newTransaction.type === 'income' && styles.typeButtonTextActive,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Amount</Text>
              <View style={styles.amountInput}>
                <DollarSign size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />
                <TextInput
                  style={styles.amountTextInput}
                  placeholder="0.00"
                  placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                  value={newTransaction.amount}
                  onChangeText={(text) => setNewTransaction({ ...newTransaction, amount: text })}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryOptions}>
                  {categories.slice(1).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newTransaction.category === category && styles.categoryOptionActive,
                      ]}
                      onPress={() => setNewTransaction({ ...newTransaction, category })}
                    >
                      <View 
                        style={[
                          styles.categoryOptionIcon,
                          { backgroundColor: getCategoryColor(category) }
                        ]}
                      >
                        <Tag size={16} color="#FFF" />
                      </View>
                      <Text
                        style={[
                          styles.categoryOptionText,
                          newTransaction.category === category && styles.categoryOptionTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.descriptionInput}
                placeholder="What was this for?"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                value={newTransaction.description}
                onChangeText={(text) => setNewTransaction({ ...newTransaction, description: text })}
                multiline
              />
            </View>

            {/* Receipt Photo */}
            <TouchableOpacity style={styles.receiptButton}>
              <Camera size={24} color="#007AFF" />
              <Text style={styles.receiptButtonText}>Add Receipt Photo</Text>
            </TouchableOpacity>
          </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: isDark ? '#FFF' : '#000',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryFiltersContainer: {
    maxHeight: 50,
  },
  categoryFilters: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderWidth: 1,
    borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
  },
  categoryFilterActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryFilterText: {
    fontSize: 14,
    color: isDark ? '#FFF' : '#000',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#FFF',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  transactionsContent: {
    paddingBottom: 100,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#FFF' : '#000',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: isDark ? '#8E8E93' : '#8E8E93',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  typeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: isDark ? '#1C1C1E' : '#E5E5EA',
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: isDark ? '#8E8E93' : '#8E8E93',
  },
  typeButtonTextActive: {
    color: '#FFF',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryOptionText: {
    fontSize: 12,
    color: isDark ? '#8E8E93' : '#8E8E93',
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: '#007AFF',
  },
  descriptionInput: {
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: isDark ? '#FFF' : '#000',
    borderWidth: 1,
    borderColor: isDark ? '#2C2C2E' : '#E5E5EA',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#1C1C1E' : '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 12,
  },
  receiptButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});