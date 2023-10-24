import cloudinary from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const cloudinaryUpload = async(fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
          resolve(
            {
              url: result.secure_url,
            }, {
                resource_type: "auto"
            })
        })
    })
}

export default cloudinaryUpload