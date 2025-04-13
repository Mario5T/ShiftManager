import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ShiftContext } from '../context/ShiftContext';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';

const ScheduleScreen = ({ navigation }) => {
  const { shifts, employees } = useContext(ShiftContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Calculate the start of the current week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  
  // Generate an array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      dateString: format(date, 'yyyy-MM-dd'),
      day: format(date, 'EEE'),
      dayNumber: format(date, 'd'),
    };
  });

  // Get shifts for the selected date
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const shiftsForSelectedDate = shifts.filter(shift => shift.date === selectedDateString);

  // Get employee name by ID
  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'Unassigned';
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Schedule</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddShift')}
        >
          <Text style={styles.addButtonText}>+ Add Shift</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={goToPreviousWeek}>
          <Text style={styles.navButton}>← Previous</Text>
        </TouchableOpacity>
        <Text style={styles.weekTitle}>
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </Text>
        <TouchableOpacity onPress={goToNextWeek}>
          <Text style={styles.navButton}>Next →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.daysContainer}>
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.dateString}
            style={[
              styles.dayButton,
              selectedDateString === day.dateString && styles.selectedDay,
            ]}
            onPress={() => setSelectedDate(day.date)}
          >
            <Text style={styles.dayText}>{day.day}</Text>
            <Text 
              style={[
                styles.dayNumber,
                selectedDateString === day.dateString && styles.selectedDayText,
              ]}
            >
              {day.dayNumber}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.shiftsContainer}>
        <Text style={styles.dateHeader}>
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </Text>
        
        {shiftsForSelectedDate.length === 0 ? (
          <Text style={styles.emptyText}>No shifts scheduled for this day</Text>
        ) : (
          <FlatList
            data={shiftsForSelectedDate}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.shiftCard}
                onPress={() => navigation.navigate('EditShift', { shift: item })}
              >
                <Text style={styles.shiftTime}>
                  {format(parseISO(`${item.date}T${item.startTime}`), 'h:mm a')} - 
                  {format(parseISO(`${item.date}T${item.endTime}`), 'h:mm a')}
                </Text>
                <Text style={styles.shiftLocation}>{item.location}</Text>
                <View style={styles.employeeList}>
                  {item.assignedEmployees?.map(empId => (
                    <Text key={empId} style={styles.employeeName}>
                      {getEmployeeName(empId)}
                    </Text>
                  ))}
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  selectedDay: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedDayText: {
    color: 'white',
  },
  shiftsContainer: {
    flex: 1,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  shiftCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  shiftTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  shiftLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  employeeList: {
    marginTop: 4,
  },
  employeeName: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
});

export default ScheduleScreen;