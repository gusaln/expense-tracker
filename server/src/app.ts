import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import accountRoutes from "./accounts/routes";
import categoryRoutes from "./categories/routes";
import expenseRoutes from "./expenses/routes";
import incomeRoutes from "./incomes/routes";
import errorHandler from "./middlewares/errorHandler.middleware";
import notFoundHandler from "./middlewares/notFound.middleware";
import summaryRoutes from "./summaries/routes";
import transactionRoutes from "./transactions/routes";
import transferRoutes from "./transfers/routes";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/accounts", accountRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/incomes", incomeRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/transfers", transferRoutes);
app.use("/api/v1/summaries", summaryRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
