# Media Explorer 🎥 🖼️ 

An all-in-one media exploration platform that lets you search, save, and share images, videos, and GIFs from popular sources like Unsplash, Pexels, and Giphy. Features voice-powered search capabilities for a hands-free experience.

## ✨ Features

### Universal Media Search
- **Image Search**: Browse high-quality images from Unsplash
- **Video Search**: Access video content from Pexels
- **GIF Search**: Find animated GIFs from Giphy
- **Voice Search**: Hands-free search using Speech Recognition API

### Media Management
- **Wishlist**: Save your favorite media items for later
- **Download Options**: Easy downloading of any media type
- **Share Functionality**: Quick sharing to social media platforms

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- API keys for:
  - Unsplash
  - Pexels
  - Giphy

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JATINCHULETT/MediaExplorer
cd MediaExplorer
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```env
UNSPLASH_API_KEY=your_unsplash_key
PEXELS_API_KEY=your_pexels_key
GIPHY_API_KEY=your_giphy_key
```

4. Start the development server:
```bash
npm start
```

## 🛠️ Components

### ImageSearcher
- Real-time image search from Unsplash
- Grid layout with fast loading
- Image preview functionality
- Download images
- Add and Remove to wishlist option

### VideoSearcher
- Video search with thumbnails
- Preview functionality
- Quality selection for downloads
- Share to social media platforms
- Wishlist integration

### GifSearcher
- Trending GIFs section
- Search by categories
- Copy GIF link functionality
- Download options
- Wishlist support

## 🎯 Usage

### Voice Search
1. Click the microphone icon
2. Speak your search query
3. Wait for the speech recognition to process
4. Results will automatically populate

### Wishlist Management
1. Click the heart icon on any media item
2. Access saved items in the Wishlist tab
3. Remove items or download them directly

### Sharing Media
1. Select the share icon on any media item
2. Choose your preferred platform
3. Customize sharing options if available

## 🔧 Technical Stack

- **Frontend**: Vanila.js
- **API Integration**: Axios
- **Speech Recognition**: Web Speech API
- **Styling**: Styled Components
- **Media Processing**: Browser native APIs

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 🙏 Acknowledgments

- [Unsplash](https://unsplash.com) for image API
- [Pexels](https://pexels.com) for video API
- [Giphy](https://giphy.com) for GIF API
- Web Speech API for voice recognition capabilities
