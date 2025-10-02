## Development

This project uses Netlify Functions for serverless backend logic.

### Quick Start (Frontend Only)

From your terminal:

```sh
npm install
npm run dev
```

This starts your app in development mode using Vite, rebuilding assets on file changes. Access the app at:

http://localhost:8888

## Database Scripts

Complete database setup - generates migrations and runs them.

```sh
npm run db:setup
```

Opens Drizzle Studio - a visual database browser for development.

```sh
npm run db:studio
```

## Key Generation for idOS Issuer

To act as an idOS Issuer, you need to generate a signing and encryption key pair. This is required for the Netlify Function at `functions/idosprofile.ts`.

### Generating Keys

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

Add the following to your environment:

```
ISSUER_SIGNING_SECRET_KEYS=<signingKeyPair.secretKey>
ISSUER_ENCRYPTION_SECRET_KEY=<encryptionKeyPair.secretKey>
```

- `ISSUER_SIGNING_SECRET_KEYS`: The secret keys (hex) from `signingKeyPair.secretKey`. (Can be multiple once separated by comma)
- `ISSUER_ENCRYPTION_SECRET_KEY`: The secret key (hex) from `encryptionKeyPair.secretKey`.
