import cors from "cors";

const options = {
  origin: process.env.FRONTEND_ORIGIN, // Frontend origin
  optionsSuccessStatus: 200,
  // we have to make the credential to true in frontend as well
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

export const corsHandler = cors(options);
