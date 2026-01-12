import { VercelRequest, VercelResponse } from '@vercel/node';
import { aiServiceManager } from '../lib/ai-services';
import { agentEngine } from '../lib/agent-engine';
import { v4 as uuidv4 } from 'uuid';

// AI Tasks API Handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, body } = req;

  try {
    switch (method) {
      case 'GET':
        // Get available AI services
        const services = aiServiceManager.getAvailableServices();
        return res.status(200).json({
          success: true,
          services,
          count: services.length,
        });

      case 'POST':
        // Execute AI task
        const { service, model, taskType, input, options } = body;

        if (!service || !taskType || !input) {
          return res.status(400).json({
            success: false,
            error: 'Missing required fields: service, taskType, input',
          });
        }

        const result = await aiServiceManager.executeTaskWithFallback({
          id: uuidv4(),
          service,
          model: model || 'gpt-4',
          taskType,
          input,
          userId: body.userId || 'anonymous',
          priority: options?.priority || 'normal',
          createdAt: new Date(),
        });

        return res.status(200).json({
          success: true,
          result,
        });

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('AI Tasks API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
}
