import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  	fs.mkdirSync(UPLOAD_DIR);
}

// Multer storage configuration
const storage = multer.diskStorage({
  	destination: (req, file, cb) => {
    	cb(null, UPLOAD_DIR);
  	},
  	filename: (req, file, cb) => {
    	const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    	cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
 	},
});

// Multer file filter for validation
const fileFilter = (req, file, cb) => {
  	const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  	if (allowedTypes.includes(file.mimetype)) {
    	cb(null, true);
  	} else {
    	cb(new Error('Unsupported file type. Only JPG, PNG, and PDF are allowed.'));
  	}
};

// Multer upload instance
const upload = multer({
  	storage,
  	fileFilter,
  	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export default upload;
