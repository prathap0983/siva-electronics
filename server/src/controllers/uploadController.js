import cloudinary from '../config/cloudinary.js';

// Helper function to stream memory buffer to Cloudinary
const uploadBuffer = (fileBuffer, folder = 'siva_electronics') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary stream upload error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
    
    uploadStream.end(fileBuffer);
  });
};

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded. Please upload at least one image file.' });
    }

    const folder = req.body.folder || 'siva_electronics';

    // Upload all files concurrently
    const uploadPromises = req.files.map(file => uploadBuffer(file.buffer, folder));
    const urls = await Promise.all(uploadPromises);

    res.status(200).json({
      message: 'Images uploaded successfully',
      urls
    });
  } catch (error) {
    next(error);
  }
};
