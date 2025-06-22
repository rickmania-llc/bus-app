import { ref, onValue, onChildAdded, onChildChanged, onChildRemoved, off, query, orderByChild, startAfter } from 'firebase/database';
import { initFirebase, database, funcURL } from './authHandler';
import axios from 'axios';
import type { AppDispatch } from '../../redux/store';
import type { Student } from '../../types/models/Student';
import type { Guardian } from '../../types/models/Guardian';
import type { Driver } from '../../types/models/Driver';
import type { Route } from '../../types/models/Route';
import type { ListenerInfo } from './types';

class DatabaseHandler {
  private static dispatch: AppDispatch;
  private static tenant: string;
  private static activeListeners: Map<string, ListenerInfo> = new Map();
  private static initialized = false;

  static initDatabaseHandler(dispatch: AppDispatch, tenant: string) {
    if (this.initialized) {
      console.log('DatabaseHandler already initialized');
    } else {
      console.log('Initializing DatabaseHandler for tenant:', tenant);
      this.dispatch = dispatch;
      this.tenant = tenant;

      // Initialize Firebase first
      initFirebase(tenant);

      // Initialize listeners for each entity
      this.initStudentListeners();
      this.initGuardianListeners();
      this.initDriverListeners();
      this.initRouteListeners();

      this.initialized = true;
    }
  }

  private static initStudentListeners() {
    const listenerKey = `students-${this.tenant}`;
    
    // Check if already setup
    if (this.activeListeners.has(listenerKey)) {
      console.log(`Listeners already active for ${listenerKey}`);
      return;
    }

    console.log(`Setting up student listeners for ${listenerKey}`);
    const studentsRef = ref(database, 'students');

    // Get initial snapshot using once
    onValue(studentsRef, (snapshot) => {
      console.log('[Students] Initial data received from Firebase');
      const initialData = snapshot.val() || {};
      console.log('[Students] Raw Firebase data:', initialData);
      console.log('[Students] Number of students:', Object.keys(initialData).length);
      
      const students = Object.entries(initialData).map(([id, data]) => ({
        id,
        ...(data as Omit<Student, 'id'>)
      }));
      console.log('[Students] Transformed data:', students);
      
      // Send initial data
      console.log('[Students] Dispatching setStudents with', students.length, 'students');
      this.dispatch({ type: 'students/setStudents', payload: students });

      // Turn off the value listener after initial load
      off(studentsRef, 'value');

      // Get the highest createdAt timestamp to use as a starting point
      const timestamps = Object.values(initialData).map((student: unknown) => {
        const s = student as { createdAt?: number };
        return s.createdAt || 0;
      });
      const lastTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;
      console.log('[Students] Last timestamp for future queries:', lastTimestamp);

      // Set up child listeners for ongoing updates (only for new items after lastTimestamp)
      const listeners = {
        childAdded: lastTimestamp > 0 ? 
          onChildAdded(query(studentsRef, orderByChild('createdAt'), startAfter(lastTimestamp)), (snapshot) => {
            const id = snapshot.key;
            console.log('[Students] child_added event for NEW ID:', id);
            if (id) {
              const studentData = snapshot.val() as Omit<Student, 'id'>;
              console.log('[Students] New student data:', { id, ...studentData });
              console.log('[Students] Dispatching addStudent');
              this.dispatch({
                type: 'students/addStudent',
                payload: { id, ...studentData }
              });
            }
          }) :
          onChildAdded(query(studentsRef, orderByChild('createdAt')), (snapshot) => {
            const id = snapshot.key;
            console.log('[Students] child_added event for NEW ID:', id);
            if (id) {
              const studentData = snapshot.val() as Omit<Student, 'id'>;
              console.log('[Students] New student data:', { id, ...studentData });
              console.log('[Students] Dispatching addStudent');
              this.dispatch({
                type: 'students/addStudent',
                payload: { id, ...studentData }
              });
            }
          }),

        childChanged: onChildChanged(studentsRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Students] child_changed event for ID:', id);
          if (id) {
            const studentData = snapshot.val() as Omit<Student, 'id'>;
            console.log('[Students] Updated student data:', { id, ...studentData });
            console.log('[Students] Dispatching updateStudent');
            this.dispatch({
              type: 'students/updateStudent',
              payload: { id, ...studentData }
            });
          }
        }),

        childRemoved: onChildRemoved(studentsRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Students] child_removed event for ID:', id);
          if (id) {
            console.log('[Students] Removed student data:', snapshot.val());
            console.log('[Students] Dispatching deleteStudent');
            this.dispatch({
              type: 'students/deleteStudent',
              payload: id
            });
          }
        })
      };

      // Store listener info
      this.activeListeners.set(listenerKey, {
        ref: studentsRef,
        listeners
      });
    }, { onlyOnce: true });
  }

  private static initGuardianListeners() {
    const listenerKey = `guardians-${this.tenant}`;
    
    if (this.activeListeners.has(listenerKey)) {
      console.log(`Listeners already active for ${listenerKey}`);
      return;
    }

    console.log(`Setting up guardian listeners for ${listenerKey}`);
    const guardiansRef = ref(database, 'guardians');

    onValue(guardiansRef, (snapshot) => {
      console.log('[Guardians] Initial data received from Firebase');
      const initialData = snapshot.val() || {};
      console.log('[Guardians] Raw Firebase data:', initialData);
      console.log('[Guardians] Number of guardians:', Object.keys(initialData).length);
      
      const guardians = Object.entries(initialData).map(([id, data]) => ({
        id,
        ...(data as Omit<Guardian, 'id'>)
      }));
      console.log('[Guardians] Transformed data:', guardians);
      
      console.log('[Guardians] Dispatching setGuardians with', guardians.length, 'guardians');
      this.dispatch({ type: 'guardians/setGuardians', payload: guardians });
      off(guardiansRef, 'value');

      // Get the highest createdAt timestamp to use as a starting point
      const timestamps = Object.values(initialData).map((guardian: unknown) => {
        const g = guardian as { createdAt?: number };
        return g.createdAt || 0;
      });
      const lastTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;
      console.log('[Guardians] Last timestamp for future queries:', lastTimestamp);

      const listeners = {
        childAdded: lastTimestamp > 0 ?
          onChildAdded(query(guardiansRef, orderByChild('createdAt'), startAfter(lastTimestamp)), (snapshot) => {
            const id = snapshot.key;
            console.log('[Guardians] child_added event for NEW ID:', id);
            if (id) {
              const guardianData = snapshot.val() as Omit<Guardian, 'id'>;
              console.log('[Guardians] New guardian data:', { id, ...guardianData });
              console.log('[Guardians] Dispatching addGuardian');
              this.dispatch({
                type: 'guardians/addGuardian',
                payload: { id, ...guardianData }
              });
            }
          }) :
          onChildAdded(query(guardiansRef, orderByChild('createdAt')), (snapshot) => {
            const id = snapshot.key;
            console.log('[Guardians] child_added event for NEW ID:', id);
            if (id) {
              const guardianData = snapshot.val() as Omit<Guardian, 'id'>;
              console.log('[Guardians] New guardian data:', { id, ...guardianData });
              console.log('[Guardians] Dispatching addGuardian');
              this.dispatch({
                type: 'guardians/addGuardian',
                payload: { id, ...guardianData }
              });
            }
          }),

        childChanged: onChildChanged(guardiansRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Guardians] child_changed event for ID:', id);
          if (id) {
            const guardianData = snapshot.val() as Omit<Guardian, 'id'>;
            console.log('[Guardians] Updated guardian data:', { id, ...guardianData });
            console.log('[Guardians] Dispatching updateGuardian');
            this.dispatch({
              type: 'guardians/updateGuardian',
              payload: { id, ...guardianData }
            });
          }
        }),

        childRemoved: onChildRemoved(guardiansRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Guardians] child_removed event for ID:', id);
          if (id) {
            console.log('[Guardians] Removed guardian data:', snapshot.val());
            console.log('[Guardians] Dispatching deleteGuardian');
            this.dispatch({
              type: 'guardians/deleteGuardian',
              payload: id
            });
          }
        })
      };

      this.activeListeners.set(listenerKey, {
        ref: guardiansRef,
        listeners
      });
    }, { onlyOnce: true });
  }

  private static initDriverListeners() {
    const listenerKey = `drivers-${this.tenant}`;
    
    if (this.activeListeners.has(listenerKey)) {
      console.log(`Listeners already active for ${listenerKey}`);
      return;
    }

    console.log(`Setting up driver listeners for ${listenerKey}`);
    const driversRef = ref(database, 'drivers');

    onValue(driversRef, (snapshot) => {
      console.log('[Drivers] Initial data received from Firebase');
      const initialData = snapshot.val() || {};
      console.log('[Drivers] Raw Firebase data:', initialData);
      console.log('[Drivers] Number of drivers:', Object.keys(initialData).length);
      
      const drivers = Object.entries(initialData).map(([id, data]) => ({
        id,
        ...(data as Omit<Driver, 'id'>)
      }));
      console.log('[Drivers] Transformed data:', drivers);
      
      console.log('[Drivers] Dispatching setDrivers with', drivers.length, 'drivers');
      this.dispatch({ type: 'drivers/setDrivers', payload: drivers });
      off(driversRef, 'value');

      // Get the highest createdAt timestamp to use as a starting point
      const timestamps = Object.values(initialData).map((driver: unknown) => {
        const d = driver as { createdAt?: number };
        return d.createdAt || 0;
      });
      const lastTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;
      console.log('[Drivers] Last timestamp for future queries:', lastTimestamp);

      const listeners = {
        childAdded: lastTimestamp > 0 ?
          onChildAdded(query(driversRef, orderByChild('createdAt'), startAfter(lastTimestamp)), (snapshot) => {
            const id = snapshot.key;
            console.log('[Drivers] child_added event for NEW ID:', id);
            if (id) {
              const driverData = snapshot.val() as Omit<Driver, 'id'>;
              console.log('[Drivers] New driver data:', { id, ...driverData });
              console.log('[Drivers] Dispatching addDriver');
              this.dispatch({
                type: 'drivers/addDriver',
                payload: { id, ...driverData }
              });
            }
          }) :
          onChildAdded(query(driversRef, orderByChild('createdAt')), (snapshot) => {
            const id = snapshot.key;
            console.log('[Drivers] child_added event for NEW ID:', id);
            if (id) {
              const driverData = snapshot.val() as Omit<Driver, 'id'>;
              console.log('[Drivers] New driver data:', { id, ...driverData });
              console.log('[Drivers] Dispatching addDriver');
              this.dispatch({
                type: 'drivers/addDriver',
                payload: { id, ...driverData }
              });
            }
          }),

        childChanged: onChildChanged(driversRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Drivers] child_changed event for ID:', id);
          if (id) {
            const driverData = snapshot.val() as Omit<Driver, 'id'>;
            console.log('[Drivers] Updated driver data:', { id, ...driverData });
            console.log('[Drivers] Dispatching updateDriver');
            this.dispatch({
              type: 'drivers/updateDriver',
              payload: { id, ...driverData }
            });
          }
        }),

        childRemoved: onChildRemoved(driversRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Drivers] child_removed event for ID:', id);
          if (id) {
            console.log('[Drivers] Removed driver data:', snapshot.val());
            console.log('[Drivers] Dispatching deleteDriver');
            this.dispatch({
              type: 'drivers/deleteDriver',
              payload: id
            });
          }
        })
      };

      this.activeListeners.set(listenerKey, {
        ref: driversRef,
        listeners
      });
    }, { onlyOnce: true });
  }

  private static initRouteListeners() {
    const listenerKey = `routes-${this.tenant}`;
    
    if (this.activeListeners.has(listenerKey)) {
      console.log(`Listeners already active for ${listenerKey}`);
      return;
    }

    console.log(`Setting up route listeners for ${listenerKey}`);
    const routesRef = ref(database, 'routes');

    onValue(routesRef, (snapshot) => {
      console.log('[Routes] Initial data received from Firebase');
      const initialData = snapshot.val() || {};
      console.log('[Routes] Raw Firebase data:', initialData);
      console.log('[Routes] Number of routes:', Object.keys(initialData).length);
      
      const routes = Object.entries(initialData).map(([id, data]) => ({
        id,
        ...(data as Omit<Route, 'id'>)
      }));
      console.log('[Routes] Transformed data:', routes);
      
      console.log('[Routes] Dispatching setRoutes with', routes.length, 'routes');
      this.dispatch({ type: 'routes/setRoutes', payload: routes });
      off(routesRef, 'value');

      // Get the highest createdAt timestamp to use as a starting point
      const timestamps = Object.values(initialData).map((route: unknown) => {
        const r = route as { createdAt?: number };
        return r.createdAt || 0;
      });
      const lastTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;
      console.log('[Routes] Last timestamp for future queries:', lastTimestamp);

      const listeners = {
        childAdded: lastTimestamp > 0 ?
          onChildAdded(query(routesRef, orderByChild('createdAt'), startAfter(lastTimestamp)), (snapshot) => {
            const id = snapshot.key;
            console.log('[Routes] child_added event for NEW ID:', id);
            if (id) {
              const routeData = snapshot.val() as Omit<Route, 'id'>;
              console.log('[Routes] New route data:', { id, ...routeData });
              console.log('[Routes] Dispatching addRoute');
              this.dispatch({
                type: 'routes/addRoute',
                payload: { id, ...routeData }
              });
            }
          }) :
          onChildAdded(query(routesRef, orderByChild('createdAt')), (snapshot) => {
            const id = snapshot.key;
            console.log('[Routes] child_added event for NEW ID:', id);
            if (id) {
              const routeData = snapshot.val() as Omit<Route, 'id'>;
              console.log('[Routes] New route data:', { id, ...routeData });
              console.log('[Routes] Dispatching addRoute');
              this.dispatch({
                type: 'routes/addRoute',
                payload: { id, ...routeData }
              });
            }
          }),

        childChanged: onChildChanged(routesRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Routes] child_changed event for ID:', id);
          if (id) {
            const routeData = snapshot.val() as Omit<Route, 'id'>;
            console.log('[Routes] Updated route data:', { id, ...routeData });
            console.log('[Routes] Dispatching updateRoute');
            this.dispatch({
              type: 'routes/updateRoute',
              payload: { id, ...routeData }
            });
          }
        }),

        childRemoved: onChildRemoved(routesRef, (snapshot) => {
          const id = snapshot.key;
          console.log('[Routes] child_removed event for ID:', id);
          if (id) {
            console.log('[Routes] Removed route data:', snapshot.val());
            console.log('[Routes] Dispatching deleteRoute');
            this.dispatch({
              type: 'routes/deleteRoute',
              payload: id
            });
          }
        })
      };

      this.activeListeners.set(listenerKey, {
        ref: routesRef,
        listeners
      });
    }, { onlyOnce: true });
  }

  /**
   * Creates a new student via Firebase Cloud Functions
   * @param student - Student data without id and createdAt (handled by backend)
   * @returns Promise that resolves when the student is created
   */
  static async createStudent(student: Omit<Student, 'id' | 'createdAt'>): Promise<void> {
    if (!this.tenant) {
      throw new Error('DatabaseHandler not initialized');
    }

    try {
      const response = await axios.post(`${funcURL}studentCrud`, student, {
        headers: {
          'Tenant': this.tenant
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create student');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing student via Firebase Cloud Functions
   * @param id - The student ID to update
   * @param updates - Partial student data to update (excluding id and createdAt)
   * @returns Promise that resolves when the student is updated
   */
  static async updateStudent(
    id: string, 
    updates: Partial<Omit<Student, 'id' | 'createdAt'>>
  ): Promise<void> {
    if (!this.tenant) {
      throw new Error('DatabaseHandler not initialized');
    }

    try {
      const response = await axios.put(`${funcURL}studentCrud/${id}`, updates, {
        headers: {
          'Tenant': this.tenant
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update student');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  /**
   * Deletes a student via Firebase Cloud Functions
   * @param id - The student ID to delete
   * @returns Promise that resolves when the student is deleted
   */
  static async deleteStudent(id: string): Promise<void> {
    if (!this.tenant) {
      throw new Error('DatabaseHandler not initialized');
    }

    try {
      const response = await axios.delete(`${funcURL}studentCrud/${id}`, {
        headers: {
          'Tenant': this.tenant
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete student');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  static cleanup() {
    console.log('Cleaning up DatabaseHandler listeners');
    // Remove all listeners
    this.activeListeners.forEach((listenerInfo, key) => {
      console.log(`Removing listeners for ${key}`);
      off(listenerInfo.ref);
    });
    this.activeListeners.clear();
    this.initialized = false;
  }
}

export default DatabaseHandler;