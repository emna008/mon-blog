import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { loginSuccess } from '../redux/authSlice';

export default function AuthCard() {
  // Défi 2 : false = mode Connexion, true = mode Inscription
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // ==========================================================================
  // ÉTAPE 4 (Page 4 du support PDF) + Défi 2 : Connexion OU Inscription
  // ==========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      setLoading(true);
      let response;
      if (isRegister) {
        // Défi 2 : Créer un compte puis récupérer directement son Token JWT
        response = await axiosClient.post('/auth/register', { name, email, password });
      } else {
        // 1. Envoyer email + mot de passe au serveur Express
        response = await axiosClient.post('/auth/login', { email, password });
      }

      // 2. Ranger l'utilisateur et son Token JWT dans Redux + localStorage
      dispatch(loginSuccess(response.data));
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Erreur de connexion au serveur Express.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMsg('');
  };

  const fillDemoAccount = () => {
    setIsRegister(false);
    setEmail('gueddes@poly.tn');
    setPassword('123456');
    setErrorMsg('');
  };

  return (
    <section className="form-card auth-card">
      <div className="form-header">
        <span className="lock-pill">Espace Membre Securise (JWT)</span>
        <h3>{isRegister ? 'Creer un Compte Auteur' : 'Connexion Requise pour Publier'}</h3>
        <p>
          {isRegister
            ? 'Inscrivez-vous pour obtenir immediatement votre Token JWT.'
            : "Connectez-vous pour obtenir votre Token JWT et debloquer l'ajout/suppression."}
        </p>
      </div>

      {errorMsg && <div className="feedback-alert error">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="article-form">
        {isRegister && (
          <div className="form-group">
            <label htmlFor="name">Nom Complet :</label>
            <input
              id="name"
              type="text"
              placeholder="Ex : Emna Ben Salah"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Adresse Email :</label>
          <input
            id="email"
            type="email"
            placeholder="gueddes@poly.tn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de Passe :</label>
          <input
            id="password"
            type="password"
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading
            ? 'Verification...'
            : isRegister
              ? "S'inscrire (Obtenir Token JWT)"
              : 'Se Connecter (Obtenir Token JWT)'}
        </button>

        <button type="button" className="btn-demo" onClick={toggleMode}>
          {isRegister ? 'Deja un compte ? Se connecter' : 'Pas de compte ? Creer un compte'}
        </button>

        {!isRegister && (
          <button type="button" className="btn-demo" onClick={fillDemoAccount}>
            Remplir Compte Demo (gueddes@poly.tn / 123456)
          </button>
        )}
      </form>
    </section>
  );
}
