export = (process) => {
    process.on('uncaughtException', console.error);
};