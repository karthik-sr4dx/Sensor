const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'NestJS Application', // Name of the service
  description: 'NestJS application running as a Windows service.', // Description that appears in services.msc
  script: path.join(__dirname, 'dist/main.js'), // Path to your NestJS application's entry point
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the service was installed
svc.on('install', function () {
  console.log('Service installed');
  svc.start();
});

// Listen for the "uninstall" event to confirm the service is removed
svc.on('uninstall', function () {
  console.log('Service uninstalled');
});

// To install the service, run this script with `node service.js install`
if (process.argv[2] === 'install') {
  svc.install();
}

// To uninstall the service, run this script with `node service.js uninstall`
if (process.argv[2] === 'uninstall') {
  svc.uninstall();
}
