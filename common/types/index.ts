/**
 * Core data types for the Bus Tracking System
 * 
 * This module exports all the main entity interfaces
 * for consistent use across frontend and backend components.
 * 
 * Note: All entities use Firebase Realtime Database keys as their unique identifiers,
 * so the document data itself doesn't include an 'id' field.
 */

// Core entity interfaces
export type { Guardian } from './Guardian';
export type { Student } from './Student';
export type { Driver } from './Driver';
export type { Route, Location, EmbeddedStop, StudentStatus } from './Route'; 