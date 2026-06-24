#!/bin/bash

# Чтение переменной из файла .env в корне монорепозитория
SCRIPT_DIR=$(realpath "$(dirname "$0")")
ROOT_DIR=$(realpath "$SCRIPT_DIR/../../..")
API_SCHEMA_URL=$(grep -w "API_SCHEMA_URL" "$ROOT_DIR/.env" | cut -d '=' -f2- | tr -d "'\"")

# Проверка, что переменная найдена
if [[ -z "$API_SCHEMA_URL" ]]; then
  echo "API_SCHEMA_URL not found in .env file!"
  exit 1
fi

# Вывод или использование переменной
echo "Read schema from: $API_SCHEMA_URL"

# Создание временного файла
TEMP_FILE=$(mktemp)

# Скачивание файла по URL
curl -o "$TEMP_FILE" "$API_SCHEMA_URL"

# Проверка успешности скачивания
if [ $? -eq 0 ]; then
  echo "File downloaded successfully to $TEMP_FILE."
else
  echo "Failed to download file."
  rm -f "$TEMP_FILE"
  exit 1
fi

# Выполнение swagger-typescript-api с указанием временного файла
pnpx swagger-typescript-api@13.0.16 -p "$TEMP_FILE" -o ./src/shared/generated -n api.ts \
    --extract-request-params \
    --extract-request-body \
    --extract-response-body \
    --extract-enums \
    --route-types \
    --axios \
    --module-name-first-tag \
    --single-http-client \
    --enum-names-as-values \
    --sort-routes \
    --sort-types

# Удаление временного файла после выполнения команды
rm -f "$TEMP_FILE"
