const Task = require("../models/Task");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

const getAllTasks = async (req, res) => {
  const tasks = await Task.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ tasks, count: tasks.length });
};

const getTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await Task.findOne({
    _id: taskId,
    createdBy: userId,
  });
  if (!task) {
    return res.status(404).json({ msg: "no task was provided" });
  }
  res.status(StatusCodes.OK).json({ task });
};

const createTask = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Task.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
const updateTask = async (req, res) => {
  const {
    body: { title, description },
    user: { userId },
    params: { id: taskId },
  } = req;

  if (title === "" || description === "") {
    throw new BadRequestError("cannot be empty");
  }
  const task = await Task.findByIdAndUpdate({_id:taskId, createdBy:userId}, req.body , {
    new: true,
    runValidators: true,
  })
  if (!task) {
    return res.status(404).json({ msg: "no task was provided" });
  }
  res.status(StatusCodes.OK).json({ task });
};
const deleteTask = async (req, res) => {
  const {
    user: { userId },
    params: { id: taskId },
  } = req;
  const task = await Task.findOneAndDelete({_id:taskId, createdBy:userId})
  if (!task) {
    return res.status(404).json({ msg: "no task was provided" });
  }
  res.status(StatusCodes.OK).json({ task });
};

module.exports = {
  getAllTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
