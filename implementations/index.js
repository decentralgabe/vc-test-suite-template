import fs from 'fs';

const implementationsFile = './implementations/implementations.json';

/**
 * Get implementations with features.
 * @return {*|(*&{name: *})[]|*[]}
 */
export function implementationsWithFeatures() {
  let implementationsData;
  try {
    const fileContent = fs.readFileSync(implementationsFile, 'utf8');
    implementationsData = JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading or parsing implementations file:', error);
    return [];
  }

  return Object.entries(implementationsData)
      .map(([name, impl]) => ({name, ...impl}))
      .filter((impl) => impl.features && Object.keys(impl.features).length > 0);
}

/**
 * Get implementation features.
 * @param {string} implName
 * @return {{inspector: boolean, debug: boolean, uv: boolean, ipv6: boolean, tls_alpn: boolean, tls_sni: boolean, tls_ocsp: boolean, tls: boolean}|{}}
 */
export function getImplementationFeatures(implName) {
  const implementationsData = JSON.parse(fs.readFileSync(implementationsFile, 'utf8'));
  return implementationsData[implName]?.features;
}
