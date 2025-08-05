export class QuestNotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = 'QUEST_NOT_FOUND';

  constructor(questName: string) {
    super(`Quest '${questName}' not found`);
    this.name = 'QuestNotFoundError';
  }
}

export class QuestNotRepeatableError extends Error {
  readonly statusCode = 409;
  readonly code = 'QUEST_NOT_REPEATABLE';

  constructor(questName: string) {
    super(`Quest '${questName}' is not repeatable and already completed`);
    this.name = 'QuestNotRepeatableError';
  }
}

export class ValidationError extends Error {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string = 'Invalid request data') {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UserNotFoundError extends Error {
  readonly statusCode = 404;
  readonly code = 'USER_NOT_FOUND';

  constructor(userId: string) {
    super(`User '${userId}' not found`);
    this.name = 'UserNotFoundError';
  }
}

export class DatabaseError extends Error {
  readonly statusCode = 500;
  readonly code = 'DATABASE_ERROR';

  constructor(message: string = 'Database operation failed') {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class InternalServerError extends Error {
  readonly statusCode = 500;
  readonly code = 'INTERNAL_SERVER_ERROR';

  constructor(message: string = 'Internal server error') {
    super(message);
    this.name = 'InternalServerError';
  }
}
