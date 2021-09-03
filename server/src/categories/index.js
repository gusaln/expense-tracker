const { Router } = require('express');
const { validate } = require('../middlewares');
const { validator } = require('../validation');
const {
  listCategories, createCategory, findCategoryById, updateCategory, deleteCategory
} = require('./queries');

const router = Router();

const categoriesStoreSchema = {
  body: validator.object({
    name: validator.string().max(255).required(),
    icon: validator.string().max(50).required(),
    color: validator.color().required(),
    for_expenses: validator.boolean().required(),
  })
};

const categoriesEditSchema = {
  body: validator.object({
    name: validator.string().max(255).required(),
    icon: validator.string().max(50).required(),
    color: validator.color().required(),
  })
};

// List categories handler
router.get(
  '/',
  (req, _, next) => {
    if (req.query.for_expenses) {
      req.query.for_expenses = ['1', 'yes', 'true'].includes(req.query.for_expenses);
    } else if (req.query.for_expenses === '') {
      req.query.for_expenses = undefined;
    }

    next();
  },
  async (req, res, next) => {
    try {
      const categories = await listCategories({
        for_expenses: req.query.for_expenses
      });

      res.json({
        data: categories,
        total: categories.length
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get an category handler
router.get('/:category', async (req, res, next) => {
  try {
    const category = await findCategoryById(req.params.category);

    res.json({ data: category });
  } catch (error) {
    next(error);
  }
});

// Create categories handler
router.post(
  '/',
  validate(categoriesStoreSchema),
  async (req, res, next) => {
    try {
      const category = await createCategory({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
        for_expenses: Boolean(req.body.for_expenses)
      });

      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }
);

// Edit category handler
router.put(
  '/:category',
  validate(categoriesEditSchema),
  async (req, res, next) => {
    try {
      const category = await updateCategory(req.params.category, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      });

      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }
);

// Delete category handler
router.delete(
  '/:category',
  async (req, res, next) => {
    try {
      await deleteCategory(req.params.category);

      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
