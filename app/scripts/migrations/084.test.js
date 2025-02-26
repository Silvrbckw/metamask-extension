import { v4 } from 'uuid';
import { migrate, version } from './084';

jest.mock('uuid', () => {
  const actual = jest.requireActual('uuid');

  return {
    ...actual,
    v4: jest.fn(),
  };
});

describe('migration #84', () => {
  beforeEach(() => {
    v4.mockImplementationOnce(() => 'network-configuration-id-1')
      .mockImplementationOnce(() => 'network-configuration-id-2')
      .mockImplementationOnce(() => 'network-configuration-id-3')
      .mockImplementationOnce(() => 'network-configuration-id-4');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should update the version metadata', async () => {
    const oldStorage = {
      meta: {
        version: 83,
      },
      data: {},
    };

    const newStorage = await migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({
      version,
    });
  });

  it('should use the key of the networkConfigurations object to set the id of each network configuration', async () => {
    const oldStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: {
          networkConfigurations: {
            'network-configuration-id-1': {
              chainId: '0x539',
              nickname: 'Localhost 8545',
              rpcPrefs: {},
              rpcUrl: 'http://localhost:8545',
              ticker: 'ETH',
            },
            'network-configuration-id-2': {
              chainId: '0xa4b1',
              nickname: 'Arbitrum One',
              rpcPrefs: {
                blockExplorerUrl: 'https://explorer.arbitrum.io',
              },
              rpcUrl:
                'https://arbitrum-mainnet.infura.io/v3/373266a93aab4acda48f89d4fe77c748',
              ticker: 'ETH',
            },
            'network-configuration-id-3': {
              chainId: '0x4e454152',
              nickname: 'Aurora Mainnet',
              rpcPrefs: {
                blockExplorerUrl: 'https://aurorascan.dev/',
              },
              rpcUrl:
                'https://aurora-mainnet.infura.io/v3/373266a93aab4acda48f89d4fe77c748',
              ticker: 'Aurora ETH',
            },
            'network-configuration-id-4': {
              chainId: '0x38',
              nickname:
                'BNB Smart Chain (previously Binance Smart Chain Mainnet)',
              rpcPrefs: {
                blockExplorerUrl: 'https://bscscan.com/',
              },
              rpcUrl: 'https://bsc-dataseed.binance.org/',
              ticker: 'BNB',
            },
          },
        },
      },
    };

    const newStorage = await migrate(oldStorage);

    const expectedNewStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: {
          networkConfigurations: {
            'network-configuration-id-1': {
              chainId: '0x539',
              nickname: 'Localhost 8545',
              rpcPrefs: {},
              rpcUrl: 'http://localhost:8545',
              ticker: 'ETH',
              id: 'network-configuration-id-1',
            },
            'network-configuration-id-2': {
              chainId: '0xa4b1',
              nickname: 'Arbitrum One',
              rpcPrefs: {
                blockExplorerUrl: 'https://explorer.arbitrum.io',
              },
              rpcUrl:
                'https://arbitrum-mainnet.infura.io/v3/373266a93aab4acda48f89d4fe77c748',
              ticker: 'ETH',
              id: 'network-configuration-id-2',
            },
            'network-configuration-id-3': {
              chainId: '0x4e454152',
              nickname: 'Aurora Mainnet',
              rpcPrefs: {
                blockExplorerUrl: 'https://aurorascan.dev/',
              },
              rpcUrl:
                'https://aurora-mainnet.infura.io/v3/373266a93aab4acda48f89d4fe77c748',
              ticker: 'Aurora ETH',
              id: 'network-configuration-id-3',
            },
            'network-configuration-id-4': {
              chainId: '0x38',
              nickname:
                'BNB Smart Chain (previously Binance Smart Chain Mainnet)',
              rpcPrefs: {
                blockExplorerUrl: 'https://bscscan.com/',
              },
              rpcUrl: 'https://bsc-dataseed.binance.org/',
              ticker: 'BNB',
              id: 'network-configuration-id-4',
            },
          },
        },
      },
    };
    expect(newStorage).toStrictEqual(expectedNewStorage);
  });

  it('should not modify state if state.NetworkController is undefined', async () => {
    const oldStorage = {
      meta: {
        version,
      },
      data: {
        testProperty: 'testValue',
      },
    };

    const newStorage = await migrate(oldStorage);

    const expectedNewStorage = {
      meta: {
        version,
      },
      data: {
        testProperty: 'testValue',
      },
    };
    expect(newStorage).toStrictEqual(expectedNewStorage);
  });

  it('should not modify state if state.NetworkController is not an object', async () => {
    const oldStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: false,
        testProperty: 'testValue',
      },
    };

    const newStorage = await migrate(oldStorage);

    const expectedNewStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: false,
        testProperty: 'testValue',
      },
    };
    expect(newStorage).toStrictEqual(expectedNewStorage);
  });

  it('should not modify state if state.NetworkController.networkConfigurations is undefined', async () => {
    const oldStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: {
          testNetworkControllerProperty: 'testNetworkControllerValue',
          networkConfigurations: undefined,
        },
        testProperty: 'testValue',
      },
    };

    const newStorage = await migrate(oldStorage);

    const expectedNewStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: {
          testNetworkControllerProperty: 'testNetworkControllerValue',
          networkConfigurations: undefined,
        },
        testProperty: 'testValue',
      },
    };
    expect(newStorage).toStrictEqual(expectedNewStorage);
  });

  it('should not modify state if state.NetworkController.networkConfigurations is an empty object', async () => {
    const oldStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: {
          testNetworkControllerProperty: 'testNetworkControllerValue',
          networkConfigurations: {},
        },
        testProperty: 'testValue',
      },
    };

    const newStorage = await migrate(oldStorage);

    const expectedNewStorage = {
      meta: {
        version,
      },
      data: {
        NetworkController: {
          testNetworkControllerProperty: 'testNetworkControllerValue',
          networkConfigurations: {},
        },
        testProperty: 'testValue',
      },
    };
    expect(newStorage).toStrictEqual(expectedNewStorage);
  });
});
