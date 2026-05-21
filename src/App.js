import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [detailLigne, setDetailLigne] = useState(null);
  const [chargementDetail, setChargementDetail] = useState(false);

  // Exercice 1 : fonction extraite pour pouvoir la réappeler
  function chargerLignes() {
    setChargement(true);
    setErreur(null);

    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  // Chargement au démarrage
  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  // Exercice 3 : fetch du détail au clic
  function handleClickLigne(ligne) {
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
      setDetailLigne(null);
      return;
    }

    setLigneSelectionnee(ligne);
    setChargementDetail(true);
    setDetailLigne(null);

    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Détail introuvable : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setDetailLigne(data);
        setChargementDetail(false);
      })
      .catch(error => {
        console.error("Erreur chargement détail :", error.message);
        setChargementDetail(false);
      });
  }

  // Écran de chargement
  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  // Écran d'erreur
  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }

  // Écran normal
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />

        {/* Exercice 1 : bouton recharger */}
        <button className="btn-recharger" onClick={chargerLignes}>
          🔄 Recharger
        </button>

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''}{' '}
          trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}

        {/* Exercice 3 : détail chargé depuis l'API */}
        {chargementDetail && (
          <p className="message-chargement">Chargement du détail...</p>
        )}
        {detailLigne && !chargementDetail && (
          <DetailLigne ligne={detailLigne} />
        )}

      </main>
      <Footer />
    </div>
  );
}

export default App;