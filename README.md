# AuthBurst

AuthBurst is an online authenticator application. It is a simple and secure way to manage your 2FA Tokens. AuthBurst is built with Next.js and Supabase.

### Features
- Add and delete 2FA tokens
- Syncs across devices
- Supports multiple accounts
- Supports multiple devices
- Securely stores your 2FA tokens
- Open source
- No ads

### Self Hosting (npm)
- Clone the repository
  ```bash
  git clone https://github.com/dhairyathedev/authburst.git
  ```
- Install dependencies
  ```bash
  npm install
  ```
- Update the environment variables in `.env.local`
  ```bash
  NEXT_PUBLIC_SUPABASE_URL= # Supabase URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase Anon Key
  ```
- Run the development server
  ```bash
    npm run dev
    ```
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.