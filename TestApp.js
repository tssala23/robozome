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

    //Store the body of the issue and split it but \n\n. Body of onboarding issue split by \n\n
    const body = context.payload.issue["body"];
    const metaData = body.split("\n\n");

    //Identify if it is an onboarding issue and store metadata in variables with labels for data patch file
    if(metaData[0] == "### Target cluster"){
      if(metaData[1] == "smaug" || metaData[1] == "infra"){
        const cluster = "cluster: moc/" + metaData[1];
      } else{
        const cluster = "cluster: emea/" + metaData[1];
      };
      const teamName = "group: " + metaData[3];
      const namespace = "namespace: " + metaData[5];
      var quota;
      if(metaData[11] == "Custom"){
        var quota = metaData[13];
      } else {
        var quota = metaData[11];
      };

      //const description = metaData[7]; Constants not needed as can just access the array
      //const userAccess = metaData[9];
      //const GPG = metaData[15]; // if GPG = _No response_

      //Save meta data in file to be read for patch
      const fileData = namespace + "\n" + teamName + "\n" + "quota: " + quota + "\n" + cluster;
      var fs = require('fs');
      fs.writeFile('testData.yaml', fileData, (err) => {

        if (err) throw err; //error to be handled if file not saved

        console.log('Data saved');
      });
      

      return context.octokit.issues.createComment(issueComment); // Send response to user
    }
    

  });

};

