<img alt="LLMs Speed Test" src="/public/og-image.png">

A web application for benchmarking and testing Local Language Models running through Ollama.
Get quick performance metrics and comparisons for your local LLMs.

## Features

### Model Integration
- Seamless integration with Ollama
- Easy model selection interface
- Quick access to recently used models

### Performance Metrics
- Real-time performance monitoring
- Key metrics tracking:
  - Total Duration (ms)
  - Load Duration (ms)
  - Evaluation Rate (tokens/second)
- Live text streaming display

### Results Analysis
- Individual test results
- Automated averages calculation
- Performance trends visualization
- Real-time updates

### Export & Sharing
- PNG screenshot export
- CSV data export
- Built-in sharing functionality
- Formatted test reports

## Technologies

### Frontend
- Next.js 15
- React 19
- Tailwind CSS v4
- Motion
- Radix UI

### UI Components
- Sonner (Toast notifications)
- Heroicons
- Custom animations and transitions

## Setup

1. Prerequisites:
- Node.js
- Ollama installed and running locally

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select a model from the dropdown menu
2. View real-time performance metrics
3. Export or share your results
4. Compare different models

## License
This project is open source and available under the MIT license.
