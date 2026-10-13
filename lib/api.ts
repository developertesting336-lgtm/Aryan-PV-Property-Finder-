export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

async function fetchJson<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Prepend /api if not already there and if we're hitting local Next.js
    const apiPath = normalizedEndpoint.startsWith('/api') ? normalizedEndpoint : `/api${normalizedEndpoint}`;
    const url = `${API_BASE_URL}${apiPath}`;

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({ message: response.statusText }));
      return { data: null, error: errBody.message || `HTTP error ${response.status}` };
    }

    const json = (await response.json()) as T;
    return { data: json, error: null };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return { data: null, error: 'Request timed out' };
    }
    return { data: null, error: err.message || 'Network error' };
  }
}

export const api = {
  // Properties
  async getProperties(params?: Record<string, any>) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchJson<any[]>(`/properties${query}`);
  },

  async getProperty(slug: string) {
    return fetchJson<any>(`/properties/${slug}`);
  },

  async matchBudget(budget: number, propertyType?: string, oceanView?: boolean) {
    const params = new URLSearchParams({ budget: String(budget) });
    if (propertyType && propertyType !== 'all') params.append('propertyType', propertyType);
    if (oceanView !== undefined) params.append('oceanView', String(oceanView));
    return fetchJson<any>(`/properties/match/budget?${params.toString()}`);
  },

  // Neighborhoods
  async getNeighborhoods() {
    return fetchJson<any[]>('/neighborhoods');
  },

  // Leads & CRM
  async getLeads(status?: string, agentId?: string) {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (agentId && agentId !== 'all') params.append('agentId', agentId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<any[]>(`/leads${query}`);
  },

  async getContacts() {
    return fetchJson<any[]>('/leads/contacts');
  },

  async createLead(dto: any) {
    return fetchJson<any>('/leads', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async updateLeadStatus(id: string, status: string, note?: string) {
    return fetchJson<any>(`/leads/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },

  // Offers
  async getOffers(propertyId?: string) {
    const query = propertyId ? `?propertyId=${propertyId}` : '';
    return fetchJson<any[]>(`/offers${query}`);
  },

  async createOffer(dto: any) {
    return fetchJson<any>('/offers', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  async updateOfferStatus(id: string, status: string, counterNotes?: string) {
    return fetchJson<any>(`/offers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, counterNotes }),
    });
  },

  // Valuations
  async getValuations() {
    return fetchJson<any[]>('/valuations');
  },

  async createValuation(dto: any) {
    return fetchJson<any>('/valuations', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  // Quiz
  async scoreQuiz(dto: any) {
    return fetchJson<any>('/quiz/score', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  // Redis & Bloom Filter
  async checkBloomFilter(params: { email?: string; username?: string; phone?: string }) {
    const q = new URLSearchParams(params as any).toString();
    return fetchJson<any>(`/redis/bloom-check?${q}`);
  },

  async testCachePenetration(id: string) {
    return fetchJson<any>(`/redis/penetration-test/${id}`);
  },

  async getRedisStats() {
    return fetchJson<any>('/redis/stats');
  },

  // BullMQ Queues
  async getQueueStats() {
    return fetchJson<any>('/queues/stats');
  },

  async testQueueJob(data: any) {
    return fetchJson<any>('/queues/test-lead-job', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
