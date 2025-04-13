import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { ShiftContext } from '../context/ShiftContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO } from 'date-fns';

const EditShiftScreen = ({ route, navigation }) => {
  const { shift } = route.params;
  const { updateShift, deleteShift, employees } = useContext(ShiftContext);
  
  const [date, setDate] = useState(new Date(shift.date));
  const [startTime, setStartTime] = useState(parseISO(`${shift.date}T${shift.startTime}`));
  const [endTime, setEndTime] = useState(parseISO(`${shift.date}T${shift.endTime}`));
  const [location, setLocation] = useState(shift.location || '');
  const [notes, setNotes] = useState(shift.notes || '');
  
  const [selectedEmployees, setSelectedEmployees] = useState({});
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Initialize selected employees
  useEffect(() => {
    const initialSelection = {};
    employees.forEach(employee => {
      initialSelection[employee.id] = shift.assignedEmployees?.includes(employee.id) || false;
    });
    setSelectedEmployees(initialSelection);
  }, [shift, employees]);

  const handleSave = () => {
    const assignedEmployees = Object.keys(selectedEmployees).filter(id => selectedEmployees[id]);
    
    const updatedShift = {
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      endTime: format(endTime, 'HH:mm'),
      location,
      notes,
      assignedEmployees,
    };
    
    updateShift(shift.id, updatedShift);
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Shift',
      'Are you sure you want to delete this shift?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            deleteShift(shift.id);
            navigation.goBack();
          },
          style: 'destructive'
        },
      ]
    );
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{format(date, 'EEEE, MMMM d, yyyy')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Start Time</Text>
      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setShowStartTimePicker(true)}
      >
        <Text>{format(startTime, 'h:mm a')}</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>End Time</Text>
      <TouchableOpacity 
        style={styles.dateInput}
        onPress={() => setShowEndTimePicker(true)}
      >
        <Text>{format(endTime, 'h:mm a')}</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Enter location"
      />

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        value={notes}
        onChangeText={setNotes}
        placeholder="Enter any additional notes"
        multiline
      />

      <Text style={styles.label}>Assign Employees</Text>
      {employees.length === 0 ? (
        <Text style={styles.noEmployeesText}>No employees available. Add employees first.</Text>
      ) : (
        employees.map(employee => (
          <View key={employee.id} style={styles.employeeItem}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <Switch
              value={!!selectedEmployees[employee.id]}
              onValueChange={() => toggleEmployeeSelection(employee.id)}
            />
          </View>
        ))
      )}

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>Delete Shift</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  employeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  employeeName: {
    fontSize: 16,
  },
  noEmployeesText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditShiftScreen;