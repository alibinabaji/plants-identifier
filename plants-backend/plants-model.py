from flask import Flask, request, jsonify
from transformers import pipeline
from PIL import Image
from flask_cors import CORS
import json
app = Flask(__name__)
CORS(app) 
detector = pipeline(model="facebook/metaclip-h14-fullcc2.5b", task="zero-shot-image-classification")

with open('plants-list.json', 'r') as file:
    class_labels_dict = json.load(file)
    class_labels = list(class_labels_dict.keys())
    
@app.route('/classify', methods=['POST'])
def classify_image():
    try:
        image = Image.open(request.files['image'])
        result = detector(images=image, candidate_labels= class_labels)
        
        # Extract the predicted label
        predicted_label = result[0]['label'] if result and result[0] and 'label' in result[0] else "Unknown"
        print(result)
        predicted_entry = class_labels_dict.get(predicted_label, {"name": "Unknown"})

        response_data = {'predicted_label': predicted_entry}
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
