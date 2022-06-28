/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */

const onboardingPayload = (cluster, teamName, namespace, description, userAccess, quota, gpgKey) => ({
  apiVersion: 'tekton.dev/v1betal',
  kind: 'TaskRun',
  metadata: {
    // data that indentifies task run (name)
  },
  spec: {
    taskRef: {
      // Specifies what tasks the taskrun will run (name/s)
    },
    params: [
      {
        name: 'CLUSTER',
        value: cluster,
      },
      {
        name: 'TEAMNAME',
        value: teamName,
      },
      {
        name: 'NAMESPACE',
        value: namespace,
      },
      {
        name: 'DESCRIPTION',
        value: description,
      },
      {
        name: 'USERACCESS',
        value: userAccess,
      },
      {
        name: 'QUOTA',
        value: quota,
      },
      {
        name: 'GPGKEY',
        value: gpgKey,
      },
    ],
  },
});

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for submitting onboarding request!",
    });

    const body = context.payload.issue["body"];
    const metaData = body.split("\n\n");

    if(metaData[0] == "### Target cluster"){
      const cluster = /*metaData[0] + ": " + */metaData[1];
      const teamName = /*metaData[2] + ": " + */metaData[3];
      const namespace = /*metaData[4] + ": " + */metaData[5];
      const description = /*metaData[6] + ": " + */metaData[7];
      const userAccess = /*metaData[8] + ": " + */metaData[9];
      const quota = /*metaData[10] + ": " + */metaData[11];
      const customQuota = /*metaData[12] + ": " + */metaData[13]; // if custom quota = _No response_
      const GPG = /*metaData[14] + ": " + */metaData[15]; // if GPG = _No response_

      return context.octokit.issues.createComment(issueComment); // Send response to user
    }
    

  });

};

