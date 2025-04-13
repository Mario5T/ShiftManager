import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { ShiftContext } from '../context/ShiftContext';
import { Ionicons } from '@expo/vector-icons';

const EmployeesScreen = ({ navigation }) => {
  const { employees, deleteEmployee } = useContext(ShiftContext);

  const handleDeleteEmployee = (id, name) => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => deleteEmployee(id),
          style: 'destructive'
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Employees</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEmployee')}
        >
          <Text style={styles.addButtonText}>+ Add Employee</Text>
        </TouchableOpacity>
      </View>

      {employees.length === 0 ? (
        <Text style={styles.emptyText}>No employees added yet</Text>
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.employeeCard}>
              <View style={styles.employeeInfo}>
                <Text style={styles.employeeName}>{item.name}</Text>
                <Text style={styles.employeeRole}>{item.role}</Text>
                <Text style={styles.employeeContact}>{item.phone}</Text>
                <Text style={styles.employeeContact}>{item.email}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => navigation.navigate('EditEmployee', { employee: item })}
                >
                  <Ionicons name="pencil" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEmployee(item.id, item.name)}
                >
                  <Ionicons name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
    marginBottom: 20,
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
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  employeeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  employeeRole: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  employeeContact: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  actions: {
    justifyContent: 'center',
  },
  editButton: {
    padding: 8,
    marginBottom: 8,
  },
  deleteButton: {
    padding: 8,
  },
});

export default EmployeesScreen;