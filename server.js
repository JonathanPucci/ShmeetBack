var express = require("express");
var app = express();

/**
 * RUN JOBS ALL THE TIME
 */
require('./firebaseJobs')

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

var server_port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address =
  process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";


// server listens in on port
app.listen(server_port, server_ip_address, function () {
  console.log(
    "Listening on " + server_ip_address + ", server_port " + server_port
  );
});
