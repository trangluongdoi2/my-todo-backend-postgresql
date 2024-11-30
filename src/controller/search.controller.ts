import { Request, Response } from "express";
import { catchAsync } from "@/utils/catchAsync";
import { SearchService } from "@/services/search.service";
import { pick } from "@/utils/pick";

class SearchController {
  search = catchAsync(async (req: Request, res: Response) => {
    const { query } = req.query || '';
    const searchService = new SearchService().getInstance();
    const result = await searchService.search(query);
    // res.json(result);
    res.status(200).json(result);
  });

  searchAll = catchAsync(async (req: Request, res: Response) => {
    const searchService = new SearchService().getInstance();
    const result = await searchService.searchAll();
    // res.json(result);
    res.status(200).json(result);
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { index, id = '' } = pick(req.query, ['index']);
    console.log(index, id, '===> index, id');
    const searchService = new SearchService().getInstance();
    if (!id) {
      await searchService.deleteAllDocumentsByTypeIndex(index);
    } else {
      await searchService.deleteDocumentById(index, id);
    }
    res.status(200).send({
      message: 'Delete document successfully!',
    })
  });
}

export const searchController = new SearchController();