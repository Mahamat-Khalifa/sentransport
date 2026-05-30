import json
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les lignes
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

# Charger les arrets GPS
with open("arrets.json", "r") as f:
    arrets = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": [
            "/lignes",
            "/lignes/<id>",
            "/arrets",
            "/stats",
            "/lignes/recherche?q=Pikine"
        ]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next((l for l in lignes if l["id"] == ligne_id), None)
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@app.route("/arrets")
def get_arrets():
    return jsonify(arrets)

@app.route("/stats")
def get_stats():
    total_lignes = len(lignes)
    total_arrets = sum(ligne["arrets"] for ligne in lignes)
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    stats = {
        "nombre_total_lignes": total_lignes,
        "nombre_total_arrets": total_arrets,
        "ligne_ayant_plus_arrets": {
            "numero": ligne_max["numero"],
            "arrets": ligne_max["arrets"]
        }
    }
    return jsonify(stats)

@app.route("/lignes/recherche")
def rechercher_lignes():
    q = request.args.get("q", "").lower()
    resultats = []
    for ligne in lignes:
        depart = ligne["depart"].lower()
        arrivee = ligne["arrivee"].lower()
        if q in depart or q in arrivee:
            resultats.append(ligne)
    return jsonify(resultats)

if __name__ == "__main__":
    app.run(debug=True, port=5000)