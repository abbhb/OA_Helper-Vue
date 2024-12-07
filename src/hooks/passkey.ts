import {
  create,
  get, parseCreationOptionsFromJSON, parseRequestOptionsFromJSON,
} from '@github/webauthn-json/browser-ponyfill';
import {
  getPasskeyOptions,
  getPasskeyRegistrationOptions,
  loginWithPasskey, UserPasskey,
  verifyPasskeyRegistration,
} from '@/api/webauthn';

export default function usePasskey() {
  async function isSupported(): Promise<boolean> {
    // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
    // `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.
    // `isConditionalMediationAvailable` means the feature detection is usable.
    if (
      window.PublicKeyCredential &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      //@ts-ignore
      PublicKeyCredential.isConditionalMediationAvailable
    ) {
      // Check if user verifying platform authenticator is available.
      const results = await Promise.all([
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
        //@ts-ignore
        PublicKeyCredential.isConditionalMediationAvailable(),
      ]);
      if (results.every((r) => r === true)) {
        return true;
      }
    }
    return false;
  }

  async function createPasskeyCredential(): Promise<UserPasskey> {
    const { data } = await getPasskeyRegistrationOptions();
    const as1  =JSON.parse(data);
    const options = parseCreationOptionsFromJSON(as1)

    // replacement of navigator.credentials.create(...)
    const response = await create(options);
    console.log(response.getClientExtensionResults())
    const sjasd = JSON.stringify(response.toJSON());
    console.log(sjasd)
    const {data:ds} = await verifyPasskeyRegistration(sjasd);
    return ds;
  }

  // validatePasskeyCredential:如果返回不为空，既触发登录
  async function validatePasskeyCredential() {
    const { data } = await getPasskeyOptions();
    const as1  =JSON.parse(data);
    const options = parseRequestOptionsFromJSON(as1)
    console.log(options)
    // replacement of navigator.credentials.get(...)
    const response = await get(options);
      console.log(222)

    const { data: loginRes } = await loginWithPasskey(
      JSON.stringify(response.toJSON())
    );
      console.log(333)
    return loginRes.token;
  }

  return {
    isSupported,
    createPasskeyCredential,
    validatePasskeyCredential,
  };
}
