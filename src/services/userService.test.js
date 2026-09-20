import apiClient from './apiClient';
import userService from './userService';

jest.mock('./apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty list when the backend has no users instead of showing mock data', async () => {
    apiClient.get.mockResolvedValue({ data: [] });

    await expect(userService.getUsers('')).resolves.toEqual([]);
  });

  it('accepts nested citizen search payloads returned by the backend', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        citizens: [
          {
            _id: 'citizen-1',
            full_name: 'Jane Doe',
            email: 'jane@example.com',
            wallet_balance: 250,
            role: 'CITIZEN',
          },
        ],
      },
    });

    await expect(userService.searchUsers('jane')).resolves.toEqual([
      expect.objectContaining({
        id: 'citizen-1',
        name: 'Jane Doe',
        email: 'jane@example.com',
        balance: 250,
        role: 'CITIZEN',
      }),
    ]);
  });

  it('excludes admin and staff accounts from citizen search results', async () => {
    apiClient.get.mockResolvedValue({
      data: {
        users: [
          { id: 10, name: 'Admin Account', email: 'admin@example.com', role: 'ADMIN' },
          { id: 9, name: 'Hameedat Oyewopo', email: 'citizen@example.com', role: 'CITIZEN' },
        ],
      },
    });

    await expect(userService.searchUsers('hameedat')).resolves.toEqual([
      expect.objectContaining({
        id: 9,
        name: 'Hameedat Oyewopo',
        role: 'CITIZEN',
      }),
    ]);
  });
});
