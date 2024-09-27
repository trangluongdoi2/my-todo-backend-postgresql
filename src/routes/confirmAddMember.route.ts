import { Router, Request, Response } from "express";
import projectService from "@/services/project.service";
import config from "@/config";

const router = Router();
router.get('/member/add-by-email', (req: Request, res: Response) => {
  const { projectId = '', email = '' } = req.query;
  const input = {
    projectId,
    email,
    url: `"${config.host}/api/member/add-by-email"`,
  }
  res.render('acceptAddMember', input);
})
router.post('/member/add-by-email', async (req: Request, res: Response) => {
  const data = await projectService.addMember(req.body);
  res.status(data.status).json({
    message: 'Add member successfully!',
  })
});

export default router;