/* eslint-disable  no-explicit-any */
import { connect, set } from "mongoose";

const environment: any = process.env.NODE_ENV;
var connectionURI: any =
  environment === "development"
    ? process.env.DB_URI_DEV
    : environment === "stage"
    ? process.env.DB_URI_STAGE
    : process.env.DB_URI_PROD;

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await connect(connectionURI);
    console.info("Successfully connected to database!");
  } catch (er: any) {
    console.log(er.message);
    process.exit(1);
  }
};

set("strictQuery", true);
