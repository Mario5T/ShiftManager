import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ShiftContext } from '../context/ShiftContext';
import { format, isToday, isTomorrow } from 'date-fns';
import { colors } from '../theme/colors';

const HomeScreen = ({ navigation }) => {
  const { shifts, employees, loading } = useContext(ShiftContext);
  const [activeTab, setActiveTab] = useState('myShifts');

  // Get today's shifts
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  const todayShifts = shifts.filter(shift => 
    shift.date === todayString
  );

  // Get upcoming shifts (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const upcomingShifts = shifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate > today && shiftDate <= nextWeek;
  });

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unassigned';
  };

  const renderShiftItem = ({ item }) => (
    <View style={styles.shiftItem}>
      <View style={styles.shiftTime}>
        <Text style={styles.timeText}>
          {format(new Date(`${item.date}T${item.startTime}`), 'h:mm a')} - 
          {format(new Date(`${item.date}T${item.endTime}`), 'h:mm a')}
        </Text>
        <Text style={styles.locationText}>{item.location}</Text>
      </View>
      <TouchableOpacity 
        style={[
          styles.actionButton,
          item.status === 'booked' && styles.bookedButton,
          item.status === 'overlapping' && styles.overlappingButton,
          item.status === 'available' && styles.availableButton,
          item.disabled && styles.disabledButton
        ]}
        disabled={item.disabled || item.status === 'overlapping'}
        onPress={() => navigation.navigate('EditShift', { shift: item })}
      >
        <Text style={[
          styles.actionButtonText,
          item.status === 'booked' && styles.bookedButtonText,
          item.status === 'overlapping' && styles.overlappingButtonText,
          item.status === 'available' && styles.availableButtonText,
          item.disabled && styles.disabledButtonText
        ]}>
          {item.status === 'booked' ? 'Cancel' : 'Book'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cityFilter}>
        <TouchableOpacity style={styles.cityButton}>
          <Text style={styles.cityButtonTextActive}>Helsinki (5)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cityButton}>
          <Text style={styles.cityButtonText}>Tampere (8)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cityButton}>
          <Text style={styles.cityButtonText}>Turku (5)</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.shiftsList}
        data={activeTab === 'myShifts' ? todayShifts : upcomingShifts}
        renderItem={renderShiftItem}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'myShifts' && styles.activeTab]}
          onPress={() => setActiveTab('myShifts')}
        >
          <Text style={[styles.tabText, activeTab === 'myShifts' && styles.activeTabText]}>
            My shifts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'availableShifts' && styles.activeTab]}
          onPress={() => setActiveTab('availableShifts')}
        >
          <Text style={[styles.tabText, activeTab === 'availableShifts' && styles.activeTabText]}>
            Available shifts
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  cityFilter: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  cityButton: {
    marginRight: 16,
  },
  cityButtonText: {
    color: colors.textLight,
    fontSize: 16,
  },
  cityButtonTextActive: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  shiftsList: {
    flex: 1,
  },
  shiftItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  shiftTime: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.textLight,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  bookedButton: {
    borderColor: colors.darkPink,
  },
  overlappingButton: {
    borderColor: colors.darkPink,
    backgroundColor: colors.white,
  },
  availableButton: {
    borderColor: colors.darkGreen,
  },
  disabledButton: {
    borderColor: colors.disabled,
    backgroundColor: colors.white,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookedButtonText: {
    color: colors.darkPink,
  },
  overlappingButtonText: {
    color: colors.darkPink,
  },
  availableButtonText: {
    color: colors.darkGreen,
  },
  disabledButtonText: {
    color: colors.disabled,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
});

export default HomeScreen;