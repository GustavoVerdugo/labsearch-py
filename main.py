from flask import Flask, request, jsonify
from rapidfuzz import fuzz
import json

app = Flask(__name__)

# Cargar los datos desde el archivo JSON
with open('processed_data.json', 'r') as file:
    data = json.load(file)

# Función para buscar productos en los datos
# Para agregar nuevas columnas se deben configurar
# en el script js
def search_products(query, max_results=20):
    results = []
    for product in data:
        product_name = product['product_name']
        similarity_score = fuzz.partial_ratio(query.lower(), product_name.lower())
        if similarity_score > 60:
            results.append((product_name, similarity_score, product['price'], product['image']))
        
        if len(results) >= max_results:
            break
    results.sort(key=lambda x: x[1], reverse=True)
    return results

@app.route('/search', methods=['GET'])
def search():
    search_query = request.args.get('text')
    search_results = search_products(search_query, max_results=20)
    
    if search_results:
        results = []
        for result in search_results:
            results.append({
                "product": result[0],
                "similarity": result[1],
                "price": result[2],
                "image": result[3]
            })
        return jsonify(results)
    else:
        return jsonify({"message": "No se encontraron resultados"})

if __name__ == '_main_':
    app.run(host='127.0.0.1', port=5000)