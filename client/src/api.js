import { DATE_FORMAT, getEndOfTheMonth, getStartOfTheMonth } from "./utils";

/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns
 */
async function httpRequest(url, options = undefined) {
  const response = await fetch(url, options);
  const data = response.status !== 204 ? await response.json() : {};

  if (!response.ok) {
    const err = new Error(
      response.status >= 500
        ? "There was an error processing the request."
        : data.message
    );

    err.status = response.status;

    if (response.status === 422) {
      err.errors = {};
      data.details.body.forEach((message) => {
        err.errors[message.path[0]] = message.message;
      });
    }

    throw err;
  }

  return data;
}

export async function fetchAccounts() {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/accounts`
  );

  return data.data;
}

export async function fetchCategories(search = null) {
  const q = new URLSearchParams(
    Object.entries(search || {}).filter(([, v]) => v !== null)
  );
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/categories?` + q
  );

  return data.data;
}

export async function fetchTransactions(search = null) {
  const q = new URLSearchParams(
    Object.entries(search || {}).filter(([, v]) => v)
  );
  q.delete("sort");
  q.append("sort", "date");
  q.append("sort", "desc");
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/transactions?` + q
  );

  return data.data;
}

export async function fetchBalancesByCurrency() {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/summaries/balance_by_currency`
  );

  return data.data;
}

/**
 * @param {string|number|Date} after
 * @param {string|number|Date} before
 * @param {number} account
 */
export async function fetchMonthlyReport(account = null) {
  const q = new URLSearchParams();
  q.append("after", getStartOfTheMonth(new Date()).format(DATE_FORMAT));
  q.append("before", getEndOfTheMonth(new Date()).format(DATE_FORMAT));

  if (account) {
    q.append("account_id", account);
  }

  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/summaries/transactions?` + q
  );

  return data.data;
}

export async function getAccount(id) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/accounts/${id}`
  );

  return data.data;
}

export async function getCategory(id) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/categories/${id}`
  );

  return data.data;
}

export async function getIncome(id) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/incomes/${id}`
  );

  return data.data;
}

export async function getExpense(id) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/expenses/${id}`
  );

  return data.data;
}

export async function getTransfer(id) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/transfers/${id}`
  );

  return data.data;
}

export async function addAccount(account) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/accounts`, {
    method: "post",
    body: JSON.stringify(account),
    headers: { "content-type": "application/json" },
  });

  return true;
}

export async function addCategory(category) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/categories`, {
    method: "post",
    body: JSON.stringify(category),
    headers: { "content-type": "application/json" },
  });

  return true;
}

export async function addIncome(income) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/incomes`, {
    method: "post",
    body: JSON.stringify(income),
    headers: { "content-type": "application/json" },
  });

  return true;
}

export async function addExpense(expense) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/expenses`, {
    method: "post",
    body: JSON.stringify(expense),
    headers: { "content-type": "application/json" },
  });

  return true;
}

export async function addTransfer(transfer) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/transfers`, {
    method: "post",
    body: JSON.stringify(transfer),
    headers: { "content-type": "application/json" },
  });

  return true;
}

export async function updateAccount(id, account) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/accounts/${id}`,
    {
      method: "put",
      body: JSON.stringify(account),
      headers: { "content-type": "application/json" },
    }
  );

  return data.data;
}

export async function updateCategory(id, category) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/categories/${id}`,
    {
      method: "put",
      body: JSON.stringify(category),
      headers: { "content-type": "application/json" },
    }
  );

  return data.data;
}

export async function updateIncome(id, income) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/incomes/${id}`,
    {
      method: "put",
      body: JSON.stringify(income),
      headers: { "content-type": "application/json" },
    }
  );

  return data.data;
}

export async function updateExpense(id, expense) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/expenses/${id}`,
    {
      method: "put",
      body: JSON.stringify(expense),
      headers: { "content-type": "application/json" },
    }
  );

  return data.data;
}

export async function updateTransfer(id, transfer) {
  const data = await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/transfers/${id}`,
    {
      method: "put",
      body: JSON.stringify(transfer),
      headers: { "content-type": "application/json" },
    }
  );

  return data.data;
}

export async function deleteAccount(id) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/accounts/${id}`, {
    method: "delete",
    headers: { "content-type": "application/json" },
  });

  return;
}

export async function deleteCategory(id) {
  await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/categories/${id}`,
    {
      method: "delete",
      headers: { "content-type": "application/json" },
    }
  );

  return;
}

export async function deleteIncome(id) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/incomes/${id}`, {
    method: "delete",
    headers: { "content-type": "application/json" },
  });

  return;
}

export async function deleteExpense(id) {
  await httpRequest(`${process.env.REACT_APP_BASE_URL}/api/v1/expenses/${id}`, {
    method: "delete",
    headers: { "content-type": "application/json" },
  });

  return;
}

export async function deleteTransfer(id) {
  await httpRequest(
    `${process.env.REACT_APP_BASE_URL}/api/v1/transfers/${id}`,
    {
      method: "delete",
      headers: { "content-type": "application/json" },
    }
  );

  return;
}
