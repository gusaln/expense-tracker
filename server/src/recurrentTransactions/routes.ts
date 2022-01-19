import { Router } from "express";
import deleteRecurrentTransactionDefinition from "./queries/deleteRecurrentTransactionDefinition";
import findRecurrentTransactionDefinitionById from "./queries/findRecurrentTransactionDefinitionById";
import listRecurrentTransactionDefinitions from "./queries/listRecurrentTransactionDefinitions";

const recurrentTransactionRoutes = Router();

// List categories handler
recurrentTransactionRoutes.get("/definitions/", async (_, res, next) => {
  try {
    const recurs = await listRecurrentTransactionDefinitions();

    res.json({
      data: recurs,
      total: recurs.length,
    });
  } catch (error) {
    next(error);
  }
});

// Get a recur handler
recurrentTransactionRoutes.get("/definitions/:recur", async (req, res, next) => {
  try {
    res.json({ data: await findRecurrentTransactionDefinitionById(req.params.recur) });
  } catch (error) {
    next(error);
  }
});

// Delete recur handler
recurrentTransactionRoutes.delete("/definitions/:recur", async (req, res, next) => {
  try {
    await deleteRecurrentTransactionDefinition(req.params.recur);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default recurrentTransactionRoutes;
