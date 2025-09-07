import { selectAllTasks, insertTask, removeTask } from "../models/Task.js"
import { ApiError } from "../helper/ApiError.js"

const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks()
        return res.status(200).json(result.rows || [])
    } catch (error) {
        return next(error)
    }
}

const postTask = async (req, res, next) => {
    const { task } = req.body
    console.log("Task to create:", task)
    try {
        if(!task || !task.description.trim().length === 0) {
            return next(new ApiError('Task description is required', 400))
            /*const error = new Error('Task description is required')
            error.status = 400
            return next(error)*/
        }
        const result = await insertTask(task.description)
        return res.status(201).json({id: result.rows[0].id, description: result.rows[0].description})
    } catch (error) {
        return next(error)
    }
}

const deleteTask = async (req, res, next) => {
    const { id } = req.params
    console.log(`Deleting task with id: ${id}`)
    try {
        const taskId = parseInt(id, 10); // Muunna id kokonaisluvuksi, poisto ei onnistunut ilman tätä
        if (isNaN(taskId)) {
            return next(new ApiError('Invalid task ID', 400));
        }

        const result = await removeTask(taskId);
        if (result.rowCount === 0) {
            return next(new ApiError('Task not found', 404));
        }

        return res.status(200).json({ id: taskId });
    } catch (error) {
        return next(error);
    }

}

export { getTasks, postTask, deleteTask }