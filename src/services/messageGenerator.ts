const msgType = {
  errors: {
    server: "Internal server error",
  },
  token: {
    noValid: "No valid token",
    refreshed: "Refreshed tokens",
  },
};

const messageGenerator = (messagesKeys: string[], customeMessage?: string) => {
  let message = "";
  let groupMsg = Object.assign({}, msgType);

  if (customeMessage) return { message: customeMessage };

  messagesKeys.forEach((messageKey) => {
    groupMsg = groupMsg[messageKey];
    if (typeof groupMsg === "string") return (message = groupMsg);
  });

  return { message };
};

export default messageGenerator;
