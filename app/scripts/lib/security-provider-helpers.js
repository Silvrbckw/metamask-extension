import { ApprovalType } from '@metamask/controller-utils';
import getFetchWithTimeout from '../../../shared/modules/fetch-with-timeout';

const fetchWithTimeout = getFetchWithTimeout();

export async function securityProviderCheck(
  requestData,
  methodName,
  chainId,
  currentLocale,
) {
  let dataToValidate;

  if (methodName === ApprovalType.EthSignTypedData) {
    dataToValidate = {
      host_name: requestData.msgParams.origin,
      rpc_method_name: methodName,
      chain_id: chainId,
      data: requestData.msgParams.data,
      currentLocale,
    };
  } else if (
    methodName === ApprovalType.EthSign ||
    methodName === ApprovalType.PersonalSign
  ) {
    dataToValidate = {
      host_name: requestData.msgParams.origin,
      rpc_method_name: methodName,
      chain_id: chainId,
      data: {
        signer_address: requestData.msgParams.from,
        msg_to_sign: requestData.msgParams.data,
      },
      currentLocale,
    };
  } else {
    dataToValidate = {
      host_name: requestData.origin,
      rpc_method_name: methodName,
      chain_id: chainId,
      data: {
        from_address: requestData?.txParams?.from,
        to_address: requestData?.txParams?.to,
        gas: requestData?.txParams?.gas,
        gasPrice: requestData?.txParams?.gasPrice,
        value: requestData?.txParams?.value,
        data: requestData?.txParams?.data,
      },
      currentLocale,
    };
  }

  const response = await fetchWithTimeout(
    'https://proxy.metafi.codefi.network/opensea/security/v1/validate',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToValidate),
    },
  );
  return await response.json();
}
