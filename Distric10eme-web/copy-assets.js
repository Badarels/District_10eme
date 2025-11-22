const fs = require('fs-extra');
const path = require('path');

const vendorFiles = [
  {
    from: 'node_modules/apexcharts/dist/apexcharts.min.js',
    to: 'src/assets/vendor/apexcharts/apexcharts.min.js'
  },
  {
    from: 'node_modules/chart.js/dist/chart.umd.js',
    to: 'src/assets/vendor/chart.js/chart.umd.js'
  },
  {
    from: 'node_modules/echarts/dist/echarts.min.js',
    to: 'src/assets/vendor/echarts/echarts.min.js'
  },
  {
    from: 'node_modules/quill/dist/quill.min.js',
    to: 'src/assets/vendor/quill/quill.min.js'
  },
  {
    from: 'node_modules/simple-datatables/dist/umd/simple-datatables.js',
    to: 'src/assets/vendor/simple-datatables/simple-datatables.js'
  },
  {
    from: 'node_modules/tinymce',
    to: 'src/assets/vendor/tinymce'
  }
];

async function copyFiles() {
  for (const file of vendorFiles) {
    try {
      await fs.copy(file.from, file.to);
      console.log(`Copied ${file.from} to ${file.to}`);
    } catch (err) {
      console.error(`Error copying ${file.from}:`, err);
    }
  }
}

copyFiles(); 