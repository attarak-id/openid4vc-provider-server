export default () => ({
  environment: process.env.ENV,
  organization: process.env.ORG,
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  protocol: process.env.PROTOCOL,
  privatekey: process.env.PRIVATE_KEY,
  /** @TODO add other env */
});
