# FindRetreat - Retreat Booking Platform

A modern web application for finding and booking wellness retreats worldwide, similar to BookRetreats.com.

## Features

- 🔍 Advanced search and filtering for retreats
- 📍 Location-based retreat discovery
- 🏷️ Multiple retreat categories (Meditation, Yoga, Wellness, etc.)
- 👤 Separate authentication for retreat owners and customers
- 📊 Owner dashboard for retreat management
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Hosting**: Netlify
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hamzashabbeer/retreat-finder-.git
cd retreat-finder-
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── lib/              # Library configurations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Hamza Shabbir - hamzashabbir2k@gmail.com
Project Link: [https://github.com/hamzashabbeer/retreat-finder-](https://github.com/hamzashabbeer/retreat-finder-)