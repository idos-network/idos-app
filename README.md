## Development

This project uses [Netlify Functions](https://docs.netlify.com/functions/overview/) for serverless backend logic.

### Quick Start (Frontend Only)

From your terminal:

```sh
npm install
npm run dev
```

This starts your app in development mode using Vite, rebuilding assets on file changes. Access the app at:

http://localhost:8888

## Key Generation for idOS Issuer

To act as an idOS Issuer, you need to generate a signing and encryption key pair. This is required for the Netlify Function at `functions/idosprofile.ts`.

## Database Scripts

Runs pending migrations using the official Drizzle Kit migrate command with Netlify environment.

```sh
npm run db:migrate
```

Opens Drizzle Studio - a visual database browser for development.

```sh
npm run db:studio
```

Seeds the database with predefined quests. Safe to run multiple times - won't create duplicates.

```sh
npm run db:seed
```

Complete database setup - generates migrations, runs them, and seeds the database.

```sh
npm run db:setup
```

## Generating Keys

Run the provided script:

```sh
node scripts/generate-keys.ts
```

This will output four keys:

- `signingKeyPair.secretKey` (hex)
- `signingKeyPair.publicKey` (hex)
- `encryptionKeyPair.secretKey` (hex)
- `encryptionKeyPair.publicKey` (hex)

### What to do with the keys

- **Provide the `signingKeyPair.publicKey` (hex) to the idOS team** to be added as an authorized Issuer. This is your public identity as an issuer.
- **Keep all secret keys safe and never share them.**

### Environment Variables

Add the following to your environment (e.g., in your Netlify dashboard or `.env` file):

```
ISSUER_SIGNING_SECRET_KEY=<signingKeyPair.secretKey>
ISSUER_ENCRYPTION_SECRET_KEY=<encryptionKeyPair.secretKey>
KWIL_NODE_URL=<your-kwil-node-url>
```

- `ISSUER_SIGNING_SECRET_KEY`: The secret key (hex) from `signingKeyPair.secretKey`.
- `ISSUER_ENCRYPTION_SECRET_KEY`: The secret key (hex) from `encryptionKeyPair.secretKey`.
- `KWIL_NODE_URL`: The URL of the Kwil node to use (ask your admin or see project docs).

The Netlify Function will use these environment variables to initialize the issuer and perform secure operations.
