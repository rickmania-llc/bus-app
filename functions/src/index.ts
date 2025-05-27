import {onRequest} from "firebase-functions/v2/https";
import { studentIndex, guardianIndex, driverIndex } from './api/index';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

// Student CRUD operations
export const studentCrud = onRequest(async (req, res) => {
  return await studentIndex.crud(req, res);
});

// Guardian CRUD operations
export const guardianCrud = onRequest(async (req, res) => {
  return await guardianIndex.guardianIndex(req, res);
});

// Driver CRUD operations
export const driverCrud = onRequest(async (req, res) => {
  return await driverIndex.driverIndex(req, res);
});
