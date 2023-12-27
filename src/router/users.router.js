import { Router } from "express";
import multerMiddleware from "../middlewares/multer.js";
import authorization from "../middlewares/authorization.js";
import userController from "../controllers/user.controller.js";

const router = Router();

router.get('/resetPass/:email', userController.restartPass);
router.get('/resetPassword', userController.renderResetPasswordPage);
router.post('/resetPassword', userController.renderResetPasswordPage);
router.get('/premium/:uid', userController.changeUserRole);
router.post('/:uid/documents', userController.updateDocumentsRegister);
router.post('/:uid/documents', multerMiddleware, async (req, res) => {res.status(200).send("Documentos subidos exitosamente");});
router.get('/:uid/loadDocuments', userController.renderFormDocuments);
router.get('/usersGest', authorization(['admin', 'superadmin']), userController.renderGestUsers);
router.get('/', authorization(['admin', 'superadmin']), userController.allUsers);
router.delete('/', authorization(['admin', 'superadmin']), userController.allUsers);
router.post('/delete/:email', authorization(['admin', 'superadmin']), userController.deleteUser);
router.post('/changeRole/:uid', authorization(['admin', 'superadmin']), userController.changeRole);

export default router;