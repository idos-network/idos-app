import { checkToken } from '@/api/face-sign';
import FaceSignSetupDialog from '@/components/NotaBank/components/FaceSignSetupDialog';
import { faceTecMobileSignRoute } from '@/routes';
import { useEffect, useState } from 'react';

export function FaceSignMobile() {
  const { token } = faceTecMobileSignRoute.useSearch();
  const [userId, setUserId] = useState<string | null>(null);
  const [isTokenValid, setTokenValid] = useState<null | boolean>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token && isTokenValid === null) {
      checkToken(token)
        .then((userId) => {
          setUserId(userId);
          setTokenValid(true);
        })
        .catch((error) => {
          setErrorMessage(
            error?.response?.data?.message ?? 'Token is invalid or expired.',
          );
          setTokenValid(false);
        });
    }
  }, [token, isTokenValid]);

  let body = null;

  if (isTokenValid === null) {
    body = <div className="text-xl text-center">Checking token...</div>;
  } else if (!isTokenValid) {
    body = <div className="text-xl text-center">{errorMessage}</div>;
  } else if (userId) {
    return (
      <FaceSignSetupDialog mobile={true} userId={userId} onDone={() => {}} />
    );
  }

  return (
    <>
      <div
        className={`flex justify-center items-center w-full h-full absolute top-0 left-0 transition-opacity ease-in-out delay-150 duration-300`}
      >
        <div className="p-10 rounded-xl flex flex-col min-w-sm max-w-sm z-50 bg-idos-grey6">
          <img
            src="/idos-face-sign-logo.svg"
            className="w-[130px] m-auto mb-10"
          />
          {body}
        </div>
      </div>
      <div className="fixed inset-0 bg-[#090909] opacity-60 transition-opacity ease-in-out delay-150 duration-300 z-40"></div>
    </>
  );
}
