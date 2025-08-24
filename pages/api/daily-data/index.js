import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const userId = "default_user";

  if (req.method === 'GET') {
    try {
      const dailyDataRecords = await prisma.dailyData.findMany({
        where: { userId },
      });
      // Convert array to object format the frontend expects
      const dailyData = dailyDataRecords.reduce((acc, record) => {
        acc[record.date] = { completed: record.completed };
        return acc;
      }, {});
      res.status(200).json(dailyData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch daily data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}