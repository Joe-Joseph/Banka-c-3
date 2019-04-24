import devKeys from './devkeys';
import testKeys from './testKeys';
import prodKeys from './prodKeys';


if (process.env.NODE_ENV === 'TEST') {
  module.exports = testKeys;
} else {
  module.exports = devKeys;
}

if (process.env.NODE_ENV === 'production') {
  module.exports = prodKeys;
}

console.log(process.env.NODE_ENV);
