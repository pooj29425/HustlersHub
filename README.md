# HustlersHub

A decentralized marketplace for human micro-tasks with Worldcoin integration for bot-proof identity verification.

## 🚀 Features

- **World ID Verification**: Secure human verification using Worldcoin's biometric identity system
- **Wallet Authentication**: SIWE (Sign-In with Ethereum) integration via Worldcoin MiniKit
- **Task Marketplace**: Create and complete micro-tasks with USDC rewards
- **Dual User Roles**: Switch between Worker (task taker) and Client (task creator) modes
- **Modern UI**: Beautiful, responsive design with dark/light theme support
- **Real-time Updates**: Dynamic task slots and submission management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Authentication**: Worldcoin MiniKit for Web3 identity
- **UI Components**: Radix UI primitives with custom design system
- **Analytics**: Vercel Analytics

## 📋 Prerequisites

1. **World App**: Download the [World App](https://worldcoin.org/download) on your mobile device
2. **Worldcoin Developer Account**: Create an account at [developer.worldcoin.org](https://developer.worldcoin.org/)
3. **Node.js**: Version 18 or higher
4. **Package Manager**: pnpm (recommended), npm, or yarn

## ⚙️ Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/pooj29425/HustleHub.git
cd HustleHub
pnpm install
```

### 2. Configure Worldcoin App

1. Go to [Worldcoin Developer Portal](https://developer.worldcoin.org/)
2. Create a new app
3. Set up an **Incognito Action**:
   - Action ID: `hustlershub-verification`
   - Name: `HustlersHub Verification`
   - Description: `Verify human identity for HustlersHub marketplace`
4. Note your **App ID** (format: `app_staging_xxxxx` or `app_xxxxx`)

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Worldcoin App Configuration
APP_ID=your_app_id_here

# Example:
# APP_ID=app_staging_12345abcdef67890
```

### 4. Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📱 Usage

### For Full Functionality (Recommended)

1. **Open in World App**:

   - Scan the QR code displayed at `localhost:3000` with World App
   - Or visit the deployed URL directly in World App

2. **Connect Wallet**:

   - Tap "Connect Wallet" to initiate SIWE authentication
   - Sign the message in World App to prove wallet ownership

3. **Verify World ID**:
   - Tap "Verify with World ID" to complete biometric verification
   - Follow the prompts in World App to scan your iris/face

### For Testing (Limited Functionality)

- Open `localhost:3000` in any browser
- The app will show warnings but still allow UI exploration
- Real authentication requires World App

### Using the Marketplace

**As a Worker:**

- Browse available tasks with USDC rewards
- Claim tasks and submit proof of work
- View task completion slots

**As a Client:**

- Toggle to Client mode using the header switch
- Review submitted work and approve/reject
- Create new tasks with reward amounts and worker limits

## 🏗️ Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── nonce/             # SIWE nonce generation
│   │   ├── complete-siwe/     # Wallet auth verification
│   │   └── verify/            # World ID proof verification
│   ├── globals.css            # Global styles and design tokens
│   ├── layout.tsx             # Root layout with providers
│   └── page.tsx               # Main application logic
├── components/
│   ├── hustlers/              # App-specific components
│   │   ├── header.tsx         # Navigation header
│   │   ├── task-card.tsx      # Individual task display
│   │   ├── submission-card.tsx # Work submission review
│   │   └── Minikit-Provider.tsx # Worldcoin MiniKit wrapper
│   └── ui/                    # shadcn/ui component library
├── hooks/
│   ├── use-worldcoin-auth.ts  # Worldcoin authentication logic
│   ├── use-mobile.ts          # Mobile breakpoint detection
│   └── use-toast.ts           # Toast notification system
├── lib/
│   └── utils.ts               # Utility functions
└── public/                    # Static assets
```

## 🔒 Security Features

- **Backend Verification**: All proofs verified server-side
- **Secure Nonces**: SIWE nonces generated and validated on backend
- **Biometric Identity**: World ID ensures one-person-one-account
- **Signature Verification**: SIWE messages cryptographically verified

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `APP_ID`: Your Worldcoin App ID
3. Deploy automatically on git push

### Other Platforms

Ensure the deployment platform supports:

- Node.js 18+
- Environment variables
- API routes (serverless functions)

## 🔧 Development

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Building for Production

```bash
pnpm build
```

## 🎨 Design System

The app uses a custom design system with:

- **CSS Variables**: Dynamic theming support
- **Color Palette**: Carefully crafted light/dark modes
- **Component Variants**: Consistent styling with class-variance-authority
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA attributes and keyboard navigation

## 🔗 API Routes

### `POST /api/nonce`

Generates secure nonce for SIWE authentication

### `POST /api/complete-siwe`

Verifies SIWE signature and completes wallet authentication

### `POST /api/verify`

Verifies World ID proof using Worldcoin's cloud verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Worldcoin Docs](https://docs.world.org/mini-apps)
- **Discord**: [Worldcoin Community](https://world.org/discord)
- **Issues**: [GitHub Issues](https://github.com/pooj29425/HustleHub/issues)

## 🚧 Roadmap

- [ ] Real USDC payments integration
- [ ] Task categories and filtering
- [ ] User reputation system
- [ ] Dispute resolution mechanism
- [ ] Mobile app version
- [ ] Multi-language support

---

Built with ❤️ using [Worldcoin MiniKit](https://docs.world.org/mini-apps)
