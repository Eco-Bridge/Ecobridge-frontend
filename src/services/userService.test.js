jest.mock('./apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import apiClient from './apiClient';
import userService from './userService';

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty list when the backend has no users instead of showing mock data', async () => {
    apiClient.get.mockResolvedValue({ data: [] });

    await expect(userService.getUsers('')).resolves.toEqual([]);
  });
});
