import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ShiftContext = createContext();

export const ShiftProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const shiftsData = await AsyncStorage.getItem('shifts');
        const employeesData = await AsyncStorage.getItem('employees');
        
        if (shiftsData) setShifts(JSON.parse(shiftsData));
        if (employeesData) setEmployees(JSON.parse(employeesData));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save shifts to AsyncStorage whenever they change
  useEffect(() => {
    const saveShifts = async () => {
      try {
        await AsyncStorage.setItem('shifts', JSON.stringify(shifts));
      } catch (error) {
        console.error('Error saving shifts:', error);
      }
    };
    
    if (!loading) saveShifts();
  }, [shifts, loading]);

  // Save employees to AsyncStorage whenever they change
  useEffect(() => {
    const saveEmployees = async () => {
      try {
        await AsyncStorage.setItem('employees', JSON.stringify(employees));
      } catch (error) {
        console.error('Error saving employees:', error);
      }
    };
    
    if (!loading) saveEmployees();
  }, [employees, loading]);

  // Add a new shift
  const addShift = (shift) => {
    const newShift = {
      id: Date.now().toString(),
      ...shift,
    };
    setShifts([...shifts, newShift]);
  };

  // Update an existing shift
  const updateShift = (id, updatedShift) => {
    setShifts(shifts.map(shift => 
      shift.id === id ? { ...shift, ...updatedShift } : shift
    ));
  };

  // Delete a shift
  const deleteShift = (id) => {
    setShifts(shifts.filter(shift => shift.id !== id));
  };

  // Add a new employee
  const addEmployee = (employee) => {
    const newEmployee = {
      id: Date.now().toString(),
      ...employee,
    };
    setEmployees([...employees, newEmployee]);
  };

  // Update an existing employee
  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, ...updatedEmployee } : employee
    ));
  };

  // Delete an employee
  const deleteEmployee = (id) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    // Also remove this employee from any shifts
    setShifts(shifts.map(shift => ({
      ...shift,
      assignedEmployees: shift.assignedEmployees?.filter(empId => empId !== id) || []
    })));
  };

  return (
    <ShiftContext.Provider
      value={{
        shifts,
        employees,
        loading,
        addShift,
        updateShift,
        deleteShift,
        addEmployee,
        updateEmployee,
        deleteEmployee,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};