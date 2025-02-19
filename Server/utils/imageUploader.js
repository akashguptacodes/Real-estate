const cloudinary = require('cloudinary').v2;

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        console.log('File size exceeds 2mb');
        return res.status(201).json({
            message: 'File size exceeds 2mb',
            success:false
        })
    }
    const options = {folder};

    if(height){
        options.height = height;
    };
    if(quality){
        options.quality = quality;
    }

    options.resource_type = 'auto';
    return await cloudinary.uploader.upload(file.tempFilePath, options)
}