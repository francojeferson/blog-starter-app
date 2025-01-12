// // vwoConnector.ts

// interface TrackOfflineConversionParams {
//   accountId: string;
//   experimentId: string;
//   combination: string;
//   goalId: string;
//   sessionId: string;
//   env: string;
// }

// interface VWOResponse {
//   // Define the structure of the VWO response here.
//   // This is a placeholder and should be updated based on actual VWO response.
//   success: boolean;
//   message?: string;
//   [key: string]: any;
// }

// export async function sendVwoConversion(
//   params: TrackOfflineConversionParams
// ): Promise<VWOResponse> {
//   const { accountId, experimentId, combination, goalId, sessionId, env } =
//     params;

//   const url = new URL(
//     "https://dev.visualwebsiteoptimizer.com/server-side/track-goal"
//   );

//   url.searchParams.append("account_id", accountId);
//   url.searchParams.append("experiment_id", experimentId);
//   url.searchParams.append("combination", combination);
//   url.searchParams.append("goal_id", goalId);
//   url.searchParams.append("u", sessionId);
//   url.searchParams.append("sId", Math.floor(Date.now() / 1000).toString());
//   url.searchParams.append("random", Math.random().toString());
//   url.searchParams.append("ap", "server");
//   url.searchParams.append("env", env);

//   try {
//     const response = await fetch(url.toString(), {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data: VWOResponse = await response.json();
//     console.log("Conversion tracked successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("Error tracking conversion:", error);
//     throw error;
//   }
// }
