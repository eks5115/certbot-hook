#!/usr/bin/env node

let env = {"access-key-id": "id", "access-key-secret": "secret"};
try {
  env = require('./.env.json');
} catch (e) {

}

let argv = require('yargs')
  .option('access-key-id', {
    demand: true,
    default: env["access-key-id"],
    describe: 'accessKeyId',
    type: 'string'
  })
  .option('access-key-secret', {
    demand: true,
    default: env["access-key-secret"],
    describe: 'accessKeySecret',
    type: 'string'
  }).argv;

let certbotDomain = process.env['CERTBOT_DOMAIN'];
let certbotValidation = process.env['CERTBOT_VALIDATION']

if (typeof certbotDomain === 'undefined' || typeof certbotValidation === 'undefined') {
  console.error('CERTBOT_DOMAIN or CERTBOT_VALIDATIO is undefined')
  process.exit(1)
}

let Aliyun = require('./src/aliyun');
let Domain = require('./src/domain');

let aliyun = new Aliyun();
aliyun.init(argv.accessKeyId, argv.accessKeySecret);

let domain = new Domain(certbotDomain);
let domainName = domain.getSecondAndRootDomain();
let rr = domain.getAcmeRR();

aliyun.addDomainRecord(domainName, rr,  'txt', certbotValidation, function (resultList) {
  console.log(resultList);
});
