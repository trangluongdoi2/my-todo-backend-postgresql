import { Client } from '@elastic/elasticsearch';
import config from '@/config';

const client = new Client({
  cloud: {
    id: config.elasticSearch.cloudId,
  },
  auth: {
    apiKey: config.elasticSearch.apiKey,
  },
});

export default client;