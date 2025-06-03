# Qdrant Vector Database Integration

This application uses [Qdrant](https://qdrant.tech/) as a vector database to store and retrieve chat history with semantic search capabilities.

## Prerequisites

1. **Docker** (recommended) or a Qdrant Cloud account
2. Node.js and npm/yarn/pnpm

## Setting Up Qdrant

### Option 1: Local Setup with Docker (Recommended)

1. Install Docker from [docker.com](https://www.docker.com/)
2. Run Qdrant with Docker:
   ```bash
   docker run -p 6333:6333 -p 6334:6334 \
       -v $(pwd)/qdrant_storage:/qdrant/storage \
       qdrant/qdrant
   ```
3. Qdrant will be available at `http://localhost:6333`

### Option 2: Qdrant Cloud

1. Sign up at [Qdrant Cloud](https://cloud.qdrant.io/)
2. Create a new cluster
3. Get your API key and cluster URL
4. Set the environment variables in your `.env` file:
   ```
   VITE_QDRANT_URL=your_cluster_url
   VITE_QDRANT_API_KEY=your_api_key
   ```

## Configuration

Update your `.env` file with the following variables:

```
# Local Qdrant
VITE_QDRANT_URL=http://localhost:6333

# If using Qdrant Cloud
# VITE_QDRANT_URL=https://your-cluster-url.aws.qdrant.cloud
# VITE_QDRANT_API_KEY=your-api-key-here
```

## Migrating Data to Qdrant

1. Start your application
2. Open the Settings panel
3. Navigate to the "Vector Database (Qdrant)" section
4. Click "Check Status" to verify the connection
5. Click "Migrate to Qdrant" to transfer existing data

## Features

- **Semantic Search**: Find similar messages using natural language queries
- **Scalable Storage**: Handle large volumes of chat history
- **Hybrid Mode**: Fallback to IndexedDB if Qdrant is unavailable

## Troubleshooting

### Qdrant Connection Issues

1. Ensure Qdrant is running (check `http://localhost:6333/dashboard`)
2. Verify your `.env` configuration
3. Check browser console for connection errors

### Migration Problems

1. Clear browser storage and restart the application
2. Check Qdrant logs for errors
3. Try manual migration using the developer console:
   ```javascript
   import { migrateToQdrant } from './src/utils/migrateToQdrant';
   await migrateToQdrant();
   ```

## Development

### Testing

Run the test suite:
```bash
npm test
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_QDRANT_URL | Qdrant server URL | http://localhost:6333 |
| VITE_QDRANT_API_KEY | Qdrant API key (for cloud) | - |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
