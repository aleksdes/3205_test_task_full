import path from 'path';

/** Порт, хост и каталог с JSON-файлами процессов (переменные окружения BACKEND_PORT, BACKEND_HOST, BACKEND_DATA_DIR). */
export const config = {
  port: Number(process.env.BACKEND_PORT) || 3000,
  host: process.env.BACKEND_HOST || '0.0.0.0',
  dataDir: process.env.BACKEND_DATA_DIR
    ? path.resolve(process.env.BACKEND_DATA_DIR)
    : path.resolve(__dirname, '..', 'data'),
};

/** Полный путь к файлу `<name>.json` в каталоге данных. */
export const localBDfile = (name = 'bd'): string => path.join(config.dataDir, `${name}.json`);
