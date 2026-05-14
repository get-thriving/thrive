// ../core/jupiter/core/push_integrations/sub/slack/task.ts
function slackTaskNiceName(slackTask) {
  if (slackTask.channel) {
    return `Respond to @${slackTask.user} on channel #${slackTask.channel}`;
  } else {
    return `Respond to @${slackTask.user} in DM`;
  }
}

export {
  slackTaskNiceName
};
//# sourceMappingURL=/build/_shared/chunk-Q4OQDEZG.js.map
