import tls from 'tls';

export function getSSLCertificateInfo(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      443,
      hostname,
      {
        servername: hostname,
      },
      () => {
        const cert = socket.getPeerCertificate();

        resolve({
          issuer: cert.issuer?.O || 'Unknown',
          validFrom: cert.valid_from,
          validTo: cert.valid_to,
          serialNumber: cert.serialNumber,
        });

        socket.end();
      },
    );

    socket.on('error', reject);
  });
}
