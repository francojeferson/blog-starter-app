import { createJimmyKey } from "../jimmyKeyUtils";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

//send slack message to dev team
const sendSlackMessage = async (
  message: string,
  errorDetails: string,
  sessionId: string,
  link: string
) => {
  console.log("Send Slack Api Helper Link: ", link);
  await fetch(`${NEXT_PUBLIC_API_URL}/api/utility/send-slack-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-jimmy-key": createJimmyKey().encryptedData,
    },
    body: JSON.stringify({
      message,
      errorDetails,
      userInfo: { sessionId },
      link,
    }),
  });
  return;
};

export default sendSlackMessage;
