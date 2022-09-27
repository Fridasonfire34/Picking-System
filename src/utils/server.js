import * as dir from '../../server.json';

const server = () => {
  const host = 'http://' + dir.hostname + ':' + '3000';
  return host;
};

export {server};
