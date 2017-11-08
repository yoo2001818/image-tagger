import { walk } from 'walk';
import path from 'path';
import { knex } from '../../db';
import config from '../../../config';

export default function scan() {
  return new Promise((resolve, reject) => {
    let sliceSize = path.resolve(config.directory).length;
    let walker = walk(config.directory, { followLinks: true });
    let queue = [];
    let appendCount = 0;
    let processCount = 0;
    async function processQueue() {
      // Extract file path
      let paths = queue.map(({ root, stat }) =>
        path.resolve(root, stat.name).slice(sliceSize + 1));
      // Ask the database if the file exists
      let existings = (await knex.select('path').from('images')
        .whereIn('path', paths)).map(v => v.path);
      // Sort two arrays then find paths that doesn't exist in the database
      paths.sort();
      existings.sort();
      let appends = [];
      let existingId = 0;
      for (let i = 0; i < paths.length; ++i) {
        if (paths[i] !== existings[existingId]) {
          appends.push(paths[i]);
        } else {
          existingId++;
        }
      }
      processCount += paths.length;
      appendCount += appends.length;
      if (appends.length > 0) {
        // Insert to the database
        await knex.from('images').insert(appends.map(path => ({
          path,
          randomId: Math.random() * 0x7FFFFFFF | 0,
          isProcessed: false,
          isIgnored: false,
          createdAt: new Date(),
        })));
      }
      console.log('Processed: ' + processCount + ' Added: ' + appendCount);
      // Empty the queue
      queue = [];
    }
    walker.on('file', (root, stat, next) => {
      queue.push({ root, stat });
      if (queue.length > 100) {
        processQueue().then(() => next(), err => next(err));
      } else {
        next();
      }
    });
    walker.on('errors', (root, stats, next) => {
      stats.forEach(stat => {
        console.log(stat.error);
      });
      next();
    });
    walker.on('end', () => {
      processQueue().then(() => resolve(appendCount), err => reject(err));
    });
  });
}
