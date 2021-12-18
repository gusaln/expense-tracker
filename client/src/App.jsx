import { forwardRef } from "react";
import { Link, Route, Switch } from "react-router-dom";
import routes from "./routes";

const links = [
  {
    name: "Add transaction",
    to: "/create-transaction",
    icon: "multiple_stop",
  },
  {
    name: "Add category",
    to: "/create-category",
    icon: "local_offer",
  },
  {
    name: "Add account",
    to: "/create-account",
    icon: "account_balance",
  },
];

const NavLink = forwardRef((props, ref) => (
  <a
    ref={ref}
    {...props}
    className="h-full flex p-2 hover:bg-gray-700 transition duration-200 ease-in-out"
  >
    {props.children}
  </a>
));

function App() {
  return (
    <div className="min-h-screen bg-paper">
      <header className="flex justify-between items-center px-4 py-2 bg-charcoal text-paper md:px-8 md:py-4">
        <Link to="/">
          <h1 className="text-xl font-medium md:text-2xl">
            <em className="font-sans">Where's my money?</em> - Expense tracker
          </h1>
        </Link>

        <nav className="flex -my-2 space-x-4">
          {links.map((link) => (
            <Link key={link.name} to={link.to} component={NavLink}>
              <span className="material-icons">{link.icon}</span>
              <span className="ml-2">{link.name}</span>
            </Link>
          ))}
        </nav>
      </header>

      <main className="w-11/12 mx-auto my-6 md:w-10/12 md:my-8 lg:w-9/12 ">
        <Switch>
          {routes.map((route, i) => (
            <Route key={i} exact={route.path === "/"} path={route.path}>
              <route.component />
            </Route>
          ))}
        </Switch>
      </main>
    </div>
  );
}

export default App;
