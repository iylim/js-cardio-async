/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const fs = require('fs').promises;
/*
All of your functions must return a promise!
*/

/* 
Every function should be logged with a timestamp.
If the function logs data, then put that data into the log
ex after running get('user.json', 'email'):
  sroberts@talentpath.com 1563221866619

If the function just completes an operation, then mention that
ex after running delete('user.json'):
  user.json succesfully delete 1563221866619

Errors should also be logged (preferably in a human-readable format)
*/
/**
 * Log values to log.txt
 * @param {String} value
 * returns append file 
 */
function log(value) {
  return fs.appendFile('log.txt', `${value} ${Date.now()}\n`);
}

/**
 * Logs the value of object[key]
 * @param {string} file
 * @param {string} key
 */
// function get(file, key) {
//   // read file
//   return fs.readFile(file, 'utf-8')
//   // handle promise
//     .then(data => {
//       // parse data from string to json 
//       const parsed = JSON.parse(data);
//       // use key to get value at object[key]
//       const value = parsed[key];
//       if (!value) return log(`ERROR ${key} invalid key on ${file}`);
//       // append file with data 
//       return log(value);
//     })
//     .catch(err => log(`ERROR no such file or directory ${file}`));
// }

async function get(file, key) {
  const data = await fs.readFile(file, 'utf-8');
  const parsed = JSON.parse(data);
  const value = parsed[key];
  if (!value) return log(`ERROR ${key} invalid key on ${file}`);
  return log(value);
}

/**
 * Sets the value of object[key] and rewrites object to file
 * @param {string} file
 * @param {string} key
 * @param {string} value
 */
function set(file, key, value) {
  return fs.readFile(file, 'utf-8').then(data => {
    const parsed = JSON.parse(data);
    parsed[key] = value;
    const string = JSON.stringify(parsed);
    return fs.writeFile(file, string);
  })
    .catch(err => log(`ERROR ${err}`));
}

/**
 * Deletes key from object and rewrites object to file
 * @param {string} file
 * @param {string} key
 */
function remove(file, key) {
  return fs.readFile(file, 'utf-8')
    .then(data => {
      const parsed = JSON.parse(data);
      delete parsed[key];
      return fs.writeFile(file, JSON.stringify(parsed));
    })
    .catch(err => log(`ERROR ${err}`));
}

/**
 * Deletes file.
 * Gracefully errors if the file does not exist.
 * @param {string} file
 */
function deleteFile(file) {
  return fs.unlink(file, 'utf-8')
    .then(() => log(`${file} deleted!`))
    .catch(err => log(`ERROR ${err}`));
}

/**
 * Creates file with an empty object inside.
 * Gracefully errors if the file already exists.
 * @param {string} file JSON filename
 */
function createFile(file) {
  return fs.writeFile(file)
    .then(() => log(`${file} created!`))
    .catch(err => log(`ERROR ${err}`));
}

/**
 * Merges all data into a mega object and logs it.
 * Each object key should be the filename (without the .json) and the value should be the contents
 * ex:
 *  {
 *  user: {
 *      "firstname": "Scott",
 *      "lastname": "Roberts",
 *      "email": "sroberts@talentpath.com",
 *      "username": "scoot"
 *    },
 *  post: {
 *      "title": "Async/Await lesson",
 *      "description": "How to write asynchronous JavaScript",
 *      "date": "July 15, 2019"
 *    }
 * }
 */
async function mergeData() {
  try {
    const object = {};
    const directory = await fs.readdir('./');
    const filtered = directory.filter(file => file.includes('.json') && !file.includes('package'));
    for (let i = 0; i < filtered.length; ++i) {
      const fileData = await fs.readFile(filtered[i], 'utf-8');
      const parsed = JSON.parse(fileData);
      const fileName = filtered[i].slice(0, filtered[i].indexOf('.'));
      object[fileName] = parsed;
    }
    return fs.appendFile('log.txt', JSON.stringify(object));
  } catch (err) {
    log(`ERROR ${err}`);
  }
}

/**
 * Takes two files and logs all the properties as a list without duplicates
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *  union('scott.json', 'andrew.json')
 *  // ['firstname', 'lastname', 'email', 'username']
 */
async function union(fileA, fileB) {
  try {
    const array = [];
    const first = await fs.readFile(fileA, 'utf-8');
    const parsedA = JSON.parse(first);
    const second = await fs.readFile(fileB, 'utf-8');
    const parsedB = JSON.parse(second);
    for (const key in parsedA) {
      array.push(key);
    }
    for (const key2 in parsedB) {
      if (!array.includes(key2)) array.push(key2);
    }
    return fs.appendFile('log.txt', JSON.stringify(array));
  } catch (err) {
    log(`ERROR ${err}`);
  }
}

/**
 * Takes two files and logs all the properties that both objects share
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    intersect('scott.json', 'andrew.json')
 *    // ['firstname', 'lastname', 'email']
 */
async function intersect(fileA, fileB) {
  try {
    const array = [];
    const first = await fs.readFile(fileA, 'utf-8');
    const parsedA = JSON.parse(first);
    const second = await fs.readFile(fileB, 'utf-8');
    const parsedB = JSON.parse(second);
    for (const key in parsedA) {
      for (const key2 in parsedB) {
        if (key === key2) {
          array.push(key);
        }
      }
    }
    return fs.appendFile('log.txt', JSON.stringify(array));
  } catch (err) {
    log(`ERROR ${err}`);
  }
}

/**
 * Takes two files and logs all properties that are different between the two objects
 * @param {string} fileA
 * @param {string} fileB
 * @example
 *    difference('scott.json', 'andrew.json')
 *    // ['username']
 */
async function difference(fileA, fileB) {
  try {
    const array = [];
    const first = await fs.readFile(fileA, 'utf-8');
    const parsedA = JSON.parse(first);
    const second = await fs.readFile(fileB, 'utf-8');
    const parsedB = JSON.parse(second);
    for (const key in parsedA) {
      if (!parsedB[key]) {
        array.push(key);
      }
    }
    for (const key2 in parsedB) {
      if (!parsedA[key2]) {
        array.push(key2);
      }
    }
    return fs.appendFile('log.txt', JSON.stringify(array));
  } catch (err) {
    log(`ERROR ${err}`);
  }
}

module.exports = {
  get,
  set,
  remove,
  deleteFile,
  createFile,
  mergeData,
  union,
  intersect,
  difference,
};
