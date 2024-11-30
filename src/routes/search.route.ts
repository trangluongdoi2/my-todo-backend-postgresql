import { Router, Request, Response } from "express";
import { searchController } from "@/controller/search.controller";

const router = Router();

router.get('/search', searchController.search);
router.get('/search-all', searchController.searchAll);
// router.delete('/search-delete')
router.delete('/search-delete', searchController.delete);

export default router;
