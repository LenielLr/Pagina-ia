const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Runway ML API
async function generateVideoRunway(config) {
  const apiKey = process.env.RUNWAY_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.runwayml.com/v1/generate',
      {
        prompt: config.prompt,
        duration: config.duration,
        width: config.width,
        height: config.height,
        fps: config.fps,
        model: 'gen2'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error con Runway:', error.response?.data || error.message);
    throw error;
  }
}

// Stability AI API
async function generateVideoStability(config) {
  const apiKey = process.env.STABILITY_API_KEY;
  
  try {
    const imageResponse = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: config.prompt }],
        width: config.width,
        height: config.height,
        samples: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const videoResponse = await axios.post(
      'https://api.stability.ai/v1/generation/image-to-video',
      {
        image: imageResponse.data.artifacts[0].base64,
        cfg_scale: 1.8,
        motion_bucket_id: 127,
        seed: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    return videoResponse.data;
  } catch (error) {
    console.error('Error con Stability AI:', error.response?.data || error.message);
    throw error;
  }
}

// D-ID API
async function generateVideoDID(config) {
  const apiKey = process.env.DID_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.d-id.com/talks',
      {
        script: {
          type: 'text',
          input: config.text,
          provider: {
            type: 'microsoft',
            voice_id: 'es-ES-ElviraNeural'
          }
        },
        config: {
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
          result_format: 'mp4'
        },
        source_url: 'https://create-images-results.d-id.com/default-presenter.jpg'
      },
      {
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const talkId = response.data.id;
    let videoUrl = null;
    
    while (!videoUrl) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await axios.get(
        `https://api.d-id.com/talks/${talkId}`,
        {
          headers: {
            'Authorization': `Basic ${apiKey}`
          }
        }
      );

      if (statusResponse.data.status === 'done') {
        videoUrl = statusResponse.data.result_url;
      }
    }
    return { videoUrl };
  } catch (error) {
    console.error('Error con D-ID:', error.response?.data || error.message);
    throw error;
  }
}

// Replicate API
async function generateVideoReplicate(config) {
  const apiKey = process.env.REPLICATE_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438',
        input: {
          prompt: config.prompt,
          frames: config.fps * config.duration,
          width: config.width,
          height: config.height
        }
      },
      {
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let prediction = response.data;
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            'Authorization': `Token ${apiKey}`
          }
        }
      );
      prediction = statusResponse.data;
    }
    return prediction;
  } catch (error) {
    console.error('Error con Replicate:', error.response?.data || error.message);
    throw error;
  }
}

// Endpoint principal
app.post('/api/generate-video', async (req, res) => {
  try {
    const config = req.body;
    console.log('Generando video con configuración:', config);

    let result;
    const apiProvider = process.env.API_PROVIDER || 'runway';
    
    switch (apiProvider) {
      case 'runway':
        result = await generateVideoRunway(config);
        break;
      case 'stability':
        result = await generateVideoStability(config);
        break;
      case 'did':
        result = await generateVideoDID(config);
        break;
      case 'replicate':
        result = await generateVideoReplicate(config);
        break;
      default:
        throw new Error('API provider no configurado');
    }

    res.json({
      success: true,
      videoUrl: result.videoUrl || result.output,
      data: result
    });

  } catch (error) {
    console.error('Error generando video:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📹 API Provider: ${process.env.API_PROVIDER || 'runway'}`);
});