// Firebase-specific type definitions
export interface FirebaseUpdate<T> {
  type: 'value' | 'child_added' | 'child_changed' | 'child_removed';
  data?: Record<string, T> | T;
  key?: string;
}

export interface ListenerInfo {
  ref: any;
  listeners: {
    [key: string]: any;
  };
  sentIds: Set<string>;
}