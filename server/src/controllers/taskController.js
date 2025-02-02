import TaskModel from "../models/taskModel.js";

export const createTask = async (request, response) => {

    try {
        const { title, description, dueDate, priority, status } = request.body;

        if (!title || title.trim() === "") {
            response.status(400).json({ message: "Title is required!" });
        }

        const newTask = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user: request.user._id,
        });

        await newTask.save();

        response.status(201).json(newTask);

    } catch (error) {
        console.log("Error in createTask controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};

export const getTasks = async (request, response) => {

    try {
        const userId = request.user._id;

        if (!userId) {
            response.status(400).json({ message: "User not found!" });
        }

        const tasks = await TaskModel.find({ user: userId });

        response.status(200).json({
            length: tasks.length,
            tasks,
        });

    } catch (error) {
        console.log("Error in getTasks controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};

export const getTask = async (request, response) => {

    try {
        const userId = request.user._id;

        const { id } = request.params;

        if (!id) {
            response.status(400).json({ message: "Please provide a task id" });
        }

        const task = await TaskModel.findById(id);

        if (!task) {
            response.status(404).json({ message: "Task not found!" });
        }

        if (!task.user.equals(userId)) {
            response.status(401).json({ message: "Not authorized!" });
        }

        response.status(200).json(task);

    } catch (error) {
        console.log("Error in getTask controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};

export const updateTask = async (request, response) => {

    try {
        const userId = request.user._id;

        const { id } = request.params;
        const { title, description, dueDate, priority, status, completed } = request.body;

        if (!id) {
            response.status(400).json({ message: "Please provide a task id" });
        }

        const task = await TaskModel.findById(id);

        if (!task) {
            response.status(404).json({ message: "Task not found!" });
        }

        if (!task.user.equals(userId)) {
            response.status(401).json({ message: "Not authorized!" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.completed = completed || task.completed;

        await task.save();

        return response.status(200).json(task);

    } catch (error) {
        console.log("Error in updateTask controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (request, response) => {

    try {
        const userId = request.user._id;
        const { id } = request.params;

        const task = await TaskModel.findById(id);

        if (!task) {
            response.status(404).json({ message: "Task not found!" });
        }

        if (!task.user.equals(userId)) {
            response.status(401).json({ message: "Not authorized!" });
        }

        await TaskModel.findByIdAndDelete(id);

        return response.status(200).json({ message: "Task deleted successfully!" });

    } catch (error) {
        console.log("Error in deleteTask controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};

export const deleteAllTasks = async (request, response) => {

    try {
        const userId = request.user._id;

        const tasks = await TaskModel.find({ user: userId });

        if (!tasks) {
            response.status(404).json({ message: "No tasks found!" });
        }

        if (!tasks.user.equals(userId)) {
            response.status(401).json({ message: "Not authorized!" });
        }

        await TaskModel.deleteMany({ user: userId });

        return response.status(200).json({ message: "All tasks deleted successfully!" });

    } catch (error) {
        console.log("Error in deleteAllTasks controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};