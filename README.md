# BITBLE

**BITBLE** is a web platform built using Vue.js and Firebase, designed to provide real-time notifications and information about cryptocurrency airdrops on Bithumb. Additionally, it integrates Bithumb's API to facilitate trading operations seamlessly. The platform ensures security as Bithumb API keys and secrets are only used on the 🖥️ client-side, avoiding storage on 🖧 servers.

## ✨ Features

### 1. **🎁 Airdrop Notifications**
- ⏱️ Real-time alerts for new and ongoing 💸 cryptocurrency airdrops on 🏦 Bithumb.
- 📋 Comprehensive details about each airdrop, including 🎯 eligibility, ⏳ duration, and 🏆 rewards.

### 2. **💼 Trading Integration**
- Secure integration with the 🏦 Bithumb API for trading cryptocurrencies.
- Features include:
  - Viewing market data.
  - Placing buy/sell orders.
  - Checking account balances.

### 3. **🙌 User-Friendly Design**
- Intuitive interface for monitoring airdrop updates and trading activity.
- Responsive layout optimized for both 🖥️ desktop and mobile devices.

## 🛠️ Technology Stack

- **🖼️ Frontend**: Vue.js with Tailwind CSS for a modern, responsive UI.
- **🔙 Backend**: Firebase for authentication and real-time updates.
- **🔗 API Integration**: Bithumb API for market data and trading.
- **🔧 Build Tools**: ⚡ Vite for fast builds and TypeScript for type safety.
- **📚 Additional Libraries**: 
  - `axios` for HTTP requests.
  - `pinia` for state management.
  - `lucide-vue-next` for icons.
  - `uuid` for unique identifiers.

## 📝 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/jwpgdx/bitble.git
   cd bitble
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. 🛠️ Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your Firebase configuration and any other required keys:
     ```env
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     ```

   - **ℹ️ Note**: The Bithumb API key and secret are used only on the 🖥️ client-side for enhanced 🔒 security and are not stored on 🖧 servers.

4. ▶️ Run the development server:
   ```bash
   npm run dev
   ```

5. 📦 Build for production:
   ```bash
   npm run build
   ```

6. 🔍 Preview the production build:
   ```bash
   npm run preview
   ```

## ⚖️ License

This project is licensed under the MIT License. See the LICENSE file for details.

---

For questions or contributions, feel free to open an issue or submit a pull request.

