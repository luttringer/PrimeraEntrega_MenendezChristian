import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { uid } = req.params;
    const fileType = file.mimetype.split('/')[0];

    if (fileType === 'image') {
      cb(null, path.join(__dirname, '../uploads/profiles', uid));
    } else if (fileType === 'application') {
      cb(null, path.join(__dirname, '../uploads/documents', uid));
    } else {
      cb(null, path.join(__dirname, '../uploads/products', uid));
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Middleware envuelto en una función con la firma (req, res, next)
const multerMiddleware = (req, res, next) => 
{
  // `upload.single('nombreDelCampo')` para procesar un solo archivo
  upload.single('nombreDelCampo')(req, res, err => 
  {
    if (err) 
    {
      // Manejo de errores, si es necesario
      return res.status(400).json({ error: 'Error al subir el archivo' });
    }
    // Continuar con el siguiente middleware
    next();
  });
};

export default multerMiddleware;
