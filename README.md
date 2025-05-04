# Сервис управления балансом пользователя

Этот проект представляет собой RESTful API для управления балансом пользователя, реализованный с использованием архитектуры CQRS (Command Query Responsibility Segregation) и Event Sourcing (Optimistic Locking).

## Возможности

- Получение текущего баланса пользователя
- Списание средств с баланса пользователя
- Хранение полной истории изменений баланса
- Возможность восстановления состояния из истории событий

## Технологии

- NestJS
- TypeScript
- PostgreSQL
- Event Sourcing и CQRS паттерны
- TypeORM

## Установка и запуск

### Предварительные требования

- Node.js (v16+)
- PostgreSQL (v13+)

### Установка зависимостей

```bash
npm install
```

### Настройка базы данных

1. Создайте базу данных в PostgreSQL:

```bash
createdb balance_db
```

2. Создайте файл `.env` в корне проекта:

```
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=balance_db
```

3. Запустите миграции:

```bash
npm run migration:run
```

### Запуск приложения

```bash
# Режим разработки
npm run start:dev

# Режим продакшн
npm run build
npm run start:prod
```

## Архитектура

Проект реализован с использованием архитектуры CQRS и Event Sourcing:

### Command Side (Write Model)
- Команды (Commands) - представляют намерение изменить состояние
- Обработчики команд (Command Handlers) - валидируют и обрабатывают команды
- Агрегаты (Aggregates) - бизнес-логика и правила
- События (Events) - записи о произошедших изменениях

### Query Side (Read Model)
- Проекции (Projections) - оптимизированные для чтения представления данных
- Обработчики событий (Event Handlers) - обновляют проекции на основе событий

### Event Store
- Хранилище событий - сохраняет все события и обеспечивает возможность их воспроизведения
- Логика в текущем ES строится на оптимистик конкуренси
