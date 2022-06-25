/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for submitting onboarding request!",
    });

    const body = context.payload.issue["body"];

    const metaData = body.split("\n\n");

    const cluster = metaData[0] + ": " + metaData[1];
    const teamName = metaData[2] + ": " + metaData[3];
    const namespace = metaData[4] + ": " + metaData[5];
    const description = metaData[6] + ": " + metaData[7];
    const userAccess = metaData[8] + ": " + metaData[9];
    const quota = metaData[10] + ": " + metaData[11];
    const customQuota = metaData[12] + ": " + metaData[13];
    const GPG = metaData[14] + ": " + metaData[15];


    return context.octokit.issues.createComment(issueComment);
  });

};
