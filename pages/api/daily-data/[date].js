import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { date } = req.query; // date is in YYYY-MM-DD format
  const userId = "default_user";

  if (req.method === 'POST') {
    try {
      const { completed } = req.body;
      const updatedRecord = await prisma.dailyData.upsert({
        where: { date },
        update: { completed },
        create: {
          date,
          completed,
          userId,
        },
      });
      res.status(200).json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update daily data' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}