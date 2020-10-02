#!/usr/bin/env node
//........._\____
//......../__|___\__
//.......(0)____(0)_\
//.......Mike..Lim...
"use strict";

const gulp = require("gulp");
const fs = require("fs");
const axios = require("axios");
const parse = require("csv-parse/lib/sync");
const os = require("os");
const path = require("path");
const GulpSSH = require("gulp-ssh");

// SSH
const config = {
  host: "172.31.100.115", // AD30
  port: 22,
  autoExit: true,
  username: "xxxxxx",
  privateKey: fs.readFileSync(os.homedir() + "/.ssh/id_rsa"),
};

const gulpSSH = new GulpSSH({
  sshConfig: config,
});

// passing arguments - ignore node and file name
const args = process.argv.slice(2);

// parsed arguments
let arg_linkID = args[0];

// get base remote folders
const ev_remoteDestinationPAC7 = "/home/webdev/git/web";

async function okWatchStartUp() {
  if (!arg_linkID) {
    console.log(
      "Please provide linkID in the command (Usage: node watch arkansas)"
    );
    return;
  }

  // get client information
  const ev_liveCSV = await axios.get(
    "http://172.16.100.190/evenue/evenue-homes-inventory"
  );
  const ev_liveSrverRecord = parse(ev_liveCSV.data, {
    skip_empty_lines: true,
  });

  const ev_liveServer = getServers(arg_linkID, ev_liveSrverRecord);

  if (ev_liveServer == "") {
    console.log("Oh no... invalid linkID passed!");
    return;
  }

  if (/^ev/i.test(ev_liveServer)) {
    console.log("-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-\n");
    console.log(
      "   Watching " +
        arg_linkID +
        " - " +
        ev_liveServer.join(", ").replace(/,\s*$/, "") +
        "\n"
    );
    console.log("+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n");
  }

  // watch files
  const watcher = gulp.watch([`pac7/custom/${arg_linkID}/**/*`]);

  var syncFiles = debounce(syncRemoteFiles, 1500);

  watcher.on("all", async function (eventtype, file) {
    console.log("There was a " + eventtype + " at " + file);
    return goCopyPAC7(file).on("finish", syncFiles);
  });
}

// get servers
function getServers(l, s) {
  const ev_liveServerFound = s.find(function (record) {
    return record[0] === l;
  });

  let ev_servers = [];
  for (var i in ev_liveServerFound) {
    if (ev_liveServerFound[i] !== "") {
      ev_servers.push(ev_liveServerFound[i]);
    }
  }
  return ev_servers.slice(1); // remove first item which is linkID and return
}

function goCopyPAC7(file) {
  // display what file being copied
  console.log(
    "Copied : " +
      file +
      " -> " +
      ev_remoteDestinationPAC7 +
      "/" +
      path.dirname(file) +
      "/" +
      path.basename(file)
  );
  var ev_PAC7RemotePath = ev_remoteDestinationPAC7 + "/" + path.dirname(file);
  return gulp
    .src(file, { allowEmpty: true })
    .pipe(gulpSSH.dest(ev_PAC7RemotePath));
}

function syncRemoteFiles() {
  console.log("Syncing files");
  return gulpSSH
    .shell(["p7sync master prod"])
    .pipe(gulp.dest("logs", { autoExit: true }))
    .on("end", function () {
      console.log("Finished Syncing");
    });
}

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

okWatchStartUp();
