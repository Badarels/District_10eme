<<<<<<< HEAD
# SIH Microservices - Système d'Information Hospitalier

Architecture microservices complète pour un Système d'Information Hospitalier.

## 📋 Structure des Microservices

### Services Infrastructure
- **service-registry** : Eureka Server pour la découverte de services
- **api-gateway** : Spring Cloud Gateway - Point d'entrée unique
- **config-service** : Configuration centralisée (optionnel)

### Services Métier
- **user-service** : Gestion des utilisateurs, rôles et authentification JWT
- **patient-service** : Gestion des patients
- **personnel-service** : Gestion du personnel médical (médecins, infirmiers, etc.)
- **rendezvous-service** : Gestion des rendez-vous
- **consultation-service** : Gestion des consultations, diagnostics et prescriptions
- **hospitalisation-service** : Gestion des hospitalisations, lits et chambres
- **reporting-service** : Statistiques et rapports
- **notification-service** : Envoi d'emails et SMS
=======
# SIH Frontend - Angular Application

Application frontend Angular pour le Système d'Information Hospitalier (SIH).
>>>>>>> 88f9775c6a5a9e595eaa9c044ed08e35c9e5cbd5

## 🚀 Démarrage

### Prérequis
<<<<<<< HEAD
- Java 17+
- Maven 3.8+
- PostgreSQL
- (Optionnel) Kafka pour les notifications asynchrones

### Ordre de démarrage recommandé

1. **service-registry** (port 8761)
   ```bash
   cd service-registry
   mvn spring-boot:run
   ```

2. **config-service** (port 8888) - si utilisé
   ```bash
   cd config-service
   mvn spring-boot:run
   ```

3. **user-service** (port 8081)
   ```bash
   cd user-service
   mvn spring-boot:run
   ```

4. **api-gateway** (port 8080)
   ```bash
   cd api-gateway
   mvn spring-boot:run
   ```

5. **Services métier** (ports 8082-8087)
   ```bash
   # Dans l'ordre souhaité
   cd patient-service && mvn spring-boot:run
   cd rendezvous-service && mvn spring-boot:run
   cd consultation-service && mvn spring-boot:run
   cd hospitalisation-service && mvn spring-boot:run
   cd reporting-service && mvn spring-boot:run
   cd notification-service && mvn spring-boot:run
   ```

## 🔗 Ports par Service

| Service | Port |
|---------|------|
| service-registry | 8761 |
| api-gateway | 8080 |
| config-service | 8888 |
| user-service | 8081 |
| patient-service | 8082 |
| personnel-service | 8088 |
| rendezvous-service | 8083 |
| consultation-service | 8084 |
| hospitalisation-service | 8085 |
| reporting-service | 8086 |
| notification-service | 8087 |

## 📡 API Gateway Routes

- `/api/users/**` → user-service
- `/api/patients/**` → patient-service
- `/api/personnel/**` → personnel-service
- `/api/specialites/**` → personnel-service
- `/api/rendezvous/**` → rendezvous-service
- `/api/consultations/**` → consultation-service
- `/api/hospitalisations/**` → hospitalisation-service
- `/api/reporting/**` → reporting-service
- `/api/notifications/**` → notification-service

## 🔐 Authentification

L'authentification se fait via JWT. Le token doit être inclus dans le header :
```
Authorization: Bearer <token>
```

## 🗄️ Base de données

Chaque service a sa propre base de données PostgreSQL. Les configurations sont dans les fichiers `application.yml` de chaque service.

## 📝 Notes

- Les services communiquent entre eux via REST
- Eureka permet la découverte automatique des services
- Le Gateway gère le routage et la sécurité

=======
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
>>>>>>> 88f9775c6a5a9e595eaa9c044ed08e35c9e5cbd5
