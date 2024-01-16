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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md relative">
      <label className="block text-lg font-semibold mb-2 text-gray-700">Upload an Image</label>

      <div className="relative border-dotted border-2 border-gray-500 p-12 mx-auto text-center h-80">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
          >
          {!selectedImage && (
            <>
          <span className="text-lg font-semibold text-gray-700 mb-2">Drag and Drop</span>
          <span className="text-gray-500">or</span>
          <span className="text-blue-500 hover:underline">Choose Image</span>
          </>
          )}
        </label>
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="mt-4 rounded-md mx-auto z-10"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        )}
      </div>

      <button
        onClick={handleUpload}
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-gray-600"
      >
        Upload Image
      </button>
      <p className="mt-4 text-lg font-semibold text-gray-800">
      Predicted Flower:
      </p>

      {loading ? (
        <div className="mt-4 bg-gray-300 rounded-md p-4 animate-pulse"></div>
      ) : (
        predictedLabel && (
          <p className="mt-4 text-lg font-semibold text-gray-800">
             {predictedLabel.name}
          </p>
        )
      )}
    </div>
  );
};

export default ImageUploader;
