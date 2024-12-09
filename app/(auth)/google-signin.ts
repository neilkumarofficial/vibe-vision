import axios from 'axios';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { googleAccessToken } = req.body;

    try {
      // Send the Google Access Token to the Express backend for validation
      const response = await axios.post('http://localhost:8000/auth/google', {
        googleAccessToken,
      });

      // Send the response back to the frontend
      if (response.data.success) {
        res.status(200).json(response.data); // Successful login response
      } else {
        res.status(400).json({
          message: 'Google authentication failed',
          success: false,
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message, success: false });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
