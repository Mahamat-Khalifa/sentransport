import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((somme, l) => somme + l.arrets, 0);
  const ligneMax    = lignes.reduce(
    (max, l) => l.arrets > max.arrets ? l : max,
    lignes[0]
  );

  return (
    <div className="stat-reseau">
      <h3 className="stat-titre">Statistiques du réseau</h3>
      <div className="stat-grille">
        <div className="stat-carte">
          <span className="stat-valeur">{totalLignes}</span>
          <span className="stat-label">Lignes actives</span>
        </div>
        <div className="stat-carte">
          <span className="stat-valeur">{totalArrets}</span>
          <span className="stat-label">Arrêts au total</span>
        </div>
        <div className="stat-carte">
          <span className="stat-valeur">Ligne {ligneMax.numero}</span>
          <span className="stat-label">
            Plus d'arrêts ({ligneMax.arrets})
          </span>
        </div>
      </div>
    </div>
  );
}

export default StatReseau;