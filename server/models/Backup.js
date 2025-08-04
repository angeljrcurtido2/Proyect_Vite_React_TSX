// models/Backup.js
import mysqldump from 'mysqldump';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';

export const Backup = {
  createDump: async () => {

    const fileName = `backup-${dayjs().format('YYYYMMDD-HHmmss')}.sql`;
    const dumpPath = path.join(process.cwd(), 'backups', fileName);

    // garantiza que la carpeta exista
    fs.mkdirSync(path.dirname(dumpPath), { recursive: true });

    await mysqldump({
      connection: {
         host: 'localhost',
        user: 'root',       
        password: '',       
        database: 'testrespaldo1'
      },
      dumpToFile: dumpPath,
    });

    return dumpPath; 
  }
};
