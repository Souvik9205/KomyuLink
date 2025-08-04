import { AuthProvider } from "../../generated/prisma";
interface HandleOAuthProcessParams {
  email: string;
  name: string;
  profilePictureUrl: string;
  oauthProvider: AuthProvider;
  response: Response;
  req?: any;
}

async function handleOAuthProcess({
  email,
  name,
  profilePictureUrl,
  oauthProvider,
  response,
  req,
}: HandleOAuthProcessParams) {
  try {
  } catch (error) {
    console.error("Error in handleOAuthProcess:", error);
    return;
  }
}
