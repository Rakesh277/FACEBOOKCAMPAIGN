import { mcpMiddleware } from '../middleware/mcpMiddleware';

// Example MCP endpoint
router.post('/mcp', mcpMiddleware, (req, res) => {
  // Fallback if MCP middleware called next()
  res.status(400).json({ error: 'Invalid MCP action or request' });
});
