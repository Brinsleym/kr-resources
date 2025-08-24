import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { date } = req.body;
      const updatedLesson = await prisma.lesson.update({
        where: { id: String(id) },
        data: { date: new Date(date) },
      });
      res.status(200).json(updatedLesson);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update lesson' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}