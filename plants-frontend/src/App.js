import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictedLabel, setPredictedLabel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
    setPredictedLabel(null);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/classify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { predicted_label } = response.data;
      setPredictedLabel(predicted_label);

      console.log('Predicted Label:', predicted_label);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <label className="block text-lg font-semibold mb-2 text-gray-700">Upload an Image</label>
      
      <div className="flex items-center justify-center mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600"
        >
          Choose Image
        </label>
      </div>
      {selectedImage && (
        <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="mb-4 rounded-md" style={{ maxWidth: '100%' }} />
      )}
      <button
        onClick={handleUpload}
        className="bg-green-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-green-600"
      >
        Upload Image
      </button>

      {loading ? (
        <div className="mt-4 bg-gray-300 rounded-md p-4 animate-pulse"></div>
      ) : (
        predictedLabel && (
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Predicted Flower: {predictedLabel.name}
          </p>
        )
      )}
    </div>
  );
};

export default ImageUploader;
