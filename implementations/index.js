import fs from 'fs';

const implementationsFile = './implementations/implementations.json';

/**
 * implementationsWithFeatures returns a list of implementations that have features
 * @return {*}
 */
export function implementationsWithFeatures() {
  const implementations = JSON.parse(fs.readFileSync(implementationsFile, 'utf8'));
  return implementations.filter((impl) => impl.features && Object.keys(impl.features).length > 0);
}

/**
 * getImplementationFeatures returns the features for a given implementation
 * @param {string} implName
 * @return {{inspector: boolean, debug: boolean, uv: boolean, ipv6: boolean, tls_alpn: boolean, tls_sni: boolean, tls_ocsp: boolean, tls: boolean}|{}}
 */
export function getImplementationFeatures(implName) {
  const implementations = JSON.parse(fs.readFileSync(implementationsFile, 'utf8'));
  const impl = implementations.find((i) => i.name === implName);
  return impl ? impl.features : {};
}
