const fs = require('fs-extra');
const path = require('path');

async function copyFiles() {
  try {
    // Nettoyer le dossier vendor
    await fs.remove('src/assets/vendor');
    console.log('Dossier vendor nettoyé');

    // Créer le dossier vendor
    await fs.ensureDir('src/assets/vendor');
    console.log('Dossier vendor créé');

    // Copier les fichiers de node_modules vers vendor
    const filesToCopy = [
      { from: 'node_modules/datatables.net-dt/css', to: 'src/assets/vendor/datatables/css' },
      { from: 'node_modules/datatables.net/js', to: 'src/assets/vendor/datatables/js' },
      { from: 'node_modules/chart.js/dist', to: 'src/assets/vendor/chart.js' },
      { from: 'node_modules/apexcharts/dist', to: 'src/assets/vendor/apexcharts' },
      { from: 'node_modules/echarts/dist', to: 'src/assets/vendor/echarts' },
      { from: 'node_modules/simple-datatables/dist', to: 'src/assets/vendor/simple-datatables' },
      { from: 'node_modules/quill/dist', to: 'src/assets/vendor/quill' },
      { from: 'node_modules/bootstrap-icons/font', to: 'src/assets/vendor/bootstrap-icons' },
      { from: 'node_modules/boxicons/css', to: 'src/assets/vendor/boxicons/css' },
      { from: 'node_modules/boxicons/fonts', to: 'src/assets/vendor/boxicons/fonts' }
    ];

    for (const file of filesToCopy) {
      await fs.copy(file.from, file.to);
      console.log(`Copié ${file.from} vers ${file.to}`);
    }

    // Créer le dossier js et plugins-init s'ils n'existent pas
    await fs.ensureDir('src/assets/js/plugins-init');
    console.log('Dossiers js et plugins-init créés');

    // Créer datatables.init.js s'il n'existe pas
    const dataTablesInitPath = 'src/assets/js/plugins-init/datatables.init.js';
    if (!fs.existsSync(dataTablesInitPath)) {
      const dataTablesInitContent = `
$(document).ready(function() {
    $('.datatable').DataTable({
        responsive: true,
        language: {
            search: "Rechercher:",
            lengthMenu: "Afficher _MENU_ éléments",
            info: "Affichage de _START_ à _END_ sur _TOTAL_ éléments",
            infoEmpty: "Aucun élément à afficher",
            infoFiltered: "(filtré de _MAX_ éléments au total)",
            paginate: {
                first: "Premier",
                previous: "Précédent",
                next: "Suivant",
                last: "Dernier"
            }
        }
    });
});
      `;
      await fs.writeFile(dataTablesInitPath, dataTablesInitContent);
      console.log('Fichier datatables.init.js créé');
    }

  } catch (err) {
    console.error('Erreur:', err);
  }
}

copyFiles(); 