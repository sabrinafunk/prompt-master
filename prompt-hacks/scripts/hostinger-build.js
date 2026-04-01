const fs = require('fs');
const path = require('path');

// Esse script é vital para rodar Next.js na Hostinger.
// O "standalone" do Next.js não copia a pasta public nem a pasta estática (.next/static).
// Sem isso, seu app sobe mas sem CSS e sem imagens (Error 404).

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('📦 DevOps: Preparando build standalone para a Hostinger...');
  
  // Caminhos
  const publicDir = path.join(__dirname, '..', 'public');
  const standalonePublicDir = path.join(__dirname, '..', '.next', 'standalone', 'public');
  
  const staticDir = path.join(__dirname, '..', '.next', 'static');
  const standaloneStaticDir = path.join(__dirname, '..', '.next', 'standalone', '.next', 'static');

  if (!fs.existsSync(path.join(__dirname, '..', '.next', 'standalone'))) {
    console.error('❌ Diretório standalone não encontrado. Rode "next build" primeiro.');
    process.exit(1);
  }

  // Copia public
  console.log('-> Copiando pasta public');
  copyDir(publicDir, standalonePublicDir);

  // Copia .next/static
  console.log('-> Copiando .next/static');
  copyDir(staticDir, standaloneStaticDir);

  console.log('✅ Tudo Pronto! Build para a Hostinger concluída com sucesso.');

} catch (error) {
  console.error('❌ Erro no script DevOps Hostinger:', error);
  process.exit(1);
}
