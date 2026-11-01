# Guide d'Architecture & Documentation CI/CD
## Système d'Information Hospitalier (SIH) - District 10ème

Ce document décrit l'implémentation de la chaîne d'**Intégration Continue (CI)** et de **Déploiement Continu (CD)** mise en place pour le projet.

---

### 1. Vue d'Ensemble de l'Architecture DevOps

```
               [ Développeur ]
                      │ git push / pull request
                      ▼
            ┌───────────────────┐
            │   GitHub Actions  │
            └─────────┬─────────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 ┌──────────────┐            ┌──────────────┐
 │  Pipeline CI │            │  Pipeline CD │
 └──────┬───────┘            └──────┬───────┘
        │                           │
        ├─► Test Backend (Maven)    ├─► Package JARs
        ├─► Test/Build Front (ng)   ├─► Build Images Docker
                                    ├─► Push vers GHCR (ghcr.io)
                                    └─► Déploiement Docker Compose
```

---

### 2. Le Pipeline d'Intégration Continue (CI)
Fichier : `.github/workflows/ci.yml`

Le pipeline d'intégration continue valide chaque modification de code avant fusion :
- **Backend (Spring Boot)** :
  - Environnement d'exécution : `ubuntu-latest` avec OpenJDK 17 (Temurin).
  - Mise en cache intelligente des dépendances Maven (`~/.m2`).
  - Compilation multi-modules et exécution de la suite de tests unitaires et d'intégration (`mvn clean test`).
- **Frontend (Angular 19)** :
  - Environnement : Node.js 20 LTS avec cache npm.
  - Installation hermétique des dépendances (`npm ci`).
  - Compilation de production (`ng build --configuration production`) pour garantir l'absence d'erreurs TypeScript, de templates ou d'optimisation d'assets.

---

### 3. Le Pipeline de Déploiement Continu (CD)
Fichier : `.github/workflows/cd.yml`

Ce pipeline est déclenché automatiquement lors d'un `push` sur la branche `main` :
1. **Compilation des Artéfacts** : Génération des archives JAR exécutables pour les 10 microservices.
2. **Conteneurisation Parallèle** : Grâce à une matrice GitHub Actions (`matrix.service`), les 10 images microservices ainsi que l'image frontend Nginx sont construites simultanément en quelques minutes.
3. **Publication sur Registre Privé/Public (GHCR)** :
   - Registre : `ghcr.io/badarels/district_10eme/<service>`
   - Double étiquetage :
     - `latest` : Version la plus récente prête à être déployée.
     - `sha-<commit>` : Traçabilité immuable garantissant la reproductibilité exacte de chaque build.

---

### 4. Conteneurisation & Optimisations Docker

#### 🔹 Microservices Backend (`eclipse-temurin:17-jre-alpine`)
- **Taille minimale** : Utilisation d'un runtime JRE Alpine (~150 Mo contre >500 Mo pour un JDK complet).
- **Sécurité** : Absence d'outils de compilation dans l'image finale en production.
- **Démarrage rapide** : Ajout de `-Djava.security.egd=file:/dev/./urandom` pour accélérer l'initialisation cryptographique sous Linux.

#### 🔹 Frontend Angular (`Multi-Stage Build` + `Nginx Alpine`)
- **Stage 1 (Build)** : Node.js compile l'application en assets statiques (HTML, CSS, JS).
- **Stage 2 (Runtime)** : Nginx Alpine (~25 Mo) sert les fichiers avec :
  - Redirection SPA (`try_files $uri $uri/ /index.html;`) pour préserver les routes Angular sans erreurs 404.
  - Compression Gzip activée pour accélérer les temps de chargement.
  - En-têtes de cache HTTP pour les assets statiques.

---

### 5. Orchestration Locale & Production : `docker-compose.prod.yml`

Pour déployer l'intégralité de la plateforme sur une machine ou un serveur :

```bash
# Lancer tous les conteneurs (Base de données, Kafka, Microservices, Frontend)
docker compose -f docker-compose.prod.yml up -d --build

# Vérifier l'état de santé de tous les services
docker compose -f docker-compose.prod.yml ps

# Consulter les journaux en direct
docker compose -f docker-compose.prod.yml logs -f
```

#### Ports Exposés :
| Composant | Port Hôte | Description |
|-----------|-----------|-------------|
| **Frontend Web** | `80` | Interface utilisateur Angular |
| **API Gateway** | `8080` | Point d'entrée unique de l'API |
| **Service Registry** | `8761` | Tableau de bord Eureka Discovery |
| **PostgreSQL** | `5432` | Base de données relationnelle |
| **Kafka (KRaft)** | `9092` | Broker de messages événementiel |
