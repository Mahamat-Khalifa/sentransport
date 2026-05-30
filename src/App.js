import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';
import Carte from './Carte';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [detailLigne, setDetailLigne] = useState(null);
  const [chargementDetail, setChargementDetail] = useState(false);

  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) throw new Error("Erreur serveur : " + response.status);
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

  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

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
        if (!response.ok) throw new Error("Détail introuvable : " + response.status);
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

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />

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

        {chargementDetail && (
          <p className="message-chargement">Chargement du détail...</p>
        )}
        {detailLigne && !chargementDetail && (
          <DetailLigne ligne={detailLigne} />
        )}

        <Carte />

      </main>
      <Footer />
    </div>
  );
}

export default App;