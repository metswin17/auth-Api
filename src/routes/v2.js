'use strict';

const express = require('express');
const dataModules = require('../models');

const bearerAuth = require('../auth/middleware/bearer.js');
const permissions = require('../auth/middleware/acl.js');

const router = express.Router();

// Only allow public resource collections.
router.param('model', (req, res, next) => {
  const modelName = req.params.model;

  if (['food', 'clothes'].includes(modelName)) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

// All V2 routes require a valid JWT.
router.use(bearerAuth);

router.get('/:model', permissions('read'), handleGetAll);
router.get('/:model/:id', permissions('read'), handleGetOne);
router.post('/:model', permissions('create'), handleCreate);
router.put('/:model/:id', permissions('update'), handleUpdate);
router.delete('/:model/:id', permissions('delete'), handleDelete);

async function handleGetAll(req, res, next) {
  try {
    const records = await req.model.get();
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
}

async function handleGetOne(req, res, next) {
  try {
    const record = await req.model.get(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function handleCreate(req, res, next) {
  try {
    const record = await req.model.create(req.body);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
}

async function handleUpdate(req, res, next) {
  try {
    const record = await req.model.update(req.params.id, req.body);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

async function handleDelete(req, res, next) {
  try {
    const record = await req.model.delete(req.params.id);
    res.status(200).json(record);
  } catch (error) {
    next(error);
  }
}

module.exports = router;