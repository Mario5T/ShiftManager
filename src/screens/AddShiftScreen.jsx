import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { ShiftContext } from '../context/ShiftContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const AddShiftScreen = ({ navigation }) => {
  const { addShift, employees } = useContext(ShiftContext);
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000)); // +1 hour
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState({});
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSave = () => {
    const assignedEmployees = Object.keys(selectedEmployees).filter(id => selectedEmployees[id]);
    
    const newShift = {
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      endTime: format(endTime, 'HH:mm'),
      location,
      notes,
      assignedEmployees,
    };
    
    addShift(newShift);
    navigation.goBack();
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
        <Text style={styles.saveButtonText}>Save Shift</Text>
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
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddShiftScreen;