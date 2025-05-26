import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { studentIndex, guardianIndex } from './api/index';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
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
