import express from "express";
import { deleteNotification ,
    getAllNotifications ,
    markAsRead ,
    clearAllNotifications ,
    creatNotificationForOrder 
} from "../controllers/notificationController.js";


const notificationsRouter = express.Router()


notificationsRouter.get('/list', getAllNotifications)
notificationsRouter.delete('/delete/:id', deleteNotification)
notificationsRouter.delete('/clear', clearAllNotifications)
notificationsRouter.patch('/read/:id', markAsRead)


export default notificationsRouter;