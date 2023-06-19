import express from "express";
import cors from "cors";
import trackerRoute from "./routes/tracker_route.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  const app = express();
 
  app.use(cors());

  app.use(express.json());

  app.use("/api/tracker", trackerRoute);

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log("Sever running");
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


