import ElasticSearchClient from '@/config/elasticSearch';

export enum TypeIndex {
  PROJECT = 'project',
  TODO = 'todo',
}

export class SearchService {
  static singleton: SearchService;
  private sharpClient = [
    TypeIndex.TODO,
    TypeIndex.PROJECT,
  ];

  constructor() {}

  getInstance(): SearchService {
    if (!SearchService.singleton) {
      SearchService.singleton = new SearchService();
    }
    return SearchService.singleton;
  }

  async saveDocument(typeIndex: TypeIndex, data: Record<string, any>) {
    console.log(data, '==> data..');
    await ElasticSearchClient.index({
      index: typeIndex,
      refresh: true,
      id: data.id,
      document: data,
    });
  }

  async updateDocument(typeIndex: TypeIndex, data: Record<string, any>) {
    const { id = '' } = data;
    console.log(id, '==> data id...')
    const res = await ElasticSearchClient.update({
      index: typeIndex,
      id: data.id,
      script: { ...data }
    });
    console.log(res, '===> res...');
  }

  async deleteAllDocumentsByTypeIndex(typeIndex: TypeIndex) {
    ElasticSearchClient.deleteByQuery({
      index: typeIndex,
      query: {
        match_all: {},
      },
    });
  }

  async deleteDocumentById(typeIndex: TypeIndex, id: string | number) {
    ElasticSearchClient.delete({
      index: typeIndex,
      id: id.toString(),
    });
  }

  async search(query: any) {
    let res = await Promise.allSettled(this.sharpClient.map((typeIndex: TypeIndex) => {
      return ElasticSearchClient.search({
        index: typeIndex,
        query: {
          multi_match: {
            query: `*${query}*`,
            fields: ['title', 'todoName', 'projectName'],
          },
        },
      });
    }));
    res = res.filter((item: any) => item.status === 'fulfilled');
    res = res.map((item: any) => item.value.hits);
    return res;
  }

  async searchAll() {
    const res = await ElasticSearchClient.search({
      index: TypeIndex.TODO,
    });
    console.log(res, '====> res');
    return res;
  }
}
