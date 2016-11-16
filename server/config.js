const config = {
    mongoURL: process.env.MONGOURL || "mongodb://localhost:27017/woney",
    port: process.env.PORT || 3000,
    mysqlConfig: {
        host: process.env.MYSQLURL || "localhost",
        user: "root",
        password: "",
        database: "stock",
        ConnectionLimit: 10,
    },

    logFilePath: "./woney.log",
    siteUrl: "http://ec2-54-238-195-108.ap-northeast-1.compute.amazonaws.com:3000",
    secret: "lasdfaisdgfaskldfhlkahsfdkhlajhsdlfhasd",
};
module.exports = config;
