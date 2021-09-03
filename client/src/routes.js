import Home from "./routes/Home";
import AccountCreate from "./routes/AccountCreate";
import CategoryCreate from "./routes/CategoryCreate";
import TransactionCreate from "./routes/TransactionCreate";
import AccountEdit from "./routes/AccountEdit";
import CategoryEdit from "./routes/CategoryEdit";
import IncomeEdit from "./routes/IncomeEdit";
import ExpenseEdit from "./routes/ExpenseEdit";
import TransferEdit from "./routes/TransferEdit";
import NotFound from "./routes/NotFound";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/create-account",
    component: AccountCreate,
  },
  {
    path: "/create-category",
    component: CategoryCreate,
  },
  {
    path: "/create-transaction",
    component: TransactionCreate,
  },
  {
    path: "/accounts/:id",
    component: AccountEdit,
  },
  {
    path: "/categories/:id",
    component: CategoryEdit,
  },
  {
    path: "/incomes/:id",
    component: IncomeEdit,
  },
  {
    path: "/expenses/:id",
    component: ExpenseEdit,
  },
  {
    path: "/transfers/:id",
    component: TransferEdit,
  },
  {
    path: "*",
    component: NotFound,
  },
];

export default routes;
