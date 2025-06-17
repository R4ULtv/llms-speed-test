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
- Comprehensive metrics tracking:
  - Total Duration (ms)
  - Load Duration (ms)
  - Evaluation Rate (tokens/second)
  - GPU Memory Usage
- Live text streaming display
- Global and session-based averages

### Results Analysis
- Individual test results with detailed breakdowns
- Automated averages calculation
- Performance trends visualization
- Comparative analysis against global averages
- Real-time GPU utilization monitoring

### Export & Sharing
- Screenshot export with styled PNG output
- Detailed CSV data export
- One-click sharing functionality
- Formatted test reports
- Historical data persistence

## Technologies

### Frontend
- Next.js 15
- React 19
- Tailwind CSS v4
- Motion
- Radix UI Components

### UI Components
- Custom Dialog components
- Sonner for Toast notifications
- Heroicons
- Advanced animations with Motion One
- Custom tooltips and popovers

## Setup

1. Prerequisites:
- Node.js 20+
- Ollama installed and running locally
- OLLAMA_ORIGINS configured for API access

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Select a model from the intuitive dropdown
2. Configure test settings (difficulty, streaming mode)
3. View real-time performance metrics
4. Export or share your results
5. Compare with global averages
6. Access history with Ctrl+Shift+H
7. Open settings with Ctrl+Shift+S

## License
This project is open source and available under the MIT license.
