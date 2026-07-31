import multer from 'multer';

// Configure multer memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
});

export default upload;
