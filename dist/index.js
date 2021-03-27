var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// node_modules/@actions/core/lib/utils.js
var require_utils = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function toCommandValue(input) {
    if (input === null || input === void 0) {
      return "";
    } else if (typeof input === "string" || input instanceof String) {
      return input;
    }
    return JSON.stringify(input);
  }
  exports.toCommandValue = toCommandValue;
});

// node_modules/@actions/core/lib/command.js
var require_command = __commonJS((exports) => {
  "use strict";
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var os = __importStar(require("os"));
  var utils_1 = require_utils();
  function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
  }
  exports.issueCommand = issueCommand;
  function issue(name, message = "") {
    issueCommand(name, {}, message);
  }
  exports.issue = issue;
  var CMD_STRING = "::";
  var Command = class {
    constructor(command, properties, message) {
      if (!command) {
        command = "missing.command";
      }
      this.command = command;
      this.properties = properties;
      this.message = message;
    }
    toString() {
      let cmdStr = CMD_STRING + this.command;
      if (this.properties && Object.keys(this.properties).length > 0) {
        cmdStr += " ";
        let first = true;
        for (const key in this.properties) {
          if (this.properties.hasOwnProperty(key)) {
            const val = this.properties[key];
            if (val) {
              if (first) {
                first = false;
              } else {
                cmdStr += ",";
              }
              cmdStr += `${key}=${escapeProperty(val)}`;
            }
          }
        }
      }
      cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
      return cmdStr;
    }
  };
  function escapeData(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
  }
  function escapeProperty(s) {
    return utils_1.toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
  }
});

// node_modules/@actions/core/lib/file-command.js
var require_file_command = __commonJS((exports) => {
  "use strict";
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var fs4 = __importStar(require("fs"));
  var os = __importStar(require("os"));
  var utils_1 = require_utils();
  function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
      throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs4.existsSync(filePath)) {
      throw new Error(`Missing file at path: ${filePath}`);
    }
    fs4.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
      encoding: "utf8"
    });
  }
  exports.issueCommand = issueCommand;
});

// node_modules/@actions/core/lib/core.js
var require_core = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var command_1 = require_command();
  var file_command_1 = require_file_command();
  var utils_1 = require_utils();
  var os = __importStar(require("os"));
  var path4 = __importStar(require("path"));
  var ExitCode;
  (function(ExitCode2) {
    ExitCode2[ExitCode2["Success"] = 0] = "Success";
    ExitCode2[ExitCode2["Failure"] = 1] = "Failure";
  })(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
  function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env["GITHUB_ENV"] || "";
    if (filePath) {
      const delimiter = "_GitHubActionsFileCommandDelimeter_";
      const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
      file_command_1.issueCommand("ENV", commandValue);
    } else {
      command_1.issueCommand("set-env", {name}, convertedVal);
    }
  }
  exports.exportVariable = exportVariable;
  function setSecret(secret) {
    command_1.issueCommand("add-mask", {}, secret);
  }
  exports.setSecret = setSecret;
  function addPath2(inputPath) {
    const filePath = process.env["GITHUB_PATH"] || "";
    if (filePath) {
      file_command_1.issueCommand("PATH", inputPath);
    } else {
      command_1.issueCommand("add-path", {}, inputPath);
    }
    process.env["PATH"] = `${inputPath}${path4.delimiter}${process.env["PATH"]}`;
  }
  exports.addPath = addPath2;
  function getInput2(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
    if (options && options.required && !val) {
      throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
  }
  exports.getInput = getInput2;
  function setOutput(name, value) {
    command_1.issueCommand("set-output", {name}, value);
  }
  exports.setOutput = setOutput;
  function setCommandEcho(enabled) {
    command_1.issue("echo", enabled ? "on" : "off");
  }
  exports.setCommandEcho = setCommandEcho;
  function setFailed2(message) {
    process.exitCode = ExitCode.Failure;
    error3(message);
  }
  exports.setFailed = setFailed2;
  function isDebug() {
    return process.env["RUNNER_DEBUG"] === "1";
  }
  exports.isDebug = isDebug;
  function debug4(message) {
    command_1.issueCommand("debug", {}, message);
  }
  exports.debug = debug4;
  function error3(message) {
    command_1.issue("error", message instanceof Error ? message.toString() : message);
  }
  exports.error = error3;
  function warning(message) {
    command_1.issue("warning", message instanceof Error ? message.toString() : message);
  }
  exports.warning = warning;
  function info2(message) {
    process.stdout.write(message + os.EOL);
  }
  exports.info = info2;
  function startGroup(name) {
    command_1.issue("group", name);
  }
  exports.startGroup = startGroup;
  function endGroup() {
    command_1.issue("endgroup");
  }
  exports.endGroup = endGroup;
  function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
      startGroup(name);
      let result;
      try {
        result = yield fn();
      } finally {
        endGroup();
      }
      return result;
    });
  }
  exports.group = group;
  function saveState(name, value) {
    command_1.issueCommand("save-state", {name}, value);
  }
  exports.saveState = saveState;
  function getState(name) {
    return process.env[`STATE_${name}`] || "";
  }
  exports.getState = getState;
});

// node_modules/@actions/github/lib/context.js
var require_context = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Context = void 0;
  var fs_1 = require("fs");
  var os_1 = require("os");
  var Context = class {
    constructor() {
      this.payload = {};
      if (process.env.GITHUB_EVENT_PATH) {
        if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
          this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, {encoding: "utf8"}));
        } else {
          const path4 = process.env.GITHUB_EVENT_PATH;
          process.stdout.write(`GITHUB_EVENT_PATH ${path4} does not exist${os_1.EOL}`);
        }
      }
      this.eventName = process.env.GITHUB_EVENT_NAME;
      this.sha = process.env.GITHUB_SHA;
      this.ref = process.env.GITHUB_REF;
      this.workflow = process.env.GITHUB_WORKFLOW;
      this.action = process.env.GITHUB_ACTION;
      this.actor = process.env.GITHUB_ACTOR;
      this.job = process.env.GITHUB_JOB;
      this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
      this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
      const payload = this.payload;
      return Object.assign(Object.assign({}, this.repo), {number: (payload.issue || payload.pull_request || payload).number});
    }
    get repo() {
      if (process.env.GITHUB_REPOSITORY) {
        const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
        return {owner, repo};
      }
      if (this.payload.repository) {
        return {
          owner: this.payload.repository.owner.login,
          repo: this.payload.repository.name
        };
      }
      throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
  };
  exports.Context = Context;
});

// node_modules/@actions/http-client/proxy.js
var require_proxy = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var url = require("url");
  function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === "https:";
    let proxyUrl;
    if (checkBypass(reqUrl)) {
      return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
      proxyVar = process.env["https_proxy"] || process.env["HTTPS_PROXY"];
    } else {
      proxyVar = process.env["http_proxy"] || process.env["HTTP_PROXY"];
    }
    if (proxyVar) {
      proxyUrl = url.parse(proxyVar);
    }
    return proxyUrl;
  }
  exports.getProxyUrl = getProxyUrl;
  function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
      return false;
    }
    let noProxy = process.env["no_proxy"] || process.env["NO_PROXY"] || "";
    if (!noProxy) {
      return false;
    }
    let reqPort;
    if (reqUrl.port) {
      reqPort = Number(reqUrl.port);
    } else if (reqUrl.protocol === "http:") {
      reqPort = 80;
    } else if (reqUrl.protocol === "https:") {
      reqPort = 443;
    }
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === "number") {
      upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    for (let upperNoProxyItem of noProxy.split(",").map((x) => x.trim().toUpperCase()).filter((x) => x)) {
      if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
        return true;
      }
    }
    return false;
  }
  exports.checkBypass = checkBypass;
});

// node_modules/tunnel/lib/tunnel.js
var require_tunnel = __commonJS((exports) => {
  "use strict";
  var net = require("net");
  var tls = require("tls");
  var http = require("http");
  var https2 = require("https");
  var events = require("events");
  var assert = require("assert");
  var util = require("util");
  exports.httpOverHttp = httpOverHttp;
  exports.httpsOverHttp = httpsOverHttp;
  exports.httpOverHttps = httpOverHttps;
  exports.httpsOverHttps = httpsOverHttps;
  function httpOverHttp(options) {
    var agent = new TunnelingAgent(options);
    agent.request = http.request;
    return agent;
  }
  function httpsOverHttp(options) {
    var agent = new TunnelingAgent(options);
    agent.request = http.request;
    agent.createSocket = createSecureSocket;
    agent.defaultPort = 443;
    return agent;
  }
  function httpOverHttps(options) {
    var agent = new TunnelingAgent(options);
    agent.request = https2.request;
    return agent;
  }
  function httpsOverHttps(options) {
    var agent = new TunnelingAgent(options);
    agent.request = https2.request;
    agent.createSocket = createSecureSocket;
    agent.defaultPort = 443;
    return agent;
  }
  function TunnelingAgent(options) {
    var self = this;
    self.options = options || {};
    self.proxyOptions = self.options.proxy || {};
    self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
    self.requests = [];
    self.sockets = [];
    self.on("free", function onFree(socket, host, port, localAddress) {
      var options2 = toOptions(host, port, localAddress);
      for (var i = 0, len = self.requests.length; i < len; ++i) {
        var pending = self.requests[i];
        if (pending.host === options2.host && pending.port === options2.port) {
          self.requests.splice(i, 1);
          pending.request.onSocket(socket);
          return;
        }
      }
      socket.destroy();
      self.removeSocket(socket);
    });
  }
  util.inherits(TunnelingAgent, events.EventEmitter);
  TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
    var self = this;
    var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));
    if (self.sockets.length >= this.maxSockets) {
      self.requests.push(options);
      return;
    }
    self.createSocket(options, function(socket) {
      socket.on("free", onFree);
      socket.on("close", onCloseOrRemove);
      socket.on("agentRemove", onCloseOrRemove);
      req.onSocket(socket);
      function onFree() {
        self.emit("free", socket, options);
      }
      function onCloseOrRemove(err) {
        self.removeSocket(socket);
        socket.removeListener("free", onFree);
        socket.removeListener("close", onCloseOrRemove);
        socket.removeListener("agentRemove", onCloseOrRemove);
      }
    });
  };
  TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
    var self = this;
    var placeholder = {};
    self.sockets.push(placeholder);
    var connectOptions = mergeOptions({}, self.proxyOptions, {
      method: "CONNECT",
      path: options.host + ":" + options.port,
      agent: false,
      headers: {
        host: options.host + ":" + options.port
      }
    });
    if (options.localAddress) {
      connectOptions.localAddress = options.localAddress;
    }
    if (connectOptions.proxyAuth) {
      connectOptions.headers = connectOptions.headers || {};
      connectOptions.headers["Proxy-Authorization"] = "Basic " + new Buffer(connectOptions.proxyAuth).toString("base64");
    }
    debug4("making CONNECT request");
    var connectReq = self.request(connectOptions);
    connectReq.useChunkedEncodingByDefault = false;
    connectReq.once("response", onResponse);
    connectReq.once("upgrade", onUpgrade);
    connectReq.once("connect", onConnect);
    connectReq.once("error", onError);
    connectReq.end();
    function onResponse(res) {
      res.upgrade = true;
    }
    function onUpgrade(res, socket, head) {
      process.nextTick(function() {
        onConnect(res, socket, head);
      });
    }
    function onConnect(res, socket, head) {
      connectReq.removeAllListeners();
      socket.removeAllListeners();
      if (res.statusCode !== 200) {
        debug4("tunneling socket could not be established, statusCode=%d", res.statusCode);
        socket.destroy();
        var error3 = new Error("tunneling socket could not be established, statusCode=" + res.statusCode);
        error3.code = "ECONNRESET";
        options.request.emit("error", error3);
        self.removeSocket(placeholder);
        return;
      }
      if (head.length > 0) {
        debug4("got illegal response body from proxy");
        socket.destroy();
        var error3 = new Error("got illegal response body from proxy");
        error3.code = "ECONNRESET";
        options.request.emit("error", error3);
        self.removeSocket(placeholder);
        return;
      }
      debug4("tunneling connection has established");
      self.sockets[self.sockets.indexOf(placeholder)] = socket;
      return cb(socket);
    }
    function onError(cause) {
      connectReq.removeAllListeners();
      debug4("tunneling socket could not be established, cause=%s\n", cause.message, cause.stack);
      var error3 = new Error("tunneling socket could not be established, cause=" + cause.message);
      error3.code = "ECONNRESET";
      options.request.emit("error", error3);
      self.removeSocket(placeholder);
    }
  };
  TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
    var pos = this.sockets.indexOf(socket);
    if (pos === -1) {
      return;
    }
    this.sockets.splice(pos, 1);
    var pending = this.requests.shift();
    if (pending) {
      this.createSocket(pending, function(socket2) {
        pending.request.onSocket(socket2);
      });
    }
  };
  function createSecureSocket(options, cb) {
    var self = this;
    TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
      var hostHeader = options.request.getHeader("host");
      var tlsOptions = mergeOptions({}, self.options, {
        socket,
        servername: hostHeader ? hostHeader.replace(/:.*$/, "") : options.host
      });
      var secureSocket = tls.connect(0, tlsOptions);
      self.sockets[self.sockets.indexOf(socket)] = secureSocket;
      cb(secureSocket);
    });
  }
  function toOptions(host, port, localAddress) {
    if (typeof host === "string") {
      return {
        host,
        port,
        localAddress
      };
    }
    return host;
  }
  function mergeOptions(target) {
    for (var i = 1, len = arguments.length; i < len; ++i) {
      var overrides = arguments[i];
      if (typeof overrides === "object") {
        var keys = Object.keys(overrides);
        for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
          var k = keys[j];
          if (overrides[k] !== void 0) {
            target[k] = overrides[k];
          }
        }
      }
    }
    return target;
  }
  var debug4;
  if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
    debug4 = function() {
      var args = Array.prototype.slice.call(arguments);
      if (typeof args[0] === "string") {
        args[0] = "TUNNEL: " + args[0];
      } else {
        args.unshift("TUNNEL:");
      }
      console.error.apply(console, args);
    };
  } else {
    debug4 = function() {
    };
  }
  exports.debug = debug4;
});

// node_modules/tunnel/index.js
var require_tunnel2 = __commonJS((exports, module2) => {
  module2.exports = require_tunnel();
});

// node_modules/@actions/http-client/index.js
var require_http_client = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var url = require("url");
  var http = require("http");
  var https2 = require("https");
  var pm = require_proxy();
  var tunnel;
  var HttpCodes;
  (function(HttpCodes2) {
    HttpCodes2[HttpCodes2["OK"] = 200] = "OK";
    HttpCodes2[HttpCodes2["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes2[HttpCodes2["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes2[HttpCodes2["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes2[HttpCodes2["SeeOther"] = 303] = "SeeOther";
    HttpCodes2[HttpCodes2["NotModified"] = 304] = "NotModified";
    HttpCodes2[HttpCodes2["UseProxy"] = 305] = "UseProxy";
    HttpCodes2[HttpCodes2["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes2[HttpCodes2["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes2[HttpCodes2["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes2[HttpCodes2["BadRequest"] = 400] = "BadRequest";
    HttpCodes2[HttpCodes2["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes2[HttpCodes2["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes2[HttpCodes2["Forbidden"] = 403] = "Forbidden";
    HttpCodes2[HttpCodes2["NotFound"] = 404] = "NotFound";
    HttpCodes2[HttpCodes2["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes2[HttpCodes2["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes2[HttpCodes2["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes2[HttpCodes2["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes2[HttpCodes2["Conflict"] = 409] = "Conflict";
    HttpCodes2[HttpCodes2["Gone"] = 410] = "Gone";
    HttpCodes2[HttpCodes2["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes2[HttpCodes2["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes2[HttpCodes2["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes2[HttpCodes2["BadGateway"] = 502] = "BadGateway";
    HttpCodes2[HttpCodes2["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes2[HttpCodes2["GatewayTimeout"] = 504] = "GatewayTimeout";
  })(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
  var Headers;
  (function(Headers2) {
    Headers2["Accept"] = "accept";
    Headers2["ContentType"] = "content-type";
  })(Headers = exports.Headers || (exports.Headers = {}));
  var MediaTypes;
  (function(MediaTypes2) {
    MediaTypes2["ApplicationJson"] = "application/json";
  })(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
  function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : "";
  }
  exports.getProxyUrl = getProxyUrl;
  var HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
  ];
  var HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
  ];
  var RetryableHttpVerbs = ["OPTIONS", "GET", "DELETE", "HEAD"];
  var ExponentialBackoffCeiling = 10;
  var ExponentialBackoffTimeSlice = 5;
  var HttpClientResponse = class {
    constructor(message) {
      this.message = message;
    }
    readBody() {
      return new Promise(async (resolve3, reject) => {
        let output = Buffer.alloc(0);
        this.message.on("data", (chunk) => {
          output = Buffer.concat([output, chunk]);
        });
        this.message.on("end", () => {
          resolve3(output.toString());
        });
      });
    }
  };
  exports.HttpClientResponse = HttpClientResponse;
  function isHttps(requestUrl) {
    let parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === "https:";
  }
  exports.isHttps = isHttps;
  var HttpClient = class {
    constructor(userAgent, handlers, requestOptions) {
      this._ignoreSslError = false;
      this._allowRedirects = true;
      this._allowRedirectDowngrade = false;
      this._maxRedirects = 50;
      this._allowRetries = false;
      this._maxRetries = 1;
      this._keepAlive = false;
      this._disposed = false;
      this.userAgent = userAgent;
      this.handlers = handlers || [];
      this.requestOptions = requestOptions;
      if (requestOptions) {
        if (requestOptions.ignoreSslError != null) {
          this._ignoreSslError = requestOptions.ignoreSslError;
        }
        this._socketTimeout = requestOptions.socketTimeout;
        if (requestOptions.allowRedirects != null) {
          this._allowRedirects = requestOptions.allowRedirects;
        }
        if (requestOptions.allowRedirectDowngrade != null) {
          this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
        }
        if (requestOptions.maxRedirects != null) {
          this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
        }
        if (requestOptions.keepAlive != null) {
          this._keepAlive = requestOptions.keepAlive;
        }
        if (requestOptions.allowRetries != null) {
          this._allowRetries = requestOptions.allowRetries;
        }
        if (requestOptions.maxRetries != null) {
          this._maxRetries = requestOptions.maxRetries;
        }
      }
    }
    options(requestUrl, additionalHeaders) {
      return this.request("OPTIONS", requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
      return this.request("GET", requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
      return this.request("DELETE", requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
      return this.request("POST", requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
      return this.request("PATCH", requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
      return this.request("PUT", requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
      return this.request("HEAD", requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
      return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    async getJson(requestUrl, additionalHeaders = {}) {
      additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
      let res = await this.get(requestUrl, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
      let data = JSON.stringify(obj, null, 2);
      additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
      additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
      let res = await this.post(requestUrl, data, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
      let data = JSON.stringify(obj, null, 2);
      additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
      additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
      let res = await this.put(requestUrl, data, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
      let data = JSON.stringify(obj, null, 2);
      additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
      additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
      let res = await this.patch(requestUrl, data, additionalHeaders);
      return this._processResponse(res, this.requestOptions);
    }
    async request(verb, requestUrl, data, headers) {
      if (this._disposed) {
        throw new Error("Client has already been disposed.");
      }
      let parsedUrl = url.parse(requestUrl);
      let info2 = this._prepareRequest(verb, parsedUrl, headers);
      let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1 ? this._maxRetries + 1 : 1;
      let numTries = 0;
      let response;
      while (numTries < maxTries) {
        response = await this.requestRaw(info2, data);
        if (response && response.message && response.message.statusCode === HttpCodes.Unauthorized) {
          let authenticationHandler;
          for (let i = 0; i < this.handlers.length; i++) {
            if (this.handlers[i].canHandleAuthentication(response)) {
              authenticationHandler = this.handlers[i];
              break;
            }
          }
          if (authenticationHandler) {
            return authenticationHandler.handleAuthentication(this, info2, data);
          } else {
            return response;
          }
        }
        let redirectsRemaining = this._maxRedirects;
        while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 && this._allowRedirects && redirectsRemaining > 0) {
          const redirectUrl = response.message.headers["location"];
          if (!redirectUrl) {
            break;
          }
          let parsedRedirectUrl = url.parse(redirectUrl);
          if (parsedUrl.protocol == "https:" && parsedUrl.protocol != parsedRedirectUrl.protocol && !this._allowRedirectDowngrade) {
            throw new Error("Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.");
          }
          await response.readBody();
          if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
            for (let header in headers) {
              if (header.toLowerCase() === "authorization") {
                delete headers[header];
              }
            }
          }
          info2 = this._prepareRequest(verb, parsedRedirectUrl, headers);
          response = await this.requestRaw(info2, data);
          redirectsRemaining--;
        }
        if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
          return response;
        }
        numTries += 1;
        if (numTries < maxTries) {
          await response.readBody();
          await this._performExponentialBackoff(numTries);
        }
      }
      return response;
    }
    dispose() {
      if (this._agent) {
        this._agent.destroy();
      }
      this._disposed = true;
    }
    requestRaw(info2, data) {
      return new Promise((resolve3, reject) => {
        let callbackForResult = function(err, res) {
          if (err) {
            reject(err);
          }
          resolve3(res);
        };
        this.requestRawWithCallback(info2, data, callbackForResult);
      });
    }
    requestRawWithCallback(info2, data, onResult) {
      let socket;
      if (typeof data === "string") {
        info2.options.headers["Content-Length"] = Buffer.byteLength(data, "utf8");
      }
      let callbackCalled = false;
      let handleResult = (err, res) => {
        if (!callbackCalled) {
          callbackCalled = true;
          onResult(err, res);
        }
      };
      let req = info2.httpModule.request(info2.options, (msg) => {
        let res = new HttpClientResponse(msg);
        handleResult(null, res);
      });
      req.on("socket", (sock) => {
        socket = sock;
      });
      req.setTimeout(this._socketTimeout || 3 * 6e4, () => {
        if (socket) {
          socket.end();
        }
        handleResult(new Error("Request timeout: " + info2.options.path), null);
      });
      req.on("error", function(err) {
        handleResult(err, null);
      });
      if (data && typeof data === "string") {
        req.write(data, "utf8");
      }
      if (data && typeof data !== "string") {
        data.on("close", function() {
          req.end();
        });
        data.pipe(req);
      } else {
        req.end();
      }
    }
    getAgent(serverUrl) {
      let parsedUrl = url.parse(serverUrl);
      return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
      const info2 = {};
      info2.parsedUrl = requestUrl;
      const usingSsl = info2.parsedUrl.protocol === "https:";
      info2.httpModule = usingSsl ? https2 : http;
      const defaultPort = usingSsl ? 443 : 80;
      info2.options = {};
      info2.options.host = info2.parsedUrl.hostname;
      info2.options.port = info2.parsedUrl.port ? parseInt(info2.parsedUrl.port) : defaultPort;
      info2.options.path = (info2.parsedUrl.pathname || "") + (info2.parsedUrl.search || "");
      info2.options.method = method;
      info2.options.headers = this._mergeHeaders(headers);
      if (this.userAgent != null) {
        info2.options.headers["user-agent"] = this.userAgent;
      }
      info2.options.agent = this._getAgent(info2.parsedUrl);
      if (this.handlers) {
        this.handlers.forEach((handler) => {
          handler.prepareRequest(info2.options);
        });
      }
      return info2;
    }
    _mergeHeaders(headers) {
      const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
      if (this.requestOptions && this.requestOptions.headers) {
        return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
      }
      return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
      const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => (c[k.toLowerCase()] = obj[k], c), {});
      let clientHeader;
      if (this.requestOptions && this.requestOptions.headers) {
        clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
      }
      return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
      let agent;
      let proxyUrl = pm.getProxyUrl(parsedUrl);
      let useProxy = proxyUrl && proxyUrl.hostname;
      if (this._keepAlive && useProxy) {
        agent = this._proxyAgent;
      }
      if (this._keepAlive && !useProxy) {
        agent = this._agent;
      }
      if (!!agent) {
        return agent;
      }
      const usingSsl = parsedUrl.protocol === "https:";
      let maxSockets = 100;
      if (!!this.requestOptions) {
        maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
      }
      if (useProxy) {
        if (!tunnel) {
          tunnel = require_tunnel2();
        }
        const agentOptions = {
          maxSockets,
          keepAlive: this._keepAlive,
          proxy: {
            proxyAuth: proxyUrl.auth,
            host: proxyUrl.hostname,
            port: proxyUrl.port
          }
        };
        let tunnelAgent;
        const overHttps = proxyUrl.protocol === "https:";
        if (usingSsl) {
          tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
        } else {
          tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
        }
        agent = tunnelAgent(agentOptions);
        this._proxyAgent = agent;
      }
      if (this._keepAlive && !agent) {
        const options = {keepAlive: this._keepAlive, maxSockets};
        agent = usingSsl ? new https2.Agent(options) : new http.Agent(options);
        this._agent = agent;
      }
      if (!agent) {
        agent = usingSsl ? https2.globalAgent : http.globalAgent;
      }
      if (usingSsl && this._ignoreSslError) {
        agent.options = Object.assign(agent.options || {}, {
          rejectUnauthorized: false
        });
      }
      return agent;
    }
    _performExponentialBackoff(retryNumber) {
      retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
      const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
      return new Promise((resolve3) => setTimeout(() => resolve3(), ms));
    }
    static dateTimeDeserializer(key, value) {
      if (typeof value === "string") {
        let a = new Date(value);
        if (!isNaN(a.valueOf())) {
          return a;
        }
      }
      return value;
    }
    async _processResponse(res, options) {
      return new Promise(async (resolve3, reject) => {
        const statusCode = res.message.statusCode;
        const response = {
          statusCode,
          result: null,
          headers: {}
        };
        if (statusCode == HttpCodes.NotFound) {
          resolve3(response);
        }
        let obj;
        let contents;
        try {
          contents = await res.readBody();
          if (contents && contents.length > 0) {
            if (options && options.deserializeDates) {
              obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
            } else {
              obj = JSON.parse(contents);
            }
            response.result = obj;
          }
          response.headers = res.message.headers;
        } catch (err) {
        }
        if (statusCode > 299) {
          let msg;
          if (obj && obj.message) {
            msg = obj.message;
          } else if (contents && contents.length > 0) {
            msg = contents;
          } else {
            msg = "Failed request: (" + statusCode + ")";
          }
          let err = new Error(msg);
          err["statusCode"] = statusCode;
          if (response.result) {
            err["result"] = response.result;
          }
          reject(err);
        } else {
          resolve3(response);
        }
      });
    }
  };
  exports.HttpClient = HttpClient;
});

// node_modules/@actions/github/lib/internal/utils.js
var require_utils2 = __commonJS((exports) => {
  "use strict";
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
  var httpClient = __importStar(require_http_client());
  function getAuthString(token, options) {
    if (!token && !options.auth) {
      throw new Error("Parameter token or opts.auth is required");
    } else if (token && options.auth) {
      throw new Error("Parameters token and opts.auth may not both be specified");
    }
    return typeof options.auth === "string" ? options.auth : `token ${token}`;
  }
  exports.getAuthString = getAuthString;
  function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
  }
  exports.getProxyAgent = getProxyAgent;
  function getApiBaseUrl() {
    return process.env["GITHUB_API_URL"] || "https://api.github.com";
  }
  exports.getApiBaseUrl = getApiBaseUrl;
});

// node_modules/universal-user-agent/dist-node/index.js
var require_dist_node = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function getUserAgent() {
    if (typeof navigator === "object" && "userAgent" in navigator) {
      return navigator.userAgent;
    }
    if (typeof process === "object" && "version" in process) {
      return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
    }
    return "<environment undetectable>";
  }
  exports.getUserAgent = getUserAgent;
});

// node_modules/before-after-hook/lib/register.js
var require_register = __commonJS((exports, module2) => {
  module2.exports = register;
  function register(state, name, method, options) {
    if (typeof method !== "function") {
      throw new Error("method for before hook must be a function");
    }
    if (!options) {
      options = {};
    }
    if (Array.isArray(name)) {
      return name.reverse().reduce(function(callback, name2) {
        return register.bind(null, state, name2, callback, options);
      }, method)();
    }
    return Promise.resolve().then(function() {
      if (!state.registry[name]) {
        return method(options);
      }
      return state.registry[name].reduce(function(method2, registered) {
        return registered.hook.bind(null, method2, options);
      }, method)();
    });
  }
});

// node_modules/before-after-hook/lib/add.js
var require_add = __commonJS((exports, module2) => {
  module2.exports = addHook;
  function addHook(state, kind, name, hook) {
    var orig = hook;
    if (!state.registry[name]) {
      state.registry[name] = [];
    }
    if (kind === "before") {
      hook = function(method, options) {
        return Promise.resolve().then(orig.bind(null, options)).then(method.bind(null, options));
      };
    }
    if (kind === "after") {
      hook = function(method, options) {
        var result;
        return Promise.resolve().then(method.bind(null, options)).then(function(result_) {
          result = result_;
          return orig(result, options);
        }).then(function() {
          return result;
        });
      };
    }
    if (kind === "error") {
      hook = function(method, options) {
        return Promise.resolve().then(method.bind(null, options)).catch(function(error3) {
          return orig(error3, options);
        });
      };
    }
    state.registry[name].push({
      hook,
      orig
    });
  }
});

// node_modules/before-after-hook/lib/remove.js
var require_remove = __commonJS((exports, module2) => {
  module2.exports = removeHook;
  function removeHook(state, name, method) {
    if (!state.registry[name]) {
      return;
    }
    var index = state.registry[name].map(function(registered) {
      return registered.orig;
    }).indexOf(method);
    if (index === -1) {
      return;
    }
    state.registry[name].splice(index, 1);
  }
});

// node_modules/before-after-hook/index.js
var require_before_after_hook = __commonJS((exports, module2) => {
  var register = require_register();
  var addHook = require_add();
  var removeHook = require_remove();
  var bind = Function.bind;
  var bindable = bind.bind(bind);
  function bindApi(hook, state, name) {
    var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state]);
    hook.api = {remove: removeHookRef};
    hook.remove = removeHookRef;
    ["before", "error", "after", "wrap"].forEach(function(kind) {
      var args = name ? [state, kind, name] : [state, kind];
      hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
    });
  }
  function HookSingular() {
    var singularHookName = "h";
    var singularHookState = {
      registry: {}
    };
    var singularHook = register.bind(null, singularHookState, singularHookName);
    bindApi(singularHook, singularHookState, singularHookName);
    return singularHook;
  }
  function HookCollection() {
    var state = {
      registry: {}
    };
    var hook = register.bind(null, state);
    bindApi(hook, state);
    return hook;
  }
  var collectionHookDeprecationMessageDisplayed = false;
  function Hook() {
    if (!collectionHookDeprecationMessageDisplayed) {
      console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4');
      collectionHookDeprecationMessageDisplayed = true;
    }
    return HookCollection();
  }
  Hook.Singular = HookSingular.bind();
  Hook.Collection = HookCollection.bind();
  module2.exports = Hook;
  module2.exports.Hook = Hook;
  module2.exports.Singular = Hook.Singular;
  module2.exports.Collection = Hook.Collection;
});

// node_modules/is-plain-object/dist/is-plain-object.js
var require_is_plain_object = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  /*!
   * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isPlainObject(o) {
    var ctor, prot;
    if (isObject(o) === false)
      return false;
    ctor = o.constructor;
    if (ctor === void 0)
      return true;
    prot = ctor.prototype;
    if (isObject(prot) === false)
      return false;
    if (prot.hasOwnProperty("isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  exports.isPlainObject = isPlainObject;
});

// node_modules/@octokit/endpoint/dist-node/index.js
var require_dist_node2 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var isPlainObject = require_is_plain_object();
  var universalUserAgent = require_dist_node();
  function lowercaseKeys(object) {
    if (!object) {
      return {};
    }
    return Object.keys(object).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = object[key];
      return newObj;
    }, {});
  }
  function mergeDeep(defaults, options) {
    const result = Object.assign({}, defaults);
    Object.keys(options).forEach((key) => {
      if (isPlainObject.isPlainObject(options[key])) {
        if (!(key in defaults))
          Object.assign(result, {
            [key]: options[key]
          });
        else
          result[key] = mergeDeep(defaults[key], options[key]);
      } else {
        Object.assign(result, {
          [key]: options[key]
        });
      }
    });
    return result;
  }
  function removeUndefinedProperties(obj) {
    for (const key in obj) {
      if (obj[key] === void 0) {
        delete obj[key];
      }
    }
    return obj;
  }
  function merge(defaults, route, options) {
    if (typeof route === "string") {
      let [method, url] = route.split(" ");
      options = Object.assign(url ? {
        method,
        url
      } : {
        url: method
      }, options);
    } else {
      options = Object.assign({}, route);
    }
    options.headers = lowercaseKeys(options.headers);
    removeUndefinedProperties(options);
    removeUndefinedProperties(options.headers);
    const mergedOptions = mergeDeep(defaults || {}, options);
    if (defaults && defaults.mediaType.previews.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter((preview) => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map((preview) => preview.replace(/-preview/, ""));
    return mergedOptions;
  }
  function addQueryParameters(url, parameters) {
    const separator = /\?/.test(url) ? "&" : "?";
    const names = Object.keys(parameters);
    if (names.length === 0) {
      return url;
    }
    return url + separator + names.map((name) => {
      if (name === "q") {
        return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
      }
      return `${name}=${encodeURIComponent(parameters[name])}`;
    }).join("&");
  }
  var urlVariableRegex = /\{[^}]+\}/g;
  function removeNonChars(variableName) {
    return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
  }
  function extractUrlVariableNames(url) {
    const matches = url.match(urlVariableRegex);
    if (!matches) {
      return [];
    }
    return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
  }
  function omit(object, keysToOmit) {
    return Object.keys(object).filter((option) => !keysToOmit.includes(option)).reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  }
  function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
      if (!/%[0-9A-Fa-f]/.test(part)) {
        part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
      }
      return part;
    }).join("");
  }
  function encodeUnreserved(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  function encodeValue(operator, value, key) {
    value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
    if (key) {
      return encodeUnreserved(key) + "=" + value;
    } else {
      return value;
    }
  }
  function isDefined(value) {
    return value !== void 0 && value !== null;
  }
  function isKeyOperator(operator) {
    return operator === ";" || operator === "&" || operator === "?";
  }
  function getValues(context2, operator, key, modifier) {
    var value = context2[key], result = [];
    if (isDefined(value) && value !== "") {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        value = value.toString();
        if (modifier && modifier !== "*") {
          value = value.substring(0, parseInt(modifier, 10));
        }
        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
      } else {
        if (modifier === "*") {
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              result.push(encodeValue(operator, value2, isKeyOperator(operator) ? key : ""));
            });
          } else {
            Object.keys(value).forEach(function(k) {
              if (isDefined(value[k])) {
                result.push(encodeValue(operator, value[k], k));
              }
            });
          }
        } else {
          const tmp = [];
          if (Array.isArray(value)) {
            value.filter(isDefined).forEach(function(value2) {
              tmp.push(encodeValue(operator, value2));
            });
          } else {
            Object.keys(value).forEach(function(k) {
              if (isDefined(value[k])) {
                tmp.push(encodeUnreserved(k));
                tmp.push(encodeValue(operator, value[k].toString()));
              }
            });
          }
          if (isKeyOperator(operator)) {
            result.push(encodeUnreserved(key) + "=" + tmp.join(","));
          } else if (tmp.length !== 0) {
            result.push(tmp.join(","));
          }
        }
      }
    } else {
      if (operator === ";") {
        if (isDefined(value)) {
          result.push(encodeUnreserved(key));
        }
      } else if (value === "" && (operator === "&" || operator === "?")) {
        result.push(encodeUnreserved(key) + "=");
      } else if (value === "") {
        result.push("");
      }
    }
    return result;
  }
  function parseUrl(template) {
    return {
      expand: expand.bind(null, template)
    };
  }
  function expand(template, context2) {
    var operators = ["+", "#", ".", "/", ";", "?", "&"];
    return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context2, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    });
  }
  function parse2(options) {
    let method = options.method.toUpperCase();
    let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
    let headers = Object.assign({}, options.headers);
    let body;
    let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]);
    const urlVariableNames = extractUrlVariableNames(url);
    url = parseUrl(url).expand(parameters);
    if (!/^http/.test(url)) {
      url = options.baseUrl + url;
    }
    const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
    const remainingParameters = omit(parameters, omittedParameters);
    const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
    if (!isBinaryRequest) {
      if (options.mediaType.format) {
        headers.accept = headers.accept.split(/,/).map((preview) => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
      }
      if (options.mediaType.previews.length) {
        const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
    if (["GET", "HEAD"].includes(method)) {
      url = addQueryParameters(url, remainingParameters);
    } else {
      if ("data" in remainingParameters) {
        body = remainingParameters.data;
      } else {
        if (Object.keys(remainingParameters).length) {
          body = remainingParameters;
        } else {
          headers["content-length"] = 0;
        }
      }
    }
    if (!headers["content-type"] && typeof body !== "undefined") {
      headers["content-type"] = "application/json; charset=utf-8";
    }
    if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
      body = "";
    }
    return Object.assign({
      method,
      url,
      headers
    }, typeof body !== "undefined" ? {
      body
    } : null, options.request ? {
      request: options.request
    } : null);
  }
  function endpointWithDefaults(defaults, route, options) {
    return parse2(merge(defaults, route, options));
  }
  function withDefaults(oldDefaults, newDefaults) {
    const DEFAULTS2 = merge(oldDefaults, newDefaults);
    const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
    return Object.assign(endpoint2, {
      DEFAULTS: DEFAULTS2,
      defaults: withDefaults.bind(null, DEFAULTS2),
      merge: merge.bind(null, DEFAULTS2),
      parse: parse2
    });
  }
  var VERSION = "6.0.9";
  var userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`;
  var DEFAULTS = {
    method: "GET",
    baseUrl: "https://api.github.com",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent
    },
    mediaType: {
      format: "",
      previews: []
    }
  };
  var endpoint = withDefaults(null, DEFAULTS);
  exports.endpoint = endpoint;
});

// node_modules/node-fetch/lib/index.js
var require_lib = __commonJS((exports, module2) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var Stream2 = _interopDefault(require("stream"));
  var http = _interopDefault(require("http"));
  var Url = _interopDefault(require("url"));
  var https2 = _interopDefault(require("https"));
  var zlib = _interopDefault(require("zlib"));
  var Readable = Stream2.Readable;
  var BUFFER = Symbol("buffer");
  var TYPE = Symbol("type");
  var Blob = class {
    constructor() {
      this[TYPE] = "";
      const blobParts = arguments[0];
      const options = arguments[1];
      const buffers = [];
      let size = 0;
      if (blobParts) {
        const a = blobParts;
        const length = Number(a.length);
        for (let i = 0; i < length; i++) {
          const element = a[i];
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element[BUFFER];
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size += buffer.length;
          buffers.push(buffer);
        }
      }
      this[BUFFER] = Buffer.concat(buffers);
      let type = options && options.type !== void 0 && String(options.type).toLowerCase();
      if (type && !/[^\u0020-\u007E]/.test(type)) {
        this[TYPE] = type;
      }
    }
    get size() {
      return this[BUFFER].length;
    }
    get type() {
      return this[TYPE];
    }
    text() {
      return Promise.resolve(this[BUFFER].toString());
    }
    arrayBuffer() {
      const buf = this[BUFFER];
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      return Promise.resolve(ab);
    }
    stream() {
      const readable = new Readable();
      readable._read = function() {
      };
      readable.push(this[BUFFER]);
      readable.push(null);
      return readable;
    }
    toString() {
      return "[object Blob]";
    }
    slice() {
      const size = this.size;
      const start = arguments[0];
      const end = arguments[1];
      let relativeStart, relativeEnd;
      if (start === void 0) {
        relativeStart = 0;
      } else if (start < 0) {
        relativeStart = Math.max(size + start, 0);
      } else {
        relativeStart = Math.min(start, size);
      }
      if (end === void 0) {
        relativeEnd = size;
      } else if (end < 0) {
        relativeEnd = Math.max(size + end, 0);
      } else {
        relativeEnd = Math.min(end, size);
      }
      const span = Math.max(relativeEnd - relativeStart, 0);
      const buffer = this[BUFFER];
      const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
      const blob = new Blob([], {type: arguments[2]});
      blob[BUFFER] = slicedBuffer;
      return blob;
    }
  };
  Object.defineProperties(Blob.prototype, {
    size: {enumerable: true},
    type: {enumerable: true},
    slice: {enumerable: true}
  });
  Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
    value: "Blob",
    writable: false,
    enumerable: false,
    configurable: true
  });
  function FetchError(message, type, systemError) {
    Error.call(this, message);
    this.message = message;
    this.type = type;
    if (systemError) {
      this.code = this.errno = systemError.code;
    }
    Error.captureStackTrace(this, this.constructor);
  }
  FetchError.prototype = Object.create(Error.prototype);
  FetchError.prototype.constructor = FetchError;
  FetchError.prototype.name = "FetchError";
  var convert;
  try {
    convert = require("encoding").convert;
  } catch (e) {
  }
  var INTERNALS = Symbol("Body internals");
  var PassThrough = Stream2.PassThrough;
  function Body(body) {
    var _this = this;
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
    let size = _ref$size === void 0 ? 0 : _ref$size;
    var _ref$timeout = _ref.timeout;
    let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
    if (body == null) {
      body = null;
    } else if (isURLSearchParams(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof Stream2)
      ;
    else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS] = {
      body,
      disturbed: false,
      error: null
    };
    this.size = size;
    this.timeout = timeout;
    if (body instanceof Stream2) {
      body.on("error", function(err) {
        const error3 = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
        _this[INTERNALS].error = error3;
      });
    }
  }
  Body.prototype = {
    get body() {
      return this[INTERNALS].body;
    },
    get bodyUsed() {
      return this[INTERNALS].disturbed;
    },
    arrayBuffer() {
      return consumeBody.call(this).then(function(buf) {
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      });
    },
    blob() {
      let ct = this.headers && this.headers.get("content-type") || "";
      return consumeBody.call(this).then(function(buf) {
        return Object.assign(new Blob([], {
          type: ct.toLowerCase()
        }), {
          [BUFFER]: buf
        });
      });
    },
    json() {
      var _this2 = this;
      return consumeBody.call(this).then(function(buffer) {
        try {
          return JSON.parse(buffer.toString());
        } catch (err) {
          return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
        }
      });
    },
    text() {
      return consumeBody.call(this).then(function(buffer) {
        return buffer.toString();
      });
    },
    buffer() {
      return consumeBody.call(this);
    },
    textConverted() {
      var _this3 = this;
      return consumeBody.call(this).then(function(buffer) {
        return convertBody(buffer, _this3.headers);
      });
    }
  };
  Object.defineProperties(Body.prototype, {
    body: {enumerable: true},
    bodyUsed: {enumerable: true},
    arrayBuffer: {enumerable: true},
    blob: {enumerable: true},
    json: {enumerable: true},
    text: {enumerable: true}
  });
  Body.mixIn = function(proto) {
    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
      if (!(name in proto)) {
        const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
        Object.defineProperty(proto, name, desc);
      }
    }
  };
  function consumeBody() {
    var _this4 = this;
    if (this[INTERNALS].disturbed) {
      return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
    }
    this[INTERNALS].disturbed = true;
    if (this[INTERNALS].error) {
      return Body.Promise.reject(this[INTERNALS].error);
    }
    let body = this.body;
    if (body === null) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }
    if (isBlob(body)) {
      body = body.stream();
    }
    if (Buffer.isBuffer(body)) {
      return Body.Promise.resolve(body);
    }
    if (!(body instanceof Stream2)) {
      return Body.Promise.resolve(Buffer.alloc(0));
    }
    let accum = [];
    let accumBytes = 0;
    let abort = false;
    return new Body.Promise(function(resolve3, reject) {
      let resTimeout;
      if (_this4.timeout) {
        resTimeout = setTimeout(function() {
          abort = true;
          reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
        }, _this4.timeout);
      }
      body.on("error", function(err) {
        if (err.name === "AbortError") {
          abort = true;
          reject(err);
        } else {
          reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
        }
      });
      body.on("data", function(chunk) {
        if (abort || chunk === null) {
          return;
        }
        if (_this4.size && accumBytes + chunk.length > _this4.size) {
          abort = true;
          reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
          return;
        }
        accumBytes += chunk.length;
        accum.push(chunk);
      });
      body.on("end", function() {
        if (abort) {
          return;
        }
        clearTimeout(resTimeout);
        try {
          resolve3(Buffer.concat(accum, accumBytes));
        } catch (err) {
          reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
        }
      });
    });
  }
  function convertBody(buffer, headers) {
    if (typeof convert !== "function") {
      throw new Error("The package `encoding` must be installed to use the textConverted() function");
    }
    const ct = headers.get("content-type");
    let charset = "utf-8";
    let res, str;
    if (ct) {
      res = /charset=([^;]*)/i.exec(ct);
    }
    str = buffer.slice(0, 1024).toString();
    if (!res && str) {
      res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
    }
    if (!res && str) {
      res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
      if (!res) {
        res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
        if (res) {
          res.pop();
        }
      }
      if (res) {
        res = /charset=(.*)/i.exec(res.pop());
      }
    }
    if (!res && str) {
      res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
    }
    if (res) {
      charset = res.pop();
      if (charset === "gb2312" || charset === "gbk") {
        charset = "gb18030";
      }
    }
    return convert(buffer, "UTF-8", charset).toString();
  }
  function isURLSearchParams(obj) {
    if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
      return false;
    }
    return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
  }
  function isBlob(obj) {
    return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
  }
  function clone(instance) {
    let p1, p2;
    let body = instance.body;
    if (instance.bodyUsed) {
      throw new Error("cannot clone body after it is used");
    }
    if (body instanceof Stream2 && typeof body.getBoundary !== "function") {
      p1 = new PassThrough();
      p2 = new PassThrough();
      body.pipe(p1);
      body.pipe(p2);
      instance[INTERNALS].body = p1;
      body = p2;
    }
    return body;
  }
  function extractContentType(body) {
    if (body === null) {
      return null;
    } else if (typeof body === "string") {
      return "text/plain;charset=UTF-8";
    } else if (isURLSearchParams(body)) {
      return "application/x-www-form-urlencoded;charset=UTF-8";
    } else if (isBlob(body)) {
      return body.type || null;
    } else if (Buffer.isBuffer(body)) {
      return null;
    } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
      return null;
    } else if (ArrayBuffer.isView(body)) {
      return null;
    } else if (typeof body.getBoundary === "function") {
      return `multipart/form-data;boundary=${body.getBoundary()}`;
    } else if (body instanceof Stream2) {
      return null;
    } else {
      return "text/plain;charset=UTF-8";
    }
  }
  function getTotalBytes(instance) {
    const body = instance.body;
    if (body === null) {
      return 0;
    } else if (isBlob(body)) {
      return body.size;
    } else if (Buffer.isBuffer(body)) {
      return body.length;
    } else if (body && typeof body.getLengthSync === "function") {
      if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
        return body.getLengthSync();
      }
      return null;
    } else {
      return null;
    }
  }
  function writeToStream(dest, instance) {
    const body = instance.body;
    if (body === null) {
      dest.end();
    } else if (isBlob(body)) {
      body.stream().pipe(dest);
    } else if (Buffer.isBuffer(body)) {
      dest.write(body);
      dest.end();
    } else {
      body.pipe(dest);
    }
  }
  Body.Promise = global.Promise;
  var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
  var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
  function validateName(name) {
    name = `${name}`;
    if (invalidTokenRegex.test(name) || name === "") {
      throw new TypeError(`${name} is not a legal HTTP header name`);
    }
  }
  function validateValue(value) {
    value = `${value}`;
    if (invalidHeaderCharRegex.test(value)) {
      throw new TypeError(`${value} is not a legal HTTP header value`);
    }
  }
  function find(map, name) {
    name = name.toLowerCase();
    for (const key in map) {
      if (key.toLowerCase() === name) {
        return key;
      }
    }
    return void 0;
  }
  var MAP = Symbol("map");
  var Headers = class {
    constructor() {
      let init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
      this[MAP] = Object.create(null);
      if (init instanceof Headers) {
        const rawHeaders = init.raw();
        const headerNames = Object.keys(rawHeaders);
        for (const headerName of headerNames) {
          for (const value of rawHeaders[headerName]) {
            this.append(headerName, value);
          }
        }
        return;
      }
      if (init == null)
        ;
      else if (typeof init === "object") {
        const method = init[Symbol.iterator];
        if (method != null) {
          if (typeof method !== "function") {
            throw new TypeError("Header pairs must be iterable");
          }
          const pairs = [];
          for (const pair of init) {
            if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
              throw new TypeError("Each header pair must be iterable");
            }
            pairs.push(Array.from(pair));
          }
          for (const pair of pairs) {
            if (pair.length !== 2) {
              throw new TypeError("Each header pair must be a name/value tuple");
            }
            this.append(pair[0], pair[1]);
          }
        } else {
          for (const key of Object.keys(init)) {
            const value = init[key];
            this.append(key, value);
          }
        }
      } else {
        throw new TypeError("Provided initializer must be an object");
      }
    }
    get(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key === void 0) {
        return null;
      }
      return this[MAP][key].join(", ");
    }
    forEach(callback) {
      let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
      let pairs = getHeaders(this);
      let i = 0;
      while (i < pairs.length) {
        var _pairs$i = pairs[i];
        const name = _pairs$i[0], value = _pairs$i[1];
        callback.call(thisArg, value, name, this);
        pairs = getHeaders(this);
        i++;
      }
    }
    set(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      this[MAP][key !== void 0 ? key : name] = [value];
    }
    append(name, value) {
      name = `${name}`;
      value = `${value}`;
      validateName(name);
      validateValue(value);
      const key = find(this[MAP], name);
      if (key !== void 0) {
        this[MAP][key].push(value);
      } else {
        this[MAP][name] = [value];
      }
    }
    has(name) {
      name = `${name}`;
      validateName(name);
      return find(this[MAP], name) !== void 0;
    }
    delete(name) {
      name = `${name}`;
      validateName(name);
      const key = find(this[MAP], name);
      if (key !== void 0) {
        delete this[MAP][key];
      }
    }
    raw() {
      return this[MAP];
    }
    keys() {
      return createHeadersIterator(this, "key");
    }
    values() {
      return createHeadersIterator(this, "value");
    }
    [Symbol.iterator]() {
      return createHeadersIterator(this, "key+value");
    }
  };
  Headers.prototype.entries = Headers.prototype[Symbol.iterator];
  Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
    value: "Headers",
    writable: false,
    enumerable: false,
    configurable: true
  });
  Object.defineProperties(Headers.prototype, {
    get: {enumerable: true},
    forEach: {enumerable: true},
    set: {enumerable: true},
    append: {enumerable: true},
    has: {enumerable: true},
    delete: {enumerable: true},
    keys: {enumerable: true},
    values: {enumerable: true},
    entries: {enumerable: true}
  });
  function getHeaders(headers) {
    let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
    const keys = Object.keys(headers[MAP]).sort();
    return keys.map(kind === "key" ? function(k) {
      return k.toLowerCase();
    } : kind === "value" ? function(k) {
      return headers[MAP][k].join(", ");
    } : function(k) {
      return [k.toLowerCase(), headers[MAP][k].join(", ")];
    });
  }
  var INTERNAL = Symbol("internal");
  function createHeadersIterator(target, kind) {
    const iterator = Object.create(HeadersIteratorPrototype);
    iterator[INTERNAL] = {
      target,
      kind,
      index: 0
    };
    return iterator;
  }
  var HeadersIteratorPrototype = Object.setPrototypeOf({
    next() {
      if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
        throw new TypeError("Value of `this` is not a HeadersIterator");
      }
      var _INTERNAL = this[INTERNAL];
      const target = _INTERNAL.target, kind = _INTERNAL.kind, index = _INTERNAL.index;
      const values = getHeaders(target, kind);
      const len = values.length;
      if (index >= len) {
        return {
          value: void 0,
          done: true
        };
      }
      this[INTERNAL].index = index + 1;
      return {
        value: values[index],
        done: false
      };
    }
  }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
  Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
    value: "HeadersIterator",
    writable: false,
    enumerable: false,
    configurable: true
  });
  function exportNodeCompatibleHeaders(headers) {
    const obj = Object.assign({__proto__: null}, headers[MAP]);
    const hostHeaderKey = find(headers[MAP], "Host");
    if (hostHeaderKey !== void 0) {
      obj[hostHeaderKey] = obj[hostHeaderKey][0];
    }
    return obj;
  }
  function createHeadersLenient(obj) {
    const headers = new Headers();
    for (const name of Object.keys(obj)) {
      if (invalidTokenRegex.test(name)) {
        continue;
      }
      if (Array.isArray(obj[name])) {
        for (const val of obj[name]) {
          if (invalidHeaderCharRegex.test(val)) {
            continue;
          }
          if (headers[MAP][name] === void 0) {
            headers[MAP][name] = [val];
          } else {
            headers[MAP][name].push(val);
          }
        }
      } else if (!invalidHeaderCharRegex.test(obj[name])) {
        headers[MAP][name] = [obj[name]];
      }
    }
    return headers;
  }
  var INTERNALS$1 = Symbol("Response internals");
  var STATUS_CODES = http.STATUS_CODES;
  var Response = class {
    constructor() {
      let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
      let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      Body.call(this, body, opts);
      const status = opts.status || 200;
      const headers = new Headers(opts.headers);
      if (body != null && !headers.has("Content-Type")) {
        const contentType = extractContentType(body);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      this[INTERNALS$1] = {
        url: opts.url,
        status,
        statusText: opts.statusText || STATUS_CODES[status],
        headers,
        counter: opts.counter
      };
    }
    get url() {
      return this[INTERNALS$1].url || "";
    }
    get status() {
      return this[INTERNALS$1].status;
    }
    get ok() {
      return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
    }
    get redirected() {
      return this[INTERNALS$1].counter > 0;
    }
    get statusText() {
      return this[INTERNALS$1].statusText;
    }
    get headers() {
      return this[INTERNALS$1].headers;
    }
    clone() {
      return new Response(clone(this), {
        url: this.url,
        status: this.status,
        statusText: this.statusText,
        headers: this.headers,
        ok: this.ok,
        redirected: this.redirected
      });
    }
  };
  Body.mixIn(Response.prototype);
  Object.defineProperties(Response.prototype, {
    url: {enumerable: true},
    status: {enumerable: true},
    ok: {enumerable: true},
    redirected: {enumerable: true},
    statusText: {enumerable: true},
    headers: {enumerable: true},
    clone: {enumerable: true}
  });
  Object.defineProperty(Response.prototype, Symbol.toStringTag, {
    value: "Response",
    writable: false,
    enumerable: false,
    configurable: true
  });
  var INTERNALS$2 = Symbol("Request internals");
  var parse_url = Url.parse;
  var format_url = Url.format;
  var streamDestructionSupported = "destroy" in Stream2.Readable.prototype;
  function isRequest(input) {
    return typeof input === "object" && typeof input[INTERNALS$2] === "object";
  }
  function isAbortSignal(signal) {
    const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
    return !!(proto && proto.constructor.name === "AbortSignal");
  }
  var Request = class {
    constructor(input) {
      let init = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let parsedURL;
      if (!isRequest(input)) {
        if (input && input.href) {
          parsedURL = parse_url(input.href);
        } else {
          parsedURL = parse_url(`${input}`);
        }
        input = {};
      } else {
        parsedURL = parse_url(input.url);
      }
      let method = init.method || input.method || "GET";
      method = method.toUpperCase();
      if ((init.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
        throw new TypeError("Request with GET/HEAD method cannot have body");
      }
      let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;
      Body.call(this, inputBody, {
        timeout: init.timeout || input.timeout || 0,
        size: init.size || input.size || 0
      });
      const headers = new Headers(init.headers || input.headers || {});
      if (inputBody != null && !headers.has("Content-Type")) {
        const contentType = extractContentType(inputBody);
        if (contentType) {
          headers.append("Content-Type", contentType);
        }
      }
      let signal = isRequest(input) ? input.signal : null;
      if ("signal" in init)
        signal = init.signal;
      if (signal != null && !isAbortSignal(signal)) {
        throw new TypeError("Expected signal to be an instanceof AbortSignal");
      }
      this[INTERNALS$2] = {
        method,
        redirect: init.redirect || input.redirect || "follow",
        headers,
        parsedURL,
        signal
      };
      this.follow = init.follow !== void 0 ? init.follow : input.follow !== void 0 ? input.follow : 20;
      this.compress = init.compress !== void 0 ? init.compress : input.compress !== void 0 ? input.compress : true;
      this.counter = init.counter || input.counter || 0;
      this.agent = init.agent || input.agent;
    }
    get method() {
      return this[INTERNALS$2].method;
    }
    get url() {
      return format_url(this[INTERNALS$2].parsedURL);
    }
    get headers() {
      return this[INTERNALS$2].headers;
    }
    get redirect() {
      return this[INTERNALS$2].redirect;
    }
    get signal() {
      return this[INTERNALS$2].signal;
    }
    clone() {
      return new Request(this);
    }
  };
  Body.mixIn(Request.prototype);
  Object.defineProperty(Request.prototype, Symbol.toStringTag, {
    value: "Request",
    writable: false,
    enumerable: false,
    configurable: true
  });
  Object.defineProperties(Request.prototype, {
    method: {enumerable: true},
    url: {enumerable: true},
    headers: {enumerable: true},
    redirect: {enumerable: true},
    clone: {enumerable: true},
    signal: {enumerable: true}
  });
  function getNodeRequestOptions(request) {
    const parsedURL = request[INTERNALS$2].parsedURL;
    const headers = new Headers(request[INTERNALS$2].headers);
    if (!headers.has("Accept")) {
      headers.set("Accept", "*/*");
    }
    if (!parsedURL.protocol || !parsedURL.hostname) {
      throw new TypeError("Only absolute URLs are supported");
    }
    if (!/^https?:$/.test(parsedURL.protocol)) {
      throw new TypeError("Only HTTP(S) protocols are supported");
    }
    if (request.signal && request.body instanceof Stream2.Readable && !streamDestructionSupported) {
      throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
    }
    let contentLengthValue = null;
    if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
      contentLengthValue = "0";
    }
    if (request.body != null) {
      const totalBytes = getTotalBytes(request);
      if (typeof totalBytes === "number") {
        contentLengthValue = String(totalBytes);
      }
    }
    if (contentLengthValue) {
      headers.set("Content-Length", contentLengthValue);
    }
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
    }
    if (request.compress && !headers.has("Accept-Encoding")) {
      headers.set("Accept-Encoding", "gzip,deflate");
    }
    let agent = request.agent;
    if (typeof agent === "function") {
      agent = agent(parsedURL);
    }
    if (!headers.has("Connection") && !agent) {
      headers.set("Connection", "close");
    }
    return Object.assign({}, parsedURL, {
      method: request.method,
      headers: exportNodeCompatibleHeaders(headers),
      agent
    });
  }
  function AbortError(message) {
    Error.call(this, message);
    this.type = "aborted";
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
  AbortError.prototype = Object.create(Error.prototype);
  AbortError.prototype.constructor = AbortError;
  AbortError.prototype.name = "AbortError";
  var PassThrough$1 = Stream2.PassThrough;
  var resolve_url = Url.resolve;
  function fetch(url, opts) {
    if (!fetch.Promise) {
      throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
    }
    Body.Promise = fetch.Promise;
    return new fetch.Promise(function(resolve3, reject) {
      const request = new Request(url, opts);
      const options = getNodeRequestOptions(request);
      const send = (options.protocol === "https:" ? https2 : http).request;
      const signal = request.signal;
      let response = null;
      const abort = function abort2() {
        let error3 = new AbortError("The user aborted a request.");
        reject(error3);
        if (request.body && request.body instanceof Stream2.Readable) {
          request.body.destroy(error3);
        }
        if (!response || !response.body)
          return;
        response.body.emit("error", error3);
      };
      if (signal && signal.aborted) {
        abort();
        return;
      }
      const abortAndFinalize = function abortAndFinalize2() {
        abort();
        finalize();
      };
      const req = send(options);
      let reqTimeout;
      if (signal) {
        signal.addEventListener("abort", abortAndFinalize);
      }
      function finalize() {
        req.abort();
        if (signal)
          signal.removeEventListener("abort", abortAndFinalize);
        clearTimeout(reqTimeout);
      }
      if (request.timeout) {
        req.once("socket", function(socket) {
          reqTimeout = setTimeout(function() {
            reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
            finalize();
          }, request.timeout);
        });
      }
      req.on("error", function(err) {
        reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
        finalize();
      });
      req.on("response", function(res) {
        clearTimeout(reqTimeout);
        const headers = createHeadersLenient(res.headers);
        if (fetch.isRedirect(res.statusCode)) {
          const location = headers.get("Location");
          const locationURL = location === null ? null : resolve_url(request.url, location);
          switch (request.redirect) {
            case "error":
              reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
              finalize();
              return;
            case "manual":
              if (locationURL !== null) {
                try {
                  headers.set("Location", locationURL);
                } catch (err) {
                  reject(err);
                }
              }
              break;
            case "follow":
              if (locationURL === null) {
                break;
              }
              if (request.counter >= request.follow) {
                reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                finalize();
                return;
              }
              const requestOpts = {
                headers: new Headers(request.headers),
                follow: request.follow,
                counter: request.counter + 1,
                agent: request.agent,
                compress: request.compress,
                method: request.method,
                body: request.body,
                signal: request.signal,
                timeout: request.timeout,
                size: request.size
              };
              if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                finalize();
                return;
              }
              if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                requestOpts.method = "GET";
                requestOpts.body = void 0;
                requestOpts.headers.delete("content-length");
              }
              resolve3(fetch(new Request(locationURL, requestOpts)));
              finalize();
              return;
          }
        }
        res.once("end", function() {
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
        });
        let body = res.pipe(new PassThrough$1());
        const response_options = {
          url: request.url,
          status: res.statusCode,
          statusText: res.statusMessage,
          headers,
          size: request.size,
          timeout: request.timeout,
          counter: request.counter
        };
        const codings = headers.get("Content-Encoding");
        if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
          response = new Response(body, response_options);
          resolve3(response);
          return;
        }
        const zlibOptions = {
          flush: zlib.Z_SYNC_FLUSH,
          finishFlush: zlib.Z_SYNC_FLUSH
        };
        if (codings == "gzip" || codings == "x-gzip") {
          body = body.pipe(zlib.createGunzip(zlibOptions));
          response = new Response(body, response_options);
          resolve3(response);
          return;
        }
        if (codings == "deflate" || codings == "x-deflate") {
          const raw = res.pipe(new PassThrough$1());
          raw.once("data", function(chunk) {
            if ((chunk[0] & 15) === 8) {
              body = body.pipe(zlib.createInflate());
            } else {
              body = body.pipe(zlib.createInflateRaw());
            }
            response = new Response(body, response_options);
            resolve3(response);
          });
          return;
        }
        if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
          body = body.pipe(zlib.createBrotliDecompress());
          response = new Response(body, response_options);
          resolve3(response);
          return;
        }
        response = new Response(body, response_options);
        resolve3(response);
      });
      writeToStream(req, request);
    });
  }
  fetch.isRedirect = function(code) {
    return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
  };
  fetch.Promise = global.Promise;
  module2.exports = exports = fetch;
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.default = exports;
  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.FetchError = FetchError;
});

// node_modules/deprecation/dist-node/index.js
var require_dist_node3 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var Deprecation = class extends Error {
    constructor(message) {
      super(message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "Deprecation";
    }
  };
  exports.Deprecation = Deprecation;
});

// node_modules/wrappy/wrappy.js
var require_wrappy = __commonJS((exports, module2) => {
  module2.exports = wrappy;
  function wrappy(fn, cb) {
    if (fn && cb)
      return wrappy(fn)(cb);
    if (typeof fn !== "function")
      throw new TypeError("need wrapper function");
    Object.keys(fn).forEach(function(k) {
      wrapper[k] = fn[k];
    });
    return wrapper;
    function wrapper() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      var ret = fn.apply(this, args);
      var cb2 = args[args.length - 1];
      if (typeof ret === "function" && ret !== cb2) {
        Object.keys(cb2).forEach(function(k) {
          ret[k] = cb2[k];
        });
      }
      return ret;
    }
  }
});

// node_modules/once/once.js
var require_once = __commonJS((exports, module2) => {
  var wrappy = require_wrappy();
  module2.exports = wrappy(once);
  module2.exports.strict = wrappy(onceStrict);
  once.proto = once(function() {
    Object.defineProperty(Function.prototype, "once", {
      value: function() {
        return once(this);
      },
      configurable: true
    });
    Object.defineProperty(Function.prototype, "onceStrict", {
      value: function() {
        return onceStrict(this);
      },
      configurable: true
    });
  });
  function once(fn) {
    var f = function() {
      if (f.called)
        return f.value;
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    f.called = false;
    return f;
  }
  function onceStrict(fn) {
    var f = function() {
      if (f.called)
        throw new Error(f.onceError);
      f.called = true;
      return f.value = fn.apply(this, arguments);
    };
    var name = fn.name || "Function wrapped with `once`";
    f.onceError = name + " shouldn't be called more than once";
    f.called = false;
    return f;
  }
});

// node_modules/@octokit/request-error/dist-node/index.js
var require_dist_node4 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var deprecation = require_dist_node3();
  var once = _interopDefault(require_once());
  var logOnce = once((deprecation2) => console.warn(deprecation2));
  var RequestError = class extends Error {
    constructor(message, statusCode, options) {
      super(message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "HttpError";
      this.status = statusCode;
      Object.defineProperty(this, "code", {
        get() {
          logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
          return statusCode;
        }
      });
      this.headers = options.headers || {};
      const requestCopy = Object.assign({}, options.request);
      if (options.request.headers.authorization) {
        requestCopy.headers = Object.assign({}, options.request.headers, {
          authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
        });
      }
      requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
      this.request = requestCopy;
    }
  };
  exports.RequestError = RequestError;
});

// node_modules/@octokit/request/dist-node/index.js
var require_dist_node5 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  function _interopDefault(ex) {
    return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
  }
  var endpoint = require_dist_node2();
  var universalUserAgent = require_dist_node();
  var isPlainObject = require_is_plain_object();
  var nodeFetch = _interopDefault(require_lib());
  var requestError = require_dist_node4();
  var VERSION = "5.4.10";
  function getBufferResponse(response) {
    return response.arrayBuffer();
  }
  function fetchWrapper(requestOptions) {
    if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }
    let headers = {};
    let status;
    let url;
    const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
    return fetch(requestOptions.url, Object.assign({
      method: requestOptions.method,
      body: requestOptions.body,
      headers: requestOptions.headers,
      redirect: requestOptions.redirect
    }, requestOptions.request)).then((response) => {
      url = response.url;
      status = response.status;
      for (const keyAndValue of response.headers) {
        headers[keyAndValue[0]] = keyAndValue[1];
      }
      if (status === 204 || status === 205) {
        return;
      }
      if (requestOptions.method === "HEAD") {
        if (status < 400) {
          return;
        }
        throw new requestError.RequestError(response.statusText, status, {
          headers,
          request: requestOptions
        });
      }
      if (status === 304) {
        throw new requestError.RequestError("Not modified", status, {
          headers,
          request: requestOptions
        });
      }
      if (status >= 400) {
        return response.text().then((message) => {
          const error3 = new requestError.RequestError(message, status, {
            headers,
            request: requestOptions
          });
          try {
            let responseBody = JSON.parse(error3.message);
            Object.assign(error3, responseBody);
            let errors = responseBody.errors;
            error3.message = error3.message + ": " + errors.map(JSON.stringify).join(", ");
          } catch (e) {
          }
          throw error3;
        });
      }
      const contentType = response.headers.get("content-type");
      if (/application\/json/.test(contentType)) {
        return response.json();
      }
      if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
        return response.text();
      }
      return getBufferResponse(response);
    }).then((data) => {
      return {
        status,
        url,
        headers,
        data
      };
    }).catch((error3) => {
      if (error3 instanceof requestError.RequestError) {
        throw error3;
      }
      throw new requestError.RequestError(error3.message, 500, {
        headers,
        request: requestOptions
      });
    });
  }
  function withDefaults(oldEndpoint, newDefaults) {
    const endpoint2 = oldEndpoint.defaults(newDefaults);
    const newApi = function(route, parameters) {
      const endpointOptions = endpoint2.merge(route, parameters);
      if (!endpointOptions.request || !endpointOptions.request.hook) {
        return fetchWrapper(endpoint2.parse(endpointOptions));
      }
      const request2 = (route2, parameters2) => {
        return fetchWrapper(endpoint2.parse(endpoint2.merge(route2, parameters2)));
      };
      Object.assign(request2, {
        endpoint: endpoint2,
        defaults: withDefaults.bind(null, endpoint2)
      });
      return endpointOptions.request.hook(request2, endpointOptions);
    };
    return Object.assign(newApi, {
      endpoint: endpoint2,
      defaults: withDefaults.bind(null, endpoint2)
    });
  }
  var request = withDefaults(endpoint.endpoint, {
    headers: {
      "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
    }
  });
  exports.request = request;
});

// node_modules/@octokit/graphql/dist-node/index.js
var require_dist_node6 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var request = require_dist_node5();
  var universalUserAgent = require_dist_node();
  var VERSION = "4.5.7";
  var GraphqlError = class extends Error {
    constructor(request2, response) {
      const message = response.data.errors[0].message;
      super(message);
      Object.assign(this, response.data);
      Object.assign(this, {
        headers: response.headers
      });
      this.name = "GraphqlError";
      this.request = request2;
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  };
  var NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
  var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
  function graphql(request2, query, options) {
    if (typeof query === "string" && options && "query" in options) {
      return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
    }
    const parsedOptions = typeof query === "string" ? Object.assign({
      query
    }, options) : query;
    const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
      if (NON_VARIABLE_OPTIONS.includes(key)) {
        result[key] = parsedOptions[key];
        return result;
      }
      if (!result.variables) {
        result.variables = {};
      }
      result.variables[key] = parsedOptions[key];
      return result;
    }, {});
    const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
    if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
      requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
    }
    return request2(requestOptions).then((response) => {
      if (response.data.errors) {
        const headers = {};
        for (const key of Object.keys(response.headers)) {
          headers[key] = response.headers[key];
        }
        throw new GraphqlError(requestOptions, {
          headers,
          data: response.data
        });
      }
      return response.data.data;
    });
  }
  function withDefaults(request$1, newDefaults) {
    const newRequest = request$1.defaults(newDefaults);
    const newApi = (query, options) => {
      return graphql(newRequest, query, options);
    };
    return Object.assign(newApi, {
      defaults: withDefaults.bind(null, newRequest),
      endpoint: request.request.endpoint
    });
  }
  var graphql$1 = withDefaults(request.request, {
    headers: {
      "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
    },
    method: "POST",
    url: "/graphql"
  });
  function withCustomRequest(customRequest) {
    return withDefaults(customRequest, {
      method: "POST",
      url: "/graphql"
    });
  }
  exports.graphql = graphql$1;
  exports.withCustomRequest = withCustomRequest;
});

// node_modules/@octokit/auth-token/dist-node/index.js
var require_dist_node7 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  async function auth(token) {
    const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
    return {
      type: "token",
      token,
      tokenType
    };
  }
  function withAuthorizationPrefix(token) {
    if (token.split(/\./).length === 3) {
      return `bearer ${token}`;
    }
    return `token ${token}`;
  }
  async function hook(token, request, route, parameters) {
    const endpoint = request.endpoint.merge(route, parameters);
    endpoint.headers.authorization = withAuthorizationPrefix(token);
    return request(endpoint);
  }
  var createTokenAuth = function createTokenAuth2(token) {
    if (!token) {
      throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
    }
    if (typeof token !== "string") {
      throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
    }
    token = token.replace(/^(token|bearer) +/i, "");
    return Object.assign(auth.bind(null, token), {
      hook: hook.bind(null, token)
    });
  };
  exports.createTokenAuth = createTokenAuth;
});

// node_modules/@octokit/core/dist-node/index.js
var require_dist_node8 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var universalUserAgent = require_dist_node();
  var beforeAfterHook = require_before_after_hook();
  var request = require_dist_node5();
  var graphql = require_dist_node6();
  var authToken = require_dist_node7();
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null)
      return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0)
        continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null)
      return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0)
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key))
          continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  var VERSION = "3.2.1";
  var Octokit = class {
    constructor(options = {}) {
      const hook = new beforeAfterHook.Collection();
      const requestDefaults = {
        baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
        headers: {},
        request: Object.assign({}, options.request, {
          hook: hook.bind(null, "request")
        }),
        mediaType: {
          previews: [],
          format: ""
        }
      };
      requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");
      if (options.baseUrl) {
        requestDefaults.baseUrl = options.baseUrl;
      }
      if (options.previews) {
        requestDefaults.mediaType.previews = options.previews;
      }
      if (options.timeZone) {
        requestDefaults.headers["time-zone"] = options.timeZone;
      }
      this.request = request.request.defaults(requestDefaults);
      this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
      this.log = Object.assign({
        debug: () => {
        },
        info: () => {
        },
        warn: console.warn.bind(console),
        error: console.error.bind(console)
      }, options.log);
      this.hook = hook;
      if (!options.authStrategy) {
        if (!options.auth) {
          this.auth = async () => ({
            type: "unauthenticated"
          });
        } else {
          const auth = authToken.createTokenAuth(options.auth);
          hook.wrap("request", auth.hook);
          this.auth = auth;
        }
      } else {
        const {
          authStrategy
        } = options, otherOptions = _objectWithoutProperties(options, ["authStrategy"]);
        const auth = authStrategy(Object.assign({
          request: this.request,
          log: this.log,
          octokit: this,
          octokitOptions: otherOptions
        }, options.auth));
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
      const classConstructor = this.constructor;
      classConstructor.plugins.forEach((plugin) => {
        Object.assign(this, plugin(this, options));
      });
    }
    static defaults(defaults) {
      const OctokitWithDefaults = class extends this {
        constructor(...args) {
          const options = args[0] || {};
          if (typeof defaults === "function") {
            super(defaults(options));
            return;
          }
          super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
            userAgent: `${options.userAgent} ${defaults.userAgent}`
          } : null));
        }
      };
      return OctokitWithDefaults;
    }
    static plugin(...newPlugins) {
      var _a;
      const currentPlugins = this.plugins;
      const NewOctokit = (_a = class extends this {
      }, _a.plugins = currentPlugins.concat(newPlugins.filter((plugin) => !currentPlugins.includes(plugin))), _a);
      return NewOctokit;
    }
  };
  Octokit.VERSION = VERSION;
  Octokit.plugins = [];
  exports.Octokit = Octokit;
});

// node_modules/@octokit/plugin-rest-endpoint-methods/dist-node/index.js
var require_dist_node9 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var Endpoints = {
    actions: {
      addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
      cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
      createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
      createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
      createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
      createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
      createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
      createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
      deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
      deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
      deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
      deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
      deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
      deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
      downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
      downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
      downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
      getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
      getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
      getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
      getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
      getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
      getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
      getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
      getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
      getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
      getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
      getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
      getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
      listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
      listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
      listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
      listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
      listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
      listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
      listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
      listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
      listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
      listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
      listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
      listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
      listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
      reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
      removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
      setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"]
    },
    activity: {
      checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
      deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
      deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
      getFeeds: ["GET /feeds"],
      getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
      getThread: ["GET /notifications/threads/{thread_id}"],
      getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
      listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
      listNotificationsForAuthenticatedUser: ["GET /notifications"],
      listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
      listPublicEvents: ["GET /events"],
      listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
      listPublicEventsForUser: ["GET /users/{username}/events/public"],
      listPublicOrgEvents: ["GET /orgs/{org}/events"],
      listReceivedEventsForUser: ["GET /users/{username}/received_events"],
      listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
      listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
      listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
      listReposStarredByAuthenticatedUser: ["GET /user/starred"],
      listReposStarredByUser: ["GET /users/{username}/starred"],
      listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
      listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
      listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
      listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
      markNotificationsAsRead: ["PUT /notifications"],
      markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
      markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
      setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
      setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
      starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
      unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
    },
    apps: {
      addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
      checkToken: ["POST /applications/{client_id}/token"],
      createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
        mediaType: {
          previews: ["corsair"]
        }
      }],
      createFromManifest: ["POST /app-manifests/{code}/conversions"],
      createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
      deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
      deleteInstallation: ["DELETE /app/installations/{installation_id}"],
      deleteToken: ["DELETE /applications/{client_id}/token"],
      getAuthenticated: ["GET /app"],
      getBySlug: ["GET /apps/{app_slug}"],
      getInstallation: ["GET /app/installations/{installation_id}"],
      getOrgInstallation: ["GET /orgs/{org}/installation"],
      getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
      getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
      getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
      getUserInstallation: ["GET /users/{username}/installation"],
      listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
      listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
      listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
      listInstallations: ["GET /app/installations"],
      listInstallationsForAuthenticatedUser: ["GET /user/installations"],
      listPlans: ["GET /marketplace_listing/plans"],
      listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
      listReposAccessibleToInstallation: ["GET /installation/repositories"],
      listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
      listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
      removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
      resetToken: ["PATCH /applications/{client_id}/token"],
      revokeInstallationAccessToken: ["DELETE /installation/token"],
      suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
      unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"]
    },
    billing: {
      getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
      getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
      getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
      getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
      getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
      getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
    },
    checks: {
      create: ["POST /repos/{owner}/{repo}/check-runs", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      createSuite: ["POST /repos/{owner}/{repo}/check-suites", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences", {
        mediaType: {
          previews: ["antiope"]
        }
      }],
      update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", {
        mediaType: {
          previews: ["antiope"]
        }
      }]
    },
    codeScanning: {
      getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
        renamedParameters: {
          alert_id: "alert_number"
        }
      }],
      listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
      listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
      updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
      uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
    },
    codesOfConduct: {
      getAllCodesOfConduct: ["GET /codes_of_conduct", {
        mediaType: {
          previews: ["scarlet-witch"]
        }
      }],
      getConductCode: ["GET /codes_of_conduct/{key}", {
        mediaType: {
          previews: ["scarlet-witch"]
        }
      }],
      getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
        mediaType: {
          previews: ["scarlet-witch"]
        }
      }]
    },
    emojis: {
      get: ["GET /emojis"]
    },
    gists: {
      checkIsStarred: ["GET /gists/{gist_id}/star"],
      create: ["POST /gists"],
      createComment: ["POST /gists/{gist_id}/comments"],
      delete: ["DELETE /gists/{gist_id}"],
      deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
      fork: ["POST /gists/{gist_id}/forks"],
      get: ["GET /gists/{gist_id}"],
      getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
      getRevision: ["GET /gists/{gist_id}/{sha}"],
      list: ["GET /gists"],
      listComments: ["GET /gists/{gist_id}/comments"],
      listCommits: ["GET /gists/{gist_id}/commits"],
      listForUser: ["GET /users/{username}/gists"],
      listForks: ["GET /gists/{gist_id}/forks"],
      listPublic: ["GET /gists/public"],
      listStarred: ["GET /gists/starred"],
      star: ["PUT /gists/{gist_id}/star"],
      unstar: ["DELETE /gists/{gist_id}/star"],
      update: ["PATCH /gists/{gist_id}"],
      updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
    },
    git: {
      createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
      createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
      createRef: ["POST /repos/{owner}/{repo}/git/refs"],
      createTag: ["POST /repos/{owner}/{repo}/git/tags"],
      createTree: ["POST /repos/{owner}/{repo}/git/trees"],
      deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
      getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
      getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
      getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
      getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
      getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
      listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
      updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
    },
    gitignore: {
      getAllTemplates: ["GET /gitignore/templates"],
      getTemplate: ["GET /gitignore/templates/{name}"]
    },
    interactions: {
      getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }],
      setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits", {
        mediaType: {
          previews: ["sombra"]
        }
      }]
    },
    issues: {
      addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
      addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
      create: ["POST /repos/{owner}/{repo}/issues"],
      createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
      createLabel: ["POST /repos/{owner}/{repo}/labels"],
      createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
      deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
      deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
      get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
      getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
      getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
      getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
      list: ["GET /issues"],
      listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
      listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
      listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
      listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
      listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
      listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
        mediaType: {
          previews: ["mockingbird"]
        }
      }],
      listForAuthenticatedUser: ["GET /user/issues"],
      listForOrg: ["GET /orgs/{org}/issues"],
      listForRepo: ["GET /repos/{owner}/{repo}/issues"],
      listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
      listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
      listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
      lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
      removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
      setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
      unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
      update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
      updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
      updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
      updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
    },
    licenses: {
      get: ["GET /licenses/{license}"],
      getAllCommonlyUsed: ["GET /licenses"],
      getForRepo: ["GET /repos/{owner}/{repo}/license"]
    },
    markdown: {
      render: ["POST /markdown"],
      renderRaw: ["POST /markdown/raw", {
        headers: {
          "content-type": "text/plain; charset=utf-8"
        }
      }]
    },
    meta: {
      get: ["GET /meta"]
    },
    migrations: {
      cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
      deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
      getImportStatus: ["GET /repos/{owner}/{repo}/import"],
      getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
      getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listForAuthenticatedUser: ["GET /user/migrations", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listForOrg: ["GET /orgs/{org}/migrations", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
      setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
      startForAuthenticatedUser: ["POST /user/migrations"],
      startForOrg: ["POST /orgs/{org}/migrations"],
      startImport: ["PUT /repos/{owner}/{repo}/import"],
      unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
        mediaType: {
          previews: ["wyandotte"]
        }
      }],
      updateImport: ["PATCH /repos/{owner}/{repo}/import"]
    },
    orgs: {
      blockUser: ["PUT /orgs/{org}/blocks/{username}"],
      checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
      checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
      checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
      convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
      createInvitation: ["POST /orgs/{org}/invitations"],
      createWebhook: ["POST /orgs/{org}/hooks"],
      deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
      get: ["GET /orgs/{org}"],
      getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
      getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
      getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
      list: ["GET /organizations"],
      listAppInstallations: ["GET /orgs/{org}/installations"],
      listBlockedUsers: ["GET /orgs/{org}/blocks"],
      listForAuthenticatedUser: ["GET /user/orgs"],
      listForUser: ["GET /users/{username}/orgs"],
      listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
      listMembers: ["GET /orgs/{org}/members"],
      listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
      listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
      listPendingInvitations: ["GET /orgs/{org}/invitations"],
      listPublicMembers: ["GET /orgs/{org}/public_members"],
      listWebhooks: ["GET /orgs/{org}/hooks"],
      pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
      removeMember: ["DELETE /orgs/{org}/members/{username}"],
      removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
      removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
      removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
      setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
      setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
      unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
      update: ["PATCH /orgs/{org}"],
      updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
      updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"]
    },
    projects: {
      addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createCard: ["POST /projects/columns/{column_id}/cards", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createColumn: ["POST /projects/{project_id}/columns", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createForAuthenticatedUser: ["POST /user/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createForOrg: ["POST /orgs/{org}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      createForRepo: ["POST /repos/{owner}/{repo}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      delete: ["DELETE /projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      deleteColumn: ["DELETE /projects/columns/{column_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      get: ["GET /projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      getCard: ["GET /projects/columns/cards/{card_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      getColumn: ["GET /projects/columns/{column_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listCards: ["GET /projects/columns/{column_id}/cards", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listCollaborators: ["GET /projects/{project_id}/collaborators", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listColumns: ["GET /projects/{project_id}/columns", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listForOrg: ["GET /orgs/{org}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listForRepo: ["GET /repos/{owner}/{repo}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listForUser: ["GET /users/{username}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      moveColumn: ["POST /projects/columns/{column_id}/moves", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      update: ["PATCH /projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      updateCard: ["PATCH /projects/columns/cards/{card_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      updateColumn: ["PATCH /projects/columns/{column_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }]
    },
    pulls: {
      checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      create: ["POST /repos/{owner}/{repo}/pulls"],
      createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
      createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
      deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
      deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
      dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
      get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
      getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
      getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
      list: ["GET /repos/{owner}/{repo}/pulls"],
      listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
      listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
      listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
      listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
      listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
      listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
      listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
      merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
      removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
      requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
      submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
      update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
      updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
        mediaType: {
          previews: ["lydian"]
        }
      }],
      updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
      updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
    },
    rateLimit: {
      get: ["GET /rate_limit"]
    },
    reactions: {
      createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      deleteLegacy: ["DELETE /reactions/{reaction_id}", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }, {
        deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy"
      }],
      listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }],
      listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
        mediaType: {
          previews: ["squirrel-girl"]
        }
      }]
    },
    repos: {
      acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
      addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
        mapToData: "apps"
      }],
      addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
      addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
        mapToData: "contexts"
      }],
      addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
        mapToData: "teams"
      }],
      addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
        mapToData: "users"
      }],
      checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
      checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
        mediaType: {
          previews: ["dorian"]
        }
      }],
      compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
      createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
      createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
        mediaType: {
          previews: ["zzzax"]
        }
      }],
      createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
      createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
      createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
      createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
      createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
      createForAuthenticatedUser: ["POST /user/repos"],
      createFork: ["POST /repos/{owner}/{repo}/forks"],
      createInOrg: ["POST /orgs/{org}/repos"],
      createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
      createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
        mediaType: {
          previews: ["switcheroo"]
        }
      }],
      createRelease: ["POST /repos/{owner}/{repo}/releases"],
      createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
        mediaType: {
          previews: ["baptiste"]
        }
      }],
      createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
      declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
      delete: ["DELETE /repos/{owner}/{repo}"],
      deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
      deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
      deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
      deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
      deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
        mediaType: {
          previews: ["zzzax"]
        }
      }],
      deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
      deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
      deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
      deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
      deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
        mediaType: {
          previews: ["switcheroo"]
        }
      }],
      deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
      deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
      deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
      disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
        mediaType: {
          previews: ["london"]
        }
      }],
      disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
        mediaType: {
          previews: ["dorian"]
        }
      }],
      downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
      enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
        mediaType: {
          previews: ["london"]
        }
      }],
      enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
        mediaType: {
          previews: ["dorian"]
        }
      }],
      get: ["GET /repos/{owner}/{repo}"],
      getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
      getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
      getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
      getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
        mediaType: {
          previews: ["mercy"]
        }
      }],
      getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
      getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
      getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
      getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
      getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
      getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
      getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
      getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
      getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
      getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
      getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
        mediaType: {
          previews: ["zzzax"]
        }
      }],
      getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile", {
        mediaType: {
          previews: ["black-panther"]
        }
      }],
      getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
      getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
      getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
      getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
      getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
      getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
      getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
      getPages: ["GET /repos/{owner}/{repo}/pages"],
      getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
      getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
      getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
      getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
      getReadme: ["GET /repos/{owner}/{repo}/readme"],
      getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
      getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
      getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
      getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
      getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
      getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
      getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
      getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
      getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
      listBranches: ["GET /repos/{owner}/{repo}/branches"],
      listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
        mediaType: {
          previews: ["groot"]
        }
      }],
      listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
      listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
      listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
      listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
      listCommits: ["GET /repos/{owner}/{repo}/commits"],
      listContributors: ["GET /repos/{owner}/{repo}/contributors"],
      listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
      listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
      listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
      listForAuthenticatedUser: ["GET /user/repos"],
      listForOrg: ["GET /orgs/{org}/repos"],
      listForUser: ["GET /users/{username}/repos"],
      listForks: ["GET /repos/{owner}/{repo}/forks"],
      listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
      listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
      listLanguages: ["GET /repos/{owner}/{repo}/languages"],
      listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
      listPublic: ["GET /repositories"],
      listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
        mediaType: {
          previews: ["groot"]
        }
      }],
      listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
      listReleases: ["GET /repos/{owner}/{repo}/releases"],
      listTags: ["GET /repos/{owner}/{repo}/tags"],
      listTeams: ["GET /repos/{owner}/{repo}/teams"],
      listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
      merge: ["POST /repos/{owner}/{repo}/merges"],
      pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
      removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
        mapToData: "apps"
      }],
      removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
      removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
        mapToData: "contexts"
      }],
      removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
      removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
        mapToData: "teams"
      }],
      removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
        mapToData: "users"
      }],
      replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
        mediaType: {
          previews: ["mercy"]
        }
      }],
      requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
      setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
      setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
        mapToData: "apps"
      }],
      setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
        mapToData: "contexts"
      }],
      setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
        mapToData: "teams"
      }],
      setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
        mapToData: "users"
      }],
      testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
      transfer: ["POST /repos/{owner}/{repo}/transfer"],
      update: ["PATCH /repos/{owner}/{repo}"],
      updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
      updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
      updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
      updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
      updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
      updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
      updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
      updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
      updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
      uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
        baseUrl: "https://uploads.github.com"
      }]
    },
    search: {
      code: ["GET /search/code"],
      commits: ["GET /search/commits", {
        mediaType: {
          previews: ["cloak"]
        }
      }],
      issuesAndPullRequests: ["GET /search/issues"],
      labels: ["GET /search/labels"],
      repos: ["GET /search/repositories"],
      topics: ["GET /search/topics", {
        mediaType: {
          previews: ["mercy"]
        }
      }],
      users: ["GET /search/users"]
    },
    teams: {
      addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
      addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
      checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
      create: ["POST /orgs/{org}/teams"],
      createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
      createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
      deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
      deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
      deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
      getByName: ["GET /orgs/{org}/teams/{team_slug}"],
      getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
      getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
      getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
      list: ["GET /orgs/{org}/teams"],
      listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
      listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
      listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
      listForAuthenticatedUser: ["GET /user/teams"],
      listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
      listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
      listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
        mediaType: {
          previews: ["inertia"]
        }
      }],
      listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
      removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
      removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
      removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
      updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
      updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
      updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
    },
    users: {
      addEmailForAuthenticated: ["POST /user/emails"],
      block: ["PUT /user/blocks/{username}"],
      checkBlocked: ["GET /user/blocks/{username}"],
      checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
      checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
      createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
      createPublicSshKeyForAuthenticated: ["POST /user/keys"],
      deleteEmailForAuthenticated: ["DELETE /user/emails"],
      deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
      deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
      follow: ["PUT /user/following/{username}"],
      getAuthenticated: ["GET /user"],
      getByUsername: ["GET /users/{username}"],
      getContextForUser: ["GET /users/{username}/hovercard"],
      getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
      getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
      list: ["GET /users"],
      listBlockedByAuthenticated: ["GET /user/blocks"],
      listEmailsForAuthenticated: ["GET /user/emails"],
      listFollowedByAuthenticated: ["GET /user/following"],
      listFollowersForAuthenticatedUser: ["GET /user/followers"],
      listFollowersForUser: ["GET /users/{username}/followers"],
      listFollowingForUser: ["GET /users/{username}/following"],
      listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
      listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
      listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
      listPublicKeysForUser: ["GET /users/{username}/keys"],
      listPublicSshKeysForAuthenticated: ["GET /user/keys"],
      setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
      unblock: ["DELETE /user/blocks/{username}"],
      unfollow: ["DELETE /user/following/{username}"],
      updateAuthenticated: ["PATCH /user"]
    }
  };
  var VERSION = "4.2.1";
  function endpointsToMethods(octokit, endpointsMap) {
    const newMethods = {};
    for (const [scope, endpoints] of Object.entries(endpointsMap)) {
      for (const [methodName, endpoint] of Object.entries(endpoints)) {
        const [route, defaults, decorations] = endpoint;
        const [method, url] = route.split(/ /);
        const endpointDefaults = Object.assign({
          method,
          url
        }, defaults);
        if (!newMethods[scope]) {
          newMethods[scope] = {};
        }
        const scopeMethods = newMethods[scope];
        if (decorations) {
          scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
          continue;
        }
        scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
      }
    }
    return newMethods;
  }
  function decorate(octokit, scope, methodName, defaults, decorations) {
    const requestWithDefaults = octokit.request.defaults(defaults);
    function withDecorations(...args) {
      let options = requestWithDefaults.endpoint.merge(...args);
      if (decorations.mapToData) {
        options = Object.assign({}, options, {
          data: options[decorations.mapToData],
          [decorations.mapToData]: void 0
        });
        return requestWithDefaults(options);
      }
      if (decorations.renamed) {
        const [newScope, newMethodName] = decorations.renamed;
        octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
      }
      if (decorations.deprecated) {
        octokit.log.warn(decorations.deprecated);
      }
      if (decorations.renamedParameters) {
        const options2 = requestWithDefaults.endpoint.merge(...args);
        for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
          if (name in options2) {
            octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);
            if (!(alias in options2)) {
              options2[alias] = options2[name];
            }
            delete options2[name];
          }
        }
        return requestWithDefaults(options2);
      }
      return requestWithDefaults(...args);
    }
    return Object.assign(withDecorations, requestWithDefaults);
  }
  function restEndpointMethods(octokit) {
    return endpointsToMethods(octokit, Endpoints);
  }
  restEndpointMethods.VERSION = VERSION;
  exports.restEndpointMethods = restEndpointMethods;
});

// node_modules/@octokit/plugin-paginate-rest/dist-node/index.js
var require_dist_node10 = __commonJS((exports) => {
  "use strict";
  Object.defineProperty(exports, "__esModule", {value: true});
  var VERSION = "2.6.0";
  function normalizePaginatedListResponse(response) {
    const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
    if (!responseNeedsNormalization)
      return response;
    const incompleteResults = response.data.incomplete_results;
    const repositorySelection = response.data.repository_selection;
    const totalCount = response.data.total_count;
    delete response.data.incomplete_results;
    delete response.data.repository_selection;
    delete response.data.total_count;
    const namespaceKey = Object.keys(response.data)[0];
    const data = response.data[namespaceKey];
    response.data = data;
    if (typeof incompleteResults !== "undefined") {
      response.data.incomplete_results = incompleteResults;
    }
    if (typeof repositorySelection !== "undefined") {
      response.data.repository_selection = repositorySelection;
    }
    response.data.total_count = totalCount;
    return response;
  }
  function iterator(octokit, route, parameters) {
    const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
    const requestMethod = typeof route === "function" ? route : octokit.request;
    const method = options.method;
    const headers = options.headers;
    let url = options.url;
    return {
      [Symbol.asyncIterator]: () => ({
        async next() {
          if (!url)
            return {
              done: true
            };
          const response = await requestMethod({
            method,
            url,
            headers
          });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: normalizedResponse
          };
        }
      })
    };
  }
  function paginate(octokit, route, parameters, mapFn) {
    if (typeof parameters === "function") {
      mapFn = parameters;
      parameters = void 0;
    }
    return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
  }
  function gather(octokit, results, iterator2, mapFn) {
    return iterator2.next().then((result) => {
      if (result.done) {
        return results;
      }
      let earlyExit = false;
      function done() {
        earlyExit = true;
      }
      results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);
      if (earlyExit) {
        return results;
      }
      return gather(octokit, results, iterator2, mapFn);
    });
  }
  var composePaginateRest = Object.assign(paginate, {
    iterator
  });
  function paginateRest(octokit) {
    return {
      paginate: Object.assign(paginate.bind(null, octokit), {
        iterator: iterator.bind(null, octokit)
      })
    };
  }
  paginateRest.VERSION = VERSION;
  exports.composePaginateRest = composePaginateRest;
  exports.paginateRest = paginateRest;
});

// node_modules/@actions/github/lib/utils.js
var require_utils3 = __commonJS((exports) => {
  "use strict";
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
  var Context = __importStar(require_context());
  var Utils = __importStar(require_utils2());
  var core_1 = require_dist_node8();
  var plugin_rest_endpoint_methods_1 = require_dist_node9();
  var plugin_paginate_rest_1 = require_dist_node10();
  exports.context = new Context.Context();
  var baseUrl = Utils.getApiBaseUrl();
  var defaults = {
    baseUrl,
    request: {
      agent: Utils.getProxyAgent(baseUrl)
    }
  };
  exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
  function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {});
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
      opts.auth = auth;
    }
    return opts;
  }
  exports.getOctokitOptions = getOctokitOptions;
});

// node_modules/@actions/github/lib/github.js
var require_github = __commonJS((exports) => {
  "use strict";
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.getOctokit = exports.context = void 0;
  var Context = __importStar(require_context());
  var utils_1 = require_utils3();
  exports.context = new Context.Context();
  function getOctokit2(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
  }
  exports.getOctokit = getOctokit2;
});

// node_modules/@actions/io/lib/io-util.js
var require_io_util = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var _a;
  Object.defineProperty(exports, "__esModule", {value: true});
  var assert_1 = require("assert");
  var fs4 = require("fs");
  var path4 = require("path");
  _a = fs4.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
  exports.IS_WINDOWS = process.platform === "win32";
  function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield exports.stat(fsPath);
      } catch (err) {
        if (err.code === "ENOENT") {
          return false;
        }
        throw err;
      }
      return true;
    });
  }
  exports.exists = exists;
  function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
      const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
      return stats.isDirectory();
    });
  }
  exports.isDirectory = isDirectory;
  function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
      throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
      return p.startsWith("\\") || /^[A-Z]:/i.test(p);
    }
    return p.startsWith("/");
  }
  exports.isRooted = isRooted;
  function mkdirP(fsPath, maxDepth = 1e3, depth = 1) {
    return __awaiter(this, void 0, void 0, function* () {
      assert_1.ok(fsPath, "a path argument must be provided");
      fsPath = path4.resolve(fsPath);
      if (depth >= maxDepth)
        return exports.mkdir(fsPath);
      try {
        yield exports.mkdir(fsPath);
        return;
      } catch (err) {
        switch (err.code) {
          case "ENOENT": {
            yield mkdirP(path4.dirname(fsPath), maxDepth, depth + 1);
            yield exports.mkdir(fsPath);
            return;
          }
          default: {
            let stats;
            try {
              stats = yield exports.stat(fsPath);
            } catch (err2) {
              throw err;
            }
            if (!stats.isDirectory())
              throw err;
          }
        }
      }
    });
  }
  exports.mkdirP = mkdirP;
  function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
      let stats = void 0;
      try {
        stats = yield exports.stat(filePath);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
        }
      }
      if (stats && stats.isFile()) {
        if (exports.IS_WINDOWS) {
          const upperExt = path4.extname(filePath).toUpperCase();
          if (extensions.some((validExt) => validExt.toUpperCase() === upperExt)) {
            return filePath;
          }
        } else {
          if (isUnixExecutable(stats)) {
            return filePath;
          }
        }
      }
      const originalFilePath = filePath;
      for (const extension of extensions) {
        filePath = originalFilePath + extension;
        stats = void 0;
        try {
          stats = yield exports.stat(filePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
          }
        }
        if (stats && stats.isFile()) {
          if (exports.IS_WINDOWS) {
            try {
              const directory = path4.dirname(filePath);
              const upperName = path4.basename(filePath).toUpperCase();
              for (const actualName of yield exports.readdir(directory)) {
                if (upperName === actualName.toUpperCase()) {
                  filePath = path4.join(directory, actualName);
                  break;
                }
              }
            } catch (err) {
              console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
            }
            return filePath;
          } else {
            if (isUnixExecutable(stats)) {
              return filePath;
            }
          }
        }
      }
      return "";
    });
  }
  exports.tryGetExecutablePath = tryGetExecutablePath;
  function normalizeSeparators(p) {
    p = p || "";
    if (exports.IS_WINDOWS) {
      p = p.replace(/\//g, "\\");
      return p.replace(/\\\\+/g, "\\");
    }
    return p.replace(/\/\/+/g, "/");
  }
  function isUnixExecutable(stats) {
    return (stats.mode & 1) > 0 || (stats.mode & 8) > 0 && stats.gid === process.getgid() || (stats.mode & 64) > 0 && stats.uid === process.getuid();
  }
});

// node_modules/@actions/io/lib/io.js
var require_io = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var childProcess = require("child_process");
  var path4 = require("path");
  var util_1 = require("util");
  var ioUtil = require_io_util();
  var exec4 = util_1.promisify(childProcess.exec);
  function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      const {force, recursive} = readCopyOptions(options);
      const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
      if (destStat && destStat.isFile() && !force) {
        return;
      }
      const newDest = destStat && destStat.isDirectory() ? path4.join(dest, path4.basename(source)) : dest;
      if (!(yield ioUtil.exists(source))) {
        throw new Error(`no such file or directory: ${source}`);
      }
      const sourceStat = yield ioUtil.stat(source);
      if (sourceStat.isDirectory()) {
        if (!recursive) {
          throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
        } else {
          yield cpDirRecursive(source, newDest, 0, force);
        }
      } else {
        if (path4.relative(source, newDest) === "") {
          throw new Error(`'${newDest}' and '${source}' are the same file`);
        }
        yield copyFile(source, newDest, force);
      }
    });
  }
  exports.cp = cp;
  function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      if (yield ioUtil.exists(dest)) {
        let destExists = true;
        if (yield ioUtil.isDirectory(dest)) {
          dest = path4.join(dest, path4.basename(source));
          destExists = yield ioUtil.exists(dest);
        }
        if (destExists) {
          if (options.force == null || options.force) {
            yield rmRF(dest);
          } else {
            throw new Error("Destination already exists");
          }
        }
      }
      yield mkdirP(path4.dirname(dest));
      yield ioUtil.rename(source, dest);
    });
  }
  exports.mv = mv;
  function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
      if (ioUtil.IS_WINDOWS) {
        try {
          if (yield ioUtil.isDirectory(inputPath, true)) {
            yield exec4(`rd /s /q "${inputPath}"`);
          } else {
            yield exec4(`del /f /a "${inputPath}"`);
          }
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
        }
        try {
          yield ioUtil.unlink(inputPath);
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
        }
      } else {
        let isDir = false;
        try {
          isDir = yield ioUtil.isDirectory(inputPath);
        } catch (err) {
          if (err.code !== "ENOENT")
            throw err;
          return;
        }
        if (isDir) {
          yield exec4(`rm -rf "${inputPath}"`);
        } else {
          yield ioUtil.unlink(inputPath);
        }
      }
    });
  }
  exports.rmRF = rmRF;
  function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
      yield ioUtil.mkdirP(fsPath);
    });
  }
  exports.mkdirP = mkdirP;
  function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!tool) {
        throw new Error("parameter 'tool' is required");
      }
      if (check) {
        const result = yield which(tool, false);
        if (!result) {
          if (ioUtil.IS_WINDOWS) {
            throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
          } else {
            throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
          }
        }
      }
      try {
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env.PATHEXT) {
          for (const extension of process.env.PATHEXT.split(path4.delimiter)) {
            if (extension) {
              extensions.push(extension);
            }
          }
        }
        if (ioUtil.isRooted(tool)) {
          const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
          if (filePath) {
            return filePath;
          }
          return "";
        }
        if (tool.includes("/") || ioUtil.IS_WINDOWS && tool.includes("\\")) {
          return "";
        }
        const directories = [];
        if (process.env.PATH) {
          for (const p of process.env.PATH.split(path4.delimiter)) {
            if (p) {
              directories.push(p);
            }
          }
        }
        for (const directory of directories) {
          const filePath = yield ioUtil.tryGetExecutablePath(directory + path4.sep + tool, extensions);
          if (filePath) {
            return filePath;
          }
        }
        return "";
      } catch (err) {
        throw new Error(`which failed with message ${err.message}`);
      }
    });
  }
  exports.which = which;
  function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    return {force, recursive};
  }
  function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
      if (currentDepth >= 255)
        return;
      currentDepth++;
      yield mkdirP(destDir);
      const files = yield ioUtil.readdir(sourceDir);
      for (const fileName of files) {
        const srcFile = `${sourceDir}/${fileName}`;
        const destFile = `${destDir}/${fileName}`;
        const srcFileStat = yield ioUtil.lstat(srcFile);
        if (srcFileStat.isDirectory()) {
          yield cpDirRecursive(srcFile, destFile, currentDepth, force);
        } else {
          yield copyFile(srcFile, destFile, force);
        }
      }
      yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
  }
  function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
      if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
        try {
          yield ioUtil.lstat(destFile);
          yield ioUtil.unlink(destFile);
        } catch (e) {
          if (e.code === "EPERM") {
            yield ioUtil.chmod(destFile, "0666");
            yield ioUtil.unlink(destFile);
          }
        }
        const symlinkFull = yield ioUtil.readlink(srcFile);
        yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? "junction" : null);
      } else if (!(yield ioUtil.exists(destFile)) || force) {
        yield ioUtil.copyFile(srcFile, destFile);
      }
    });
  }
});

// node_modules/@actions/exec/lib/toolrunner.js
var require_toolrunner = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var os = __importStar(require("os"));
  var events = __importStar(require("events"));
  var child = __importStar(require("child_process"));
  var path4 = __importStar(require("path"));
  var io = __importStar(require_io());
  var ioUtil = __importStar(require_io_util());
  var IS_WINDOWS = process.platform === "win32";
  var ToolRunner = class extends events.EventEmitter {
    constructor(toolPath, args, options) {
      super();
      if (!toolPath) {
        throw new Error("Parameter 'toolPath' cannot be null or empty.");
      }
      this.toolPath = toolPath;
      this.args = args || [];
      this.options = options || {};
    }
    _debug(message) {
      if (this.options.listeners && this.options.listeners.debug) {
        this.options.listeners.debug(message);
      }
    }
    _getCommandString(options, noPrefix) {
      const toolPath = this._getSpawnFileName();
      const args = this._getSpawnArgs(options);
      let cmd = noPrefix ? "" : "[command]";
      if (IS_WINDOWS) {
        if (this._isCmdFile()) {
          cmd += toolPath;
          for (const a of args) {
            cmd += ` ${a}`;
          }
        } else if (options.windowsVerbatimArguments) {
          cmd += `"${toolPath}"`;
          for (const a of args) {
            cmd += ` ${a}`;
          }
        } else {
          cmd += this._windowsQuoteCmdArg(toolPath);
          for (const a of args) {
            cmd += ` ${this._windowsQuoteCmdArg(a)}`;
          }
        }
      } else {
        cmd += toolPath;
        for (const a of args) {
          cmd += ` ${a}`;
        }
      }
      return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
      try {
        let s = strBuffer + data.toString();
        let n = s.indexOf(os.EOL);
        while (n > -1) {
          const line = s.substring(0, n);
          onLine(line);
          s = s.substring(n + os.EOL.length);
          n = s.indexOf(os.EOL);
        }
        strBuffer = s;
      } catch (err) {
        this._debug(`error processing line. Failed with error ${err}`);
      }
    }
    _getSpawnFileName() {
      if (IS_WINDOWS) {
        if (this._isCmdFile()) {
          return process.env["COMSPEC"] || "cmd.exe";
        }
      }
      return this.toolPath;
    }
    _getSpawnArgs(options) {
      if (IS_WINDOWS) {
        if (this._isCmdFile()) {
          let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
          for (const a of this.args) {
            argline += " ";
            argline += options.windowsVerbatimArguments ? a : this._windowsQuoteCmdArg(a);
          }
          argline += '"';
          return [argline];
        }
      }
      return this.args;
    }
    _endsWith(str, end) {
      return str.endsWith(end);
    }
    _isCmdFile() {
      const upperToolPath = this.toolPath.toUpperCase();
      return this._endsWith(upperToolPath, ".CMD") || this._endsWith(upperToolPath, ".BAT");
    }
    _windowsQuoteCmdArg(arg) {
      if (!this._isCmdFile()) {
        return this._uvQuoteCmdArg(arg);
      }
      if (!arg) {
        return '""';
      }
      const cmdSpecialChars = [
        " ",
        "	",
        "&",
        "(",
        ")",
        "[",
        "]",
        "{",
        "}",
        "^",
        "=",
        ";",
        "!",
        "'",
        "+",
        ",",
        "`",
        "~",
        "|",
        "<",
        ">",
        '"'
      ];
      let needsQuotes = false;
      for (const char of arg) {
        if (cmdSpecialChars.some((x) => x === char)) {
          needsQuotes = true;
          break;
        }
      }
      if (!needsQuotes) {
        return arg;
      }
      let reverse = '"';
      let quoteHit = true;
      for (let i = arg.length; i > 0; i--) {
        reverse += arg[i - 1];
        if (quoteHit && arg[i - 1] === "\\") {
          reverse += "\\";
        } else if (arg[i - 1] === '"') {
          quoteHit = true;
          reverse += '"';
        } else {
          quoteHit = false;
        }
      }
      reverse += '"';
      return reverse.split("").reverse().join("");
    }
    _uvQuoteCmdArg(arg) {
      if (!arg) {
        return '""';
      }
      if (!arg.includes(" ") && !arg.includes("	") && !arg.includes('"')) {
        return arg;
      }
      if (!arg.includes('"') && !arg.includes("\\")) {
        return `"${arg}"`;
      }
      let reverse = '"';
      let quoteHit = true;
      for (let i = arg.length; i > 0; i--) {
        reverse += arg[i - 1];
        if (quoteHit && arg[i - 1] === "\\") {
          reverse += "\\";
        } else if (arg[i - 1] === '"') {
          quoteHit = true;
          reverse += "\\";
        } else {
          quoteHit = false;
        }
      }
      reverse += '"';
      return reverse.split("").reverse().join("");
    }
    _cloneExecOptions(options) {
      options = options || {};
      const result = {
        cwd: options.cwd || process.cwd(),
        env: options.env || process.env,
        silent: options.silent || false,
        windowsVerbatimArguments: options.windowsVerbatimArguments || false,
        failOnStdErr: options.failOnStdErr || false,
        ignoreReturnCode: options.ignoreReturnCode || false,
        delay: options.delay || 1e4
      };
      result.outStream = options.outStream || process.stdout;
      result.errStream = options.errStream || process.stderr;
      return result;
    }
    _getSpawnOptions(options, toolPath) {
      options = options || {};
      const result = {};
      result.cwd = options.cwd;
      result.env = options.env;
      result["windowsVerbatimArguments"] = options.windowsVerbatimArguments || this._isCmdFile();
      if (options.windowsVerbatimArguments) {
        result.argv0 = `"${toolPath}"`;
      }
      return result;
    }
    exec() {
      return __awaiter(this, void 0, void 0, function* () {
        if (!ioUtil.isRooted(this.toolPath) && (this.toolPath.includes("/") || IS_WINDOWS && this.toolPath.includes("\\"))) {
          this.toolPath = path4.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
        }
        this.toolPath = yield io.which(this.toolPath, true);
        return new Promise((resolve3, reject) => {
          this._debug(`exec tool: ${this.toolPath}`);
          this._debug("arguments:");
          for (const arg of this.args) {
            this._debug(`   ${arg}`);
          }
          const optionsNonNull = this._cloneExecOptions(this.options);
          if (!optionsNonNull.silent && optionsNonNull.outStream) {
            optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
          }
          const state = new ExecState(optionsNonNull, this.toolPath);
          state.on("debug", (message) => {
            this._debug(message);
          });
          const fileName = this._getSpawnFileName();
          const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
          const stdbuffer = "";
          if (cp.stdout) {
            cp.stdout.on("data", (data) => {
              if (this.options.listeners && this.options.listeners.stdout) {
                this.options.listeners.stdout(data);
              }
              if (!optionsNonNull.silent && optionsNonNull.outStream) {
                optionsNonNull.outStream.write(data);
              }
              this._processLineBuffer(data, stdbuffer, (line) => {
                if (this.options.listeners && this.options.listeners.stdline) {
                  this.options.listeners.stdline(line);
                }
              });
            });
          }
          const errbuffer = "";
          if (cp.stderr) {
            cp.stderr.on("data", (data) => {
              state.processStderr = true;
              if (this.options.listeners && this.options.listeners.stderr) {
                this.options.listeners.stderr(data);
              }
              if (!optionsNonNull.silent && optionsNonNull.errStream && optionsNonNull.outStream) {
                const s = optionsNonNull.failOnStdErr ? optionsNonNull.errStream : optionsNonNull.outStream;
                s.write(data);
              }
              this._processLineBuffer(data, errbuffer, (line) => {
                if (this.options.listeners && this.options.listeners.errline) {
                  this.options.listeners.errline(line);
                }
              });
            });
          }
          cp.on("error", (err) => {
            state.processError = err.message;
            state.processExited = true;
            state.processClosed = true;
            state.CheckComplete();
          });
          cp.on("exit", (code) => {
            state.processExitCode = code;
            state.processExited = true;
            this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
            state.CheckComplete();
          });
          cp.on("close", (code) => {
            state.processExitCode = code;
            state.processExited = true;
            state.processClosed = true;
            this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
            state.CheckComplete();
          });
          state.on("done", (error3, exitCode) => {
            if (stdbuffer.length > 0) {
              this.emit("stdline", stdbuffer);
            }
            if (errbuffer.length > 0) {
              this.emit("errline", errbuffer);
            }
            cp.removeAllListeners();
            if (error3) {
              reject(error3);
            } else {
              resolve3(exitCode);
            }
          });
          if (this.options.input) {
            if (!cp.stdin) {
              throw new Error("child process missing stdin");
            }
            cp.stdin.end(this.options.input);
          }
        });
      });
    }
  };
  exports.ToolRunner = ToolRunner;
  function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = "";
    function append(c) {
      if (escaped && c !== '"') {
        arg += "\\";
      }
      arg += c;
      escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
      const c = argString.charAt(i);
      if (c === '"') {
        if (!escaped) {
          inQuotes = !inQuotes;
        } else {
          append(c);
        }
        continue;
      }
      if (c === "\\" && escaped) {
        append(c);
        continue;
      }
      if (c === "\\" && inQuotes) {
        escaped = true;
        continue;
      }
      if (c === " " && !inQuotes) {
        if (arg.length > 0) {
          args.push(arg);
          arg = "";
        }
        continue;
      }
      append(c);
    }
    if (arg.length > 0) {
      args.push(arg.trim());
    }
    return args;
  }
  exports.argStringToArray = argStringToArray;
  var ExecState = class extends events.EventEmitter {
    constructor(options, toolPath) {
      super();
      this.processClosed = false;
      this.processError = "";
      this.processExitCode = 0;
      this.processExited = false;
      this.processStderr = false;
      this.delay = 1e4;
      this.done = false;
      this.timeout = null;
      if (!toolPath) {
        throw new Error("toolPath must not be empty");
      }
      this.options = options;
      this.toolPath = toolPath;
      if (options.delay) {
        this.delay = options.delay;
      }
    }
    CheckComplete() {
      if (this.done) {
        return;
      }
      if (this.processClosed) {
        this._setResult();
      } else if (this.processExited) {
        this.timeout = setTimeout(ExecState.HandleTimeout, this.delay, this);
      }
    }
    _debug(message) {
      this.emit("debug", message);
    }
    _setResult() {
      let error3;
      if (this.processExited) {
        if (this.processError) {
          error3 = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
        } else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
          error3 = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
        } else if (this.processStderr && this.options.failOnStdErr) {
          error3 = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
        }
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.done = true;
      this.emit("done", error3, this.processExitCode);
    }
    static HandleTimeout(state) {
      if (state.done) {
        return;
      }
      if (!state.processClosed && state.processExited) {
        const message = `The STDIO streams did not close within ${state.delay / 1e3} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
        state._debug(message);
      }
      state._setResult();
    }
  };
});

// node_modules/@actions/exec/lib/exec.js
var require_exec = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var tr = __importStar(require_toolrunner());
  function exec4(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const commandArgs = tr.argStringToArray(commandLine);
      if (commandArgs.length === 0) {
        throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
      }
      const toolPath = commandArgs[0];
      args = commandArgs.slice(1).concat(args || []);
      const runner = new tr.ToolRunner(toolPath, args, options);
      return runner.exec();
    });
  }
  exports.exec = exec4;
});

// node_modules/@actions/tool-cache/node_modules/semver/semver.js
var require_semver = __commonJS((exports, module2) => {
  exports = module2.exports = SemVer;
  var debug4;
  if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
    debug4 = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift("SEMVER");
      console.log.apply(console, args);
    };
  } else {
    debug4 = function() {
    };
  }
  exports.SEMVER_SPEC_VERSION = "2.0.0";
  var MAX_LENGTH = 256;
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
  var MAX_SAFE_COMPONENT_LENGTH = 16;
  var re = exports.re = [];
  var src = exports.src = [];
  var t = exports.tokens = {};
  var R = 0;
  function tok(n) {
    t[n] = R++;
  }
  tok("NUMERICIDENTIFIER");
  src[t.NUMERICIDENTIFIER] = "0|[1-9]\\d*";
  tok("NUMERICIDENTIFIERLOOSE");
  src[t.NUMERICIDENTIFIERLOOSE] = "[0-9]+";
  tok("NONNUMERICIDENTIFIER");
  src[t.NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
  tok("MAINVERSION");
  src[t.MAINVERSION] = "(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")";
  tok("MAINVERSIONLOOSE");
  src[t.MAINVERSIONLOOSE] = "(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")";
  tok("PRERELEASEIDENTIFIER");
  src[t.PRERELEASEIDENTIFIER] = "(?:" + src[t.NUMERICIDENTIFIER] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
  tok("PRERELEASEIDENTIFIERLOOSE");
  src[t.PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[t.NUMERICIDENTIFIERLOOSE] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
  tok("PRERELEASE");
  src[t.PRERELEASE] = "(?:-(" + src[t.PRERELEASEIDENTIFIER] + "(?:\\." + src[t.PRERELEASEIDENTIFIER] + ")*))";
  tok("PRERELEASELOOSE");
  src[t.PRERELEASELOOSE] = "(?:-?(" + src[t.PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[t.PRERELEASEIDENTIFIERLOOSE] + ")*))";
  tok("BUILDIDENTIFIER");
  src[t.BUILDIDENTIFIER] = "[0-9A-Za-z-]+";
  tok("BUILD");
  src[t.BUILD] = "(?:\\+(" + src[t.BUILDIDENTIFIER] + "(?:\\." + src[t.BUILDIDENTIFIER] + ")*))";
  tok("FULL");
  tok("FULLPLAIN");
  src[t.FULLPLAIN] = "v?" + src[t.MAINVERSION] + src[t.PRERELEASE] + "?" + src[t.BUILD] + "?";
  src[t.FULL] = "^" + src[t.FULLPLAIN] + "$";
  tok("LOOSEPLAIN");
  src[t.LOOSEPLAIN] = "[v=\\s]*" + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + "?" + src[t.BUILD] + "?";
  tok("LOOSE");
  src[t.LOOSE] = "^" + src[t.LOOSEPLAIN] + "$";
  tok("GTLT");
  src[t.GTLT] = "((?:<|>)?=?)";
  tok("XRANGEIDENTIFIERLOOSE");
  src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
  tok("XRANGEIDENTIFIER");
  src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + "|x|X|\\*";
  tok("XRANGEPLAIN");
  src[t.XRANGEPLAIN] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:" + src[t.PRERELEASE] + ")?" + src[t.BUILD] + "?)?)?";
  tok("XRANGEPLAINLOOSE");
  src[t.XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:" + src[t.PRERELEASELOOSE] + ")?" + src[t.BUILD] + "?)?)?";
  tok("XRANGE");
  src[t.XRANGE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAIN] + "$";
  tok("XRANGELOOSE");
  src[t.XRANGELOOSE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAINLOOSE] + "$";
  tok("COERCE");
  src[t.COERCE] = "(^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
  tok("COERCERTL");
  re[t.COERCERTL] = new RegExp(src[t.COERCE], "g");
  tok("LONETILDE");
  src[t.LONETILDE] = "(?:~>?)";
  tok("TILDETRIM");
  src[t.TILDETRIM] = "(\\s*)" + src[t.LONETILDE] + "\\s+";
  re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], "g");
  var tildeTrimReplace = "$1~";
  tok("TILDE");
  src[t.TILDE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAIN] + "$";
  tok("TILDELOOSE");
  src[t.TILDELOOSE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + "$";
  tok("LONECARET");
  src[t.LONECARET] = "(?:\\^)";
  tok("CARETTRIM");
  src[t.CARETTRIM] = "(\\s*)" + src[t.LONECARET] + "\\s+";
  re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], "g");
  var caretTrimReplace = "$1^";
  tok("CARET");
  src[t.CARET] = "^" + src[t.LONECARET] + src[t.XRANGEPLAIN] + "$";
  tok("CARETLOOSE");
  src[t.CARETLOOSE] = "^" + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + "$";
  tok("COMPARATORLOOSE");
  src[t.COMPARATORLOOSE] = "^" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + ")$|^$";
  tok("COMPARATOR");
  src[t.COMPARATOR] = "^" + src[t.GTLT] + "\\s*(" + src[t.FULLPLAIN] + ")$|^$";
  tok("COMPARATORTRIM");
  src[t.COMPARATORTRIM] = "(\\s*)" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + "|" + src[t.XRANGEPLAIN] + ")";
  re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], "g");
  var comparatorTrimReplace = "$1$2$3";
  tok("HYPHENRANGE");
  src[t.HYPHENRANGE] = "^\\s*(" + src[t.XRANGEPLAIN] + ")\\s+-\\s+(" + src[t.XRANGEPLAIN] + ")\\s*$";
  tok("HYPHENRANGELOOSE");
  src[t.HYPHENRANGELOOSE] = "^\\s*(" + src[t.XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[t.XRANGEPLAINLOOSE] + ")\\s*$";
  tok("STAR");
  src[t.STAR] = "(<|>)?=?\\s*\\*";
  for (var i = 0; i < R; i++) {
    debug4(i, src[i]);
    if (!re[i]) {
      re[i] = new RegExp(src[i]);
    }
  }
  exports.parse = parse2;
  function parse2(version, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version !== "string") {
      return null;
    }
    if (version.length > MAX_LENGTH) {
      return null;
    }
    var r = options.loose ? re[t.LOOSE] : re[t.FULL];
    if (!r.test(version)) {
      return null;
    }
    try {
      return new SemVer(version, options);
    } catch (er) {
      return null;
    }
  }
  exports.valid = valid;
  function valid(version, options) {
    var v = parse2(version, options);
    return v ? v.version : null;
  }
  exports.clean = clean;
  function clean(version, options) {
    var s = parse2(version.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
  }
  exports.SemVer = SemVer;
  function SemVer(version, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (version instanceof SemVer) {
      if (version.loose === options.loose) {
        return version;
      } else {
        version = version.version;
      }
    } else if (typeof version !== "string") {
      throw new TypeError("Invalid Version: " + version);
    }
    if (version.length > MAX_LENGTH) {
      throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
    }
    if (!(this instanceof SemVer)) {
      return new SemVer(version, options);
    }
    debug4("SemVer", version, options);
    this.options = options;
    this.loose = !!options.loose;
    var m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
    if (!m) {
      throw new TypeError("Invalid Version: " + version);
    }
    this.raw = version;
    this.major = +m[1];
    this.minor = +m[2];
    this.patch = +m[3];
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version");
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version");
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version");
    }
    if (!m[4]) {
      this.prerelease = [];
    } else {
      this.prerelease = m[4].split(".").map(function(id) {
        if (/^[0-9]+$/.test(id)) {
          var num = +id;
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num;
          }
        }
        return id;
      });
    }
    this.build = m[5] ? m[5].split(".") : [];
    this.format();
  }
  SemVer.prototype.format = function() {
    this.version = this.major + "." + this.minor + "." + this.patch;
    if (this.prerelease.length) {
      this.version += "-" + this.prerelease.join(".");
    }
    return this.version;
  };
  SemVer.prototype.toString = function() {
    return this.version;
  };
  SemVer.prototype.compare = function(other) {
    debug4("SemVer.compare", this.version, this.options, other);
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    return this.compareMain(other) || this.comparePre(other);
  };
  SemVer.prototype.compareMain = function(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
  };
  SemVer.prototype.comparePre = function(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1;
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1;
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0;
    }
    var i2 = 0;
    do {
      var a = this.prerelease[i2];
      var b = other.prerelease[i2];
      debug4("prerelease compare", i2, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i2);
  };
  SemVer.prototype.compareBuild = function(other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options);
    }
    var i2 = 0;
    do {
      var a = this.build[i2];
      var b = other.build[i2];
      debug4("prerelease compare", i2, a, b);
      if (a === void 0 && b === void 0) {
        return 0;
      } else if (b === void 0) {
        return 1;
      } else if (a === void 0) {
        return -1;
      } else if (a === b) {
        continue;
      } else {
        return compareIdentifiers(a, b);
      }
    } while (++i2);
  };
  SemVer.prototype.inc = function(release, identifier) {
    switch (release) {
      case "premajor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor = 0;
        this.major++;
        this.inc("pre", identifier);
        break;
      case "preminor":
        this.prerelease.length = 0;
        this.patch = 0;
        this.minor++;
        this.inc("pre", identifier);
        break;
      case "prepatch":
        this.prerelease.length = 0;
        this.inc("patch", identifier);
        this.inc("pre", identifier);
        break;
      case "prerelease":
        if (this.prerelease.length === 0) {
          this.inc("patch", identifier);
        }
        this.inc("pre", identifier);
        break;
      case "major":
        if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
          this.major++;
        }
        this.minor = 0;
        this.patch = 0;
        this.prerelease = [];
        break;
      case "minor":
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++;
        }
        this.patch = 0;
        this.prerelease = [];
        break;
      case "patch":
        if (this.prerelease.length === 0) {
          this.patch++;
        }
        this.prerelease = [];
        break;
      case "pre":
        if (this.prerelease.length === 0) {
          this.prerelease = [0];
        } else {
          var i2 = this.prerelease.length;
          while (--i2 >= 0) {
            if (typeof this.prerelease[i2] === "number") {
              this.prerelease[i2]++;
              i2 = -2;
            }
          }
          if (i2 === -1) {
            this.prerelease.push(0);
          }
        }
        if (identifier) {
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0];
            }
          } else {
            this.prerelease = [identifier, 0];
          }
        }
        break;
      default:
        throw new Error("invalid increment argument: " + release);
    }
    this.format();
    this.raw = this.version;
    return this;
  };
  exports.inc = inc;
  function inc(version, release, loose, identifier) {
    if (typeof loose === "string") {
      identifier = loose;
      loose = void 0;
    }
    try {
      return new SemVer(version, loose).inc(release, identifier).version;
    } catch (er) {
      return null;
    }
  }
  exports.diff = diff;
  function diff(version1, version2) {
    if (eq(version1, version2)) {
      return null;
    } else {
      var v1 = parse2(version1);
      var v2 = parse2(version2);
      var prefix = "";
      if (v1.prerelease.length || v2.prerelease.length) {
        prefix = "pre";
        var defaultResult = "prerelease";
      }
      for (var key in v1) {
        if (key === "major" || key === "minor" || key === "patch") {
          if (v1[key] !== v2[key]) {
            return prefix + key;
          }
        }
      }
      return defaultResult;
    }
  }
  exports.compareIdentifiers = compareIdentifiers;
  var numeric = /^[0-9]+$/;
  function compareIdentifiers(a, b) {
    var anum = numeric.test(a);
    var bnum = numeric.test(b);
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  }
  exports.rcompareIdentifiers = rcompareIdentifiers;
  function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a);
  }
  exports.major = major;
  function major(a, loose) {
    return new SemVer(a, loose).major;
  }
  exports.minor = minor;
  function minor(a, loose) {
    return new SemVer(a, loose).minor;
  }
  exports.patch = patch;
  function patch(a, loose) {
    return new SemVer(a, loose).patch;
  }
  exports.compare = compare;
  function compare(a, b, loose) {
    return new SemVer(a, loose).compare(new SemVer(b, loose));
  }
  exports.compareLoose = compareLoose;
  function compareLoose(a, b) {
    return compare(a, b, true);
  }
  exports.compareBuild = compareBuild;
  function compareBuild(a, b, loose) {
    var versionA = new SemVer(a, loose);
    var versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  }
  exports.rcompare = rcompare;
  function rcompare(a, b, loose) {
    return compare(b, a, loose);
  }
  exports.sort = sort;
  function sort(list, loose) {
    return list.sort(function(a, b) {
      return exports.compareBuild(a, b, loose);
    });
  }
  exports.rsort = rsort;
  function rsort(list, loose) {
    return list.sort(function(a, b) {
      return exports.compareBuild(b, a, loose);
    });
  }
  exports.gt = gt;
  function gt(a, b, loose) {
    return compare(a, b, loose) > 0;
  }
  exports.lt = lt;
  function lt(a, b, loose) {
    return compare(a, b, loose) < 0;
  }
  exports.eq = eq;
  function eq(a, b, loose) {
    return compare(a, b, loose) === 0;
  }
  exports.neq = neq;
  function neq(a, b, loose) {
    return compare(a, b, loose) !== 0;
  }
  exports.gte = gte;
  function gte(a, b, loose) {
    return compare(a, b, loose) >= 0;
  }
  exports.lte = lte;
  function lte(a, b, loose) {
    return compare(a, b, loose) <= 0;
  }
  exports.cmp = cmp;
  function cmp(a, op, b, loose) {
    switch (op) {
      case "===":
        if (typeof a === "object")
          a = a.version;
        if (typeof b === "object")
          b = b.version;
        return a === b;
      case "!==":
        if (typeof a === "object")
          a = a.version;
        if (typeof b === "object")
          b = b.version;
        return a !== b;
      case "":
      case "=":
      case "==":
        return eq(a, b, loose);
      case "!=":
        return neq(a, b, loose);
      case ">":
        return gt(a, b, loose);
      case ">=":
        return gte(a, b, loose);
      case "<":
        return lt(a, b, loose);
      case "<=":
        return lte(a, b, loose);
      default:
        throw new TypeError("Invalid operator: " + op);
    }
  }
  exports.Comparator = Comparator;
  function Comparator(comp, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp;
      } else {
        comp = comp.value;
      }
    }
    if (!(this instanceof Comparator)) {
      return new Comparator(comp, options);
    }
    debug4("comparator", comp, options);
    this.options = options;
    this.loose = !!options.loose;
    this.parse(comp);
    if (this.semver === ANY) {
      this.value = "";
    } else {
      this.value = this.operator + this.semver.version;
    }
    debug4("comp", this);
  }
  var ANY = {};
  Comparator.prototype.parse = function(comp) {
    var r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var m = comp.match(r);
    if (!m) {
      throw new TypeError("Invalid comparator: " + comp);
    }
    this.operator = m[1] !== void 0 ? m[1] : "";
    if (this.operator === "=") {
      this.operator = "";
    }
    if (!m[2]) {
      this.semver = ANY;
    } else {
      this.semver = new SemVer(m[2], this.options.loose);
    }
  };
  Comparator.prototype.toString = function() {
    return this.value;
  };
  Comparator.prototype.test = function(version) {
    debug4("Comparator.test", version, this.options.loose);
    if (this.semver === ANY || version === ANY) {
      return true;
    }
    if (typeof version === "string") {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false;
      }
    }
    return cmp(version, this.operator, this.semver, this.options);
  };
  Comparator.prototype.intersects = function(comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError("a Comparator is required");
    }
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    var rangeTmp;
    if (this.operator === "") {
      if (this.value === "") {
        return true;
      }
      rangeTmp = new Range(comp.value, options);
      return satisfies(this.value, rangeTmp, options);
    } else if (comp.operator === "") {
      if (comp.value === "") {
        return true;
      }
      rangeTmp = new Range(this.value, options);
      return satisfies(comp.semver, rangeTmp, options);
    }
    var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
    var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
    var sameSemVer = this.semver.version === comp.semver.version;
    var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
    var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && ((this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<"));
    var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && ((this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">"));
    return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
  };
  exports.Range = Range;
  function Range(range, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false
      };
    }
    if (range instanceof Range) {
      if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
        return range;
      } else {
        return new Range(range.raw, options);
      }
    }
    if (range instanceof Comparator) {
      return new Range(range.value, options);
    }
    if (!(this instanceof Range)) {
      return new Range(range, options);
    }
    this.options = options;
    this.loose = !!options.loose;
    this.includePrerelease = !!options.includePrerelease;
    this.raw = range;
    this.set = range.split(/\s*\|\|\s*/).map(function(range2) {
      return this.parseRange(range2.trim());
    }, this).filter(function(c) {
      return c.length;
    });
    if (!this.set.length) {
      throw new TypeError("Invalid SemVer Range: " + range);
    }
    this.format();
  }
  Range.prototype.format = function() {
    this.range = this.set.map(function(comps) {
      return comps.join(" ").trim();
    }).join("||").trim();
    return this.range;
  };
  Range.prototype.toString = function() {
    return this.range;
  };
  Range.prototype.parseRange = function(range) {
    var loose = this.options.loose;
    range = range.trim();
    var hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
    range = range.replace(hr, hyphenReplace);
    debug4("hyphen replace", range);
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
    debug4("comparator trim", range, re[t.COMPARATORTRIM]);
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
    range = range.replace(re[t.CARETTRIM], caretTrimReplace);
    range = range.split(/\s+/).join(" ");
    var compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
    var set = range.split(" ").map(function(comp) {
      return parseComparator(comp, this.options);
    }, this).join(" ").split(/\s+/);
    if (this.options.loose) {
      set = set.filter(function(comp) {
        return !!comp.match(compRe);
      });
    }
    set = set.map(function(comp) {
      return new Comparator(comp, this.options);
    }, this);
    return set;
  };
  Range.prototype.intersects = function(range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError("a Range is required");
    }
    return this.set.some(function(thisComparators) {
      return isSatisfiable(thisComparators, options) && range.set.some(function(rangeComparators) {
        return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
          return rangeComparators.every(function(rangeComparator) {
            return thisComparator.intersects(rangeComparator, options);
          });
        });
      });
    });
  };
  function isSatisfiable(comparators, options) {
    var result = true;
    var remainingComparators = comparators.slice();
    var testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every(function(otherComparator) {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  }
  exports.toComparators = toComparators;
  function toComparators(range, options) {
    return new Range(range, options).set.map(function(comp) {
      return comp.map(function(c) {
        return c.value;
      }).join(" ").trim().split(" ");
    });
  }
  function parseComparator(comp, options) {
    debug4("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug4("caret", comp);
    comp = replaceTildes(comp, options);
    debug4("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug4("xrange", comp);
    comp = replaceStars(comp, options);
    debug4("stars", comp);
    return comp;
  }
  function isX(id) {
    return !id || id.toLowerCase() === "x" || id === "*";
  }
  function replaceTildes(comp, options) {
    return comp.trim().split(/\s+/).map(function(comp2) {
      return replaceTilde(comp2, options);
    }).join(" ");
  }
  function replaceTilde(comp, options) {
    var r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
    return comp.replace(r, function(_, M, m, p, pr) {
      debug4("tilde", comp, _, M, m, p, pr);
      var ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
      } else if (isX(p)) {
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
      } else if (pr) {
        debug4("replaceTilde pr", pr);
        ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
      } else {
        ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
      }
      debug4("tilde return", ret);
      return ret;
    });
  }
  function replaceCarets(comp, options) {
    return comp.trim().split(/\s+/).map(function(comp2) {
      return replaceCaret(comp2, options);
    }).join(" ");
  }
  function replaceCaret(comp, options) {
    debug4("caret", comp, options);
    var r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
    return comp.replace(r, function(_, M, m, p, pr) {
      debug4("caret", comp, _, M, m, p, pr);
      var ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
      } else if (isX(p)) {
        if (M === "0") {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
        } else {
          ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
        }
      } else if (pr) {
        debug4("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
          } else {
            ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
          }
        } else {
          ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
        }
      } else {
        debug4("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
          } else {
            ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
          }
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
        }
      }
      debug4("caret return", ret);
      return ret;
    });
  }
  function replaceXRanges(comp, options) {
    debug4("replaceXRanges", comp, options);
    return comp.split(/\s+/).map(function(comp2) {
      return replaceXRange(comp2, options);
    }).join(" ");
  }
  function replaceXRange(comp, options) {
    comp = comp.trim();
    var r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
    return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
      debug4("xRange", comp, ret, gtlt, M, m, p, pr);
      var xM = isX(M);
      var xm = xM || isX(m);
      var xp = xm || isX(p);
      var anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        ret = gtlt + M + "." + m + "." + p + pr;
      } else if (xm) {
        ret = ">=" + M + ".0.0" + pr + " <" + (+M + 1) + ".0.0" + pr;
      } else if (xp) {
        ret = ">=" + M + "." + m + ".0" + pr + " <" + M + "." + (+m + 1) + ".0" + pr;
      }
      debug4("xRange return", ret);
      return ret;
    });
  }
  function replaceStars(comp, options) {
    debug4("replaceStars", comp, options);
    return comp.trim().replace(re[t.STAR], "");
  }
  function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
    if (isX(fM)) {
      from = "";
    } else if (isX(fm)) {
      from = ">=" + fM + ".0.0";
    } else if (isX(fp)) {
      from = ">=" + fM + "." + fm + ".0";
    } else {
      from = ">=" + from;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = "<" + (+tM + 1) + ".0.0";
    } else if (isX(tp)) {
      to = "<" + tM + "." + (+tm + 1) + ".0";
    } else if (tpr) {
      to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
    } else {
      to = "<=" + to;
    }
    return (from + " " + to).trim();
  }
  Range.prototype.test = function(version) {
    if (!version) {
      return false;
    }
    if (typeof version === "string") {
      try {
        version = new SemVer(version, this.options);
      } catch (er) {
        return false;
      }
    }
    for (var i2 = 0; i2 < this.set.length; i2++) {
      if (testSet(this.set[i2], version, this.options)) {
        return true;
      }
    }
    return false;
  };
  function testSet(set, version, options) {
    for (var i2 = 0; i2 < set.length; i2++) {
      if (!set[i2].test(version)) {
        return false;
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (i2 = 0; i2 < set.length; i2++) {
        debug4(set[i2].semver);
        if (set[i2].semver === ANY) {
          continue;
        }
        if (set[i2].semver.prerelease.length > 0) {
          var allowed = set[i2].semver;
          if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  }
  exports.satisfies = satisfies;
  function satisfies(version, range, options) {
    try {
      range = new Range(range, options);
    } catch (er) {
      return false;
    }
    return range.test(version);
  }
  exports.maxSatisfying = maxSatisfying;
  function maxSatisfying(versions, range, options) {
    var max = null;
    var maxSV = null;
    try {
      var rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }
    versions.forEach(function(v) {
      if (rangeObj.test(v)) {
        if (!max || maxSV.compare(v) === -1) {
          max = v;
          maxSV = new SemVer(max, options);
        }
      }
    });
    return max;
  }
  exports.minSatisfying = minSatisfying;
  function minSatisfying(versions, range, options) {
    var min = null;
    var minSV = null;
    try {
      var rangeObj = new Range(range, options);
    } catch (er) {
      return null;
    }
    versions.forEach(function(v) {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v;
          minSV = new SemVer(min, options);
        }
      }
    });
    return min;
  }
  exports.minVersion = minVersion;
  function minVersion(range, loose) {
    range = new Range(range, loose);
    var minver = new SemVer("0.0.0");
    if (range.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range.test(minver)) {
      return minver;
    }
    minver = null;
    for (var i2 = 0; i2 < range.set.length; ++i2) {
      var comparators = range.set[i2];
      comparators.forEach(function(comparator) {
        var compver = new SemVer(comparator.semver.version);
        switch (comparator.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          case "":
          case ">=":
            if (!minver || gt(minver, compver)) {
              minver = compver;
            }
            break;
          case "<":
          case "<=":
            break;
          default:
            throw new Error("Unexpected operation: " + comparator.operator);
        }
      });
    }
    if (minver && range.test(minver)) {
      return minver;
    }
    return null;
  }
  exports.validRange = validRange;
  function validRange(range, options) {
    try {
      return new Range(range, options).range || "*";
    } catch (er) {
      return null;
    }
  }
  exports.ltr = ltr;
  function ltr(version, range, options) {
    return outside(version, range, "<", options);
  }
  exports.gtr = gtr;
  function gtr(version, range, options) {
    return outside(version, range, ">", options);
  }
  exports.outside = outside;
  function outside(version, range, hilo, options) {
    version = new SemVer(version, options);
    range = new Range(range, options);
    var gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version, range, options)) {
      return false;
    }
    for (var i2 = 0; i2 < range.set.length; ++i2) {
      var comparators = range.set[i2];
      var high = null;
      var low = null;
      comparators.forEach(function(comparator) {
        if (comparator.semver === ANY) {
          comparator = new Comparator(">=0.0.0");
        }
        high = high || comparator;
        low = low || comparator;
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator;
        }
      });
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false;
      }
    }
    return true;
  }
  exports.prerelease = prerelease;
  function prerelease(version, options) {
    var parsed = parse2(version, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  }
  exports.intersects = intersects;
  function intersects(r1, r2, options) {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2);
  }
  exports.coerce = coerce;
  function coerce(version, options) {
    if (version instanceof SemVer) {
      return version;
    }
    if (typeof version === "number") {
      version = String(version);
    }
    if (typeof version !== "string") {
      return null;
    }
    options = options || {};
    var match = null;
    if (!options.rtl) {
      match = version.match(re[t.COERCE]);
    } else {
      var next;
      while ((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
        if (!match || next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
      }
      re[t.COERCERTL].lastIndex = -1;
    }
    if (match === null) {
      return null;
    }
    return parse2(match[2] + "." + (match[3] || "0") + "." + (match[4] || "0"), options);
  }
});

// node_modules/@actions/tool-cache/lib/manifest.js
var require_manifest = __commonJS((exports, module2) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var semver = __importStar(require_semver());
  var core_1 = require_core();
  var os = require("os");
  var cp = require("child_process");
  var fs4 = require("fs");
  function _findMatch(versionSpec, stable, candidates, archFilter) {
    return __awaiter(this, void 0, void 0, function* () {
      const platFilter = os.platform();
      let result;
      let match;
      let file;
      for (const candidate of candidates) {
        const version = candidate.version;
        core_1.debug(`check ${version} satisfies ${versionSpec}`);
        if (semver.satisfies(version, versionSpec) && (!stable || candidate.stable === stable)) {
          file = candidate.files.find((item) => {
            core_1.debug(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
            let chk = item.arch === archFilter && item.platform === platFilter;
            if (chk && item.platform_version) {
              const osVersion = module2.exports._getOsVersion();
              if (osVersion === item.platform_version) {
                chk = true;
              } else {
                chk = semver.satisfies(osVersion, item.platform_version);
              }
            }
            return chk;
          });
          if (file) {
            core_1.debug(`matched ${candidate.version}`);
            match = candidate;
            break;
          }
        }
      }
      if (match && file) {
        result = Object.assign({}, match);
        result.files = [file];
      }
      return result;
    });
  }
  exports._findMatch = _findMatch;
  function _getOsVersion() {
    const plat = os.platform();
    let version = "";
    if (plat === "darwin") {
      version = cp.execSync("sw_vers -productVersion").toString();
    } else if (plat === "linux") {
      const lsbContents = module2.exports._readLinuxVersionFile();
      if (lsbContents) {
        const lines = lsbContents.split("\n");
        for (const line of lines) {
          const parts = line.split("=");
          if (parts.length === 2 && parts[0].trim() === "DISTRIB_RELEASE") {
            version = parts[1].trim();
            break;
          }
        }
      }
    }
    return version;
  }
  exports._getOsVersion = _getOsVersion;
  function _readLinuxVersionFile() {
    const lsbFile = "/etc/lsb-release";
    let contents = "";
    if (fs4.existsSync(lsbFile)) {
      contents = fs4.readFileSync(lsbFile).toString();
    }
    return contents;
  }
  exports._readLinuxVersionFile = _readLinuxVersionFile;
});

// node_modules/uuid/lib/rng.js
var require_rng = __commonJS((exports, module2) => {
  var crypto = require("crypto");
  module2.exports = function nodeRNG() {
    return crypto.randomBytes(16);
  };
});

// node_modules/uuid/lib/bytesToUuid.js
var require_bytesToUuid = __commonJS((exports, module2) => {
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 256).toString(16).substr(1);
  }
  function bytesToUuid(buf, offset) {
    var i2 = offset || 0;
    var bth = byteToHex;
    return [
      bth[buf[i2++]],
      bth[buf[i2++]],
      bth[buf[i2++]],
      bth[buf[i2++]],
      "-",
      bth[buf[i2++]],
      bth[buf[i2++]],
      "-",
      bth[buf[i2++]],
      bth[buf[i2++]],
      "-",
      bth[buf[i2++]],
      bth[buf[i2++]],
      "-",
      bth[buf[i2++]],
      bth[buf[i2++]],
      bth[buf[i2++]],
      bth[buf[i2++]],
      bth[buf[i2++]],
      bth[buf[i2++]]
    ].join("");
  }
  module2.exports = bytesToUuid;
});

// node_modules/uuid/v4.js
var require_v4 = __commonJS((exports, module2) => {
  var rng = require_rng();
  var bytesToUuid = require_bytesToUuid();
  function v4(options, buf, offset) {
    var i = buf && offset || 0;
    if (typeof options == "string") {
      buf = options === "binary" ? new Array(16) : null;
      options = null;
    }
    options = options || {};
    var rnds = options.random || (options.rng || rng)();
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128;
    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }
    return buf || bytesToUuid(rnds);
  }
  module2.exports = v4;
});

// node_modules/@actions/tool-cache/lib/retry-helper.js
var require_retry_helper = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var core4 = __importStar(require_core());
  var RetryHelper = class {
    constructor(maxAttempts, minSeconds, maxSeconds) {
      if (maxAttempts < 1) {
        throw new Error("max attempts should be greater than or equal to 1");
      }
      this.maxAttempts = maxAttempts;
      this.minSeconds = Math.floor(minSeconds);
      this.maxSeconds = Math.floor(maxSeconds);
      if (this.minSeconds > this.maxSeconds) {
        throw new Error("min seconds should be less than or equal to max seconds");
      }
    }
    execute(action, isRetryable) {
      return __awaiter(this, void 0, void 0, function* () {
        let attempt = 1;
        while (attempt < this.maxAttempts) {
          try {
            return yield action();
          } catch (err) {
            if (isRetryable && !isRetryable(err)) {
              throw err;
            }
            core4.info(err.message);
          }
          const seconds = this.getSleepAmount();
          core4.info(`Waiting ${seconds} seconds before trying again`);
          yield this.sleep(seconds);
          attempt++;
        }
        return yield action();
      });
    }
    getSleepAmount() {
      return Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) + this.minSeconds;
    }
    sleep(seconds) {
      return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve3) => setTimeout(resolve3, seconds * 1e3));
      });
    }
  };
  exports.RetryHelper = RetryHelper;
});

// node_modules/@actions/tool-cache/lib/tool-cache.js
var require_tool_cache = __commonJS((exports) => {
  "use strict";
  var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve3) {
        resolve3(value);
      });
    }
    return new (P || (P = Promise))(function(resolve3, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve3(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __importStar = exports && exports.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k))
          result[k] = mod[k];
    }
    result["default"] = mod;
    return result;
  };
  var __importDefault = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  var core4 = __importStar(require_core());
  var io = __importStar(require_io());
  var fs4 = __importStar(require("fs"));
  var mm = __importStar(require_manifest());
  var os = __importStar(require("os"));
  var path4 = __importStar(require("path"));
  var httpm = __importStar(require_http_client());
  var semver = __importStar(require_semver());
  var stream = __importStar(require("stream"));
  var util = __importStar(require("util"));
  var v4_1 = __importDefault(require_v4());
  var exec_1 = require_exec();
  var assert_1 = require("assert");
  var retry_helper_1 = require_retry_helper();
  var HTTPError = class extends Error {
    constructor(httpStatusCode) {
      super(`Unexpected HTTP response: ${httpStatusCode}`);
      this.httpStatusCode = httpStatusCode;
      Object.setPrototypeOf(this, new.target.prototype);
    }
  };
  exports.HTTPError = HTTPError;
  var IS_WINDOWS = process.platform === "win32";
  var IS_MAC = process.platform === "darwin";
  var userAgent = "actions/tool-cache";
  function downloadTool2(url, dest, auth) {
    return __awaiter(this, void 0, void 0, function* () {
      dest = dest || path4.join(_getTempDirectory(), v4_1.default());
      yield io.mkdirP(path4.dirname(dest));
      core4.debug(`Downloading ${url}`);
      core4.debug(`Destination ${dest}`);
      const maxAttempts = 3;
      const minSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS", 10);
      const maxSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS", 20);
      const retryHelper = new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds);
      return yield retryHelper.execute(() => __awaiter(this, void 0, void 0, function* () {
        return yield downloadToolAttempt(url, dest || "", auth);
      }), (err) => {
        if (err instanceof HTTPError && err.httpStatusCode) {
          if (err.httpStatusCode < 500 && err.httpStatusCode !== 408 && err.httpStatusCode !== 429) {
            return false;
          }
        }
        return true;
      });
    });
  }
  exports.downloadTool = downloadTool2;
  function downloadToolAttempt(url, dest, auth) {
    return __awaiter(this, void 0, void 0, function* () {
      if (fs4.existsSync(dest)) {
        throw new Error(`Destination file path ${dest} already exists`);
      }
      const http = new httpm.HttpClient(userAgent, [], {
        allowRetries: false
      });
      let headers;
      if (auth) {
        core4.debug("set auth");
        headers = {
          authorization: auth
        };
      }
      const response = yield http.get(url, headers);
      if (response.message.statusCode !== 200) {
        const err = new HTTPError(response.message.statusCode);
        core4.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
        throw err;
      }
      const pipeline = util.promisify(stream.pipeline);
      const responseMessageFactory = _getGlobal("TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY", () => response.message);
      const readStream = responseMessageFactory();
      let succeeded = false;
      try {
        yield pipeline(readStream, fs4.createWriteStream(dest));
        core4.debug("download complete");
        succeeded = true;
        return dest;
      } finally {
        if (!succeeded) {
          core4.debug("download failed");
          try {
            yield io.rmRF(dest);
          } catch (err) {
            core4.debug(`Failed to delete '${dest}'. ${err.message}`);
          }
        }
      }
    });
  }
  function extract7z(file, dest, _7zPath) {
    return __awaiter(this, void 0, void 0, function* () {
      assert_1.ok(IS_WINDOWS, "extract7z() not supported on current OS");
      assert_1.ok(file, 'parameter "file" is required');
      dest = yield _createExtractFolder(dest);
      const originalCwd = process.cwd();
      process.chdir(dest);
      if (_7zPath) {
        try {
          const logLevel = core4.isDebug() ? "-bb1" : "-bb0";
          const args = [
            "x",
            logLevel,
            "-bd",
            "-sccUTF-8",
            file
          ];
          const options = {
            silent: true
          };
          yield exec_1.exec(`"${_7zPath}"`, args, options);
        } finally {
          process.chdir(originalCwd);
        }
      } else {
        const escapedScript = path4.join(__dirname, "..", "scripts", "Invoke-7zdec.ps1").replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const escapedTarget = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
        const command = `& '${escapedScript}' -Source '${escapedFile}' -Target '${escapedTarget}'`;
        const args = [
          "-NoLogo",
          "-Sta",
          "-NoProfile",
          "-NonInteractive",
          "-ExecutionPolicy",
          "Unrestricted",
          "-Command",
          command
        ];
        const options = {
          silent: true
        };
        try {
          const powershellPath = yield io.which("powershell", true);
          yield exec_1.exec(`"${powershellPath}"`, args, options);
        } finally {
          process.chdir(originalCwd);
        }
      }
      return dest;
    });
  }
  exports.extract7z = extract7z;
  function extractTar(file, dest, flags = "xz") {
    return __awaiter(this, void 0, void 0, function* () {
      if (!file) {
        throw new Error("parameter 'file' is required");
      }
      dest = yield _createExtractFolder(dest);
      core4.debug("Checking tar --version");
      let versionOutput = "";
      yield exec_1.exec("tar --version", [], {
        ignoreReturnCode: true,
        silent: true,
        listeners: {
          stdout: (data) => versionOutput += data.toString(),
          stderr: (data) => versionOutput += data.toString()
        }
      });
      core4.debug(versionOutput.trim());
      const isGnuTar = versionOutput.toUpperCase().includes("GNU TAR");
      let args;
      if (flags instanceof Array) {
        args = flags;
      } else {
        args = [flags];
      }
      if (core4.isDebug() && !flags.includes("v")) {
        args.push("-v");
      }
      let destArg = dest;
      let fileArg = file;
      if (IS_WINDOWS && isGnuTar) {
        args.push("--force-local");
        destArg = dest.replace(/\\/g, "/");
        fileArg = file.replace(/\\/g, "/");
      }
      if (isGnuTar) {
        args.push("--warning=no-unknown-keyword");
      }
      args.push("-C", destArg, "-f", fileArg);
      yield exec_1.exec(`tar`, args);
      return dest;
    });
  }
  exports.extractTar = extractTar;
  function extractXar(file, dest, flags = []) {
    return __awaiter(this, void 0, void 0, function* () {
      assert_1.ok(IS_MAC, "extractXar() not supported on current OS");
      assert_1.ok(file, 'parameter "file" is required');
      dest = yield _createExtractFolder(dest);
      let args;
      if (flags instanceof Array) {
        args = flags;
      } else {
        args = [flags];
      }
      args.push("-x", "-C", dest, "-f", file);
      if (core4.isDebug()) {
        args.push("-v");
      }
      const xarPath = yield io.which("xar", true);
      yield exec_1.exec(`"${xarPath}"`, _unique(args));
      return dest;
    });
  }
  exports.extractXar = extractXar;
  function extractZip2(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!file) {
        throw new Error("parameter 'file' is required");
      }
      dest = yield _createExtractFolder(dest);
      if (IS_WINDOWS) {
        yield extractZipWin(file, dest);
      } else {
        yield extractZipNix(file, dest);
      }
      return dest;
    });
  }
  exports.extractZip = extractZip2;
  function extractZipWin(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
      const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
      const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
      const command = `$ErrorActionPreference = 'Stop' ; try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ; [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}')`;
      const powershellPath = yield io.which("powershell", true);
      const args = [
        "-NoLogo",
        "-Sta",
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Unrestricted",
        "-Command",
        command
      ];
      yield exec_1.exec(`"${powershellPath}"`, args);
    });
  }
  function extractZipNix(file, dest) {
    return __awaiter(this, void 0, void 0, function* () {
      const unzipPath = yield io.which("unzip", true);
      const args = [file];
      if (!core4.isDebug()) {
        args.unshift("-q");
      }
      yield exec_1.exec(`"${unzipPath}"`, args, {cwd: dest});
    });
  }
  function cacheDir(sourceDir, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
      version = semver.clean(version) || version;
      arch = arch || os.arch();
      core4.debug(`Caching tool ${tool} ${version} ${arch}`);
      core4.debug(`source dir: ${sourceDir}`);
      if (!fs4.statSync(sourceDir).isDirectory()) {
        throw new Error("sourceDir is not a directory");
      }
      const destPath = yield _createToolPath(tool, version, arch);
      for (const itemName of fs4.readdirSync(sourceDir)) {
        const s = path4.join(sourceDir, itemName);
        yield io.cp(s, destPath, {recursive: true});
      }
      _completeToolPath(tool, version, arch);
      return destPath;
    });
  }
  exports.cacheDir = cacheDir;
  function cacheFile(sourceFile, targetFile, tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
      version = semver.clean(version) || version;
      arch = arch || os.arch();
      core4.debug(`Caching tool ${tool} ${version} ${arch}`);
      core4.debug(`source file: ${sourceFile}`);
      if (!fs4.statSync(sourceFile).isFile()) {
        throw new Error("sourceFile is not a file");
      }
      const destFolder = yield _createToolPath(tool, version, arch);
      const destPath = path4.join(destFolder, targetFile);
      core4.debug(`destination file ${destPath}`);
      yield io.cp(sourceFile, destPath);
      _completeToolPath(tool, version, arch);
      return destFolder;
    });
  }
  exports.cacheFile = cacheFile;
  function find(toolName, versionSpec, arch) {
    if (!toolName) {
      throw new Error("toolName parameter is required");
    }
    if (!versionSpec) {
      throw new Error("versionSpec parameter is required");
    }
    arch = arch || os.arch();
    if (!_isExplicitVersion(versionSpec)) {
      const localVersions = findAllVersions(toolName, arch);
      const match = _evaluateVersions(localVersions, versionSpec);
      versionSpec = match;
    }
    let toolPath = "";
    if (versionSpec) {
      versionSpec = semver.clean(versionSpec) || "";
      const cachePath = path4.join(_getCacheDirectory(), toolName, versionSpec, arch);
      core4.debug(`checking cache: ${cachePath}`);
      if (fs4.existsSync(cachePath) && fs4.existsSync(`${cachePath}.complete`)) {
        core4.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
        toolPath = cachePath;
      } else {
        core4.debug("not found");
      }
    }
    return toolPath;
  }
  exports.find = find;
  function findAllVersions(toolName, arch) {
    const versions = [];
    arch = arch || os.arch();
    const toolPath = path4.join(_getCacheDirectory(), toolName);
    if (fs4.existsSync(toolPath)) {
      const children = fs4.readdirSync(toolPath);
      for (const child of children) {
        if (_isExplicitVersion(child)) {
          const fullPath = path4.join(toolPath, child, arch || "");
          if (fs4.existsSync(fullPath) && fs4.existsSync(`${fullPath}.complete`)) {
            versions.push(child);
          }
        }
      }
    }
    return versions;
  }
  exports.findAllVersions = findAllVersions;
  function getManifestFromRepo(owner, repo, auth, branch = "master") {
    return __awaiter(this, void 0, void 0, function* () {
      let releases = [];
      const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}`;
      const http = new httpm.HttpClient("tool-cache");
      const headers = {};
      if (auth) {
        core4.debug("set auth");
        headers.authorization = auth;
      }
      const response = yield http.getJson(treeUrl, headers);
      if (!response.result) {
        return releases;
      }
      let manifestUrl = "";
      for (const item of response.result.tree) {
        if (item.path === "versions-manifest.json") {
          manifestUrl = item.url;
          break;
        }
      }
      headers["accept"] = "application/vnd.github.VERSION.raw";
      let versionsRaw = yield (yield http.get(manifestUrl, headers)).readBody();
      if (versionsRaw) {
        versionsRaw = versionsRaw.replace(/^\uFEFF/, "");
        try {
          releases = JSON.parse(versionsRaw);
        } catch (_a) {
          core4.debug("Invalid json");
        }
      }
      return releases;
    });
  }
  exports.getManifestFromRepo = getManifestFromRepo;
  function findFromManifest(versionSpec, stable, manifest, archFilter = os.arch()) {
    return __awaiter(this, void 0, void 0, function* () {
      const match = yield mm._findMatch(versionSpec, stable, manifest, archFilter);
      return match;
    });
  }
  exports.findFromManifest = findFromManifest;
  function _createExtractFolder(dest) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!dest) {
        dest = path4.join(_getTempDirectory(), v4_1.default());
      }
      yield io.mkdirP(dest);
      return dest;
    });
  }
  function _createToolPath(tool, version, arch) {
    return __awaiter(this, void 0, void 0, function* () {
      const folderPath = path4.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || "");
      core4.debug(`destination ${folderPath}`);
      const markerPath = `${folderPath}.complete`;
      yield io.rmRF(folderPath);
      yield io.rmRF(markerPath);
      yield io.mkdirP(folderPath);
      return folderPath;
    });
  }
  function _completeToolPath(tool, version, arch) {
    const folderPath = path4.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || "");
    const markerPath = `${folderPath}.complete`;
    fs4.writeFileSync(markerPath, "");
    core4.debug("finished caching tool");
  }
  function _isExplicitVersion(versionSpec) {
    const c = semver.clean(versionSpec) || "";
    core4.debug(`isExplicit: ${c}`);
    const valid = semver.valid(c) != null;
    core4.debug(`explicit? ${valid}`);
    return valid;
  }
  function _evaluateVersions(versions, versionSpec) {
    let version = "";
    core4.debug(`evaluating ${versions.length} versions`);
    versions = versions.sort((a, b) => {
      if (semver.gt(a, b)) {
        return 1;
      }
      return -1;
    });
    for (let i = versions.length - 1; i >= 0; i--) {
      const potential = versions[i];
      const satisfied = semver.satisfies(potential, versionSpec);
      if (satisfied) {
        version = potential;
        break;
      }
    }
    if (version) {
      core4.debug(`matched: ${version}`);
    } else {
      core4.debug("match not found");
    }
    return version;
  }
  function _getCacheDirectory() {
    const cacheDirectory = process.env["RUNNER_TOOL_CACHE"] || "";
    assert_1.ok(cacheDirectory, "Expected RUNNER_TOOL_CACHE to be defined");
    return cacheDirectory;
  }
  function _getTempDirectory() {
    const tempDirectory = process.env["RUNNER_TEMP"] || "";
    assert_1.ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
    return tempDirectory;
  }
  function _getGlobal(key, defaultValue) {
    const value = global[key];
    return value !== void 0 ? value : defaultValue;
  }
  function _unique(values) {
    return Array.from(new Set(values));
  }
});

// node_modules/yaml/dist/PlainValue-ec8e588e.js
var require_PlainValue_ec8e588e = __commonJS((exports) => {
  "use strict";
  var Char = {
    ANCHOR: "&",
    COMMENT: "#",
    TAG: "!",
    DIRECTIVES_END: "-",
    DOCUMENT_END: "."
  };
  var Type = {
    ALIAS: "ALIAS",
    BLANK_LINE: "BLANK_LINE",
    BLOCK_FOLDED: "BLOCK_FOLDED",
    BLOCK_LITERAL: "BLOCK_LITERAL",
    COMMENT: "COMMENT",
    DIRECTIVE: "DIRECTIVE",
    DOCUMENT: "DOCUMENT",
    FLOW_MAP: "FLOW_MAP",
    FLOW_SEQ: "FLOW_SEQ",
    MAP: "MAP",
    MAP_KEY: "MAP_KEY",
    MAP_VALUE: "MAP_VALUE",
    PLAIN: "PLAIN",
    QUOTE_DOUBLE: "QUOTE_DOUBLE",
    QUOTE_SINGLE: "QUOTE_SINGLE",
    SEQ: "SEQ",
    SEQ_ITEM: "SEQ_ITEM"
  };
  var defaultTagPrefix = "tag:yaml.org,2002:";
  var defaultTags = {
    MAP: "tag:yaml.org,2002:map",
    SEQ: "tag:yaml.org,2002:seq",
    STR: "tag:yaml.org,2002:str"
  };
  function findLineStarts(src) {
    const ls = [0];
    let offset = src.indexOf("\n");
    while (offset !== -1) {
      offset += 1;
      ls.push(offset);
      offset = src.indexOf("\n", offset);
    }
    return ls;
  }
  function getSrcInfo(cst) {
    let lineStarts, src;
    if (typeof cst === "string") {
      lineStarts = findLineStarts(cst);
      src = cst;
    } else {
      if (Array.isArray(cst))
        cst = cst[0];
      if (cst && cst.context) {
        if (!cst.lineStarts)
          cst.lineStarts = findLineStarts(cst.context.src);
        lineStarts = cst.lineStarts;
        src = cst.context.src;
      }
    }
    return {
      lineStarts,
      src
    };
  }
  function getLinePos(offset, cst) {
    if (typeof offset !== "number" || offset < 0)
      return null;
    const {
      lineStarts,
      src
    } = getSrcInfo(cst);
    if (!lineStarts || !src || offset > src.length)
      return null;
    for (let i = 0; i < lineStarts.length; ++i) {
      const start = lineStarts[i];
      if (offset < start) {
        return {
          line: i,
          col: offset - lineStarts[i - 1] + 1
        };
      }
      if (offset === start)
        return {
          line: i + 1,
          col: 1
        };
    }
    const line = lineStarts.length;
    return {
      line,
      col: offset - lineStarts[line - 1] + 1
    };
  }
  function getLine(line, cst) {
    const {
      lineStarts,
      src
    } = getSrcInfo(cst);
    if (!lineStarts || !(line >= 1) || line > lineStarts.length)
      return null;
    const start = lineStarts[line - 1];
    let end = lineStarts[line];
    while (end && end > start && src[end - 1] === "\n")
      --end;
    return src.slice(start, end);
  }
  function getPrettyContext({
    start,
    end
  }, cst, maxWidth = 80) {
    let src = getLine(start.line, cst);
    if (!src)
      return null;
    let {
      col
    } = start;
    if (src.length > maxWidth) {
      if (col <= maxWidth - 10) {
        src = src.substr(0, maxWidth - 1) + "\u2026";
      } else {
        const halfWidth = Math.round(maxWidth / 2);
        if (src.length > col + halfWidth)
          src = src.substr(0, col + halfWidth - 1) + "\u2026";
        col -= src.length - maxWidth;
        src = "\u2026" + src.substr(1 - maxWidth);
      }
    }
    let errLen = 1;
    let errEnd = "";
    if (end) {
      if (end.line === start.line && col + (end.col - start.col) <= maxWidth + 1) {
        errLen = end.col - start.col;
      } else {
        errLen = Math.min(src.length + 1, maxWidth) - col;
        errEnd = "\u2026";
      }
    }
    const offset = col > 1 ? " ".repeat(col - 1) : "";
    const err = "^".repeat(errLen);
    return `${src}
${offset}${err}${errEnd}`;
  }
  var Range = class {
    static copy(orig) {
      return new Range(orig.start, orig.end);
    }
    constructor(start, end) {
      this.start = start;
      this.end = end || start;
    }
    isEmpty() {
      return typeof this.start !== "number" || !this.end || this.end <= this.start;
    }
    setOrigRange(cr, offset) {
      const {
        start,
        end
      } = this;
      if (cr.length === 0 || end <= cr[0]) {
        this.origStart = start;
        this.origEnd = end;
        return offset;
      }
      let i = offset;
      while (i < cr.length) {
        if (cr[i] > start)
          break;
        else
          ++i;
      }
      this.origStart = start + i;
      const nextOffset = i;
      while (i < cr.length) {
        if (cr[i] >= end)
          break;
        else
          ++i;
      }
      this.origEnd = end + i;
      return nextOffset;
    }
  };
  var Node = class {
    static addStringTerminator(src, offset, str) {
      if (str[str.length - 1] === "\n")
        return str;
      const next = Node.endOfWhiteSpace(src, offset);
      return next >= src.length || src[next] === "\n" ? str + "\n" : str;
    }
    static atDocumentBoundary(src, offset, sep) {
      const ch0 = src[offset];
      if (!ch0)
        return true;
      const prev = src[offset - 1];
      if (prev && prev !== "\n")
        return false;
      if (sep) {
        if (ch0 !== sep)
          return false;
      } else {
        if (ch0 !== Char.DIRECTIVES_END && ch0 !== Char.DOCUMENT_END)
          return false;
      }
      const ch1 = src[offset + 1];
      const ch2 = src[offset + 2];
      if (ch1 !== ch0 || ch2 !== ch0)
        return false;
      const ch3 = src[offset + 3];
      return !ch3 || ch3 === "\n" || ch3 === "	" || ch3 === " ";
    }
    static endOfIdentifier(src, offset) {
      let ch = src[offset];
      const isVerbatim = ch === "<";
      const notOk = isVerbatim ? ["\n", "	", " ", ">"] : ["\n", "	", " ", "[", "]", "{", "}", ","];
      while (ch && notOk.indexOf(ch) === -1)
        ch = src[offset += 1];
      if (isVerbatim && ch === ">")
        offset += 1;
      return offset;
    }
    static endOfIndent(src, offset) {
      let ch = src[offset];
      while (ch === " ")
        ch = src[offset += 1];
      return offset;
    }
    static endOfLine(src, offset) {
      let ch = src[offset];
      while (ch && ch !== "\n")
        ch = src[offset += 1];
      return offset;
    }
    static endOfWhiteSpace(src, offset) {
      let ch = src[offset];
      while (ch === "	" || ch === " ")
        ch = src[offset += 1];
      return offset;
    }
    static startOfLine(src, offset) {
      let ch = src[offset - 1];
      if (ch === "\n")
        return offset;
      while (ch && ch !== "\n")
        ch = src[offset -= 1];
      return offset + 1;
    }
    static endOfBlockIndent(src, indent, lineStart) {
      const inEnd = Node.endOfIndent(src, lineStart);
      if (inEnd > lineStart + indent) {
        return inEnd;
      } else {
        const wsEnd = Node.endOfWhiteSpace(src, inEnd);
        const ch = src[wsEnd];
        if (!ch || ch === "\n")
          return wsEnd;
      }
      return null;
    }
    static atBlank(src, offset, endAsBlank) {
      const ch = src[offset];
      return ch === "\n" || ch === "	" || ch === " " || endAsBlank && !ch;
    }
    static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
      if (!ch || indentDiff < 0)
        return false;
      if (indentDiff > 0)
        return true;
      return indicatorAsIndent && ch === "-";
    }
    static normalizeOffset(src, offset) {
      const ch = src[offset];
      return !ch ? offset : ch !== "\n" && src[offset - 1] === "\n" ? offset - 1 : Node.endOfWhiteSpace(src, offset);
    }
    static foldNewline(src, offset, indent) {
      let inCount = 0;
      let error3 = false;
      let fold = "";
      let ch = src[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n") {
        switch (ch) {
          case "\n":
            inCount = 0;
            offset += 1;
            fold += "\n";
            break;
          case "	":
            if (inCount <= indent)
              error3 = true;
            offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
            break;
          case " ":
            inCount += 1;
            offset += 1;
            break;
        }
        ch = src[offset + 1];
      }
      if (!fold)
        fold = " ";
      if (ch && inCount <= indent)
        error3 = true;
      return {
        fold,
        offset,
        error: error3
      };
    }
    constructor(type, props, context2) {
      Object.defineProperty(this, "context", {
        value: context2 || null,
        writable: true
      });
      this.error = null;
      this.range = null;
      this.valueRange = null;
      this.props = props || [];
      this.type = type;
      this.value = null;
    }
    getPropValue(idx, key, skipKey) {
      if (!this.context)
        return null;
      const {
        src
      } = this.context;
      const prop = this.props[idx];
      return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
    }
    get anchor() {
      for (let i = 0; i < this.props.length; ++i) {
        const anchor = this.getPropValue(i, Char.ANCHOR, true);
        if (anchor != null)
          return anchor;
      }
      return null;
    }
    get comment() {
      const comments = [];
      for (let i = 0; i < this.props.length; ++i) {
        const comment = this.getPropValue(i, Char.COMMENT, true);
        if (comment != null)
          comments.push(comment);
      }
      return comments.length > 0 ? comments.join("\n") : null;
    }
    commentHasRequiredWhitespace(start) {
      const {
        src
      } = this.context;
      if (this.header && start === this.header.end)
        return false;
      if (!this.valueRange)
        return false;
      const {
        end
      } = this.valueRange;
      return start !== end || Node.atBlank(src, end - 1);
    }
    get hasComment() {
      if (this.context) {
        const {
          src
        } = this.context;
        for (let i = 0; i < this.props.length; ++i) {
          if (src[this.props[i].start] === Char.COMMENT)
            return true;
        }
      }
      return false;
    }
    get hasProps() {
      if (this.context) {
        const {
          src
        } = this.context;
        for (let i = 0; i < this.props.length; ++i) {
          if (src[this.props[i].start] !== Char.COMMENT)
            return true;
        }
      }
      return false;
    }
    get includesTrailingLines() {
      return false;
    }
    get jsonLike() {
      const jsonLikeTypes = [Type.FLOW_MAP, Type.FLOW_SEQ, Type.QUOTE_DOUBLE, Type.QUOTE_SINGLE];
      return jsonLikeTypes.indexOf(this.type) !== -1;
    }
    get rangeAsLinePos() {
      if (!this.range || !this.context)
        return void 0;
      const start = getLinePos(this.range.start, this.context.root);
      if (!start)
        return void 0;
      const end = getLinePos(this.range.end, this.context.root);
      return {
        start,
        end
      };
    }
    get rawValue() {
      if (!this.valueRange || !this.context)
        return null;
      const {
        start,
        end
      } = this.valueRange;
      return this.context.src.slice(start, end);
    }
    get tag() {
      for (let i = 0; i < this.props.length; ++i) {
        const tag = this.getPropValue(i, Char.TAG, false);
        if (tag != null) {
          if (tag[1] === "<") {
            return {
              verbatim: tag.slice(2, -1)
            };
          } else {
            const [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
            return {
              handle,
              suffix
            };
          }
        }
      }
      return null;
    }
    get valueRangeContainsNewline() {
      if (!this.valueRange || !this.context)
        return false;
      const {
        start,
        end
      } = this.valueRange;
      const {
        src
      } = this.context;
      for (let i = start; i < end; ++i) {
        if (src[i] === "\n")
          return true;
      }
      return false;
    }
    parseComment(start) {
      const {
        src
      } = this.context;
      if (src[start] === Char.COMMENT) {
        const end = Node.endOfLine(src, start + 1);
        const commentRange = new Range(start, end);
        this.props.push(commentRange);
        return end;
      }
      return start;
    }
    setOrigRanges(cr, offset) {
      if (this.range)
        offset = this.range.setOrigRange(cr, offset);
      if (this.valueRange)
        this.valueRange.setOrigRange(cr, offset);
      this.props.forEach((prop) => prop.setOrigRange(cr, offset));
      return offset;
    }
    toString() {
      const {
        context: {
          src
        },
        range,
        value
      } = this;
      if (value != null)
        return value;
      const str = src.slice(range.start, range.end);
      return Node.addStringTerminator(src, range.end, str);
    }
  };
  var YAMLError = class extends Error {
    constructor(name, source, message) {
      if (!message || !(source instanceof Node))
        throw new Error(`Invalid arguments for new ${name}`);
      super();
      this.name = name;
      this.message = message;
      this.source = source;
    }
    makePretty() {
      if (!this.source)
        return;
      this.nodeType = this.source.type;
      const cst = this.source.context && this.source.context.root;
      if (typeof this.offset === "number") {
        this.range = new Range(this.offset, this.offset + 1);
        const start = cst && getLinePos(this.offset, cst);
        if (start) {
          const end = {
            line: start.line,
            col: start.col + 1
          };
          this.linePos = {
            start,
            end
          };
        }
        delete this.offset;
      } else {
        this.range = this.source.range;
        this.linePos = this.source.rangeAsLinePos;
      }
      if (this.linePos) {
        const {
          line,
          col
        } = this.linePos.start;
        this.message += ` at line ${line}, column ${col}`;
        const ctx = cst && getPrettyContext(this.linePos, cst);
        if (ctx)
          this.message += `:

${ctx}
`;
      }
      delete this.source;
    }
  };
  var YAMLReferenceError = class extends YAMLError {
    constructor(source, message) {
      super("YAMLReferenceError", source, message);
    }
  };
  var YAMLSemanticError = class extends YAMLError {
    constructor(source, message) {
      super("YAMLSemanticError", source, message);
    }
  };
  var YAMLSyntaxError = class extends YAMLError {
    constructor(source, message) {
      super("YAMLSyntaxError", source, message);
    }
  };
  var YAMLWarning = class extends YAMLError {
    constructor(source, message) {
      super("YAMLWarning", source, message);
    }
  };
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var PlainValue = class extends Node {
    static endOfLine(src, start, inFlow) {
      let ch = src[start];
      let offset = start;
      while (ch && ch !== "\n") {
        if (inFlow && (ch === "[" || ch === "]" || ch === "{" || ch === "}" || ch === ","))
          break;
        const next = src[offset + 1];
        if (ch === ":" && (!next || next === "\n" || next === "	" || next === " " || inFlow && next === ","))
          break;
        if ((ch === " " || ch === "	") && next === "#")
          break;
        offset += 1;
        ch = next;
      }
      return offset;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      let {
        start,
        end
      } = this.valueRange;
      const {
        src
      } = this.context;
      let ch = src[end - 1];
      while (start < end && (ch === "\n" || ch === "	" || ch === " "))
        ch = src[--end - 1];
      let str = "";
      for (let i = start; i < end; ++i) {
        const ch2 = src[i];
        if (ch2 === "\n") {
          const {
            fold,
            offset
          } = Node.foldNewline(src, i, -1);
          str += fold;
          i = offset;
        } else if (ch2 === " " || ch2 === "	") {
          const wsStart = i;
          let next = src[i + 1];
          while (i < end && (next === " " || next === "	")) {
            i += 1;
            next = src[i + 1];
          }
          if (next !== "\n")
            str += i > wsStart ? src.slice(wsStart, i + 1) : ch2;
        } else {
          str += ch2;
        }
      }
      const ch0 = src[start];
      switch (ch0) {
        case "	": {
          const msg = "Plain value cannot start with a tab character";
          const errors = [new YAMLSemanticError(this, msg)];
          return {
            errors,
            str
          };
        }
        case "@":
        case "`": {
          const msg = `Plain value cannot start with reserved character ${ch0}`;
          const errors = [new YAMLSemanticError(this, msg)];
          return {
            errors,
            str
          };
        }
        default:
          return str;
      }
    }
    parseBlockValue(start) {
      const {
        indent,
        inFlow,
        src
      } = this.context;
      let offset = start;
      let valueEnd = start;
      for (let ch = src[offset]; ch === "\n"; ch = src[offset]) {
        if (Node.atDocumentBoundary(src, offset + 1))
          break;
        const end = Node.endOfBlockIndent(src, indent, offset + 1);
        if (end === null || src[end] === "#")
          break;
        if (src[end] === "\n") {
          offset = end;
        } else {
          valueEnd = PlainValue.endOfLine(src, end, inFlow);
          offset = valueEnd;
        }
      }
      if (this.valueRange.isEmpty())
        this.valueRange.start = start;
      this.valueRange.end = valueEnd;
      return valueEnd;
    }
    parse(context2, start) {
      this.context = context2;
      const {
        inFlow,
        src
      } = context2;
      let offset = start;
      const ch = src[offset];
      if (ch && ch !== "#" && ch !== "\n") {
        offset = PlainValue.endOfLine(src, start, inFlow);
      }
      this.valueRange = new Range(start, offset);
      offset = Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      if (!this.hasComment || this.valueRange.isEmpty()) {
        offset = this.parseBlockValue(offset);
      }
      return offset;
    }
  };
  exports.Char = Char;
  exports.Node = Node;
  exports.PlainValue = PlainValue;
  exports.Range = Range;
  exports.Type = Type;
  exports.YAMLError = YAMLError;
  exports.YAMLReferenceError = YAMLReferenceError;
  exports.YAMLSemanticError = YAMLSemanticError;
  exports.YAMLSyntaxError = YAMLSyntaxError;
  exports.YAMLWarning = YAMLWarning;
  exports._defineProperty = _defineProperty;
  exports.defaultTagPrefix = defaultTagPrefix;
  exports.defaultTags = defaultTags;
});

// node_modules/yaml/dist/parse-cst.js
var require_parse_cst = __commonJS((exports) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e();
  var BlankLine = class extends PlainValue.Node {
    constructor() {
      super(PlainValue.Type.BLANK_LINE);
    }
    get includesTrailingLines() {
      return true;
    }
    parse(context2, start) {
      this.context = context2;
      this.range = new PlainValue.Range(start, start + 1);
      return start + 1;
    }
  };
  var CollectionItem = class extends PlainValue.Node {
    constructor(type, props) {
      super(type, props);
      this.node = null;
    }
    get includesTrailingLines() {
      return !!this.node && this.node.includesTrailingLines;
    }
    parse(context2, start) {
      this.context = context2;
      const {
        parseNode,
        src
      } = context2;
      let {
        atLineStart,
        lineStart
      } = context2;
      if (!atLineStart && this.type === PlainValue.Type.SEQ_ITEM)
        this.error = new PlainValue.YAMLSemanticError(this, "Sequence items must not have preceding content on the same line");
      const indent = atLineStart ? start - lineStart : context2.indent;
      let offset = PlainValue.Node.endOfWhiteSpace(src, start + 1);
      let ch = src[offset];
      const inlineComment = ch === "#";
      const comments = [];
      let blankLine = null;
      while (ch === "\n" || ch === "#") {
        if (ch === "#") {
          const end2 = PlainValue.Node.endOfLine(src, offset + 1);
          comments.push(new PlainValue.Range(offset, end2));
          offset = end2;
        } else {
          atLineStart = true;
          lineStart = offset + 1;
          const wsEnd = PlainValue.Node.endOfWhiteSpace(src, lineStart);
          if (src[wsEnd] === "\n" && comments.length === 0) {
            blankLine = new BlankLine();
            lineStart = blankLine.parse({
              src
            }, lineStart);
          }
          offset = PlainValue.Node.endOfIndent(src, lineStart);
        }
        ch = src[offset];
      }
      if (PlainValue.Node.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== PlainValue.Type.SEQ_ITEM)) {
        this.node = parseNode({
          atLineStart,
          inCollection: false,
          indent,
          lineStart,
          parent: this
        }, offset);
      } else if (ch && lineStart > start + 1) {
        offset = lineStart - 1;
      }
      if (this.node) {
        if (blankLine) {
          const items = context2.parent.items || context2.parent.contents;
          if (items)
            items.push(blankLine);
        }
        if (comments.length)
          Array.prototype.push.apply(this.props, comments);
        offset = this.node.range.end;
      } else {
        if (inlineComment) {
          const c = comments[0];
          this.props.push(c);
          offset = c.end;
        } else {
          offset = PlainValue.Node.endOfLine(src, start + 1);
        }
      }
      const end = this.node ? this.node.valueRange.end : offset;
      this.valueRange = new PlainValue.Range(start, end);
      return offset;
    }
    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      return this.node ? this.node.setOrigRanges(cr, offset) : offset;
    }
    toString() {
      const {
        context: {
          src
        },
        node,
        range,
        value
      } = this;
      if (value != null)
        return value;
      const str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
      return PlainValue.Node.addStringTerminator(src, range.end, str);
    }
  };
  var Comment = class extends PlainValue.Node {
    constructor() {
      super(PlainValue.Type.COMMENT);
    }
    parse(context2, start) {
      this.context = context2;
      const offset = this.parseComment(start);
      this.range = new PlainValue.Range(start, offset);
      return offset;
    }
  };
  function grabCollectionEndComments(node) {
    let cnode = node;
    while (cnode instanceof CollectionItem)
      cnode = cnode.node;
    if (!(cnode instanceof Collection))
      return null;
    const len = cnode.items.length;
    let ci = -1;
    for (let i = len - 1; i >= 0; --i) {
      const n = cnode.items[i];
      if (n.type === PlainValue.Type.COMMENT) {
        const {
          indent,
          lineStart
        } = n.context;
        if (indent > 0 && n.range.start >= lineStart + indent)
          break;
        ci = i;
      } else if (n.type === PlainValue.Type.BLANK_LINE)
        ci = i;
      else
        break;
    }
    if (ci === -1)
      return null;
    const ca = cnode.items.splice(ci, len - ci);
    const prevEnd = ca[0].range.start;
    while (true) {
      cnode.range.end = prevEnd;
      if (cnode.valueRange && cnode.valueRange.end > prevEnd)
        cnode.valueRange.end = prevEnd;
      if (cnode === node)
        break;
      cnode = cnode.context.parent;
    }
    return ca;
  }
  var Collection = class extends PlainValue.Node {
    static nextContentHasIndent(src, offset, indent) {
      const lineStart = PlainValue.Node.endOfLine(src, offset) + 1;
      offset = PlainValue.Node.endOfWhiteSpace(src, lineStart);
      const ch = src[offset];
      if (!ch)
        return false;
      if (offset >= lineStart + indent)
        return true;
      if (ch !== "#" && ch !== "\n")
        return false;
      return Collection.nextContentHasIndent(src, offset, indent);
    }
    constructor(firstItem) {
      super(firstItem.type === PlainValue.Type.SEQ_ITEM ? PlainValue.Type.SEQ : PlainValue.Type.MAP);
      for (let i = firstItem.props.length - 1; i >= 0; --i) {
        if (firstItem.props[i].start < firstItem.context.lineStart) {
          this.props = firstItem.props.slice(0, i + 1);
          firstItem.props = firstItem.props.slice(i + 1);
          const itemRange = firstItem.props[0] || firstItem.valueRange;
          firstItem.range.start = itemRange.start;
          break;
        }
      }
      this.items = [firstItem];
      const ec = grabCollectionEndComments(firstItem);
      if (ec)
        Array.prototype.push.apply(this.items, ec);
    }
    get includesTrailingLines() {
      return this.items.length > 0;
    }
    parse(context2, start) {
      this.context = context2;
      const {
        parseNode,
        src
      } = context2;
      let lineStart = PlainValue.Node.startOfLine(src, start);
      const firstItem = this.items[0];
      firstItem.context.parent = this;
      this.valueRange = PlainValue.Range.copy(firstItem.valueRange);
      const indent = firstItem.range.start - firstItem.context.lineStart;
      let offset = start;
      offset = PlainValue.Node.normalizeOffset(src, offset);
      let ch = src[offset];
      let atLineStart = PlainValue.Node.endOfWhiteSpace(src, lineStart) === offset;
      let prevIncludesTrailingLines = false;
      while (ch) {
        while (ch === "\n" || ch === "#") {
          if (atLineStart && ch === "\n" && !prevIncludesTrailingLines) {
            const blankLine = new BlankLine();
            offset = blankLine.parse({
              src
            }, offset);
            this.valueRange.end = offset;
            if (offset >= src.length) {
              ch = null;
              break;
            }
            this.items.push(blankLine);
            offset -= 1;
          } else if (ch === "#") {
            if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
              return offset;
            }
            const comment = new Comment();
            offset = comment.parse({
              indent,
              lineStart,
              src
            }, offset);
            this.items.push(comment);
            this.valueRange.end = offset;
            if (offset >= src.length) {
              ch = null;
              break;
            }
          }
          lineStart = offset + 1;
          offset = PlainValue.Node.endOfIndent(src, lineStart);
          if (PlainValue.Node.atBlank(src, offset)) {
            const wsEnd = PlainValue.Node.endOfWhiteSpace(src, offset);
            const next = src[wsEnd];
            if (!next || next === "\n" || next === "#") {
              offset = wsEnd;
            }
          }
          ch = src[offset];
          atLineStart = true;
        }
        if (!ch) {
          break;
        }
        if (offset !== lineStart + indent && (atLineStart || ch !== ":")) {
          if (offset < lineStart + indent) {
            if (lineStart > start)
              offset = lineStart;
            break;
          } else if (!this.error) {
            const msg = "All collection items must start at the same column";
            this.error = new PlainValue.YAMLSyntaxError(this, msg);
          }
        }
        if (firstItem.type === PlainValue.Type.SEQ_ITEM) {
          if (ch !== "-") {
            if (lineStart > start)
              offset = lineStart;
            break;
          }
        } else if (ch === "-" && !this.error) {
          const next = src[offset + 1];
          if (!next || next === "\n" || next === "	" || next === " ") {
            const msg = "A collection cannot be both a mapping and a sequence";
            this.error = new PlainValue.YAMLSyntaxError(this, msg);
          }
        }
        const node = parseNode({
          atLineStart,
          inCollection: true,
          indent,
          lineStart,
          parent: this
        }, offset);
        if (!node)
          return offset;
        this.items.push(node);
        this.valueRange.end = node.valueRange.end;
        offset = PlainValue.Node.normalizeOffset(src, node.range.end);
        ch = src[offset];
        atLineStart = false;
        prevIncludesTrailingLines = node.includesTrailingLines;
        if (ch) {
          let ls = offset - 1;
          let prev = src[ls];
          while (prev === " " || prev === "	")
            prev = src[--ls];
          if (prev === "\n") {
            lineStart = ls + 1;
            atLineStart = true;
          }
        }
        const ec = grabCollectionEndComments(node);
        if (ec)
          Array.prototype.push.apply(this.items, ec);
      }
      return offset;
    }
    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      this.items.forEach((node) => {
        offset = node.setOrigRanges(cr, offset);
      });
      return offset;
    }
    toString() {
      const {
        context: {
          src
        },
        items,
        range,
        value
      } = this;
      if (value != null)
        return value;
      let str = src.slice(range.start, items[0].range.start) + String(items[0]);
      for (let i = 1; i < items.length; ++i) {
        const item = items[i];
        const {
          atLineStart,
          indent
        } = item.context;
        if (atLineStart)
          for (let i2 = 0; i2 < indent; ++i2)
            str += " ";
        str += String(item);
      }
      return PlainValue.Node.addStringTerminator(src, range.end, str);
    }
  };
  var Directive = class extends PlainValue.Node {
    constructor() {
      super(PlainValue.Type.DIRECTIVE);
      this.name = null;
    }
    get parameters() {
      const raw = this.rawValue;
      return raw ? raw.trim().split(/[ \t]+/) : [];
    }
    parseName(start) {
      const {
        src
      } = this.context;
      let offset = start;
      let ch = src[offset];
      while (ch && ch !== "\n" && ch !== "	" && ch !== " ")
        ch = src[offset += 1];
      this.name = src.slice(start, offset);
      return offset;
    }
    parseParameters(start) {
      const {
        src
      } = this.context;
      let offset = start;
      let ch = src[offset];
      while (ch && ch !== "\n" && ch !== "#")
        ch = src[offset += 1];
      this.valueRange = new PlainValue.Range(start, offset);
      return offset;
    }
    parse(context2, start) {
      this.context = context2;
      let offset = this.parseName(start + 1);
      offset = this.parseParameters(offset);
      offset = this.parseComment(offset);
      this.range = new PlainValue.Range(start, offset);
      return offset;
    }
  };
  var Document = class extends PlainValue.Node {
    static startCommentOrEndBlankLine(src, start) {
      const offset = PlainValue.Node.endOfWhiteSpace(src, start);
      const ch = src[offset];
      return ch === "#" || ch === "\n" ? offset : start;
    }
    constructor() {
      super(PlainValue.Type.DOCUMENT);
      this.directives = null;
      this.contents = null;
      this.directivesEndMarker = null;
      this.documentEndMarker = null;
    }
    parseDirectives(start) {
      const {
        src
      } = this.context;
      this.directives = [];
      let atLineStart = true;
      let hasDirectives = false;
      let offset = start;
      while (!PlainValue.Node.atDocumentBoundary(src, offset, PlainValue.Char.DIRECTIVES_END)) {
        offset = Document.startCommentOrEndBlankLine(src, offset);
        switch (src[offset]) {
          case "\n":
            if (atLineStart) {
              const blankLine = new BlankLine();
              offset = blankLine.parse({
                src
              }, offset);
              if (offset < src.length) {
                this.directives.push(blankLine);
              }
            } else {
              offset += 1;
              atLineStart = true;
            }
            break;
          case "#":
            {
              const comment = new Comment();
              offset = comment.parse({
                src
              }, offset);
              this.directives.push(comment);
              atLineStart = false;
            }
            break;
          case "%":
            {
              const directive = new Directive();
              offset = directive.parse({
                parent: this,
                src
              }, offset);
              this.directives.push(directive);
              hasDirectives = true;
              atLineStart = false;
            }
            break;
          default:
            if (hasDirectives) {
              this.error = new PlainValue.YAMLSemanticError(this, "Missing directives-end indicator line");
            } else if (this.directives.length > 0) {
              this.contents = this.directives;
              this.directives = [];
            }
            return offset;
        }
      }
      if (src[offset]) {
        this.directivesEndMarker = new PlainValue.Range(offset, offset + 3);
        return offset + 3;
      }
      if (hasDirectives) {
        this.error = new PlainValue.YAMLSemanticError(this, "Missing directives-end indicator line");
      } else if (this.directives.length > 0) {
        this.contents = this.directives;
        this.directives = [];
      }
      return offset;
    }
    parseContents(start) {
      const {
        parseNode,
        src
      } = this.context;
      if (!this.contents)
        this.contents = [];
      let lineStart = start;
      while (src[lineStart - 1] === "-")
        lineStart -= 1;
      let offset = PlainValue.Node.endOfWhiteSpace(src, start);
      let atLineStart = lineStart === start;
      this.valueRange = new PlainValue.Range(offset);
      while (!PlainValue.Node.atDocumentBoundary(src, offset, PlainValue.Char.DOCUMENT_END)) {
        switch (src[offset]) {
          case "\n":
            if (atLineStart) {
              const blankLine = new BlankLine();
              offset = blankLine.parse({
                src
              }, offset);
              if (offset < src.length) {
                this.contents.push(blankLine);
              }
            } else {
              offset += 1;
              atLineStart = true;
            }
            lineStart = offset;
            break;
          case "#":
            {
              const comment = new Comment();
              offset = comment.parse({
                src
              }, offset);
              this.contents.push(comment);
              atLineStart = false;
            }
            break;
          default: {
            const iEnd = PlainValue.Node.endOfIndent(src, offset);
            const context2 = {
              atLineStart,
              indent: -1,
              inFlow: false,
              inCollection: false,
              lineStart,
              parent: this
            };
            const node = parseNode(context2, iEnd);
            if (!node)
              return this.valueRange.end = iEnd;
            this.contents.push(node);
            offset = node.range.end;
            atLineStart = false;
            const ec = grabCollectionEndComments(node);
            if (ec)
              Array.prototype.push.apply(this.contents, ec);
          }
        }
        offset = Document.startCommentOrEndBlankLine(src, offset);
      }
      this.valueRange.end = offset;
      if (src[offset]) {
        this.documentEndMarker = new PlainValue.Range(offset, offset + 3);
        offset += 3;
        if (src[offset]) {
          offset = PlainValue.Node.endOfWhiteSpace(src, offset);
          if (src[offset] === "#") {
            const comment = new Comment();
            offset = comment.parse({
              src
            }, offset);
            this.contents.push(comment);
          }
          switch (src[offset]) {
            case "\n":
              offset += 1;
              break;
            case void 0:
              break;
            default:
              this.error = new PlainValue.YAMLSyntaxError(this, "Document end marker line cannot have a non-comment suffix");
          }
        }
      }
      return offset;
    }
    parse(context2, start) {
      context2.root = this;
      this.context = context2;
      const {
        src
      } = context2;
      let offset = src.charCodeAt(start) === 65279 ? start + 1 : start;
      offset = this.parseDirectives(offset);
      offset = this.parseContents(offset);
      return offset;
    }
    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      this.directives.forEach((node) => {
        offset = node.setOrigRanges(cr, offset);
      });
      if (this.directivesEndMarker)
        offset = this.directivesEndMarker.setOrigRange(cr, offset);
      this.contents.forEach((node) => {
        offset = node.setOrigRanges(cr, offset);
      });
      if (this.documentEndMarker)
        offset = this.documentEndMarker.setOrigRange(cr, offset);
      return offset;
    }
    toString() {
      const {
        contents,
        directives,
        value
      } = this;
      if (value != null)
        return value;
      let str = directives.join("");
      if (contents.length > 0) {
        if (directives.length > 0 || contents[0].type === PlainValue.Type.COMMENT)
          str += "---\n";
        str += contents.join("");
      }
      if (str[str.length - 1] !== "\n")
        str += "\n";
      return str;
    }
  };
  var Alias = class extends PlainValue.Node {
    parse(context2, start) {
      this.context = context2;
      const {
        src
      } = context2;
      let offset = PlainValue.Node.endOfIdentifier(src, start + 1);
      this.valueRange = new PlainValue.Range(start + 1, offset);
      offset = PlainValue.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      return offset;
    }
  };
  var Chomp = {
    CLIP: "CLIP",
    KEEP: "KEEP",
    STRIP: "STRIP"
  };
  var BlockValue = class extends PlainValue.Node {
    constructor(type, props) {
      super(type, props);
      this.blockIndent = null;
      this.chomping = Chomp.CLIP;
      this.header = null;
    }
    get includesTrailingLines() {
      return this.chomping === Chomp.KEEP;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      let {
        start,
        end
      } = this.valueRange;
      const {
        indent,
        src
      } = this.context;
      if (this.valueRange.isEmpty())
        return "";
      let lastNewLine = null;
      let ch = src[end - 1];
      while (ch === "\n" || ch === "	" || ch === " ") {
        end -= 1;
        if (end <= start) {
          if (this.chomping === Chomp.KEEP)
            break;
          else
            return "";
        }
        if (ch === "\n")
          lastNewLine = end;
        ch = src[end - 1];
      }
      let keepStart = end + 1;
      if (lastNewLine) {
        if (this.chomping === Chomp.KEEP) {
          keepStart = lastNewLine;
          end = this.valueRange.end;
        } else {
          end = lastNewLine;
        }
      }
      const bi = indent + this.blockIndent;
      const folded = this.type === PlainValue.Type.BLOCK_FOLDED;
      let atStart = true;
      let str = "";
      let sep = "";
      let prevMoreIndented = false;
      for (let i = start; i < end; ++i) {
        for (let j = 0; j < bi; ++j) {
          if (src[i] !== " ")
            break;
          i += 1;
        }
        const ch2 = src[i];
        if (ch2 === "\n") {
          if (sep === "\n")
            str += "\n";
          else
            sep = "\n";
        } else {
          const lineEnd = PlainValue.Node.endOfLine(src, i);
          const line = src.slice(i, lineEnd);
          i = lineEnd;
          if (folded && (ch2 === " " || ch2 === "	") && i < keepStart) {
            if (sep === " ")
              sep = "\n";
            else if (!prevMoreIndented && !atStart && sep === "\n")
              sep = "\n\n";
            str += sep + line;
            sep = lineEnd < end && src[lineEnd] || "";
            prevMoreIndented = true;
          } else {
            str += sep + line;
            sep = folded && i < keepStart ? " " : "\n";
            prevMoreIndented = false;
          }
          if (atStart && line !== "")
            atStart = false;
        }
      }
      return this.chomping === Chomp.STRIP ? str : str + "\n";
    }
    parseBlockHeader(start) {
      const {
        src
      } = this.context;
      let offset = start + 1;
      let bi = "";
      while (true) {
        const ch = src[offset];
        switch (ch) {
          case "-":
            this.chomping = Chomp.STRIP;
            break;
          case "+":
            this.chomping = Chomp.KEEP;
            break;
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            bi += ch;
            break;
          default:
            this.blockIndent = Number(bi) || null;
            this.header = new PlainValue.Range(start, offset);
            return offset;
        }
        offset += 1;
      }
    }
    parseBlockValue(start) {
      const {
        indent,
        src
      } = this.context;
      const explicit = !!this.blockIndent;
      let offset = start;
      let valueEnd = start;
      let minBlockIndent = 1;
      for (let ch = src[offset]; ch === "\n"; ch = src[offset]) {
        offset += 1;
        if (PlainValue.Node.atDocumentBoundary(src, offset))
          break;
        const end = PlainValue.Node.endOfBlockIndent(src, indent, offset);
        if (end === null)
          break;
        const ch2 = src[end];
        const lineIndent = end - (offset + indent);
        if (!this.blockIndent) {
          if (src[end] !== "\n") {
            if (lineIndent < minBlockIndent) {
              const msg = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
              this.error = new PlainValue.YAMLSemanticError(this, msg);
            }
            this.blockIndent = lineIndent;
          } else if (lineIndent > minBlockIndent) {
            minBlockIndent = lineIndent;
          }
        } else if (ch2 && ch2 !== "\n" && lineIndent < this.blockIndent) {
          if (src[end] === "#")
            break;
          if (!this.error) {
            const src2 = explicit ? "explicit indentation indicator" : "first line";
            const msg = `Block scalars must not be less indented than their ${src2}`;
            this.error = new PlainValue.YAMLSemanticError(this, msg);
          }
        }
        if (src[end] === "\n") {
          offset = end;
        } else {
          offset = valueEnd = PlainValue.Node.endOfLine(src, end);
        }
      }
      if (this.chomping !== Chomp.KEEP) {
        offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
      }
      this.valueRange = new PlainValue.Range(start + 1, offset);
      return offset;
    }
    parse(context2, start) {
      this.context = context2;
      const {
        src
      } = context2;
      let offset = this.parseBlockHeader(start);
      offset = PlainValue.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      offset = this.parseBlockValue(offset);
      return offset;
    }
    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      return this.header ? this.header.setOrigRange(cr, offset) : offset;
    }
  };
  var FlowCollection = class extends PlainValue.Node {
    constructor(type, props) {
      super(type, props);
      this.items = null;
    }
    prevNodeIsJsonLike(idx = this.items.length) {
      const node = this.items[idx - 1];
      return !!node && (node.jsonLike || node.type === PlainValue.Type.COMMENT && this.prevNodeIsJsonLike(idx - 1));
    }
    parse(context2, start) {
      this.context = context2;
      const {
        parseNode,
        src
      } = context2;
      let {
        indent,
        lineStart
      } = context2;
      let char = src[start];
      this.items = [{
        char,
        offset: start
      }];
      let offset = PlainValue.Node.endOfWhiteSpace(src, start + 1);
      char = src[offset];
      while (char && char !== "]" && char !== "}") {
        switch (char) {
          case "\n":
            {
              lineStart = offset + 1;
              const wsEnd = PlainValue.Node.endOfWhiteSpace(src, lineStart);
              if (src[wsEnd] === "\n") {
                const blankLine = new BlankLine();
                lineStart = blankLine.parse({
                  src
                }, lineStart);
                this.items.push(blankLine);
              }
              offset = PlainValue.Node.endOfIndent(src, lineStart);
              if (offset <= lineStart + indent) {
                char = src[offset];
                if (offset < lineStart + indent || char !== "]" && char !== "}") {
                  const msg = "Insufficient indentation in flow collection";
                  this.error = new PlainValue.YAMLSemanticError(this, msg);
                }
              }
            }
            break;
          case ",":
            {
              this.items.push({
                char,
                offset
              });
              offset += 1;
            }
            break;
          case "#":
            {
              const comment = new Comment();
              offset = comment.parse({
                src
              }, offset);
              this.items.push(comment);
            }
            break;
          case "?":
          case ":": {
            const next = src[offset + 1];
            if (next === "\n" || next === "	" || next === " " || next === "," || char === ":" && this.prevNodeIsJsonLike()) {
              this.items.push({
                char,
                offset
              });
              offset += 1;
              break;
            }
          }
          default: {
            const node = parseNode({
              atLineStart: false,
              inCollection: false,
              inFlow: true,
              indent: -1,
              lineStart,
              parent: this
            }, offset);
            if (!node) {
              this.valueRange = new PlainValue.Range(start, offset);
              return offset;
            }
            this.items.push(node);
            offset = PlainValue.Node.normalizeOffset(src, node.range.end);
          }
        }
        offset = PlainValue.Node.endOfWhiteSpace(src, offset);
        char = src[offset];
      }
      this.valueRange = new PlainValue.Range(start, offset + 1);
      if (char) {
        this.items.push({
          char,
          offset
        });
        offset = PlainValue.Node.endOfWhiteSpace(src, offset + 1);
        offset = this.parseComment(offset);
      }
      return offset;
    }
    setOrigRanges(cr, offset) {
      offset = super.setOrigRanges(cr, offset);
      this.items.forEach((node) => {
        if (node instanceof PlainValue.Node) {
          offset = node.setOrigRanges(cr, offset);
        } else if (cr.length === 0) {
          node.origOffset = node.offset;
        } else {
          let i = offset;
          while (i < cr.length) {
            if (cr[i] > node.offset)
              break;
            else
              ++i;
          }
          node.origOffset = node.offset + i;
          offset = i;
        }
      });
      return offset;
    }
    toString() {
      const {
        context: {
          src
        },
        items,
        range,
        value
      } = this;
      if (value != null)
        return value;
      const nodes = items.filter((item) => item instanceof PlainValue.Node);
      let str = "";
      let prevEnd = range.start;
      nodes.forEach((node) => {
        const prefix = src.slice(prevEnd, node.range.start);
        prevEnd = node.range.end;
        str += prefix + String(node);
        if (str[str.length - 1] === "\n" && src[prevEnd - 1] !== "\n" && src[prevEnd] === "\n") {
          prevEnd += 1;
        }
      });
      str += src.slice(prevEnd, range.end);
      return PlainValue.Node.addStringTerminator(src, range.end, str);
    }
  };
  var QuoteDouble = class extends PlainValue.Node {
    static endOfQuote(src, offset) {
      let ch = src[offset];
      while (ch && ch !== '"') {
        offset += ch === "\\" ? 2 : 1;
        ch = src[offset];
      }
      return offset + 1;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      const errors = [];
      const {
        start,
        end
      } = this.valueRange;
      const {
        indent,
        src
      } = this.context;
      if (src[end - 1] !== '"')
        errors.push(new PlainValue.YAMLSyntaxError(this, 'Missing closing "quote'));
      let str = "";
      for (let i = start + 1; i < end - 1; ++i) {
        const ch = src[i];
        if (ch === "\n") {
          if (PlainValue.Node.atDocumentBoundary(src, i + 1))
            errors.push(new PlainValue.YAMLSemanticError(this, "Document boundary indicators are not allowed within string values"));
          const {
            fold,
            offset,
            error: error3
          } = PlainValue.Node.foldNewline(src, i, indent);
          str += fold;
          i = offset;
          if (error3)
            errors.push(new PlainValue.YAMLSemanticError(this, "Multi-line double-quoted string needs to be sufficiently indented"));
        } else if (ch === "\\") {
          i += 1;
          switch (src[i]) {
            case "0":
              str += "\0";
              break;
            case "a":
              str += "\x07";
              break;
            case "b":
              str += "\b";
              break;
            case "e":
              str += "";
              break;
            case "f":
              str += "\f";
              break;
            case "n":
              str += "\n";
              break;
            case "r":
              str += "\r";
              break;
            case "t":
              str += "	";
              break;
            case "v":
              str += "\v";
              break;
            case "N":
              str += "\x85";
              break;
            case "_":
              str += "\xA0";
              break;
            case "L":
              str += "\u2028";
              break;
            case "P":
              str += "\u2029";
              break;
            case " ":
              str += " ";
              break;
            case '"':
              str += '"';
              break;
            case "/":
              str += "/";
              break;
            case "\\":
              str += "\\";
              break;
            case "	":
              str += "	";
              break;
            case "x":
              str += this.parseCharCode(i + 1, 2, errors);
              i += 2;
              break;
            case "u":
              str += this.parseCharCode(i + 1, 4, errors);
              i += 4;
              break;
            case "U":
              str += this.parseCharCode(i + 1, 8, errors);
              i += 8;
              break;
            case "\n":
              while (src[i + 1] === " " || src[i + 1] === "	")
                i += 1;
              break;
            default:
              errors.push(new PlainValue.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`));
              str += "\\" + src[i];
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = src[i + 1];
          while (next === " " || next === "	") {
            i += 1;
            next = src[i + 1];
          }
          if (next !== "\n")
            str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
        } else {
          str += ch;
        }
      }
      return errors.length > 0 ? {
        errors,
        str
      } : str;
    }
    parseCharCode(offset, length, errors) {
      const {
        src
      } = this.context;
      const cc = src.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      if (isNaN(code)) {
        errors.push(new PlainValue.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`));
        return src.substr(offset - 2, length + 2);
      }
      return String.fromCodePoint(code);
    }
    parse(context2, start) {
      this.context = context2;
      const {
        src
      } = context2;
      let offset = QuoteDouble.endOfQuote(src, start + 1);
      this.valueRange = new PlainValue.Range(start, offset);
      offset = PlainValue.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      return offset;
    }
  };
  var QuoteSingle = class extends PlainValue.Node {
    static endOfQuote(src, offset) {
      let ch = src[offset];
      while (ch) {
        if (ch === "'") {
          if (src[offset + 1] !== "'")
            break;
          ch = src[offset += 2];
        } else {
          ch = src[offset += 1];
        }
      }
      return offset + 1;
    }
    get strValue() {
      if (!this.valueRange || !this.context)
        return null;
      const errors = [];
      const {
        start,
        end
      } = this.valueRange;
      const {
        indent,
        src
      } = this.context;
      if (src[end - 1] !== "'")
        errors.push(new PlainValue.YAMLSyntaxError(this, "Missing closing 'quote"));
      let str = "";
      for (let i = start + 1; i < end - 1; ++i) {
        const ch = src[i];
        if (ch === "\n") {
          if (PlainValue.Node.atDocumentBoundary(src, i + 1))
            errors.push(new PlainValue.YAMLSemanticError(this, "Document boundary indicators are not allowed within string values"));
          const {
            fold,
            offset,
            error: error3
          } = PlainValue.Node.foldNewline(src, i, indent);
          str += fold;
          i = offset;
          if (error3)
            errors.push(new PlainValue.YAMLSemanticError(this, "Multi-line single-quoted string needs to be sufficiently indented"));
        } else if (ch === "'") {
          str += ch;
          i += 1;
          if (src[i] !== "'")
            errors.push(new PlainValue.YAMLSyntaxError(this, "Unescaped single quote? This should not happen."));
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = src[i + 1];
          while (next === " " || next === "	") {
            i += 1;
            next = src[i + 1];
          }
          if (next !== "\n")
            str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
        } else {
          str += ch;
        }
      }
      return errors.length > 0 ? {
        errors,
        str
      } : str;
    }
    parse(context2, start) {
      this.context = context2;
      const {
        src
      } = context2;
      let offset = QuoteSingle.endOfQuote(src, start + 1);
      this.valueRange = new PlainValue.Range(start, offset);
      offset = PlainValue.Node.endOfWhiteSpace(src, offset);
      offset = this.parseComment(offset);
      return offset;
    }
  };
  function createNewNode(type, props) {
    switch (type) {
      case PlainValue.Type.ALIAS:
        return new Alias(type, props);
      case PlainValue.Type.BLOCK_FOLDED:
      case PlainValue.Type.BLOCK_LITERAL:
        return new BlockValue(type, props);
      case PlainValue.Type.FLOW_MAP:
      case PlainValue.Type.FLOW_SEQ:
        return new FlowCollection(type, props);
      case PlainValue.Type.MAP_KEY:
      case PlainValue.Type.MAP_VALUE:
      case PlainValue.Type.SEQ_ITEM:
        return new CollectionItem(type, props);
      case PlainValue.Type.COMMENT:
      case PlainValue.Type.PLAIN:
        return new PlainValue.PlainValue(type, props);
      case PlainValue.Type.QUOTE_DOUBLE:
        return new QuoteDouble(type, props);
      case PlainValue.Type.QUOTE_SINGLE:
        return new QuoteSingle(type, props);
      default:
        return null;
    }
  }
  var ParseContext = class {
    static parseType(src, offset, inFlow) {
      switch (src[offset]) {
        case "*":
          return PlainValue.Type.ALIAS;
        case ">":
          return PlainValue.Type.BLOCK_FOLDED;
        case "|":
          return PlainValue.Type.BLOCK_LITERAL;
        case "{":
          return PlainValue.Type.FLOW_MAP;
        case "[":
          return PlainValue.Type.FLOW_SEQ;
        case "?":
          return !inFlow && PlainValue.Node.atBlank(src, offset + 1, true) ? PlainValue.Type.MAP_KEY : PlainValue.Type.PLAIN;
        case ":":
          return !inFlow && PlainValue.Node.atBlank(src, offset + 1, true) ? PlainValue.Type.MAP_VALUE : PlainValue.Type.PLAIN;
        case "-":
          return !inFlow && PlainValue.Node.atBlank(src, offset + 1, true) ? PlainValue.Type.SEQ_ITEM : PlainValue.Type.PLAIN;
        case '"':
          return PlainValue.Type.QUOTE_DOUBLE;
        case "'":
          return PlainValue.Type.QUOTE_SINGLE;
        default:
          return PlainValue.Type.PLAIN;
      }
    }
    constructor(orig = {}, {
      atLineStart,
      inCollection,
      inFlow,
      indent,
      lineStart,
      parent
    } = {}) {
      PlainValue._defineProperty(this, "parseNode", (overlay, start) => {
        if (PlainValue.Node.atDocumentBoundary(this.src, start))
          return null;
        const context2 = new ParseContext(this, overlay);
        const {
          props,
          type,
          valueStart
        } = context2.parseProps(start);
        const node = createNewNode(type, props);
        let offset = node.parse(context2, valueStart);
        node.range = new PlainValue.Range(start, offset);
        if (offset <= start) {
          node.error = new Error(`Node#parse consumed no characters`);
          node.error.parseEnd = offset;
          node.error.source = node;
          node.range.end = start + 1;
        }
        if (context2.nodeStartsCollection(node)) {
          if (!node.error && !context2.atLineStart && context2.parent.type === PlainValue.Type.DOCUMENT) {
            node.error = new PlainValue.YAMLSyntaxError(node, "Block collection must not have preceding content here (e.g. directives-end indicator)");
          }
          const collection = new Collection(node);
          offset = collection.parse(new ParseContext(context2), offset);
          collection.range = new PlainValue.Range(start, offset);
          return collection;
        }
        return node;
      });
      this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
      this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
      this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
      this.indent = indent != null ? indent : orig.indent;
      this.lineStart = lineStart != null ? lineStart : orig.lineStart;
      this.parent = parent != null ? parent : orig.parent || {};
      this.root = orig.root;
      this.src = orig.src;
    }
    nodeStartsCollection(node) {
      const {
        inCollection,
        inFlow,
        src
      } = this;
      if (inCollection || inFlow)
        return false;
      if (node instanceof CollectionItem)
        return true;
      let offset = node.range.end;
      if (src[offset] === "\n" || src[offset - 1] === "\n")
        return false;
      offset = PlainValue.Node.endOfWhiteSpace(src, offset);
      return src[offset] === ":";
    }
    parseProps(offset) {
      const {
        inFlow,
        parent,
        src
      } = this;
      const props = [];
      let lineHasProps = false;
      offset = this.atLineStart ? PlainValue.Node.endOfIndent(src, offset) : PlainValue.Node.endOfWhiteSpace(src, offset);
      let ch = src[offset];
      while (ch === PlainValue.Char.ANCHOR || ch === PlainValue.Char.COMMENT || ch === PlainValue.Char.TAG || ch === "\n") {
        if (ch === "\n") {
          let inEnd = offset;
          let lineStart;
          do {
            lineStart = inEnd + 1;
            inEnd = PlainValue.Node.endOfIndent(src, lineStart);
          } while (src[inEnd] === "\n");
          const indentDiff = inEnd - (lineStart + this.indent);
          const noIndicatorAsIndent = parent.type === PlainValue.Type.SEQ_ITEM && parent.context.atLineStart;
          if (src[inEnd] !== "#" && !PlainValue.Node.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent))
            break;
          this.atLineStart = true;
          this.lineStart = lineStart;
          lineHasProps = false;
          offset = inEnd;
        } else if (ch === PlainValue.Char.COMMENT) {
          const end = PlainValue.Node.endOfLine(src, offset + 1);
          props.push(new PlainValue.Range(offset, end));
          offset = end;
        } else {
          let end = PlainValue.Node.endOfIdentifier(src, offset + 1);
          if (ch === PlainValue.Char.TAG && src[end] === "," && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13))) {
            end = PlainValue.Node.endOfIdentifier(src, end + 5);
          }
          props.push(new PlainValue.Range(offset, end));
          lineHasProps = true;
          offset = PlainValue.Node.endOfWhiteSpace(src, end);
        }
        ch = src[offset];
      }
      if (lineHasProps && ch === ":" && PlainValue.Node.atBlank(src, offset + 1, true))
        offset -= 1;
      const type = ParseContext.parseType(src, offset, inFlow);
      return {
        props,
        type,
        valueStart: offset
      };
    }
  };
  function parse2(src) {
    const cr = [];
    if (src.indexOf("\r") !== -1) {
      src = src.replace(/\r\n?/g, (match, offset2) => {
        if (match.length > 1)
          cr.push(offset2);
        return "\n";
      });
    }
    const documents = [];
    let offset = 0;
    do {
      const doc = new Document();
      const context2 = new ParseContext({
        src
      });
      offset = doc.parse(context2, offset);
      documents.push(doc);
    } while (offset < src.length);
    documents.setOrigRanges = () => {
      if (cr.length === 0)
        return false;
      for (let i = 1; i < cr.length; ++i)
        cr[i] -= i;
      let crOffset = 0;
      for (let i = 0; i < documents.length; ++i) {
        crOffset = documents[i].setOrigRanges(cr, crOffset);
      }
      cr.splice(0, cr.length);
      return true;
    };
    documents.toString = () => documents.join("...\n");
    return documents;
  }
  exports.parse = parse2;
});

// node_modules/yaml/dist/resolveSeq-d03cb037.js
var require_resolveSeq_d03cb037 = __commonJS((exports) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e();
  function addCommentBefore(str, indent, comment) {
    if (!comment)
      return str;
    const cc = comment.replace(/[\s\S]^/gm, `$&${indent}#`);
    return `#${cc}
${indent}${str}`;
  }
  function addComment(str, indent, comment) {
    return !comment ? str : comment.indexOf("\n") === -1 ? `${str} #${comment}` : `${str}
` + comment.replace(/^/gm, `${indent || ""}#`);
  }
  var Node = class {
  };
  function toJSON(value, arg, ctx) {
    if (Array.isArray(value))
      return value.map((v, i) => toJSON(v, String(i), ctx));
    if (value && typeof value.toJSON === "function") {
      const anchor = ctx && ctx.anchors && ctx.anchors.get(value);
      if (anchor)
        ctx.onCreate = (res2) => {
          anchor.res = res2;
          delete ctx.onCreate;
        };
      const res = value.toJSON(arg, ctx);
      if (anchor && ctx.onCreate)
        ctx.onCreate(res);
      return res;
    }
    if ((!ctx || !ctx.keep) && typeof value === "bigint")
      return Number(value);
    return value;
  }
  var Scalar = class extends Node {
    constructor(value) {
      super();
      this.value = value;
    }
    toJSON(arg, ctx) {
      return ctx && ctx.keep ? this.value : toJSON(this.value, arg, ctx);
    }
    toString() {
      return String(this.value);
    }
  };
  function collectionFromPath(schema, path4, value) {
    let v = value;
    for (let i = path4.length - 1; i >= 0; --i) {
      const k = path4[i];
      if (Number.isInteger(k) && k >= 0) {
        const a = [];
        a[k] = v;
        v = a;
      } else {
        const o = {};
        Object.defineProperty(o, k, {
          value: v,
          writable: true,
          enumerable: true,
          configurable: true
        });
        v = o;
      }
    }
    return schema.createNode(v, false);
  }
  var isEmptyPath = (path4) => path4 == null || typeof path4 === "object" && path4[Symbol.iterator]().next().done;
  var Collection = class extends Node {
    constructor(schema) {
      super();
      PlainValue._defineProperty(this, "items", []);
      this.schema = schema;
    }
    addIn(path4, value) {
      if (isEmptyPath(path4))
        this.add(value);
      else {
        const [key, ...rest] = path4;
        const node = this.get(key, true);
        if (node instanceof Collection)
          node.addIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    deleteIn([key, ...rest]) {
      if (rest.length === 0)
        return this.delete(key);
      const node = this.get(key, true);
      if (node instanceof Collection)
        return node.deleteIn(rest);
      else
        throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
    getIn([key, ...rest], keepScalar) {
      const node = this.get(key, true);
      if (rest.length === 0)
        return !keepScalar && node instanceof Scalar ? node.value : node;
      else
        return node instanceof Collection ? node.getIn(rest, keepScalar) : void 0;
    }
    hasAllNullValues() {
      return this.items.every((node) => {
        if (!node || node.type !== "PAIR")
          return false;
        const n = node.value;
        return n == null || n instanceof Scalar && n.value == null && !n.commentBefore && !n.comment && !n.tag;
      });
    }
    hasIn([key, ...rest]) {
      if (rest.length === 0)
        return this.has(key);
      const node = this.get(key, true);
      return node instanceof Collection ? node.hasIn(rest) : false;
    }
    setIn([key, ...rest], value) {
      if (rest.length === 0) {
        this.set(key, value);
      } else {
        const node = this.get(key, true);
        if (node instanceof Collection)
          node.setIn(rest, value);
        else if (node === void 0 && this.schema)
          this.set(key, collectionFromPath(this.schema, rest, value));
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
    }
    toJSON() {
      return null;
    }
    toString(ctx, {
      blockItem,
      flowChars,
      isMap,
      itemIndent
    }, onComment, onChompKeep) {
      const {
        indent,
        indentStep,
        stringify
      } = ctx;
      const inFlow = this.type === PlainValue.Type.FLOW_MAP || this.type === PlainValue.Type.FLOW_SEQ || ctx.inFlow;
      if (inFlow)
        itemIndent += indentStep;
      const allNullValues = isMap && this.hasAllNullValues();
      ctx = Object.assign({}, ctx, {
        allNullValues,
        indent: itemIndent,
        inFlow,
        type: null
      });
      let chompKeep = false;
      let hasItemWithNewLine = false;
      const nodes = this.items.reduce((nodes2, item, i) => {
        let comment;
        if (item) {
          if (!chompKeep && item.spaceBefore)
            nodes2.push({
              type: "comment",
              str: ""
            });
          if (item.commentBefore)
            item.commentBefore.match(/^.*$/gm).forEach((line) => {
              nodes2.push({
                type: "comment",
                str: `#${line}`
              });
            });
          if (item.comment)
            comment = item.comment;
          if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment)))
            hasItemWithNewLine = true;
        }
        chompKeep = false;
        let str2 = stringify(item, ctx, () => comment = null, () => chompKeep = true);
        if (inFlow && !hasItemWithNewLine && str2.includes("\n"))
          hasItemWithNewLine = true;
        if (inFlow && i < this.items.length - 1)
          str2 += ",";
        str2 = addComment(str2, itemIndent, comment);
        if (chompKeep && (comment || inFlow))
          chompKeep = false;
        nodes2.push({
          type: "item",
          str: str2
        });
        return nodes2;
      }, []);
      let str;
      if (nodes.length === 0) {
        str = flowChars.start + flowChars.end;
      } else if (inFlow) {
        const {
          start,
          end
        } = flowChars;
        const strings = nodes.map((n) => n.str);
        if (hasItemWithNewLine || strings.reduce((sum, str2) => sum + str2.length + 2, 2) > Collection.maxFlowStringSingleLineLength) {
          str = start;
          for (const s of strings) {
            str += s ? `
${indentStep}${indent}${s}` : "\n";
          }
          str += `
${indent}${end}`;
        } else {
          str = `${start} ${strings.join(" ")} ${end}`;
        }
      } else {
        const strings = nodes.map(blockItem);
        str = strings.shift();
        for (const s of strings)
          str += s ? `
${indent}${s}` : "\n";
      }
      if (this.comment) {
        str += "\n" + this.comment.replace(/^/gm, `${indent}#`);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
  };
  PlainValue._defineProperty(Collection, "maxFlowStringSingleLineLength", 60);
  function asItemIndex(key) {
    let idx = key instanceof Scalar ? key.value : key;
    if (idx && typeof idx === "string")
      idx = Number(idx);
    return Number.isInteger(idx) && idx >= 0 ? idx : null;
  }
  var YAMLSeq = class extends Collection {
    add(value) {
      this.items.push(value);
    }
    delete(key) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return false;
      const del = this.items.splice(idx, 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        return void 0;
      const it = this.items[idx];
      return !keepScalar && it instanceof Scalar ? it.value : it;
    }
    has(key) {
      const idx = asItemIndex(key);
      return typeof idx === "number" && idx < this.items.length;
    }
    set(key, value) {
      const idx = asItemIndex(key);
      if (typeof idx !== "number")
        throw new Error(`Expected a valid index, not ${key}.`);
      this.items[idx] = value;
    }
    toJSON(_, ctx) {
      const seq = [];
      if (ctx && ctx.onCreate)
        ctx.onCreate(seq);
      let i = 0;
      for (const item of this.items)
        seq.push(toJSON(item, String(i++), ctx));
      return seq;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      return super.toString(ctx, {
        blockItem: (n) => n.type === "comment" ? n.str : `- ${n.str}`,
        flowChars: {
          start: "[",
          end: "]"
        },
        isMap: false,
        itemIndent: (ctx.indent || "") + "  "
      }, onComment, onChompKeep);
    }
  };
  var stringifyKey = (key, jsKey, ctx) => {
    if (jsKey === null)
      return "";
    if (typeof jsKey !== "object")
      return String(jsKey);
    if (key instanceof Node && ctx && ctx.doc)
      return key.toString({
        anchors: Object.create(null),
        doc: ctx.doc,
        indent: "",
        indentStep: ctx.indentStep,
        inFlow: true,
        inStringifyKey: true,
        stringify: ctx.stringify
      });
    return JSON.stringify(jsKey);
  };
  var Pair = class extends Node {
    constructor(key, value = null) {
      super();
      this.key = key;
      this.value = value;
      this.type = Pair.Type.PAIR;
    }
    get commentBefore() {
      return this.key instanceof Node ? this.key.commentBefore : void 0;
    }
    set commentBefore(cb) {
      if (this.key == null)
        this.key = new Scalar(null);
      if (this.key instanceof Node)
        this.key.commentBefore = cb;
      else {
        const msg = "Pair.commentBefore is an alias for Pair.key.commentBefore. To set it, the key must be a Node.";
        throw new Error(msg);
      }
    }
    addToJSMap(ctx, map) {
      const key = toJSON(this.key, "", ctx);
      if (map instanceof Map) {
        const value = toJSON(this.value, key, ctx);
        map.set(key, value);
      } else if (map instanceof Set) {
        map.add(key);
      } else {
        const stringKey = stringifyKey(this.key, key, ctx);
        const value = toJSON(this.value, stringKey, ctx);
        if (stringKey in map)
          Object.defineProperty(map, stringKey, {
            value,
            writable: true,
            enumerable: true,
            configurable: true
          });
        else
          map[stringKey] = value;
      }
      return map;
    }
    toJSON(_, ctx) {
      const pair = ctx && ctx.mapAsMap ? new Map() : {};
      return this.addToJSMap(ctx, pair);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx || !ctx.doc)
        return JSON.stringify(this);
      const {
        indent: indentSize,
        indentSeq,
        simpleKeys
      } = ctx.doc.options;
      let {
        key,
        value
      } = this;
      let keyComment = key instanceof Node && key.comment;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (key instanceof Collection) {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment || (key instanceof Node ? key instanceof Collection || key.type === PlainValue.Type.BLOCK_FOLDED || key.type === PlainValue.Type.BLOCK_LITERAL : typeof key === "object"));
      const {
        doc,
        indent,
        indentStep,
        stringify
      } = ctx;
      ctx = Object.assign({}, ctx, {
        implicitKey: !explicitKey,
        indent: indent + indentStep
      });
      let chompKeep = false;
      let str = stringify(key, ctx, () => keyComment = null, () => chompKeep = true);
      str = addComment(str, ctx.indent, keyComment);
      if (!explicitKey && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.allNullValues && !simpleKeys) {
        if (this.comment) {
          str = addComment(str, ctx.indent, this.comment);
          if (onComment)
            onComment();
        } else if (chompKeep && !keyComment && onChompKeep)
          onChompKeep();
        return ctx.inFlow && !explicitKey ? str : `? ${str}`;
      }
      str = explicitKey ? `? ${str}
${indent}:` : `${str}:`;
      if (this.comment) {
        str = addComment(str, ctx.indent, this.comment);
        if (onComment)
          onComment();
      }
      let vcb = "";
      let valueComment = null;
      if (value instanceof Node) {
        if (value.spaceBefore)
          vcb = "\n";
        if (value.commentBefore) {
          const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
          vcb += `
${cs}`;
        }
        valueComment = value.comment;
      } else if (value && typeof value === "object") {
        value = doc.schema.createNode(value, true);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !this.comment && value instanceof Scalar)
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentSize >= 2 && !ctx.inFlow && !explicitKey && value instanceof YAMLSeq && value.type !== PlainValue.Type.FLOW_SEQ && !value.tag && !doc.anchors.getName(value)) {
        ctx.indent = ctx.indent.substr(2);
      }
      const valueStr = stringify(value, ctx, () => valueComment = null, () => chompKeep = true);
      let ws = " ";
      if (vcb || this.comment) {
        ws = `${vcb}
${ctx.indent}`;
      } else if (!explicitKey && value instanceof Collection) {
        const flow = valueStr[0] === "[" || valueStr[0] === "{";
        if (!flow || valueStr.includes("\n"))
          ws = `
${ctx.indent}`;
      } else if (valueStr[0] === "\n")
        ws = "";
      if (chompKeep && !valueComment && onChompKeep)
        onChompKeep();
      return addComment(str + ws + valueStr, ctx.indent, valueComment);
    }
  };
  PlainValue._defineProperty(Pair, "Type", {
    PAIR: "PAIR",
    MERGE_PAIR: "MERGE_PAIR"
  });
  var getAliasCount = (node, anchors) => {
    if (node instanceof Alias) {
      const anchor = anchors.get(node.source);
      return anchor.count * anchor.aliasCount;
    } else if (node instanceof Collection) {
      let count = 0;
      for (const item of node.items) {
        const c = getAliasCount(item, anchors);
        if (c > count)
          count = c;
      }
      return count;
    } else if (node instanceof Pair) {
      const kc = getAliasCount(node.key, anchors);
      const vc = getAliasCount(node.value, anchors);
      return Math.max(kc, vc);
    }
    return 1;
  };
  var Alias = class extends Node {
    static stringify({
      range,
      source
    }, {
      anchors,
      doc,
      implicitKey,
      inStringifyKey
    }) {
      let anchor = Object.keys(anchors).find((a) => anchors[a] === source);
      if (!anchor && inStringifyKey)
        anchor = doc.anchors.getName(source) || doc.anchors.newName();
      if (anchor)
        return `*${anchor}${implicitKey ? " " : ""}`;
      const msg = doc.anchors.getName(source) ? "Alias node must be after source node" : "Source node not found for alias node";
      throw new Error(`${msg} [${range}]`);
    }
    constructor(source) {
      super();
      this.source = source;
      this.type = PlainValue.Type.ALIAS;
    }
    set tag(t) {
      throw new Error("Alias nodes cannot have tags");
    }
    toJSON(arg, ctx) {
      if (!ctx)
        return toJSON(this.source, arg, ctx);
      const {
        anchors,
        maxAliasCount
      } = ctx;
      const anchor = anchors.get(this.source);
      if (!anchor || anchor.res === void 0) {
        const msg = "This should not happen: Alias anchor was not resolved?";
        if (this.cstNode)
          throw new PlainValue.YAMLReferenceError(this.cstNode, msg);
        else
          throw new ReferenceError(msg);
      }
      if (maxAliasCount >= 0) {
        anchor.count += 1;
        if (anchor.aliasCount === 0)
          anchor.aliasCount = getAliasCount(this.source, anchors);
        if (anchor.count * anchor.aliasCount > maxAliasCount) {
          const msg = "Excessive alias count indicates a resource exhaustion attack";
          if (this.cstNode)
            throw new PlainValue.YAMLReferenceError(this.cstNode, msg);
          else
            throw new ReferenceError(msg);
        }
      }
      return anchor.res;
    }
    toString(ctx) {
      return Alias.stringify(this, ctx);
    }
  };
  PlainValue._defineProperty(Alias, "default", true);
  function findPair(items, key) {
    const k = key instanceof Scalar ? key.value : key;
    for (const it of items) {
      if (it instanceof Pair) {
        if (it.key === key || it.key === k)
          return it;
        if (it.key && it.key.value === k)
          return it;
      }
    }
    return void 0;
  }
  var YAMLMap = class extends Collection {
    add(pair, overwrite) {
      if (!pair)
        pair = new Pair(pair);
      else if (!(pair instanceof Pair))
        pair = new Pair(pair.key || pair, pair.value);
      const prev = findPair(this.items, pair.key);
      const sortEntries = this.schema && this.schema.sortMapEntries;
      if (prev) {
        if (overwrite)
          prev.value = pair.value;
        else
          throw new Error(`Key ${pair.key} already set`);
      } else if (sortEntries) {
        const i = this.items.findIndex((item) => sortEntries(pair, item) < 0);
        if (i === -1)
          this.items.push(pair);
        else
          this.items.splice(i, 0, pair);
      } else {
        this.items.push(pair);
      }
    }
    delete(key) {
      const it = findPair(this.items, key);
      if (!it)
        return false;
      const del = this.items.splice(this.items.indexOf(it), 1);
      return del.length > 0;
    }
    get(key, keepScalar) {
      const it = findPair(this.items, key);
      const node = it && it.value;
      return !keepScalar && node instanceof Scalar ? node.value : node;
    }
    has(key) {
      return !!findPair(this.items, key);
    }
    set(key, value) {
      this.add(new Pair(key, value), true);
    }
    toJSON(_, ctx, Type) {
      const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
      if (ctx && ctx.onCreate)
        ctx.onCreate(map);
      for (const item of this.items)
        item.addToJSMap(ctx, map);
      return map;
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      for (const item of this.items) {
        if (!(item instanceof Pair))
          throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
      }
      return super.toString(ctx, {
        blockItem: (n) => n.str,
        flowChars: {
          start: "{",
          end: "}"
        },
        isMap: true,
        itemIndent: ctx.indent || ""
      }, onComment, onChompKeep);
    }
  };
  var MERGE_KEY = "<<";
  var Merge = class extends Pair {
    constructor(pair) {
      if (pair instanceof Pair) {
        let seq = pair.value;
        if (!(seq instanceof YAMLSeq)) {
          seq = new YAMLSeq();
          seq.items.push(pair.value);
          seq.range = pair.value.range;
        }
        super(pair.key, seq);
        this.range = pair.range;
      } else {
        super(new Scalar(MERGE_KEY), new YAMLSeq());
      }
      this.type = Pair.Type.MERGE_PAIR;
    }
    addToJSMap(ctx, map) {
      for (const {
        source
      } of this.value.items) {
        if (!(source instanceof YAMLMap))
          throw new Error("Merge sources must be maps");
        const srcMap = source.toJSON(null, ctx, Map);
        for (const [key, value] of srcMap) {
          if (map instanceof Map) {
            if (!map.has(key))
              map.set(key, value);
          } else if (map instanceof Set) {
            map.add(key);
          } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
            Object.defineProperty(map, key, {
              value,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      }
      return map;
    }
    toString(ctx, onComment) {
      const seq = this.value;
      if (seq.items.length > 1)
        return super.toString(ctx, onComment);
      this.value = seq.items[0];
      const str = super.toString(ctx, onComment);
      this.value = seq;
      return str;
    }
  };
  var binaryOptions = {
    defaultType: PlainValue.Type.BLOCK_LITERAL,
    lineWidth: 76
  };
  var boolOptions = {
    trueStr: "true",
    falseStr: "false"
  };
  var intOptions = {
    asBigInt: false
  };
  var nullOptions = {
    nullStr: "null"
  };
  var strOptions = {
    defaultType: PlainValue.Type.PLAIN,
    doubleQuoted: {
      jsonEncoding: false,
      minMultiLineLength: 40
    },
    fold: {
      lineWidth: 80,
      minContentWidth: 20
    }
  };
  function resolveScalar(str, tags, scalarFallback) {
    for (const {
      format,
      test,
      resolve: resolve3
    } of tags) {
      if (test) {
        const match = str.match(test);
        if (match) {
          let res = resolve3.apply(null, match);
          if (!(res instanceof Scalar))
            res = new Scalar(res);
          if (format)
            res.format = format;
          return res;
        }
      }
    }
    if (scalarFallback)
      str = scalarFallback(str);
    return new Scalar(str);
  }
  var FOLD_FLOW = "flow";
  var FOLD_BLOCK = "block";
  var FOLD_QUOTED = "quoted";
  var consumeMoreIndentedLines = (text, i) => {
    let ch = text[i + 1];
    while (ch === " " || ch === "	") {
      do {
        ch = text[i += 1];
      } while (ch && ch !== "\n");
      ch = text[i + 1];
    }
    return i;
  };
  function foldFlowLines(text, indent, mode, {
    indentAtStart,
    lineWidth = 80,
    minContentWidth = 20,
    onFold,
    onOverflow
  }) {
    if (!lineWidth || lineWidth < 0)
      return text;
    const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
    if (text.length <= endStep)
      return text;
    const folds = [];
    const escapedFolds = {};
    let end = lineWidth - indent.length;
    if (typeof indentAtStart === "number") {
      if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
        folds.push(0);
      else
        end = lineWidth - indentAtStart;
    }
    let split = void 0;
    let prev = void 0;
    let overflow = false;
    let i = -1;
    let escStart = -1;
    let escEnd = -1;
    if (mode === FOLD_BLOCK) {
      i = consumeMoreIndentedLines(text, i);
      if (i !== -1)
        end = i + endStep;
    }
    for (let ch; ch = text[i += 1]; ) {
      if (mode === FOLD_QUOTED && ch === "\\") {
        escStart = i;
        switch (text[i + 1]) {
          case "x":
            i += 3;
            break;
          case "u":
            i += 5;
            break;
          case "U":
            i += 9;
            break;
          default:
            i += 1;
        }
        escEnd = i;
      }
      if (ch === "\n") {
        if (mode === FOLD_BLOCK)
          i = consumeMoreIndentedLines(text, i);
        end = i + endStep;
        split = void 0;
      } else {
        if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
          const next = text[i + 1];
          if (next && next !== " " && next !== "\n" && next !== "	")
            split = i;
        }
        if (i >= end) {
          if (split) {
            folds.push(split);
            end = split + endStep;
            split = void 0;
          } else if (mode === FOLD_QUOTED) {
            while (prev === " " || prev === "	") {
              prev = ch;
              ch = text[i += 1];
              overflow = true;
            }
            const j = i > escEnd + 1 ? i - 2 : escStart - 1;
            if (escapedFolds[j])
              return text;
            folds.push(j);
            escapedFolds[j] = true;
            end = j + endStep;
            split = void 0;
          } else {
            overflow = true;
          }
        }
      }
      prev = ch;
    }
    if (overflow && onOverflow)
      onOverflow();
    if (folds.length === 0)
      return text;
    if (onFold)
      onFold();
    let res = text.slice(0, folds[0]);
    for (let i2 = 0; i2 < folds.length; ++i2) {
      const fold = folds[i2];
      const end2 = folds[i2 + 1] || text.length;
      if (fold === 0)
        res = `
${indent}${text.slice(0, end2)}`;
      else {
        if (mode === FOLD_QUOTED && escapedFolds[fold])
          res += `${text[fold]}\\`;
        res += `
${indent}${text.slice(fold + 1, end2)}`;
      }
    }
    return res;
  }
  var getFoldOptions = ({
    indentAtStart
  }) => indentAtStart ? Object.assign({
    indentAtStart
  }, strOptions.fold) : strOptions.fold;
  var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
  function lineLengthOverLimit(str, lineWidth, indentLength) {
    if (!lineWidth || lineWidth < 0)
      return false;
    const limit = lineWidth - indentLength;
    const strLen = str.length;
    if (strLen <= limit)
      return false;
    for (let i = 0, start = 0; i < strLen; ++i) {
      if (str[i] === "\n") {
        if (i - start > limit)
          return true;
        start = i + 1;
        if (strLen - start <= limit)
          return false;
      }
    }
    return true;
  }
  function doubleQuotedString(value, ctx) {
    const {
      implicitKey
    } = ctx;
    const {
      jsonEncoding,
      minMultiLineLength
    } = strOptions.doubleQuoted;
    const json = JSON.stringify(value);
    if (jsonEncoding)
      return json;
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    let str = "";
    let start = 0;
    for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
      if (ch === " " && json[i + 1] === "\\" && json[i + 2] === "n") {
        str += json.slice(start, i) + "\\ ";
        i += 1;
        start = i;
        ch = "\\";
      }
      if (ch === "\\")
        switch (json[i + 1]) {
          case "u":
            {
              str += json.slice(start, i);
              const code = json.substr(i + 2, 4);
              switch (code) {
                case "0000":
                  str += "\\0";
                  break;
                case "0007":
                  str += "\\a";
                  break;
                case "000b":
                  str += "\\v";
                  break;
                case "001b":
                  str += "\\e";
                  break;
                case "0085":
                  str += "\\N";
                  break;
                case "00a0":
                  str += "\\_";
                  break;
                case "2028":
                  str += "\\L";
                  break;
                case "2029":
                  str += "\\P";
                  break;
                default:
                  if (code.substr(0, 2) === "00")
                    str += "\\x" + code.substr(2);
                  else
                    str += json.substr(i, 6);
              }
              i += 5;
              start = i + 1;
            }
            break;
          case "n":
            if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
              i += 1;
            } else {
              str += json.slice(start, i) + "\n\n";
              while (json[i + 2] === "\\" && json[i + 3] === "n" && json[i + 4] !== '"') {
                str += "\n";
                i += 2;
              }
              str += indent;
              if (json[i + 2] === " ")
                str += "\\";
              i += 1;
              start = i + 1;
            }
            break;
          default:
            i += 1;
        }
    }
    str = start ? str + json.slice(start) : json;
    return implicitKey ? str : foldFlowLines(str, indent, FOLD_QUOTED, getFoldOptions(ctx));
  }
  function singleQuotedString(value, ctx) {
    if (ctx.implicitKey) {
      if (/\n/.test(value))
        return doubleQuotedString(value, ctx);
    } else {
      if (/[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
    }
    const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
    const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
    return ctx.implicitKey ? res : foldFlowLines(res, indent, FOLD_FLOW, getFoldOptions(ctx));
  }
  function blockString({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) {
    if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
      return doubleQuotedString(value, ctx);
    }
    const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
    const indentSize = indent ? "2" : "1";
    const literal = type === PlainValue.Type.BLOCK_FOLDED ? false : type === PlainValue.Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, strOptions.fold.lineWidth, indent.length);
    let header = literal ? "|" : ">";
    if (!value)
      return header + "\n";
    let wsStart = "";
    let wsEnd = "";
    value = value.replace(/[\n\t ]*$/, (ws) => {
      const n = ws.indexOf("\n");
      if (n === -1) {
        header += "-";
      } else if (value === ws || n !== ws.length - 1) {
        header += "+";
        if (onChompKeep)
          onChompKeep();
      }
      wsEnd = ws.replace(/\n$/, "");
      return "";
    }).replace(/^[\n ]*/, (ws) => {
      if (ws.indexOf(" ") !== -1)
        header += indentSize;
      const m = ws.match(/ +$/);
      if (m) {
        wsStart = ws.slice(0, -m[0].length);
        return m[0];
      } else {
        wsStart = ws;
        return "";
      }
    });
    if (wsEnd)
      wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`);
    if (wsStart)
      wsStart = wsStart.replace(/\n+/g, `$&${indent}`);
    if (comment) {
      header += " #" + comment.replace(/ ?[\r\n]+/g, " ");
      if (onComment)
        onComment();
    }
    if (!value)
      return `${header}${indentSize}
${indent}${wsEnd}`;
    if (literal) {
      value = value.replace(/\n+/g, `$&${indent}`);
      return `${header}
${indent}${wsStart}${value}${wsEnd}`;
    }
    value = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
    const body = foldFlowLines(`${wsStart}${value}${wsEnd}`, indent, FOLD_BLOCK, strOptions.fold);
    return `${header}
${indent}${body}`;
  }
  function plainString(item, ctx, onComment, onChompKeep) {
    const {
      comment,
      type,
      value
    } = item;
    const {
      actualString,
      implicitKey,
      indent,
      inFlow
    } = ctx;
    if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
      return doubleQuotedString(value, ctx);
    }
    if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
      return implicitKey || inFlow || value.indexOf("\n") === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
    }
    if (!implicitKey && !inFlow && type !== PlainValue.Type.PLAIN && value.indexOf("\n") !== -1) {
      return blockString(item, ctx, onComment, onChompKeep);
    }
    if (indent === "" && containsDocumentMarker(value)) {
      ctx.forceBlockIndent = true;
      return blockString(item, ctx, onComment, onChompKeep);
    }
    const str = value.replace(/\n+/g, `$&
${indent}`);
    if (actualString) {
      const {
        tags
      } = ctx.doc.schema;
      const resolved = resolveScalar(str, tags, tags.scalarFallback).value;
      if (typeof resolved !== "string")
        return doubleQuotedString(value, ctx);
    }
    const body = implicitKey ? str : foldFlowLines(str, indent, FOLD_FLOW, getFoldOptions(ctx));
    if (comment && !inFlow && (body.indexOf("\n") !== -1 || comment.indexOf("\n") !== -1)) {
      if (onComment)
        onComment();
      return addCommentBefore(body, indent, comment);
    }
    return body;
  }
  function stringifyString(item, ctx, onComment, onChompKeep) {
    const {
      defaultType
    } = strOptions;
    const {
      implicitKey,
      inFlow
    } = ctx;
    let {
      type,
      value
    } = item;
    if (typeof value !== "string") {
      value = String(value);
      item = Object.assign({}, item, {
        value
      });
    }
    const _stringify = (_type) => {
      switch (_type) {
        case PlainValue.Type.BLOCK_FOLDED:
        case PlainValue.Type.BLOCK_LITERAL:
          return blockString(item, ctx, onComment, onChompKeep);
        case PlainValue.Type.QUOTE_DOUBLE:
          return doubleQuotedString(value, ctx);
        case PlainValue.Type.QUOTE_SINGLE:
          return singleQuotedString(value, ctx);
        case PlainValue.Type.PLAIN:
          return plainString(item, ctx, onComment, onChompKeep);
        default:
          return null;
      }
    };
    if (type !== PlainValue.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
      type = PlainValue.Type.QUOTE_DOUBLE;
    } else if ((implicitKey || inFlow) && (type === PlainValue.Type.BLOCK_FOLDED || type === PlainValue.Type.BLOCK_LITERAL)) {
      type = PlainValue.Type.QUOTE_DOUBLE;
    }
    let res = _stringify(type);
    if (res === null) {
      res = _stringify(defaultType);
      if (res === null)
        throw new Error(`Unsupported default string type ${defaultType}`);
    }
    return res;
  }
  function stringifyNumber({
    format,
    minFractionDigits,
    tag,
    value
  }) {
    if (typeof value === "bigint")
      return String(value);
    if (!isFinite(value))
      return isNaN(value) ? ".nan" : value < 0 ? "-.inf" : ".inf";
    let n = JSON.stringify(value);
    if (!format && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^\d/.test(n)) {
      let i = n.indexOf(".");
      if (i < 0) {
        i = n.length;
        n += ".";
      }
      let d = minFractionDigits - (n.length - i - 1);
      while (d-- > 0)
        n += "0";
    }
    return n;
  }
  function checkFlowCollectionEnd(errors, cst) {
    let char, name;
    switch (cst.type) {
      case PlainValue.Type.FLOW_MAP:
        char = "}";
        name = "flow map";
        break;
      case PlainValue.Type.FLOW_SEQ:
        char = "]";
        name = "flow sequence";
        break;
      default:
        errors.push(new PlainValue.YAMLSemanticError(cst, "Not a flow collection!?"));
        return;
    }
    let lastItem;
    for (let i = cst.items.length - 1; i >= 0; --i) {
      const item = cst.items[i];
      if (!item || item.type !== PlainValue.Type.COMMENT) {
        lastItem = item;
        break;
      }
    }
    if (lastItem && lastItem.char !== char) {
      const msg = `Expected ${name} to end with ${char}`;
      let err;
      if (typeof lastItem.offset === "number") {
        err = new PlainValue.YAMLSemanticError(cst, msg);
        err.offset = lastItem.offset + 1;
      } else {
        err = new PlainValue.YAMLSemanticError(lastItem, msg);
        if (lastItem.range && lastItem.range.end)
          err.offset = lastItem.range.end - lastItem.range.start;
      }
      errors.push(err);
    }
  }
  function checkFlowCommentSpace(errors, comment) {
    const prev = comment.context.src[comment.range.start - 1];
    if (prev !== "\n" && prev !== "	" && prev !== " ") {
      const msg = "Comments must be separated from other tokens by white space characters";
      errors.push(new PlainValue.YAMLSemanticError(comment, msg));
    }
  }
  function getLongKeyError(source, key) {
    const sk = String(key);
    const k = sk.substr(0, 8) + "..." + sk.substr(-8);
    return new PlainValue.YAMLSemanticError(source, `The "${k}" key is too long`);
  }
  function resolveComments(collection, comments) {
    for (const {
      afterKey,
      before,
      comment
    } of comments) {
      let item = collection.items[before];
      if (!item) {
        if (comment !== void 0) {
          if (collection.comment)
            collection.comment += "\n" + comment;
          else
            collection.comment = comment;
        }
      } else {
        if (afterKey && item.value)
          item = item.value;
        if (comment === void 0) {
          if (afterKey || !item.commentBefore)
            item.spaceBefore = true;
        } else {
          if (item.commentBefore)
            item.commentBefore += "\n" + comment;
          else
            item.commentBefore = comment;
        }
      }
    }
  }
  function resolveString(doc, node) {
    const res = node.strValue;
    if (!res)
      return "";
    if (typeof res === "string")
      return res;
    res.errors.forEach((error3) => {
      if (!error3.source)
        error3.source = node;
      doc.errors.push(error3);
    });
    return res.str;
  }
  function resolveTagHandle(doc, node) {
    const {
      handle,
      suffix
    } = node.tag;
    let prefix = doc.tagPrefixes.find((p) => p.handle === handle);
    if (!prefix) {
      const dtp = doc.getDefaults().tagPrefixes;
      if (dtp)
        prefix = dtp.find((p) => p.handle === handle);
      if (!prefix)
        throw new PlainValue.YAMLSemanticError(node, `The ${handle} tag handle is non-default and was not declared.`);
    }
    if (!suffix)
      throw new PlainValue.YAMLSemanticError(node, `The ${handle} tag has no suffix.`);
    if (handle === "!" && (doc.version || doc.options.version) === "1.0") {
      if (suffix[0] === "^") {
        doc.warnings.push(new PlainValue.YAMLWarning(node, "YAML 1.0 ^ tag expansion is not supported"));
        return suffix;
      }
      if (/[:/]/.test(suffix)) {
        const vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
        return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
      }
    }
    return prefix.prefix + decodeURIComponent(suffix);
  }
  function resolveTagName(doc, node) {
    const {
      tag,
      type
    } = node;
    let nonSpecific = false;
    if (tag) {
      const {
        handle,
        suffix,
        verbatim
      } = tag;
      if (verbatim) {
        if (verbatim !== "!" && verbatim !== "!!")
          return verbatim;
        const msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
        doc.errors.push(new PlainValue.YAMLSemanticError(node, msg));
      } else if (handle === "!" && !suffix) {
        nonSpecific = true;
      } else {
        try {
          return resolveTagHandle(doc, node);
        } catch (error3) {
          doc.errors.push(error3);
        }
      }
    }
    switch (type) {
      case PlainValue.Type.BLOCK_FOLDED:
      case PlainValue.Type.BLOCK_LITERAL:
      case PlainValue.Type.QUOTE_DOUBLE:
      case PlainValue.Type.QUOTE_SINGLE:
        return PlainValue.defaultTags.STR;
      case PlainValue.Type.FLOW_MAP:
      case PlainValue.Type.MAP:
        return PlainValue.defaultTags.MAP;
      case PlainValue.Type.FLOW_SEQ:
      case PlainValue.Type.SEQ:
        return PlainValue.defaultTags.SEQ;
      case PlainValue.Type.PLAIN:
        return nonSpecific ? PlainValue.defaultTags.STR : null;
      default:
        return null;
    }
  }
  function resolveByTagName(doc, node, tagName) {
    const {
      tags
    } = doc.schema;
    const matchWithTest = [];
    for (const tag of tags) {
      if (tag.tag === tagName) {
        if (tag.test)
          matchWithTest.push(tag);
        else {
          const res = tag.resolve(doc, node);
          return res instanceof Collection ? res : new Scalar(res);
        }
      }
    }
    const str = resolveString(doc, node);
    if (typeof str === "string" && matchWithTest.length > 0)
      return resolveScalar(str, matchWithTest, tags.scalarFallback);
    return null;
  }
  function getFallbackTagName({
    type
  }) {
    switch (type) {
      case PlainValue.Type.FLOW_MAP:
      case PlainValue.Type.MAP:
        return PlainValue.defaultTags.MAP;
      case PlainValue.Type.FLOW_SEQ:
      case PlainValue.Type.SEQ:
        return PlainValue.defaultTags.SEQ;
      default:
        return PlainValue.defaultTags.STR;
    }
  }
  function resolveTag(doc, node, tagName) {
    try {
      const res = resolveByTagName(doc, node, tagName);
      if (res) {
        if (tagName && node.tag)
          res.tag = tagName;
        return res;
      }
    } catch (error3) {
      if (!error3.source)
        error3.source = node;
      doc.errors.push(error3);
      return null;
    }
    try {
      const fallback = getFallbackTagName(node);
      if (!fallback)
        throw new Error(`The tag ${tagName} is unavailable`);
      const msg = `The tag ${tagName} is unavailable, falling back to ${fallback}`;
      doc.warnings.push(new PlainValue.YAMLWarning(node, msg));
      const res = resolveByTagName(doc, node, fallback);
      res.tag = tagName;
      return res;
    } catch (error3) {
      const refError = new PlainValue.YAMLReferenceError(node, error3.message);
      refError.stack = error3.stack;
      doc.errors.push(refError);
      return null;
    }
  }
  var isCollectionItem = (node) => {
    if (!node)
      return false;
    const {
      type
    } = node;
    return type === PlainValue.Type.MAP_KEY || type === PlainValue.Type.MAP_VALUE || type === PlainValue.Type.SEQ_ITEM;
  };
  function resolveNodeProps(errors, node) {
    const comments = {
      before: [],
      after: []
    };
    let hasAnchor = false;
    let hasTag = false;
    const props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;
    for (const {
      start,
      end
    } of props) {
      switch (node.context.src[start]) {
        case PlainValue.Char.COMMENT: {
          if (!node.commentHasRequiredWhitespace(start)) {
            const msg = "Comments must be separated from other tokens by white space characters";
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }
          const {
            header,
            valueRange
          } = node;
          const cc = valueRange && (start > valueRange.start || header && start > header.start) ? comments.after : comments.before;
          cc.push(node.context.src.slice(start + 1, end));
          break;
        }
        case PlainValue.Char.ANCHOR:
          if (hasAnchor) {
            const msg = "A node can have at most one anchor";
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }
          hasAnchor = true;
          break;
        case PlainValue.Char.TAG:
          if (hasTag) {
            const msg = "A node can have at most one tag";
            errors.push(new PlainValue.YAMLSemanticError(node, msg));
          }
          hasTag = true;
          break;
      }
    }
    return {
      comments,
      hasAnchor,
      hasTag
    };
  }
  function resolveNodeValue(doc, node) {
    const {
      anchors,
      errors,
      schema
    } = doc;
    if (node.type === PlainValue.Type.ALIAS) {
      const name = node.rawValue;
      const src = anchors.getNode(name);
      if (!src) {
        const msg = `Aliased anchor not found: ${name}`;
        errors.push(new PlainValue.YAMLReferenceError(node, msg));
        return null;
      }
      const res = new Alias(src);
      anchors._cstAliases.push(res);
      return res;
    }
    const tagName = resolveTagName(doc, node);
    if (tagName)
      return resolveTag(doc, node, tagName);
    if (node.type !== PlainValue.Type.PLAIN) {
      const msg = `Failed to resolve ${node.type} node here`;
      errors.push(new PlainValue.YAMLSyntaxError(node, msg));
      return null;
    }
    try {
      const str = resolveString(doc, node);
      return resolveScalar(str, schema.tags, schema.tags.scalarFallback);
    } catch (error3) {
      if (!error3.source)
        error3.source = node;
      errors.push(error3);
      return null;
    }
  }
  function resolveNode(doc, node) {
    if (!node)
      return null;
    if (node.error)
      doc.errors.push(node.error);
    const {
      comments,
      hasAnchor,
      hasTag
    } = resolveNodeProps(doc.errors, node);
    if (hasAnchor) {
      const {
        anchors
      } = doc;
      const name = node.anchor;
      const prev = anchors.getNode(name);
      if (prev)
        anchors.map[anchors.newName(name)] = prev;
      anchors.map[name] = node;
    }
    if (node.type === PlainValue.Type.ALIAS && (hasAnchor || hasTag)) {
      const msg = "An alias node must not specify any properties";
      doc.errors.push(new PlainValue.YAMLSemanticError(node, msg));
    }
    const res = resolveNodeValue(doc, node);
    if (res) {
      res.range = [node.range.start, node.range.end];
      if (doc.options.keepCstNodes)
        res.cstNode = node;
      if (doc.options.keepNodeTypes)
        res.type = node.type;
      const cb = comments.before.join("\n");
      if (cb) {
        res.commentBefore = res.commentBefore ? `${res.commentBefore}
${cb}` : cb;
      }
      const ca = comments.after.join("\n");
      if (ca)
        res.comment = res.comment ? `${res.comment}
${ca}` : ca;
    }
    return node.resolved = res;
  }
  function resolveMap(doc, cst) {
    if (cst.type !== PlainValue.Type.MAP && cst.type !== PlainValue.Type.FLOW_MAP) {
      const msg = `A ${cst.type} node cannot be resolved as a mapping`;
      doc.errors.push(new PlainValue.YAMLSyntaxError(cst, msg));
      return null;
    }
    const {
      comments,
      items
    } = cst.type === PlainValue.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst);
    const map = new YAMLMap();
    map.items = items;
    resolveComments(map, comments);
    let hasCollectionKey = false;
    for (let i = 0; i < items.length; ++i) {
      const {
        key: iKey
      } = items[i];
      if (iKey instanceof Collection)
        hasCollectionKey = true;
      if (doc.schema.merge && iKey && iKey.value === MERGE_KEY) {
        items[i] = new Merge(items[i]);
        const sources = items[i].value.items;
        let error3 = null;
        sources.some((node) => {
          if (node instanceof Alias) {
            const {
              type
            } = node.source;
            if (type === PlainValue.Type.MAP || type === PlainValue.Type.FLOW_MAP)
              return false;
            return error3 = "Merge nodes aliases can only point to maps";
          }
          return error3 = "Merge nodes can only have Alias nodes as values";
        });
        if (error3)
          doc.errors.push(new PlainValue.YAMLSemanticError(cst, error3));
      } else {
        for (let j = i + 1; j < items.length; ++j) {
          const {
            key: jKey
          } = items[j];
          if (iKey === jKey || iKey && jKey && Object.prototype.hasOwnProperty.call(iKey, "value") && iKey.value === jKey.value) {
            const msg = `Map keys must be unique; "${iKey}" is repeated`;
            doc.errors.push(new PlainValue.YAMLSemanticError(cst, msg));
            break;
          }
        }
      }
    }
    if (hasCollectionKey && !doc.options.mapAsMap) {
      const warn = "Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.";
      doc.warnings.push(new PlainValue.YAMLWarning(cst, warn));
    }
    cst.resolved = map;
    return map;
  }
  var valueHasPairComment = ({
    context: {
      lineStart,
      node,
      src
    },
    props
  }) => {
    if (props.length === 0)
      return false;
    const {
      start
    } = props[0];
    if (node && start > node.valueRange.start)
      return false;
    if (src[start] !== PlainValue.Char.COMMENT)
      return false;
    for (let i = lineStart; i < start; ++i)
      if (src[i] === "\n")
        return false;
    return true;
  };
  function resolvePairComment(item, pair) {
    if (!valueHasPairComment(item))
      return;
    const comment = item.getPropValue(0, PlainValue.Char.COMMENT, true);
    let found = false;
    const cb = pair.value.commentBefore;
    if (cb && cb.startsWith(comment)) {
      pair.value.commentBefore = cb.substr(comment.length + 1);
      found = true;
    } else {
      const cc = pair.value.comment;
      if (!item.node && cc && cc.startsWith(comment)) {
        pair.value.comment = cc.substr(comment.length + 1);
        found = true;
      }
    }
    if (found)
      pair.comment = comment;
  }
  function resolveBlockMapItems(doc, cst) {
    const comments = [];
    const items = [];
    let key = void 0;
    let keyStart = null;
    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];
      switch (item.type) {
        case PlainValue.Type.BLANK_LINE:
          comments.push({
            afterKey: !!key,
            before: items.length
          });
          break;
        case PlainValue.Type.COMMENT:
          comments.push({
            afterKey: !!key,
            before: items.length,
            comment: item.comment
          });
          break;
        case PlainValue.Type.MAP_KEY:
          if (key !== void 0)
            items.push(new Pair(key));
          if (item.error)
            doc.errors.push(item.error);
          key = resolveNode(doc, item.node);
          keyStart = null;
          break;
        case PlainValue.Type.MAP_VALUE:
          {
            if (key === void 0)
              key = null;
            if (item.error)
              doc.errors.push(item.error);
            if (!item.context.atLineStart && item.node && item.node.type === PlainValue.Type.MAP && !item.node.context.atLineStart) {
              const msg = "Nested mappings are not allowed in compact mappings";
              doc.errors.push(new PlainValue.YAMLSemanticError(item.node, msg));
            }
            let valueNode = item.node;
            if (!valueNode && item.props.length > 0) {
              valueNode = new PlainValue.PlainValue(PlainValue.Type.PLAIN, []);
              valueNode.context = {
                parent: item,
                src: item.context.src
              };
              const pos = item.range.start + 1;
              valueNode.range = {
                start: pos,
                end: pos
              };
              valueNode.valueRange = {
                start: pos,
                end: pos
              };
              if (typeof item.range.origStart === "number") {
                const origPos = item.range.origStart + 1;
                valueNode.range.origStart = valueNode.range.origEnd = origPos;
                valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
              }
            }
            const pair = new Pair(key, resolveNode(doc, valueNode));
            resolvePairComment(item, pair);
            items.push(pair);
            if (key && typeof keyStart === "number") {
              if (item.range.start > keyStart + 1024)
                doc.errors.push(getLongKeyError(cst, key));
            }
            key = void 0;
            keyStart = null;
          }
          break;
        default:
          if (key !== void 0)
            items.push(new Pair(key));
          key = resolveNode(doc, item);
          keyStart = item.range.start;
          if (item.error)
            doc.errors.push(item.error);
          next:
            for (let j = i + 1; ; ++j) {
              const nextItem = cst.items[j];
              switch (nextItem && nextItem.type) {
                case PlainValue.Type.BLANK_LINE:
                case PlainValue.Type.COMMENT:
                  continue next;
                case PlainValue.Type.MAP_VALUE:
                  break next;
                default: {
                  const msg = "Implicit map keys need to be followed by map values";
                  doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
                  break next;
                }
              }
            }
          if (item.valueRangeContainsNewline) {
            const msg = "Implicit map keys need to be on a single line";
            doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
          }
      }
    }
    if (key !== void 0)
      items.push(new Pair(key));
    return {
      comments,
      items
    };
  }
  function resolveFlowMapItems(doc, cst) {
    const comments = [];
    const items = [];
    let key = void 0;
    let explicitKey = false;
    let next = "{";
    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];
      if (typeof item.char === "string") {
        const {
          char,
          offset
        } = item;
        if (char === "?" && key === void 0 && !explicitKey) {
          explicitKey = true;
          next = ":";
          continue;
        }
        if (char === ":") {
          if (key === void 0)
            key = null;
          if (next === ":") {
            next = ",";
            continue;
          }
        } else {
          if (explicitKey) {
            if (key === void 0 && char !== ",")
              key = null;
            explicitKey = false;
          }
          if (key !== void 0) {
            items.push(new Pair(key));
            key = void 0;
            if (char === ",") {
              next = ":";
              continue;
            }
          }
        }
        if (char === "}") {
          if (i === cst.items.length - 1)
            continue;
        } else if (char === next) {
          next = ":";
          continue;
        }
        const msg = `Flow map contains an unexpected ${char}`;
        const err = new PlainValue.YAMLSyntaxError(cst, msg);
        err.offset = offset;
        doc.errors.push(err);
      } else if (item.type === PlainValue.Type.BLANK_LINE) {
        comments.push({
          afterKey: !!key,
          before: items.length
        });
      } else if (item.type === PlainValue.Type.COMMENT) {
        checkFlowCommentSpace(doc.errors, item);
        comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        });
      } else if (key === void 0) {
        if (next === ",")
          doc.errors.push(new PlainValue.YAMLSemanticError(item, "Separator , missing in flow map"));
        key = resolveNode(doc, item);
      } else {
        if (next !== ",")
          doc.errors.push(new PlainValue.YAMLSemanticError(item, "Indicator : missing in flow map entry"));
        items.push(new Pair(key, resolveNode(doc, item)));
        key = void 0;
        explicitKey = false;
      }
    }
    checkFlowCollectionEnd(doc.errors, cst);
    if (key !== void 0)
      items.push(new Pair(key));
    return {
      comments,
      items
    };
  }
  function resolveSeq(doc, cst) {
    if (cst.type !== PlainValue.Type.SEQ && cst.type !== PlainValue.Type.FLOW_SEQ) {
      const msg = `A ${cst.type} node cannot be resolved as a sequence`;
      doc.errors.push(new PlainValue.YAMLSyntaxError(cst, msg));
      return null;
    }
    const {
      comments,
      items
    } = cst.type === PlainValue.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst);
    const seq = new YAMLSeq();
    seq.items = items;
    resolveComments(seq, comments);
    if (!doc.options.mapAsMap && items.some((it) => it instanceof Pair && it.key instanceof Collection)) {
      const warn = "Keys with collection values will be stringified as YAML due to JS Object restrictions. Use mapAsMap: true to avoid this.";
      doc.warnings.push(new PlainValue.YAMLWarning(cst, warn));
    }
    cst.resolved = seq;
    return seq;
  }
  function resolveBlockSeqItems(doc, cst) {
    const comments = [];
    const items = [];
    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];
      switch (item.type) {
        case PlainValue.Type.BLANK_LINE:
          comments.push({
            before: items.length
          });
          break;
        case PlainValue.Type.COMMENT:
          comments.push({
            comment: item.comment,
            before: items.length
          });
          break;
        case PlainValue.Type.SEQ_ITEM:
          if (item.error)
            doc.errors.push(item.error);
          items.push(resolveNode(doc, item.node));
          if (item.hasProps) {
            const msg = "Sequence items cannot have tags or anchors before the - indicator";
            doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
          }
          break;
        default:
          if (item.error)
            doc.errors.push(item.error);
          doc.errors.push(new PlainValue.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
      }
    }
    return {
      comments,
      items
    };
  }
  function resolveFlowSeqItems(doc, cst) {
    const comments = [];
    const items = [];
    let explicitKey = false;
    let key = void 0;
    let keyStart = null;
    let next = "[";
    let prevItem = null;
    for (let i = 0; i < cst.items.length; ++i) {
      const item = cst.items[i];
      if (typeof item.char === "string") {
        const {
          char,
          offset
        } = item;
        if (char !== ":" && (explicitKey || key !== void 0)) {
          if (explicitKey && key === void 0)
            key = next ? items.pop() : null;
          items.push(new Pair(key));
          explicitKey = false;
          key = void 0;
          keyStart = null;
        }
        if (char === next) {
          next = null;
        } else if (!next && char === "?") {
          explicitKey = true;
        } else if (next !== "[" && char === ":" && key === void 0) {
          if (next === ",") {
            key = items.pop();
            if (key instanceof Pair) {
              const msg = "Chaining flow sequence pairs is invalid";
              const err = new PlainValue.YAMLSemanticError(cst, msg);
              err.offset = offset;
              doc.errors.push(err);
            }
            if (!explicitKey && typeof keyStart === "number") {
              const keyEnd = item.range ? item.range.start : item.offset;
              if (keyEnd > keyStart + 1024)
                doc.errors.push(getLongKeyError(cst, key));
              const {
                src
              } = prevItem.context;
              for (let i2 = keyStart; i2 < keyEnd; ++i2)
                if (src[i2] === "\n") {
                  const msg = "Implicit keys of flow sequence pairs need to be on a single line";
                  doc.errors.push(new PlainValue.YAMLSemanticError(prevItem, msg));
                  break;
                }
            }
          } else {
            key = null;
          }
          keyStart = null;
          explicitKey = false;
          next = null;
        } else if (next === "[" || char !== "]" || i < cst.items.length - 1) {
          const msg = `Flow sequence contains an unexpected ${char}`;
          const err = new PlainValue.YAMLSyntaxError(cst, msg);
          err.offset = offset;
          doc.errors.push(err);
        }
      } else if (item.type === PlainValue.Type.BLANK_LINE) {
        comments.push({
          before: items.length
        });
      } else if (item.type === PlainValue.Type.COMMENT) {
        checkFlowCommentSpace(doc.errors, item);
        comments.push({
          comment: item.comment,
          before: items.length
        });
      } else {
        if (next) {
          const msg = `Expected a ${next} in flow sequence`;
          doc.errors.push(new PlainValue.YAMLSemanticError(item, msg));
        }
        const value = resolveNode(doc, item);
        if (key === void 0) {
          items.push(value);
          prevItem = item;
        } else {
          items.push(new Pair(key, value));
          key = void 0;
        }
        keyStart = item.range.start;
        next = ",";
      }
    }
    checkFlowCollectionEnd(doc.errors, cst);
    if (key !== void 0)
      items.push(new Pair(key));
    return {
      comments,
      items
    };
  }
  exports.Alias = Alias;
  exports.Collection = Collection;
  exports.Merge = Merge;
  exports.Node = Node;
  exports.Pair = Pair;
  exports.Scalar = Scalar;
  exports.YAMLMap = YAMLMap;
  exports.YAMLSeq = YAMLSeq;
  exports.addComment = addComment;
  exports.binaryOptions = binaryOptions;
  exports.boolOptions = boolOptions;
  exports.findPair = findPair;
  exports.intOptions = intOptions;
  exports.isEmptyPath = isEmptyPath;
  exports.nullOptions = nullOptions;
  exports.resolveMap = resolveMap;
  exports.resolveNode = resolveNode;
  exports.resolveSeq = resolveSeq;
  exports.resolveString = resolveString;
  exports.strOptions = strOptions;
  exports.stringifyNumber = stringifyNumber;
  exports.stringifyString = stringifyString;
  exports.toJSON = toJSON;
});

// node_modules/yaml/dist/warnings-1000a372.js
var require_warnings_1000a372 = __commonJS((exports) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e();
  var resolveSeq = require_resolveSeq_d03cb037();
  var binary = {
    identify: (value) => value instanceof Uint8Array,
    default: false,
    tag: "tag:yaml.org,2002:binary",
    resolve: (doc, node) => {
      const src = resolveSeq.resolveString(doc, node);
      if (typeof Buffer === "function") {
        return Buffer.from(src, "base64");
      } else if (typeof atob === "function") {
        const str = atob(src.replace(/[\n\r]/g, ""));
        const buffer = new Uint8Array(str.length);
        for (let i = 0; i < str.length; ++i)
          buffer[i] = str.charCodeAt(i);
        return buffer;
      } else {
        const msg = "This environment does not support reading binary tags; either Buffer or atob is required";
        doc.errors.push(new PlainValue.YAMLReferenceError(node, msg));
        return null;
      }
    },
    options: resolveSeq.binaryOptions,
    stringify: ({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep) => {
      let src;
      if (typeof Buffer === "function") {
        src = value instanceof Buffer ? value.toString("base64") : Buffer.from(value.buffer).toString("base64");
      } else if (typeof btoa === "function") {
        let s = "";
        for (let i = 0; i < value.length; ++i)
          s += String.fromCharCode(value[i]);
        src = btoa(s);
      } else {
        throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
      }
      if (!type)
        type = resolveSeq.binaryOptions.defaultType;
      if (type === PlainValue.Type.QUOTE_DOUBLE) {
        value = src;
      } else {
        const {
          lineWidth
        } = resolveSeq.binaryOptions;
        const n = Math.ceil(src.length / lineWidth);
        const lines = new Array(n);
        for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
          lines[i] = src.substr(o, lineWidth);
        }
        value = lines.join(type === PlainValue.Type.BLOCK_LITERAL ? "\n" : " ");
      }
      return resolveSeq.stringifyString({
        comment,
        type,
        value
      }, ctx, onComment, onChompKeep);
    }
  };
  function parsePairs(doc, cst) {
    const seq = resolveSeq.resolveSeq(doc, cst);
    for (let i = 0; i < seq.items.length; ++i) {
      let item = seq.items[i];
      if (item instanceof resolveSeq.Pair)
        continue;
      else if (item instanceof resolveSeq.YAMLMap) {
        if (item.items.length > 1) {
          const msg = "Each pair must have its own sequence indicator";
          throw new PlainValue.YAMLSemanticError(cst, msg);
        }
        const pair = item.items[0] || new resolveSeq.Pair();
        if (item.commentBefore)
          pair.commentBefore = pair.commentBefore ? `${item.commentBefore}
${pair.commentBefore}` : item.commentBefore;
        if (item.comment)
          pair.comment = pair.comment ? `${item.comment}
${pair.comment}` : item.comment;
        item = pair;
      }
      seq.items[i] = item instanceof resolveSeq.Pair ? item : new resolveSeq.Pair(item);
    }
    return seq;
  }
  function createPairs(schema, iterable, ctx) {
    const pairs2 = new resolveSeq.YAMLSeq(schema);
    pairs2.tag = "tag:yaml.org,2002:pairs";
    for (const it of iterable) {
      let key, value;
      if (Array.isArray(it)) {
        if (it.length === 2) {
          key = it[0];
          value = it[1];
        } else
          throw new TypeError(`Expected [key, value] tuple: ${it}`);
      } else if (it && it instanceof Object) {
        const keys = Object.keys(it);
        if (keys.length === 1) {
          key = keys[0];
          value = it[key];
        } else
          throw new TypeError(`Expected { key: value } tuple: ${it}`);
      } else {
        key = it;
      }
      const pair = schema.createPair(key, value, ctx);
      pairs2.items.push(pair);
    }
    return pairs2;
  }
  var pairs = {
    default: false,
    tag: "tag:yaml.org,2002:pairs",
    resolve: parsePairs,
    createNode: createPairs
  };
  var YAMLOMap = class extends resolveSeq.YAMLSeq {
    constructor() {
      super();
      PlainValue._defineProperty(this, "add", resolveSeq.YAMLMap.prototype.add.bind(this));
      PlainValue._defineProperty(this, "delete", resolveSeq.YAMLMap.prototype.delete.bind(this));
      PlainValue._defineProperty(this, "get", resolveSeq.YAMLMap.prototype.get.bind(this));
      PlainValue._defineProperty(this, "has", resolveSeq.YAMLMap.prototype.has.bind(this));
      PlainValue._defineProperty(this, "set", resolveSeq.YAMLMap.prototype.set.bind(this));
      this.tag = YAMLOMap.tag;
    }
    toJSON(_, ctx) {
      const map = new Map();
      if (ctx && ctx.onCreate)
        ctx.onCreate(map);
      for (const pair of this.items) {
        let key, value;
        if (pair instanceof resolveSeq.Pair) {
          key = resolveSeq.toJSON(pair.key, "", ctx);
          value = resolveSeq.toJSON(pair.value, key, ctx);
        } else {
          key = resolveSeq.toJSON(pair, "", ctx);
        }
        if (map.has(key))
          throw new Error("Ordered maps must not include duplicate keys");
        map.set(key, value);
      }
      return map;
    }
  };
  PlainValue._defineProperty(YAMLOMap, "tag", "tag:yaml.org,2002:omap");
  function parseOMap(doc, cst) {
    const pairs2 = parsePairs(doc, cst);
    const seenKeys = [];
    for (const {
      key
    } of pairs2.items) {
      if (key instanceof resolveSeq.Scalar) {
        if (seenKeys.includes(key.value)) {
          const msg = "Ordered maps must not include duplicate keys";
          throw new PlainValue.YAMLSemanticError(cst, msg);
        } else {
          seenKeys.push(key.value);
        }
      }
    }
    return Object.assign(new YAMLOMap(), pairs2);
  }
  function createOMap(schema, iterable, ctx) {
    const pairs2 = createPairs(schema, iterable, ctx);
    const omap2 = new YAMLOMap();
    omap2.items = pairs2.items;
    return omap2;
  }
  var omap = {
    identify: (value) => value instanceof Map,
    nodeClass: YAMLOMap,
    default: false,
    tag: "tag:yaml.org,2002:omap",
    resolve: parseOMap,
    createNode: createOMap
  };
  var YAMLSet = class extends resolveSeq.YAMLMap {
    constructor() {
      super();
      this.tag = YAMLSet.tag;
    }
    add(key) {
      const pair = key instanceof resolveSeq.Pair ? key : new resolveSeq.Pair(key);
      const prev = resolveSeq.findPair(this.items, pair.key);
      if (!prev)
        this.items.push(pair);
    }
    get(key, keepPair) {
      const pair = resolveSeq.findPair(this.items, key);
      return !keepPair && pair instanceof resolveSeq.Pair ? pair.key instanceof resolveSeq.Scalar ? pair.key.value : pair.key : pair;
    }
    set(key, value) {
      if (typeof value !== "boolean")
        throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
      const prev = resolveSeq.findPair(this.items, key);
      if (prev && !value) {
        this.items.splice(this.items.indexOf(prev), 1);
      } else if (!prev && value) {
        this.items.push(new resolveSeq.Pair(key));
      }
    }
    toJSON(_, ctx) {
      return super.toJSON(_, ctx, Set);
    }
    toString(ctx, onComment, onChompKeep) {
      if (!ctx)
        return JSON.stringify(this);
      if (this.hasAllNullValues())
        return super.toString(ctx, onComment, onChompKeep);
      else
        throw new Error("Set items must all have null values");
    }
  };
  PlainValue._defineProperty(YAMLSet, "tag", "tag:yaml.org,2002:set");
  function parseSet(doc, cst) {
    const map = resolveSeq.resolveMap(doc, cst);
    if (!map.hasAllNullValues())
      throw new PlainValue.YAMLSemanticError(cst, "Set items must all have null values");
    return Object.assign(new YAMLSet(), map);
  }
  function createSet(schema, iterable, ctx) {
    const set2 = new YAMLSet();
    for (const value of iterable)
      set2.items.push(schema.createPair(value, null, ctx));
    return set2;
  }
  var set = {
    identify: (value) => value instanceof Set,
    nodeClass: YAMLSet,
    default: false,
    tag: "tag:yaml.org,2002:set",
    resolve: parseSet,
    createNode: createSet
  };
  var parseSexagesimal = (sign, parts) => {
    const n = parts.split(":").reduce((n2, p) => n2 * 60 + Number(p), 0);
    return sign === "-" ? -n : n;
  };
  var stringifySexagesimal = ({
    value
  }) => {
    if (isNaN(value) || !isFinite(value))
      return resolveSeq.stringifyNumber(value);
    let sign = "";
    if (value < 0) {
      sign = "-";
      value = Math.abs(value);
    }
    const parts = [value % 60];
    if (value < 60) {
      parts.unshift(0);
    } else {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value % 60);
      if (value >= 60) {
        value = Math.round((value - parts[0]) / 60);
        parts.unshift(value);
      }
    }
    return sign + parts.map((n) => n < 10 ? "0" + String(n) : String(n)).join(":").replace(/000000\d*$/, "");
  };
  var intTime = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "TIME",
    test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
    resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, "")),
    stringify: stringifySexagesimal
  };
  var floatTime = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "TIME",
    test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
    resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, "")),
    stringify: stringifySexagesimal
  };
  var timestamp = {
    identify: (value) => value instanceof Date,
    default: true,
    tag: "tag:yaml.org,2002:timestamp",
    test: RegExp("^(?:([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?)$"),
    resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
      if (millisec)
        millisec = (millisec + "00").substr(1, 3);
      let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);
      if (tz && tz !== "Z") {
        let d = parseSexagesimal(tz[0], tz.slice(1));
        if (Math.abs(d) < 30)
          d *= 60;
        date -= 6e4 * d;
      }
      return new Date(date);
    },
    stringify: ({
      value
    }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, "")
  };
  function shouldWarn(deprecation) {
    const env = typeof process !== "undefined" && process.env || {};
    if (deprecation) {
      if (typeof YAML_SILENCE_DEPRECATION_WARNINGS !== "undefined")
        return !YAML_SILENCE_DEPRECATION_WARNINGS;
      return !env.YAML_SILENCE_DEPRECATION_WARNINGS;
    }
    if (typeof YAML_SILENCE_WARNINGS !== "undefined")
      return !YAML_SILENCE_WARNINGS;
    return !env.YAML_SILENCE_WARNINGS;
  }
  function warn(warning, type) {
    if (shouldWarn(false)) {
      const emit = typeof process !== "undefined" && process.emitWarning;
      if (emit)
        emit(warning, type);
      else {
        console.warn(type ? `${type}: ${warning}` : warning);
      }
    }
  }
  function warnFileDeprecation(filename) {
    if (shouldWarn(true)) {
      const path4 = filename.replace(/.*yaml[/\\]/i, "").replace(/\.js$/, "").replace(/\\/g, "/");
      warn(`The endpoint 'yaml/${path4}' will be removed in a future release.`, "DeprecationWarning");
    }
  }
  var warned = {};
  function warnOptionDeprecation(name, alternative) {
    if (!warned[name] && shouldWarn(true)) {
      warned[name] = true;
      let msg = `The option '${name}' will be removed in a future release`;
      msg += alternative ? `, use '${alternative}' instead.` : ".";
      warn(msg, "DeprecationWarning");
    }
  }
  exports.binary = binary;
  exports.floatTime = floatTime;
  exports.intTime = intTime;
  exports.omap = omap;
  exports.pairs = pairs;
  exports.set = set;
  exports.timestamp = timestamp;
  exports.warn = warn;
  exports.warnFileDeprecation = warnFileDeprecation;
  exports.warnOptionDeprecation = warnOptionDeprecation;
});

// node_modules/yaml/dist/Schema-88e323a7.js
var require_Schema_88e323a7 = __commonJS((exports) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e();
  var resolveSeq = require_resolveSeq_d03cb037();
  var warnings = require_warnings_1000a372();
  function createMap(schema, obj, ctx) {
    const map2 = new resolveSeq.YAMLMap(schema);
    if (obj instanceof Map) {
      for (const [key, value] of obj)
        map2.items.push(schema.createPair(key, value, ctx));
    } else if (obj && typeof obj === "object") {
      for (const key of Object.keys(obj))
        map2.items.push(schema.createPair(key, obj[key], ctx));
    }
    if (typeof schema.sortMapEntries === "function") {
      map2.items.sort(schema.sortMapEntries);
    }
    return map2;
  }
  var map = {
    createNode: createMap,
    default: true,
    nodeClass: resolveSeq.YAMLMap,
    tag: "tag:yaml.org,2002:map",
    resolve: resolveSeq.resolveMap
  };
  function createSeq(schema, obj, ctx) {
    const seq2 = new resolveSeq.YAMLSeq(schema);
    if (obj && obj[Symbol.iterator]) {
      for (const it of obj) {
        const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
        seq2.items.push(v);
      }
    }
    return seq2;
  }
  var seq = {
    createNode: createSeq,
    default: true,
    nodeClass: resolveSeq.YAMLSeq,
    tag: "tag:yaml.org,2002:seq",
    resolve: resolveSeq.resolveSeq
  };
  var string = {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: resolveSeq.resolveString,
    stringify(item, ctx, onComment, onChompKeep) {
      ctx = Object.assign({
        actualString: true
      }, ctx);
      return resolveSeq.stringifyString(item, ctx, onComment, onChompKeep);
    },
    options: resolveSeq.strOptions
  };
  var failsafe = [map, seq, string];
  var intIdentify$2 = (value) => typeof value === "bigint" || Number.isInteger(value);
  var intResolve$1 = (src, part, radix) => resolveSeq.intOptions.asBigInt ? BigInt(src) : parseInt(part, radix);
  function intStringify$1(node, radix, prefix) {
    const {
      value
    } = node;
    if (intIdentify$2(value) && value >= 0)
      return prefix + value.toString(radix);
    return resolveSeq.stringifyNumber(node);
  }
  var nullObj = {
    identify: (value) => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: resolveSeq.nullOptions,
    stringify: () => resolveSeq.nullOptions.nullStr
  };
  var boolObj = {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
    resolve: (str) => str[0] === "t" || str[0] === "T",
    options: resolveSeq.boolOptions,
    stringify: ({
      value
    }) => value ? resolveSeq.boolOptions.trueStr : resolveSeq.boolOptions.falseStr
  };
  var octObj = {
    identify: (value) => intIdentify$2(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^0o([0-7]+)$/,
    resolve: (str, oct) => intResolve$1(str, oct, 8),
    options: resolveSeq.intOptions,
    stringify: (node) => intStringify$1(node, 8, "0o")
  };
  var intObj = {
    identify: intIdentify$2,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^[-+]?[0-9]+$/,
    resolve: (str) => intResolve$1(str, str, 10),
    options: resolveSeq.intOptions,
    stringify: resolveSeq.stringifyNumber
  };
  var hexObj = {
    identify: (value) => intIdentify$2(value) && value >= 0,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^0x([0-9a-fA-F]+)$/,
    resolve: (str, hex) => intResolve$1(str, hex, 16),
    options: resolveSeq.intOptions,
    stringify: (node) => intStringify$1(node, 16, "0x")
  };
  var nanObj = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) => nan ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: resolveSeq.stringifyNumber
  };
  var expObj = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str),
    stringify: ({
      value
    }) => Number(value).toExponential()
  };
  var floatObj = {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:\.([0-9]+)|[0-9]+\.([0-9]*))$/,
    resolve(str, frac1, frac2) {
      const frac = frac1 || frac2;
      const node = new resolveSeq.Scalar(parseFloat(str));
      if (frac && frac[frac.length - 1] === "0")
        node.minFractionDigits = frac.length;
      return node;
    },
    stringify: resolveSeq.stringifyNumber
  };
  var core4 = failsafe.concat([nullObj, boolObj, octObj, intObj, hexObj, nanObj, expObj, floatObj]);
  var intIdentify$1 = (value) => typeof value === "bigint" || Number.isInteger(value);
  var stringifyJSON = ({
    value
  }) => JSON.stringify(value);
  var json = [map, seq, {
    identify: (value) => typeof value === "string",
    default: true,
    tag: "tag:yaml.org,2002:str",
    resolve: resolveSeq.resolveString,
    stringify: stringifyJSON
  }, {
    identify: (value) => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^null$/,
    resolve: () => null,
    stringify: stringifyJSON
  }, {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^true|false$/,
    resolve: (str) => str === "true",
    stringify: stringifyJSON
  }, {
    identify: intIdentify$1,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^-?(?:0|[1-9][0-9]*)$/,
    resolve: (str) => resolveSeq.intOptions.asBigInt ? BigInt(str) : parseInt(str, 10),
    stringify: ({
      value
    }) => intIdentify$1(value) ? value.toString() : JSON.stringify(value)
  }, {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
    resolve: (str) => parseFloat(str),
    stringify: stringifyJSON
  }];
  json.scalarFallback = (str) => {
    throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
  };
  var boolStringify = ({
    value
  }) => value ? resolveSeq.boolOptions.trueStr : resolveSeq.boolOptions.falseStr;
  var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
  function intResolve(sign, src, radix) {
    let str = src.replace(/_/g, "");
    if (resolveSeq.intOptions.asBigInt) {
      switch (radix) {
        case 2:
          str = `0b${str}`;
          break;
        case 8:
          str = `0o${str}`;
          break;
        case 16:
          str = `0x${str}`;
          break;
      }
      const n2 = BigInt(str);
      return sign === "-" ? BigInt(-1) * n2 : n2;
    }
    const n = parseInt(str, radix);
    return sign === "-" ? -1 * n : n;
  }
  function intStringify(node, radix, prefix) {
    const {
      value
    } = node;
    if (intIdentify(value)) {
      const str = value.toString(radix);
      return value < 0 ? "-" + prefix + str.substr(1) : prefix + str;
    }
    return resolveSeq.stringifyNumber(node);
  }
  var yaml11 = failsafe.concat([{
    identify: (value) => value == null,
    createNode: (schema, value, ctx) => ctx.wrapScalars ? new resolveSeq.Scalar(null) : null,
    default: true,
    tag: "tag:yaml.org,2002:null",
    test: /^(?:~|[Nn]ull|NULL)?$/,
    resolve: () => null,
    options: resolveSeq.nullOptions,
    stringify: () => resolveSeq.nullOptions.nullStr
  }, {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
    resolve: () => true,
    options: resolveSeq.boolOptions,
    stringify: boolStringify
  }, {
    identify: (value) => typeof value === "boolean",
    default: true,
    tag: "tag:yaml.org,2002:bool",
    test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
    resolve: () => false,
    options: resolveSeq.boolOptions,
    stringify: boolStringify
  }, {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "BIN",
    test: /^([-+]?)0b([0-1_]+)$/,
    resolve: (str, sign, bin) => intResolve(sign, bin, 2),
    stringify: (node) => intStringify(node, 2, "0b")
  }, {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "OCT",
    test: /^([-+]?)0([0-7_]+)$/,
    resolve: (str, sign, oct) => intResolve(sign, oct, 8),
    stringify: (node) => intStringify(node, 8, "0")
  }, {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    test: /^([-+]?)([0-9][0-9_]*)$/,
    resolve: (str, sign, abs) => intResolve(sign, abs, 10),
    stringify: resolveSeq.stringifyNumber
  }, {
    identify: intIdentify,
    default: true,
    tag: "tag:yaml.org,2002:int",
    format: "HEX",
    test: /^([-+]?)0x([0-9a-fA-F_]+)$/,
    resolve: (str, sign, hex) => intResolve(sign, hex, 16),
    stringify: (node) => intStringify(node, 16, "0x")
  }, {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^(?:[-+]?\.inf|(\.nan))$/i,
    resolve: (str, nan) => nan ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
    stringify: resolveSeq.stringifyNumber
  }, {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    format: "EXP",
    test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
    resolve: (str) => parseFloat(str.replace(/_/g, "")),
    stringify: ({
      value
    }) => Number(value).toExponential()
  }, {
    identify: (value) => typeof value === "number",
    default: true,
    tag: "tag:yaml.org,2002:float",
    test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,
    resolve(str, frac) {
      const node = new resolveSeq.Scalar(parseFloat(str.replace(/_/g, "")));
      if (frac) {
        const f = frac.replace(/_/g, "");
        if (f[f.length - 1] === "0")
          node.minFractionDigits = f.length;
      }
      return node;
    },
    stringify: resolveSeq.stringifyNumber
  }], warnings.binary, warnings.omap, warnings.pairs, warnings.set, warnings.intTime, warnings.floatTime, warnings.timestamp);
  var schemas = {
    core: core4,
    failsafe,
    json,
    yaml11
  };
  var tags = {
    binary: warnings.binary,
    bool: boolObj,
    float: floatObj,
    floatExp: expObj,
    floatNaN: nanObj,
    floatTime: warnings.floatTime,
    int: intObj,
    intHex: hexObj,
    intOct: octObj,
    intTime: warnings.intTime,
    map,
    null: nullObj,
    omap: warnings.omap,
    pairs: warnings.pairs,
    seq,
    set: warnings.set,
    timestamp: warnings.timestamp
  };
  function findTagObject(value, tagName, tags2) {
    if (tagName) {
      const match = tags2.filter((t) => t.tag === tagName);
      const tagObj = match.find((t) => !t.format) || match[0];
      if (!tagObj)
        throw new Error(`Tag ${tagName} not found`);
      return tagObj;
    }
    return tags2.find((t) => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);
  }
  function createNode(value, tagName, ctx) {
    if (value instanceof resolveSeq.Node)
      return value;
    const {
      defaultPrefix,
      onTagObj,
      prevObjects,
      schema,
      wrapScalars
    } = ctx;
    if (tagName && tagName.startsWith("!!"))
      tagName = defaultPrefix + tagName.slice(2);
    let tagObj = findTagObject(value, tagName, schema.tags);
    if (!tagObj) {
      if (typeof value.toJSON === "function")
        value = value.toJSON();
      if (!value || typeof value !== "object")
        return wrapScalars ? new resolveSeq.Scalar(value) : value;
      tagObj = value instanceof Map ? map : value[Symbol.iterator] ? seq : map;
    }
    if (onTagObj) {
      onTagObj(tagObj);
      delete ctx.onTagObj;
    }
    const obj = {
      value: void 0,
      node: void 0
    };
    if (value && typeof value === "object" && prevObjects) {
      const prev = prevObjects.get(value);
      if (prev) {
        const alias = new resolveSeq.Alias(prev);
        ctx.aliasNodes.push(alias);
        return alias;
      }
      obj.value = value;
      prevObjects.set(value, obj);
    }
    obj.node = tagObj.createNode ? tagObj.createNode(ctx.schema, value, ctx) : wrapScalars ? new resolveSeq.Scalar(value) : value;
    if (tagName && obj.node instanceof resolveSeq.Node)
      obj.node.tag = tagName;
    return obj.node;
  }
  function getSchemaTags(schemas2, knownTags, customTags, schemaId) {
    let tags2 = schemas2[schemaId.replace(/\W/g, "")];
    if (!tags2) {
      const keys = Object.keys(schemas2).map((key) => JSON.stringify(key)).join(", ");
      throw new Error(`Unknown schema "${schemaId}"; use one of ${keys}`);
    }
    if (Array.isArray(customTags)) {
      for (const tag of customTags)
        tags2 = tags2.concat(tag);
    } else if (typeof customTags === "function") {
      tags2 = customTags(tags2.slice());
    }
    for (let i = 0; i < tags2.length; ++i) {
      const tag = tags2[i];
      if (typeof tag === "string") {
        const tagObj = knownTags[tag];
        if (!tagObj) {
          const keys = Object.keys(knownTags).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
        }
        tags2[i] = tagObj;
      }
    }
    return tags2;
  }
  var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
  var Schema = class {
    constructor({
      customTags,
      merge,
      schema,
      sortMapEntries,
      tags: deprecatedCustomTags
    }) {
      this.merge = !!merge;
      this.name = schema;
      this.sortMapEntries = sortMapEntries === true ? sortMapEntriesByKey : sortMapEntries || null;
      if (!customTags && deprecatedCustomTags)
        warnings.warnOptionDeprecation("tags", "customTags");
      this.tags = getSchemaTags(schemas, tags, customTags || deprecatedCustomTags, schema);
    }
    createNode(value, wrapScalars, tagName, ctx) {
      const baseCtx = {
        defaultPrefix: Schema.defaultPrefix,
        schema: this,
        wrapScalars
      };
      const createCtx = ctx ? Object.assign(ctx, baseCtx) : baseCtx;
      return createNode(value, tagName, createCtx);
    }
    createPair(key, value, ctx) {
      if (!ctx)
        ctx = {
          wrapScalars: true
        };
      const k = this.createNode(key, ctx.wrapScalars, null, ctx);
      const v = this.createNode(value, ctx.wrapScalars, null, ctx);
      return new resolveSeq.Pair(k, v);
    }
  };
  PlainValue._defineProperty(Schema, "defaultPrefix", PlainValue.defaultTagPrefix);
  PlainValue._defineProperty(Schema, "defaultTags", PlainValue.defaultTags);
  exports.Schema = Schema;
});

// node_modules/yaml/dist/Document-9b4560a1.js
var require_Document_9b4560a1 = __commonJS((exports) => {
  "use strict";
  var PlainValue = require_PlainValue_ec8e588e();
  var resolveSeq = require_resolveSeq_d03cb037();
  var Schema = require_Schema_88e323a7();
  var defaultOptions = {
    anchorPrefix: "a",
    customTags: null,
    indent: 2,
    indentSeq: true,
    keepCstNodes: false,
    keepNodeTypes: true,
    keepBlobsInJSON: true,
    mapAsMap: false,
    maxAliasCount: 100,
    prettyErrors: false,
    simpleKeys: false,
    version: "1.2"
  };
  var scalarOptions = {
    get binary() {
      return resolveSeq.binaryOptions;
    },
    set binary(opt) {
      Object.assign(resolveSeq.binaryOptions, opt);
    },
    get bool() {
      return resolveSeq.boolOptions;
    },
    set bool(opt) {
      Object.assign(resolveSeq.boolOptions, opt);
    },
    get int() {
      return resolveSeq.intOptions;
    },
    set int(opt) {
      Object.assign(resolveSeq.intOptions, opt);
    },
    get null() {
      return resolveSeq.nullOptions;
    },
    set null(opt) {
      Object.assign(resolveSeq.nullOptions, opt);
    },
    get str() {
      return resolveSeq.strOptions;
    },
    set str(opt) {
      Object.assign(resolveSeq.strOptions, opt);
    }
  };
  var documentOptions = {
    "1.0": {
      schema: "yaml-1.1",
      merge: true,
      tagPrefixes: [{
        handle: "!",
        prefix: PlainValue.defaultTagPrefix
      }, {
        handle: "!!",
        prefix: "tag:private.yaml.org,2002:"
      }]
    },
    1.1: {
      schema: "yaml-1.1",
      merge: true,
      tagPrefixes: [{
        handle: "!",
        prefix: "!"
      }, {
        handle: "!!",
        prefix: PlainValue.defaultTagPrefix
      }]
    },
    1.2: {
      schema: "core",
      merge: false,
      tagPrefixes: [{
        handle: "!",
        prefix: "!"
      }, {
        handle: "!!",
        prefix: PlainValue.defaultTagPrefix
      }]
    }
  };
  function stringifyTag(doc, tag) {
    if ((doc.version || doc.options.version) === "1.0") {
      const priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
      if (priv)
        return "!" + priv[1];
      const vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
      return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, "")}`;
    }
    let p = doc.tagPrefixes.find((p2) => tag.indexOf(p2.prefix) === 0);
    if (!p) {
      const dtp = doc.getDefaults().tagPrefixes;
      p = dtp && dtp.find((p2) => tag.indexOf(p2.prefix) === 0);
    }
    if (!p)
      return tag[0] === "!" ? tag : `!<${tag}>`;
    const suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, (ch) => ({
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    })[ch]);
    return p.handle + suffix;
  }
  function getTagObject(tags, item) {
    if (item instanceof resolveSeq.Alias)
      return resolveSeq.Alias;
    if (item.tag) {
      const match = tags.filter((t) => t.tag === item.tag);
      if (match.length > 0)
        return match.find((t) => t.format === item.format) || match[0];
    }
    let tagObj, obj;
    if (item instanceof resolveSeq.Scalar) {
      obj = item.value;
      const match = tags.filter((t) => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
      tagObj = match.find((t) => t.format === item.format) || match.find((t) => !t.format);
    } else {
      obj = item;
      tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
    }
    if (!tagObj) {
      const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
      throw new Error(`Tag not resolved for ${name} value`);
    }
    return tagObj;
  }
  function stringifyProps(node, tagObj, {
    anchors,
    doc
  }) {
    const props = [];
    const anchor = doc.anchors.getName(node);
    if (anchor) {
      anchors[anchor] = node;
      props.push(`&${anchor}`);
    }
    if (node.tag) {
      props.push(stringifyTag(doc, node.tag));
    } else if (!tagObj.default) {
      props.push(stringifyTag(doc, tagObj.tag));
    }
    return props.join(" ");
  }
  function stringify(item, ctx, onComment, onChompKeep) {
    const {
      anchors,
      schema
    } = ctx.doc;
    let tagObj;
    if (!(item instanceof resolveSeq.Node)) {
      const createCtx = {
        aliasNodes: [],
        onTagObj: (o) => tagObj = o,
        prevObjects: new Map()
      };
      item = schema.createNode(item, true, null, createCtx);
      for (const alias of createCtx.aliasNodes) {
        alias.source = alias.source.node;
        let name = anchors.getName(alias.source);
        if (!name) {
          name = anchors.newName();
          anchors.map[name] = alias.source;
        }
      }
    }
    if (item instanceof resolveSeq.Pair)
      return item.toString(ctx, onComment, onChompKeep);
    if (!tagObj)
      tagObj = getTagObject(schema.tags, item);
    const props = stringifyProps(item, tagObj, ctx);
    if (props.length > 0)
      ctx.indentAtStart = (ctx.indentAtStart || 0) + props.length + 1;
    const str = typeof tagObj.stringify === "function" ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof resolveSeq.Scalar ? resolveSeq.stringifyString(item, ctx, onComment, onChompKeep) : item.toString(ctx, onComment, onChompKeep);
    if (!props)
      return str;
    return item instanceof resolveSeq.Scalar || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
  }
  var Anchors = class {
    static validAnchorNode(node) {
      return node instanceof resolveSeq.Scalar || node instanceof resolveSeq.YAMLSeq || node instanceof resolveSeq.YAMLMap;
    }
    constructor(prefix) {
      PlainValue._defineProperty(this, "map", Object.create(null));
      this.prefix = prefix;
    }
    createAlias(node, name) {
      this.setAnchor(node, name);
      return new resolveSeq.Alias(node);
    }
    createMergePair(...sources) {
      const merge = new resolveSeq.Merge();
      merge.value.items = sources.map((s) => {
        if (s instanceof resolveSeq.Alias) {
          if (s.source instanceof resolveSeq.YAMLMap)
            return s;
        } else if (s instanceof resolveSeq.YAMLMap) {
          return this.createAlias(s);
        }
        throw new Error("Merge sources must be Map nodes or their Aliases");
      });
      return merge;
    }
    getName(node) {
      const {
        map
      } = this;
      return Object.keys(map).find((a) => map[a] === node);
    }
    getNames() {
      return Object.keys(this.map);
    }
    getNode(name) {
      return this.map[name];
    }
    newName(prefix) {
      if (!prefix)
        prefix = this.prefix;
      const names = Object.keys(this.map);
      for (let i = 1; true; ++i) {
        const name = `${prefix}${i}`;
        if (!names.includes(name))
          return name;
      }
    }
    resolveNodes() {
      const {
        map,
        _cstAliases
      } = this;
      Object.keys(map).forEach((a) => {
        map[a] = map[a].resolved;
      });
      _cstAliases.forEach((a) => {
        a.source = a.source.resolved;
      });
      delete this._cstAliases;
    }
    setAnchor(node, name) {
      if (node != null && !Anchors.validAnchorNode(node)) {
        throw new Error("Anchors may only be set for Scalar, Seq and Map nodes");
      }
      if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
        throw new Error("Anchor names must not contain whitespace or control characters");
      }
      const {
        map
      } = this;
      const prev = node && Object.keys(map).find((a) => map[a] === node);
      if (prev) {
        if (!name) {
          return prev;
        } else if (prev !== name) {
          delete map[prev];
          map[name] = node;
        }
      } else {
        if (!name) {
          if (!node)
            return null;
          name = this.newName();
        }
        map[name] = node;
      }
      return name;
    }
  };
  var visit = (node, tags) => {
    if (node && typeof node === "object") {
      const {
        tag
      } = node;
      if (node instanceof resolveSeq.Collection) {
        if (tag)
          tags[tag] = true;
        node.items.forEach((n) => visit(n, tags));
      } else if (node instanceof resolveSeq.Pair) {
        visit(node.key, tags);
        visit(node.value, tags);
      } else if (node instanceof resolveSeq.Scalar) {
        if (tag)
          tags[tag] = true;
      }
    }
    return tags;
  };
  var listTagNames = (node) => Object.keys(visit(node, {}));
  function parseContents(doc, contents) {
    const comments = {
      before: [],
      after: []
    };
    let body = void 0;
    let spaceBefore = false;
    for (const node of contents) {
      if (node.valueRange) {
        if (body !== void 0) {
          const msg = "Document contains trailing content not separated by a ... or --- line";
          doc.errors.push(new PlainValue.YAMLSyntaxError(node, msg));
          break;
        }
        const res = resolveSeq.resolveNode(doc, node);
        if (spaceBefore) {
          res.spaceBefore = true;
          spaceBefore = false;
        }
        body = res;
      } else if (node.comment !== null) {
        const cc = body === void 0 ? comments.before : comments.after;
        cc.push(node.comment);
      } else if (node.type === PlainValue.Type.BLANK_LINE) {
        spaceBefore = true;
        if (body === void 0 && comments.before.length > 0 && !doc.commentBefore) {
          doc.commentBefore = comments.before.join("\n");
          comments.before = [];
        }
      }
    }
    doc.contents = body || null;
    if (!body) {
      doc.comment = comments.before.concat(comments.after).join("\n") || null;
    } else {
      const cb = comments.before.join("\n");
      if (cb) {
        const cbNode = body instanceof resolveSeq.Collection && body.items[0] ? body.items[0] : body;
        cbNode.commentBefore = cbNode.commentBefore ? `${cb}
${cbNode.commentBefore}` : cb;
      }
      doc.comment = comments.after.join("\n") || null;
    }
  }
  function resolveTagDirective({
    tagPrefixes
  }, directive) {
    const [handle, prefix] = directive.parameters;
    if (!handle || !prefix) {
      const msg = "Insufficient parameters given for %TAG directive";
      throw new PlainValue.YAMLSemanticError(directive, msg);
    }
    if (tagPrefixes.some((p) => p.handle === handle)) {
      const msg = "The %TAG directive must only be given at most once per handle in the same document.";
      throw new PlainValue.YAMLSemanticError(directive, msg);
    }
    return {
      handle,
      prefix
    };
  }
  function resolveYamlDirective(doc, directive) {
    let [version] = directive.parameters;
    if (directive.name === "YAML:1.0")
      version = "1.0";
    if (!version) {
      const msg = "Insufficient parameters given for %YAML directive";
      throw new PlainValue.YAMLSemanticError(directive, msg);
    }
    if (!documentOptions[version]) {
      const v0 = doc.version || doc.options.version;
      const msg = `Document will be parsed as YAML ${v0} rather than YAML ${version}`;
      doc.warnings.push(new PlainValue.YAMLWarning(directive, msg));
    }
    return version;
  }
  function parseDirectives(doc, directives, prevDoc) {
    const directiveComments = [];
    let hasDirectives = false;
    for (const directive of directives) {
      const {
        comment,
        name
      } = directive;
      switch (name) {
        case "TAG":
          try {
            doc.tagPrefixes.push(resolveTagDirective(doc, directive));
          } catch (error3) {
            doc.errors.push(error3);
          }
          hasDirectives = true;
          break;
        case "YAML":
        case "YAML:1.0":
          if (doc.version) {
            const msg = "The %YAML directive must only be given at most once per document.";
            doc.errors.push(new PlainValue.YAMLSemanticError(directive, msg));
          }
          try {
            doc.version = resolveYamlDirective(doc, directive);
          } catch (error3) {
            doc.errors.push(error3);
          }
          hasDirectives = true;
          break;
        default:
          if (name) {
            const msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
            doc.warnings.push(new PlainValue.YAMLWarning(directive, msg));
          }
      }
      if (comment)
        directiveComments.push(comment);
    }
    if (prevDoc && !hasDirectives && (doc.version || prevDoc.version || doc.options.version) === "1.1") {
      const copyTagPrefix = ({
        handle,
        prefix
      }) => ({
        handle,
        prefix
      });
      doc.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
      doc.version = prevDoc.version;
    }
    doc.commentBefore = directiveComments.join("\n") || null;
  }
  function assertCollection(contents) {
    if (contents instanceof resolveSeq.Collection)
      return true;
    throw new Error("Expected a YAML collection as document contents");
  }
  var Document = class {
    constructor(options) {
      this.anchors = new Anchors(options.anchorPrefix);
      this.commentBefore = null;
      this.comment = null;
      this.contents = null;
      this.directivesEndMarker = null;
      this.errors = [];
      this.options = options;
      this.schema = null;
      this.tagPrefixes = [];
      this.version = null;
      this.warnings = [];
    }
    add(value) {
      assertCollection(this.contents);
      return this.contents.add(value);
    }
    addIn(path4, value) {
      assertCollection(this.contents);
      this.contents.addIn(path4, value);
    }
    delete(key) {
      assertCollection(this.contents);
      return this.contents.delete(key);
    }
    deleteIn(path4) {
      if (resolveSeq.isEmptyPath(path4)) {
        if (this.contents == null)
          return false;
        this.contents = null;
        return true;
      }
      assertCollection(this.contents);
      return this.contents.deleteIn(path4);
    }
    getDefaults() {
      return Document.defaults[this.version] || Document.defaults[this.options.version] || {};
    }
    get(key, keepScalar) {
      return this.contents instanceof resolveSeq.Collection ? this.contents.get(key, keepScalar) : void 0;
    }
    getIn(path4, keepScalar) {
      if (resolveSeq.isEmptyPath(path4))
        return !keepScalar && this.contents instanceof resolveSeq.Scalar ? this.contents.value : this.contents;
      return this.contents instanceof resolveSeq.Collection ? this.contents.getIn(path4, keepScalar) : void 0;
    }
    has(key) {
      return this.contents instanceof resolveSeq.Collection ? this.contents.has(key) : false;
    }
    hasIn(path4) {
      if (resolveSeq.isEmptyPath(path4))
        return this.contents !== void 0;
      return this.contents instanceof resolveSeq.Collection ? this.contents.hasIn(path4) : false;
    }
    set(key, value) {
      assertCollection(this.contents);
      this.contents.set(key, value);
    }
    setIn(path4, value) {
      if (resolveSeq.isEmptyPath(path4))
        this.contents = value;
      else {
        assertCollection(this.contents);
        this.contents.setIn(path4, value);
      }
    }
    setSchema(id, customTags) {
      if (!id && !customTags && this.schema)
        return;
      if (typeof id === "number")
        id = id.toFixed(1);
      if (id === "1.0" || id === "1.1" || id === "1.2") {
        if (this.version)
          this.version = id;
        else
          this.options.version = id;
        delete this.options.schema;
      } else if (id && typeof id === "string") {
        this.options.schema = id;
      }
      if (Array.isArray(customTags))
        this.options.customTags = customTags;
      const opt = Object.assign({}, this.getDefaults(), this.options);
      this.schema = new Schema.Schema(opt);
    }
    parse(node, prevDoc) {
      if (this.options.keepCstNodes)
        this.cstNode = node;
      if (this.options.keepNodeTypes)
        this.type = "DOCUMENT";
      const {
        directives = [],
        contents = [],
        directivesEndMarker,
        error: error3,
        valueRange
      } = node;
      if (error3) {
        if (!error3.source)
          error3.source = this;
        this.errors.push(error3);
      }
      parseDirectives(this, directives, prevDoc);
      if (directivesEndMarker)
        this.directivesEndMarker = true;
      this.range = valueRange ? [valueRange.start, valueRange.end] : null;
      this.setSchema();
      this.anchors._cstAliases = [];
      parseContents(this, contents);
      this.anchors.resolveNodes();
      if (this.options.prettyErrors) {
        for (const error4 of this.errors)
          if (error4 instanceof PlainValue.YAMLError)
            error4.makePretty();
        for (const warn of this.warnings)
          if (warn instanceof PlainValue.YAMLError)
            warn.makePretty();
      }
      return this;
    }
    listNonDefaultTags() {
      return listTagNames(this.contents).filter((t) => t.indexOf(Schema.Schema.defaultPrefix) !== 0);
    }
    setTagPrefix(handle, prefix) {
      if (handle[0] !== "!" || handle[handle.length - 1] !== "!")
        throw new Error("Handle must start and end with !");
      if (prefix) {
        const prev = this.tagPrefixes.find((p) => p.handle === handle);
        if (prev)
          prev.prefix = prefix;
        else
          this.tagPrefixes.push({
            handle,
            prefix
          });
      } else {
        this.tagPrefixes = this.tagPrefixes.filter((p) => p.handle !== handle);
      }
    }
    toJSON(arg, onAnchor) {
      const {
        keepBlobsInJSON,
        mapAsMap,
        maxAliasCount
      } = this.options;
      const keep = keepBlobsInJSON && (typeof arg !== "string" || !(this.contents instanceof resolveSeq.Scalar));
      const ctx = {
        doc: this,
        indentStep: "  ",
        keep,
        mapAsMap: keep && !!mapAsMap,
        maxAliasCount,
        stringify
      };
      const anchorNames = Object.keys(this.anchors.map);
      if (anchorNames.length > 0)
        ctx.anchors = new Map(anchorNames.map((name) => [this.anchors.map[name], {
          alias: [],
          aliasCount: 0,
          count: 1
        }]));
      const res = resolveSeq.toJSON(this.contents, arg, ctx);
      if (typeof onAnchor === "function" && ctx.anchors)
        for (const {
          count,
          res: res2
        } of ctx.anchors.values())
          onAnchor(res2, count);
      return res;
    }
    toString() {
      if (this.errors.length > 0)
        throw new Error("Document with errors cannot be stringified");
      const indentSize = this.options.indent;
      if (!Number.isInteger(indentSize) || indentSize <= 0) {
        const s = JSON.stringify(indentSize);
        throw new Error(`"indent" option must be a positive integer, not ${s}`);
      }
      this.setSchema();
      const lines = [];
      let hasDirectives = false;
      if (this.version) {
        let vd = "%YAML 1.2";
        if (this.schema.name === "yaml-1.1") {
          if (this.version === "1.0")
            vd = "%YAML:1.0";
          else if (this.version === "1.1")
            vd = "%YAML 1.1";
        }
        lines.push(vd);
        hasDirectives = true;
      }
      const tagNames = this.listNonDefaultTags();
      this.tagPrefixes.forEach(({
        handle,
        prefix
      }) => {
        if (tagNames.some((t) => t.indexOf(prefix) === 0)) {
          lines.push(`%TAG ${handle} ${prefix}`);
          hasDirectives = true;
        }
      });
      if (hasDirectives || this.directivesEndMarker)
        lines.push("---");
      if (this.commentBefore) {
        if (hasDirectives || !this.directivesEndMarker)
          lines.unshift("");
        lines.unshift(this.commentBefore.replace(/^/gm, "#"));
      }
      const ctx = {
        anchors: Object.create(null),
        doc: this,
        indent: "",
        indentStep: " ".repeat(indentSize),
        stringify
      };
      let chompKeep = false;
      let contentComment = null;
      if (this.contents) {
        if (this.contents instanceof resolveSeq.Node) {
          if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker))
            lines.push("");
          if (this.contents.commentBefore)
            lines.push(this.contents.commentBefore.replace(/^/gm, "#"));
          ctx.forceBlockIndent = !!this.comment;
          contentComment = this.contents.comment;
        }
        const onChompKeep = contentComment ? null : () => chompKeep = true;
        const body = stringify(this.contents, ctx, () => contentComment = null, onChompKeep);
        lines.push(resolveSeq.addComment(body, "", contentComment));
      } else if (this.contents !== void 0) {
        lines.push(stringify(this.contents, ctx));
      }
      if (this.comment) {
        if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
          lines.push("");
        lines.push(this.comment.replace(/^/gm, "#"));
      }
      return lines.join("\n") + "\n";
    }
  };
  PlainValue._defineProperty(Document, "defaults", documentOptions);
  exports.Document = Document;
  exports.defaultOptions = defaultOptions;
  exports.scalarOptions = scalarOptions;
});

// node_modules/yaml/dist/index.js
var require_dist = __commonJS((exports) => {
  "use strict";
  var parseCst = require_parse_cst();
  var Document$1 = require_Document_9b4560a1();
  var Schema = require_Schema_88e323a7();
  var PlainValue = require_PlainValue_ec8e588e();
  var warnings = require_warnings_1000a372();
  require_resolveSeq_d03cb037();
  function createNode(value, wrapScalars = true, tag) {
    if (tag === void 0 && typeof wrapScalars === "string") {
      tag = wrapScalars;
      wrapScalars = true;
    }
    const options = Object.assign({}, Document$1.Document.defaults[Document$1.defaultOptions.version], Document$1.defaultOptions);
    const schema = new Schema.Schema(options);
    return schema.createNode(value, wrapScalars, tag);
  }
  var Document = class extends Document$1.Document {
    constructor(options) {
      super(Object.assign({}, Document$1.defaultOptions, options));
    }
  };
  function parseAllDocuments(src, options) {
    const stream = [];
    let prev;
    for (const cstDoc of parseCst.parse(src)) {
      const doc = new Document(options);
      doc.parse(cstDoc, prev);
      stream.push(doc);
      prev = doc;
    }
    return stream;
  }
  function parseDocument(src, options) {
    const cst = parseCst.parse(src);
    const doc = new Document(options).parse(cst[0]);
    if (cst.length > 1) {
      const errMsg = "Source contains multiple documents; please use YAML.parseAllDocuments()";
      doc.errors.unshift(new PlainValue.YAMLSemanticError(cst[1], errMsg));
    }
    return doc;
  }
  function parse2(src, options) {
    const doc = parseDocument(src, options);
    doc.warnings.forEach((warning) => warnings.warn(warning));
    if (doc.errors.length > 0)
      throw doc.errors[0];
    return doc.toJSON();
  }
  function stringify(value, options) {
    const doc = new Document(options);
    doc.contents = value;
    return String(doc);
  }
  var YAML = {
    createNode,
    defaultOptions: Document$1.defaultOptions,
    Document,
    parse: parse2,
    parseAllDocuments,
    parseCST: parseCst.parse,
    parseDocument,
    scalarOptions: Document$1.scalarOptions,
    stringify
  };
  exports.YAML = YAML;
});

// node_modules/yaml/index.js
var require_yaml = __commonJS((exports, module2) => {
  module2.exports = require_dist().YAML;
});

// src/main.ts
__markAsModule(exports);
__export(exports, {
  run: () => run
});
var core3 = __toModule(require_core());
var path3 = __toModule(require("path"));
var github = __toModule(require_github());
var import_exec2 = __toModule(require_exec());

// src/XcutilsVersionResolver.ts
var toolsCache = __toModule(require_tool_cache());
var core = __toModule(require_core());
var import_exec = __toModule(require_exec());
var XcutilsVersionResolver = class {
  constructor(xcodeSearchPath) {
    this.hasDownloadedBinary = false;
    this.xcodeSearchPath = xcodeSearchPath;
  }
  async resolveVersion(versionSpecifier) {
    const json = await this.run([
      "select",
      versionSpecifier,
      "--print-versions",
      "--output=json",
      `--search-path=${this.xcodeSearchPath}`
    ]);
    core.debug(`Resolved versions for ${versionSpecifier}: ${json}`);
    const versions = JSON.parse(json);
    if (versions.length === 0) {
      return;
    }
    const version = versions[0];
    core.debug(`Resolved ${versionSpecifier} to ${JSON.stringify(version)}`);
    const path4 = version.path;
    const xcodeSplit = path4.split("/Xcode_");
    if (xcodeSplit.length < 2) {
      throw Error(`Path does not contain "Xcode_": ${path4}`);
    }
    const appSplit = xcodeSplit[1].split(".app");
    if (appSplit.length < 2) {
      throw Error(`Path does not contain ".app": ${path4}`);
    }
    return appSplit[0];
  }
  async run(args) {
    await this.pullXcutils();
    let output = "";
    const options = {
      listeners: {
        stdout: (data) => {
          output += data.toString();
        }
      }
    };
    await (0, import_exec.exec)("xcutils", args, options);
    return output;
  }
  async pullXcutils() {
    if (this.downloadBinaryPromise !== void 0) {
      return this.downloadBinaryPromise;
    }
    this.downloadBinaryPromise = this.createDownloadBinaryPromise();
    await this.downloadBinaryPromise;
  }
  async createDownloadBinaryPromise() {
    const version = "v0.2.2";
    const zipURL = `https://github.com/JosephDuffy/xcutils/releases/download/${version}/xcutils.zip`;
    core.debug(`Downloading xcutils archive from ${zipURL}`);
    const xcutilsZipPath = await toolsCache.downloadTool(zipURL);
    core.debug("Extracting xcutils zip to /usr/local/bin");
    const xcutilsFolder = await toolsCache.extractZip(xcutilsZipPath, "/usr/local/bin");
    core.debug(`Adding xcutils to path: ${xcutilsFolder}`);
    core.addPath(xcutilsFolder);
  }
};
var XcutilsVersionResolver_default = XcutilsVersionResolver;

// src/applyXcodeVersionsToWorkflowFiles.ts
var path = __toModule(require("path"));
var core2 = __toModule(require_core());
var fs = __toModule(require("fs"));
var import_stream = __toModule(require("stream"));
var import_child_process = __toModule(require("child_process"));
async function applyXcodeVersionsToWorkflowFiles(workflows, rootPath, versionResolver, quotes) {
  await execute([
    "pip3",
    "install",
    "-r",
    path.resolve(__dirname, "../requirements.txt")
  ]);
  for (const fileName in workflows) {
    const rootNode = workflows[fileName];
    const workflowFilePath = path.resolve(rootPath, fileName);
    core2.debug(`Resolved workflow file "${fileName}" against "${rootPath}": "${workflowFilePath}"`);
    const workflowFileContents = fs.readFileSync(workflowFilePath);
    const updates = await updatesFrom(rootNode, versionResolver);
    const scriptPath = path.resolve(__dirname, "../src/applyXcodeVersion.py");
    core2.debug(`Running script at ${scriptPath}`);
    let modifiedFileContents = workflowFileContents;
    for (const update of updates) {
      try {
        const output = await execute([
          scriptPath,
          ...update.keyPath,
          "--yaml_value",
          ...update.value,
          "--quotes",
          quotes
        ], modifiedFileContents);
        modifiedFileContents = Buffer.from(output);
      } catch (error3) {
        core2.error(error3);
      }
    }
    fs.writeFileSync(workflowFilePath, modifiedFileContents.toString("utf8"), "utf8");
  }
}
function execute(params, input) {
  return new Promise((resolve3, reject) => {
    core2.debug(`Spawning process: ${params.join(" ")}`);
    const child = (0, import_child_process.exec)(params.join(" "), (error3, stdout) => {
      if (error3) {
        reject(error3);
      } else {
        resolve3(stdout);
      }
    });
    if (input && child.stdin) {
      const stdinStream = new import_stream.Stream.Readable();
      stdinStream.push(input);
      stdinStream.push(null);
      stdinStream.pipe(child.stdin);
    }
  });
}
async function updatesFrom(node, versionResolver, keyPath = []) {
  const isNotUndefined = (value) => {
    return value !== void 0;
  };
  if (typeof node === "string") {
    const resolvedVersion = await versionResolver.resolveVersion(node);
    if (resolvedVersion === void 0) {
      throw new Error(`Version specifier ${node} is the only version specified for path ${keyPath} but did not resolve to a version`);
    }
    return [
      {
        keyPath,
        value: [resolvedVersion]
      }
    ];
  } else if (Array.isArray(node)) {
    const resolvePromises = node.map((version) => versionResolver.resolveVersion(version));
    const versions = await Promise.all(resolvePromises);
    const resolvedVersions = versions.filter(isNotUndefined);
    if (resolvedVersions.length === 0) {
      throw new Error(`All version specifiers for path ${keyPath} did not resolve to a version: ${node}`);
    }
    return [
      {
        keyPath,
        value: resolvedVersions
      }
    ];
  } else {
    const promises = Object.keys(node).map((key) => {
      return updatesFrom(node[key], versionResolver, [...keyPath, key]);
    });
    const result = await Promise.all(promises);
    return result.flatMap((element) => element);
  }
}

// src/applyXcodeVersionsFile.ts
var path2 = __toModule(require("path"));
var fs2 = __toModule(require("fs"));
var yaml = __toModule(require_yaml());
function applyXcodeVersionsFile(xcodeVersionsFilePath, versionResolver, quotes) {
  const xcodeVersionsFileContents = fs2.readFileSync(xcodeVersionsFilePath, "utf8");
  const xcodeVersions = yaml.parse(xcodeVersionsFileContents);
  const xcodeVersionsFileDirectory = path2.dirname(xcodeVersionsFilePath);
  const workflowXcodeVersions = xcodeVersions.workflows;
  return applyXcodeVersionsToWorkflowFiles(workflowXcodeVersions, xcodeVersionsFileDirectory, versionResolver, quotes);
}

// src/generateBadge.ts
var fs3 = __toModule(require("fs"));
var import_https = __toModule(require("https"));
function generateBadge(badgePath, versions, versionResolver) {
  return new Promise((resolve3, reject) => {
    const resolvedVersionPromises = versions.map((v) => versionResolver.resolveVersion(v));
    Promise.all(resolvedVersionPromises).then((resolvedVersions) => {
      const displayResolvedVersions = encodeURI(resolvedVersions.filter((v) => v !== void 0).join(" | "));
      const badgeURL = `https://img.shields.io/badge/Xcode-${displayResolvedVersions}-success`;
      import_https.default.get(badgeURL, (response) => {
        const badgeWriteStream = fs3.createWriteStream(badgePath);
        response.pipe(badgeWriteStream);
        resolve3();
      }).on("error", (error3) => {
        reject(error3);
      });
    }).catch((error3) => {
      reject(error3);
    });
  });
}

// src/main.ts
async function run() {
  try {
    const workspacePath = process.env["GITHUB_WORKSPACE"];
    if (workspacePath === void 0) {
      throw new Error("GITHUB_WORKSPACE environment variable not available");
    }
    const xcodeVersionsFile = core3.getInput("xcode-versions-file", {
      required: true
    });
    core3.debug(`xcode-versions-file input: ${xcodeVersionsFile}`);
    const xcodeSearchPathInput = core3.getInput("xcode-search-path");
    core3.debug(`xcode-search-path input: ${xcodeSearchPathInput.length > 0 ? xcodeSearchPathInput : "not provided"}`);
    const quotes = core3.getInput("quotes");
    if (quotes !== "single" && quotes !== "double") {
      core3.error("Quotes can only be 'single' or 'double'");
      return;
    }
    const xcodeSearchPath = path3.resolve(workspacePath, xcodeSearchPathInput.length > 0 ? xcodeSearchPathInput : "/Applications");
    core3.debug(`Resolved Xcode search path "${xcodeSearchPathInput}" against workspace "${workspacePath}": "${xcodeSearchPath}`);
    const xcodeVersionsFilePath = path3.resolve(workspacePath, xcodeVersionsFile);
    const xcutilsVersionResolver = new XcutilsVersionResolver_default(xcodeSearchPath);
    await applyXcodeVersionsFile(xcodeVersionsFilePath, xcutilsVersionResolver, quotes);
    const xcodeVersionBadgePath = core3.getInput("xcode-version-badge-path");
    if (xcodeVersionBadgePath !== "") {
      const xcodeVersionBadgeVersionsString = core3.getInput("xcode-version-badge-versions");
      const xcodeVersionBadgeVersions = xcodeVersionBadgeVersionsString.split(",").map((s) => s.trim());
      if (xcodeVersionBadgeVersions.length > 0) {
        await generateBadge(path3.resolve(workspacePath, xcodeVersionBadgePath), xcodeVersionBadgeVersions, xcutilsVersionResolver);
      }
    }
    const githubToken = core3.getInput("github-token");
    if (githubToken !== "") {
      core3.debug("Have a GitHub token; creating pull request");
      const gitDiffExitCode = await (0, import_exec2.exec)("git", ["diff", "--exit-code"], {
        ignoreReturnCode: true
      });
      if (gitDiffExitCode === 0) {
        core3.info("No change were applied");
        return;
      }
      core3.debug("Setting up committer details");
      await (0, import_exec2.exec)("git", [
        "config",
        "--local",
        "user.email",
        "action@github.com"
      ]);
      await (0, import_exec2.exec)("git", ["config", "--local", "user.name", "GitHub Action"]);
      let baseBranchName = "";
      await (0, import_exec2.exec)("git", ["branch", "--show-current"], {
        listeners: {
          stdout: (buffer) => {
            baseBranchName += buffer.toString("utf8").replace(/\n$/, "");
          }
        }
      });
      const octokit = github.getOctokit(githubToken);
      const commitAndPushChanges = async () => {
        await (0, import_exec2.exec)("git", [
          "checkout",
          "-b",
          "update-xcode-version-action/update-xcode-versions"
        ]);
        core3.debug("Created branch");
        await (0, import_exec2.exec)("git", ["add", "."]);
        core3.debug("Staged all changes");
        await (0, import_exec2.exec)("git", ["commit", "-m", "Update Xcode Versions"]);
        core3.debug("Created commit");
        await (0, import_exec2.exec)("git", [
          "push",
          "--force",
          "origin",
          "update-xcode-version-action/update-xcode-versions"
        ]);
        core3.debug("Pushed branch");
      };
      const pullRequests = await octokit.pulls.list({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        head: `${github.context.repo.owner}:update-xcode-version-action/update-xcode-versions`,
        state: "open"
      });
      if (pullRequests.data.length > 0) {
        core3.debug(`Found matching pull requests: ${JSON.stringify(pullRequests)}`);
        const pullRequest = pullRequests.data[0];
        if (pullRequest.base.ref !== baseBranchName) {
          core3.info(`An existing pull requests exists at ${pullRequest.html_url} with base branch ${pullRequest.base.ref}, but the workflow was run from ${baseBranchName}.`);
          core3.info("The action will not create a new PR or update the existing branch. Delete the PR and run again to recreate.");
        } else {
          core3.info(`Pull request exists at ${pullRequest.html_url}. Pushing changes.`);
          await commitAndPushChanges();
        }
      } else {
        await commitAndPushChanges();
        const createParameters = {
          title: "Update Xcode Versions",
          head: "update-xcode-version-action/update-xcode-versions",
          base: baseBranchName,
          owner: github.context.repo.owner,
          repo: github.context.repo.repo
        };
        core3.debug(`Attempting to create a pull request with parameters:${JSON.stringify(createParameters)}`);
        const response = await octokit.pulls.create(createParameters);
        core3.info(`Create pull request at ${response.data.html_url}`);
      }
    }
  } catch (error3) {
    core3.setFailed(error3.message);
  }
}
if (process.env.NODE_ENV !== "test") {
  run();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
