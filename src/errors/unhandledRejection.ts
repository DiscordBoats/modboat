export = (process) => {
    process.on("unhandledRejection", console.error);
};