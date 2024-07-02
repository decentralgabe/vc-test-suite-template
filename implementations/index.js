import fs from 'fs';

const implementationsFile = './implementations/implementations.json';

/**
 * Get implementations with features.
 * @return {*|(*&{name: *})[]|*[]}
 */
export function implementationsWithFeatures() {
  console.log('Reading implementations file:', implementationsFile);
  let implementationsData;
  try {
    const fileContent = fs.readFileSync(implementationsFile, 'utf8');
    console.log('File content:', fileContent);
    implementationsData = JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading or parsing implementations file:', error);
    return [];
  }

  console.log('Parsed implementations data:', JSON.stringify(implementationsData, null, 2));

  if (typeof implementationsData === 'object' && !Array.isArray(implementationsData)) {
    const result = Object.entries(implementationsData)
        .map(([name, impl]) => ({name, ...impl}))
        .filter((impl) => impl.features && Object.keys(impl.features).length > 0);
    console.log('Filtered implementations:', JSON.stringify(result, null, 2));
    return result;
  }

  if (Array.isArray(implementationsData)) {
    const result = implementationsData.filter((impl) => impl.features && Object.keys(impl.features).length > 0);
    console.log('Filtered implementations:', JSON.stringify(result, null, 2));
    return result;
  }

  console.error('Invalid implementations data structure');
  return [];
}

/**
 * Get implementation features.
 * @param {string} implName
 * @return {{inspector: boolean, debug: boolean, uv: boolean, ipv6: boolean, tls_alpn: boolean, tls_sni: boolean, tls_ocsp: boolean, tls: boolean}|{}}
 */
export function getImplementationFeatures(implName) {
  console.log('Getting features for implementation:', implName);
  const implementationsData = JSON.parse(fs.readFileSync(implementationsFile, 'utf8'));

  let features;
  if (typeof implementationsData === 'object' && !Array.isArray(implementationsData)) {
    features = implementationsData[implName]?.features;
  } else if (Array.isArray(implementationsData)) {
    const impl = implementationsData.find((i) => i.name === implName);
    features = impl?.features;
  }

  console.log('Features found:', JSON.stringify(features, null, 2));
  return features || {};
}
