import { Router } from "express";
import multerMiddleware from "../middlewares/multer.js";

const router = Router();

import userController from "../controllers/user.controller.js";

router.get('/resetPass/:email', userController.restartPass);
router.get('/resetPassword', userController.renderResetPasswordPage);
router.post('/resetPassword', userController.renderResetPasswordPage);
router.get('/premium/:uid', userController.changeUserRole);


router.post('/:uid/documents', userController.updateDocumentsRegister);

router.post('/:uid/documents', multerMiddleware, async (req, res) => {
    res.status(200).send("Documentos subidos exitosamente");
});


router.get('/:uid/loadDocuments', userController.renderFormDocuments);

export default router;