# SIH Frontend - Angular Application

Application frontend Angular pour le Système d'Information Hospitalier (SIH).

## 🚀 Démarrage

### Prérequis
- Node.js 18+ et npm
- Angular CLI 19+

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:4200`

## 📁 Structure du Projet

```
src/app/
├── core/                    # Services et modèles partagés
│   ├── models/             # Modèles TypeScript
│   ├── services/          # Services Angular (API)
│   ├── guards/            # Guards d'authentification
│   └── interceptors/      # Intercepteurs HTTP
├── shared/                 # Composants et modules partagés
├── layouts/                # Layouts (header, sidebar, footer)
│   ├── header/
│   ├── sidebar/
│   └── footer/
├── features/              # Modules fonctionnels
│   ├── patients/         # Module patients
│   ├── rendezvous/       # Module rendez-vous
│   ├── consultations/    # Module consultations
│   ├── hospitalisations/ # Module hospitalisations
│   └── dashboard/        # Tableau de bord
└── authentification/      # Module d'authentification
```

## 🔗 Configuration API

L'URL de l'API est configurée dans `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // API Gateway
  showMocks: false
};
```

## 📦 Modules Principaux

### Patients
- Liste des patients
- Ajout/Modification de patient
- Détails du patient

### Rendez-vous
- Gestion des rendez-vous
- Planning
- Statuts (Planifié, Confirmé, Annulé, etc.)

### Consultations
- Création de consultations
- Diagnostics
- Prescriptions

### Hospitalisations
- Admissions
- Gestion des lits
- Sorties

## 🔐 Authentification

L'authentification utilise JWT. Le token est stocké dans le localStorage et ajouté automatiquement aux requêtes HTTP via l'intercepteur.

## 🛠️ Développement

### Créer un nouveau module

```bash
ng generate module features/nom-module
ng generate component features/nom-module/liste
```

### Services disponibles

- `AuthService` : Authentification
- `PatientService` : Gestion des patients
- `RendezVousService` : Gestion des rendez-vous
- `ConsultationService` : Gestion des consultations
- `HospitalisationService` : Gestion des hospitalisations
- `UserService` : Gestion des utilisateurs

## 📝 Notes

- Les services Angular communiquent avec l'API Gateway (port 8080)
- Le Gateway redirige vers les microservices appropriés
- L'authentification est gérée par le `user-service`
