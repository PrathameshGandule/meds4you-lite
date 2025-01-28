import { Router } from 'express';
import uploadPrescription from '../controllers/prescriptionController.js';
import upload from '../middlewares/uploadMiddleware.js';
import { verifyToken , authorizeRoles } from '../middlewares/authMiddleware.js'

const prescriptionRoutes = Router();

// POST route for uploading prescription
prescriptionRoutes.post('/upload', verifyToken, authorizeRoles("user"), upload.single('prescription'), uploadPrescription);

// prescriptionRoutes.get('/', verifyToken, authorizeRoles("admin"), async(req, res, next) => {
//     try{

//     } catch(err) {
//         console.log(err);
//         return res.status(500).json({ message: "Something went wrong !" })
//     }
// })

export default prescriptionRoutes;