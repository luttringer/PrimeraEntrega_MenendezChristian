import multer from 'multer';
import { promises as fsPromises } from 'fs';
import __dirname from "../utils.js"; 

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uid = extractUidFromUrl(req.url);
    const fieldName = file.fieldname.toLowerCase();

    let uploadPath = '';

    if (fieldName.includes('profileimage')) {
      uploadPath = `${__dirname}/uploads/profiles/${uid}`;
    } else if (fieldName.includes('document')) {
      uploadPath = `${__dirname}/uploads/documents/${uid}`;
    } else {
      uploadPath = `${__dirname}/uploads/products/${uid}`;
    }

    try {
      await fsPromises.mkdir(uploadPath, { recursive: true });
    } catch (err) {
      console.error('Error al crear la carpeta:', err.message);
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const multerMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message === "Unexpected end of form") 
      {
        return next();
      }
      return res.status(500).json({ error: 'Error interno del servidor', message: err.message });
    }

    next();
  });
};

const extractUidFromUrl = (url) => 
{
  const regex = /\/users\/([^\/]+)\/documents/i;
  const match = url.match(regex);

  return match ? match[1] : null;
};

export default multerMiddleware;
