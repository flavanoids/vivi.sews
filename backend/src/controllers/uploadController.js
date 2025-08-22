import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure uploads directory exists
const uploadsDir = './uploads';
const fabricImagesDir = './uploads/fabrics';
const projectImagesDir = './uploads/projects';
const patternImagesDir = './uploads/patterns';

// Create directories if they don't exist
[uploadsDir, fabricImagesDir, projectImagesDir, patternImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on upload type
    let uploadPath = uploadsDir;
    if (req.uploadType === 'fabric') {
      uploadPath = fabricImagesDir;
    } else if (req.uploadType === 'project') {
      uploadPath = projectImagesDir;
    } else if (req.uploadType === 'pattern') {
      uploadPath = patternImagesDir;
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload middleware for different types
export const uploadFabricImage = (req, res, next) => {
  req.uploadType = 'fabric';
  upload.single('image')(req, res, next);
};

export const uploadProjectImage = (req, res, next) => {
  req.uploadType = 'project';
  upload.single('image')(req, res, next);
};

export const uploadPatternImage = (req, res, next) => {
  req.uploadType = 'pattern';
  upload.single('image')(req, res, next);
};

// Upload endpoint
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Generate the URL for the uploaded file
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.uploadType}s/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
};

// Delete file endpoint
export const deleteImage = async (req, res) => {
  try {
    const { filename, type } = req.body;
    
    if (!filename || !type) {
      return res.status(400).json({ message: 'Filename and type are required' });
    }

    let filePath;
    if (type === 'fabric') {
      filePath = path.join(fabricImagesDir, filename);
    } else if (type === 'project') {
      filePath = path.join(projectImagesDir, filename);
    } else if (type === 'pattern') {
      filePath = path.join(patternImagesDir, filename);
    } else {
      return res.status(400).json({ message: 'Invalid file type' });
    }

    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
};
