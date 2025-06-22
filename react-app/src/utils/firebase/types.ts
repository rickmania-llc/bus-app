import type { DatabaseReference, Unsubscribe } from 'firebase/database';

// Firebase-specific type definitions
export interface FirebaseUpdate<T> {
  type: 'value' | 'child_added' | 'child_changed' | 'child_removed';
  data?: Record<string, T> | T;
  key?: string;
}

export interface ListenerInfo {
  ref: DatabaseReference;
  listeners: {
    [key: string]: Unsubscribe;
  };
  sentIds?: Set<string>; // Made optional since we're moving away from it
}