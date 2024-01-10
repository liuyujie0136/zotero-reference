"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function (x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/zotero-plugin-toolkit/dist/utils/debugBridge.js
  var require_debugBridge = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/utils/debugBridge.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DebugBridge = void 0;
      var basic_1 = require_basic();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var DebugBridge = class {
        get version() {
          return DebugBridge.version;
        }
        get disableDebugBridgePassword() {
          return this._disableDebugBridgePassword;
        }
        set disableDebugBridgePassword(value) {
          this._disableDebugBridgePassword = value;
        }
        get password() {
          return basic_1.BasicTool.getZotero().Prefs.get(DebugBridge.passwordPref, true);
        }
        set password(v) {
          basic_1.BasicTool.getZotero().Prefs.set(DebugBridge.passwordPref, v, true);
        }
        constructor() {
          this._disableDebugBridgePassword = false;
          this.initializeDebugBridge();
        }
        static setModule(instance) {
          var _a;
          if (!((_a = instance.debugBridge) === null || _a === void 0 ? void 0 : _a.version) || instance.debugBridge.version < DebugBridge.version) {
            instance.debugBridge = new DebugBridge();
          }
        }
        initializeDebugBridge() {
          const debugBridgeExtension = {
            noContent: true,
            doAction: async (uri) => {
              var _a;
              const Zotero2 = basic_1.BasicTool.getZotero();
              const uriString = uri.spec.split("//").pop();
              if (!uriString) {
                return;
              }
              const params = {};
              (_a = uriString.split("?").pop()) === null || _a === void 0 ? void 0 : _a.split("&").forEach((p) => {
                params[p.split("=")[0]] = p.split("=")[1];
              });
              if (toolkitGlobal_1.default.getInstance().debugBridge.disableDebugBridgePassword || params.password === this.password) {
                if (params.run) {
                  try {
                    const AsyncFunction = Object.getPrototypeOf(async function () {
                    }).constructor;
                    const f = new AsyncFunction("Zotero,window", decodeURIComponent(params.run));
                    await f(Zotero2, Zotero2.getMainWindow());
                  } catch (e) {
                    Zotero2.debug(e);
                    Zotero2.getMainWindow().console.log(e);
                  }
                }
                if (params.file) {
                  try {
                    Services.scriptloader.loadSubScript(decodeURIComponent(params.file), { Zotero: Zotero2, window: Zotero2.getMainWindow() });
                  } catch (e) {
                    Zotero2.debug(e);
                    Zotero2.getMainWindow().console.log(e);
                  }
                }
              }
            },
            newChannel: function (uri) {
              this.doAction(uri);
            }
          };
          Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions["zotero://ztoolkit-debug"] = debugBridgeExtension;
        }
      };
      exports.DebugBridge = DebugBridge;
      DebugBridge.version = 1;
      DebugBridge.passwordPref = "extensions.zotero.debug-bridge.password";
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/managers/toolkitGlobal.js
  var require_toolkitGlobal = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/managers/toolkitGlobal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ToolkitGlobal = void 0;
      var basic_1 = require_basic();
      var debugBridge_1 = require_debugBridge();
      var ToolkitGlobal = class {
        constructor() {
          initializeModules(this);
        }
        /**
         * Get the global unique instance of `class ToolkitGlobal`.
         * @returns An instance of `ToolkitGlobal`.
         */
        static getInstance() {
          const Zotero2 = basic_1.BasicTool.getZotero();
          if (!("_toolkitGlobal" in Zotero2)) {
            Zotero2._toolkitGlobal = new ToolkitGlobal();
          } else {
            initializeModules(Zotero2._toolkitGlobal);
          }
          return Zotero2._toolkitGlobal;
        }
      };
      exports.ToolkitGlobal = ToolkitGlobal;
      function initializeModules(instance) {
        setModule(instance, "fieldHooks", {
          _ready: false,
          getFieldHooks: {},
          setFieldHooks: {},
          isFieldOfBaseHooks: {}
        });
        setModule(instance, "itemTree", {
          _ready: false,
          columns: [],
          renderCellHooks: {}
        });
        setModule(instance, "itemBox", {
          _ready: false,
          fieldOptions: {}
        });
        setModule(instance, "shortcut", {
          _ready: false,
          eventKeys: []
        });
        setModule(instance, "prompt", {
          _ready: false,
          instance: void 0
        });
        setModule(instance, "readerInstance", {
          _ready: false,
          initializedHooks: {}
        });
        debugBridge_1.DebugBridge.setModule(instance);
      }
      function setModule(instance, key, module2) {
        var _a;
        var _b;
        if (!module2) {
          return;
        }
        if (!instance[key]) {
          instance[key] = module2;
        }
        for (const moduleKey in module2) {
          (_a = (_b = instance[key])[moduleKey]) !== null && _a !== void 0 ? _a : _b[moduleKey] = module2[moduleKey];
        }
      }
      exports.default = ToolkitGlobal;
    }
  });

  // node_modules/zotero-plugin-toolkit/dist/basic.js
  var require_basic = __commonJS({
    "node_modules/zotero-plugin-toolkit/dist/basic.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unregister = exports.ManagerTool = exports.BasicTool = void 0;
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal());
      var BasicTool2 = class {
        get basicOptions() {
          return this._basicOptions;
        }
        /**
         *
         * @param basicTool Pass an BasicTool instance to copy its options.
         */
        constructor(data) {
          this.patchSign = "zotero-plugin-toolkit@2.0.0";
          this._basicOptions = {
            log: {
              _type: "toolkitlog",
              disableConsole: false,
              disableZLog: false,
              prefix: ""
            },
            debug: toolkitGlobal_1.default.getInstance().debugBridge
          };
          this.updateOptions(data);
          return;
        }
        getGlobal(k) {
          const _Zotero = typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
          const window2 = _Zotero.getMainWindow();
          switch (k) {
            case "Zotero":
            case "zotero":
              return _Zotero;
            case "window":
              return window2;
            case "document":
              return window2.document;
            case "ZoteroPane":
            case "ZoteroPane_Local":
              return _Zotero.getActiveZoteroPane();
            default:
              return window2[k];
          }
        }
        /**
         * Check if it's running on Zotero 7 (Firefox 102)
         */
        isZotero7() {
          return Zotero.platformMajorVersion >= 102;
        }
        /**
         * Get DOMParser.
         *
         * For Zotero 6: mainWindow.DOMParser or nsIDOMParser
         *
         * For Zotero 7: Firefox 102 support DOMParser natively
         */
        getDOMParser() {
          if (this.isZotero7()) {
            return new (this.getGlobal("DOMParser"))();
          }
          try {
            return new (this.getGlobal("DOMParser"))();
          } catch (e) {
            return Components.classes["@mozilla.org/xmlextras/domparser;1"].createInstance(Components.interfaces.nsIDOMParser);
          }
        }
        /**
         * If it's an XUL element
         * @param elem
         */
        isXULElement(elem) {
          return elem.namespaceURI === "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        }
        /**
         * Create an XUL element
         *
         * For Zotero 6, use `createElementNS`;
         *
         * For Zotero 7+, use `createXULElement`.
         * @param doc
         * @param type
         * @example
         * Create a `<menuitem>`:
         * ```ts
         * const compat = new ZoteroCompat();
         * const doc = compat.getWindow().document;
         * const elem = compat.createXULElement(doc, "menuitem");
         * ```
         */
        createXULElement(doc, type) {
          if (this.isZotero7()) {
            return doc.createXULElement(type);
          } else {
            return doc.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", type);
          }
        }
        /**
         * Output to both Zotero.debug and console.log
         * @param data e.g. string, number, object, ...
         */
        log(...data) {
          var _a;
          if (data.length === 0) {
            return;
          }
          const Zotero2 = this.getGlobal("Zotero");
          const console2 = this.getGlobal("console");
          let options;
          if (((_a = data[data.length - 1]) === null || _a === void 0 ? void 0 : _a._type) === "toolkitlog") {
            options = data.pop();
          } else {
            options = this._basicOptions.log;
          }
          try {
            if (options.prefix) {
              data.splice(0, 0, options.prefix);
            }
            if (!options.disableConsole) {
              console2.groupCollapsed(...data);
              console2.trace();
              console2.groupEnd();
            }
            if (!options.disableZLog) {
              Zotero2.debug(data.map((d) => {
                try {
                  return typeof d === "object" ? JSON.stringify(d) : String(d);
                } catch (e) {
                  Zotero2.debug(d);
                  return "";
                }
              }).join("\n"));
            }
          } catch (e) {
            console2.error(e);
            Zotero2.logError(e);
          }
        }
        /**
         * Patch a function
         * @param object The owner of the function
         * @param funcSign The signature of the function(function name)
         * @param ownerSign The signature of patch owner to avoid patching again
         * @param patcher The new wrapper of the patched funcion
         */
        patch(object, funcSign, ownerSign, patcher) {
          if (object[funcSign][ownerSign]) {
            throw new Error(`${String(funcSign)} re-patched`);
          }
          this.log("patching", funcSign, `by ${ownerSign}`);
          object[funcSign] = patcher(object[funcSign]);
          object[funcSign][ownerSign] = true;
        }
        updateOptions(source) {
          if (!source) {
            return;
          }
          if (source instanceof BasicTool2) {
            this._basicOptions = source._basicOptions;
          } else {
            this._basicOptions = source;
          }
        }
        static getZotero() {
          return typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
        }
      };
      exports.BasicTool = BasicTool2;
      var ManagerTool = class extends BasicTool2 {
      };
      exports.ManagerTool = ManagerTool;
      function unregister(tools) {
        Object.values(tools).forEach((tool) => {
          if (tool instanceof ManagerTool || typeof tool.unregisterAll === "function") {
            tool.unregisterAll();
          }
        });
      }
      exports.unregister = unregister;
    }
  });

  // ../zotero-plugin-toolkit/dist/utils/debugBridge.js
  var require_debugBridge2 = __commonJS({
    "../zotero-plugin-toolkit/dist/utils/debugBridge.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DebugBridge = void 0;
      var basic_1 = require_basic2();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var DebugBridge = class {
        constructor() {
          this._disableDebugBridgePassword = false;
          this.initializeDebugBridge();
        }
        get version() {
          return DebugBridge.version;
        }
        get disableDebugBridgePassword() {
          return this._disableDebugBridgePassword;
        }
        set disableDebugBridgePassword(value) {
          this._disableDebugBridgePassword = value;
        }
        get password() {
          return basic_1.BasicTool.getZotero().Prefs.get(DebugBridge.passwordPref, true);
        }
        set password(v) {
          basic_1.BasicTool.getZotero().Prefs.set(DebugBridge.passwordPref, v, true);
        }
        static setModule(instance) {
          var _a;
          if (!((_a = instance.debugBridge) === null || _a === void 0 ? void 0 : _a.version) || instance.debugBridge.version < DebugBridge.version) {
            instance.debugBridge = new DebugBridge();
          }
        }
        initializeDebugBridge() {
          const debugBridgeExtension = {
            noContent: true,
            doAction: async (uri) => {
              var _a;
              const Zotero2 = basic_1.BasicTool.getZotero();
              const uriString = uri.spec.split("//").pop();
              if (!uriString) {
                return;
              }
              const params = {};
              (_a = uriString.split("?").pop()) === null || _a === void 0 ? void 0 : _a.split("&").forEach((p) => {
                params[p.split("=")[0]] = p.split("=")[1];
              });
              if (toolkitGlobal_1.default.getInstance().debugBridge.disableDebugBridgePassword || params.password === this.password) {
                if (params.run) {
                  try {
                    const AsyncFunction = Object.getPrototypeOf(async function () {
                    }).constructor;
                    const f = new AsyncFunction("Zotero,window", decodeURIComponent(params.run));
                    await f(Zotero2, Zotero2.getMainWindow());
                  } catch (e) {
                    Zotero2.debug(e);
                    Zotero2.getMainWindow().console.log(e);
                  }
                }
                if (params.file) {
                  try {
                    Services.scriptloader.loadSubScript(decodeURIComponent(params.file), { Zotero: Zotero2, window: Zotero2.getMainWindow() });
                  } catch (e) {
                    Zotero2.debug(e);
                    Zotero2.getMainWindow().console.log(e);
                  }
                }
              }
            },
            newChannel: function (uri) {
              this.doAction(uri);
            }
          };
          Services.io.getProtocolHandler("zotero").wrappedJSObject._extensions["zotero://ztoolkit-debug"] = debugBridgeExtension;
        }
      };
      exports.DebugBridge = DebugBridge;
      DebugBridge.version = 1;
      DebugBridge.passwordPref = "extensions.zotero.debug-bridge.password";
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/toolkitGlobal.js
  var require_toolkitGlobal2 = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/toolkitGlobal.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ToolkitGlobal = void 0;
      var basic_1 = require_basic2();
      var debugBridge_1 = require_debugBridge2();
      var ToolkitGlobal = class {
        constructor() {
          initializeModules(this);
        }
        /**
         * Get the global unique instance of `class ToolkitGlobal`.
         * @returns An instance of `ToolkitGlobal`.
         */
        static getInstance() {
          const Zotero2 = basic_1.BasicTool.getZotero();
          if (!("_toolkitGlobal" in Zotero2)) {
            Zotero2._toolkitGlobal = new ToolkitGlobal();
          } else {
            initializeModules(Zotero2._toolkitGlobal);
          }
          return Zotero2._toolkitGlobal;
        }
      };
      exports.ToolkitGlobal = ToolkitGlobal;
      function initializeModules(instance) {
        setModule(instance, "fieldHooks", {
          _ready: false,
          getFieldHooks: {},
          setFieldHooks: {},
          isFieldOfBaseHooks: {}
        });
        setModule(instance, "itemTree", {
          _ready: false,
          columns: [],
          renderCellHooks: {}
        });
        setModule(instance, "itemBox", {
          _ready: false,
          fieldOptions: {}
        });
        setModule(instance, "shortcut", {
          _ready: false,
          eventKeys: []
        });
        setModule(instance, "prompt", {
          _ready: false,
          instance: void 0
        });
        setModule(instance, "readerInstance", {
          _ready: false,
          initializedHooks: {}
        });
        debugBridge_1.DebugBridge.setModule(instance);
      }
      function setModule(instance, key, module2) {
        var _a;
        var _b;
        if (!module2) {
          return;
        }
        if (!instance[key]) {
          instance[key] = module2;
        }
        for (const moduleKey in module2) {
          (_a = (_b = instance[key])[moduleKey]) !== null && _a !== void 0 ? _a : _b[moduleKey] = module2[moduleKey];
        }
      }
      exports.default = ToolkitGlobal;
    }
  });

  // ../zotero-plugin-toolkit/dist/basic.js
  var require_basic2 = __commonJS({
    "../zotero-plugin-toolkit/dist/basic.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.unregister = exports.ManagerTool = exports.BasicTool = void 0;
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var BasicTool2 = class {
        /**
         *
         * @param basicTool Pass an BasicTool instance to copy its options.
         */
        constructor(data) {
          this.patchSign = "zotero-plugin-toolkit@2.0.0";
          this._basicOptions = {
            log: {
              _type: "toolkitlog",
              disableConsole: false,
              disableZLog: false,
              prefix: ""
            },
            debug: toolkitGlobal_1.default.getInstance().debugBridge
          };
          this.updateOptions(data);
          return;
        }
        get basicOptions() {
          return this._basicOptions;
        }
        getGlobal(k) {
          const _Zotero = typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
          const window2 = _Zotero.getMainWindow();
          switch (k) {
            case "Zotero":
            case "zotero":
              return _Zotero;
            case "window":
              return window2;
            case "document":
              return window2.document;
            case "ZoteroPane":
            case "ZoteroPane_Local":
              return _Zotero.getActiveZoteroPane();
            default:
              return window2[k];
          }
        }
        /**
         * Check if it's running on Zotero 7 (Firefox 102)
         */
        isZotero7() {
          return Zotero.platformMajorVersion >= 102;
        }
        /**
         * Get DOMParser.
         *
         * For Zotero 6: mainWindow.DOMParser or nsIDOMParser
         *
         * For Zotero 7: Firefox 102 support DOMParser natively
         */
        getDOMParser() {
          if (this.isZotero7()) {
            return new (this.getGlobal("DOMParser"))();
          }
          try {
            return new (this.getGlobal("DOMParser"))();
          } catch (e) {
            return Components.classes["@mozilla.org/xmlextras/domparser;1"].createInstance(Components.interfaces.nsIDOMParser);
          }
        }
        /**
         * If it's an XUL element
         * @param elem
         */
        isXULElement(elem) {
          return elem.namespaceURI === "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        }
        /**
         * Create an XUL element
         *
         * For Zotero 6, use `createElementNS`;
         *
         * For Zotero 7+, use `createXULElement`.
         * @param doc
         * @param type
         * @example
         * Create a `<menuitem>`:
         * ```ts
         * const compat = new ZoteroCompat();
         * const doc = compat.getWindow().document;
         * const elem = compat.createXULElement(doc, "menuitem");
         * ```
         */
        createXULElement(doc, type) {
          if (this.isZotero7()) {
            return doc.createXULElement(type);
          } else {
            return doc.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", type);
          }
        }
        /**
         * Output to both Zotero.debug and console.log
         * @param data e.g. string, number, object, ...
         */
        log(...data) {
          var _a;
          if (data.length === 0) {
            return;
          }
          const Zotero2 = this.getGlobal("Zotero");
          const console2 = this.getGlobal("console");
          let options;
          if (((_a = data[data.length - 1]) === null || _a === void 0 ? void 0 : _a._type) === "toolkitlog") {
            options = data.pop();
          } else {
            options = this._basicOptions.log;
          }
          try {
            if (options.prefix) {
              data.splice(0, 0, options.prefix);
            }
            if (!options.disableConsole) {
              console2.groupCollapsed(...data);
              console2.trace();
              console2.groupEnd();
            }
            if (!options.disableZLog) {
              Zotero2.debug(data.map((d) => {
                try {
                  return typeof d === "object" ? JSON.stringify(d) : String(d);
                } catch (e) {
                  Zotero2.debug(d);
                  return "";
                }
              }).join("\n"));
            }
          } catch (e) {
            console2.error(e);
            Zotero2.logError(e);
          }
        }
        /**
         * Patch a function
         * @param object The owner of the function
         * @param funcSign The signature of the function(function name)
         * @param ownerSign The signature of patch owner to avoid patching again
         * @param patcher The new wrapper of the patched funcion
         */
        patch(object, funcSign, ownerSign, patcher) {
          if (object[funcSign][ownerSign]) {
            throw new Error(`${String(funcSign)} re-patched`);
          }
          this.log("patching", funcSign, `by ${ownerSign}`);
          object[funcSign] = patcher(object[funcSign]);
          object[funcSign][ownerSign] = true;
        }
        updateOptions(source) {
          if (!source) {
            return;
          }
          if (source instanceof BasicTool2) {
            this._basicOptions = source._basicOptions;
          } else {
            this._basicOptions = source;
          }
        }
        static getZotero() {
          return typeof Zotero !== "undefined" ? Zotero : Components.classes["@zotero.org/Zotero;1"].getService(Components.interfaces.nsISupports).wrappedJSObject;
        }
      };
      exports.BasicTool = BasicTool2;
      var ManagerTool = class extends BasicTool2 {
      };
      exports.ManagerTool = ManagerTool;
      function unregister(tools) {
        Object.values(tools).forEach((tool) => {
          if (tool instanceof ManagerTool || typeof tool.unregisterAll === "function") {
            tool.unregisterAll();
          }
        });
      }
      exports.unregister = unregister;
    }
  });

  // ../zotero-plugin-toolkit/dist/tools/ui.js
  var require_ui = __commonJS({
    "../zotero-plugin-toolkit/dist/tools/ui.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.UITool = void 0;
      var basic_1 = require_basic2();
      var UITool = class extends basic_1.BasicTool {
        constructor(base) {
          super(base);
          this.elementCache = [];
          if (!this._basicOptions.ui) {
            this._basicOptions.ui = {
              enableElementRecord: true,
              enableElementJSONLog: false,
              enableElementDOMLog: true
            };
          }
        }
        get basicOptions() {
          return this._basicOptions;
        }
        /**
         * Remove all elements created by `createElement`.
         *
         * @remarks
         * > What is this for?
         *
         * In bootstrap plugins, elements must be manually maintained and removed on exiting.
         *
         * This API does this for you.
         */
        unregisterAll() {
          this.elementCache.forEach((e) => {
            try {
              e === null || e === void 0 ? void 0 : e.remove();
            } catch (e2) {
              this.log(e2);
            }
          });
        }
        createElement(...args) {
          var _a, _b, _c;
          const doc = args[0];
          const tagName = args[1].toLowerCase();
          let props = args[2] || {};
          if (!tagName) {
            return;
          }
          if (typeof args[2] === "string") {
            props = {
              namespace: args[2],
              enableElementRecord: args[3]
            };
          }
          if (typeof props.enableElementJSONLog !== "undefined" && props.enableElementJSONLog || this.basicOptions.ui.enableElementJSONLog) {
            this.log(props);
          }
          props.properties = props.properties || props.directAttributes;
          props.children = props.children || props.subElementOptions;
          let elem;
          if (tagName === "fragment") {
            const fragElem = doc.createDocumentFragment();
            elem = fragElem;
          } else {
            let realElem = props.id && (props.checkExistenceParent ? props.checkExistenceParent : doc).querySelector(`#${props.id}`);
            if (realElem && props.ignoreIfExists) {
              return realElem;
            }
            if (realElem && props.removeIfExists) {
              realElem.remove();
              realElem = void 0;
            }
            if (props.customCheck && !props.customCheck(doc, props)) {
              return void 0;
            }
            if (!realElem || !props.skipIfExists) {
              let namespace = props.namespace;
              if (!namespace) {
                const mightHTML = HTMLElementTagNames.includes(tagName);
                const mightXUL = XULElementTagNames.includes(tagName);
                const mightSVG = SVGElementTagNames.includes(tagName);
                if (Number(mightHTML) + Number(mightXUL) + Number(mightSVG) > 1) {
                  this.log(`[Warning] Creating element ${tagName} with no namespace specified. Found multiply namespace matches.`);
                }
                if (mightHTML) {
                  namespace = "html";
                } else if (mightXUL) {
                  namespace = "xul";
                } else if (mightSVG) {
                  namespace = "svg";
                } else {
                  namespace = "html";
                }
              }
              if (namespace === "xul") {
                realElem = this.createXULElement(doc, tagName);
              } else {
                realElem = doc.createElementNS({
                  html: "http://www.w3.org/1999/xhtml",
                  svg: "http://www.w3.org/2000/svg"
                }[namespace], tagName);
              }
              this.elementCache.push(realElem);
            }
            if (props.id) {
              realElem.id = props.id;
            }
            if (props.styles && Object.keys(props.styles).length) {
              Object.keys(props.styles).forEach((k) => {
                const v = props.styles[k];
                typeof v !== "undefined" && (realElem.style[k] = v);
              });
            }
            if (props.properties && Object.keys(props.properties).length) {
              Object.keys(props.properties).forEach((k) => {
                const v = props.properties[k];
                typeof v !== "undefined" && (realElem[k] = v);
              });
            }
            if (props.attributes && Object.keys(props.attributes).length) {
              Object.keys(props.attributes).forEach((k) => {
                const v = props.attributes[k];
                typeof v !== "undefined" && realElem.setAttribute(k, String(v));
              });
            }
            if ((_a = props.classList) === null || _a === void 0 ? void 0 : _a.length) {
              realElem.classList.add(...props.classList);
            }
            if ((_b = props.listeners) === null || _b === void 0 ? void 0 : _b.length) {
              props.listeners.forEach(({ type, listener, options }) => {
                listener && realElem.addEventListener(type, listener, options);
              });
            }
            elem = realElem;
          }
          if ((_c = props.children) === null || _c === void 0 ? void 0 : _c.length) {
            const subElements = props.children.map((childProps) => {
              childProps.namespace = childProps.namespace || props.namespace;
              return this.createElement(doc, childProps.tag, childProps);
            }).filter((e) => e);
            elem.append(...subElements);
          }
          if (typeof props.enableElementDOMLog !== "undefined" && props.enableElementDOMLog || this.basicOptions.ui.enableElementDOMLog) {
            this.log(elem);
          }
          return elem;
        }
        /**
         * Append element(s) to a node.
         * @param properties See {@link ElementProps}
         * @param container The parent node to append to.
         * @returns A Node that is the appended child (aChild),
         *          except when aChild is a DocumentFragment,
         *          in which case the empty DocumentFragment is returned.
         */
        appendElement(properties, container) {
          return container.appendChild(this.createElement(container.ownerDocument, properties.tag, properties));
        }
        /**
         * Inserts a node before a reference node as a child of its parent node.
         * @param properties See {@link ElementProps}
         * @param referenceNode The node before which newNode is inserted.
         * @returns
         */
        insertElementBefore(properties, referenceNode) {
          if (referenceNode.parentNode)
            return referenceNode.parentNode.insertBefore(this.createElement(referenceNode.ownerDocument, properties.tag, properties), referenceNode);
          else
            this.log(referenceNode.tagName + " has no parent, cannot insert " + properties.tag);
        }
        /**
         * Replace oldNode with a new one.
         * @param properties See {@link ElementProps}
         * @param oldNode The child to be replaced.
         * @returns The replaced Node. This is the same node as oldChild.
         */
        replaceElement(properties, oldNode) {
          if (oldNode.parentNode)
            return oldNode.parentNode.replaceChild(this.createElement(oldNode.ownerDocument, properties.tag, properties), oldNode);
          else
            this.log(oldNode.tagName + " has no parent, cannot replace it with " + properties.tag);
        }
        /**
         * Parse XHTML to XUL fragment. For Zotero 6.
         *
         * To load preferences from a Zotero 7's `.xhtml`, use this method to parse it.
         * @param str xhtml raw text
         * @param entities dtd file list ("chrome://xxx.dtd")
         * @param defaultXUL true for default XUL namespace
         */
        parseXHTMLToFragment(str, entities = [], defaultXUL = true) {
          let parser = this.getDOMParser();
          const xulns = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
          const htmlns = "http://www.w3.org/1999/xhtml";
          const wrappedStr = `${entities.length ? `<!DOCTYPE bindings [ ${entities.reduce((preamble, url, index) => {
            return preamble + `<!ENTITY % _dtd-${index} SYSTEM "${url}"> %_dtd-${index}; `;
          }, "")}]>` : ""}
      <html:div xmlns="${defaultXUL ? xulns : htmlns}"
          xmlns:xul="${xulns}" xmlns:html="${htmlns}">
      ${str}
      </html:div>`;
          this.log(wrappedStr, parser);
          let doc = parser.parseFromString(wrappedStr, "text/xml");
          this.log(doc);
          if (doc.documentElement.localName === "parsererror") {
            throw new Error("not well-formed XHTML");
          }
          let range = doc.createRange();
          range.selectNodeContents(doc.querySelector("div"));
          return range.extractContents();
        }
      };
      exports.UITool = UITool;
      var HTMLElementTagNames = [
        "a",
        "abbr",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "base",
        "bdi",
        "bdo",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "data",
        "datalist",
        "dd",
        "del",
        "details",
        "dfn",
        "dialog",
        "div",
        "dl",
        "dt",
        "em",
        "embed",
        "fieldset",
        "figcaption",
        "figure",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "iframe",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "link",
        "main",
        "map",
        "mark",
        "menu",
        "meta",
        "meter",
        "nav",
        "noscript",
        "object",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "script",
        "section",
        "select",
        "slot",
        "small",
        "source",
        "span",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "title",
        "tr",
        "track",
        "u",
        "ul",
        "var",
        "video",
        "wbr"
      ];
      var XULElementTagNames = [
        "action",
        "arrowscrollbox",
        "bbox",
        "binding",
        "bindings",
        "box",
        "broadcaster",
        "broadcasterset",
        "button",
        "browser",
        "checkbox",
        "caption",
        "colorpicker",
        "column",
        "columns",
        "commandset",
        "command",
        "conditions",
        "content",
        "deck",
        "description",
        "dialog",
        "dialogheader",
        "editor",
        "grid",
        "grippy",
        "groupbox",
        "hbox",
        "iframe",
        "image",
        "key",
        "keyset",
        "label",
        "listbox",
        "listcell",
        "listcol",
        "listcols",
        "listhead",
        "listheader",
        "listitem",
        "member",
        "menu",
        "menubar",
        "menuitem",
        "menulist",
        "menupopup",
        "menuseparator",
        "observes",
        "overlay",
        "page",
        "popup",
        "popupset",
        "preference",
        "preferences",
        "prefpane",
        "prefwindow",
        "progressmeter",
        "radio",
        "radiogroup",
        "resizer",
        "richlistbox",
        "richlistitem",
        "row",
        "rows",
        "rule",
        "script",
        "scrollbar",
        "scrollbox",
        "scrollcorner",
        "separator",
        "spacer",
        "splitter",
        "stack",
        "statusbar",
        "statusbarpanel",
        "stringbundle",
        "stringbundleset",
        "tab",
        "tabbrowser",
        "tabbox",
        "tabpanel",
        "tabpanels",
        "tabs",
        "template",
        "textnode",
        "textbox",
        "titlebar",
        "toolbar",
        "toolbarbutton",
        "toolbargrippy",
        "toolbaritem",
        "toolbarpalette",
        "toolbarseparator",
        "toolbarset",
        "toolbarspacer",
        "toolbarspring",
        "toolbox",
        "tooltip",
        "tree",
        "treecell",
        "treechildren",
        "treecol",
        "treecols",
        "treeitem",
        "treerow",
        "treeseparator",
        "triple",
        "vbox",
        "window",
        "wizard",
        "wizardpage"
      ];
      var SVGElementTagNames = [
        "a",
        "animate",
        "animateMotion",
        "animateTransform",
        "circle",
        "clipPath",
        "defs",
        "desc",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feDropShadow",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "filter",
        "foreignObject",
        "g",
        "image",
        "line",
        "linearGradient",
        "marker",
        "mask",
        "metadata",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "script",
        "set",
        "stop",
        "style",
        "svg",
        "switch",
        "symbol",
        "text",
        "textPath",
        "title",
        "tspan",
        "use",
        "view"
      ];
    }
  });

  // ../zotero-plugin-toolkit/dist/tools/reader.js
  var require_reader = __commonJS({
    "../zotero-plugin-toolkit/dist/tools/reader.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReaderTool = void 0;
      var basic_1 = require_basic2();
      var ReaderTool = class extends basic_1.BasicTool {
        /**
         * Get the selected tab reader.
         * @param waitTime Wait for n MS until the reader is ready
         */
        async getReader(waitTime = 5e3) {
          const Zotero_Tabs2 = this.getGlobal("Zotero_Tabs");
          if (Zotero_Tabs2.selectedType !== "reader") {
            return void 0;
          }
          let reader = Zotero.Reader.getByTabID(Zotero_Tabs2.selectedID);
          let delayCount = 0;
          const checkPeriod = 50;
          while (!reader && delayCount * checkPeriod < waitTime) {
            await Zotero.Promise.delay(checkPeriod);
            reader = Zotero.Reader.getByTabID(Zotero_Tabs2.selectedID);
            delayCount++;
          }
          await (reader === null || reader === void 0 ? void 0 : reader._initPromise);
          return reader;
        }
        /**
         * Get all window readers.
         */
        getWindowReader() {
          const Zotero_Tabs2 = this.getGlobal("Zotero_Tabs");
          let windowReaders = [];
          let tabs = Zotero_Tabs2._tabs.map((e) => e.id);
          for (let i = 0; i < Zotero.Reader._readers.length; i++) {
            let flag = false;
            for (let j = 0; j < tabs.length; j++) {
              if (Zotero.Reader._readers[i].tabID == tabs[j]) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              windowReaders.push(Zotero.Reader._readers[i]);
            }
          }
          return windowReaders;
        }
        /**
         * Get Reader tabpanel deck element.
         * @alpha
         */
        getReaderTabPanelDeck() {
          var _a;
          const deck = (_a = this.getGlobal("window").document.querySelector(".notes-pane-deck")) === null || _a === void 0 ? void 0 : _a.previousElementSibling;
          return deck;
        }
        /**
         * Add a reader tabpanel deck selection change observer.
         * @alpha
         * @param callback
         */
        addReaderTabPanelDeckObserver(callback) {
          const deck = this.getReaderTabPanelDeck();
          const observer = new (this.getGlobal("MutationObserver"))(async (mutations) => {
            mutations.forEach(async (mutation) => {
              const target = mutation.target;
              if (target.classList.contains("zotero-view-tabbox") || target.tagName === "deck") {
                callback();
              }
            });
          });
          observer.observe(deck, {
            attributes: true,
            attributeFilter: ["selectedIndex"],
            subtree: true
          });
          return observer;
        }
        /**
         * Get the text selection of reader.
         * @param currentReader Target reader
         */
        getSelectedText(currentReader) {
          var _a;
          if (!currentReader) {
            return "";
          }
          let textArea = (_a = currentReader._iframeWindow) === null || _a === void 0 ? void 0 : _a.document.querySelectorAll("textarea");
          if (!textArea) {
            return "";
          }
          for (let i = 0; i < textArea.length; i++) {
            if (textArea[i].style.zIndex === "-1" && textArea[i].style["width"] === "0px") {
              return textArea[i].value.replace(/(^\s*)|(\s*$)/g, "");
            }
          }
          return "";
        }
      };
      exports.ReaderTool = ReaderTool;
    }
  });

  // ../zotero-plugin-toolkit/dist/tools/extraField.js
  var require_extraField = __commonJS({
    "../zotero-plugin-toolkit/dist/tools/extraField.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ExtraFieldTool = void 0;
      var basic_1 = require_basic2();
      var ExtraFieldTool = class extends basic_1.BasicTool {
        /**
         * Get all extra fields
         * @param item
         */
        getExtraFields(item, backend = "custom") {
          const extraFiledRaw = item.getField("extra");
          if (backend === "default") {
            return this.getGlobal("Zotero").Utilities.Internal.extractExtraFields(extraFiledRaw).fields;
          } else {
            const map = /* @__PURE__ */ new Map();
            const nonStandardFields = [];
            extraFiledRaw.split("\n").forEach((line) => {
              const split = line.split(": ");
              if (split.length >= 2 && split[0]) {
                map.set(split[0], split.slice(1).join(": "));
              } else {
                nonStandardFields.push(line);
              }
            });
            map.set("__nonStandard__", nonStandardFields.join("\n"));
            return map;
          }
        }
        /**
         * Get extra field value by key. If it does not exists, return undefined.
         * @param item
         * @param key
         */
        getExtraField(item, key) {
          const fields = this.getExtraFields(item);
          return fields.get(key);
        }
        /**
         * Replace extra field of an item.
         * @param item
         * @param fields
         */
        async replaceExtraFields(item, fields) {
          let kvs = [];
          if (fields.has("__nonStandard__")) {
            kvs.push(fields.get("__nonStandard__"));
            fields.delete("__nonStandard__");
          }
          fields.forEach((v, k) => {
            kvs.push(`${k}: ${v}`);
          });
          item.setField("extra", kvs.join("\n"));
          await item.saveTx();
        }
        /**
         * Set an key-value pair to the item's extra field
         * @param item
         * @param key
         * @param value
         */
        async setExtraField(item, key, value) {
          const fields = this.getExtraFields(item);
          fields.set(key, value);
          await this.replaceExtraFields(item, fields);
        }
      };
      exports.ExtraFieldTool = ExtraFieldTool;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/fieldHook.js
  var require_fieldHook = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/fieldHook.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FieldHookManager = void 0;
      var basic_1 = require_basic2();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var FieldHookManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.localCache = [];
          this.initializeGlobal();
        }
        register(type, field, hook) {
          let hooks = this.getHooksFactory(type);
          if (!hooks) {
            return;
          }
          if (field in hooks) {
            this.log(`[WARNING] ${type}.${field} overwrites an existing hook.`);
          }
          hooks[field] = hook;
          this.localCache.push({ type, field });
        }
        unregister(type, field) {
          let hooks = this.getHooksFactory(type);
          if (hooks) {
            delete hooks[field];
          }
          const idx = this.localCache.findIndex(({ type: cacheType }) => cacheType === type);
          if (idx > -1) {
            this.localCache.splice(idx, 1);
          }
        }
        unregisterAll() {
          [...this.localCache].forEach((cache) => {
            this.unregister(cache.type, cache.field);
          });
        }
        getHooksFactory(type) {
          switch (type) {
            case "getField":
              const globalItemTree = toolkitGlobal_1.default.getInstance().itemTree;
              const deprecatedHooks = globalItemTree.fieldHooks;
              if (deprecatedHooks && deprecatedHooks !== this.globalCache.getFieldHooks) {
                Object.assign(this.globalCache.getFieldHooks, deprecatedHooks);
                globalItemTree.fieldHooks = this.globalCache.getFieldHooks;
              }
              return this.globalCache.getFieldHooks;
              break;
            case "setField":
              return this.globalCache.setFieldHooks;
              break;
            case "isFieldOfBase":
              return this.globalCache.isFieldOfBaseHooks;
              break;
            default:
              break;
          }
        }
        initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          const globalCache = this.globalCache = toolkitGlobal_1.default.getInstance().fieldHooks;
          if (!this.globalCache._ready) {
            this.globalCache._ready = true;
            this.patch(Zotero2.Item.prototype, "getField", this.patchSign, (original) => function (field, unformatted, includeBaseMapped) {
              const originalThis = this;
              if (Object.keys(globalCache.getFieldHooks).includes(field)) {
                try {
                  const hook = globalCache.getFieldHooks[field];
                  return hook(field, unformatted, includeBaseMapped, originalThis, original.bind(originalThis));
                } catch (e) {
                  return field + String(e);
                }
              }
              return original.apply(originalThis, arguments);
            });
            this.patch(Zotero2.Item.prototype, "setField", this.patchSign, (original) => function (field, value, loadIn) {
              const originalThis = this;
              if (Object.keys(globalCache.setFieldHooks).includes(field)) {
                try {
                  const hook = globalCache.setFieldHooks[field];
                  return hook(field, value, loadIn, originalThis, original.bind(originalThis));
                } catch (e) {
                  return field + String(e);
                }
              }
              return original.apply(originalThis, arguments);
            });
            this.patch(Zotero2.ItemFields, "isFieldOfBase", this.patchSign, (original) => function (field, baseField) {
              const originalThis = this;
              if (Object.keys(globalCache.isFieldOfBaseHooks).includes(field)) {
                try {
                  const hook = globalCache.isFieldOfBaseHooks[field];
                  return hook(field, baseField, original.bind(originalThis));
                } catch (e) {
                  return false;
                }
              }
              return original.apply(originalThis, arguments);
            });
          }
        }
      };
      exports.FieldHookManager = FieldHookManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/itemTree.js
  var require_itemTree = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/itemTree.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ItemTreeManager = void 0;
      var basic_1 = require_basic2();
      var fieldHook_1 = require_fieldHook();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var ItemTreeManager = class extends basic_1.ManagerTool {
        /**
         * Initialize Zotero._ItemTreeExtraColumnsGlobal if it doesn't exist.
         *
         * New columns and hooks are stored there.
         *
         * Then patch `require("zotero/itemTree").getColumns` and `Zotero.Item.getField`
         */
        constructor(base) {
          super(base);
          this.localColumnCache = [];
          this.localRenderCellCache = [];
          this.fieldHooks = new fieldHook_1.FieldHookManager(base);
          this.initializationLock = this.getGlobal("Zotero").Promise.defer();
          this.initializeGlobal();
        }
        unregisterAll() {
          [...this.localColumnCache].forEach((key) => this.unregister(key, { skipGetField: true }));
          [...this.localRenderCellCache].forEach(this.removeRenderCellHook.bind(this));
          this.fieldHooks.unregisterAll();
        }
        /**
         * Register a new column. Don't forget to call `unregister` on plugin exit.
         * @param key Column dataKey
         * @param label Column display label
         * @param getFieldHook Called when loading cell content.
         * If you registered the getField hook somewhere else (in ItemBox or FieldHooks), leave it undefined.
         * @param options See zotero source code:chrome/content/zotero/itemTreeColumns.jsx
         * @param options.renderCellHook Called when rendering cell. This will override
         *
         * @example
         * ```ts
         * const itemTree = new ItemTreeTool();
         * await itemTree.register(
         *   "test",
         *   "new column",
         *   (
         *     field: string,
         *     unformatted: boolean,
         *     includeBaseMapped: boolean,
         *     item: Zotero.Item
         *   ) => {
         *     return field + String(item.id);
         *   },
         *   {
         *     iconPath: "chrome://zotero/skin/cross.png",
         *   }
         * );
         * ```
         */
        async register(key, label, getFieldHook, options = {}) {
          await this.initializationLock.promise;
          if (this.globalCache.columns.map((_c) => _c.dataKey).includes(key)) {
            this.log(`ItemTreeTool: ${key} is already registered.`);
            return;
          }
          const column = {
            dataKey: key,
            label,
            iconLabel: options.iconPath ? this.createIconLabel({
              iconPath: options.iconPath,
              name: label
            }) : void 0,
            zoteroPersist: options.zoteroPersist || /* @__PURE__ */ new Set(["width", "ordinal", "hidden", "sortActive", "sortDirection"]),
            defaultIn: options.defaultIn,
            disabledIn: options.disabledIn,
            defaultSort: options.defaultSort,
            flex: typeof options.flex === "undefined" ? 1 : options.flex,
            width: options.width,
            fixedWidth: options.fixedWidth,
            staticWidth: options.staticWidth,
            minWidth: options.minWidth,
            ignoreInColumnPicker: options.ignoreInColumnPicker,
            submenu: options.submenu
          };
          if (getFieldHook) {
            this.fieldHooks.register("getField", key, getFieldHook);
          }
          if (options.renderCellHook) {
            await this.addRenderCellHook(key, options.renderCellHook);
          }
          this.globalCache.columns.push(column);
          this.localColumnCache.push(column.dataKey);
          await this.refresh();
        }
        /**
         * Unregister an extra column. Call it on plugin exit.
         * @param key Column dataKey, should be same as the one used in `register`
         * @param options.skipGetField skip unregister of getField hook.
         * This is useful when the hook is not initialized by this instance
         */
        async unregister(key, options = {}) {
          const Zotero2 = this.getGlobal("Zotero");
          await this.initializationLock.promise;
          let persisted = Zotero2.Prefs.get("pane.persist");
          const persistedJSON = JSON.parse(persisted);
          delete persistedJSON[key];
          Zotero2.Prefs.set("pane.persist", JSON.stringify(persistedJSON));
          const idx = this.globalCache.columns.map((_c) => _c.dataKey).indexOf(key);
          if (idx >= 0) {
            this.globalCache.columns.splice(idx, 1);
          }
          if (!options.skipGetField) {
            this.fieldHooks.unregister("getField", key);
          }
          this.removeRenderCellHook(key);
          await this.refresh();
          const localKeyIdx = this.localColumnCache.indexOf(key);
          if (localKeyIdx >= 0) {
            this.localColumnCache.splice(localKeyIdx, 1);
          }
        }
        /**
         * Add a patch hook for `_renderCell`, which is called when cell is rendered.
         *
         * This also works for Zotero's built-in cells.
         * @remarks
         * Don't call it manually unless you understand what you are doing.
         * @param dataKey Cell `dataKey`, e.g. 'title'
         * @param renderCellHook patch hook
         */
        async addRenderCellHook(dataKey, renderCellHook) {
          await this.initializationLock.promise;
          if (dataKey in this.globalCache.renderCellHooks) {
            this.log("[WARNING] ItemTreeTool.addRenderCellHook overwrites an existing hook:", dataKey);
          }
          this.globalCache.renderCellHooks[dataKey] = renderCellHook;
          this.localRenderCellCache.push(dataKey);
        }
        /**
         * Remove a patch hook by `dataKey`.
         */
        async removeRenderCellHook(dataKey) {
          delete this.globalCache.renderCellHooks[dataKey];
          const idx = this.localRenderCellCache.indexOf(dataKey);
          if (idx >= 0) {
            this.localRenderCellCache.splice(idx, 1);
          }
          await this.refresh();
        }
        /**
         * Do initializations. Called in constructor to be async
         */
        async initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          await Zotero2.uiReadyPromise;
          const window2 = this.getGlobal("window");
          const globalCache = this.globalCache = toolkitGlobal_1.default.getInstance().itemTree;
          if (!globalCache._ready) {
            globalCache._ready = true;
            const itemTree = window2.require("zotero/itemTree");
            this.patch(itemTree.prototype, "getColumns", this.patchSign, (original) => function () {
              const columns = original.apply(this, arguments);
              const insertAfter = columns.findIndex((column) => column.dataKey === "title");
              columns.splice(insertAfter + 1, 0, ...globalCache.columns);
              return columns;
            });
            this.patch(itemTree.prototype, "_renderCell", this.patchSign, (original) => function (index, data, column) {
              if (!(column.dataKey in globalCache.renderCellHooks)) {
                return original.apply(this, arguments);
              }
              const hook = globalCache.renderCellHooks[column.dataKey];
              const elem = hook(index, data, column, original.bind(this));
              if (elem.classList.contains("cell")) {
                return elem;
              }
              const span = window2.document.createElementNS("http://www.w3.org/1999/xhtml", "span");
              span.classList.add("cell", column.dataKey, `${column.dataKey}-item-tree-main-default`);
              if (column.fixedWidth) {
                span.classList.add("fixed-width");
              }
              span.appendChild(elem);
              return span;
            });
          }
          this.initializationLock.resolve();
        }
        /**
         * Create a React Icon element
         * @param props
         */
        createIconLabel(props) {
          const _React = window.require("react");
          return _React.createElement("span", null, _React.createElement("img", {
            src: props.iconPath,
            height: "10px",
            width: "9px",
            style: {
              "margin-left": "6px"
            }
          }), " ", props.name);
        }
        /**
         * Refresh itemView. You don't need to call it manually.
         */
        async refresh() {
          var _a, _b;
          await this.initializationLock.promise;
          const ZoteroPane2 = this.getGlobal("ZoteroPane");
          ZoteroPane2.itemsView._columnsId = null;
          const virtualizedTable = (_a = ZoteroPane2.itemsView.tree) === null || _a === void 0 ? void 0 : _a._columns;
          if (!virtualizedTable) {
            this.log("ItemTree is still loading. Refresh skipped.");
            return;
          }
          (_b = document.querySelector(`.${virtualizedTable._styleKey}`)) === null || _b === void 0 ? void 0 : _b.remove();
          await ZoteroPane2.itemsView.refreshAndMaintainSelection();
          ZoteroPane2.itemsView.tree._columns = new virtualizedTable.__proto__.constructor(ZoteroPane2.itemsView.tree);
          await ZoteroPane2.itemsView.refreshAndMaintainSelection();
        }
      };
      exports.ItemTreeManager = ItemTreeManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/prompt.js
  var require_prompt = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/prompt.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PromptManager = exports.Prompt = void 0;
      var basic_1 = require_basic2();
      var basic_2 = require_basic2();
      var ui_1 = require_ui();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var Prompt = class {
        /**
         * Initialize `Prompt` but do not create UI.
         */
        constructor() {
          this.lastInputText = "";
          this.defaultText = {
            placeholder: "Select a command...",
            empty: "No commands found."
          };
          this.maxLineNum = 12;
          this.maxSuggestionNum = 100;
          this.commands = [];
          this.base = new basic_1.BasicTool();
          this.ui = new ui_1.UITool();
          this.document = this.base.getGlobal("document");
          this.initializeUI();
        }
        /**
         * Initialize `Prompt` UI and then bind events on it.
         */
        initializeUI() {
          this.addStyle();
          this.createHTML();
          this.initInputEvents();
          this.registerShortcut();
        }
        createHTML() {
          this.promptNode = this.ui.createElement(this.document, "div", {
            styles: {
              display: "none"
            },
            children: [
              {
                tag: "div",
                styles: {
                  position: "fixed",
                  left: "0",
                  top: "0",
                  backgroundColor: "rgba(220, 220, 220, 0.4)",
                  width: "100%",
                  height: "100%",
                  opacity: "0.5"
                },
                listeners: [
                  {
                    type: "click",
                    listener: () => {
                      this.promptNode.style.display = "none";
                    }
                  }
                ]
              }
            ]
          });
          this.promptNode.appendChild(this.ui.createElement(this.document, "div", {
            id: `zotero-plugin-toolkit-prompt`,
            classList: ["prompt-container"],
            children: [
              {
                tag: "div",
                classList: ["input-container"],
                children: [
                  {
                    tag: "input",
                    classList: ["prompt-input"],
                    attributes: {
                      type: "text",
                      placeholder: this.defaultText.placeholder
                    }
                  },
                  {
                    tag: "div",
                    classList: ["cta"]
                  }
                ]
              },
              {
                tag: "div",
                classList: ["commands-containers"]
              },
              {
                tag: "div",
                classList: ["instructions"],
                children: [
                  {
                    tag: "div",
                    classList: ["instruction"],
                    children: [
                      {
                        tag: "span",
                        classList: ["key"],
                        properties: {
                          innerText: "\u2191\u2193"
                        }
                      },
                      {
                        tag: "span",
                        properties: {
                          innerText: "to navigate"
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    classList: ["instruction"],
                    children: [
                      {
                        tag: "span",
                        classList: ["key"],
                        properties: {
                          innerText: "enter"
                        }
                      },
                      {
                        tag: "span",
                        properties: {
                          innerText: "to trigger"
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    classList: ["instruction"],
                    children: [
                      {
                        tag: "span",
                        classList: ["key"],
                        properties: {
                          innerText: "esc"
                        }
                      },
                      {
                        tag: "span",
                        properties: {
                          innerText: "to exit"
                        }
                      }
                    ]
                  }
                ]
              }
            ]
          }));
          this.inputNode = this.promptNode.querySelector("input");
          this.document.documentElement.appendChild(this.promptNode);
        }
        /**
         * Show commands in a new `commandsContainer`
         * All other `commandsContainer` is hidden
         * @param commands Command[]
         * @param clear remove all `commandsContainer` if true
         */
        showCommands(commands, clear = false) {
          if (clear) {
            this.promptNode.querySelectorAll(".commands-container").forEach((e) => e.remove());
          }
          this.inputNode.placeholder = this.defaultText.placeholder;
          const commandsContainer = this.createCommandsContainer();
          for (let command of commands) {
            if (!command.name || command.when && !command.when()) {
              continue;
            }
            commandsContainer.appendChild(this.createCommandNode(command));
          }
        }
        /**
         * Create a `commandsContainer` div element, append to `commandsContainer` and hide others.
         * @returns commandsNode
         */
        createCommandsContainer() {
          const commandsContainer = this.ui.createElement(this.document, "div", {
            classList: ["commands-container"]
          });
          this.promptNode.querySelectorAll(".commands-container").forEach((e) => {
            e.style.display = "none";
          });
          this.promptNode.querySelector(".commands-containers").appendChild(commandsContainer);
          return commandsContainer;
        }
        /**
         * Return current displayed `commandsContainer`
         * @returns
         */
        getCommandsContainer() {
          return [...this.promptNode.querySelectorAll(".commands-container")].find((e) => {
            return e.style.display != "none";
          });
        }
        /**
         * Create a command item for `Prompt` UI.
         * @param command
         * @returns
         */
        createCommandNode(command) {
          const commandNode = this.ui.createElement(this.document, "div", {
            classList: ["command"],
            children: [
              {
                tag: "div",
                classList: ["content"],
                children: [
                  {
                    tag: "div",
                    classList: ["name"],
                    children: [
                      {
                        tag: "span",
                        properties: {
                          innerText: command.name
                        }
                      }
                    ]
                  },
                  {
                    tag: "div",
                    classList: ["aux"],
                    children: command.label ? [
                      {
                        tag: "span",
                        classList: ["label"],
                        properties: {
                          innerText: command.label
                        }
                      }
                    ] : []
                  }
                ]
              }
            ],
            listeners: [
              {
                type: "mousemove",
                listener: () => {
                  this.selectItem(commandNode);
                }
              },
              {
                type: "click",
                listener: async () => {
                  await this.execCallback(command.callback);
                }
              }
            ]
          });
          commandNode.command = command;
          return commandNode;
        }
        /**
         * Called when `enter` key is pressed.
         */
        trigger() {
          [...this.promptNode.querySelectorAll(".commands-container")].find((e) => e.style.display != "none").querySelector(".selected").click();
        }
        /**
         * Called when `escape` key is pressed.
         */
        exit() {
          this.inputNode.placeholder = this.defaultText.placeholder;
          if (this.promptNode.querySelectorAll(".commands-containers .commands-container").length >= 2) {
            this.promptNode.querySelector(".commands-container:last-child").remove();
            const commandsContainer = this.promptNode.querySelector(".commands-container:last-child");
            commandsContainer.style.display = "";
            commandsContainer.querySelectorAll(".commands").forEach((e) => e.style.display = "flex");
            this.inputNode.focus();
          } else {
            this.promptNode.style.display = "none";
          }
        }
        async execCallback(callback) {
          if (Array.isArray(callback)) {
            this.showCommands(callback);
          } else {
            await callback(this);
          }
        }
        /**
         * Match suggestions for user's entered text.
         */
        async showSuggestions(inputText) {
          var _w = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/, jw = /\s/, Ww = /[\u0F00-\u0FFF\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
          function Yw(e2, t, n, i) {
            if (0 === e2.length)
              return 0;
            var r = 0;
            r -= Math.max(0, e2.length - 1), r -= i / 10;
            var o = e2[0][0];
            return r -= (e2[e2.length - 1][1] - o + 1 - t) / 100, r -= o / 1e3, r -= n / 1e4;
          }
          function $w(e2, t, n, i) {
            if (0 === e2.length)
              return null;
            for (var r = n.toLowerCase(), o = 0, a = 0, s = [], l = 0; l < e2.length; l++) {
              var c = e2[l], u = r.indexOf(c, a);
              if (-1 === u)
                return null;
              var h = n.charAt(u);
              if (u > 0 && !_w.test(h) && !Ww.test(h)) {
                var p = n.charAt(u - 1);
                if (h.toLowerCase() !== h && p.toLowerCase() !== p || h.toUpperCase() !== h && !_w.test(p) && !jw.test(p) && !Ww.test(p))
                  if (i) {
                    if (u !== a) {
                      a += c.length, l--;
                      continue;
                    }
                  } else
                    o += 1;
              }
              if (0 === s.length)
                s.push([u, u + c.length]);
              else {
                var d = s[s.length - 1];
                d[1] < u ? s.push([u, u + c.length]) : d[1] = u + c.length;
              }
              a = u + c.length;
            }
            return {
              matches: s,
              score: Yw(s, t.length, r.length, o)
            };
          }
          function Gw(e2) {
            for (var t = e2.toLowerCase(), n = [], i = 0, r = 0; r < t.length; r++) {
              var o = t.charAt(r);
              jw.test(o) ? (i !== r && n.push(t.substring(i, r)), i = r + 1) : (_w.test(o) || Ww.test(o)) && (i !== r && n.push(t.substring(i, r)), n.push(o), i = r + 1);
            }
            return i !== t.length && n.push(t.substring(i, t.length)), {
              query: e2,
              tokens: n,
              fuzzy: t.split("")
            };
          }
          function Xw(e2, t) {
            if ("" === e2.query)
              return {
                score: 0,
                matches: []
              };
            var n = $w(e2.tokens, e2.query, t, false);
            return n || $w(e2.fuzzy, e2.query, t, true);
          }
          var e = Gw(inputText);
          let container = this.getCommandsContainer();
          if (container.classList.contains("suggestions")) {
            this.exit();
          }
          if (inputText.trim() == "") {
            return true;
          }
          let suggestions = [];
          this.getCommandsContainer().querySelectorAll(".command").forEach((commandNode) => {
            let spanNode = commandNode.querySelector(".name span");
            let spanText = spanNode.innerText;
            let res = Xw(e, spanText);
            if (res) {
              commandNode = this.createCommandNode(commandNode.command);
              let spanHTML = "";
              let i = 0;
              for (let j = 0; j < res.matches.length; j++) {
                let [start, end] = res.matches[j];
                if (start > i) {
                  spanHTML += spanText.slice(i, start);
                }
                spanHTML += `<span class="highlight">${spanText.slice(start, end)}</span>`;
                i = end;
              }
              if (i < spanText.length) {
                spanHTML += spanText.slice(i, spanText.length);
              }
              commandNode.querySelector(".name span").innerHTML = spanHTML;
              suggestions.push({ score: res.score, commandNode });
            }
          });
          if (suggestions.length > 0) {
            suggestions.sort((a, b) => b.score - a.score).slice(this.maxSuggestionNum);
            container = this.createCommandsContainer();
            container.classList.add("suggestions");
            suggestions.forEach((suggestion) => {
              container.appendChild(suggestion.commandNode);
            });
            return true;
          } else {
            const anonymousCommand = this.commands.find((c) => !c.name && (!c.when || c.when()));
            if (anonymousCommand) {
              await this.execCallback(anonymousCommand.callback);
            } else {
              this.showTip(this.defaultText.empty);
            }
            return false;
          }
        }
        /**
         * Bind events of pressing `keydown` and `keyup` key.
         */
        initInputEvents() {
          this.promptNode.addEventListener("keydown", (event) => {
            if (["ArrowUp", "ArrowDown"].indexOf(event.key) != -1) {
              event.preventDefault();
              let selectedIndex;
              let allItems = [
                ...this.getCommandsContainer().querySelectorAll(".command")
              ].filter((e) => e.style.display != "none");
              selectedIndex = allItems.findIndex((e) => e.classList.contains("selected"));
              if (selectedIndex != -1) {
                allItems[selectedIndex].classList.remove("selected");
                selectedIndex += event.key == "ArrowUp" ? -1 : 1;
              } else {
                if (event.key == "ArrowUp") {
                  selectedIndex = allItems.length - 1;
                } else {
                  selectedIndex = 0;
                }
              }
              if (selectedIndex == -1) {
                selectedIndex = allItems.length - 1;
              } else if (selectedIndex == allItems.length) {
                selectedIndex = 0;
              }
              allItems[selectedIndex].classList.add("selected");
              let commandsContainer = this.getCommandsContainer();
              commandsContainer.scrollTo(0, commandsContainer.querySelector(".selected").offsetTop - commandsContainer.offsetHeight + 7.5);
              allItems[selectedIndex].classList.add("selected");
            }
          });
          this.promptNode.addEventListener("keyup", async (event) => {
            if (event.key == "Enter") {
              this.trigger();
            } else if (event.key == "Escape") {
              if (this.inputNode.value.length > 0) {
                this.inputNode.value = "";
              } else {
                this.exit();
              }
            } else if (["ArrowUp", "ArrowDown"].indexOf(event.key) != -1) {
              return;
            }
            const currentInputText = this.inputNode.value;
            if (currentInputText == this.lastInputText) {
              return;
            }
            this.lastInputText = currentInputText;
            window.setTimeout(async () => {
              await this.showSuggestions(currentInputText);
            });
          });
        }
        /**
         * Create a commandsContainer and display a text
         */
        showTip(text) {
          const tipNode = this.ui.createElement(this.document, "div", {
            classList: ["tip"],
            properties: {
              innerText: text
            }
          });
          let container = this.createCommandsContainer();
          container.classList.add("suggestions");
          container.appendChild(tipNode);
          return tipNode;
        }
        /**
         * Mark the selected item with class `selected`.
         * @param item HTMLDivElement
         */
        selectItem(item) {
          this.getCommandsContainer().querySelectorAll(".command").forEach((e) => e.classList.remove("selected"));
          item.classList.add("selected");
        }
        addStyle() {
          const style = this.ui.createElement(this.document, "style", {
            namespace: "html",
            id: "prompt-style"
          });
          style.innerText = `
      .prompt-container * {
        box-sizing: border-box;
      }
      .prompt-container {
        ---radius---: 10px;
        position: fixed;
        left: 25%;
        top: 10%;
        width: 50%;
        border-radius: var(---radius---);
        border: 1px solid #bdbdbd;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: white;
        font-size: 18px;
        box-shadow: 0px 1.8px 7.3px rgba(0, 0, 0, 0.071),
                    0px 6.3px 24.7px rgba(0, 0, 0, 0.112),
                    0px 30px 90px rgba(0, 0, 0, 0.2);
        font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei Light", sans-serif;
      }
      
      /* input */
      .prompt-container .input-container  {
        width: 100%;
      }
      
      .input-container input {
        width: 100%;
        height: 40px;
        padding: 24px;
        border-radius: 50%;
        border: none;
        outline: none;
        font-size: 18px;
      }
      
      .input-container .cta {
        border-bottom: 1px solid #f6f6f6;  
        margin: 5px auto;
      }
      
      /* results */
      .commands-containers {
        width: 100%;
        height: 100%;
      }
      .commands-container {
        max-height: calc(${this.maxLineNum} * 35.5px);
        width: calc(100% - 12px);
        margin-left: 12px;
        margin-right: 0%;
        overflow-y: auto;
        overflow-x: hidden;
      }
      
      .commands-container .command {
        display: flex;
        align-content: baseline;
        justify-content: space-between;
        border-radius: 5px;
        padding: 6px 12px;
        margin-right: 12px;
        margin-top: 2px;
        margin-bottom: 2px;
      }
      .commands-container .command .content {
        display: flex;
        width: 100%;
        justify-content: space-between;
        flex-direction: row;
        overflow: hidden;
      }
      .commands-container .command .content .name {
        white-space: nowrap; 
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .commands-container .command .content .aux {
        display: flex;
        align-items: center;
        align-self: center;
        flex-shrink: 0;
      }
      
      .commands-container .command .content .aux .label {
        font-size: 15px;
        color: #5a5a5a;
        padding: 2px 6px;
        background-color: #fafafa;
        border-radius: 5px;
      }
      
      .commands-container .selected {
          background-color: rgba(0, 0, 0, 0.075);
      }

      .commands-container .highlight {
        font-weight: bold;
      }

      .tip {
        color: #5a5a5a;
        text-align: center;
        padding: 12px 12px;
        font-size: 18px;
      }
      
      .current-value {
        background-color: #a7b8c1;
        color: white;
        border-radius: 5px;
        padding: 0 5px;
        margin-left: 10px;
        font-size: 14px;
        vertical-align: middle;
        letter-spacing: 0.05em;
      }

      /* instructions */
      .instructions {
        display: flex;
        align-content: center;
        justify-content: center;
        font-size: 15px;
        color: rgba(0, 0, 0, 1);
        height: 2.5em;
        width: 100%;
        border-top: 1px solid #f6f6f6;
        margin-top: 5px;
      }
      
      .instructions .instruction {
        margin: auto .5em;  
      }
      
      .instructions .key {
        margin-right: .2em;
        font-weight: 600;
      }
    `;
          this.document.documentElement.appendChild(style);
        }
        registerShortcut() {
          this.document.addEventListener("keydown", (event) => {
            if (event.shiftKey && event.key.toLowerCase() == "p") {
              if (event.originalTarget.isContentEditable || "value" in event.originalTarget || this.commands.length == 0) {
                return;
              }
              event.preventDefault();
              event.stopPropagation();
              if (this.promptNode.style.display == "none") {
                this.promptNode.style.display = "flex";
                if (this.promptNode.querySelectorAll(".commands-container").length == 1) {
                  this.showCommands(this.commands, true);
                }
                this.promptNode.focus();
                this.inputNode.focus();
              } else {
                this.promptNode.style.display = "none";
              }
            }
          }, true);
        }
      };
      exports.Prompt = Prompt;
      var PromptManager = class extends basic_2.ManagerTool {
        constructor(base) {
          super(base);
          this.commands = [];
          const globalCache = toolkitGlobal_1.default.getInstance().prompt;
          if (!globalCache._ready) {
            globalCache._ready = true;
            globalCache.instance = new Prompt();
          }
          this.prompt = globalCache.instance;
        }
        /**
         * Register commands. Don't forget to call `unregister` on plugin exit.
         * @param commands Command[]
         * @example
         * ```ts
         * let getReader = () => {
         *   return BasicTool.getZotero().Reader.getByTabID(
         *     (Zotero.getMainWindow().Zotero_Tabs).selectedID
         *   )
         * }
         *
         * register([
         *   {
         *     name: "Split Horizontally",
         *     label: "Zotero",
         *     when: () => getReader() as boolean,
         *     callback: (prompt: Prompt) => getReader().menuCmd("splitHorizontally")
         *   },
         *   {
         *     name: "Split Vertically",
         *     label: "Zotero",
         *     when: () => getReader() as boolean,
         *     callback: (prompt: Prompt) => getReader().menuCmd("splitVertically")
         *   }
         * ])
         * ```
         */
        register(commands) {
          commands.forEach((c) => {
            var _a;
            return (_a = c.id) !== null && _a !== void 0 ? _a : c.id = c.name;
          });
          this.prompt.commands = [...this.prompt.commands, ...commands];
          this.commands = [...this.commands, ...commands];
          this.prompt.showCommands(this.commands, true);
        }
        /**
         * You can delete a command registed before by its name.
         * @remarks
         * There is a premise here that the names of all commands registered by a single plugin are not duplicated.
         * @param id Command.name
         */
        unregister(id) {
          const command = this.commands.find((c) => c.id == id);
          this.prompt.commands = this.prompt.commands.filter((c) => {
            return JSON.stringify(command) != JSON.stringify(c);
          });
          this.commands = this.commands.filter((c) => c.id != id);
        }
        /**
         * Call `unregisterAll` on plugin exit.
         */
        unregisterAll() {
          this.prompt.commands = this.prompt.commands.filter((c) => {
            return this.commands.find((_c) => {
              JSON.stringify(_c) != JSON.stringify(c);
            });
          });
          this.commands = [];
        }
      };
      exports.PromptManager = PromptManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/libraryTabPanel.js
  var require_libraryTabPanel = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/libraryTabPanel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.LibraryTabPanelManager = void 0;
      var ui_1 = require_ui();
      var basic_1 = require_basic2();
      var LibraryTabPanelManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
          this.libraryTabCache = {
            optionsList: []
          };
        }
        /**
         * Register a tabpanel in library.
         * @remarks
         * If you don't want to remove the tab & panel in runtime, `unregisterLibraryTabPanel` is not a must.
         *
         * The elements wiil be removed by `removeAddonElements`.
         * @param tabLabel Label of panel tab.
         * @param renderPanelHook Called when panel is ready. Add elements to the panel.
         * @param options Other optional parameters.
         * @param options.tabId ID of panel tab. Also used as unregister query. If not set, generate a random one.
         * @param options.panelId ID of panel container (XUL.TabPanel). If not set, generate a random one.
         * @param options.targetIndex Index of the inserted tab. Default the end of tabs.
         * @param options.selectPanel If the panel should be selected immediately.
         * @returns tabId. Use it for unregister.
         * @example
         * Register an extra library tabpanel into index 1.
         * ```ts
         * const libPaneManager = new LibraryTabPanelManager();
         * const libTabId = libPaneManager.registerLibraryTabPanel(
         *   "test",
         *   (panel: XUL.Element, win: Window) => {
         *     const elem = ui.creatElementsFromJSON(
         *       win.document,
         *       {
         *         tag: "vbox",
         *         namespace: "xul",
         *         subElementOptions: [
         *           {
         *             tag: "h2",
         *             directAttributes: {
         *               innerText: "Hello World!",
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: "This is a library tab.",
         *             },
         *           },
         *           {
         *             tag: "button",
         *             directAttributes: {
         *               innerText: "Unregister",
         *             },
         *             listeners: [
         *               {
         *                 type: "click",
         *                 listener: () => {
         *                   ui.unregisterLibraryTabPanel(
         *                     libTabId
         *                   );
         *                 },
         *               },
         *             ],
         *           },
         *         ],
         *       }
         *     );
         *     panel.append(elem);
         *   },
         *   {
         *     targetIndex: 1,
         *   }
         * );
         * ```
         */
        register(tabLabel, renderPanelHook, options) {
          options = options || {
            tabId: void 0,
            panelId: void 0,
            targetIndex: -1,
            selectPanel: false
          };
          const window2 = this.getGlobal("window");
          const tabbox = window2.document.querySelector("#zotero-view-tabbox");
          const randomId = `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          const tabId = options.tabId || `toolkit-readertab-${randomId}`;
          const panelId = options.panelId || `toolkit-readertabpanel-${randomId}`;
          const tab = this.ui.createElement(window2.document, "tab", {
            id: tabId,
            classList: [`toolkit-ui-tabs-${tabId}`],
            attributes: {
              label: tabLabel
            },
            ignoreIfExists: true
          });
          const tabpanel = this.ui.createElement(window2.document, "tabpanel", {
            id: panelId,
            classList: [`toolkit-ui-tabs-${tabId}`],
            ignoreIfExists: true
          });
          const tabs = tabbox.querySelector("tabs");
          const tabpanels = tabbox.querySelector("tabpanels");
          const targetIndex = typeof options.targetIndex === "number" ? options.targetIndex : -1;
          if (targetIndex >= 0) {
            tabs.querySelectorAll("tab")[targetIndex].before(tab);
            tabpanels.querySelectorAll("tabpanel")[targetIndex].before(tabpanel);
          } else {
            tabs.appendChild(tab);
            tabpanels.appendChild(tabpanel);
          }
          if (options.selectPanel) {
            tabbox.selectedTab = tab;
          }
          this.libraryTabCache.optionsList.push({
            tabId,
            tabLabel,
            panelId,
            renderPanelHook,
            targetIndex,
            selectPanel: options.selectPanel
          });
          renderPanelHook(tabpanel, window2);
          return tabId;
        }
        /**
         * Unregister the library tabpanel.
         * @param tabId tab id
         */
        unregister(tabId) {
          const idx = this.libraryTabCache.optionsList.findIndex((v) => v.tabId === tabId);
          if (idx >= 0) {
            this.libraryTabCache.optionsList.splice(idx, 1);
          }
          this.removeTabPanel(tabId);
        }
        /**
         * Unregister all library tabpanel.
         */
        unregisterAll() {
          const tabIds = this.libraryTabCache.optionsList.map((options) => options.tabId);
          tabIds.forEach(this.unregister.bind(this));
        }
        removeTabPanel(tabId) {
          const doc = this.getGlobal("document");
          Array.prototype.forEach.call(doc.querySelectorAll(`.toolkit-ui-tabs-${tabId}`), (e) => {
            e.remove();
          });
        }
      };
      exports.LibraryTabPanelManager = LibraryTabPanelManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/readerTabPanel.js
  var require_readerTabPanel = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/readerTabPanel.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReaderTabPanelManager = void 0;
      var ui_1 = require_ui();
      var reader_1 = require_reader();
      var basic_1 = require_basic2();
      var ReaderTabPanelManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
          this.readerTool = new reader_1.ReaderTool(this);
          this.readerTabCache = {
            optionsList: [],
            observer: void 0,
            initializeLock: void 0
          };
        }
        /**
         * Register a tabpanel for every reader.
         * @remarks
         * Don't forget to call `unregisterReaderTabPanel` on exit.
         * @remarks
         * Every time a tab reader is selected/opened, the hook will be called.
         * @param tabLabel Label of panel tab.
         * @param renderPanelHook Called when panel is ready. Add elements to the panel.
         *
         * The panel might be `undefined` when opening a PDF without parent item.
         *
         * The owner deck is the top container of right-side bar.
         *
         * The readerInstance is the reader of current tabpanel.
         * @param options Other optional parameters.
         * @param options.tabId ID of panel tab. Also used as unregister query. If not set, generate a random one.
         * @param options.panelId ID of panel container (XUL.TabPanel). If not set, generate a random one.
         * @param options.targetIndex Index of the inserted tab. Default the end of tabs.
         * @param options.selectPanel If the panel should be selected immediately.
         * @returns tabId. Use it for unregister.
         * @example
         * Register an extra reader tabpanel into index 1.
         * ```ts
         * const readerTabId = `${config.addonRef}-extra-reader-tab`;
         * this._Addon.toolkit.UI.registerReaderTabPanel(
         *   "test",
         *   (
         *     panel: XUL.Element,
         *     deck: XUL.Deck,
         *     win: Window,
         *     reader: _ZoteroReaderInstance
         *   ) => {
         *     if (!panel) {
         *       this._Addon.toolkit.Tool.log(
         *         "This reader do not have right-side bar. Adding reader tab skipped."
         *       );
         *       return;
         *     }
         *     this._Addon.toolkit.Tool.log(reader);
         *     const elem = this._Addon.toolkit.UI.creatElementsFromJSON(
         *       win.document,
         *       {
         *         tag: "vbox",
         *         id: `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`,
         *         namespace: "xul",
         *         // This is important! Don't create content for multiple times
         *         ignoreIfExists: true,
         *         subElementOptions: [
         *           {
         *             tag: "h2",
         *             directAttributes: {
         *               innerText: "Hello World!",
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: "This is a reader tab.",
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: `Reader: ${reader._title.slice(0, 20)}`,
         *             },
         *           },
         *           {
         *             tag: "label",
         *             namespace: "xul",
         *             directAttributes: {
         *               value: `itemID: ${reader.itemID}.`,
         *             },
         *           },
         *           {
         *             tag: "button",
         *             directAttributes: {
         *               innerText: "Unregister",
         *             },
         *             listeners: [
         *               {
         *                 type: "click",
         *                 listener: () => {
         *                   this._Addon.toolkit.UI.unregisterReaderTabPanel(
         *                     readerTabId
         *                   );
         *                 },
         *               },
         *             ],
         *           },
         *         ],
         *       }
         *     );
         *     panel.append(elem);
         *   },
         *   {
         *     tabId: readerTabId,
         *   }
         * );
         * ```
         */
        async register(tabLabel, renderPanelHook, options) {
          var _a;
          options = options || {
            tabId: void 0,
            panelId: void 0,
            targetIndex: -1,
            selectPanel: false
          };
          if (typeof this.readerTabCache.initializeLock === "undefined") {
            await this.initializeReaderTabObserver();
          }
          await ((_a = this.readerTabCache.initializeLock) === null || _a === void 0 ? void 0 : _a.promise);
          const randomId = `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          const tabId = options.tabId || `toolkit-readertab-${randomId}`;
          const panelId = options.panelId || `toolkit-readertabpanel-${randomId}`;
          const targetIndex = typeof options.targetIndex === "number" ? options.targetIndex : -1;
          this.readerTabCache.optionsList.push({
            tabId,
            tabLabel,
            panelId,
            renderPanelHook,
            targetIndex,
            selectPanel: options.selectPanel
          });
          await this.addReaderTabPanel();
          return tabId;
        }
        /**
         * Unregister the reader tabpanel.
         * @param tabId tab id
         */
        unregister(tabId) {
          var _a;
          const idx = this.readerTabCache.optionsList.findIndex((v) => v.tabId === tabId);
          if (idx >= 0) {
            this.readerTabCache.optionsList.splice(idx, 1);
          }
          if (this.readerTabCache.optionsList.length === 0) {
            (_a = this.readerTabCache.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
            this.readerTabCache = {
              optionsList: [],
              observer: void 0,
              initializeLock: void 0
            };
          }
          this.removeTabPanel(tabId);
        }
        /**
         * Unregister all library tabpanel.
         */
        unregisterAll() {
          const tabIds = this.readerTabCache.optionsList.map((options) => options.tabId);
          tabIds.forEach(this.unregister.bind(this));
        }
        changeTabPanel(tabId, options) {
          const idx = this.readerTabCache.optionsList.findIndex((v) => v.tabId === tabId);
          if (idx >= 0) {
            Object.assign(this.readerTabCache.optionsList[idx], options);
          }
        }
        removeTabPanel(tabId) {
          const doc = this.getGlobal("document");
          Array.prototype.forEach.call(doc.querySelectorAll(`.toolkit-ui-tabs-${tabId}`), (e) => {
            e.remove();
          });
        }
        async initializeReaderTabObserver() {
          this.readerTabCache.initializeLock = this.getGlobal("Zotero").Promise.defer();
          await Promise.all([
            Zotero.initializationPromise,
            Zotero.unlockPromise,
            Zotero.uiReadyPromise
          ]);
          let lock = Zotero.Promise.defer();
          lock.resolve();
          const observer = this.readerTool.addReaderTabPanelDeckObserver(async () => {
            await lock.promise;
            lock = Zotero.Promise.defer();
            try {
              this.addReaderTabPanel();
            } catch (e) {
            }
            lock.resolve();
          });
          this.readerTabCache.observer = observer;
          this.readerTabCache.initializeLock.resolve();
        }
        async addReaderTabPanel() {
          var _a, _b;
          const window2 = this.getGlobal("window");
          const deck = this.readerTool.getReaderTabPanelDeck();
          const reader = await this.readerTool.getReader();
          if (!reader) {
            return;
          }
          if (((_a = deck.selectedPanel) === null || _a === void 0 ? void 0 : _a.children[0].tagName) === "vbox") {
            const container = deck.selectedPanel;
            container.innerHTML = "";
            this.ui.appendElement({
              tag: "tabbox",
              classList: ["zotero-view-tabbox"],
              attributes: {
                flex: "1"
              },
              enableElementRecord: false,
              children: [
                {
                  tag: "tabs",
                  classList: ["zotero-editpane-tabs"],
                  attributes: {
                    orient: "horizontal"
                  },
                  enableElementRecord: false
                },
                {
                  tag: "tabpanels",
                  classList: ["zotero-view-item"],
                  attributes: {
                    flex: "1"
                  },
                  enableElementRecord: false
                }
              ]
            }, container);
          }
          let tabbox = (_b = deck.selectedPanel) === null || _b === void 0 ? void 0 : _b.querySelector("tabbox");
          if (!tabbox) {
            return;
          }
          const tabs = tabbox.querySelector("tabs");
          const tabpanels = tabbox.querySelector("tabpanels");
          this.readerTabCache.optionsList.forEach((options) => {
            const tabId = `${options.tabId}-${reader._instanceID}`;
            const tabClass = `toolkit-ui-tabs-${options.tabId}`;
            if (tabs === null || tabs === void 0 ? void 0 : tabs.querySelector(`.${tabClass}`)) {
              return;
            }
            const tab = this.ui.createElement(window2.document, "tab", {
              id: tabId,
              classList: [tabClass],
              attributes: {
                label: options.tabLabel
              },
              ignoreIfExists: true
            });
            const tabpanel = this.ui.createElement(window2.document, "tabpanel", {
              id: `${options.panelId}-${reader._instanceID}`,
              classList: [tabClass],
              ignoreIfExists: true
            });
            if (options.targetIndex >= 0) {
              tabs === null || tabs === void 0 ? void 0 : tabs.querySelectorAll("tab")[options.targetIndex].before(tab);
              tabpanels === null || tabpanels === void 0 ? void 0 : tabpanels.querySelectorAll("tabpanel")[options.targetIndex].before(tabpanel);
              if (tabbox.getAttribute("toolkit-select-fixed") !== "true") {
                tabbox.tabpanels.addEventListener("select", () => {
                  this.getGlobal("setTimeout")(() => {
                    tabbox.tabpanels.selectedPanel = tabbox.tabs.getRelatedElement(tabbox === null || tabbox === void 0 ? void 0 : tabbox.tabs.selectedItem);
                  }, 0);
                });
                tabbox.setAttribute("toolkit-select-fixed", "true");
              }
            } else {
              tabs === null || tabs === void 0 ? void 0 : tabs.appendChild(tab);
              tabpanels === null || tabpanels === void 0 ? void 0 : tabpanels.appendChild(tabpanel);
            }
            if (options.selectPanel) {
              tabbox.selectedTab = tab;
            }
            options.renderPanelHook(tabpanel, deck, window2, reader);
          });
        }
      };
      exports.ReaderTabPanelManager = ReaderTabPanelManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/menu.js
  var require_menu = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/menu.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.MenuManager = void 0;
      var ui_1 = require_ui();
      var basic_1 = require_basic2();
      var MenuManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
        }
        /**
         * Insert an menu item/menu(with popup)/menuseprator into a menupopup
         * @remarks
         * options:
         * ```ts
         * export interface MenuitemOptions {
         *   tag: "menuitem" | "menu" | "menuseparator";
         *   id?: string;
         *   label?: string;
         *   // data url (chrome://xxx.png) or base64 url (data:image/png;base64,xxx)
         *   icon?: string;
         *   class?: string;
         *   styles?: { [key: string]: string };
         *   hidden?: boolean;
         *   disabled?: boolean;
         *   oncommand?: string;
         *   commandListener?: EventListenerOrEventListenerObject;
         *   // Attributes below are used when type === "menu"
         *   popupId?: string;
         *   onpopupshowing?: string;
         *   subElementOptions?: Array<MenuitemOptions>;
         * }
         * ```
         * @param menuPopup
         * @param options
         * @param insertPosition
         * @param anchorElement The menuitem will be put before/after `anchorElement`. If not set, put at start/end of the menupopup.
         * @example
         * Insert menuitem with icon into item menupopup
         * ```ts
         * // base64 or chrome:// url
         * const menuIcon = "chrome://addontemplate/content/icons/favicon@0.5x.png";
         * ztoolkit.Menu.register("item", {
         *   tag: "menuitem",
         *   id: "zotero-itemmenu-addontemplate-test",
         *   label: "Addon Template: Menuitem",
         *   oncommand: "alert('Hello World! Default Menuitem.')",
         *   icon: menuIcon,
         * });
         * ```
         * @example
         * Insert menu into file menupopup
         * ```ts
         * ztoolkit.Menu.register(
         *   "menuFile",
         *   {
         *     tag: "menu",
         *     label: "Addon Template: Menupopup",
         *     subElementOptions: [
         *       {
         *         tag: "menuitem",
         *         label: "Addon Template",
         *         oncommand: "alert('Hello World! Sub Menuitem.')",
         *       },
         *     ],
         *   },
         *   "before",
         *   Zotero.getMainWindow().document.querySelector(
         *     "#zotero-itemmenu-addontemplate-test"
         *   )
         * );
         * ```
         */
        register(menuPopup, options, insertPosition = "after", anchorElement) {
          let popup;
          if (typeof menuPopup === "string") {
            popup = this.getGlobal("document").querySelector(MenuSelector[menuPopup]);
          } else {
            popup = menuPopup;
          }
          if (!popup) {
            return false;
          }
          const doc = popup.ownerDocument;
          const generateElementOptions = (menuitemOption) => {
            var _a;
            const elementOption = {
              tag: menuitemOption.tag,
              id: menuitemOption.id,
              namespace: "xul",
              attributes: {
                label: menuitemOption.label || "",
                hidden: Boolean(menuitemOption.hidden),
                disaled: Boolean(menuitemOption.disabled),
                class: menuitemOption.class || "",
                oncommand: menuitemOption.oncommand || ""
              },
              classList: menuitemOption.classList,
              styles: menuitemOption.styles || {},
              listeners: [],
              children: []
            };
            if (menuitemOption.icon) {
              elementOption.attributes["class"] += " menuitem-iconic";
              elementOption.styles["list-style-image"] = `url(${menuitemOption.icon})`;
            }
            if (menuitemOption.tag === "menu") {
              elementOption.children.push({
                tag: "menupopup",
                id: menuitemOption.popupId,
                attributes: { onpopupshowing: menuitemOption.onpopupshowing || "" },
                children: (menuitemOption.children || menuitemOption.subElementOptions || []).map(generateElementOptions)
              });
            }
            if (menuitemOption.commandListener) {
              (_a = elementOption.listeners) === null || _a === void 0 ? void 0 : _a.push({
                type: "command",
                listener: menuitemOption.commandListener
              });
            }
            return elementOption;
          };
          const props = generateElementOptions(options);
          const menuItem = this.ui.createElement(doc, options.tag, props);
          if (!anchorElement) {
            anchorElement = insertPosition === "after" ? popup.lastElementChild : popup.firstElementChild;
          }
          anchorElement[insertPosition](menuItem);
          if (options.getVisibility) {
            popup.addEventListener("popupshowing", (ev) => {
              const showing = options.getVisibility(menuItem, ev);
              if (showing) {
                menuItem.removeAttribute("hidden");
              } else {
                menuItem.setAttribute("hidden", "true");
              }
            });
          }
        }
        unregister(menuId) {
          var _a;
          (_a = this.getGlobal("document").querySelector(`#${menuId}`)) === null || _a === void 0 ? void 0 : _a.remove();
        }
        unregisterAll() {
          this.ui.unregisterAll();
        }
      };
      exports.MenuManager = MenuManager;
      var MenuSelector;
      (function (MenuSelector2) {
        MenuSelector2["menuFile"] = "#menu_FilePopup";
        MenuSelector2["menuEdit"] = "#menu_EditPopup";
        MenuSelector2["menuView"] = "#menu_viewPopup";
        MenuSelector2["menuGo"] = "#menu_goPopup";
        MenuSelector2["menuTools"] = "#menu_ToolsPopup";
        MenuSelector2["menuHelp"] = "#menu_HelpPopup";
        MenuSelector2["collection"] = "#zotero-collectionmenu";
        MenuSelector2["item"] = "#zotero-itemmenu";
      })(MenuSelector || (MenuSelector = {}));
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/preferencePane.js
  var require_preferencePane = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/preferencePane.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PreferencePaneManager = void 0;
      var ui_1 = require_ui();
      var basic_1 = require_basic2();
      var PreferencePaneManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.alive = true;
          this.ui = new ui_1.UITool(this);
          this.prefPaneCache = { win: void 0, listeners: {} };
        }
        /**
         * Register a preference pane from an xhtml, for Zotero 6 & 7.
         * @remarks
         * Don't forget to call `unregisterPrefPane` on exit.
         * @remarks
         * options:
         * ```ts
         * export interface PrefPaneOptions {
         *   pluginID: string;
         *   src: string;
         *   id?: string;
         *   parent?: string;
         *   label?: string;
         *   image?: string;
         *   extraDTD?: string[];
         *   scripts?: string[];
         *   defaultXUL?: boolean;
         *   // Only for Zotero 6
         *   onload?: (win: Window) => any;
         * }
         * ```
         *
         * @param options See {@link https://github.com/windingwind/zotero-plugin-toolkit/blob/main/src/options.ts | source code:options.ts}
         * @example
         * ```ts
         * const prefsManager = new PreferencePaneManager();
         * function initPrefs() {
         *   const prefOptions = {
         *     pluginID: addonID,
         *     src: rootURI + "chrome/content/preferences.xhtml",
         *     label: "Template",
         *     image: `chrome://${addonRef}/content/icons/favicon.png`,
         *     extraDTD: [`chrome://${addonRef}/locale/overlay.dtd`],
         *     defaultXUL: true
         *   };
         *   prefsManager.register(prefOptions);
         * };
         *
         * function unInitPrefs() {
         *   prefsManager.unregisterAll();
         * };
         * ```
         * // bootstrap.js:startup
         * initPrefs();
         *
         * // bootstrap.js:shutdown
         * unInitPrefs();
         */
        register(options) {
          if (this.isZotero7()) {
            this.getGlobal("Zotero").PreferencePanes.register(options);
            return;
          }
          const _initImportedNodesPostInsert = (container) => {
            var _a;
            const _observerSymbols = /* @__PURE__ */ new Map();
            const Zotero2 = this.getGlobal("Zotero");
            const window2 = container.ownerGlobal;
            let useChecked = (elem) => elem instanceof window2.HTMLInputElement && elem.type == "checkbox" || elem.tagName == "checkbox";
            let syncFromPref = (elem, preference) => {
              let value = Zotero2.Prefs.get(preference, true);
              if (useChecked(elem)) {
                elem.checked = value;
              } else {
                elem.value = value;
              }
              elem.dispatchEvent(new window2.Event("syncfrompreference"));
            };
            let syncToPrefOnModify = (event) => {
              const targetNode = event.currentTarget;
              if (targetNode === null || targetNode === void 0 ? void 0 : targetNode.getAttribute("preference")) {
                let value = useChecked(targetNode) ? targetNode.checked : targetNode.value;
                Zotero2.Prefs.set(targetNode.getAttribute("preference") || "", value, true);
                targetNode.dispatchEvent(new window2.Event("synctopreference"));
              }
            };
            let attachToPreference = (elem, preference) => {
              Zotero2.debug(`Attaching <${elem.tagName}> element to ${preference}`);
              let symbol = Zotero2.Prefs.registerObserver(preference, () => syncFromPref(elem, preference), true);
              _observerSymbols.set(elem, symbol);
            };
            let detachFromPreference = (elem) => {
              if (_observerSymbols.has(elem)) {
                Zotero2.debug(`Detaching <${elem.tagName}> element from preference`);
                Zotero2.Prefs.unregisterObserver(this._observerSymbols.get(elem));
                _observerSymbols.delete(elem);
              }
            };
            for (let elem of container.querySelectorAll("[preference]")) {
              let preference = elem.getAttribute("preference");
              if (container.querySelector("preferences > preference#" + preference)) {
                this.log("<preference> is deprecated -- `preference` attribute values should be full preference keys, not <preference> IDs");
                preference = (_a = container.querySelector("preferences > preference#" + preference)) === null || _a === void 0 ? void 0 : _a.getAttribute("name");
              }
              attachToPreference(elem, preference);
              elem.addEventListener(this.isXULElement(elem) ? "command" : "input", syncToPrefOnModify);
              window2.setTimeout(() => {
                syncFromPref(elem, preference);
              });
            }
            new window2.MutationObserver((mutations) => {
              for (let mutation of mutations) {
                if (mutation.type == "attributes") {
                  let target = mutation.target;
                  detachFromPreference(target);
                  if (target.hasAttribute("preference")) {
                    attachToPreference(target, target.getAttribute("preference") || "");
                    target.addEventListener(this.isXULElement(target) ? "command" : "input", syncToPrefOnModify);
                  }
                } else if (mutation.type == "childList") {
                  for (let node of mutation.removedNodes) {
                    detachFromPreference(node);
                  }
                  for (let node of mutation.addedNodes) {
                    if (node.nodeType == window2.Node.ELEMENT_NODE && node.hasAttribute("preference")) {
                      attachToPreference(node, node.getAttribute("preference") || "");
                      node.addEventListener(this.isXULElement(node) ? "command" : "input", syncToPrefOnModify);
                    }
                  }
                }
              }
            }).observe(container, {
              childList: true,
              subtree: true,
              attributeFilter: ["preference"]
            });
            for (let elem of container.querySelectorAll("[oncommand]")) {
              elem.oncommand = elem.getAttribute("oncommand");
            }
            for (let child of container.children) {
              child.dispatchEvent(new window2.Event("load"));
            }
          };
          const windowListener = {
            onOpenWindow: (xulWindow) => {
              if (!this.alive) {
                return;
              }
              const win = xulWindow.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
              win.addEventListener("load", async () => {
                var _a;
                if (win.location.href === "chrome://zotero/content/preferences/preferences.xul") {
                  this.log("registerPrefPane:detected", options);
                  const Zotero2 = this.getGlobal("Zotero");
                  options.id || (options.id = `plugin-${Zotero2.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`);
                  const contentOrXHR = await Zotero2.File.getContentsAsync(options.src);
                  const content = typeof contentOrXHR === "string" ? contentOrXHR : contentOrXHR.response;
                  const src = `<prefpane xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" id="${options.id}" insertafter="zotero-prefpane-advanced" label="${options.label || options.pluginID}" image="${options.image || ""}">
                ${content}
                </prefpane>`;
                  const frag = this.ui.parseXHTMLToFragment(src, options.extraDTD, options.defaultXUL);
                  this.log(frag);
                  const prefWindow = win.document.querySelector("prefwindow");
                  prefWindow.appendChild(frag);
                  const prefPane = win.document.querySelector(`#${options.id}`);
                  prefWindow.addPane(prefPane);
                  const contentBox = win.document.getAnonymousNodes(win.document.querySelector(`#${options.id}`))[0];
                  contentBox.style.overflowY = "scroll";
                  contentBox.style.height = "440px";
                  win.sizeToContent();
                  if (contentBox.scrollHeight === contentBox.clientHeight) {
                    contentBox.style.overflowY = "hidden";
                  }
                  this.prefPaneCache.win = win;
                  this.prefPaneCache.listeners[options.id] = windowListener;
                  _initImportedNodesPostInsert(prefPane);
                  if ((_a = options.scripts) === null || _a === void 0 ? void 0 : _a.length) {
                    options.scripts.forEach((script) => Services.scriptloader.loadSubScript(script, win));
                  }
                  if (options.onload) {
                    options.onload(win);
                  }
                }
              }, false);
            }
          };
          Services.wm.addListener(windowListener);
        }
        unregister(id) {
          var _a;
          const idx = Object.keys(this.prefPaneCache.listeners).indexOf(id);
          if (idx < 0) {
            return false;
          }
          const listener = this.prefPaneCache.listeners[id];
          Services.wm.removeListener(listener);
          listener.onOpenWindow = void 0;
          const win = this.prefPaneCache.win;
          if (win && !win.closed) {
            (_a = win.document.querySelector(`#${id}`)) === null || _a === void 0 ? void 0 : _a.remove();
          }
          delete this.prefPaneCache.listeners[id];
          return true;
        }
        /**
         * Unregister all preference panes added with this instance
         *
         * Called on exiting
         */
        unregisterAll() {
          this.alive = false;
          for (const id in this.prefPaneCache.listeners) {
            this.unregister(id);
          }
        }
      };
      exports.PreferencePaneManager = PreferencePaneManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/shortcut.js
  var require_shortcut = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/shortcut.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ShortcutManager = void 0;
      var basic_1 = require_basic2();
      var ui_1 = require_ui();
      var basic_2 = require_basic2();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var ShortcutManager = class extends basic_2.ManagerTool {
        constructor(base) {
          super(base);
          this.ui = new ui_1.UITool(this);
          this.creatorId = `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          this.initializeGlobal();
        }
        register(type, keyOptions) {
          const _keyOptions = keyOptions;
          _keyOptions.type = type;
          switch (_keyOptions.type) {
            case "event":
              this.registerEventKey(_keyOptions);
              return true;
            case "element":
              this.registerElementKey(_keyOptions);
              return true;
            case "prefs":
              this.getGlobal("Zotero").Prefs.set(_keyOptions.id, _keyOptions.key || "");
              return true;
            default:
              try {
                if (_keyOptions.register) {
                  return _keyOptions.register(_keyOptions);
                } else {
                  return false;
                }
              } catch (e) {
                this.log(e);
                return false;
              }
          }
        }
        /**
         * Get all shortcuts(element, event, prefs, builtin)
         */
        getAll() {
          return Array.prototype.concat(this.getMainWindowElementKeys(), this.getEventKeys(), this.getPrefsKeys(), this.getBuiltinKeys());
        }
        /**
         * Check key conflicting of `inputKeyOptions`.
         * @param inputKeyOptions
         * @param options
         * @returns conflicting keys array
         */
        checkKeyConflicting(inputKeyOptions, options = { includeEmpty: false, customKeys: [] }) {
          var _a;
          inputKeyOptions.modifiers = new KeyModifier(inputKeyOptions.modifiers || "").getRaw();
          let allKeys = this.getAll();
          if ((_a = options.customKeys) === null || _a === void 0 ? void 0 : _a.length) {
            allKeys = allKeys.concat(options.customKeys);
          }
          if (!options.includeEmpty) {
            allKeys = allKeys.filter((_keyOptions) => _keyOptions.key);
          }
          return allKeys.filter((_keyOptions) => {
            var _a2, _b;
            return _keyOptions.id !== inputKeyOptions.id && ((_a2 = _keyOptions.key) === null || _a2 === void 0 ? void 0 : _a2.toLowerCase()) === ((_b = inputKeyOptions.key) === null || _b === void 0 ? void 0 : _b.toLowerCase()) && _keyOptions.modifiers === inputKeyOptions.modifiers;
          });
        }
        /**
         * Find all key conflicting.
         * @param options
         * @returns An array of conflicting keys arrays. Same conflicting keys are put together.
         */
        checkAllKeyConflicting(options = { includeEmpty: false, customKeys: [] }) {
          var _a;
          let allKeys = this.getAll();
          if ((_a = options.customKeys) === null || _a === void 0 ? void 0 : _a.length) {
            allKeys = allKeys.concat(options.customKeys);
          }
          if (!options.includeEmpty) {
            allKeys = allKeys.filter((_keyOptions) => _keyOptions.key);
          }
          const conflicting = [];
          while (allKeys.length > 0) {
            const checkKey = allKeys.pop();
            const conflictKeys = allKeys.filter((_keyOptions) => {
              var _a2, _b;
              return ((_a2 = _keyOptions.key) === null || _a2 === void 0 ? void 0 : _a2.toLowerCase()) === ((_b = checkKey.key) === null || _b === void 0 ? void 0 : _b.toLowerCase()) && _keyOptions.modifiers === checkKey.modifiers;
            });
            if (conflictKeys.length) {
              conflictKeys.push(checkKey);
              conflicting.push(conflictKeys);
              const conflictingKeyIds = conflictKeys.map((key) => key.id);
              const toRemoveIds = [];
              allKeys.forEach((key, i) => conflictingKeyIds.includes(key.id) && toRemoveIds.push(i));
              toRemoveIds.sort((a, b) => b - a).forEach((id) => allKeys.splice(id, 1));
            }
          }
          return conflicting;
        }
        /**
         * Unregister a key.
         * @remarks
         * `builtin` keys cannot be unregistered.
         * @param keyOptions
         * @returns `true` for success and `false` for failure.
         */
        async unregister(keyOptions) {
          var _a;
          switch (keyOptions.type) {
            case "element":
              (_a = (keyOptions.xulData.document || this.getGlobal("document")).querySelector(`#${keyOptions.id}`)) === null || _a === void 0 ? void 0 : _a.remove();
              return true;
            case "prefs":
              this.getGlobal("Zotero").Prefs.set(keyOptions.id, "");
              return true;
            case "builtin":
              return false;
            case "event":
              let idx = this.globalCache.eventKeys.findIndex((currentKey) => currentKey.id === keyOptions.id);
              while (idx >= 0) {
                this.globalCache.eventKeys.splice(idx, 1);
                idx = this.globalCache.eventKeys.findIndex((currentKey) => currentKey.id === keyOptions.id);
              }
              return true;
            default:
              try {
                if (keyOptions.unregister) {
                  return await keyOptions.unregister(keyOptions);
                } else {
                  return false;
                }
              } catch (e) {
                this.log(e);
                return false;
              }
          }
        }
        /**
         * Unregister all keys created by this instance.
         */
        unregisterAll() {
          this.ui.unregisterAll();
          this.globalCache.eventKeys.filter((keyOptions) => keyOptions.creatorId === this.creatorId).forEach((keyOptions) => this.unregister(keyOptions));
        }
        initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          const window2 = this.getGlobal("window");
          this.globalCache = toolkitGlobal_1.default.getInstance().shortcut;
          if (!this.globalCache._ready) {
            this.globalCache._ready = true;
            window2.addEventListener("keypress", (event) => {
              let eventMods = [];
              let eventModsWithAccel = [];
              if (event.altKey) {
                eventMods.push("alt");
                eventModsWithAccel.push("alt");
              }
              if (event.shiftKey) {
                eventMods.push("shift");
                eventModsWithAccel.push("shift");
              }
              if (event.metaKey) {
                eventMods.push("meta");
                Zotero2.isMac && eventModsWithAccel.push("accel");
              }
              if (event.ctrlKey) {
                eventMods.push("control");
                !Zotero2.isMac && eventModsWithAccel.push("accel");
              }
              const eventModStr = new KeyModifier(eventMods.join(",")).getRaw();
              const eventModStrWithAccel = new KeyModifier(eventMods.join(",")).getRaw();
              this.globalCache.eventKeys.forEach((keyOptions) => {
                var _a;
                if (keyOptions.disabled) {
                  return;
                }
                const modStr = new KeyModifier(keyOptions.modifiers || "").getRaw();
                if ((modStr === eventModStr || modStr === eventModStrWithAccel) && ((_a = keyOptions.key) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === event.key.toLowerCase()) {
                  keyOptions.callback();
                }
              });
            });
          }
        }
        registerEventKey(keyOptions) {
          keyOptions.creatorId = this.creatorId;
          this.globalCache.eventKeys.push(keyOptions);
        }
        /**
         * Register Element \<commandset\>. In general, use `registerElementKey` or `registerKey`.
         * @param commandSetOptions
         */
        registerElementCommandset(commandSetOptions) {
          var _a;
          (_a = commandSetOptions.document.querySelector("window")) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(commandSetOptions.document, "commandset", {
            id: commandSetOptions.id,
            skipIfExists: true,
            children: commandSetOptions.commands.map((cmd) => ({
              tag: "command",
              id: cmd.id,
              attributes: {
                oncommand: cmd.oncommand,
                disabled: cmd.disabled,
                label: cmd.label
              }
            }))
          }));
        }
        /**
         * Register Element \<command\>. In general, use `registerElementKey` or `registerKey`.
         * @param commandOptions
         */
        registerElementCommand(commandOptions) {
          var _a;
          if (commandOptions._parentId) {
            this.registerElementCommandset({
              id: commandOptions._parentId,
              document: commandOptions.document,
              commands: []
            });
          }
          (_a = commandOptions.document.querySelector(`commandset#${commandOptions._parentId}`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(commandOptions.document, "command", {
            id: commandOptions.id,
            skipIfExists: true,
            attributes: {
              oncommand: commandOptions.oncommand,
              disabled: commandOptions.disabled,
              label: commandOptions.label
            }
          }));
        }
        /**
         * Register Element \<keyset\>. In general, use `registerElementKey` or `registerKey`.
         * @param keySetOptions
         */
        registerElementKeyset(keySetOptions) {
          var _a;
          (_a = keySetOptions.document.querySelector("window")) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(keySetOptions.document, "keyset", {
            id: keySetOptions.id,
            skipIfExists: true,
            children: keySetOptions.keys.map((keyOptions) => ({
              tag: "key",
              id: keyOptions.id,
              attributes: {
                oncommand: keyOptions.xulData.oncommand || "//",
                command: keyOptions.xulData.command,
                modifiers: keyOptions.modifiers,
                key: this.getXULKey(keyOptions.key),
                keycode: this.getXULKeyCode(keyOptions.key),
                disabled: keyOptions.disabled
              }
            }))
          }));
        }
        /**
         * Register a shortcut key element \<key\>.
         * @remarks
         * Provide `_parentId` to register a \<keyset\>;
         *
         * Provide `_commandOptions` to register a \<command\>;
         *
         * Provide `_parentId` in `_commandOptions` to register a \<commandset\>.
         *
         * See examples for more details.
         * @param keyOptions
         * @example
         */
        registerElementKey(keyOptions) {
          var _a;
          const doc = keyOptions.xulData.document || this.getGlobal("document");
          if (keyOptions.xulData._parentId) {
            this.registerElementKeyset({
              id: keyOptions.xulData._parentId,
              document: doc,
              keys: []
            });
          }
          (_a = doc.querySelector(`keyset#${keyOptions.xulData._parentId}`)) === null || _a === void 0 ? void 0 : _a.appendChild(this.ui.createElement(doc, "key", {
            id: keyOptions.id,
            skipIfExists: true,
            attributes: {
              oncommand: keyOptions.xulData.oncommand || "//",
              command: keyOptions.xulData.command,
              modifiers: keyOptions.modifiers,
              key: this.getXULKey(keyOptions.key),
              keycode: this.getXULKeyCode(keyOptions.key),
              disabled: keyOptions.disabled
            }
          }));
          if (keyOptions.xulData._commandOptions) {
            this.registerElementCommand(keyOptions.xulData._commandOptions);
          }
        }
        getXULKey(standardKey) {
          if (standardKey.length === 1) {
            return standardKey;
          }
          return void 0;
        }
        getXULKeyCode(standardKey) {
          const idx = Object.values(XUL_KEYCODE_MAPS).findIndex((value) => value === standardKey);
          if (idx >= 0) {
            return Object.values(XUL_KEYCODE_MAPS)[idx];
          }
          return void 0;
        }
        getStandardKey(XULKey, XULKeyCode) {
          if (XULKeyCode && Object.keys(XUL_KEYCODE_MAPS).includes(XULKeyCode)) {
            return XUL_KEYCODE_MAPS[XULKeyCode];
          } else {
            return XULKey;
          }
        }
        /**
         * Get all \<commandset\> details.
         * @param doc
         */
        getElementCommandSets(doc) {
          return Array.from((doc || this.getGlobal("document")).querySelectorAll("commandset")).map((cmdSet) => ({
            id: cmdSet.id,
            commands: Array.from(cmdSet.querySelectorAll("command")).map((cmd) => ({
              id: cmd.id,
              oncommand: cmd.getAttribute("oncommand"),
              disabled: cmd.getAttribute("disabled") === "true",
              label: cmd.getAttribute("label"),
              _parentId: cmdSet.id
            }))
          }));
        }
        /**
         * Get all \<command\> details.
         * @param doc
         */
        getElementCommands(doc) {
          return Array.prototype.concat(...this.getElementCommandSets(doc).map((cmdSet) => cmdSet.commands));
        }
        /**
         * Get all \<keyset\> details.
         * @param doc
         * @param options
         */
        getElementKeySets(doc) {
          let allCommends = this.getElementCommands(doc);
          return Array.from((doc || this.getGlobal("document")).querySelectorAll("keyset")).map((keysetElem) => ({
            id: keysetElem.id,
            document: doc,
            keys: Array.from(keysetElem.querySelectorAll("key")).map((keyElem) => {
              const oncommand = keyElem.getAttribute("oncommand") || "";
              const commandId = keyElem.getAttribute("command") || "";
              const commandOptions = allCommends.find((cmd) => cmd.id === commandId);
              const key = {
                type: "element",
                id: keyElem.id,
                key: this.getStandardKey(keyElem.getAttribute("key") || "", keyElem.getAttribute("keycode") || ""),
                modifiers: new KeyModifier(keyElem.getAttribute("modifiers") || "").getRaw(),
                disabled: keyElem.getAttribute("disabled") === "true",
                xulData: {
                  document: doc,
                  oncommand,
                  command: commandId,
                  _parentId: keysetElem.id,
                  _commandOptions: commandOptions
                },
                callback: () => {
                  const win = doc.ownerGlobal;
                  const _eval = win.eval;
                  _eval(oncommand);
                  _eval((commandOptions === null || commandOptions === void 0 ? void 0 : commandOptions.oncommand) || "");
                }
              };
              return key;
            })
          }));
        }
        /**
         * Get all \<key\> details.
         * @param doc
         * @param options
         */
        getElementKeys(doc) {
          return Array.prototype.concat(...this.getElementKeySets(doc).map((keyset) => keyset.keys)).filter((elemKey) => !ELEM_KEY_IGNORE.includes(elemKey.id));
        }
        /**
         * Get \<key\> details in main window.
         * @param options
         */
        getMainWindowElementKeys() {
          return this.getElementKeys(this.getGlobal("document"));
        }
        getEventKeys() {
          return this.globalCache.eventKeys;
        }
        /**
         * Get Zotero builtin keys defined in preferences.
         */
        getPrefsKeys() {
          const Zotero2 = this.getGlobal("Zotero");
          return PREF_KEYS.map((pref) => ({
            id: pref.id,
            modifiers: pref.modifiers,
            key: Zotero2.Prefs.get(pref.id),
            callback: pref.callback,
            type: "prefs"
          }));
        }
        /**
         * Get Zotero builtin keys not defined in preferences.
         */
        getBuiltinKeys() {
          return BUILTIN_KEYS.map((builtin) => ({
            id: builtin.id,
            modifiers: builtin.modifiers,
            key: builtin.key,
            callback: builtin.callback,
            type: "builtin"
          }));
        }
      };
      exports.ShortcutManager = ShortcutManager;
      var KeyModifier = class {
        constructor(raw) {
          raw = raw || "";
          this.accel = raw.includes("accel");
          this.shift = raw.includes("shift");
          this.control = raw.includes("control");
          this.meta = raw.includes("meta");
          this.alt = raw.includes("alt");
        }
        equals(newMod) {
          this.accel === newMod.accel;
          this.shift === newMod.shift;
          this.control === newMod.control;
          this.meta === newMod.meta;
          this.alt === newMod.alt;
        }
        getRaw() {
          const enabled = [];
          this.accel && enabled.push("accel");
          this.shift && enabled.push("shift");
          this.control && enabled.push("control");
          this.meta && enabled.push("meta");
          this.alt && enabled.push("alt");
          return enabled.join(",");
        }
      };
      var XUL_KEYCODE_MAPS;
      (function (XUL_KEYCODE_MAPS2) {
        XUL_KEYCODE_MAPS2["VK_CANCEL"] = "Unidentified";
        XUL_KEYCODE_MAPS2["VK_BACK"] = "Backspace";
        XUL_KEYCODE_MAPS2["VK_TAB"] = "Tab";
        XUL_KEYCODE_MAPS2["VK_CLEAR"] = "Clear";
        XUL_KEYCODE_MAPS2["VK_RETURN"] = "Enter";
        XUL_KEYCODE_MAPS2["VK_ENTER"] = "Enter";
        XUL_KEYCODE_MAPS2["VK_SHIFT"] = "Shift";
        XUL_KEYCODE_MAPS2["VK_CONTROL"] = "Control";
        XUL_KEYCODE_MAPS2["VK_ALT"] = "Alt";
        XUL_KEYCODE_MAPS2["VK_PAUSE"] = "Pause";
        XUL_KEYCODE_MAPS2["VK_CAPS_LOCK"] = "CapsLock";
        XUL_KEYCODE_MAPS2["VK_ESCAPE"] = "Escape";
        XUL_KEYCODE_MAPS2["VK_SPACE"] = " ";
        XUL_KEYCODE_MAPS2["VK_PAGE_UP"] = "PageUp";
        XUL_KEYCODE_MAPS2["VK_PAGE_DOWN"] = "PageDown";
        XUL_KEYCODE_MAPS2["VK_END"] = "End";
        XUL_KEYCODE_MAPS2["VK_HOME"] = "Home";
        XUL_KEYCODE_MAPS2["VK_LEFT"] = "ArrowLeft";
        XUL_KEYCODE_MAPS2["VK_UP"] = "ArrowUp";
        XUL_KEYCODE_MAPS2["VK_RIGHT"] = "ArrowRight";
        XUL_KEYCODE_MAPS2["VK_DOWN"] = "ArrowDown";
        XUL_KEYCODE_MAPS2["VK_PRINTSCREEN"] = "PrintScreen";
        XUL_KEYCODE_MAPS2["VK_INSERT"] = "Insert";
        XUL_KEYCODE_MAPS2["VK_DELETE"] = "Backspace";
        XUL_KEYCODE_MAPS2["VK_0"] = "0";
        XUL_KEYCODE_MAPS2["VK_1"] = "1";
        XUL_KEYCODE_MAPS2["VK_2"] = "2";
        XUL_KEYCODE_MAPS2["VK_3"] = "3";
        XUL_KEYCODE_MAPS2["VK_4"] = "4";
        XUL_KEYCODE_MAPS2["VK_5"] = "5";
        XUL_KEYCODE_MAPS2["VK_6"] = "6";
        XUL_KEYCODE_MAPS2["VK_7"] = "7";
        XUL_KEYCODE_MAPS2["VK_8"] = "8";
        XUL_KEYCODE_MAPS2["VK_9"] = "9";
        XUL_KEYCODE_MAPS2["VK_A"] = "A";
        XUL_KEYCODE_MAPS2["VK_B"] = "B";
        XUL_KEYCODE_MAPS2["VK_C"] = "C";
        XUL_KEYCODE_MAPS2["VK_D"] = "D";
        XUL_KEYCODE_MAPS2["VK_E"] = "E";
        XUL_KEYCODE_MAPS2["VK_F"] = "F";
        XUL_KEYCODE_MAPS2["VK_G"] = "G";
        XUL_KEYCODE_MAPS2["VK_H"] = "H";
        XUL_KEYCODE_MAPS2["VK_I"] = "I";
        XUL_KEYCODE_MAPS2["VK_J"] = "J";
        XUL_KEYCODE_MAPS2["VK_K"] = "K";
        XUL_KEYCODE_MAPS2["VK_L"] = "L";
        XUL_KEYCODE_MAPS2["VK_M"] = "M";
        XUL_KEYCODE_MAPS2["VK_N"] = "N";
        XUL_KEYCODE_MAPS2["VK_O"] = "O";
        XUL_KEYCODE_MAPS2["VK_P"] = "P";
        XUL_KEYCODE_MAPS2["VK_Q"] = "Q";
        XUL_KEYCODE_MAPS2["VK_R"] = "R";
        XUL_KEYCODE_MAPS2["VK_S"] = "S";
        XUL_KEYCODE_MAPS2["VK_T"] = "T";
        XUL_KEYCODE_MAPS2["VK_U"] = "U";
        XUL_KEYCODE_MAPS2["VK_V"] = "V";
        XUL_KEYCODE_MAPS2["VK_W"] = "W";
        XUL_KEYCODE_MAPS2["VK_X"] = "X";
        XUL_KEYCODE_MAPS2["VK_Y"] = "Y";
        XUL_KEYCODE_MAPS2["VK_Z"] = "Z";
        XUL_KEYCODE_MAPS2["VK_SEMICOLON"] = "Unidentified";
        XUL_KEYCODE_MAPS2["VK_EQUALS"] = "Unidentified";
        XUL_KEYCODE_MAPS2["VK_NUMPAD0"] = "0";
        XUL_KEYCODE_MAPS2["VK_NUMPAD1"] = "1";
        XUL_KEYCODE_MAPS2["VK_NUMPAD2"] = "2";
        XUL_KEYCODE_MAPS2["VK_NUMPAD3"] = "3";
        XUL_KEYCODE_MAPS2["VK_NUMPAD4"] = "4";
        XUL_KEYCODE_MAPS2["VK_NUMPAD5"] = "5";
        XUL_KEYCODE_MAPS2["VK_NUMPAD6"] = "6";
        XUL_KEYCODE_MAPS2["VK_NUMPAD7"] = "7";
        XUL_KEYCODE_MAPS2["VK_NUMPAD8"] = "8";
        XUL_KEYCODE_MAPS2["VK_NUMPAD9"] = "9";
        XUL_KEYCODE_MAPS2["VK_MULTIPLY"] = "Multiply";
        XUL_KEYCODE_MAPS2["VK_ADD"] = "Add";
        XUL_KEYCODE_MAPS2["VK_SEPARATOR"] = "Separator";
        XUL_KEYCODE_MAPS2["VK_SUBTRACT"] = "Subtract";
        XUL_KEYCODE_MAPS2["VK_DECIMAL"] = "Decimal";
        XUL_KEYCODE_MAPS2["VK_DIVIDE"] = "Divide";
        XUL_KEYCODE_MAPS2["VK_F1"] = "F1";
        XUL_KEYCODE_MAPS2["VK_F2"] = "F2";
        XUL_KEYCODE_MAPS2["VK_F3"] = "F3";
        XUL_KEYCODE_MAPS2["VK_F4"] = "F4";
        XUL_KEYCODE_MAPS2["VK_F5"] = "F5";
        XUL_KEYCODE_MAPS2["VK_F6"] = "F6";
        XUL_KEYCODE_MAPS2["VK_F7"] = "F7";
        XUL_KEYCODE_MAPS2["VK_F8"] = "F8";
        XUL_KEYCODE_MAPS2["VK_F9"] = "F9";
        XUL_KEYCODE_MAPS2["VK_F10"] = "F10";
        XUL_KEYCODE_MAPS2["VK_F11"] = "F11";
        XUL_KEYCODE_MAPS2["VK_F12"] = "F12";
        XUL_KEYCODE_MAPS2["VK_F13"] = "F13";
        XUL_KEYCODE_MAPS2["VK_F14"] = "F14";
        XUL_KEYCODE_MAPS2["VK_F15"] = "F15";
        XUL_KEYCODE_MAPS2["VK_F16"] = "F16";
        XUL_KEYCODE_MAPS2["VK_F17"] = "F17";
        XUL_KEYCODE_MAPS2["VK_F18"] = "F18";
        XUL_KEYCODE_MAPS2["VK_F19"] = "F19";
        XUL_KEYCODE_MAPS2["VK_F20"] = "F20";
        XUL_KEYCODE_MAPS2["VK_F21"] = "Soft1";
        XUL_KEYCODE_MAPS2["VK_F22"] = "Soft2";
        XUL_KEYCODE_MAPS2["VK_F23"] = "Soft3";
        XUL_KEYCODE_MAPS2["VK_F24"] = "Soft4";
        XUL_KEYCODE_MAPS2["VK_NUM_LOCK"] = "NumLock";
        XUL_KEYCODE_MAPS2["VK_SCROLL_LOCK"] = "ScrollLock";
        XUL_KEYCODE_MAPS2["VK_COMMA"] = ",";
        XUL_KEYCODE_MAPS2["VK_PERIOD"] = ".";
        XUL_KEYCODE_MAPS2["VK_SLASH"] = "Divide";
        XUL_KEYCODE_MAPS2["VK_BACK_QUOTE"] = "`";
        XUL_KEYCODE_MAPS2["VK_OPEN_BRACKET"] = "[";
        XUL_KEYCODE_MAPS2["VK_CLOSE_BRACKET"] = "]";
        XUL_KEYCODE_MAPS2["VK_QUOTE"] = "\\";
        XUL_KEYCODE_MAPS2["VK_HELP"] = "Help";
      })(XUL_KEYCODE_MAPS || (XUL_KEYCODE_MAPS = {}));
      function getElementKeyCallback(keyId) {
        return function () {
          var _a;
          const win = basic_1.BasicTool.getZotero().getMainWindow();
          const keyElem = win.document.querySelector(`#${keyId}`);
          if (!keyElem) {
            return function () {
            };
          }
          const _eval = win.eval;
          _eval(keyElem.getAttribute("oncommand") || "//");
          const cmdId = keyElem.getAttribute("command");
          if (!cmdId) {
            return;
          }
          _eval(((_a = win.document.querySelector(`#${cmdId}`)) === null || _a === void 0 ? void 0 : _a.getAttribute("oncommand")) || "//");
        };
      }
      function getBuiltinEventKeyCallback(eventId) {
        return function () {
          const Zotero2 = basic_1.BasicTool.getZotero();
          const ZoteroPane2 = Zotero2.getActiveZoteroPane();
          ZoteroPane2.handleKeyPress({
            metaKey: true,
            ctrlKey: true,
            shiftKey: true,
            originalTarget: { id: "" },
            preventDefault: () => {
            },
            key: Zotero2.Prefs.get(`extensions.zotero.keys.${eventId}`, true)
          });
        };
      }
      var ELEM_KEY_IGNORE = ["key_copyCitation", "key_copyBibliography"];
      var PREF_KEYS = [
        {
          id: "extensions.zotero.keys.copySelectedItemCitationsToClipboard",
          modifiers: "accel,shift",
          elemId: "key_copyCitation",
          callback: getElementKeyCallback("key_copyCitation")
        },
        {
          id: "extensions.zotero.keys.copySelectedItemsToClipboard",
          modifiers: "accel,shift",
          elemId: "key_copyBibliography",
          callback: getElementKeyCallback("key_copyBibliography")
        },
        {
          id: "extensions.zotero.keys.library",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("library")
        },
        {
          id: "extensions.zotero.keys.newItem",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("newItem")
        },
        {
          id: "extensions.zotero.keys.newNote",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("newNote")
        },
        {
          id: "extensions.zotero.keys.quicksearch",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("quicksearch")
        },
        {
          id: "extensions.zotero.keys.saveToZotero",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("saveToZotero")
        },
        {
          id: "extensions.zotero.keys.sync",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("sync")
        },
        {
          id: "extensions.zotero.keys.toggleAllRead",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("toggleAllRead")
        },
        {
          id: "extensions.zotero.keys.toggleRead",
          modifiers: "accel,shift",
          callback: getBuiltinEventKeyCallback("toggleRead")
        }
      ];
      var BUILTIN_KEYS = [
        {
          id: "showItemCollection",
          modifiers: "",
          key: "Ctrl",
          callback: () => {
            const Zotero2 = basic_1.BasicTool.getZotero();
            const ZoteroPane2 = Zotero2.getActiveZoteroPane();
            ZoteroPane2.handleKeyUp({
              originalTarget: { id: ZoteroPane2.itemsView.id },
              keyCode: Zotero2.isWin ? 17 : 18
            });
          }
        },
        {
          id: "closeSelectedTab",
          modifiers: "accel",
          key: "W",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            if (ztabs.selectedIndex > 0) {
              ztabs.close("");
            }
          }
        },
        {
          id: "undoCloseTab",
          modifiers: "accel,shift",
          key: "T",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.undoClose();
          }
        },
        {
          id: "selectNextTab",
          modifiers: "control",
          key: "Tab",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.selectPrev();
          }
        },
        {
          id: "selectPreviousTab",
          modifiers: "control,shift",
          key: "Tab",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.selectNext();
          }
        },
        {
          id: "selectTab1",
          modifiers: "accel",
          key: "1",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(0);
          }
        },
        {
          id: "selectTab2",
          modifiers: "accel",
          key: "2",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(1);
          }
        },
        {
          id: "selectTab3",
          modifiers: "accel",
          key: "3",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(2);
          }
        },
        {
          id: "selectTab4",
          modifiers: "accel",
          key: "4",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(3);
          }
        },
        {
          id: "selectTab5",
          modifiers: "accel",
          key: "5",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(4);
          }
        },
        {
          id: "selectTab6",
          modifiers: "accel",
          key: "6",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(5);
          }
        },
        {
          id: "selectTab7",
          modifiers: "accel",
          key: "7",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(6);
          }
        },
        {
          id: "selectTab8",
          modifiers: "accel",
          key: "8",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.jump(7);
          }
        },
        {
          id: "selectTabLast",
          modifiers: "accel",
          key: "9",
          callback: () => {
            const ztabs = basic_1.BasicTool.getZotero().getMainWindow().Zotero_Tabs;
            ztabs.selectLast();
          }
        }
      ];
    }
  });

  // ../zotero-plugin-toolkit/dist/helpers/clipboard.js
  var require_clipboard = __commonJS({
    "../zotero-plugin-toolkit/dist/helpers/clipboard.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ClipboardHelper = void 0;
      var basic_1 = require_basic2();
      var ClipboardHelper = class {
        constructor() {
          this.transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
          this.clipboardService = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
          this.transferable.init(null);
        }
        addText(source, type) {
          const str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
          str.data = source;
          this.transferable.addDataFlavor(type);
          this.transferable.setTransferData(type, str, source.length * 2);
          return this;
        }
        addImage(source) {
          let parts = source.split(",");
          if (!parts[0].includes("base64")) {
            return this;
          }
          const basicTool2 = new basic_1.BasicTool();
          let mime = parts[0].match(/:(.*?);/)[1];
          let bstr = basicTool2.getGlobal("window").atob(parts[1]);
          let n = bstr.length;
          let u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          let imgTools = Components.classes["@mozilla.org/image/tools;1"].getService(Components.interfaces.imgITools);
          let mimeType;
          let img;
          if (basicTool2.getGlobal("Zotero").platformMajorVersion >= 102) {
            img = imgTools.decodeImageFromArrayBuffer(u8arr.buffer, mime);
            mimeType = "application/x-moz-nativeimage";
          } else {
            mimeType = `image/png`;
            img = Components.classes["@mozilla.org/supports-interface-pointer;1"].createInstance(Components.interfaces.nsISupportsInterfacePointer);
            img.data = imgTools.decodeImageFromArrayBuffer(u8arr.buffer, mimeType);
          }
          this.transferable.addDataFlavor(mimeType);
          this.transferable.setTransferData(mimeType, img, 0);
          return this;
        }
        copy() {
          this.clipboardService.setData(this.transferable, null, Components.interfaces.nsIClipboard.kGlobalClipboard);
          return this;
        }
      };
      exports.ClipboardHelper = ClipboardHelper;
    }
  });

  // ../zotero-plugin-toolkit/dist/helpers/filePicker.js
  var require_filePicker = __commonJS({
    "../zotero-plugin-toolkit/dist/helpers/filePicker.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.FilePickerHelper = void 0;
      var basic_1 = require_basic2();
      var FilePickerHelper = class {
        constructor(title, mode, filters, suggestion, window2, filterMask) {
          this.title = title;
          this.mode = mode;
          this.filters = filters;
          this.suggestion = suggestion;
          this.window = window2;
          this.filterMask = filterMask;
        }
        async open() {
          const basicTool2 = new basic_1.BasicTool();
          const backend = basicTool2.getGlobal("require")("zotero/modules/filePicker").default;
          const fp = new backend();
          fp.init(this.window || basicTool2.getGlobal("window"), this.title, this.getMode(fp));
          for (const [label, ext] of this.filters || []) {
            fp.appendFilter(label, ext);
          }
          if (this.filterMask)
            fp.appendFilters(this.getFilterMask(fp));
          if (this.suggestion)
            fp.defaultString = this.suggestion;
          const userChoice = await fp.show();
          switch (userChoice) {
            case fp.returnOK:
            case fp.returnReplace:
              return fp.file;
            default:
              return false;
          }
        }
        getMode(fp) {
          switch (this.mode) {
            case "open":
              return fp.modeOpen;
            case "save":
              return fp.modeSave;
            case "folder":
              return fp.modeGetFolder;
            case "multiple":
              return fp.modeOpenMultiple;
            default:
              return 0;
          }
        }
        getFilterMask(fp) {
          switch (this.filterMask) {
            case "all":
              return fp.filterAll;
            case "html":
              return fp.filterHTML;
            case "text":
              return fp.filterText;
            case "images":
              return fp.filterImages;
            case "xml":
              return fp.filterXML;
            case "apps":
              return fp.filterApps;
            case "urls":
              return fp.filterAllowURLs;
            case "audio":
              return fp.filterAudio;
            case "video":
              return fp.filterVideo;
            default:
              return 1;
          }
        }
      };
      exports.FilePickerHelper = FilePickerHelper;
    }
  });

  // ../zotero-plugin-toolkit/dist/helpers/progressWindow.js
  var require_progressWindow = __commonJS({
    "../zotero-plugin-toolkit/dist/helpers/progressWindow.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ProgressWindowHelper = void 0;
      var basic_1 = require_basic2();
      var ProgressWindowHelper = class extends Zotero.ProgressWindow {
        /**
         *
         * @param header window header
         * @param options
         */
        constructor(header, options = {
          closeOnClick: true
        }) {
          super(options);
          this.lines = [];
          this.closeTime = options.closeTime || 2000;
          this.changeHeadline(header);
          this.originalShow = this.show;
          this.show = this.showWithTimer;
          if (options.closeOtherProgressWindows) {
            basic_1.BasicTool.getZotero().ProgressWindowSet.closeAll();
          }
        }
        /**
         * Create a new line of progress or test
         * @param options
         */
        createLine(options) {
          const icon = this.getIcon(options.type, options.icon);
          const line = new this.ItemProgress(icon || "", options.text || "");
          if (typeof options.progress === "number") {
            line.setProgress(options.progress);
          }
          this.lines.push(line);
          return this;
        }
        showText(options) {
          this.addDescription(options.text);
          return this;
        }
        /**
         * Change the line content
         * @param options
         */
        changeLine(options) {
          var _a;
          if (((_a = this.lines) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return this;
          }
          const idx = typeof options.idx !== "undefined" && options.idx >= 0 && options.idx < this.lines.length ? options.idx : 0;
          const icon = this.getIcon(options.type, options.icon);
          options.text && this.lines[idx].setText(options.text);
          icon && this.lines[idx].setIcon(icon);
          typeof options.progress === "number" && this.lines[idx].setProgress(options.progress);
          return this;
        }
        showWithTimer(closeTime = void 0) {
          this.originalShow();
          typeof closeTime !== "undefined" && (this.closeTime = closeTime);
          if (this.closeTime && this.closeTime > 0) {
            this.startCloseTimer(this.closeTime);
          }
          return this;
        }
        /**
         * Set custom icon uri for progress window
         * @param key
         * @param uri
         */
        static setIconURI(key, uri) {
          icons[key] = uri;
        }
        getIcon(type, defaultIcon) {
          return type && type in icons ? icons[type] : defaultIcon;
        }
      };
      exports.ProgressWindowHelper = ProgressWindowHelper;
      var icons = {
        success: "chrome://zotero/skin/tick.png",
        fail: "chrome://zotero/skin/cross.png"
      };
    }
  });

  // ../zotero-plugin-toolkit/dist/helpers/virtualizedTable.js
  var require_virtualizedTable = __commonJS({
    "../zotero-plugin-toolkit/dist/helpers/virtualizedTable.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.VirtualizedTableHelper = void 0;
      var basic_1 = require_basic2();
      var VirtualizedTableHelper = class {
        constructor(win) {
          this.window = win;
          this.basicTool = new basic_1.BasicTool();
          const Zotero2 = this.basicTool.getGlobal("Zotero");
          const _require = win.require;
          this.React = _require("react");
          this.ReactDOM = _require("react-dom");
          this.VirtualizedTable = _require("components/virtualized-table");
          this.IntlProvider = _require("react-intl").IntlProvider;
          this.props = {
            id: `${Zotero2.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`,
            getRowCount: () => 0
          };
          this.localeStrings = Zotero2.Intl.strings;
        }
        setProp(...args) {
          if (args.length === 1) {
            Object.assign(this.props, args[0]);
          } else if (args.length === 2) {
            this.props[args[0]] = args[1];
          }
          return this;
        }
        /**
         * Set locale strings, which replaces the table header's label if matches. Default it's `Zotero.Intl.strings`
         * @param localeStrings
         */
        setLocale(localeStrings) {
          Object.assign(this.localeStrings, localeStrings);
          return this;
        }
        /**
         * Set container element id that the table will be rendered on.
         * @param id element id
         */
        setContainerId(id) {
          this.containerId = id;
          return this;
        }
        /**
         * Render the table.
         * @param selectId Which row to select after rendering
         * @param onfulfilled callback after successfully rendered
         * @param onrejected callback after rendering with error
         */
        render(selectId, onfulfilled, onrejected) {
          const refreshSelection = () => {
            this.treeInstance.invalidate();
            if (typeof selectId !== "undefined" && selectId >= 0) {
              this.treeInstance.selection.select(selectId);
            } else {
              this.treeInstance.selection.clearSelection();
            }
          };
          if (!this.treeInstance) {
            const vtableProps = Object.assign({}, this.props, {
              ref: (ref) => this.treeInstance = ref
            });
            if (vtableProps.getRowData && !vtableProps.renderItem) {
              Object.assign(vtableProps, {
                renderItem: this.VirtualizedTable.makeRowRenderer(vtableProps.getRowData)
              });
            }
            const elem = this.React.createElement(this.IntlProvider, { locale: Zotero.locale, messages: Zotero.Intl.strings }, this.React.createElement(this.VirtualizedTable, vtableProps));
            const container = this.window.document.getElementById(this.containerId);
            new Promise((resolve) => this.ReactDOM.render(elem, container, resolve)).then(() => {
              this.basicTool.getGlobal("setTimeout")(() => {
                refreshSelection();
              });
            }).then(onfulfilled, onrejected);
          } else {
            refreshSelection();
          }
          return this;
        }
      };
      exports.VirtualizedTableHelper = VirtualizedTableHelper;
    }
  });

  // ../zotero-plugin-toolkit/dist/helpers/dialog.js
  var require_dialog = __commonJS({
    "../zotero-plugin-toolkit/dist/helpers/dialog.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.DialogHelper = void 0;
      var ui_1 = require_ui();
      var DialogHelper = class {
        /**
         * Create a dialog helper with row \* column grids.
         * @param row
         * @param column
         */
        constructor(row, column) {
          if (row <= 0 || column <= 0) {
            throw Error(`row and column must be positive integers.`);
          }
          this.elementProps = {
            tag: "vbox",
            attributes: { flex: 1 },
            styles: {
              width: "100%",
              height: "100%"
            },
            children: []
          };
          for (let i = 0; i < Math.max(row, 1); i++) {
            this.elementProps.children.push({
              tag: "hbox",
              attributes: { flex: 1 },
              children: []
            });
            for (let j = 0; j < Math.max(column, 1); j++) {
              this.elementProps.children[i].children.push({
                tag: "vbox",
                attributes: { flex: 1 },
                children: []
              });
            }
          }
          this.elementProps.children.push({
            tag: "hbox",
            attributes: { flex: 0, pack: "end" },
            children: []
          });
          this.dialogData = {};
        }
        /**
         * Add a cell at (row, column). Index starts from 0.
         * @param row
         * @param column
         * @param elementProps Cell element props. See {@link ElementProps}
         * @param cellFlex If the cell is flex. Default true.
         */
        addCell(row, column, elementProps, cellFlex = true) {
          if (row >= this.elementProps.children.length || column >= this.elementProps.children[row].children.length) {
            throw Error(`Cell index (${row}, ${column}) is invalid, maximum (${this.elementProps.children.length}, ${this.elementProps.children[0].children.length})`);
          }
          this.elementProps.children[row].children[column].children = [
            elementProps
          ];
          this.elementProps.children[row].children[column].attributes.flex = cellFlex ? 1 : 0;
          return this;
        }
        /**
         * Add a control button to the bottom of the dialog.
         * @param label Button label
         * @param id Button id.
         * The corresponding id of the last button user clicks before window exit will be set to `dialogData._lastButtonId`.
         * @param options.noClose Don't close window when clicking this button.
         * @param options.callback Callback of button click event.
         */
        addButton(label, id, options = {}) {
          id = id || `${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`;
          this.elementProps.children[this.elementProps.children.length - 1].children.push({
            tag: "vbox",
            styles: {
              margin: "10px"
            },
            children: [
              {
                tag: "button",
                namespace: "html",
                id,
                attributes: {
                  type: "button"
                },
                listeners: [
                  {
                    type: "click",
                    listener: (e) => {
                      this.dialogData._lastButtonId = id;
                      if (options.callback) {
                        options.callback(e);
                      }
                      if (!options.noClose) {
                        this.window.close();
                      }
                    }
                  }
                ],
                children: [
                  {
                    tag: "div",
                    styles: {
                      padding: "2.5px 15px"
                    },
                    properties: {
                      innerHTML: label
                    }
                  }
                ]
              }
            ]
          });
          return this;
        }
        /**
         * Dialog data.
         * @remarks
         * This object is passed to the dialog window.
         *
         * The control button id is in `dialogData._lastButtonId`;
         *
         * The data-binding values are in `dialogData`.
         * ```ts
         * interface DialogData {
         *   [key: string | number | symbol]: any;
         *   loadLock?: _ZoteroTypes.PromiseObject; // resolve after window load (auto-generated)
         *   loadCallback?: Function; // called after window load
         *   unloadLock?: _ZoteroTypes.PromiseObject; // resolve after window unload (auto-generated)
         *   unloadCallback?: Function; // called after window unload
         *   beforeUnloadCallback?: Function; // called before window unload when elements are accessable.
         * }
         * ```
         * @param dialogData
         */
        setDialogData(dialogData) {
          this.dialogData = dialogData;
          return this;
        }
        /**
         * Open the dialog
         * @param title Window title
         * @param windowFeatures.width Ignored if fitContent is `true`.
         * @param windowFeatures.height Ignored if fitContent is `true`.
         * @param windowFeatures.left
         * @param windowFeatures.top
         * @param windowFeatures.centerscreen Open window at the center of screen.
         * @param windowFeatures.resizable If window is resizable.
         * @param windowFeatures.fitContent Resize the window to content size after elements are loaded.
         * @param windowFeatures.noDialogMode Dialog mode window only has a close button. Set `true` to make maximize and minimize button visible.
         * @param windowFeatures.alwaysRaised Is the window always at the top.
         */
        open(title, windowFeatures = {
          centerscreen: true,
          resizable: true,
          fitContent: true
        }) {
          this.window = openDialog(`${Zotero.Utilities.randomString()}-${(/* @__PURE__ */ new Date()).getTime()}`, title, this.elementProps, this.dialogData, windowFeatures);
          return this;
        }
      };
      exports.DialogHelper = DialogHelper;
      function openDialog(targetId, title, elementProps, dialogData, windowFeatures = {
        centerscreen: true,
        resizable: true,
        fitContent: true
      }) {
        var _a, _b;
        const uiTool = new ui_1.UITool();
        uiTool.basicOptions.ui.enableElementJSONLog = false;
        uiTool.basicOptions.ui.enableElementRecord = false;
        const Zotero2 = uiTool.getGlobal("Zotero");
        dialogData = dialogData || {};
        if (!dialogData.loadLock) {
          dialogData.loadLock = Zotero2.Promise.defer();
        }
        if (!dialogData.unloadLock) {
          dialogData.unloadLock = Zotero2.Promise.defer();
        }
        let featureString = `resizable=${windowFeatures.resizable ? "yes" : "no"},`;
        if (windowFeatures.width || windowFeatures.height) {
          featureString += `width=${windowFeatures.width || 100},height=${windowFeatures.height || 100},`;
        }
        if (windowFeatures.left) {
          featureString += `left=${windowFeatures.left},`;
        }
        if (windowFeatures.top) {
          featureString += `top=${windowFeatures.top},`;
        }
        if (windowFeatures.centerscreen) {
          featureString += "centerscreen,";
        }
        if (windowFeatures.noDialogMode) {
          featureString += "dialog=no,";
        }
        if (windowFeatures.alwaysRaised) {
          featureString += "alwaysRaised=yes,";
        }
        const win = uiTool.getGlobal("openDialog")("about:blank", targetId || "_blank", featureString, dialogData);
        dialogData.loadLock.promise.then(() => {
          win.document.head.appendChild(uiTool.createElement(win.document, "title", {
            properties: { innerText: title }
          }));
          win.document.head.appendChild(uiTool.createElement(win.document, "style", {
            properties: {
              innerHTML: style
            }
          }));
          replaceElement(elementProps, uiTool);
          win.document.body.appendChild(uiTool.createElement(win.document, "fragment", {
            children: [elementProps]
          }));
          Array.from(win.document.querySelectorAll("*[data-bind]")).forEach((elem) => {
            const bindKey = elem.getAttribute("data-bind");
            const bindAttr = elem.getAttribute("data-attr");
            const bindProp = elem.getAttribute("data-prop");
            if (bindKey && dialogData && dialogData[bindKey]) {
              if (bindProp) {
                elem[bindProp] = dialogData[bindKey];
              } else {
                elem.setAttribute(bindAttr || "value", dialogData[bindKey]);
              }
            }
          });
          if (windowFeatures.fitContent) {
            win.sizeToContent();
          }
          win.focus();
        }).then(() => {
          (dialogData === null || dialogData === void 0 ? void 0 : dialogData.loadCallback) && dialogData.loadCallback();
        });
        dialogData.unloadLock.promise.then(() => {
          (dialogData === null || dialogData === void 0 ? void 0 : dialogData.unloadCallback) && dialogData.unloadCallback();
        });
        win.addEventListener("DOMContentLoaded", function onWindowLoad(ev) {
          var _a2, _b2;
          (_b2 = (_a2 = win.arguments[0]) === null || _a2 === void 0 ? void 0 : _a2.loadLock) === null || _b2 === void 0 ? void 0 : _b2.resolve();
          win.removeEventListener("DOMContentLoaded", onWindowLoad, false);
        }, false);
        win.addEventListener("beforeunload", function onWindowBeforeUnload(ev) {
          Array.from(win.document.querySelectorAll("*[data-bind]")).forEach((elem) => {
            const dialogData2 = this.window.arguments[0];
            const bindKey = elem.getAttribute("data-bind");
            const bindAttr = elem.getAttribute("data-attr");
            const bindProp = elem.getAttribute("data-prop");
            if (bindKey && dialogData2) {
              if (bindProp) {
                dialogData2[bindKey] = elem[bindProp];
              } else {
                dialogData2[bindKey] = elem.getAttribute(bindAttr || "value");
              }
            }
          });
          this.window.removeEventListener("beforeunload", onWindowBeforeUnload, false);
          (dialogData === null || dialogData === void 0 ? void 0 : dialogData.beforeUnloadCallback) && dialogData.beforeUnloadCallback();
        });
        win.addEventListener("unload", function onWindowUnload(ev) {
          var _a2, _b2, _c;
          if ((_a2 = this.window.arguments[0]) === null || _a2 === void 0 ? void 0 : _a2.loadLock.promise.isPending()) {
            return;
          }
          (_c = (_b2 = this.window.arguments[0]) === null || _b2 === void 0 ? void 0 : _b2.unloadLock) === null || _c === void 0 ? void 0 : _c.resolve();
          this.window.removeEventListener("unload", onWindowUnload, false);
        });
        if (win.document.readyState === "complete") {
          (_b = (_a = win.arguments[0]) === null || _a === void 0 ? void 0 : _a.loadLock) === null || _b === void 0 ? void 0 : _b.resolve();
        }
        return win;
      }
      function replaceElement(elementProps, uiTool) {
        var _a, _b, _c, _d, _e, _f, _g;
        let checkChildren = true;
        if (elementProps.tag === "select" && uiTool.isZotero7()) {
          checkChildren = false;
          const customSelectProps = {
            tag: "div",
            classList: ["dropdown"],
            listeners: [
              {
                type: "mouseleave",
                listener: (ev) => {
                  const select = ev.target.querySelector("select");
                  select === null || select === void 0 ? void 0 : select.blur();
                }
              }
            ],
            children: [
              Object.assign({}, elementProps, {
                tag: "select",
                listeners: [
                  {
                    type: "focus",
                    listener: (ev) => {
                      var _a2;
                      const select = ev.target;
                      const dropdown = (_a2 = select.parentElement) === null || _a2 === void 0 ? void 0 : _a2.querySelector(".dropdown-content");
                      dropdown && (dropdown.style.display = "block");
                      select.setAttribute("focus", "true");
                    }
                  },
                  {
                    type: "blur",
                    listener: (ev) => {
                      var _a2;
                      const select = ev.target;
                      const dropdown = (_a2 = select.parentElement) === null || _a2 === void 0 ? void 0 : _a2.querySelector(".dropdown-content");
                      dropdown && (dropdown.style.display = "none");
                      select.removeAttribute("focus");
                    }
                  }
                ]
              }),
              {
                tag: "div",
                classList: ["dropdown-content"],
                children: (_a = elementProps.children) === null || _a === void 0 ? void 0 : _a.map((option) => {
                  var _a2, _b2, _c2;
                  return {
                    tag: "p",
                    attributes: {
                      value: (_a2 = option.properties) === null || _a2 === void 0 ? void 0 : _a2.value
                    },
                    properties: {
                      innerHTML: ((_b2 = option.properties) === null || _b2 === void 0 ? void 0 : _b2.innerHTML) || ((_c2 = option.properties) === null || _c2 === void 0 ? void 0 : _c2.innerText)
                    },
                    classList: ["dropdown-item"],
                    listeners: [
                      {
                        type: "click",
                        listener: (ev) => {
                          var _a3;
                          const select = (_a3 = ev.target.parentElement) === null || _a3 === void 0 ? void 0 : _a3.previousElementSibling;
                          select && (select.value = ev.target.getAttribute("value") || "");
                          select === null || select === void 0 ? void 0 : select.blur();
                        }
                      }
                    ]
                  };
                })
              }
            ]
          };
          for (const key in elementProps) {
            delete elementProps[key];
          }
          Object.assign(elementProps, customSelectProps);
        } else if (elementProps.tag === "a") {
          const href = ((_b = elementProps === null || elementProps === void 0 ? void 0 : elementProps.properties) === null || _b === void 0 ? void 0 : _b.href) || "";
          (_c = elementProps.properties) !== null && _c !== void 0 ? _c : elementProps.properties = {};
          elementProps.properties.href = "javascript:void(0);";
          (_d = elementProps.attributes) !== null && _d !== void 0 ? _d : elementProps.attributes = {};
          elementProps.attributes["zotero-href"] = href;
          (_e = elementProps.listeners) !== null && _e !== void 0 ? _e : elementProps.listeners = [];
          elementProps.listeners.push({
            type: "click",
            listener: (ev) => {
              var _a2;
              const href2 = (_a2 = ev.target) === null || _a2 === void 0 ? void 0 : _a2.getAttribute("zotero-href");
              href2 && uiTool.getGlobal("Zotero").launchURL(href2);
            }
          });
          (_f = elementProps.classList) !== null && _f !== void 0 ? _f : elementProps.classList = [];
          elementProps.classList.push("zotero-text-link");
        }
        if (checkChildren) {
          (_g = elementProps.children) === null || _g === void 0 ? void 0 : _g.forEach((child) => replaceElement(child, uiTool));
        }
      }
      var style = `
html,
body {
  font-size: calc(12px * 1);
}
.zotero-text-link {
  -moz-user-focus: normal;
  color: -moz-nativehyperlinktext;
  text-decoration: underline;
  border: 1px solid transparent;
  cursor: pointer;
}
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9fb;
  min-width: 160px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 5px 0 5px 0;
  z-index: 999;
}
.dropdown-item {
  margin: 0px;
  padding: 5px 10px 5px 10px;
}
.dropdown-item:hover {
  background-color: #efeff3;
}
`;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/readerInstance.js
  var require_readerInstance = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/readerInstance.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ReaderInstanceManager = void 0;
      var basic_1 = require_basic2();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var ReaderInstanceManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.cachedHookIds = [];
          this.initializeGlobal();
        }
        /**
         * Register a reader instance hook
         * @remarks
         * initialized: called when reader instance is ready
         * @param type hook type
         * @param id hook id
         * @param hook
         */
        register(type, id, hook) {
          const Zotero2 = this.getGlobal("Zotero");
          switch (type) {
            case "initialized":
              {
                this.globalCache.initializedHooks[id] = hook;
                Zotero2.Reader._readers.forEach(hook);
              }
              break;
            default:
              break;
          }
          this.cachedHookIds.push(id);
        }
        /**
         * Unregister hook by id
         * @param id
         */
        unregister(id) {
          delete this.globalCache.initializedHooks[id];
        }
        /**
         * Unregister all hooks
         */
        unregisterAll() {
          this.cachedHookIds.forEach((id) => this.unregister(id));
        }
        initializeGlobal() {
          this.globalCache = toolkitGlobal_1.default.getInstance().readerInstance;
          if (!this.globalCache._ready) {
            this.globalCache._ready = true;
            const Zotero2 = this.getGlobal("Zotero");
            const _this = this;
            Zotero2.Reader._readers = new (this.getGlobal("Proxy"))(Zotero2.Reader._readers, {
              set(target, p, newValue, receiver) {
                target[p] = newValue;
                if (!isNaN(Number(p))) {
                  Object.values(_this.globalCache.initializedHooks).forEach((hook) => {
                    try {
                      hook(newValue);
                    } catch (e) {
                      _this.log(e);
                    }
                  });
                }
                return true;
              }
            });
          }
        }
      };
      exports.ReaderInstanceManager = ReaderInstanceManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/managers/itemBox.js
  var require_itemBox = __commonJS({
    "../zotero-plugin-toolkit/dist/managers/itemBox.js"(exports) {
      "use strict";
      var __importDefault = exports && exports.__importDefault || function (mod) {
        return mod && mod.__esModule ? mod : { "default": mod };
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ItemBoxManager = void 0;
      var basic_1 = require_basic2();
      var fieldHook_1 = require_fieldHook();
      var toolkitGlobal_1 = __importDefault(require_toolkitGlobal2());
      var ItemBoxManager = class extends basic_1.ManagerTool {
        constructor(base) {
          super(base);
          this.initializationLock = this.getGlobal("Zotero").Promise.defer();
          this.localCache = [];
          this.fieldHooks = new fieldHook_1.FieldHookManager();
          this.initializeGlobal();
        }
        /**
         * Register a custom row
         * @param field Field name. Used in `getField` and `setField`.
         * @param displayName The row header display text.
         * @param getFieldHook Called when loading row content.
         * If you registered the getField hook somewhere else (in ItemBox or FieldHooks), leave it undefined.
         * @param options
         * @param options.editable If the row is editable.
         * To edit a row, either the `options.setFieldHook` or a custom hook for `setField` created by FieldHookManager is required.
         * @param options.setFieldHook The `setField` hook.
         * @param options.index Target index. By default it's placed at the end of rows.
         * @param options.multiline If the row content is multiline.
         * @param options.collapsible If the row content is collapsible (like abstract field).
         */
        async register(field, displayName, getFieldHook, options = {}) {
          this.fieldHooks.register("isFieldOfBase", field, () => false);
          if (getFieldHook) {
            this.fieldHooks.register("getField", field, getFieldHook);
          }
          if (options.editable && options.setFieldHook) {
            this.fieldHooks.register("setField", field, options.setFieldHook);
          }
          this.globalCache.fieldOptions[field] = {
            field,
            displayName,
            editable: options.editable || false,
            index: options.index || -1,
            multiline: options.multiline || false,
            collapsible: options.collapsible || false
          };
          this.localCache.push(field);
          await this.initializationLock.promise;
          this.refresh();
        }
        /**
         * Unregister a row of specific field.
         * @param field
         * @param options Skip unregister of certain hooks.
         * This is useful when the hook is not initialized by this instance
         * @param options.skipRefresh Skip refresh after unregister.
         */
        unregister(field, options = {}) {
          delete this.globalCache.fieldOptions[field];
          if (!options.skipIsFieldOfBase) {
            this.fieldHooks.unregister("isFieldOfBase", field);
          }
          if (!options.skipGetField) {
            this.fieldHooks.unregister("getField", field);
          }
          if (!options.skipSetField) {
            this.fieldHooks.unregister("setField", field);
          }
          const idx = this.localCache.indexOf(field);
          if (idx > -1) {
            this.localCache.splice(idx, 1);
          }
          if (!options.skipRefresh) {
            this.refresh();
          }
        }
        unregisterAll() {
          [...this.localCache].forEach((field) => this.unregister(field, {
            skipGetField: true,
            skipSetField: true,
            skipIsFieldOfBase: true,
            skipRefresh: true
          }));
          this.fieldHooks.unregisterAll();
          this.refresh();
        }
        /**
         * Refresh all item boxes.
         */
        refresh() {
          try {
            Array.from(this.getGlobal("document").querySelectorAll(this.isZotero7() ? "item-box" : "zoteroitembox")).forEach((elem) => elem.refresh());
          } catch (e) {
            this.log(e);
          }
        }
        async initializeGlobal() {
          const Zotero2 = this.getGlobal("Zotero");
          await Zotero2.uiReadyPromise;
          const window2 = this.getGlobal("window");
          const globalCache = this.globalCache = toolkitGlobal_1.default.getInstance().itemBox;
          const inZotero7 = this.isZotero7();
          if (!globalCache._ready) {
            globalCache._ready = true;
            let itemBoxInstance;
            if (inZotero7) {
              itemBoxInstance = new (this.getGlobal("customElements").get("item-box"))();
            } else {
              itemBoxInstance = window2.document.querySelector("#zotero-editpane-item-box");
              const wait = 5e3;
              let t = 0;
              while (!itemBoxInstance && t < wait) {
                itemBoxInstance = window2.document.querySelector("#zotero-editpane-item-box");
                await Zotero2.Promise.delay(10);
                t += 10;
              }
              if (!itemBoxInstance) {
                globalCache._ready = false;
                this.log("ItemBox initialization failed");
                return;
              }
            }
            this.patch(itemBoxInstance.__proto__, "refresh", this.patchSign, (original) => function () {
              const originalThis = this;
              original.apply(originalThis, arguments);
              for (const extraField of Object.values(globalCache.fieldOptions)) {
                const fieldHeader = document.createElement(inZotero7 ? "th" : "label");
                fieldHeader.setAttribute("fieldname", extraField.field);
                const prefKey = `extensions.zotero.pluginToolkit.fieldCollapsed.${extraField.field}`;
                const collapsed = extraField.multiline && extraField.collapsible && Zotero2.Prefs.get(prefKey, true);
                let headerContent = extraField.displayName;
                if (collapsed) {
                  headerContent = `(...)${headerContent}`;
                }
                if (inZotero7) {
                  let label = document.createElement("label");
                  label.className = "key";
                  label.textContent = headerContent;
                  fieldHeader.appendChild(label);
                } else {
                  fieldHeader.setAttribute("value", headerContent);
                }
                const _clickable = originalThis.clickable;
                originalThis.clickable = extraField.editable;
                const fieldValue = originalThis.createValueElement(originalThis.item.getField(extraField.field), extraField.field, 1099);
                originalThis.clickable = _clickable;
                if (extraField.multiline && !Zotero2.Prefs.get(prefKey, true)) {
                  fieldValue.classList.add("multiline");
                } else if (!inZotero7) {
                  fieldValue.setAttribute("crop", "end");
                  fieldValue.setAttribute("value", fieldValue.innerHTML);
                  fieldValue.innerHTML = "";
                }
                if (extraField.collapsible) {
                  fieldHeader.addEventListener("click", function (ev) {
                    Zotero2.Prefs.set(prefKey, !(Zotero2.Prefs.get(prefKey, true) || false), true);
                    originalThis.refresh();
                  });
                }
                fieldHeader.addEventListener("click", inZotero7 ? function (ev) {
                  var _a;
                  const inputField = (_a = ev.currentTarget.nextElementSibling) === null || _a === void 0 ? void 0 : _a.querySelector("input, textarea");
                  if (inputField) {
                    inputField.blur();
                  }
                } : function (ev) {
                  var _a;
                  const inputField = (_a = ev.currentTarget.nextElementSibling) === null || _a === void 0 ? void 0 : _a.inputField;
                  if (inputField) {
                    inputField.blur();
                  }
                });
                const table = inZotero7 ? originalThis._infoTable : originalThis._dynamicFields;
                let fieldIndex = extraField.index;
                if (fieldIndex === 0) {
                  fieldIndex = 1;
                }
                if (fieldIndex && fieldIndex >= 0 && fieldIndex < table.children.length) {
                  originalThis._beforeRow = table.children[fieldIndex];
                  originalThis.addDynamicRow(fieldHeader, fieldValue, true);
                } else {
                  originalThis.addDynamicRow(fieldHeader, fieldValue);
                }
              }
            });
          }
          this.initializationLock.resolve();
        }
      };
      exports.ItemBoxManager = ItemBoxManager;
    }
  });

  // ../zotero-plugin-toolkit/dist/index.js
  var require_dist = __commonJS({
    "../zotero-plugin-toolkit/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.ZoteroToolkit = void 0;
      var basic_1 = require_basic2();
      var ui_1 = require_ui();
      var reader_1 = require_reader();
      var extraField_1 = require_extraField();
      var itemTree_1 = require_itemTree();
      var prompt_1 = require_prompt();
      var libraryTabPanel_1 = require_libraryTabPanel();
      var readerTabPanel_1 = require_readerTabPanel();
      var menu_1 = require_menu();
      var preferencePane_1 = require_preferencePane();
      var shortcut_1 = require_shortcut();
      var clipboard_1 = require_clipboard();
      var filePicker_1 = require_filePicker();
      var progressWindow_1 = require_progressWindow();
      var virtualizedTable_1 = require_virtualizedTable();
      var dialog_1 = require_dialog();
      var readerInstance_1 = require_readerInstance();
      var fieldHook_1 = require_fieldHook();
      var itemBox_1 = require_itemBox();
      var ZoteroToolkit2 = class extends basic_1.BasicTool {
        constructor() {
          super();
          this.UI = new ui_1.UITool(this);
          this.Reader = new reader_1.ReaderTool(this);
          this.ExtraField = new extraField_1.ExtraFieldTool(this);
          this.FieldHooks = new fieldHook_1.FieldHookManager(this);
          this.ItemTree = new itemTree_1.ItemTreeManager(this);
          this.ItemBox = new itemBox_1.ItemBoxManager(this);
          this.Prompt = new prompt_1.PromptManager(this);
          this.LibraryTabPanel = new libraryTabPanel_1.LibraryTabPanelManager(this);
          this.ReaderTabPanel = new readerTabPanel_1.ReaderTabPanelManager(this);
          this.ReaderInstance = new readerInstance_1.ReaderInstanceManager(this);
          this.Menu = new menu_1.MenuManager(this);
          this.PreferencePane = new preferencePane_1.PreferencePaneManager(this);
          this.Shortcut = new shortcut_1.ShortcutManager(this);
          this.Clipboard = clipboard_1.ClipboardHelper;
          this.FilePicker = filePicker_1.FilePickerHelper;
          this.ProgressWindow = progressWindow_1.ProgressWindowHelper;
          this.VirtualizedTable = virtualizedTable_1.VirtualizedTableHelper;
          this.Dialog = dialog_1.DialogHelper;
        }
        /**
         * Unregister everything created by managers.
         */
        unregisterAll() {
          (0, basic_1.unregister)(this);
        }
      };
      exports.ZoteroToolkit = ZoteroToolkit2;
      exports.default = ZoteroToolkit2;
    }
  });

  // node_modules/xml2js/lib/defaults.js
  var require_defaults = __commonJS({
    "node_modules/xml2js/lib/defaults.js"(exports) {
      (function () {
        exports.defaults = {
          "0.1": {
            explicitCharkey: false,
            trim: true,
            normalize: true,
            normalizeTags: false,
            attrkey: "@",
            charkey: "#",
            explicitArray: false,
            ignoreAttrs: false,
            mergeAttrs: false,
            explicitRoot: false,
            validator: null,
            xmlns: false,
            explicitChildren: false,
            childkey: "@@",
            charsAsChildren: false,
            includeWhiteChars: false,
            async: false,
            strict: true,
            attrNameProcessors: null,
            attrValueProcessors: null,
            tagNameProcessors: null,
            valueProcessors: null,
            emptyTag: ""
          },
          "0.2": {
            explicitCharkey: false,
            trim: false,
            normalize: false,
            normalizeTags: false,
            attrkey: "$",
            charkey: "_",
            explicitArray: true,
            ignoreAttrs: false,
            mergeAttrs: false,
            explicitRoot: true,
            validator: null,
            xmlns: false,
            explicitChildren: false,
            preserveChildrenOrder: false,
            childkey: "$$",
            charsAsChildren: false,
            includeWhiteChars: false,
            async: false,
            strict: true,
            attrNameProcessors: null,
            attrValueProcessors: null,
            tagNameProcessors: null,
            valueProcessors: null,
            rootName: "root",
            xmldec: {
              "version": "1.0",
              "encoding": "UTF-8",
              "standalone": true
            },
            doctype: null,
            renderOpts: {
              "pretty": true,
              "indent": "  ",
              "newline": "\n"
            },
            headless: false,
            chunkSize: 1e4,
            emptyTag: "",
            cdata: false
          }
        };
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/Utility.js
  var require_Utility = __commonJS({
    "node_modules/xmlbuilder/lib/Utility.js"(exports, module) {
      (function () {
        var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
        assign = function () {
          var i, key, len, source, sources, target;
          target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          if (isFunction(Object.assign)) {
            Object.assign.apply(null, arguments);
          } else {
            for (i = 0, len = sources.length; i < len; i++) {
              source = sources[i];
              if (source != null) {
                for (key in source) {
                  if (!hasProp.call(source, key))
                    continue;
                  target[key] = source[key];
                }
              }
            }
          }
          return target;
        };
        isFunction = function (val) {
          return !!val && Object.prototype.toString.call(val) === "[object Function]";
        };
        isObject = function (val) {
          var ref;
          return !!val && ((ref = typeof val) === "function" || ref === "object");
        };
        isArray = function (val) {
          if (isFunction(Array.isArray)) {
            return Array.isArray(val);
          } else {
            return Object.prototype.toString.call(val) === "[object Array]";
          }
        };
        isEmpty = function (val) {
          var key;
          if (isArray(val)) {
            return !val.length;
          } else {
            for (key in val) {
              if (!hasProp.call(val, key))
                continue;
              return false;
            }
            return true;
          }
        };
        isPlainObject = function (val) {
          var ctor, proto;
          return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
        };
        getValue = function (obj) {
          if (isFunction(obj.valueOf)) {
            return obj.valueOf();
          } else {
            return obj;
          }
        };
        module.exports.assign = assign;
        module.exports.isFunction = isFunction;
        module.exports.isObject = isObject;
        module.exports.isArray = isArray;
        module.exports.isEmpty = isEmpty;
        module.exports.isPlainObject = isPlainObject;
        module.exports.getValue = getValue;
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDOMImplementation.js
  var require_XMLDOMImplementation = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDOMImplementation.js"(exports, module) {
      (function () {
        var XMLDOMImplementation;
        module.exports = XMLDOMImplementation = function () {
          function XMLDOMImplementation2() {
          }
          XMLDOMImplementation2.prototype.hasFeature = function (feature, version) {
            return true;
          };
          XMLDOMImplementation2.prototype.createDocumentType = function (qualifiedName, publicId, systemId) {
            throw new Error("This DOM method is not implemented.");
          };
          XMLDOMImplementation2.prototype.createDocument = function (namespaceURI, qualifiedName, doctype) {
            throw new Error("This DOM method is not implemented.");
          };
          XMLDOMImplementation2.prototype.createHTMLDocument = function (title) {
            throw new Error("This DOM method is not implemented.");
          };
          XMLDOMImplementation2.prototype.getFeature = function (feature, version) {
            throw new Error("This DOM method is not implemented.");
          };
          return XMLDOMImplementation2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js
  var require_XMLDOMErrorHandler = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js"(exports, module) {
      (function () {
        var XMLDOMErrorHandler;
        module.exports = XMLDOMErrorHandler = function () {
          function XMLDOMErrorHandler2() {
          }
          XMLDOMErrorHandler2.prototype.handleError = function (error) {
            throw new Error(error);
          };
          return XMLDOMErrorHandler2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDOMStringList.js
  var require_XMLDOMStringList = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDOMStringList.js"(exports, module) {
      (function () {
        var XMLDOMStringList;
        module.exports = XMLDOMStringList = function () {
          function XMLDOMStringList2(arr) {
            this.arr = arr || [];
          }
          Object.defineProperty(XMLDOMStringList2.prototype, "length", {
            get: function () {
              return this.arr.length;
            }
          });
          XMLDOMStringList2.prototype.item = function (index) {
            return this.arr[index] || null;
          };
          XMLDOMStringList2.prototype.contains = function (str) {
            return this.arr.indexOf(str) !== -1;
          };
          return XMLDOMStringList2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDOMConfiguration.js
  var require_XMLDOMConfiguration = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDOMConfiguration.js"(exports, module) {
      (function () {
        var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;
        XMLDOMErrorHandler = require_XMLDOMErrorHandler();
        XMLDOMStringList = require_XMLDOMStringList();
        module.exports = XMLDOMConfiguration = function () {
          function XMLDOMConfiguration2() {
            var clonedSelf;
            this.defaultParams = {
              "canonical-form": false,
              "cdata-sections": false,
              "comments": false,
              "datatype-normalization": false,
              "element-content-whitespace": true,
              "entities": true,
              "error-handler": new XMLDOMErrorHandler(),
              "infoset": true,
              "validate-if-schema": false,
              "namespaces": true,
              "namespace-declarations": true,
              "normalize-characters": false,
              "schema-location": "",
              "schema-type": "",
              "split-cdata-sections": true,
              "validate": false,
              "well-formed": true
            };
            this.params = clonedSelf = Object.create(this.defaultParams);
          }
          Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
            get: function () {
              return new XMLDOMStringList(Object.keys(this.defaultParams));
            }
          });
          XMLDOMConfiguration2.prototype.getParameter = function (name) {
            if (this.params.hasOwnProperty(name)) {
              return this.params[name];
            } else {
              return null;
            }
          };
          XMLDOMConfiguration2.prototype.canSetParameter = function (name, value) {
            return true;
          };
          XMLDOMConfiguration2.prototype.setParameter = function (name, value) {
            if (value != null) {
              return this.params[name] = value;
            } else {
              return delete this.params[name];
            }
          };
          return XMLDOMConfiguration2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/NodeType.js
  var require_NodeType = __commonJS({
    "node_modules/xmlbuilder/lib/NodeType.js"(exports, module) {
      (function () {
        module.exports = {
          Element: 1,
          Attribute: 2,
          Text: 3,
          CData: 4,
          EntityReference: 5,
          EntityDeclaration: 6,
          ProcessingInstruction: 7,
          Comment: 8,
          Document: 9,
          DocType: 10,
          DocumentFragment: 11,
          NotationDeclaration: 12,
          Declaration: 201,
          Raw: 202,
          AttributeDeclaration: 203,
          ElementDeclaration: 204,
          Dummy: 205
        };
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLAttribute.js
  var require_XMLAttribute = __commonJS({
    "node_modules/xmlbuilder/lib/XMLAttribute.js"(exports, module) {
      (function () {
        var NodeType, XMLAttribute, XMLNode;
        NodeType = require_NodeType();
        XMLNode = require_XMLNode();
        module.exports = XMLAttribute = function () {
          function XMLAttribute2(parent, name, value) {
            this.parent = parent;
            if (this.parent) {
              this.options = this.parent.options;
              this.stringify = this.parent.stringify;
            }
            if (name == null) {
              throw new Error("Missing attribute name. " + this.debugInfo(name));
            }
            this.name = this.stringify.name(name);
            this.value = this.stringify.attValue(value);
            this.type = NodeType.Attribute;
            this.isId = false;
            this.schemaTypeInfo = null;
          }
          Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
            get: function () {
              return this.type;
            }
          });
          Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
            get: function () {
              return this.parent;
            }
          });
          Object.defineProperty(XMLAttribute2.prototype, "textContent", {
            get: function () {
              return this.value;
            },
            set: function (value) {
              return this.value = value || "";
            }
          });
          Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
            get: function () {
              return "";
            }
          });
          Object.defineProperty(XMLAttribute2.prototype, "prefix", {
            get: function () {
              return "";
            }
          });
          Object.defineProperty(XMLAttribute2.prototype, "localName", {
            get: function () {
              return this.name;
            }
          });
          Object.defineProperty(XMLAttribute2.prototype, "specified", {
            get: function () {
              return true;
            }
          });
          XMLAttribute2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLAttribute2.prototype.toString = function (options) {
            return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
          };
          XMLAttribute2.prototype.debugInfo = function (name) {
            name = name || this.name;
            if (name == null) {
              return "parent: <" + this.parent.name + ">";
            } else {
              return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
            }
          };
          XMLAttribute2.prototype.isEqualNode = function (node) {
            if (node.namespaceURI !== this.namespaceURI) {
              return false;
            }
            if (node.prefix !== this.prefix) {
              return false;
            }
            if (node.localName !== this.localName) {
              return false;
            }
            if (node.value !== this.value) {
              return false;
            }
            return true;
          };
          return XMLAttribute2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLNamedNodeMap.js
  var require_XMLNamedNodeMap = __commonJS({
    "node_modules/xmlbuilder/lib/XMLNamedNodeMap.js"(exports, module) {
      (function () {
        var XMLNamedNodeMap;
        module.exports = XMLNamedNodeMap = function () {
          function XMLNamedNodeMap2(nodes) {
            this.nodes = nodes;
          }
          Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
            get: function () {
              return Object.keys(this.nodes).length || 0;
            }
          });
          XMLNamedNodeMap2.prototype.clone = function () {
            return this.nodes = null;
          };
          XMLNamedNodeMap2.prototype.getNamedItem = function (name) {
            return this.nodes[name];
          };
          XMLNamedNodeMap2.prototype.setNamedItem = function (node) {
            var oldNode;
            oldNode = this.nodes[node.nodeName];
            this.nodes[node.nodeName] = node;
            return oldNode || null;
          };
          XMLNamedNodeMap2.prototype.removeNamedItem = function (name) {
            var oldNode;
            oldNode = this.nodes[name];
            delete this.nodes[name];
            return oldNode || null;
          };
          XMLNamedNodeMap2.prototype.item = function (index) {
            return this.nodes[Object.keys(this.nodes)[index]] || null;
          };
          XMLNamedNodeMap2.prototype.getNamedItemNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented.");
          };
          XMLNamedNodeMap2.prototype.setNamedItemNS = function (node) {
            throw new Error("This DOM method is not implemented.");
          };
          XMLNamedNodeMap2.prototype.removeNamedItemNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented.");
          };
          return XMLNamedNodeMap2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLElement.js
  var require_XMLElement = __commonJS({
    "node_modules/xmlbuilder/lib/XMLElement.js"(exports, module) {
      (function () {
        var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        XMLAttribute = require_XMLAttribute();
        XMLNamedNodeMap = require_XMLNamedNodeMap();
        module.exports = XMLElement = function (superClass) {
          extend(XMLElement2, superClass);
          function XMLElement2(parent, name, attributes) {
            var child, j, len, ref1;
            XMLElement2.__super__.constructor.call(this, parent);
            if (name == null) {
              throw new Error("Missing element name. " + this.debugInfo());
            }
            this.name = this.stringify.name(name);
            this.type = NodeType.Element;
            this.attribs = {};
            this.schemaTypeInfo = null;
            if (attributes != null) {
              this.attribute(attributes);
            }
            if (parent.type === NodeType.Document) {
              this.isRoot = true;
              this.documentObject = parent;
              parent.rootObject = this;
              if (parent.children) {
                ref1 = parent.children;
                for (j = 0, len = ref1.length; j < len; j++) {
                  child = ref1[j];
                  if (child.type === NodeType.DocType) {
                    child.name = this.name;
                    break;
                  }
                }
              }
            }
          }
          Object.defineProperty(XMLElement2.prototype, "tagName", {
            get: function () {
              return this.name;
            }
          });
          Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
            get: function () {
              return "";
            }
          });
          Object.defineProperty(XMLElement2.prototype, "prefix", {
            get: function () {
              return "";
            }
          });
          Object.defineProperty(XMLElement2.prototype, "localName", {
            get: function () {
              return this.name;
            }
          });
          Object.defineProperty(XMLElement2.prototype, "id", {
            get: function () {
              throw new Error("This DOM method is not implemented." + this.debugInfo());
            }
          });
          Object.defineProperty(XMLElement2.prototype, "className", {
            get: function () {
              throw new Error("This DOM method is not implemented." + this.debugInfo());
            }
          });
          Object.defineProperty(XMLElement2.prototype, "classList", {
            get: function () {
              throw new Error("This DOM method is not implemented." + this.debugInfo());
            }
          });
          Object.defineProperty(XMLElement2.prototype, "attributes", {
            get: function () {
              if (!this.attributeMap || !this.attributeMap.nodes) {
                this.attributeMap = new XMLNamedNodeMap(this.attribs);
              }
              return this.attributeMap;
            }
          });
          XMLElement2.prototype.clone = function () {
            var att, attName, clonedSelf, ref1;
            clonedSelf = Object.create(this);
            if (clonedSelf.isRoot) {
              clonedSelf.documentObject = null;
            }
            clonedSelf.attribs = {};
            ref1 = this.attribs;
            for (attName in ref1) {
              if (!hasProp.call(ref1, attName))
                continue;
              att = ref1[attName];
              clonedSelf.attribs[attName] = att.clone();
            }
            clonedSelf.children = [];
            this.children.forEach(function (child) {
              var clonedChild;
              clonedChild = child.clone();
              clonedChild.parent = clonedSelf;
              return clonedSelf.children.push(clonedChild);
            });
            return clonedSelf;
          };
          XMLElement2.prototype.attribute = function (name, value) {
            var attName, attValue;
            if (name != null) {
              name = getValue(name);
            }
            if (isObject(name)) {
              for (attName in name) {
                if (!hasProp.call(name, attName))
                  continue;
                attValue = name[attName];
                this.attribute(attName, attValue);
              }
            } else {
              if (isFunction(value)) {
                value = value.apply();
              }
              if (this.options.keepNullAttributes && value == null) {
                this.attribs[name] = new XMLAttribute(this, name, "");
              } else if (value != null) {
                this.attribs[name] = new XMLAttribute(this, name, value);
              }
            }
            return this;
          };
          XMLElement2.prototype.removeAttribute = function (name) {
            var attName, j, len;
            if (name == null) {
              throw new Error("Missing attribute name. " + this.debugInfo());
            }
            name = getValue(name);
            if (Array.isArray(name)) {
              for (j = 0, len = name.length; j < len; j++) {
                attName = name[j];
                delete this.attribs[attName];
              }
            } else {
              delete this.attribs[name];
            }
            return this;
          };
          XMLElement2.prototype.toString = function (options) {
            return this.options.writer.element(this, this.options.writer.filterOptions(options));
          };
          XMLElement2.prototype.att = function (name, value) {
            return this.attribute(name, value);
          };
          XMLElement2.prototype.a = function (name, value) {
            return this.attribute(name, value);
          };
          XMLElement2.prototype.getAttribute = function (name) {
            if (this.attribs.hasOwnProperty(name)) {
              return this.attribs[name].value;
            } else {
              return null;
            }
          };
          XMLElement2.prototype.setAttribute = function (name, value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getAttributeNode = function (name) {
            if (this.attribs.hasOwnProperty(name)) {
              return this.attribs[name];
            } else {
              return null;
            }
          };
          XMLElement2.prototype.setAttributeNode = function (newAttr) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.removeAttributeNode = function (oldAttr) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getElementsByTagName = function (name) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getAttributeNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.setAttributeNS = function (namespaceURI, qualifiedName, value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.removeAttributeNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getAttributeNodeNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.setAttributeNodeNS = function (newAttr) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getElementsByTagNameNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.hasAttribute = function (name) {
            return this.attribs.hasOwnProperty(name);
          };
          XMLElement2.prototype.hasAttributeNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.setIdAttribute = function (name, isId) {
            if (this.attribs.hasOwnProperty(name)) {
              return this.attribs[name].isId;
            } else {
              return isId;
            }
          };
          XMLElement2.prototype.setIdAttributeNS = function (namespaceURI, localName, isId) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.setIdAttributeNode = function (idAttr, isId) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getElementsByTagName = function (tagname) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getElementsByTagNameNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.getElementsByClassName = function (classNames) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLElement2.prototype.isEqualNode = function (node) {
            var i, j, ref1;
            if (!XMLElement2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
              return false;
            }
            if (node.namespaceURI !== this.namespaceURI) {
              return false;
            }
            if (node.prefix !== this.prefix) {
              return false;
            }
            if (node.localName !== this.localName) {
              return false;
            }
            if (node.attribs.length !== this.attribs.length) {
              return false;
            }
            for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
              if (!this.attribs[i].isEqualNode(node.attribs[i])) {
                return false;
              }
            }
            return true;
          };
          return XMLElement2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLCharacterData.js
  var require_XMLCharacterData = __commonJS({
    "node_modules/xmlbuilder/lib/XMLCharacterData.js"(exports, module) {
      (function () {
        var XMLCharacterData, XMLNode, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        XMLNode = require_XMLNode();
        module.exports = XMLCharacterData = function (superClass) {
          extend(XMLCharacterData2, superClass);
          function XMLCharacterData2(parent) {
            XMLCharacterData2.__super__.constructor.call(this, parent);
            this.value = "";
          }
          Object.defineProperty(XMLCharacterData2.prototype, "data", {
            get: function () {
              return this.value;
            },
            set: function (value) {
              return this.value = value || "";
            }
          });
          Object.defineProperty(XMLCharacterData2.prototype, "length", {
            get: function () {
              return this.value.length;
            }
          });
          Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
            get: function () {
              return this.value;
            },
            set: function (value) {
              return this.value = value || "";
            }
          });
          XMLCharacterData2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLCharacterData2.prototype.substringData = function (offset, count) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLCharacterData2.prototype.appendData = function (arg) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLCharacterData2.prototype.insertData = function (offset, arg) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLCharacterData2.prototype.deleteData = function (offset, count) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLCharacterData2.prototype.replaceData = function (offset, count, arg) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLCharacterData2.prototype.isEqualNode = function (node) {
            if (!XMLCharacterData2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
              return false;
            }
            if (node.data !== this.data) {
              return false;
            }
            return true;
          };
          return XMLCharacterData2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLCData.js
  var require_XMLCData = __commonJS({
    "node_modules/xmlbuilder/lib/XMLCData.js"(exports, module) {
      (function () {
        var NodeType, XMLCData, XMLCharacterData, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        NodeType = require_NodeType();
        XMLCharacterData = require_XMLCharacterData();
        module.exports = XMLCData = function (superClass) {
          extend(XMLCData2, superClass);
          function XMLCData2(parent, text) {
            XMLCData2.__super__.constructor.call(this, parent);
            if (text == null) {
              throw new Error("Missing CDATA text. " + this.debugInfo());
            }
            this.name = "#cdata-section";
            this.type = NodeType.CData;
            this.value = this.stringify.cdata(text);
          }
          XMLCData2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLCData2.prototype.toString = function (options) {
            return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
          };
          return XMLCData2;
        }(XMLCharacterData);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLComment.js
  var require_XMLComment = __commonJS({
    "node_modules/xmlbuilder/lib/XMLComment.js"(exports, module) {
      (function () {
        var NodeType, XMLCharacterData, XMLComment, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        NodeType = require_NodeType();
        XMLCharacterData = require_XMLCharacterData();
        module.exports = XMLComment = function (superClass) {
          extend(XMLComment2, superClass);
          function XMLComment2(parent, text) {
            XMLComment2.__super__.constructor.call(this, parent);
            if (text == null) {
              throw new Error("Missing comment text. " + this.debugInfo());
            }
            this.name = "#comment";
            this.type = NodeType.Comment;
            this.value = this.stringify.comment(text);
          }
          XMLComment2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLComment2.prototype.toString = function (options) {
            return this.options.writer.comment(this, this.options.writer.filterOptions(options));
          };
          return XMLComment2;
        }(XMLCharacterData);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDeclaration.js
  var require_XMLDeclaration = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports, module) {
      (function () {
        var NodeType, XMLDeclaration, XMLNode, isObject, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        isObject = require_Utility().isObject;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        module.exports = XMLDeclaration = function (superClass) {
          extend(XMLDeclaration2, superClass);
          function XMLDeclaration2(parent, version, encoding, standalone) {
            var ref;
            XMLDeclaration2.__super__.constructor.call(this, parent);
            if (isObject(version)) {
              ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
            }
            if (!version) {
              version = "1.0";
            }
            this.type = NodeType.Declaration;
            this.version = this.stringify.xmlVersion(version);
            if (encoding != null) {
              this.encoding = this.stringify.xmlEncoding(encoding);
            }
            if (standalone != null) {
              this.standalone = this.stringify.xmlStandalone(standalone);
            }
          }
          XMLDeclaration2.prototype.toString = function (options) {
            return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
          };
          return XMLDeclaration2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDTDAttList.js
  var require_XMLDTDAttList = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports, module) {
      (function () {
        var NodeType, XMLDTDAttList, XMLNode, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        module.exports = XMLDTDAttList = function (superClass) {
          extend(XMLDTDAttList2, superClass);
          function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            XMLDTDAttList2.__super__.constructor.call(this, parent);
            if (elementName == null) {
              throw new Error("Missing DTD element name. " + this.debugInfo());
            }
            if (attributeName == null) {
              throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
            }
            if (!attributeType) {
              throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
            }
            if (!defaultValueType) {
              throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
            }
            if (defaultValueType.indexOf("#") !== 0) {
              defaultValueType = "#" + defaultValueType;
            }
            if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
              throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
            }
            if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
              throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
            }
            this.elementName = this.stringify.name(elementName);
            this.type = NodeType.AttributeDeclaration;
            this.attributeName = this.stringify.name(attributeName);
            this.attributeType = this.stringify.dtdAttType(attributeType);
            if (defaultValue) {
              this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
            }
            this.defaultValueType = defaultValueType;
          }
          XMLDTDAttList2.prototype.toString = function (options) {
            return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
          };
          return XMLDTDAttList2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDTDEntity.js
  var require_XMLDTDEntity = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports, module) {
      (function () {
        var NodeType, XMLDTDEntity, XMLNode, isObject, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        isObject = require_Utility().isObject;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        module.exports = XMLDTDEntity = function (superClass) {
          extend(XMLDTDEntity2, superClass);
          function XMLDTDEntity2(parent, pe, name, value) {
            XMLDTDEntity2.__super__.constructor.call(this, parent);
            if (name == null) {
              throw new Error("Missing DTD entity name. " + this.debugInfo(name));
            }
            if (value == null) {
              throw new Error("Missing DTD entity value. " + this.debugInfo(name));
            }
            this.pe = !!pe;
            this.name = this.stringify.name(name);
            this.type = NodeType.EntityDeclaration;
            if (!isObject(value)) {
              this.value = this.stringify.dtdEntityValue(value);
              this.internal = true;
            } else {
              if (!value.pubID && !value.sysID) {
                throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
              }
              if (value.pubID && !value.sysID) {
                throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
              }
              this.internal = false;
              if (value.pubID != null) {
                this.pubID = this.stringify.dtdPubID(value.pubID);
              }
              if (value.sysID != null) {
                this.sysID = this.stringify.dtdSysID(value.sysID);
              }
              if (value.nData != null) {
                this.nData = this.stringify.dtdNData(value.nData);
              }
              if (this.pe && this.nData) {
                throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
              }
            }
          }
          Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
            get: function () {
              return this.pubID;
            }
          });
          Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
            get: function () {
              return this.sysID;
            }
          });
          Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
            get: function () {
              return this.nData || null;
            }
          });
          Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
            get: function () {
              return null;
            }
          });
          Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
            get: function () {
              return null;
            }
          });
          Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
            get: function () {
              return null;
            }
          });
          XMLDTDEntity2.prototype.toString = function (options) {
            return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
          };
          return XMLDTDEntity2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDTDElement.js
  var require_XMLDTDElement = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports, module) {
      (function () {
        var NodeType, XMLDTDElement, XMLNode, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        module.exports = XMLDTDElement = function (superClass) {
          extend(XMLDTDElement2, superClass);
          function XMLDTDElement2(parent, name, value) {
            XMLDTDElement2.__super__.constructor.call(this, parent);
            if (name == null) {
              throw new Error("Missing DTD element name. " + this.debugInfo());
            }
            if (!value) {
              value = "(#PCDATA)";
            }
            if (Array.isArray(value)) {
              value = "(" + value.join(",") + ")";
            }
            this.name = this.stringify.name(name);
            this.type = NodeType.ElementDeclaration;
            this.value = this.stringify.dtdElementValue(value);
          }
          XMLDTDElement2.prototype.toString = function (options) {
            return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
          };
          return XMLDTDElement2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDTDNotation.js
  var require_XMLDTDNotation = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports, module) {
      (function () {
        var NodeType, XMLDTDNotation, XMLNode, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        module.exports = XMLDTDNotation = function (superClass) {
          extend(XMLDTDNotation2, superClass);
          function XMLDTDNotation2(parent, name, value) {
            XMLDTDNotation2.__super__.constructor.call(this, parent);
            if (name == null) {
              throw new Error("Missing DTD notation name. " + this.debugInfo(name));
            }
            if (!value.pubID && !value.sysID) {
              throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            this.name = this.stringify.name(name);
            this.type = NodeType.NotationDeclaration;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
          }
          Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
            get: function () {
              return this.pubID;
            }
          });
          Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
            get: function () {
              return this.sysID;
            }
          });
          XMLDTDNotation2.prototype.toString = function (options) {
            return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
          };
          return XMLDTDNotation2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDocType.js
  var require_XMLDocType = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDocType.js"(exports, module) {
      (function () {
        var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        isObject = require_Utility().isObject;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        XMLDTDAttList = require_XMLDTDAttList();
        XMLDTDEntity = require_XMLDTDEntity();
        XMLDTDElement = require_XMLDTDElement();
        XMLDTDNotation = require_XMLDTDNotation();
        XMLNamedNodeMap = require_XMLNamedNodeMap();
        module.exports = XMLDocType = function (superClass) {
          extend(XMLDocType2, superClass);
          function XMLDocType2(parent, pubID, sysID) {
            var child, i, len, ref, ref1, ref2;
            XMLDocType2.__super__.constructor.call(this, parent);
            this.type = NodeType.DocType;
            if (parent.children) {
              ref = parent.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                if (child.type === NodeType.Element) {
                  this.name = child.name;
                  break;
                }
              }
            }
            this.documentObject = parent;
            if (isObject(pubID)) {
              ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
            }
            if (sysID == null) {
              ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
            }
            if (pubID != null) {
              this.pubID = this.stringify.dtdPubID(pubID);
            }
            if (sysID != null) {
              this.sysID = this.stringify.dtdSysID(sysID);
            }
          }
          Object.defineProperty(XMLDocType2.prototype, "entities", {
            get: function () {
              var child, i, len, nodes, ref;
              nodes = {};
              ref = this.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                if (child.type === NodeType.EntityDeclaration && !child.pe) {
                  nodes[child.name] = child;
                }
              }
              return new XMLNamedNodeMap(nodes);
            }
          });
          Object.defineProperty(XMLDocType2.prototype, "notations", {
            get: function () {
              var child, i, len, nodes, ref;
              nodes = {};
              ref = this.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                if (child.type === NodeType.NotationDeclaration) {
                  nodes[child.name] = child;
                }
              }
              return new XMLNamedNodeMap(nodes);
            }
          });
          Object.defineProperty(XMLDocType2.prototype, "publicId", {
            get: function () {
              return this.pubID;
            }
          });
          Object.defineProperty(XMLDocType2.prototype, "systemId", {
            get: function () {
              return this.sysID;
            }
          });
          Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
            get: function () {
              throw new Error("This DOM method is not implemented." + this.debugInfo());
            }
          });
          XMLDocType2.prototype.element = function (name, value) {
            var child;
            child = new XMLDTDElement(this, name, value);
            this.children.push(child);
            return this;
          };
          XMLDocType2.prototype.attList = function (elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            var child;
            child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
            this.children.push(child);
            return this;
          };
          XMLDocType2.prototype.entity = function (name, value) {
            var child;
            child = new XMLDTDEntity(this, false, name, value);
            this.children.push(child);
            return this;
          };
          XMLDocType2.prototype.pEntity = function (name, value) {
            var child;
            child = new XMLDTDEntity(this, true, name, value);
            this.children.push(child);
            return this;
          };
          XMLDocType2.prototype.notation = function (name, value) {
            var child;
            child = new XMLDTDNotation(this, name, value);
            this.children.push(child);
            return this;
          };
          XMLDocType2.prototype.toString = function (options) {
            return this.options.writer.docType(this, this.options.writer.filterOptions(options));
          };
          XMLDocType2.prototype.ele = function (name, value) {
            return this.element(name, value);
          };
          XMLDocType2.prototype.att = function (elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
          };
          XMLDocType2.prototype.ent = function (name, value) {
            return this.entity(name, value);
          };
          XMLDocType2.prototype.pent = function (name, value) {
            return this.pEntity(name, value);
          };
          XMLDocType2.prototype.not = function (name, value) {
            return this.notation(name, value);
          };
          XMLDocType2.prototype.up = function () {
            return this.root() || this.documentObject;
          };
          XMLDocType2.prototype.isEqualNode = function (node) {
            if (!XMLDocType2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
              return false;
            }
            if (node.name !== this.name) {
              return false;
            }
            if (node.publicId !== this.publicId) {
              return false;
            }
            if (node.systemId !== this.systemId) {
              return false;
            }
            return true;
          };
          return XMLDocType2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLRaw.js
  var require_XMLRaw = __commonJS({
    "node_modules/xmlbuilder/lib/XMLRaw.js"(exports, module) {
      (function () {
        var NodeType, XMLNode, XMLRaw, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        NodeType = require_NodeType();
        XMLNode = require_XMLNode();
        module.exports = XMLRaw = function (superClass) {
          extend(XMLRaw2, superClass);
          function XMLRaw2(parent, text) {
            XMLRaw2.__super__.constructor.call(this, parent);
            if (text == null) {
              throw new Error("Missing raw text. " + this.debugInfo());
            }
            this.type = NodeType.Raw;
            this.value = this.stringify.raw(text);
          }
          XMLRaw2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLRaw2.prototype.toString = function (options) {
            return this.options.writer.raw(this, this.options.writer.filterOptions(options));
          };
          return XMLRaw2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLText.js
  var require_XMLText = __commonJS({
    "node_modules/xmlbuilder/lib/XMLText.js"(exports, module) {
      (function () {
        var NodeType, XMLCharacterData, XMLText, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        NodeType = require_NodeType();
        XMLCharacterData = require_XMLCharacterData();
        module.exports = XMLText = function (superClass) {
          extend(XMLText2, superClass);
          function XMLText2(parent, text) {
            XMLText2.__super__.constructor.call(this, parent);
            if (text == null) {
              throw new Error("Missing element text. " + this.debugInfo());
            }
            this.name = "#text";
            this.type = NodeType.Text;
            this.value = this.stringify.text(text);
          }
          Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
            get: function () {
              throw new Error("This DOM method is not implemented." + this.debugInfo());
            }
          });
          Object.defineProperty(XMLText2.prototype, "wholeText", {
            get: function () {
              var next, prev, str;
              str = "";
              prev = this.previousSibling;
              while (prev) {
                str = prev.data + str;
                prev = prev.previousSibling;
              }
              str += this.data;
              next = this.nextSibling;
              while (next) {
                str = str + next.data;
                next = next.nextSibling;
              }
              return str;
            }
          });
          XMLText2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLText2.prototype.toString = function (options) {
            return this.options.writer.text(this, this.options.writer.filterOptions(options));
          };
          XMLText2.prototype.splitText = function (offset) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLText2.prototype.replaceWholeText = function (content) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          return XMLText2;
        }(XMLCharacterData);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
  var require_XMLProcessingInstruction = __commonJS({
    "node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports, module) {
      (function () {
        var NodeType, XMLCharacterData, XMLProcessingInstruction, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        NodeType = require_NodeType();
        XMLCharacterData = require_XMLCharacterData();
        module.exports = XMLProcessingInstruction = function (superClass) {
          extend(XMLProcessingInstruction2, superClass);
          function XMLProcessingInstruction2(parent, target, value) {
            XMLProcessingInstruction2.__super__.constructor.call(this, parent);
            if (target == null) {
              throw new Error("Missing instruction target. " + this.debugInfo());
            }
            this.type = NodeType.ProcessingInstruction;
            this.target = this.stringify.insTarget(target);
            this.name = this.target;
            if (value) {
              this.value = this.stringify.insValue(value);
            }
          }
          XMLProcessingInstruction2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLProcessingInstruction2.prototype.toString = function (options) {
            return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
          };
          XMLProcessingInstruction2.prototype.isEqualNode = function (node) {
            if (!XMLProcessingInstruction2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
              return false;
            }
            if (node.target !== this.target) {
              return false;
            }
            return true;
          };
          return XMLProcessingInstruction2;
        }(XMLCharacterData);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDummy.js
  var require_XMLDummy = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDummy.js"(exports, module) {
      (function () {
        var NodeType, XMLDummy, XMLNode, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        module.exports = XMLDummy = function (superClass) {
          extend(XMLDummy2, superClass);
          function XMLDummy2(parent) {
            XMLDummy2.__super__.constructor.call(this, parent);
            this.type = NodeType.Dummy;
          }
          XMLDummy2.prototype.clone = function () {
            return Object.create(this);
          };
          XMLDummy2.prototype.toString = function (options) {
            return "";
          };
          return XMLDummy2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLNodeList.js
  var require_XMLNodeList = __commonJS({
    "node_modules/xmlbuilder/lib/XMLNodeList.js"(exports, module) {
      (function () {
        var XMLNodeList;
        module.exports = XMLNodeList = function () {
          function XMLNodeList2(nodes) {
            this.nodes = nodes;
          }
          Object.defineProperty(XMLNodeList2.prototype, "length", {
            get: function () {
              return this.nodes.length || 0;
            }
          });
          XMLNodeList2.prototype.clone = function () {
            return this.nodes = null;
          };
          XMLNodeList2.prototype.item = function (index) {
            return this.nodes[index] || null;
          };
          return XMLNodeList2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/DocumentPosition.js
  var require_DocumentPosition = __commonJS({
    "node_modules/xmlbuilder/lib/DocumentPosition.js"(exports, module) {
      (function () {
        module.exports = {
          Disconnected: 1,
          Preceding: 2,
          Following: 4,
          Contains: 8,
          ContainedBy: 16,
          ImplementationSpecific: 32
        };
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLNode.js
  var require_XMLNode = __commonJS({
    "node_modules/xmlbuilder/lib/XMLNode.js"(exports, module) {
      (function () {
        var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1, hasProp = {}.hasOwnProperty;
        ref1 = require_Utility(), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;
        XMLElement = null;
        XMLCData = null;
        XMLComment = null;
        XMLDeclaration = null;
        XMLDocType = null;
        XMLRaw = null;
        XMLText = null;
        XMLProcessingInstruction = null;
        XMLDummy = null;
        NodeType = null;
        XMLNodeList = null;
        XMLNamedNodeMap = null;
        DocumentPosition = null;
        module.exports = XMLNode = function () {
          function XMLNode2(parent1) {
            this.parent = parent1;
            if (this.parent) {
              this.options = this.parent.options;
              this.stringify = this.parent.stringify;
            }
            this.value = null;
            this.children = [];
            this.baseURI = null;
            if (!XMLElement) {
              XMLElement = require_XMLElement();
              XMLCData = require_XMLCData();
              XMLComment = require_XMLComment();
              XMLDeclaration = require_XMLDeclaration();
              XMLDocType = require_XMLDocType();
              XMLRaw = require_XMLRaw();
              XMLText = require_XMLText();
              XMLProcessingInstruction = require_XMLProcessingInstruction();
              XMLDummy = require_XMLDummy();
              NodeType = require_NodeType();
              XMLNodeList = require_XMLNodeList();
              XMLNamedNodeMap = require_XMLNamedNodeMap();
              DocumentPosition = require_DocumentPosition();
            }
          }
          Object.defineProperty(XMLNode2.prototype, "nodeName", {
            get: function () {
              return this.name;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "nodeType", {
            get: function () {
              return this.type;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "nodeValue", {
            get: function () {
              return this.value;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "parentNode", {
            get: function () {
              return this.parent;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "childNodes", {
            get: function () {
              if (!this.childNodeList || !this.childNodeList.nodes) {
                this.childNodeList = new XMLNodeList(this.children);
              }
              return this.childNodeList;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "firstChild", {
            get: function () {
              return this.children[0] || null;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "lastChild", {
            get: function () {
              return this.children[this.children.length - 1] || null;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "previousSibling", {
            get: function () {
              var i;
              i = this.parent.children.indexOf(this);
              return this.parent.children[i - 1] || null;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "nextSibling", {
            get: function () {
              var i;
              i = this.parent.children.indexOf(this);
              return this.parent.children[i + 1] || null;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
            get: function () {
              return this.document() || null;
            }
          });
          Object.defineProperty(XMLNode2.prototype, "textContent", {
            get: function () {
              var child, j, len, ref2, str;
              if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
                str = "";
                ref2 = this.children;
                for (j = 0, len = ref2.length; j < len; j++) {
                  child = ref2[j];
                  if (child.textContent) {
                    str += child.textContent;
                  }
                }
                return str;
              } else {
                return null;
              }
            },
            set: function (value) {
              throw new Error("This DOM method is not implemented." + this.debugInfo());
            }
          });
          XMLNode2.prototype.setParent = function (parent) {
            var child, j, len, ref2, results;
            this.parent = parent;
            if (parent) {
              this.options = parent.options;
              this.stringify = parent.stringify;
            }
            ref2 = this.children;
            results = [];
            for (j = 0, len = ref2.length; j < len; j++) {
              child = ref2[j];
              results.push(child.setParent(this));
            }
            return results;
          };
          XMLNode2.prototype.element = function (name, attributes, text) {
            var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
            lastChild = null;
            if (attributes === null && text == null) {
              ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
            }
            if (attributes == null) {
              attributes = {};
            }
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
              ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
            }
            if (name != null) {
              name = getValue(name);
            }
            if (Array.isArray(name)) {
              for (j = 0, len = name.length; j < len; j++) {
                item = name[j];
                lastChild = this.element(item);
              }
            } else if (isFunction(name)) {
              lastChild = this.element(name.apply());
            } else if (isObject(name)) {
              for (key in name) {
                if (!hasProp.call(name, key))
                  continue;
                val = name[key];
                if (isFunction(val)) {
                  val = val.apply();
                }
                if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                  lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
                } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                  lastChild = this.dummy();
                } else if (isObject(val) && isEmpty(val)) {
                  lastChild = this.element(key);
                } else if (!this.options.keepNullNodes && val == null) {
                  lastChild = this.dummy();
                } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                  for (k = 0, len1 = val.length; k < len1; k++) {
                    item = val[k];
                    childNode = {};
                    childNode[key] = item;
                    lastChild = this.element(childNode);
                  }
                } else if (isObject(val)) {
                  if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                    lastChild = this.element(val);
                  } else {
                    lastChild = this.element(key);
                    lastChild.element(val);
                  }
                } else {
                  lastChild = this.element(key, val);
                }
              }
            } else if (!this.options.keepNullNodes && text === null) {
              lastChild = this.dummy();
            } else {
              if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
                lastChild = this.text(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
                lastChild = this.cdata(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
                lastChild = this.comment(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
                lastChild = this.raw(text);
              } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
                lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
              } else {
                lastChild = this.node(name, attributes, text);
              }
            }
            if (lastChild == null) {
              throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
            }
            return lastChild;
          };
          XMLNode2.prototype.insertBefore = function (name, attributes, text) {
            var child, i, newChild, refChild, removed;
            if (name != null ? name.type : void 0) {
              newChild = name;
              refChild = attributes;
              newChild.setParent(this);
              if (refChild) {
                i = children.indexOf(refChild);
                removed = children.splice(i);
                children.push(newChild);
                Array.prototype.push.apply(children, removed);
              } else {
                children.push(newChild);
              }
              return newChild;
            } else {
              if (this.isRoot) {
                throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
              }
              i = this.parent.children.indexOf(this);
              removed = this.parent.children.splice(i);
              child = this.parent.element(name, attributes, text);
              Array.prototype.push.apply(this.parent.children, removed);
              return child;
            }
          };
          XMLNode2.prototype.insertAfter = function (name, attributes, text) {
            var child, i, removed;
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          };
          XMLNode2.prototype.remove = function () {
            var i, ref2;
            if (this.isRoot) {
              throw new Error("Cannot remove the root element. " + this.debugInfo());
            }
            i = this.parent.children.indexOf(this);
            [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
            return this.parent;
          };
          XMLNode2.prototype.node = function (name, attributes, text) {
            var child, ref2;
            if (name != null) {
              name = getValue(name);
            }
            attributes || (attributes = {});
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
              ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
            }
            child = new XMLElement(this, name, attributes);
            if (text != null) {
              child.text(text);
            }
            this.children.push(child);
            return child;
          };
          XMLNode2.prototype.text = function (value) {
            var child;
            if (isObject(value)) {
              this.element(value);
            }
            child = new XMLText(this, value);
            this.children.push(child);
            return this;
          };
          XMLNode2.prototype.cdata = function (value) {
            var child;
            child = new XMLCData(this, value);
            this.children.push(child);
            return this;
          };
          XMLNode2.prototype.comment = function (value) {
            var child;
            child = new XMLComment(this, value);
            this.children.push(child);
            return this;
          };
          XMLNode2.prototype.commentBefore = function (value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.comment(value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          };
          XMLNode2.prototype.commentAfter = function (value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.comment(value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          };
          XMLNode2.prototype.raw = function (value) {
            var child;
            child = new XMLRaw(this, value);
            this.children.push(child);
            return this;
          };
          XMLNode2.prototype.dummy = function () {
            var child;
            child = new XMLDummy(this);
            return child;
          };
          XMLNode2.prototype.instruction = function (target, value) {
            var insTarget, insValue, instruction, j, len;
            if (target != null) {
              target = getValue(target);
            }
            if (value != null) {
              value = getValue(value);
            }
            if (Array.isArray(target)) {
              for (j = 0, len = target.length; j < len; j++) {
                insTarget = target[j];
                this.instruction(insTarget);
              }
            } else if (isObject(target)) {
              for (insTarget in target) {
                if (!hasProp.call(target, insTarget))
                  continue;
                insValue = target[insTarget];
                this.instruction(insTarget, insValue);
              }
            } else {
              if (isFunction(value)) {
                value = value.apply();
              }
              instruction = new XMLProcessingInstruction(this, target, value);
              this.children.push(instruction);
            }
            return this;
          };
          XMLNode2.prototype.instructionBefore = function (target, value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.instruction(target, value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          };
          XMLNode2.prototype.instructionAfter = function (target, value) {
            var child, i, removed;
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i + 1);
            child = this.parent.instruction(target, value);
            Array.prototype.push.apply(this.parent.children, removed);
            return this;
          };
          XMLNode2.prototype.declaration = function (version, encoding, standalone) {
            var doc, xmldec;
            doc = this.document();
            xmldec = new XMLDeclaration(doc, version, encoding, standalone);
            if (doc.children.length === 0) {
              doc.children.unshift(xmldec);
            } else if (doc.children[0].type === NodeType.Declaration) {
              doc.children[0] = xmldec;
            } else {
              doc.children.unshift(xmldec);
            }
            return doc.root() || doc;
          };
          XMLNode2.prototype.dtd = function (pubID, sysID) {
            var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
            doc = this.document();
            doctype = new XMLDocType(doc, pubID, sysID);
            ref2 = doc.children;
            for (i = j = 0, len = ref2.length; j < len; i = ++j) {
              child = ref2[i];
              if (child.type === NodeType.DocType) {
                doc.children[i] = doctype;
                return doctype;
              }
            }
            ref3 = doc.children;
            for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
              child = ref3[i];
              if (child.isRoot) {
                doc.children.splice(i, 0, doctype);
                return doctype;
              }
            }
            doc.children.push(doctype);
            return doctype;
          };
          XMLNode2.prototype.up = function () {
            if (this.isRoot) {
              throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
            }
            return this.parent;
          };
          XMLNode2.prototype.root = function () {
            var node;
            node = this;
            while (node) {
              if (node.type === NodeType.Document) {
                return node.rootObject;
              } else if (node.isRoot) {
                return node;
              } else {
                node = node.parent;
              }
            }
          };
          XMLNode2.prototype.document = function () {
            var node;
            node = this;
            while (node) {
              if (node.type === NodeType.Document) {
                return node;
              } else {
                node = node.parent;
              }
            }
          };
          XMLNode2.prototype.end = function (options) {
            return this.document().end(options);
          };
          XMLNode2.prototype.prev = function () {
            var i;
            i = this.parent.children.indexOf(this);
            if (i < 1) {
              throw new Error("Already at the first node. " + this.debugInfo());
            }
            return this.parent.children[i - 1];
          };
          XMLNode2.prototype.next = function () {
            var i;
            i = this.parent.children.indexOf(this);
            if (i === -1 || i === this.parent.children.length - 1) {
              throw new Error("Already at the last node. " + this.debugInfo());
            }
            return this.parent.children[i + 1];
          };
          XMLNode2.prototype.importDocument = function (doc) {
            var clonedRoot;
            clonedRoot = doc.root().clone();
            clonedRoot.parent = this;
            clonedRoot.isRoot = false;
            this.children.push(clonedRoot);
            return this;
          };
          XMLNode2.prototype.debugInfo = function (name) {
            var ref2, ref3;
            name = name || this.name;
            if (name == null && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
              return "";
            } else if (name == null) {
              return "parent: <" + this.parent.name + ">";
            } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
              return "node: <" + name + ">";
            } else {
              return "node: <" + name + ">, parent: <" + this.parent.name + ">";
            }
          };
          XMLNode2.prototype.ele = function (name, attributes, text) {
            return this.element(name, attributes, text);
          };
          XMLNode2.prototype.nod = function (name, attributes, text) {
            return this.node(name, attributes, text);
          };
          XMLNode2.prototype.txt = function (value) {
            return this.text(value);
          };
          XMLNode2.prototype.dat = function (value) {
            return this.cdata(value);
          };
          XMLNode2.prototype.com = function (value) {
            return this.comment(value);
          };
          XMLNode2.prototype.ins = function (target, value) {
            return this.instruction(target, value);
          };
          XMLNode2.prototype.doc = function () {
            return this.document();
          };
          XMLNode2.prototype.dec = function (version, encoding, standalone) {
            return this.declaration(version, encoding, standalone);
          };
          XMLNode2.prototype.e = function (name, attributes, text) {
            return this.element(name, attributes, text);
          };
          XMLNode2.prototype.n = function (name, attributes, text) {
            return this.node(name, attributes, text);
          };
          XMLNode2.prototype.t = function (value) {
            return this.text(value);
          };
          XMLNode2.prototype.d = function (value) {
            return this.cdata(value);
          };
          XMLNode2.prototype.c = function (value) {
            return this.comment(value);
          };
          XMLNode2.prototype.r = function (value) {
            return this.raw(value);
          };
          XMLNode2.prototype.i = function (target, value) {
            return this.instruction(target, value);
          };
          XMLNode2.prototype.u = function () {
            return this.up();
          };
          XMLNode2.prototype.importXMLBuilder = function (doc) {
            return this.importDocument(doc);
          };
          XMLNode2.prototype.replaceChild = function (newChild, oldChild) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.removeChild = function (oldChild) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.appendChild = function (newChild) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.hasChildNodes = function () {
            return this.children.length !== 0;
          };
          XMLNode2.prototype.cloneNode = function (deep) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.normalize = function () {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.isSupported = function (feature, version) {
            return true;
          };
          XMLNode2.prototype.hasAttributes = function () {
            return this.attribs.length !== 0;
          };
          XMLNode2.prototype.compareDocumentPosition = function (other) {
            var ref, res;
            ref = this;
            if (ref === other) {
              return 0;
            } else if (this.document() !== other.document()) {
              res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
              if (Math.random() < 0.5) {
                res |= DocumentPosition.Preceding;
              } else {
                res |= DocumentPosition.Following;
              }
              return res;
            } else if (ref.isAncestor(other)) {
              return DocumentPosition.Contains | DocumentPosition.Preceding;
            } else if (ref.isDescendant(other)) {
              return DocumentPosition.Contains | DocumentPosition.Following;
            } else if (ref.isPreceding(other)) {
              return DocumentPosition.Preceding;
            } else {
              return DocumentPosition.Following;
            }
          };
          XMLNode2.prototype.isSameNode = function (other) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.lookupPrefix = function (namespaceURI) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.isDefaultNamespace = function (namespaceURI) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.lookupNamespaceURI = function (prefix) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.isEqualNode = function (node) {
            var i, j, ref2;
            if (node.nodeType !== this.nodeType) {
              return false;
            }
            if (node.children.length !== this.children.length) {
              return false;
            }
            for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
              if (!this.children[i].isEqualNode(node.children[i])) {
                return false;
              }
            }
            return true;
          };
          XMLNode2.prototype.getFeature = function (feature, version) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.setUserData = function (key, data, handler) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.getUserData = function (key) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLNode2.prototype.contains = function (other) {
            if (!other) {
              return false;
            }
            return other === this || this.isDescendant(other);
          };
          XMLNode2.prototype.isDescendant = function (node) {
            var child, isDescendantChild, j, len, ref2;
            ref2 = this.children;
            for (j = 0, len = ref2.length; j < len; j++) {
              child = ref2[j];
              if (node === child) {
                return true;
              }
              isDescendantChild = child.isDescendant(node);
              if (isDescendantChild) {
                return true;
              }
            }
            return false;
          };
          XMLNode2.prototype.isAncestor = function (node) {
            return node.isDescendant(this);
          };
          XMLNode2.prototype.isPreceding = function (node) {
            var nodePos, thisPos;
            nodePos = this.treePosition(node);
            thisPos = this.treePosition(this);
            if (nodePos === -1 || thisPos === -1) {
              return false;
            } else {
              return nodePos < thisPos;
            }
          };
          XMLNode2.prototype.isFollowing = function (node) {
            var nodePos, thisPos;
            nodePos = this.treePosition(node);
            thisPos = this.treePosition(this);
            if (nodePos === -1 || thisPos === -1) {
              return false;
            } else {
              return nodePos > thisPos;
            }
          };
          XMLNode2.prototype.treePosition = function (node) {
            var found, pos;
            pos = 0;
            found = false;
            this.foreachTreeNode(this.document(), function (childNode) {
              pos++;
              if (!found && childNode === node) {
                return found = true;
              }
            });
            if (found) {
              return pos;
            } else {
              return -1;
            }
          };
          XMLNode2.prototype.foreachTreeNode = function (node, func) {
            var child, j, len, ref2, res;
            node || (node = this.document());
            ref2 = node.children;
            for (j = 0, len = ref2.length; j < len; j++) {
              child = ref2[j];
              if (res = func(child)) {
                return res;
              } else {
                res = this.foreachTreeNode(child, func);
                if (res) {
                  return res;
                }
              }
            }
          };
          return XMLNode2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLStringifier.js
  var require_XMLStringifier = __commonJS({
    "node_modules/xmlbuilder/lib/XMLStringifier.js"(exports, module) {
      (function () {
        var XMLStringifier, bind = function (fn, me) {
          return function () {
            return fn.apply(me, arguments);
          };
        }, hasProp = {}.hasOwnProperty;
        module.exports = XMLStringifier = function () {
          function XMLStringifier2(options) {
            this.assertLegalName = bind(this.assertLegalName, this);
            this.assertLegalChar = bind(this.assertLegalChar, this);
            var key, ref, value;
            options || (options = {});
            this.options = options;
            if (!this.options.version) {
              this.options.version = "1.0";
            }
            ref = options.stringify || {};
            for (key in ref) {
              if (!hasProp.call(ref, key))
                continue;
              value = ref[key];
              this[key] = value;
            }
          }
          XMLStringifier2.prototype.name = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalName("" + val || "");
          };
          XMLStringifier2.prototype.text = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar(this.textEscape("" + val || ""));
          };
          XMLStringifier2.prototype.cdata = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            val = val.replace("]]>", "]]]]><![CDATA[>");
            return this.assertLegalChar(val);
          };
          XMLStringifier2.prototype.comment = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (val.match(/--/)) {
              throw new Error("Comment text cannot contain double-hypen: " + val);
            }
            return this.assertLegalChar(val);
          };
          XMLStringifier2.prototype.raw = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return "" + val || "";
          };
          XMLStringifier2.prototype.attValue = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar(this.attEscape(val = "" + val || ""));
          };
          XMLStringifier2.prototype.insTarget = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.insValue = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (val.match(/\?>/)) {
              throw new Error("Invalid processing instruction value: " + val);
            }
            return this.assertLegalChar(val);
          };
          XMLStringifier2.prototype.xmlVersion = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (!val.match(/1\.[0-9]+/)) {
              throw new Error("Invalid version number: " + val);
            }
            return val;
          };
          XMLStringifier2.prototype.xmlEncoding = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            val = "" + val || "";
            if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
              throw new Error("Invalid encoding: " + val);
            }
            return this.assertLegalChar(val);
          };
          XMLStringifier2.prototype.xmlStandalone = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            if (val) {
              return "yes";
            } else {
              return "no";
            }
          };
          XMLStringifier2.prototype.dtdPubID = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.dtdSysID = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.dtdElementValue = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.dtdAttType = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.dtdAttDefault = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.dtdEntityValue = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.dtdNData = function (val) {
            if (this.options.noValidation) {
              return val;
            }
            return this.assertLegalChar("" + val || "");
          };
          XMLStringifier2.prototype.convertAttKey = "@";
          XMLStringifier2.prototype.convertPIKey = "?";
          XMLStringifier2.prototype.convertTextKey = "#text";
          XMLStringifier2.prototype.convertCDataKey = "#cdata";
          XMLStringifier2.prototype.convertCommentKey = "#comment";
          XMLStringifier2.prototype.convertRawKey = "#raw";
          XMLStringifier2.prototype.assertLegalChar = function (str) {
            var regex, res;
            if (this.options.noValidation) {
              return str;
            }
            regex = "";
            if (this.options.version === "1.0") {
              regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
              if (res = str.match(regex)) {
                throw new Error("Invalid character in string: " + str + " at index " + res.index);
              }
            } else if (this.options.version === "1.1") {
              regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
              if (res = str.match(regex)) {
                throw new Error("Invalid character in string: " + str + " at index " + res.index);
              }
            }
            return str;
          };
          XMLStringifier2.prototype.assertLegalName = function (str) {
            var regex;
            if (this.options.noValidation) {
              return str;
            }
            this.assertLegalChar(str);
            regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
            if (!str.match(regex)) {
              throw new Error("Invalid character in name");
            }
            return str;
          };
          XMLStringifier2.prototype.textEscape = function (str) {
            var ampregex;
            if (this.options.noValidation) {
              return str;
            }
            ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
            return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
          };
          XMLStringifier2.prototype.attEscape = function (str) {
            var ampregex;
            if (this.options.noValidation) {
              return str;
            }
            ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
            return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
          };
          return XMLStringifier2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/WriterState.js
  var require_WriterState = __commonJS({
    "node_modules/xmlbuilder/lib/WriterState.js"(exports, module) {
      (function () {
        module.exports = {
          None: 0,
          OpenTag: 1,
          InsideTag: 2,
          CloseTag: 3
        };
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLWriterBase.js
  var require_XMLWriterBase = __commonJS({
    "node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports, module) {
      (function () {
        var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign, hasProp = {}.hasOwnProperty;
        assign = require_Utility().assign;
        NodeType = require_NodeType();
        XMLDeclaration = require_XMLDeclaration();
        XMLDocType = require_XMLDocType();
        XMLCData = require_XMLCData();
        XMLComment = require_XMLComment();
        XMLElement = require_XMLElement();
        XMLRaw = require_XMLRaw();
        XMLText = require_XMLText();
        XMLProcessingInstruction = require_XMLProcessingInstruction();
        XMLDummy = require_XMLDummy();
        XMLDTDAttList = require_XMLDTDAttList();
        XMLDTDElement = require_XMLDTDElement();
        XMLDTDEntity = require_XMLDTDEntity();
        XMLDTDNotation = require_XMLDTDNotation();
        WriterState = require_WriterState();
        module.exports = XMLWriterBase = function () {
          function XMLWriterBase2(options) {
            var key, ref, value;
            options || (options = {});
            this.options = options;
            ref = options.writer || {};
            for (key in ref) {
              if (!hasProp.call(ref, key))
                continue;
              value = ref[key];
              this["_" + key] = this[key];
              this[key] = value;
            }
          }
          XMLWriterBase2.prototype.filterOptions = function (options) {
            var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
            options || (options = {});
            options = assign({}, this.options, options);
            filteredOptions = {
              writer: this
            };
            filteredOptions.pretty = options.pretty || false;
            filteredOptions.allowEmpty = options.allowEmpty || false;
            filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
            filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
            filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
            filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
            filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : "";
            if (filteredOptions.spaceBeforeSlash === true) {
              filteredOptions.spaceBeforeSlash = " ";
            }
            filteredOptions.suppressPrettyCount = 0;
            filteredOptions.user = {};
            filteredOptions.state = WriterState.None;
            return filteredOptions;
          };
          XMLWriterBase2.prototype.indent = function (node, options, level) {
            var indentLevel;
            if (!options.pretty || options.suppressPrettyCount) {
              return "";
            } else if (options.pretty) {
              indentLevel = (level || 0) + options.offset + 1;
              if (indentLevel > 0) {
                return new Array(indentLevel).join(options.indent);
              }
            }
            return "";
          };
          XMLWriterBase2.prototype.endline = function (node, options, level) {
            if (!options.pretty || options.suppressPrettyCount) {
              return "";
            } else {
              return options.newline;
            }
          };
          XMLWriterBase2.prototype.attribute = function (att, options, level) {
            var r;
            this.openAttribute(att, options, level);
            r = " " + att.name + '="' + att.value + '"';
            this.closeAttribute(att, options, level);
            return r;
          };
          XMLWriterBase2.prototype.cdata = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<![CDATA[";
            options.state = WriterState.InsideTag;
            r += node.value;
            options.state = WriterState.CloseTag;
            r += "]]>" + this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.comment = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<!-- ";
            options.state = WriterState.InsideTag;
            r += node.value;
            options.state = WriterState.CloseTag;
            r += " -->" + this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.declaration = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<?xml";
            options.state = WriterState.InsideTag;
            r += ' version="' + node.version + '"';
            if (node.encoding != null) {
              r += ' encoding="' + node.encoding + '"';
            }
            if (node.standalone != null) {
              r += ' standalone="' + node.standalone + '"';
            }
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + "?>";
            r += this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.docType = function (node, options, level) {
            var child, i, len, r, ref;
            level || (level = 0);
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level);
            r += "<!DOCTYPE " + node.root().name;
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.children.length > 0) {
              r += " [";
              r += this.endline(node, options, level);
              options.state = WriterState.InsideTag;
              ref = node.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                r += this.writeChildNode(child, options, level + 1);
              }
              options.state = WriterState.CloseTag;
              r += "]";
            }
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + ">";
            r += this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.element = function (node, options, level) {
            var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
            level || (level = 0);
            prettySuppressed = false;
            r = "";
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r += this.indent(node, options, level) + "<" + node.name;
            ref = node.attribs;
            for (name in ref) {
              if (!hasProp.call(ref, name))
                continue;
              att = ref[name];
              r += this.attribute(att, options, level);
            }
            childNodeCount = node.children.length;
            firstChildNode = childNodeCount === 0 ? null : node.children[0];
            if (childNodeCount === 0 || node.children.every(function (e) {
              return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
            })) {
              if (options.allowEmpty) {
                r += ">";
                options.state = WriterState.CloseTag;
                r += "</" + node.name + ">" + this.endline(node, options, level);
              } else {
                options.state = WriterState.CloseTag;
                r += options.spaceBeforeSlash + "/>" + this.endline(node, options, level);
              }
            } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
              r += ">";
              options.state = WriterState.InsideTag;
              options.suppressPrettyCount++;
              prettySuppressed = true;
              r += this.writeChildNode(firstChildNode, options, level + 1);
              options.suppressPrettyCount--;
              prettySuppressed = false;
              options.state = WriterState.CloseTag;
              r += "</" + node.name + ">" + this.endline(node, options, level);
            } else {
              if (options.dontPrettyTextNodes) {
                ref1 = node.children;
                for (i = 0, len = ref1.length; i < len; i++) {
                  child = ref1[i];
                  if ((child.type === NodeType.Text || child.type === NodeType.Raw) && child.value != null) {
                    options.suppressPrettyCount++;
                    prettySuppressed = true;
                    break;
                  }
                }
              }
              r += ">" + this.endline(node, options, level);
              options.state = WriterState.InsideTag;
              ref2 = node.children;
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                child = ref2[j];
                r += this.writeChildNode(child, options, level + 1);
              }
              options.state = WriterState.CloseTag;
              r += this.indent(node, options, level) + "</" + node.name + ">";
              if (prettySuppressed) {
                options.suppressPrettyCount--;
              }
              r += this.endline(node, options, level);
              options.state = WriterState.None;
            }
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.writeChildNode = function (node, options, level) {
            switch (node.type) {
              case NodeType.CData:
                return this.cdata(node, options, level);
              case NodeType.Comment:
                return this.comment(node, options, level);
              case NodeType.Element:
                return this.element(node, options, level);
              case NodeType.Raw:
                return this.raw(node, options, level);
              case NodeType.Text:
                return this.text(node, options, level);
              case NodeType.ProcessingInstruction:
                return this.processingInstruction(node, options, level);
              case NodeType.Dummy:
                return "";
              case NodeType.Declaration:
                return this.declaration(node, options, level);
              case NodeType.DocType:
                return this.docType(node, options, level);
              case NodeType.AttributeDeclaration:
                return this.dtdAttList(node, options, level);
              case NodeType.ElementDeclaration:
                return this.dtdElement(node, options, level);
              case NodeType.EntityDeclaration:
                return this.dtdEntity(node, options, level);
              case NodeType.NotationDeclaration:
                return this.dtdNotation(node, options, level);
              default:
                throw new Error("Unknown XML node type: " + node.constructor.name);
            }
          };
          XMLWriterBase2.prototype.processingInstruction = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<?";
            options.state = WriterState.InsideTag;
            r += node.target;
            if (node.value) {
              r += " " + node.value;
            }
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + "?>";
            r += this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.raw = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level);
            options.state = WriterState.InsideTag;
            r += node.value;
            options.state = WriterState.CloseTag;
            r += this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.text = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level);
            options.state = WriterState.InsideTag;
            r += node.value;
            options.state = WriterState.CloseTag;
            r += this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.dtdAttList = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<!ATTLIST";
            options.state = WriterState.InsideTag;
            r += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
            if (node.defaultValueType !== "#DEFAULT") {
              r += " " + node.defaultValueType;
            }
            if (node.defaultValue) {
              r += ' "' + node.defaultValue + '"';
            }
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.dtdElement = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<!ELEMENT";
            options.state = WriterState.InsideTag;
            r += " " + node.name + " " + node.value;
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.dtdEntity = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<!ENTITY";
            options.state = WriterState.InsideTag;
            if (node.pe) {
              r += " %";
            }
            r += " " + node.name;
            if (node.value) {
              r += ' "' + node.value + '"';
            } else {
              if (node.pubID && node.sysID) {
                r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
              } else if (node.sysID) {
                r += ' SYSTEM "' + node.sysID + '"';
              }
              if (node.nData) {
                r += " NDATA " + node.nData;
              }
            }
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.dtdNotation = function (node, options, level) {
            var r;
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            r = this.indent(node, options, level) + "<!NOTATION";
            options.state = WriterState.InsideTag;
            r += " " + node.name;
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.pubID) {
              r += ' PUBLIC "' + node.pubID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            options.state = WriterState.CloseTag;
            r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
            options.state = WriterState.None;
            this.closeNode(node, options, level);
            return r;
          };
          XMLWriterBase2.prototype.openNode = function (node, options, level) {
          };
          XMLWriterBase2.prototype.closeNode = function (node, options, level) {
          };
          XMLWriterBase2.prototype.openAttribute = function (att, options, level) {
          };
          XMLWriterBase2.prototype.closeAttribute = function (att, options, level) {
          };
          return XMLWriterBase2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLStringWriter.js
  var require_XMLStringWriter = __commonJS({
    "node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports, module) {
      (function () {
        var XMLStringWriter, XMLWriterBase, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        XMLWriterBase = require_XMLWriterBase();
        module.exports = XMLStringWriter = function (superClass) {
          extend(XMLStringWriter2, superClass);
          function XMLStringWriter2(options) {
            XMLStringWriter2.__super__.constructor.call(this, options);
          }
          XMLStringWriter2.prototype.document = function (doc, options) {
            var child, i, len, r, ref;
            options = this.filterOptions(options);
            r = "";
            ref = doc.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              r += this.writeChildNode(child, options, 0);
            }
            if (options.pretty && r.slice(-options.newline.length) === options.newline) {
              r = r.slice(0, -options.newline.length);
            }
            return r;
          };
          return XMLStringWriter2;
        }(XMLWriterBase);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDocument.js
  var require_XMLDocument = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDocument.js"(exports, module) {
      (function () {
        var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        isPlainObject = require_Utility().isPlainObject;
        XMLDOMImplementation = require_XMLDOMImplementation();
        XMLDOMConfiguration = require_XMLDOMConfiguration();
        XMLNode = require_XMLNode();
        NodeType = require_NodeType();
        XMLStringifier = require_XMLStringifier();
        XMLStringWriter = require_XMLStringWriter();
        module.exports = XMLDocument = function (superClass) {
          extend(XMLDocument2, superClass);
          function XMLDocument2(options) {
            XMLDocument2.__super__.constructor.call(this, null);
            this.name = "#document";
            this.type = NodeType.Document;
            this.documentURI = null;
            this.domConfig = new XMLDOMConfiguration();
            options || (options = {});
            if (!options.writer) {
              options.writer = new XMLStringWriter();
            }
            this.options = options;
            this.stringify = new XMLStringifier(options);
          }
          Object.defineProperty(XMLDocument2.prototype, "implementation", {
            value: new XMLDOMImplementation()
          });
          Object.defineProperty(XMLDocument2.prototype, "doctype", {
            get: function () {
              var child, i, len, ref;
              ref = this.children;
              for (i = 0, len = ref.length; i < len; i++) {
                child = ref[i];
                if (child.type === NodeType.DocType) {
                  return child;
                }
              }
              return null;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "documentElement", {
            get: function () {
              return this.rootObject || null;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
            get: function () {
              return null;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
            get: function () {
              return false;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
            get: function () {
              if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
                return this.children[0].encoding;
              } else {
                return null;
              }
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
            get: function () {
              if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
                return this.children[0].standalone === "yes";
              } else {
                return false;
              }
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
            get: function () {
              if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
                return this.children[0].version;
              } else {
                return "1.0";
              }
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "URL", {
            get: function () {
              return this.documentURI;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "origin", {
            get: function () {
              return null;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "compatMode", {
            get: function () {
              return null;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "characterSet", {
            get: function () {
              return null;
            }
          });
          Object.defineProperty(XMLDocument2.prototype, "contentType", {
            get: function () {
              return null;
            }
          });
          XMLDocument2.prototype.end = function (writer) {
            var writerOptions;
            writerOptions = {};
            if (!writer) {
              writer = this.options.writer;
            } else if (isPlainObject(writer)) {
              writerOptions = writer;
              writer = this.options.writer;
            }
            return writer.document(this, writer.filterOptions(writerOptions));
          };
          XMLDocument2.prototype.toString = function (options) {
            return this.options.writer.document(this, this.options.writer.filterOptions(options));
          };
          XMLDocument2.prototype.createElement = function (tagName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createDocumentFragment = function () {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createTextNode = function (data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createComment = function (data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createCDATASection = function (data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createProcessingInstruction = function (target, data) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createAttribute = function (name) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createEntityReference = function (name) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.getElementsByTagName = function (tagname) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.importNode = function (importedNode, deep) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createElementNS = function (namespaceURI, qualifiedName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createAttributeNS = function (namespaceURI, qualifiedName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.getElementsByTagNameNS = function (namespaceURI, localName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.getElementById = function (elementId) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.adoptNode = function (source) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.normalizeDocument = function () {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.renameNode = function (node, namespaceURI, qualifiedName) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.getElementsByClassName = function (classNames) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createEvent = function (eventInterface) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createRange = function () {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createNodeIterator = function (root, whatToShow, filter) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          XMLDocument2.prototype.createTreeWalker = function (root, whatToShow, filter) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          };
          return XMLDocument2;
        }(XMLNode);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLDocumentCB.js
  var require_XMLDocumentCB = __commonJS({
    "node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports, module) {
      (function () {
        var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
        ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
        NodeType = require_NodeType();
        XMLDocument = require_XMLDocument();
        XMLElement = require_XMLElement();
        XMLCData = require_XMLCData();
        XMLComment = require_XMLComment();
        XMLRaw = require_XMLRaw();
        XMLText = require_XMLText();
        XMLProcessingInstruction = require_XMLProcessingInstruction();
        XMLDeclaration = require_XMLDeclaration();
        XMLDocType = require_XMLDocType();
        XMLDTDAttList = require_XMLDTDAttList();
        XMLDTDEntity = require_XMLDTDEntity();
        XMLDTDElement = require_XMLDTDElement();
        XMLDTDNotation = require_XMLDTDNotation();
        XMLAttribute = require_XMLAttribute();
        XMLStringifier = require_XMLStringifier();
        XMLStringWriter = require_XMLStringWriter();
        WriterState = require_WriterState();
        module.exports = XMLDocumentCB = function () {
          function XMLDocumentCB2(options, onData, onEnd) {
            var writerOptions;
            this.name = "?xml";
            this.type = NodeType.Document;
            options || (options = {});
            writerOptions = {};
            if (!options.writer) {
              options.writer = new XMLStringWriter();
            } else if (isPlainObject(options.writer)) {
              writerOptions = options.writer;
              options.writer = new XMLStringWriter();
            }
            this.options = options;
            this.writer = options.writer;
            this.writerOptions = this.writer.filterOptions(writerOptions);
            this.stringify = new XMLStringifier(options);
            this.onDataCallback = onData || function () {
            };
            this.onEndCallback = onEnd || function () {
            };
            this.currentNode = null;
            this.currentLevel = -1;
            this.openTags = {};
            this.documentStarted = false;
            this.documentCompleted = false;
            this.root = null;
          }
          XMLDocumentCB2.prototype.createChildNode = function (node) {
            var att, attName, attributes, child, i, len, ref1, ref2;
            switch (node.type) {
              case NodeType.CData:
                this.cdata(node.value);
                break;
              case NodeType.Comment:
                this.comment(node.value);
                break;
              case NodeType.Element:
                attributes = {};
                ref1 = node.attribs;
                for (attName in ref1) {
                  if (!hasProp.call(ref1, attName))
                    continue;
                  att = ref1[attName];
                  attributes[attName] = att.value;
                }
                this.node(node.name, attributes);
                break;
              case NodeType.Dummy:
                this.dummy();
                break;
              case NodeType.Raw:
                this.raw(node.value);
                break;
              case NodeType.Text:
                this.text(node.value);
                break;
              case NodeType.ProcessingInstruction:
                this.instruction(node.target, node.value);
                break;
              default:
                throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
            }
            ref2 = node.children;
            for (i = 0, len = ref2.length; i < len; i++) {
              child = ref2[i];
              this.createChildNode(child);
              if (child.type === NodeType.Element) {
                this.up();
              }
            }
            return this;
          };
          XMLDocumentCB2.prototype.dummy = function () {
            return this;
          };
          XMLDocumentCB2.prototype.node = function (name, attributes, text) {
            var ref1;
            if (name == null) {
              throw new Error("Missing node name.");
            }
            if (this.root && this.currentLevel === -1) {
              throw new Error("Document can only have one root node. " + this.debugInfo(name));
            }
            this.openCurrent();
            name = getValue(name);
            if (attributes == null) {
              attributes = {};
            }
            attributes = getValue(attributes);
            if (!isObject(attributes)) {
              ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
            }
            this.currentNode = new XMLElement(this, name, attributes);
            this.currentNode.children = false;
            this.currentLevel++;
            this.openTags[this.currentLevel] = this.currentNode;
            if (text != null) {
              this.text(text);
            }
            return this;
          };
          XMLDocumentCB2.prototype.element = function (name, attributes, text) {
            var child, i, len, oldValidationFlag, ref1, root;
            if (this.currentNode && this.currentNode.type === NodeType.DocType) {
              this.dtdElement.apply(this, arguments);
            } else {
              if (Array.isArray(name) || isObject(name) || isFunction(name)) {
                oldValidationFlag = this.options.noValidation;
                this.options.noValidation = true;
                root = new XMLDocument(this.options).element("TEMP_ROOT");
                root.element(name);
                this.options.noValidation = oldValidationFlag;
                ref1 = root.children;
                for (i = 0, len = ref1.length; i < len; i++) {
                  child = ref1[i];
                  this.createChildNode(child);
                  if (child.type === NodeType.Element) {
                    this.up();
                  }
                }
              } else {
                this.node(name, attributes, text);
              }
            }
            return this;
          };
          XMLDocumentCB2.prototype.attribute = function (name, value) {
            var attName, attValue;
            if (!this.currentNode || this.currentNode.children) {
              throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
            }
            if (name != null) {
              name = getValue(name);
            }
            if (isObject(name)) {
              for (attName in name) {
                if (!hasProp.call(name, attName))
                  continue;
                attValue = name[attName];
                this.attribute(attName, attValue);
              }
            } else {
              if (isFunction(value)) {
                value = value.apply();
              }
              if (this.options.keepNullAttributes && value == null) {
                this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
              } else if (value != null) {
                this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
              }
            }
            return this;
          };
          XMLDocumentCB2.prototype.text = function (value) {
            var node;
            this.openCurrent();
            node = new XMLText(this, value);
            this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.cdata = function (value) {
            var node;
            this.openCurrent();
            node = new XMLCData(this, value);
            this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.comment = function (value) {
            var node;
            this.openCurrent();
            node = new XMLComment(this, value);
            this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.raw = function (value) {
            var node;
            this.openCurrent();
            node = new XMLRaw(this, value);
            this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.instruction = function (target, value) {
            var i, insTarget, insValue, len, node;
            this.openCurrent();
            if (target != null) {
              target = getValue(target);
            }
            if (value != null) {
              value = getValue(value);
            }
            if (Array.isArray(target)) {
              for (i = 0, len = target.length; i < len; i++) {
                insTarget = target[i];
                this.instruction(insTarget);
              }
            } else if (isObject(target)) {
              for (insTarget in target) {
                if (!hasProp.call(target, insTarget))
                  continue;
                insValue = target[insTarget];
                this.instruction(insTarget, insValue);
              }
            } else {
              if (isFunction(value)) {
                value = value.apply();
              }
              node = new XMLProcessingInstruction(this, target, value);
              this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            }
            return this;
          };
          XMLDocumentCB2.prototype.declaration = function (version, encoding, standalone) {
            var node;
            this.openCurrent();
            if (this.documentStarted) {
              throw new Error("declaration() must be the first node.");
            }
            node = new XMLDeclaration(this, version, encoding, standalone);
            this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.doctype = function (root, pubID, sysID) {
            this.openCurrent();
            if (root == null) {
              throw new Error("Missing root node name.");
            }
            if (this.root) {
              throw new Error("dtd() must come before the root node.");
            }
            this.currentNode = new XMLDocType(this, pubID, sysID);
            this.currentNode.rootNodeName = root;
            this.currentNode.children = false;
            this.currentLevel++;
            this.openTags[this.currentLevel] = this.currentNode;
            return this;
          };
          XMLDocumentCB2.prototype.dtdElement = function (name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDElement(this, name, value);
            this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.attList = function (elementName, attributeName, attributeType, defaultValueType, defaultValue) {
            var node;
            this.openCurrent();
            node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
            this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.entity = function (name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDEntity(this, false, name, value);
            this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.pEntity = function (name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDEntity(this, true, name, value);
            this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.notation = function (name, value) {
            var node;
            this.openCurrent();
            node = new XMLDTDNotation(this, name, value);
            this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
            return this;
          };
          XMLDocumentCB2.prototype.up = function () {
            if (this.currentLevel < 0) {
              throw new Error("The document node has no parent.");
            }
            if (this.currentNode) {
              if (this.currentNode.children) {
                this.closeNode(this.currentNode);
              } else {
                this.openNode(this.currentNode);
              }
              this.currentNode = null;
            } else {
              this.closeNode(this.openTags[this.currentLevel]);
            }
            delete this.openTags[this.currentLevel];
            this.currentLevel--;
            return this;
          };
          XMLDocumentCB2.prototype.end = function () {
            while (this.currentLevel >= 0) {
              this.up();
            }
            return this.onEnd();
          };
          XMLDocumentCB2.prototype.openCurrent = function () {
            if (this.currentNode) {
              this.currentNode.children = true;
              return this.openNode(this.currentNode);
            }
          };
          XMLDocumentCB2.prototype.openNode = function (node) {
            var att, chunk, name, ref1;
            if (!node.isOpen) {
              if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
                this.root = node;
              }
              chunk = "";
              if (node.type === NodeType.Element) {
                this.writerOptions.state = WriterState.OpenTag;
                chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
                ref1 = node.attribs;
                for (name in ref1) {
                  if (!hasProp.call(ref1, name))
                    continue;
                  att = ref1[name];
                  chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
                }
                chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
                this.writerOptions.state = WriterState.InsideTag;
              } else {
                this.writerOptions.state = WriterState.OpenTag;
                chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
                if (node.pubID && node.sysID) {
                  chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
                } else if (node.sysID) {
                  chunk += ' SYSTEM "' + node.sysID + '"';
                }
                if (node.children) {
                  chunk += " [";
                  this.writerOptions.state = WriterState.InsideTag;
                } else {
                  this.writerOptions.state = WriterState.CloseTag;
                  chunk += ">";
                }
                chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
              }
              this.onData(chunk, this.currentLevel);
              return node.isOpen = true;
            }
          };
          XMLDocumentCB2.prototype.closeNode = function (node) {
            var chunk;
            if (!node.isClosed) {
              chunk = "";
              this.writerOptions.state = WriterState.CloseTag;
              if (node.type === NodeType.Element) {
                chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
              } else {
                chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
              }
              this.writerOptions.state = WriterState.None;
              this.onData(chunk, this.currentLevel);
              return node.isClosed = true;
            }
          };
          XMLDocumentCB2.prototype.onData = function (chunk, level) {
            this.documentStarted = true;
            return this.onDataCallback(chunk, level + 1);
          };
          XMLDocumentCB2.prototype.onEnd = function () {
            this.documentCompleted = true;
            return this.onEndCallback();
          };
          XMLDocumentCB2.prototype.debugInfo = function (name) {
            if (name == null) {
              return "";
            } else {
              return "node: <" + name + ">";
            }
          };
          XMLDocumentCB2.prototype.ele = function () {
            return this.element.apply(this, arguments);
          };
          XMLDocumentCB2.prototype.nod = function (name, attributes, text) {
            return this.node(name, attributes, text);
          };
          XMLDocumentCB2.prototype.txt = function (value) {
            return this.text(value);
          };
          XMLDocumentCB2.prototype.dat = function (value) {
            return this.cdata(value);
          };
          XMLDocumentCB2.prototype.com = function (value) {
            return this.comment(value);
          };
          XMLDocumentCB2.prototype.ins = function (target, value) {
            return this.instruction(target, value);
          };
          XMLDocumentCB2.prototype.dec = function (version, encoding, standalone) {
            return this.declaration(version, encoding, standalone);
          };
          XMLDocumentCB2.prototype.dtd = function (root, pubID, sysID) {
            return this.doctype(root, pubID, sysID);
          };
          XMLDocumentCB2.prototype.e = function (name, attributes, text) {
            return this.element(name, attributes, text);
          };
          XMLDocumentCB2.prototype.n = function (name, attributes, text) {
            return this.node(name, attributes, text);
          };
          XMLDocumentCB2.prototype.t = function (value) {
            return this.text(value);
          };
          XMLDocumentCB2.prototype.d = function (value) {
            return this.cdata(value);
          };
          XMLDocumentCB2.prototype.c = function (value) {
            return this.comment(value);
          };
          XMLDocumentCB2.prototype.r = function (value) {
            return this.raw(value);
          };
          XMLDocumentCB2.prototype.i = function (target, value) {
            return this.instruction(target, value);
          };
          XMLDocumentCB2.prototype.att = function () {
            if (this.currentNode && this.currentNode.type === NodeType.DocType) {
              return this.attList.apply(this, arguments);
            } else {
              return this.attribute.apply(this, arguments);
            }
          };
          XMLDocumentCB2.prototype.a = function () {
            if (this.currentNode && this.currentNode.type === NodeType.DocType) {
              return this.attList.apply(this, arguments);
            } else {
              return this.attribute.apply(this, arguments);
            }
          };
          XMLDocumentCB2.prototype.ent = function (name, value) {
            return this.entity(name, value);
          };
          XMLDocumentCB2.prototype.pent = function (name, value) {
            return this.pEntity(name, value);
          };
          XMLDocumentCB2.prototype.not = function (name, value) {
            return this.notation(name, value);
          };
          return XMLDocumentCB2;
        }();
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/XMLStreamWriter.js
  var require_XMLStreamWriter = __commonJS({
    "node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports, module) {
      (function () {
        var NodeType, WriterState, XMLStreamWriter, XMLWriterBase, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        NodeType = require_NodeType();
        XMLWriterBase = require_XMLWriterBase();
        WriterState = require_WriterState();
        module.exports = XMLStreamWriter = function (superClass) {
          extend(XMLStreamWriter2, superClass);
          function XMLStreamWriter2(stream, options) {
            this.stream = stream;
            XMLStreamWriter2.__super__.constructor.call(this, options);
          }
          XMLStreamWriter2.prototype.endline = function (node, options, level) {
            if (node.isLastRootNode && options.state === WriterState.CloseTag) {
              return "";
            } else {
              return XMLStreamWriter2.__super__.endline.call(this, node, options, level);
            }
          };
          XMLStreamWriter2.prototype.document = function (doc, options) {
            var child, i, j, k, len, len1, ref, ref1, results;
            ref = doc.children;
            for (i = j = 0, len = ref.length; j < len; i = ++j) {
              child = ref[i];
              child.isLastRootNode = i === doc.children.length - 1;
            }
            options = this.filterOptions(options);
            ref1 = doc.children;
            results = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              child = ref1[k];
              results.push(this.writeChildNode(child, options, 0));
            }
            return results;
          };
          XMLStreamWriter2.prototype.attribute = function (att, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.attribute.call(this, att, options, level));
          };
          XMLStreamWriter2.prototype.cdata = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.cdata.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.comment = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.comment.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.declaration = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.declaration.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.docType = function (node, options, level) {
            var child, j, len, ref;
            level || (level = 0);
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            this.stream.write(this.indent(node, options, level));
            this.stream.write("<!DOCTYPE " + node.root().name);
            if (node.pubID && node.sysID) {
              this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
            } else if (node.sysID) {
              this.stream.write(' SYSTEM "' + node.sysID + '"');
            }
            if (node.children.length > 0) {
              this.stream.write(" [");
              this.stream.write(this.endline(node, options, level));
              options.state = WriterState.InsideTag;
              ref = node.children;
              for (j = 0, len = ref.length; j < len; j++) {
                child = ref[j];
                this.writeChildNode(child, options, level + 1);
              }
              options.state = WriterState.CloseTag;
              this.stream.write("]");
            }
            options.state = WriterState.CloseTag;
            this.stream.write(options.spaceBeforeSlash + ">");
            this.stream.write(this.endline(node, options, level));
            options.state = WriterState.None;
            return this.closeNode(node, options, level);
          };
          XMLStreamWriter2.prototype.element = function (node, options, level) {
            var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
            level || (level = 0);
            this.openNode(node, options, level);
            options.state = WriterState.OpenTag;
            this.stream.write(this.indent(node, options, level) + "<" + node.name);
            ref = node.attribs;
            for (name in ref) {
              if (!hasProp.call(ref, name))
                continue;
              att = ref[name];
              this.attribute(att, options, level);
            }
            childNodeCount = node.children.length;
            firstChildNode = childNodeCount === 0 ? null : node.children[0];
            if (childNodeCount === 0 || node.children.every(function (e) {
              return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
            })) {
              if (options.allowEmpty) {
                this.stream.write(">");
                options.state = WriterState.CloseTag;
                this.stream.write("</" + node.name + ">");
              } else {
                options.state = WriterState.CloseTag;
                this.stream.write(options.spaceBeforeSlash + "/>");
              }
            } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
              this.stream.write(">");
              options.state = WriterState.InsideTag;
              options.suppressPrettyCount++;
              prettySuppressed = true;
              this.writeChildNode(firstChildNode, options, level + 1);
              options.suppressPrettyCount--;
              prettySuppressed = false;
              options.state = WriterState.CloseTag;
              this.stream.write("</" + node.name + ">");
            } else {
              this.stream.write(">" + this.endline(node, options, level));
              options.state = WriterState.InsideTag;
              ref1 = node.children;
              for (j = 0, len = ref1.length; j < len; j++) {
                child = ref1[j];
                this.writeChildNode(child, options, level + 1);
              }
              options.state = WriterState.CloseTag;
              this.stream.write(this.indent(node, options, level) + "</" + node.name + ">");
            }
            this.stream.write(this.endline(node, options, level));
            options.state = WriterState.None;
            return this.closeNode(node, options, level);
          };
          XMLStreamWriter2.prototype.processingInstruction = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.processingInstruction.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.raw = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.raw.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.text = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.text.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.dtdAttList = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.dtdAttList.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.dtdElement = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.dtdElement.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.dtdEntity = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.dtdEntity.call(this, node, options, level));
          };
          XMLStreamWriter2.prototype.dtdNotation = function (node, options, level) {
            return this.stream.write(XMLStreamWriter2.__super__.dtdNotation.call(this, node, options, level));
          };
          return XMLStreamWriter2;
        }(XMLWriterBase);
      }).call(exports);
    }
  });

  // node_modules/xmlbuilder/lib/index.js
  var require_lib = __commonJS({
    "node_modules/xmlbuilder/lib/index.js"(exports, module) {
      (function () {
        var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
        ref = require_Utility(), assign = ref.assign, isFunction = ref.isFunction;
        XMLDOMImplementation = require_XMLDOMImplementation();
        XMLDocument = require_XMLDocument();
        XMLDocumentCB = require_XMLDocumentCB();
        XMLStringWriter = require_XMLStringWriter();
        XMLStreamWriter = require_XMLStreamWriter();
        NodeType = require_NodeType();
        WriterState = require_WriterState();
        module.exports.create = function (name, xmldec, doctype, options) {
          var doc, root;
          if (name == null) {
            throw new Error("Root element needs a name.");
          }
          options = assign({}, xmldec, doctype, options);
          doc = new XMLDocument(options);
          root = doc.element(name);
          if (!options.headless) {
            doc.declaration(options);
            if (options.pubID != null || options.sysID != null) {
              doc.dtd(options);
            }
          }
          return root;
        };
        module.exports.begin = function (options, onData, onEnd) {
          var ref1;
          if (isFunction(options)) {
            ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
            options = {};
          }
          if (onData) {
            return new XMLDocumentCB(options, onData, onEnd);
          } else {
            return new XMLDocument(options);
          }
        };
        module.exports.stringWriter = function (options) {
          return new XMLStringWriter(options);
        };
        module.exports.streamWriter = function (stream, options) {
          return new XMLStreamWriter(stream, options);
        };
        module.exports.implementation = new XMLDOMImplementation();
        module.exports.nodeType = NodeType;
        module.exports.writerState = WriterState;
      }).call(exports);
    }
  });

  // node_modules/xml2js/lib/builder.js
  var require_builder = __commonJS({
    "node_modules/xml2js/lib/builder.js"(exports) {
      (function () {
        "use strict";
        var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
        builder = require_lib();
        defaults = require_defaults().defaults;
        requiresCDATA = function (entry) {
          return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
        };
        wrapCDATA = function (entry) {
          return "<![CDATA[" + escapeCDATA(entry) + "]]>";
        };
        escapeCDATA = function (entry) {
          return entry.replace("]]>", "]]]]><![CDATA[>");
        };
        exports.Builder = function () {
          function Builder(opts) {
            var key, ref, value;
            this.options = {};
            ref = defaults["0.2"];
            for (key in ref) {
              if (!hasProp.call(ref, key))
                continue;
              value = ref[key];
              this.options[key] = value;
            }
            for (key in opts) {
              if (!hasProp.call(opts, key))
                continue;
              value = opts[key];
              this.options[key] = value;
            }
          }
          Builder.prototype.buildObject = function (rootObj) {
            var attrkey, charkey, render, rootElement, rootName;
            attrkey = this.options.attrkey;
            charkey = this.options.charkey;
            if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults["0.2"].rootName) {
              rootName = Object.keys(rootObj)[0];
              rootObj = rootObj[rootName];
            } else {
              rootName = this.options.rootName;
            }
            render = function (_this) {
              return function (element, obj) {
                var attr, child, entry, index, key, value;
                if (typeof obj !== "object") {
                  if (_this.options.cdata && requiresCDATA(obj)) {
                    element.raw(wrapCDATA(obj));
                  } else {
                    element.txt(obj);
                  }
                } else if (Array.isArray(obj)) {
                  for (index in obj) {
                    if (!hasProp.call(obj, index))
                      continue;
                    child = obj[index];
                    for (key in child) {
                      entry = child[key];
                      element = render(element.ele(key), entry).up();
                    }
                  }
                } else {
                  for (key in obj) {
                    if (!hasProp.call(obj, key))
                      continue;
                    child = obj[key];
                    if (key === attrkey) {
                      if (typeof child === "object") {
                        for (attr in child) {
                          value = child[attr];
                          element = element.att(attr, value);
                        }
                      }
                    } else if (key === charkey) {
                      if (_this.options.cdata && requiresCDATA(child)) {
                        element = element.raw(wrapCDATA(child));
                      } else {
                        element = element.txt(child);
                      }
                    } else if (Array.isArray(child)) {
                      for (index in child) {
                        if (!hasProp.call(child, index))
                          continue;
                        entry = child[index];
                        if (typeof entry === "string") {
                          if (_this.options.cdata && requiresCDATA(entry)) {
                            element = element.ele(key).raw(wrapCDATA(entry)).up();
                          } else {
                            element = element.ele(key, entry).up();
                          }
                        } else {
                          element = render(element.ele(key), entry).up();
                        }
                      }
                    } else if (typeof child === "object") {
                      element = render(element.ele(key), child).up();
                    } else {
                      if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                        element = element.ele(key).raw(wrapCDATA(child)).up();
                      } else {
                        if (child == null) {
                          child = "";
                        }
                        element = element.ele(key, child.toString()).up();
                      }
                    }
                  }
                }
                return element;
              };
            }(this);
            rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
              headless: this.options.headless,
              allowSurrogateChars: this.options.allowSurrogateChars
            });
            return render(rootElement, rootObj).end(this.options.renderOpts);
          };
          return Builder;
        }();
      }).call(exports);
    }
  });

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1)
          validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function (buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer2;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer2.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer2.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = {
            foo: function () {
              return 42;
            }
          };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer2.prototype, "parent", {
        enumerable: true,
        get: function () {
          if (!Buffer2.isBuffer(this))
            return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer2.prototype, "offset", {
        enumerable: true,
        get: function () {
          if (!Buffer2.isBuffer(this))
            return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf = new Uint8Array(length);
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function Buffer2(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from(arg, encodingOrOffset, length);
      }
      Buffer2.poolSize = 8192;
      function from(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer2.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b)
          return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer2.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer2.from = function (value, encodingOrOffset, length) {
        return from(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer2.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer2, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer2.alloc = function (size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer2.allocUnsafe = function (size) {
        return allocUnsafe(size);
      };
      Buffer2.allocUnsafeSlow = function (size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf = createBuffer(length);
        const actual = buf.write(string, encoding);
        if (actual !== length) {
          buf = buf.slice(0, actual);
        }
        return buf;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf[i] = array[i] & 255;
        }
        return buf;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf;
        if (byteOffset === void 0 && length === void 0) {
          buf = new Uint8Array(array);
        } else if (length === void 0) {
          buf = new Uint8Array(array, byteOffset);
        } else {
          buf = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf, Buffer2.prototype);
        return buf;
      }
      function fromObject(obj) {
        if (Buffer2.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf = createBuffer(len);
          if (buf.length === 0) {
            return buf;
          }
          obj.copy(buf, 0, 0, len);
          return buf;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer2.alloc(+length);
      }
      Buffer2.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer2.prototype;
      };
      Buffer2.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array))
          a = Buffer2.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array))
          b = Buffer2.from(b, b.offset, b.byteLength);
        if (!Buffer2.isBuffer(a) || !Buffer2.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b)
          return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y)
          return -1;
        if (y < x)
          return 1;
        return 0;
      };
      Buffer2.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer2.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer2.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer2.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf = list[i];
          if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) {
              if (!Buffer2.isBuffer(buf))
                buf = Buffer2.from(buf);
              buf.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf,
                pos
              );
            }
          } else if (!Buffer2.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf.copy(buffer, pos);
          }
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer2.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0)
          return 0;
        let loweredCase = false;
        for (; ;) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding)
          encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer2.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer2.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer2.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer2.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer2.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0)
          return "";
        if (arguments.length === 0)
          return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer2.prototype.toLocaleString = Buffer2.prototype.toString;
      Buffer2.prototype.equals = function equals(b) {
        if (!Buffer2.isBuffer(b))
          throw new TypeError("Argument must be a Buffer");
        if (this === b)
          return true;
        return Buffer2.compare(this, b) === 0;
      };
      Buffer2.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max)
          str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer2.prototype[customInspectSymbol] = Buffer2.prototype.inspect;
      }
      Buffer2.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer2.from(target, target.offset, target.byteLength);
        }
        if (!Buffer2.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target)
          return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y)
          return -1;
        if (y < x)
          return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0)
          return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0)
          byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir)
            return -1;
          else
            byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir)
            byteOffset = 0;
          else
            return -1;
        }
        if (typeof val === "string") {
          val = Buffer2.from(val, encoding);
        }
        if (Buffer2.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i2) {
          if (indexSize === 1) {
            return buf[i2];
          } else {
            return buf.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1)
                foundIndex = i;
              if (i - foundIndex + 1 === valLength)
                return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1)
                i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength)
            byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found)
              return i;
          }
        }
        return -1;
      }
      Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed))
            return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer2.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0)
              encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining)
          length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding)
          encoding = "utf8";
        let loweredCase = false;
        for (; ;) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase)
                throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer2.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        if (start === 0 && end === buf.length) {
          return base64.fromByteArray(buf);
        } else {
          return base64.fromByteArray(buf.slice(start, end));
        }
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf, start, end) {
        let ret = "";
        end = Math.min(buf.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf[i]);
        }
        return ret;
      }
      function hexSlice(buf, start, end) {
        const len = buf.length;
        if (!start || start < 0)
          start = 0;
        if (!end || end < 0 || end > len)
          end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf[i]];
        }
        return out;
      }
      function utf16leSlice(buf, start, end) {
        const bytes = buf.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer2.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0)
            start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0)
            end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start)
          end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer2.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0)
          throw new RangeError("offset is not uint");
        if (offset + ext > length)
          throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer2.prototype.readUintLE = Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUintBE = Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer2.prototype.readUint8 = Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer2.prototype.readUint16LE = Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer2.prototype.readUint16BE = Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer2.prototype.readUint32LE = Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer2.prototype.readUint32BE = Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer2.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer2.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert)
          checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul)
          val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128))
          return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer2.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer2.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first = this[offset];
        const last = this[offset + 7];
        if (first === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first << 24) + // Overflow
          this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert)
          checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer2.isBuffer(buf))
          throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min)
          throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length)
          throw new RangeError("Index out of range");
      }
      Buffer2.prototype.writeUintLE = Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUintBE = Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeUint8 = Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeUint16LE = Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeUint16BE = Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeUint32LE = Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeUint32BE = Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        lo = lo >> 8;
        buf[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        hi = hi >> 8;
        buf[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf, value, offset, min, max) {
        checkIntBI(value, min, max, buf, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf[offset + 7] = lo;
        lo = lo >> 8;
        buf[offset + 6] = lo;
        lo = lo >> 8;
        buf[offset + 5] = lo;
        lo = lo >> 8;
        buf[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf[offset + 3] = hi;
        hi = hi >> 8;
        buf[offset + 2] = hi;
        hi = hi >> 8;
        buf[offset + 1] = hi;
        hi = hi >> 8;
        buf[offset] = hi;
        return offset + 8;
      }
      Buffer2.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 1, 127, -128);
        if (value < 0)
          value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert)
          checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0)
          value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer2.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer2.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length)
          throw new RangeError("Index out of range");
        if (offset < 0)
          throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer2.isBuffer(target))
          throw new TypeError("argument should be a Buffer");
        if (!start)
          start = 0;
        if (!end && end !== 0)
          end = this.length;
        if (targetStart >= target.length)
          targetStart = target.length;
        if (!targetStart)
          targetStart = 0;
        if (end > 0 && end < start)
          end = start;
        if (end === start)
          return 0;
        if (target.length === 0 || this.length === 0)
          return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length)
          throw new RangeError("Index out of range");
        if (end < 0)
          throw new RangeError("sourceEnd out of bounds");
        if (end > this.length)
          end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer2.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val)
          val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer2.isBuffer(val) ? val : Buffer2.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function (name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function (name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function (str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
          boundsError(offset, buf.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2)
          return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1)
                  bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1)
              bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0)
              break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0)
              break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0)
              break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0)
              break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0)
            break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length)
            break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = function () {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      }();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // node_modules/safe-buffer/index.js
  var require_safe_buffer = __commonJS({
    "node_modules/safe-buffer/index.js"(exports, module) {
      var buffer = require_buffer();
      var Buffer2 = buffer.Buffer;
      function copyProps(src, dst) {
        for (var key in src) {
          dst[key] = src[key];
        }
      }
      if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
        module.exports = buffer;
      } else {
        copyProps(buffer, exports);
        exports.Buffer = SafeBuffer;
      }
      function SafeBuffer(arg, encodingOrOffset, length) {
        return Buffer2(arg, encodingOrOffset, length);
      }
      SafeBuffer.prototype = Object.create(Buffer2.prototype);
      copyProps(Buffer2, SafeBuffer);
      SafeBuffer.from = function (arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          throw new TypeError("Argument must not be a number");
        }
        return Buffer2(arg, encodingOrOffset, length);
      };
      SafeBuffer.alloc = function (size, fill, encoding) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        var buf = Buffer2(size);
        if (fill !== void 0) {
          if (typeof encoding === "string") {
            buf.fill(fill, encoding);
          } else {
            buf.fill(fill);
          }
        } else {
          buf.fill(0);
        }
        return buf;
      };
      SafeBuffer.allocUnsafe = function (size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return Buffer2(size);
      };
      SafeBuffer.allocUnsafeSlow = function (size) {
        if (typeof size !== "number") {
          throw new TypeError("Argument must be a number");
        }
        return buffer.SlowBuffer(size);
      };
    }
  });

  // node_modules/string_decoder/lib/string_decoder.js
  var require_string_decoder = __commonJS({
    "node_modules/string_decoder/lib/string_decoder.js"(exports) {
      "use strict";
      var Buffer2 = require_safe_buffer().Buffer;
      var isEncoding = Buffer2.isEncoding || function (encoding) {
        encoding = "" + encoding;
        switch (encoding && encoding.toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
          case "raw":
            return true;
          default:
            return false;
        }
      };
      function _normalizeEncoding(enc) {
        if (!enc)
          return "utf8";
        var retried;
        while (true) {
          switch (enc) {
            case "utf8":
            case "utf-8":
              return "utf8";
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return "utf16le";
            case "latin1":
            case "binary":
              return "latin1";
            case "base64":
            case "ascii":
            case "hex":
              return enc;
            default:
              if (retried)
                return;
              enc = ("" + enc).toLowerCase();
              retried = true;
          }
        }
      }
      function normalizeEncoding(enc) {
        var nenc = _normalizeEncoding(enc);
        if (typeof nenc !== "string" && (Buffer2.isEncoding === isEncoding || !isEncoding(enc)))
          throw new Error("Unknown encoding: " + enc);
        return nenc || enc;
      }
      exports.StringDecoder = StringDecoder;
      function StringDecoder(encoding) {
        this.encoding = normalizeEncoding(encoding);
        var nb;
        switch (this.encoding) {
          case "utf16le":
            this.text = utf16Text;
            this.end = utf16End;
            nb = 4;
            break;
          case "utf8":
            this.fillLast = utf8FillLast;
            nb = 4;
            break;
          case "base64":
            this.text = base64Text;
            this.end = base64End;
            nb = 3;
            break;
          default:
            this.write = simpleWrite;
            this.end = simpleEnd;
            return;
        }
        this.lastNeed = 0;
        this.lastTotal = 0;
        this.lastChar = Buffer2.allocUnsafe(nb);
      }
      StringDecoder.prototype.write = function (buf) {
        if (buf.length === 0)
          return "";
        var r;
        var i;
        if (this.lastNeed) {
          r = this.fillLast(buf);
          if (r === void 0)
            return "";
          i = this.lastNeed;
          this.lastNeed = 0;
        } else {
          i = 0;
        }
        if (i < buf.length)
          return r ? r + this.text(buf, i) : this.text(buf, i);
        return r || "";
      };
      StringDecoder.prototype.end = utf8End;
      StringDecoder.prototype.text = utf8Text;
      StringDecoder.prototype.fillLast = function (buf) {
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
        this.lastNeed -= buf.length;
      };
      function utf8CheckByte(byte) {
        if (byte <= 127)
          return 0;
        else if (byte >> 5 === 6)
          return 2;
        else if (byte >> 4 === 14)
          return 3;
        else if (byte >> 3 === 30)
          return 4;
        return byte >> 6 === 2 ? -1 : -2;
      }
      function utf8CheckIncomplete(self, buf, i) {
        var j = buf.length - 1;
        if (j < i)
          return 0;
        var nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0)
            self.lastNeed = nb - 1;
          return nb;
        }
        if (--j < i || nb === -2)
          return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0)
            self.lastNeed = nb - 2;
          return nb;
        }
        if (--j < i || nb === -2)
          return 0;
        nb = utf8CheckByte(buf[j]);
        if (nb >= 0) {
          if (nb > 0) {
            if (nb === 2)
              nb = 0;
            else
              self.lastNeed = nb - 3;
          }
          return nb;
        }
        return 0;
      }
      function utf8CheckExtraBytes(self, buf, p) {
        if ((buf[0] & 192) !== 128) {
          self.lastNeed = 0;
          return "\uFFFD";
        }
        if (self.lastNeed > 1 && buf.length > 1) {
          if ((buf[1] & 192) !== 128) {
            self.lastNeed = 1;
            return "\uFFFD";
          }
          if (self.lastNeed > 2 && buf.length > 2) {
            if ((buf[2] & 192) !== 128) {
              self.lastNeed = 2;
              return "\uFFFD";
            }
          }
        }
      }
      function utf8FillLast(buf) {
        var p = this.lastTotal - this.lastNeed;
        var r = utf8CheckExtraBytes(this, buf, p);
        if (r !== void 0)
          return r;
        if (this.lastNeed <= buf.length) {
          buf.copy(this.lastChar, p, 0, this.lastNeed);
          return this.lastChar.toString(this.encoding, 0, this.lastTotal);
        }
        buf.copy(this.lastChar, p, 0, buf.length);
        this.lastNeed -= buf.length;
      }
      function utf8Text(buf, i) {
        var total = utf8CheckIncomplete(this, buf, i);
        if (!this.lastNeed)
          return buf.toString("utf8", i);
        this.lastTotal = total;
        var end = buf.length - (total - this.lastNeed);
        buf.copy(this.lastChar, 0, end);
        return buf.toString("utf8", i, end);
      }
      function utf8End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed)
          return r + "\uFFFD";
        return r;
      }
      function utf16Text(buf, i) {
        if ((buf.length - i) % 2 === 0) {
          var r = buf.toString("utf16le", i);
          if (r) {
            var c = r.charCodeAt(r.length - 1);
            if (c >= 55296 && c <= 56319) {
              this.lastNeed = 2;
              this.lastTotal = 4;
              this.lastChar[0] = buf[buf.length - 2];
              this.lastChar[1] = buf[buf.length - 1];
              return r.slice(0, -1);
            }
          }
          return r;
        }
        this.lastNeed = 1;
        this.lastTotal = 2;
        this.lastChar[0] = buf[buf.length - 1];
        return buf.toString("utf16le", i, buf.length - 1);
      }
      function utf16End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed) {
          var end = this.lastTotal - this.lastNeed;
          return r + this.lastChar.toString("utf16le", 0, end);
        }
        return r;
      }
      function base64Text(buf, i) {
        var n = (buf.length - i) % 3;
        if (n === 0)
          return buf.toString("base64", i);
        this.lastNeed = 3 - n;
        this.lastTotal = 3;
        if (n === 1) {
          this.lastChar[0] = buf[buf.length - 1];
        } else {
          this.lastChar[0] = buf[buf.length - 2];
          this.lastChar[1] = buf[buf.length - 1];
        }
        return buf.toString("base64", i, buf.length - n);
      }
      function base64End(buf) {
        var r = buf && buf.length ? this.write(buf) : "";
        if (this.lastNeed)
          return r + this.lastChar.toString("base64", 0, 3 - this.lastNeed);
        return r;
      }
      function simpleWrite(buf) {
        return buf.toString(this.encoding);
      }
      function simpleEnd(buf) {
        return buf && buf.length ? this.write(buf) : "";
      }
    }
  });

  // node_modules/sax/lib/sax.js
  var require_sax = __commonJS({
    "node_modules/sax/lib/sax.js"(exports) {
      (function (sax) {
        sax.parser = function (strict, opt) {
          return new SAXParser(strict, opt);
        };
        sax.SAXParser = SAXParser;
        sax.SAXStream = SAXStream;
        sax.createStream = createStream;
        sax.MAX_BUFFER_LENGTH = 64 * 1024;
        var buffers = [
          "comment",
          "sgmlDecl",
          "textNode",
          "tagName",
          "doctype",
          "procInstName",
          "procInstBody",
          "entity",
          "attribName",
          "attribValue",
          "cdata",
          "script"
        ];
        sax.EVENTS = [
          "text",
          "processinginstruction",
          "sgmldeclaration",
          "doctype",
          "comment",
          "opentagstart",
          "attribute",
          "opentag",
          "closetag",
          "opencdata",
          "cdata",
          "closecdata",
          "error",
          "end",
          "ready",
          "script",
          "opennamespace",
          "closenamespace"
        ];
        function SAXParser(strict, opt) {
          if (!(this instanceof SAXParser)) {
            return new SAXParser(strict, opt);
          }
          var parser = this;
          clearBuffers(parser);
          parser.q = parser.c = "";
          parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
          parser.opt = opt || {};
          parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
          parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
          parser.tags = [];
          parser.closed = parser.closedRoot = parser.sawRoot = false;
          parser.tag = parser.error = null;
          parser.strict = !!strict;
          parser.noscript = !!(strict || parser.opt.noscript);
          parser.state = S.BEGIN;
          parser.strictEntities = parser.opt.strictEntities;
          parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
          parser.attribList = [];
          if (parser.opt.xmlns) {
            parser.ns = Object.create(rootNS);
          }
          parser.trackPosition = parser.opt.position !== false;
          if (parser.trackPosition) {
            parser.position = parser.line = parser.column = 0;
          }
          emit(parser, "onready");
        }
        if (!Object.create) {
          Object.create = function (o) {
            function F() {
            }
            F.prototype = o;
            var newf = new F();
            return newf;
          };
        }
        if (!Object.keys) {
          Object.keys = function (o) {
            var a = [];
            for (var i in o)
              if (o.hasOwnProperty(i))
                a.push(i);
            return a;
          };
        }
        function checkBufferLength(parser) {
          var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
          var maxActual = 0;
          for (var i = 0, l = buffers.length; i < l; i++) {
            var len = parser[buffers[i]].length;
            if (len > maxAllowed) {
              switch (buffers[i]) {
                case "textNode":
                  closeText(parser);
                  break;
                case "cdata":
                  emitNode(parser, "oncdata", parser.cdata);
                  parser.cdata = "";
                  break;
                case "script":
                  emitNode(parser, "onscript", parser.script);
                  parser.script = "";
                  break;
                default:
                  error(parser, "Max buffer length exceeded: " + buffers[i]);
              }
            }
            maxActual = Math.max(maxActual, len);
          }
          var m = sax.MAX_BUFFER_LENGTH - maxActual;
          parser.bufferCheckPosition = m + parser.position;
        }
        function clearBuffers(parser) {
          for (var i = 0, l = buffers.length; i < l; i++) {
            parser[buffers[i]] = "";
          }
        }
        function flushBuffers(parser) {
          closeText(parser);
          if (parser.cdata !== "") {
            emitNode(parser, "oncdata", parser.cdata);
            parser.cdata = "";
          }
          if (parser.script !== "") {
            emitNode(parser, "onscript", parser.script);
            parser.script = "";
          }
        }
        SAXParser.prototype = {
          end: function () {
            end(this);
          },
          write,
          resume: function () {
            this.error = null;
            return this;
          },
          close: function () {
            return this.write(null);
          },
          flush: function () {
            flushBuffers(this);
          }
        };
        var Stream;
        try {
          Stream = __require("stream").Stream;
        } catch (ex) {
          Stream = function () {
          };
        }
        var streamWraps = sax.EVENTS.filter(function (ev) {
          return ev !== "error" && ev !== "end";
        });
        function createStream(strict, opt) {
          return new SAXStream(strict, opt);
        }
        function SAXStream(strict, opt) {
          if (!(this instanceof SAXStream)) {
            return new SAXStream(strict, opt);
          }
          Stream.apply(this);
          this._parser = new SAXParser(strict, opt);
          this.writable = true;
          this.readable = true;
          var me = this;
          this._parser.onend = function () {
            me.emit("end");
          };
          this._parser.onerror = function (er) {
            me.emit("error", er);
            me._parser.error = null;
          };
          this._decoder = null;
          streamWraps.forEach(function (ev) {
            Object.defineProperty(me, "on" + ev, {
              get: function () {
                return me._parser["on" + ev];
              },
              set: function (h) {
                if (!h) {
                  me.removeAllListeners(ev);
                  me._parser["on" + ev] = h;
                  return h;
                }
                me.on(ev, h);
              },
              enumerable: true,
              configurable: false
            });
          });
        }
        SAXStream.prototype = Object.create(Stream.prototype, {
          constructor: {
            value: SAXStream
          }
        });
        SAXStream.prototype.write = function (data) {
          if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
            if (!this._decoder) {
              var SD = require_string_decoder().StringDecoder;
              this._decoder = new SD("utf8");
            }
            data = this._decoder.write(data);
          }
          this._parser.write(data.toString());
          this.emit("data", data);
          return true;
        };
        SAXStream.prototype.end = function (chunk) {
          if (chunk && chunk.length) {
            this.write(chunk);
          }
          this._parser.end();
          return true;
        };
        SAXStream.prototype.on = function (ev, handler) {
          var me = this;
          if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
            me._parser["on" + ev] = function () {
              var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
              args.splice(0, 0, ev);
              me.emit.apply(me, args);
            };
          }
          return Stream.prototype.on.call(me, ev, handler);
        };
        var CDATA = "[CDATA[";
        var DOCTYPE = "DOCTYPE";
        var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
        var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
        var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
        var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
        var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
        var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
        var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
        function isWhitespace(c) {
          return c === " " || c === "\n" || c === "\r" || c === "	";
        }
        function isQuote(c) {
          return c === '"' || c === "'";
        }
        function isAttribEnd(c) {
          return c === ">" || isWhitespace(c);
        }
        function isMatch(regex, c) {
          return regex.test(c);
        }
        function notMatch(regex, c) {
          return !isMatch(regex, c);
        }
        var S = 0;
        sax.STATE = {
          BEGIN: S++,
          // leading byte order mark or whitespace
          BEGIN_WHITESPACE: S++,
          // leading whitespace
          TEXT: S++,
          // general stuff
          TEXT_ENTITY: S++,
          // &amp and such.
          OPEN_WAKA: S++,
          // <
          SGML_DECL: S++,
          // <!BLARG
          SGML_DECL_QUOTED: S++,
          // <!BLARG foo "bar
          DOCTYPE: S++,
          // <!DOCTYPE
          DOCTYPE_QUOTED: S++,
          // <!DOCTYPE "//blah
          DOCTYPE_DTD: S++,
          // <!DOCTYPE "//blah" [ ...
          DOCTYPE_DTD_QUOTED: S++,
          // <!DOCTYPE "//blah" [ "foo
          COMMENT_STARTING: S++,
          // <!-
          COMMENT: S++,
          // <!--
          COMMENT_ENDING: S++,
          // <!-- blah -
          COMMENT_ENDED: S++,
          // <!-- blah --
          CDATA: S++,
          // <![CDATA[ something
          CDATA_ENDING: S++,
          // ]
          CDATA_ENDING_2: S++,
          // ]]
          PROC_INST: S++,
          // <?hi
          PROC_INST_BODY: S++,
          // <?hi there
          PROC_INST_ENDING: S++,
          // <?hi "there" ?
          OPEN_TAG: S++,
          // <strong
          OPEN_TAG_SLASH: S++,
          // <strong /
          ATTRIB: S++,
          // <a
          ATTRIB_NAME: S++,
          // <a foo
          ATTRIB_NAME_SAW_WHITE: S++,
          // <a foo _
          ATTRIB_VALUE: S++,
          // <a foo=
          ATTRIB_VALUE_QUOTED: S++,
          // <a foo="bar
          ATTRIB_VALUE_CLOSED: S++,
          // <a foo="bar"
          ATTRIB_VALUE_UNQUOTED: S++,
          // <a foo=bar
          ATTRIB_VALUE_ENTITY_Q: S++,
          // <foo bar="&quot;"
          ATTRIB_VALUE_ENTITY_U: S++,
          // <foo bar=&quot
          CLOSE_TAG: S++,
          // </a
          CLOSE_TAG_SAW_WHITE: S++,
          // </a   >
          SCRIPT: S++,
          // <script> ...
          SCRIPT_ENDING: S++
          // <script> ... <
        };
        sax.XML_ENTITIES = {
          "amp": "&",
          "gt": ">",
          "lt": "<",
          "quot": '"',
          "apos": "'"
        };
        sax.ENTITIES = {
          "amp": "&",
          "gt": ">",
          "lt": "<",
          "quot": '"',
          "apos": "'",
          "AElig": 198,
          "Aacute": 193,
          "Acirc": 194,
          "Agrave": 192,
          "Aring": 197,
          "Atilde": 195,
          "Auml": 196,
          "Ccedil": 199,
          "ETH": 208,
          "Eacute": 201,
          "Ecirc": 202,
          "Egrave": 200,
          "Euml": 203,
          "Iacute": 205,
          "Icirc": 206,
          "Igrave": 204,
          "Iuml": 207,
          "Ntilde": 209,
          "Oacute": 211,
          "Ocirc": 212,
          "Ograve": 210,
          "Oslash": 216,
          "Otilde": 213,
          "Ouml": 214,
          "THORN": 222,
          "Uacute": 218,
          "Ucirc": 219,
          "Ugrave": 217,
          "Uuml": 220,
          "Yacute": 221,
          "aacute": 225,
          "acirc": 226,
          "aelig": 230,
          "agrave": 224,
          "aring": 229,
          "atilde": 227,
          "auml": 228,
          "ccedil": 231,
          "eacute": 233,
          "ecirc": 234,
          "egrave": 232,
          "eth": 240,
          "euml": 235,
          "iacute": 237,
          "icirc": 238,
          "igrave": 236,
          "iuml": 239,
          "ntilde": 241,
          "oacute": 243,
          "ocirc": 244,
          "ograve": 242,
          "oslash": 248,
          "otilde": 245,
          "ouml": 246,
          "szlig": 223,
          "thorn": 254,
          "uacute": 250,
          "ucirc": 251,
          "ugrave": 249,
          "uuml": 252,
          "yacute": 253,
          "yuml": 255,
          "copy": 169,
          "reg": 174,
          "nbsp": 160,
          "iexcl": 161,
          "cent": 162,
          "pound": 163,
          "curren": 164,
          "yen": 165,
          "brvbar": 166,
          "sect": 167,
          "uml": 168,
          "ordf": 170,
          "laquo": 171,
          "not": 172,
          "shy": 173,
          "macr": 175,
          "deg": 176,
          "plusmn": 177,
          "sup1": 185,
          "sup2": 178,
          "sup3": 179,
          "acute": 180,
          "micro": 181,
          "para": 182,
          "middot": 183,
          "cedil": 184,
          "ordm": 186,
          "raquo": 187,
          "frac14": 188,
          "frac12": 189,
          "frac34": 190,
          "iquest": 191,
          "times": 215,
          "divide": 247,
          "OElig": 338,
          "oelig": 339,
          "Scaron": 352,
          "scaron": 353,
          "Yuml": 376,
          "fnof": 402,
          "circ": 710,
          "tilde": 732,
          "Alpha": 913,
          "Beta": 914,
          "Gamma": 915,
          "Delta": 916,
          "Epsilon": 917,
          "Zeta": 918,
          "Eta": 919,
          "Theta": 920,
          "Iota": 921,
          "Kappa": 922,
          "Lambda": 923,
          "Mu": 924,
          "Nu": 925,
          "Xi": 926,
          "Omicron": 927,
          "Pi": 928,
          "Rho": 929,
          "Sigma": 931,
          "Tau": 932,
          "Upsilon": 933,
          "Phi": 934,
          "Chi": 935,
          "Psi": 936,
          "Omega": 937,
          "alpha": 945,
          "beta": 946,
          "gamma": 947,
          "delta": 948,
          "epsilon": 949,
          "zeta": 950,
          "eta": 951,
          "theta": 952,
          "iota": 953,
          "kappa": 954,
          "lambda": 955,
          "mu": 956,
          "nu": 957,
          "xi": 958,
          "omicron": 959,
          "pi": 960,
          "rho": 961,
          "sigmaf": 962,
          "sigma": 963,
          "tau": 964,
          "upsilon": 965,
          "phi": 966,
          "chi": 967,
          "psi": 968,
          "omega": 969,
          "thetasym": 977,
          "upsih": 978,
          "piv": 982,
          "ensp": 8194,
          "emsp": 8195,
          "thinsp": 8201,
          "zwnj": 8204,
          "zwj": 8205,
          "lrm": 8206,
          "rlm": 8207,
          "ndash": 8211,
          "mdash": 8212,
          "lsquo": 8216,
          "rsquo": 8217,
          "sbquo": 8218,
          "ldquo": 8220,
          "rdquo": 8221,
          "bdquo": 8222,
          "dagger": 8224,
          "Dagger": 8225,
          "bull": 8226,
          "hellip": 8230,
          "permil": 8240,
          "prime": 8242,
          "Prime": 8243,
          "lsaquo": 8249,
          "rsaquo": 8250,
          "oline": 8254,
          "frasl": 8260,
          "euro": 8364,
          "image": 8465,
          "weierp": 8472,
          "real": 8476,
          "trade": 8482,
          "alefsym": 8501,
          "larr": 8592,
          "uarr": 8593,
          "rarr": 8594,
          "darr": 8595,
          "harr": 8596,
          "crarr": 8629,
          "lArr": 8656,
          "uArr": 8657,
          "rArr": 8658,
          "dArr": 8659,
          "hArr": 8660,
          "forall": 8704,
          "part": 8706,
          "exist": 8707,
          "empty": 8709,
          "nabla": 8711,
          "isin": 8712,
          "notin": 8713,
          "ni": 8715,
          "prod": 8719,
          "sum": 8721,
          "minus": 8722,
          "lowast": 8727,
          "radic": 8730,
          "prop": 8733,
          "infin": 8734,
          "ang": 8736,
          "and": 8743,
          "or": 8744,
          "cap": 8745,
          "cup": 8746,
          "int": 8747,
          "there4": 8756,
          "sim": 8764,
          "cong": 8773,
          "asymp": 8776,
          "ne": 8800,
          "equiv": 8801,
          "le": 8804,
          "ge": 8805,
          "sub": 8834,
          "sup": 8835,
          "nsub": 8836,
          "sube": 8838,
          "supe": 8839,
          "oplus": 8853,
          "otimes": 8855,
          "perp": 8869,
          "sdot": 8901,
          "lceil": 8968,
          "rceil": 8969,
          "lfloor": 8970,
          "rfloor": 8971,
          "lang": 9001,
          "rang": 9002,
          "loz": 9674,
          "spades": 9824,
          "clubs": 9827,
          "hearts": 9829,
          "diams": 9830
        };
        Object.keys(sax.ENTITIES).forEach(function (key) {
          var e = sax.ENTITIES[key];
          var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
          sax.ENTITIES[key] = s2;
        });
        for (var s in sax.STATE) {
          sax.STATE[sax.STATE[s]] = s;
        }
        S = sax.STATE;
        function emit(parser, event, data) {
          parser[event] && parser[event](data);
        }
        function emitNode(parser, nodeType, data) {
          if (parser.textNode)
            closeText(parser);
          emit(parser, nodeType, data);
        }
        function closeText(parser) {
          parser.textNode = textopts(parser.opt, parser.textNode);
          if (parser.textNode)
            emit(parser, "ontext", parser.textNode);
          parser.textNode = "";
        }
        function textopts(opt, text) {
          if (opt.trim)
            text = text.trim();
          if (opt.normalize)
            text = text.replace(/\s+/g, " ");
          return text;
        }
        function error(parser, er) {
          closeText(parser);
          if (parser.trackPosition) {
            er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
          }
          er = new Error(er);
          parser.error = er;
          emit(parser, "onerror", er);
          return parser;
        }
        function end(parser) {
          if (parser.sawRoot && !parser.closedRoot)
            strictFail(parser, "Unclosed root tag");
          if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
            error(parser, "Unexpected end");
          }
          closeText(parser);
          parser.c = "";
          parser.closed = true;
          emit(parser, "onend");
          SAXParser.call(parser, parser.strict, parser.opt);
          return parser;
        }
        function strictFail(parser, message) {
          if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
            throw new Error("bad call to strictFail");
          }
          if (parser.strict) {
            error(parser, message);
          }
        }
        function newTag(parser) {
          if (!parser.strict)
            parser.tagName = parser.tagName[parser.looseCase]();
          var parent = parser.tags[parser.tags.length - 1] || parser;
          var tag = parser.tag = { name: parser.tagName, attributes: {} };
          if (parser.opt.xmlns) {
            tag.ns = parent.ns;
          }
          parser.attribList.length = 0;
          emitNode(parser, "onopentagstart", tag);
        }
        function qname(name, attribute) {
          var i = name.indexOf(":");
          var qualName = i < 0 ? ["", name] : name.split(":");
          var prefix = qualName[0];
          var local = qualName[1];
          if (attribute && name === "xmlns") {
            prefix = "xmlns";
            local = "";
          }
          return { prefix, local };
        }
        function attrib(parser) {
          if (!parser.strict) {
            parser.attribName = parser.attribName[parser.looseCase]();
          }
          if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
            parser.attribName = parser.attribValue = "";
            return;
          }
          if (parser.opt.xmlns) {
            var qn = qname(parser.attribName, true);
            var prefix = qn.prefix;
            var local = qn.local;
            if (prefix === "xmlns") {
              if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
                strictFail(
                  parser,
                  "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
                );
              } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
                strictFail(
                  parser,
                  "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
                );
              } else {
                var tag = parser.tag;
                var parent = parser.tags[parser.tags.length - 1] || parser;
                if (tag.ns === parent.ns) {
                  tag.ns = Object.create(parent.ns);
                }
                tag.ns[local] = parser.attribValue;
              }
            }
            parser.attribList.push([parser.attribName, parser.attribValue]);
          } else {
            parser.tag.attributes[parser.attribName] = parser.attribValue;
            emitNode(parser, "onattribute", {
              name: parser.attribName,
              value: parser.attribValue
            });
          }
          parser.attribName = parser.attribValue = "";
        }
        function openTag(parser, selfClosing) {
          if (parser.opt.xmlns) {
            var tag = parser.tag;
            var qn = qname(parser.tagName);
            tag.prefix = qn.prefix;
            tag.local = qn.local;
            tag.uri = tag.ns[qn.prefix] || "";
            if (tag.prefix && !tag.uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
              tag.uri = qn.prefix;
            }
            var parent = parser.tags[parser.tags.length - 1] || parser;
            if (tag.ns && parent.ns !== tag.ns) {
              Object.keys(tag.ns).forEach(function (p) {
                emitNode(parser, "onopennamespace", {
                  prefix: p,
                  uri: tag.ns[p]
                });
              });
            }
            for (var i = 0, l = parser.attribList.length; i < l; i++) {
              var nv = parser.attribList[i];
              var name = nv[0];
              var value = nv[1];
              var qualName = qname(name, true);
              var prefix = qualName.prefix;
              var local = qualName.local;
              var uri = prefix === "" ? "" : tag.ns[prefix] || "";
              var a = {
                name,
                value,
                prefix,
                local,
                uri
              };
              if (prefix && prefix !== "xmlns" && !uri) {
                strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
                a.uri = prefix;
              }
              parser.tag.attributes[name] = a;
              emitNode(parser, "onattribute", a);
            }
            parser.attribList.length = 0;
          }
          parser.tag.isSelfClosing = !!selfClosing;
          parser.sawRoot = true;
          parser.tags.push(parser.tag);
          emitNode(parser, "onopentag", parser.tag);
          if (!selfClosing) {
            if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
              parser.state = S.SCRIPT;
            } else {
              parser.state = S.TEXT;
            }
            parser.tag = null;
            parser.tagName = "";
          }
          parser.attribName = parser.attribValue = "";
          parser.attribList.length = 0;
        }
        function closeTag(parser) {
          if (!parser.tagName) {
            strictFail(parser, "Weird empty close tag.");
            parser.textNode += "</>";
            parser.state = S.TEXT;
            return;
          }
          if (parser.script) {
            if (parser.tagName !== "script") {
              parser.script += "</" + parser.tagName + ">";
              parser.tagName = "";
              parser.state = S.SCRIPT;
              return;
            }
            emitNode(parser, "onscript", parser.script);
            parser.script = "";
          }
          var t = parser.tags.length;
          var tagName = parser.tagName;
          if (!parser.strict) {
            tagName = tagName[parser.looseCase]();
          }
          var closeTo = tagName;
          while (t--) {
            var close = parser.tags[t];
            if (close.name !== closeTo) {
              strictFail(parser, "Unexpected close tag");
            } else {
              break;
            }
          }
          if (t < 0) {
            strictFail(parser, "Unmatched closing tag: " + parser.tagName);
            parser.textNode += "</" + parser.tagName + ">";
            parser.state = S.TEXT;
            return;
          }
          parser.tagName = tagName;
          var s2 = parser.tags.length;
          while (s2-- > t) {
            var tag = parser.tag = parser.tags.pop();
            parser.tagName = parser.tag.name;
            emitNode(parser, "onclosetag", parser.tagName);
            var x = {};
            for (var i in tag.ns) {
              x[i] = tag.ns[i];
            }
            var parent = parser.tags[parser.tags.length - 1] || parser;
            if (parser.opt.xmlns && tag.ns !== parent.ns) {
              Object.keys(tag.ns).forEach(function (p) {
                var n = tag.ns[p];
                emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
              });
            }
          }
          if (t === 0)
            parser.closedRoot = true;
          parser.tagName = parser.attribValue = parser.attribName = "";
          parser.attribList.length = 0;
          parser.state = S.TEXT;
        }
        function parseEntity(parser) {
          var entity = parser.entity;
          var entityLC = entity.toLowerCase();
          var num;
          var numStr = "";
          if (parser.ENTITIES[entity]) {
            return parser.ENTITIES[entity];
          }
          if (parser.ENTITIES[entityLC]) {
            return parser.ENTITIES[entityLC];
          }
          entity = entityLC;
          if (entity.charAt(0) === "#") {
            if (entity.charAt(1) === "x") {
              entity = entity.slice(2);
              num = parseInt(entity, 16);
              numStr = num.toString(16);
            } else {
              entity = entity.slice(1);
              num = parseInt(entity, 10);
              numStr = num.toString(10);
            }
          }
          entity = entity.replace(/^0+/, "");
          if (isNaN(num) || numStr.toLowerCase() !== entity) {
            strictFail(parser, "Invalid character entity");
            return "&" + parser.entity + ";";
          }
          return String.fromCodePoint(num);
        }
        function beginWhiteSpace(parser, c) {
          if (c === "<") {
            parser.state = S.OPEN_WAKA;
            parser.startTagPosition = parser.position;
          } else if (!isWhitespace(c)) {
            strictFail(parser, "Non-whitespace before first tag.");
            parser.textNode = c;
            parser.state = S.TEXT;
          }
        }
        function charAt(chunk, i) {
          var result = "";
          if (i < chunk.length) {
            result = chunk.charAt(i);
          }
          return result;
        }
        function write(chunk) {
          var parser = this;
          if (this.error) {
            throw this.error;
          }
          if (parser.closed) {
            return error(
              parser,
              "Cannot write after close. Assign an onready handler."
            );
          }
          if (chunk === null) {
            return end(parser);
          }
          if (typeof chunk === "object") {
            chunk = chunk.toString();
          }
          var i = 0;
          var c = "";
          while (true) {
            c = charAt(chunk, i++);
            parser.c = c;
            if (!c) {
              break;
            }
            if (parser.trackPosition) {
              parser.position++;
              if (c === "\n") {
                parser.line++;
                parser.column = 0;
              } else {
                parser.column++;
              }
            }
            switch (parser.state) {
              case S.BEGIN:
                parser.state = S.BEGIN_WHITESPACE;
                if (c === "\uFEFF") {
                  continue;
                }
                beginWhiteSpace(parser, c);
                continue;
              case S.BEGIN_WHITESPACE:
                beginWhiteSpace(parser, c);
                continue;
              case S.TEXT:
                if (parser.sawRoot && !parser.closedRoot) {
                  var starti = i - 1;
                  while (c && c !== "<" && c !== "&") {
                    c = charAt(chunk, i++);
                    if (c && parser.trackPosition) {
                      parser.position++;
                      if (c === "\n") {
                        parser.line++;
                        parser.column = 0;
                      } else {
                        parser.column++;
                      }
                    }
                  }
                  parser.textNode += chunk.substring(starti, i - 1);
                }
                if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                  parser.state = S.OPEN_WAKA;
                  parser.startTagPosition = parser.position;
                } else {
                  if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                    strictFail(parser, "Text data outside of root node.");
                  }
                  if (c === "&") {
                    parser.state = S.TEXT_ENTITY;
                  } else {
                    parser.textNode += c;
                  }
                }
                continue;
              case S.SCRIPT:
                if (c === "<") {
                  parser.state = S.SCRIPT_ENDING;
                } else {
                  parser.script += c;
                }
                continue;
              case S.SCRIPT_ENDING:
                if (c === "/") {
                  parser.state = S.CLOSE_TAG;
                } else {
                  parser.script += "<" + c;
                  parser.state = S.SCRIPT;
                }
                continue;
              case S.OPEN_WAKA:
                if (c === "!") {
                  parser.state = S.SGML_DECL;
                  parser.sgmlDecl = "";
                } else if (isWhitespace(c)) {
                } else if (isMatch(nameStart, c)) {
                  parser.state = S.OPEN_TAG;
                  parser.tagName = c;
                } else if (c === "/") {
                  parser.state = S.CLOSE_TAG;
                  parser.tagName = "";
                } else if (c === "?") {
                  parser.state = S.PROC_INST;
                  parser.procInstName = parser.procInstBody = "";
                } else {
                  strictFail(parser, "Unencoded <");
                  if (parser.startTagPosition + 1 < parser.position) {
                    var pad = parser.position - parser.startTagPosition;
                    c = new Array(pad).join(" ") + c;
                  }
                  parser.textNode += "<" + c;
                  parser.state = S.TEXT;
                }
                continue;
              case S.SGML_DECL:
                if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                  emitNode(parser, "onopencdata");
                  parser.state = S.CDATA;
                  parser.sgmlDecl = "";
                  parser.cdata = "";
                } else if (parser.sgmlDecl + c === "--") {
                  parser.state = S.COMMENT;
                  parser.comment = "";
                  parser.sgmlDecl = "";
                } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                  parser.state = S.DOCTYPE;
                  if (parser.doctype || parser.sawRoot) {
                    strictFail(
                      parser,
                      "Inappropriately located doctype declaration"
                    );
                  }
                  parser.doctype = "";
                  parser.sgmlDecl = "";
                } else if (c === ">") {
                  emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                  parser.sgmlDecl = "";
                  parser.state = S.TEXT;
                } else if (isQuote(c)) {
                  parser.state = S.SGML_DECL_QUOTED;
                  parser.sgmlDecl += c;
                } else {
                  parser.sgmlDecl += c;
                }
                continue;
              case S.SGML_DECL_QUOTED:
                if (c === parser.q) {
                  parser.state = S.SGML_DECL;
                  parser.q = "";
                }
                parser.sgmlDecl += c;
                continue;
              case S.DOCTYPE:
                if (c === ">") {
                  parser.state = S.TEXT;
                  emitNode(parser, "ondoctype", parser.doctype);
                  parser.doctype = true;
                } else {
                  parser.doctype += c;
                  if (c === "[") {
                    parser.state = S.DOCTYPE_DTD;
                  } else if (isQuote(c)) {
                    parser.state = S.DOCTYPE_QUOTED;
                    parser.q = c;
                  }
                }
                continue;
              case S.DOCTYPE_QUOTED:
                parser.doctype += c;
                if (c === parser.q) {
                  parser.q = "";
                  parser.state = S.DOCTYPE;
                }
                continue;
              case S.DOCTYPE_DTD:
                parser.doctype += c;
                if (c === "]") {
                  parser.state = S.DOCTYPE;
                } else if (isQuote(c)) {
                  parser.state = S.DOCTYPE_DTD_QUOTED;
                  parser.q = c;
                }
                continue;
              case S.DOCTYPE_DTD_QUOTED:
                parser.doctype += c;
                if (c === parser.q) {
                  parser.state = S.DOCTYPE_DTD;
                  parser.q = "";
                }
                continue;
              case S.COMMENT:
                if (c === "-") {
                  parser.state = S.COMMENT_ENDING;
                } else {
                  parser.comment += c;
                }
                continue;
              case S.COMMENT_ENDING:
                if (c === "-") {
                  parser.state = S.COMMENT_ENDED;
                  parser.comment = textopts(parser.opt, parser.comment);
                  if (parser.comment) {
                    emitNode(parser, "oncomment", parser.comment);
                  }
                  parser.comment = "";
                } else {
                  parser.comment += "-" + c;
                  parser.state = S.COMMENT;
                }
                continue;
              case S.COMMENT_ENDED:
                if (c !== ">") {
                  strictFail(parser, "Malformed comment");
                  parser.comment += "--" + c;
                  parser.state = S.COMMENT;
                } else {
                  parser.state = S.TEXT;
                }
                continue;
              case S.CDATA:
                if (c === "]") {
                  parser.state = S.CDATA_ENDING;
                } else {
                  parser.cdata += c;
                }
                continue;
              case S.CDATA_ENDING:
                if (c === "]") {
                  parser.state = S.CDATA_ENDING_2;
                } else {
                  parser.cdata += "]" + c;
                  parser.state = S.CDATA;
                }
                continue;
              case S.CDATA_ENDING_2:
                if (c === ">") {
                  if (parser.cdata) {
                    emitNode(parser, "oncdata", parser.cdata);
                  }
                  emitNode(parser, "onclosecdata");
                  parser.cdata = "";
                  parser.state = S.TEXT;
                } else if (c === "]") {
                  parser.cdata += "]";
                } else {
                  parser.cdata += "]]" + c;
                  parser.state = S.CDATA;
                }
                continue;
              case S.PROC_INST:
                if (c === "?") {
                  parser.state = S.PROC_INST_ENDING;
                } else if (isWhitespace(c)) {
                  parser.state = S.PROC_INST_BODY;
                } else {
                  parser.procInstName += c;
                }
                continue;
              case S.PROC_INST_BODY:
                if (!parser.procInstBody && isWhitespace(c)) {
                  continue;
                } else if (c === "?") {
                  parser.state = S.PROC_INST_ENDING;
                } else {
                  parser.procInstBody += c;
                }
                continue;
              case S.PROC_INST_ENDING:
                if (c === ">") {
                  emitNode(parser, "onprocessinginstruction", {
                    name: parser.procInstName,
                    body: parser.procInstBody
                  });
                  parser.procInstName = parser.procInstBody = "";
                  parser.state = S.TEXT;
                } else {
                  parser.procInstBody += "?" + c;
                  parser.state = S.PROC_INST_BODY;
                }
                continue;
              case S.OPEN_TAG:
                if (isMatch(nameBody, c)) {
                  parser.tagName += c;
                } else {
                  newTag(parser);
                  if (c === ">") {
                    openTag(parser);
                  } else if (c === "/") {
                    parser.state = S.OPEN_TAG_SLASH;
                  } else {
                    if (!isWhitespace(c)) {
                      strictFail(parser, "Invalid character in tag name");
                    }
                    parser.state = S.ATTRIB;
                  }
                }
                continue;
              case S.OPEN_TAG_SLASH:
                if (c === ">") {
                  openTag(parser, true);
                  closeTag(parser);
                } else {
                  strictFail(parser, "Forward-slash in opening tag not followed by >");
                  parser.state = S.ATTRIB;
                }
                continue;
              case S.ATTRIB:
                if (isWhitespace(c)) {
                  continue;
                } else if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.attribValue = "";
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                }
                continue;
              case S.ATTRIB_NAME:
                if (c === "=") {
                  parser.state = S.ATTRIB_VALUE;
                } else if (c === ">") {
                  strictFail(parser, "Attribute without value");
                  parser.attribValue = parser.attribName;
                  attrib(parser);
                  openTag(parser);
                } else if (isWhitespace(c)) {
                  parser.state = S.ATTRIB_NAME_SAW_WHITE;
                } else if (isMatch(nameBody, c)) {
                  parser.attribName += c;
                } else {
                  strictFail(parser, "Invalid attribute name");
                }
                continue;
              case S.ATTRIB_NAME_SAW_WHITE:
                if (c === "=") {
                  parser.state = S.ATTRIB_VALUE;
                } else if (isWhitespace(c)) {
                  continue;
                } else {
                  strictFail(parser, "Attribute without value");
                  parser.tag.attributes[parser.attribName] = "";
                  parser.attribValue = "";
                  emitNode(parser, "onattribute", {
                    name: parser.attribName,
                    value: ""
                  });
                  parser.attribName = "";
                  if (c === ">") {
                    openTag(parser);
                  } else if (isMatch(nameStart, c)) {
                    parser.attribName = c;
                    parser.state = S.ATTRIB_NAME;
                  } else {
                    strictFail(parser, "Invalid attribute name");
                    parser.state = S.ATTRIB;
                  }
                }
                continue;
              case S.ATTRIB_VALUE:
                if (isWhitespace(c)) {
                  continue;
                } else if (isQuote(c)) {
                  parser.q = c;
                  parser.state = S.ATTRIB_VALUE_QUOTED;
                } else {
                  strictFail(parser, "Unquoted attribute value");
                  parser.state = S.ATTRIB_VALUE_UNQUOTED;
                  parser.attribValue = c;
                }
                continue;
              case S.ATTRIB_VALUE_QUOTED:
                if (c !== parser.q) {
                  if (c === "&") {
                    parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                  } else {
                    parser.attribValue += c;
                  }
                  continue;
                }
                attrib(parser);
                parser.q = "";
                parser.state = S.ATTRIB_VALUE_CLOSED;
                continue;
              case S.ATTRIB_VALUE_CLOSED:
                if (isWhitespace(c)) {
                  parser.state = S.ATTRIB;
                } else if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else if (isMatch(nameStart, c)) {
                  strictFail(parser, "No whitespace between attributes");
                  parser.attribName = c;
                  parser.attribValue = "";
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                }
                continue;
              case S.ATTRIB_VALUE_UNQUOTED:
                if (!isAttribEnd(c)) {
                  if (c === "&") {
                    parser.state = S.ATTRIB_VALUE_ENTITY_U;
                  } else {
                    parser.attribValue += c;
                  }
                  continue;
                }
                attrib(parser);
                if (c === ">") {
                  openTag(parser);
                } else {
                  parser.state = S.ATTRIB;
                }
                continue;
              case S.CLOSE_TAG:
                if (!parser.tagName) {
                  if (isWhitespace(c)) {
                    continue;
                  } else if (notMatch(nameStart, c)) {
                    if (parser.script) {
                      parser.script += "</" + c;
                      parser.state = S.SCRIPT;
                    } else {
                      strictFail(parser, "Invalid tagname in closing tag.");
                    }
                  } else {
                    parser.tagName = c;
                  }
                } else if (c === ">") {
                  closeTag(parser);
                } else if (isMatch(nameBody, c)) {
                  parser.tagName += c;
                } else if (parser.script) {
                  parser.script += "</" + parser.tagName;
                  parser.tagName = "";
                  parser.state = S.SCRIPT;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid tagname in closing tag");
                  }
                  parser.state = S.CLOSE_TAG_SAW_WHITE;
                }
                continue;
              case S.CLOSE_TAG_SAW_WHITE:
                if (isWhitespace(c)) {
                  continue;
                }
                if (c === ">") {
                  closeTag(parser);
                } else {
                  strictFail(parser, "Invalid characters in closing tag");
                }
                continue;
              case S.TEXT_ENTITY:
              case S.ATTRIB_VALUE_ENTITY_Q:
              case S.ATTRIB_VALUE_ENTITY_U:
                var returnState;
                var buffer;
                switch (parser.state) {
                  case S.TEXT_ENTITY:
                    returnState = S.TEXT;
                    buffer = "textNode";
                    break;
                  case S.ATTRIB_VALUE_ENTITY_Q:
                    returnState = S.ATTRIB_VALUE_QUOTED;
                    buffer = "attribValue";
                    break;
                  case S.ATTRIB_VALUE_ENTITY_U:
                    returnState = S.ATTRIB_VALUE_UNQUOTED;
                    buffer = "attribValue";
                    break;
                }
                if (c === ";") {
                  parser[buffer] += parseEntity(parser);
                  parser.entity = "";
                  parser.state = returnState;
                } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                  parser.entity += c;
                } else {
                  strictFail(parser, "Invalid character in entity name");
                  parser[buffer] += "&" + parser.entity + c;
                  parser.entity = "";
                  parser.state = returnState;
                }
                continue;
              default:
                throw new Error(parser, "Unknown state: " + parser.state);
            }
          }
          if (parser.position >= parser.bufferCheckPosition) {
            checkBufferLength(parser);
          }
          return parser;
        }
        if (!String.fromCodePoint) {
          (function () {
            var stringFromCharCode = String.fromCharCode;
            var floor = Math.floor;
            var fromCodePoint = function () {
              var MAX_SIZE = 16384;
              var codeUnits = [];
              var highSurrogate;
              var lowSurrogate;
              var index = -1;
              var length = arguments.length;
              if (!length) {
                return "";
              }
              var result = "";
              while (++index < length) {
                var codePoint = Number(arguments[index]);
                if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                  codePoint < 0 || // not a valid Unicode code point
                  codePoint > 1114111 || // not a valid Unicode code point
                  floor(codePoint) !== codePoint) {
                  throw RangeError("Invalid code point: " + codePoint);
                }
                if (codePoint <= 65535) {
                  codeUnits.push(codePoint);
                } else {
                  codePoint -= 65536;
                  highSurrogate = (codePoint >> 10) + 55296;
                  lowSurrogate = codePoint % 1024 + 56320;
                  codeUnits.push(highSurrogate, lowSurrogate);
                }
                if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                  result += stringFromCharCode.apply(null, codeUnits);
                  codeUnits.length = 0;
                }
              }
              return result;
            };
            if (Object.defineProperty) {
              Object.defineProperty(String, "fromCodePoint", {
                value: fromCodePoint,
                configurable: true,
                writable: true
              });
            } else {
              String.fromCodePoint = fromCodePoint;
            }
          })();
        }
      })(typeof exports === "undefined" ? exports.sax = {} : exports);
    }
  });

  // node_modules/events/events.js
  var require_events = __commonJS({
    "node_modules/events/events.js"(exports, module) {
      "use strict";
      var R = typeof Reflect === "object" ? Reflect : null;
      var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
        return Function.prototype.apply.call(target, receiver, args);
      };
      var ReflectOwnKeys;
      if (R && typeof R.ownKeys === "function") {
        ReflectOwnKeys = R.ownKeys;
      } else if (Object.getOwnPropertySymbols) {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
        };
      } else {
        ReflectOwnKeys = function ReflectOwnKeys2(target) {
          return Object.getOwnPropertyNames(target);
        };
      }
      function ProcessEmitWarning(warning) {
        if (console && console.warn)
          console.warn(warning);
      }
      var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
        return value !== value;
      };
      function EventEmitter() {
        EventEmitter.init.call(this);
      }
      module.exports = EventEmitter;
      module.exports.once = once;
      EventEmitter.EventEmitter = EventEmitter;
      EventEmitter.prototype._events = void 0;
      EventEmitter.prototype._eventsCount = 0;
      EventEmitter.prototype._maxListeners = void 0;
      var defaultMaxListeners = 10;
      function checkListener(listener) {
        if (typeof listener !== "function") {
          throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
        }
      }
      Object.defineProperty(EventEmitter, "defaultMaxListeners", {
        enumerable: true,
        get: function () {
          return defaultMaxListeners;
        },
        set: function (arg) {
          if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
            throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
          }
          defaultMaxListeners = arg;
        }
      });
      EventEmitter.init = function () {
        if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        }
        this._maxListeners = this._maxListeners || void 0;
      };
      EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
        if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
          throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
        }
        this._maxListeners = n;
        return this;
      };
      function _getMaxListeners(that) {
        if (that._maxListeners === void 0)
          return EventEmitter.defaultMaxListeners;
        return that._maxListeners;
      }
      EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
        return _getMaxListeners(this);
      };
      EventEmitter.prototype.emit = function emit(type) {
        var args = [];
        for (var i = 1; i < arguments.length; i++)
          args.push(arguments[i]);
        var doError = type === "error";
        var events = this._events;
        if (events !== void 0)
          doError = doError && events.error === void 0;
        else if (!doError)
          return false;
        if (doError) {
          var er;
          if (args.length > 0)
            er = args[0];
          if (er instanceof Error) {
            throw er;
          }
          var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
          err.context = er;
          throw err;
        }
        var handler = events[type];
        if (handler === void 0)
          return false;
        if (typeof handler === "function") {
          ReflectApply(handler, this, args);
        } else {
          var len = handler.length;
          var listeners = arrayClone(handler, len);
          for (var i = 0; i < len; ++i)
            ReflectApply(listeners[i], this, args);
        }
        return true;
      };
      function _addListener(target, type, listener, prepend) {
        var m;
        var events;
        var existing;
        checkListener(listener);
        events = target._events;
        if (events === void 0) {
          events = target._events = /* @__PURE__ */ Object.create(null);
          target._eventsCount = 0;
        } else {
          if (events.newListener !== void 0) {
            target.emit(
              "newListener",
              type,
              listener.listener ? listener.listener : listener
            );
            events = target._events;
          }
          existing = events[type];
        }
        if (existing === void 0) {
          existing = events[type] = listener;
          ++target._eventsCount;
        } else {
          if (typeof existing === "function") {
            existing = events[type] = prepend ? [listener, existing] : [existing, listener];
          } else if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
          m = _getMaxListeners(target);
          if (m > 0 && existing.length > m && !existing.warned) {
            existing.warned = true;
            var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
            w.name = "MaxListenersExceededWarning";
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            ProcessEmitWarning(w);
          }
        }
        return target;
      }
      EventEmitter.prototype.addListener = function addListener(type, listener) {
        return _addListener(this, type, listener, false);
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener;
      EventEmitter.prototype.prependListener = function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };
      function onceWrapper() {
        if (!this.fired) {
          this.target.removeListener(this.type, this.wrapFn);
          this.fired = true;
          if (arguments.length === 0)
            return this.listener.call(this.target);
          return this.listener.apply(this.target, arguments);
        }
      }
      function _onceWrap(target, type, listener) {
        var state = { fired: false, wrapFn: void 0, target, type, listener };
        var wrapped = onceWrapper.bind(state);
        wrapped.listener = listener;
        state.wrapFn = wrapped;
        return wrapped;
      }
      EventEmitter.prototype.once = function once2(type, listener) {
        checkListener(listener);
        this.on(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
        checkListener(listener);
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };
      EventEmitter.prototype.removeListener = function removeListener(type, listener) {
        var list, events, position, i, originalListener;
        checkListener(listener);
        events = this._events;
        if (events === void 0)
          return this;
        list = events[type];
        if (list === void 0)
          return this;
        if (list === listener || list.listener === listener) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else {
            delete events[type];
            if (events.removeListener)
              this.emit("removeListener", type, list.listener || listener);
          }
        } else if (typeof list !== "function") {
          position = -1;
          for (i = list.length - 1; i >= 0; i--) {
            if (list[i] === listener || list[i].listener === listener) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }
          if (position < 0)
            return this;
          if (position === 0)
            list.shift();
          else {
            spliceOne(list, position);
          }
          if (list.length === 1)
            events[type] = list[0];
          if (events.removeListener !== void 0)
            this.emit("removeListener", type, originalListener || listener);
        }
        return this;
      };
      EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
      EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
        var listeners, events, i;
        events = this._events;
        if (events === void 0)
          return this;
        if (events.removeListener === void 0) {
          if (arguments.length === 0) {
            this._events = /* @__PURE__ */ Object.create(null);
            this._eventsCount = 0;
          } else if (events[type] !== void 0) {
            if (--this._eventsCount === 0)
              this._events = /* @__PURE__ */ Object.create(null);
            else
              delete events[type];
          }
          return this;
        }
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          var key;
          for (i = 0; i < keys.length; ++i) {
            key = keys[i];
            if (key === "removeListener")
              continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners("removeListener");
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
          return this;
        }
        listeners = events[type];
        if (typeof listeners === "function") {
          this.removeListener(type, listeners);
        } else if (listeners !== void 0) {
          for (i = listeners.length - 1; i >= 0; i--) {
            this.removeListener(type, listeners[i]);
          }
        }
        return this;
      };
      function _listeners(target, type, unwrap) {
        var events = target._events;
        if (events === void 0)
          return [];
        var evlistener = events[type];
        if (evlistener === void 0)
          return [];
        if (typeof evlistener === "function")
          return unwrap ? [evlistener.listener || evlistener] : [evlistener];
        return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
      }
      EventEmitter.prototype.listeners = function listeners(type) {
        return _listeners(this, type, true);
      };
      EventEmitter.prototype.rawListeners = function rawListeners(type) {
        return _listeners(this, type, false);
      };
      EventEmitter.listenerCount = function (emitter, type) {
        if (typeof emitter.listenerCount === "function") {
          return emitter.listenerCount(type);
        } else {
          return listenerCount.call(emitter, type);
        }
      };
      EventEmitter.prototype.listenerCount = listenerCount;
      function listenerCount(type) {
        var events = this._events;
        if (events !== void 0) {
          var evlistener = events[type];
          if (typeof evlistener === "function") {
            return 1;
          } else if (evlistener !== void 0) {
            return evlistener.length;
          }
        }
        return 0;
      }
      EventEmitter.prototype.eventNames = function eventNames() {
        return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
      };
      function arrayClone(arr, n) {
        var copy = new Array(n);
        for (var i = 0; i < n; ++i)
          copy[i] = arr[i];
        return copy;
      }
      function spliceOne(list, index) {
        for (; index + 1 < list.length; index++)
          list[index] = list[index + 1];
        list.pop();
      }
      function unwrapListeners(arr) {
        var ret = new Array(arr.length);
        for (var i = 0; i < ret.length; ++i) {
          ret[i] = arr[i].listener || arr[i];
        }
        return ret;
      }
      function once(emitter, name) {
        return new Promise(function (resolve, reject) {
          function errorListener(err) {
            emitter.removeListener(name, resolver);
            reject(err);
          }
          function resolver() {
            if (typeof emitter.removeListener === "function") {
              emitter.removeListener("error", errorListener);
            }
            resolve([].slice.call(arguments));
          }
          ;
          eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
          if (name !== "error") {
            addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
          }
        });
      }
      function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
        if (typeof emitter.on === "function") {
          eventTargetAgnosticAddListener(emitter, "error", handler, flags);
        }
      }
      function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
        if (typeof emitter.on === "function") {
          if (flags.once) {
            emitter.once(name, listener);
          } else {
            emitter.on(name, listener);
          }
        } else if (typeof emitter.addEventListener === "function") {
          emitter.addEventListener(name, function wrapListener(arg) {
            if (flags.once) {
              emitter.removeEventListener(name, wrapListener);
            }
            listener(arg);
          });
        } else {
          throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
        }
      }
    }
  });

  // node_modules/xml2js/lib/bom.js
  var require_bom = __commonJS({
    "node_modules/xml2js/lib/bom.js"(exports) {
      (function () {
        "use strict";
        exports.stripBOM = function (str) {
          if (str[0] === "\uFEFF") {
            return str.substring(1);
          } else {
            return str;
          }
        };
      }).call(exports);
    }
  });

  // node_modules/xml2js/lib/processors.js
  var require_processors = __commonJS({
    "node_modules/xml2js/lib/processors.js"(exports) {
      (function () {
        "use strict";
        var prefixMatch;
        prefixMatch = new RegExp(/(?!xmlns)^.*:/);
        exports.normalize = function (str) {
          return str.toLowerCase();
        };
        exports.firstCharLowerCase = function (str) {
          return str.charAt(0).toLowerCase() + str.slice(1);
        };
        exports.stripPrefix = function (str) {
          return str.replace(prefixMatch, "");
        };
        exports.parseNumbers = function (str) {
          if (!isNaN(str)) {
            str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
          }
          return str;
        };
        exports.parseBooleans = function (str) {
          if (/^(?:true|false)$/i.test(str)) {
            str = str.toLowerCase() === "true";
          }
          return str;
        };
      }).call(exports);
    }
  });

  // node_modules/timers/index.js
  var require_timers = __commonJS({
    "node_modules/timers/index.js"(exports) {
      exports.every = function (str) {
        return new Every(str);
      };
      var time = {
        millisecond: 1,
        second: 1e3,
        minute: 6e4,
        hour: 36e5,
        day: 864e5
      };
      for (key in time) {
        if (key === "millisecond") {
          time.ms = time[key];
        } else {
          time[key.charAt(0)] = time[key];
        }
        time[key + "s"] = time[key];
      }
      var key;
      function Every(str) {
        this.count = 0;
        var m = parse(str);
        if (m) {
          this.time = Number(m[0]) * time[m[1]];
          this.type = m[1];
        }
      }
      Every.prototype.do = function (cb) {
        if (this.time) {
          this.interval = setInterval(callback, this.time);
        }
        var that = this;
        function callback() {
          that.count++;
          cb.call(that);
        }
        return this;
      };
      Every.prototype.stop = function () {
        if (this.interval) {
          clearInterval(this.interval);
          delete this.interval;
        }
        return this;
      };
      var reg = /^\s*(\d+(?:\.\d+)?)\s*([a-z]+)\s*$/;
      function parse(str) {
        var m = str.match(reg);
        if (m && time[m[2]]) {
          return m.slice(1);
        }
        return null;
      }
    }
  });

  // node_modules/xml2js/lib/parser.js
  var require_parser = __commonJS({
    "node_modules/xml2js/lib/parser.js"(exports) {
      (function () {
        "use strict";
        var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate, bind = function (fn, me) {
          return function () {
            return fn.apply(me, arguments);
          };
        }, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        sax = require_sax();
        events = require_events();
        bom = require_bom();
        processors = require_processors();
        setImmediate = require_timers().setImmediate;
        defaults = require_defaults().defaults;
        isEmpty = function (thing) {
          return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
        };
        processItem = function (processors2, item, key) {
          var i, len, process;
          for (i = 0, len = processors2.length; i < len; i++) {
            process = processors2[i];
            item = process(item, key);
          }
          return item;
        };
        exports.Parser = function (superClass) {
          extend(Parser, superClass);
          function Parser(opts) {
            this.parseStringPromise = bind(this.parseStringPromise, this);
            this.parseString = bind(this.parseString, this);
            this.reset = bind(this.reset, this);
            this.assignOrPush = bind(this.assignOrPush, this);
            this.processAsync = bind(this.processAsync, this);
            var key, ref, value;
            if (!(this instanceof exports.Parser)) {
              return new exports.Parser(opts);
            }
            this.options = {};
            ref = defaults["0.2"];
            for (key in ref) {
              if (!hasProp.call(ref, key))
                continue;
              value = ref[key];
              this.options[key] = value;
            }
            for (key in opts) {
              if (!hasProp.call(opts, key))
                continue;
              value = opts[key];
              this.options[key] = value;
            }
            if (this.options.xmlns) {
              this.options.xmlnskey = this.options.attrkey + "ns";
            }
            if (this.options.normalizeTags) {
              if (!this.options.tagNameProcessors) {
                this.options.tagNameProcessors = [];
              }
              this.options.tagNameProcessors.unshift(processors.normalize);
            }
            this.reset();
          }
          Parser.prototype.processAsync = function () {
            var chunk, err;
            try {
              if (this.remaining.length <= this.options.chunkSize) {
                chunk = this.remaining;
                this.remaining = "";
                this.saxParser = this.saxParser.write(chunk);
                return this.saxParser.close();
              } else {
                chunk = this.remaining.substr(0, this.options.chunkSize);
                this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
                this.saxParser = this.saxParser.write(chunk);
                return setImmediate(this.processAsync);
              }
            } catch (error1) {
              err = error1;
              if (!this.saxParser.errThrown) {
                this.saxParser.errThrown = true;
                return this.emit(err);
              }
            }
          };
          Parser.prototype.assignOrPush = function (obj, key, newValue) {
            if (!(key in obj)) {
              if (!this.options.explicitArray) {
                return obj[key] = newValue;
              } else {
                return obj[key] = [newValue];
              }
            } else {
              if (!(obj[key] instanceof Array)) {
                obj[key] = [obj[key]];
              }
              return obj[key].push(newValue);
            }
          };
          Parser.prototype.reset = function () {
            var attrkey, charkey, ontext, stack;
            this.removeAllListeners();
            this.saxParser = sax.parser(this.options.strict, {
              trim: false,
              normalize: false,
              xmlns: this.options.xmlns
            });
            this.saxParser.errThrown = false;
            this.saxParser.onerror = function (_this) {
              return function (error) {
                _this.saxParser.resume();
                if (!_this.saxParser.errThrown) {
                  _this.saxParser.errThrown = true;
                  return _this.emit("error", error);
                }
              };
            }(this);
            this.saxParser.onend = function (_this) {
              return function () {
                if (!_this.saxParser.ended) {
                  _this.saxParser.ended = true;
                  return _this.emit("end", _this.resultObject);
                }
              };
            }(this);
            this.saxParser.ended = false;
            this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
            this.resultObject = null;
            stack = [];
            attrkey = this.options.attrkey;
            charkey = this.options.charkey;
            this.saxParser.onopentag = function (_this) {
              return function (node) {
                var key, newValue, obj, processedKey, ref;
                obj = {};
                obj[charkey] = "";
                if (!_this.options.ignoreAttrs) {
                  ref = node.attributes;
                  for (key in ref) {
                    if (!hasProp.call(ref, key))
                      continue;
                    if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                      obj[attrkey] = {};
                    }
                    newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
                    processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                    if (_this.options.mergeAttrs) {
                      _this.assignOrPush(obj, processedKey, newValue);
                    } else {
                      obj[attrkey][processedKey] = newValue;
                    }
                  }
                }
                obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
                if (_this.options.xmlns) {
                  obj[_this.options.xmlnskey] = {
                    uri: node.uri,
                    local: node.local
                  };
                }
                return stack.push(obj);
              };
            }(this);
            this.saxParser.onclosetag = function (_this) {
              return function () {
                var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
                obj = stack.pop();
                nodeName = obj["#name"];
                if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                  delete obj["#name"];
                }
                if (obj.cdata === true) {
                  cdata = obj.cdata;
                  delete obj.cdata;
                }
                s = stack[stack.length - 1];
                if (obj[charkey].match(/^\s*$/) && !cdata) {
                  emptyStr = obj[charkey];
                  delete obj[charkey];
                } else {
                  if (_this.options.trim) {
                    obj[charkey] = obj[charkey].trim();
                  }
                  if (_this.options.normalize) {
                    obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
                if (isEmpty(obj)) {
                  obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
                }
                if (_this.options.validator != null) {
                  xpath = "/" + function () {
                    var i, len, results;
                    results = [];
                    for (i = 0, len = stack.length; i < len; i++) {
                      node = stack[i];
                      results.push(node["#name"]);
                    }
                    return results;
                  }().concat(nodeName).join("/");
                  (function () {
                    var err;
                    try {
                      return obj = _this.options.validator(xpath, s && s[nodeName], obj);
                    } catch (error1) {
                      err = error1;
                      return _this.emit("error", err);
                    }
                  })();
                }
                if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                  if (!_this.options.preserveChildrenOrder) {
                    node = {};
                    if (_this.options.attrkey in obj) {
                      node[_this.options.attrkey] = obj[_this.options.attrkey];
                      delete obj[_this.options.attrkey];
                    }
                    if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                      node[_this.options.charkey] = obj[_this.options.charkey];
                      delete obj[_this.options.charkey];
                    }
                    if (Object.getOwnPropertyNames(obj).length > 0) {
                      node[_this.options.childkey] = obj;
                    }
                    obj = node;
                  } else if (s) {
                    s[_this.options.childkey] = s[_this.options.childkey] || [];
                    objClone = {};
                    for (key in obj) {
                      if (!hasProp.call(obj, key))
                        continue;
                      objClone[key] = obj[key];
                    }
                    s[_this.options.childkey].push(objClone);
                    delete obj["#name"];
                    if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                      obj = obj[charkey];
                    }
                  }
                }
                if (stack.length > 0) {
                  return _this.assignOrPush(s, nodeName, obj);
                } else {
                  if (_this.options.explicitRoot) {
                    old = obj;
                    obj = {};
                    obj[nodeName] = old;
                  }
                  _this.resultObject = obj;
                  _this.saxParser.ended = true;
                  return _this.emit("end", _this.resultObject);
                }
              };
            }(this);
            ontext = function (_this) {
              return function (text) {
                var charChild, s;
                s = stack[stack.length - 1];
                if (s) {
                  s[charkey] += text;
                  if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                    s[_this.options.childkey] = s[_this.options.childkey] || [];
                    charChild = {
                      "#name": "__text__"
                    };
                    charChild[charkey] = text;
                    if (_this.options.normalize) {
                      charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                    }
                    s[_this.options.childkey].push(charChild);
                  }
                  return s;
                }
              };
            }(this);
            this.saxParser.ontext = ontext;
            return this.saxParser.oncdata = function (_this) {
              return function (text) {
                var s;
                s = ontext(text);
                if (s) {
                  return s.cdata = true;
                }
              };
            }(this);
          };
          Parser.prototype.parseString = function (str, cb) {
            var err;
            if (cb != null && typeof cb === "function") {
              this.on("end", function (result) {
                this.reset();
                return cb(null, result);
              });
              this.on("error", function (err2) {
                this.reset();
                return cb(err2);
              });
            }
            try {
              str = str.toString();
              if (str.trim() === "") {
                this.emit("end", null);
                return true;
              }
              str = bom.stripBOM(str);
              if (this.options.async) {
                this.remaining = str;
                setImmediate(this.processAsync);
                return this.saxParser;
              }
              return this.saxParser.write(str).close();
            } catch (error1) {
              err = error1;
              if (!(this.saxParser.errThrown || this.saxParser.ended)) {
                this.emit("error", err);
                return this.saxParser.errThrown = true;
              } else if (this.saxParser.ended) {
                throw err;
              }
            }
          };
          Parser.prototype.parseStringPromise = function (str) {
            return new Promise(function (_this) {
              return function (resolve, reject) {
                return _this.parseString(str, function (err, value) {
                  if (err) {
                    return reject(err);
                  } else {
                    return resolve(value);
                  }
                });
              };
            }(this));
          };
          return Parser;
        }(events);
        exports.parseString = function (str, a, b) {
          var cb, options, parser;
          if (b != null) {
            if (typeof b === "function") {
              cb = b;
            }
            if (typeof a === "object") {
              options = a;
            }
          } else {
            if (typeof a === "function") {
              cb = a;
            }
            options = {};
          }
          parser = new exports.Parser(options);
          return parser.parseString(str, cb);
        };
        exports.parseStringPromise = function (str, a) {
          var options, parser;
          if (typeof a === "object") {
            options = a;
          }
          parser = new exports.Parser(options);
          return parser.parseStringPromise(str);
        };
      }).call(exports);
    }
  });

  // node_modules/xml2js/lib/xml2js.js
  var require_xml2js = __commonJS({
    "node_modules/xml2js/lib/xml2js.js"(exports) {
      (function () {
        "use strict";
        var builder, defaults, parser, processors, extend = function (child, parent) {
          for (var key in parent) {
            if (hasProp.call(parent, key))
              child[key] = parent[key];
          }
          function ctor() {
            this.constructor = child;
          }
          ctor.prototype = parent.prototype;
          child.prototype = new ctor();
          child.__super__ = parent.prototype;
          return child;
        }, hasProp = {}.hasOwnProperty;
        defaults = require_defaults();
        builder = require_builder();
        parser = require_parser();
        processors = require_processors();
        exports.defaults = defaults.defaults;
        exports.processors = processors;
        exports.ValidationError = function (superClass) {
          extend(ValidationError, superClass);
          function ValidationError(message) {
            this.message = message;
          }
          return ValidationError;
        }(Error);
        exports.Builder = builder.Builder;
        exports.Parser = parser.Parser;
        exports.parseString = parser.parseString;
        exports.parseStringPromise = parser.parseStringPromise;
      }).call(exports);
    }
  });

  // src/index.ts
  var import_basic = __toESM(require_basic());

  // src/addon.ts
  var import_dist = __toESM(require_dist());

  // package.json
  var config = {
    addonName: "Zotero Reference",
    addonID: "zoteroreference@polygon.org",
    addonRef: "zoteroreference",
    addonInstance: "ZoteroReference",
    releasepage: "https://github.com/muisedestiny/zotero-reference/releases/latest/download/zotero-reference.xpi",
    updaterdf: "https://raw.githubusercontent.com/muisedestiny/zotero-reference/bootstrap/update.json"
  };

  // src/modules/locale.ts
  function initLocale() {
    addon.data.locale = {
      stringBundle: Components.classes["@mozilla.org/intl/stringbundle;1"].getService(Components.interfaces.nsIStringBundleService).createBundle(`chrome://${config.addonRef}/locale/addon.properties`)
    };
  }
  function getString(localString) {
    var _a;
    return (_a = addon.data.locale) == null ? void 0 : _a.stringBundle.GetStringFromName(localString);
  }

  // src/modules/preferenceScript.ts
  function registerPrefsScripts(_window) {
    if (!addon.data.prefs) {
      addon.data.prefs = {
        window: _window,
        columns: [],
        rows: []
      };
    } else {
      addon.data.prefs.window = _window;
    }
    updatePrefsUI();
    bindPrefEvents();
  }
  async function updatePrefsUI() {
    var _a, _b;
    const renderLock = ztoolkit.getGlobal("Zotero").Promise.defer();
    const tableHelper = new ztoolkit.VirtualizedTable((_a = addon.data.prefs) == null ? void 0 : _a.window).setContainerId(`${config.addonRef}-table-container`).setProp({
      id: `${config.addonRef}-prefs-table`,
      // Do not use setLocale, as it modifies the Zotero.Intl.strings
      // Set locales directly to columns
      columns: (_b = addon.data.prefs) == null ? void 0 : _b.columns.map(
        (column) => Object.assign(column, {
          label: getString(column.label) || column.label
        })
      ),
      showHeader: true,
      multiSelect: true,
      staticColumns: true,
      disableFontSizeScaling: true
    }).setProp("getRowCount", () => {
      var _a2;
      return ((_a2 = addon.data.prefs) == null ? void 0 : _a2.rows.length) || 0;
    }).setProp(
      "getRowData",
      (index) => {
        var _a2;
        return ((_a2 = addon.data.prefs) == null ? void 0 : _a2.rows[index]) || {
          title: "no data",
          detail: "no data"
        };
      }
    ).setProp("onSelectionChange", (selection) => {
      var _a2;
      new ztoolkit.ProgressWindow(config.addonName).createLine({
        text: `Selected line: ${(_a2 = addon.data.prefs) == null ? void 0 : _a2.rows.filter((v, i) => selection.isSelected(i)).map((row) => row.title).join(",")}`,
        progress: 100
      }).show();
    }).setProp("onKeyDown", (event) => {
      var _a2;
      if (event.key == "Delete" || Zotero.isMac && event.key == "Backspace") {
        addon.data.prefs.rows = ((_a2 = addon.data.prefs) == null ? void 0 : _a2.rows.filter(
          (v, i) => !tableHelper.treeInstance.selection.isSelected(i)
        )) || [];
        tableHelper.render();
        return false;
      }
      return true;
    }).setProp(
      "getRowString",
      (index) => {
        var _a2;
        return ((_a2 = addon.data.prefs) == null ? void 0 : _a2.rows[index].title) || "";
      }
    ).render(-1, () => {
      renderLock.resolve();
    });
    await renderLock.promise;
    ztoolkit.log("Preference table rendered!");
  }
  function bindPrefEvents() {
    var _a, _b;
    (_a = addon.data.prefs.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-enable`
    )) == null ? void 0 : _a.addEventListener("command", (e) => {
      ztoolkit.log(e);
      addon.data.prefs.window.alert(
        `Successfully changed to ${e.target.checked}!`
      );
    });
    (_b = addon.data.prefs.window.document.querySelector(
      `#zotero-prefpane-${config.addonRef}-input`
    )) == null ? void 0 : _b.addEventListener("change", (e) => {
      ztoolkit.log(e);
      addon.data.prefs.window.alert(
        `Successfully changed to ${e.target.value}!`
      );
    });
  }

  // src/modules/requests.ts
  var Requests = class {
    constructor() {
      /**
       * Record api response
       */
      this.cache = {};
    }
    async get(url, responseType = "json", headers = {}) {
      const k = JSON.stringify(arguments);
      if (this.cache[k]) {
        return this.cache[k];
      }
      let res = await Zotero.HTTP.request(
        "GET",
        url,
        {
          responseType,
          headers,
          credentials: "include"
        }
      );
      if (res.status == 200) {
        this.cache[k] = res.response;
        return res.response;
      } else {
        console.log(`get ${url} error`, res);
      }
    }
    async post(url, body = {}, responseType = "json") {
      const k = JSON.stringify(arguments);
      if (this.cache[k]) {
        return this.cache[k];
      }
      let res = await Zotero.HTTP.request(
        "POST",
        url,
        Object.assign({
          responseType
        }, Object.keys(body).length > 0 ? {
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
          // credentials: "include"
        } : {})
      );
      if (res.status == 200) {
        this.cache[k] = res.response;
        return res.response;
      } else {
        console.log(`post ${url} error`, res);
      }
    }
  };

  // src/modules/api.ts
  var xml2js = require_xml2js();
  var API = class {
    constructor(utils) {
      this.utils = utils;
      this.requests = new Requests();
      this.Info = {
        crossref: (item) => {
          var _a, _b;
          const types = {
            "journal-article": "journalArticle",
            "report": "report",
            "posted-content": "preprint",
            "book-chapter": "bookSection"
          };
          let references = (_a = item.reference) == null ? void 0 : _a.map((item2) => {
            let identifiers;
            let url;
            let text;
            let textInfo = {};
            if (item2.unstructured) {
              text = item2.unstructured;
              textInfo = this.utils.refText2Info(text);
            } else {
              if (item2["article-title"] && item2.year && item2.author) {
                text = `${item2.author} et al., ${item2.year}, ${item2["article-title"]}`;
              } else {
                let textArray = [];
                for (let key in item2) {
                  textArray.push(`${key}: ${item2[key]}`);
                }
                text = textArray.join("; ");
              }
            }
            if (item2.DOI) {
              identifiers = { DOI: item2.DOI };
              url = this.utils.identifiers2URL(identifiers);
            }
            let info2 = {
              identifiers: identifiers || textInfo.identifiers || {},
              title: item2["article-title"],
              authors: [item2 == null ? void 0 : item2.author],
              year: item2.year,
              text,
              type: types[item2.type] || "journalArticle",
              url: (textInfo == null ? void 0 : textInfo.url) || url
            };
            return info2;
          });
          const refCount = item["is-referenced-by-count"];
          let info = {
            identifiers: { DOI: item.DOI },
            authors: (_b = item == null ? void 0 : item.author) == null ? void 0 : _b.map((i) => i.family),
            title: Array.isArray(item.title) ? item.title[0] : item.title,
            year: item.published && item.published["date-parts"][0][0],
            type: types[item.type] || "journalArticle",
            text: item.title[0],
            url: item.URL,
            abstract: item.abstract,
            publishDate: item.published && item.published["date-parts"][0].join("-"),
            source: item.source.toLowerCase(),
            primaryVenue: item["container-title"] ? item["container-title"][0] : [],
            references,
            tags: [
              ...refCount && refCount > 0 ? [{
                text: refCount,
                color: "#2fb8cb",
                tip: "is-referenced-by-count"
              }] : []
            ]
          };
          return info;
        },
        connectedpapers: (item) => {
          var _a;
          let info = {
            identifiers: { DOI: item.doiInfo.doi },
            authors: (_a = item == null ? void 0 : item.authors) == null ? void 0 : _a.map((i) => i[0].name),
            title: item.title.text,
            year: item.year.text,
            type: "journalArticle",
            text: item.title.text,
            url: item.doiInfo.doiUrl,
            abstract: item.paperAbstract.text,
            source: "connectedpapers",
            primaryVenue: item.venue.text,
            references: [],
            tags: [
              { text: item.citationStats.numCitations, tip: "citationStats.numCitations", color: "rgba(53, 153, 154, 0.5)" },
              { text: item.citationStats.numReferences, tip: "citationStats.numReferences", color: "rgba(53, 153, 154, 0.75)" }
            ]
          };
          return info;
        },
        readpaper: (data) => {
          let info = {
            identifiers: {},
            title: this.utils.Html2Text(data.title),
            year: data.year,
            publishDate: data.publishDate,
            authors: data == null ? void 0 : data.authorList.map((i) => this.utils.Html2Text(i.name)),
            abstract: this.utils.Html2Text(data.summary),
            primaryVenue: this.utils.Html2Text(data.primaryVenue),
            tags: [
              ...data.venueTags || [],
              ...data.citationCount && data.citationCount > 0 ? [
                {
                  text: data.citationCount,
                  tip: "citationCount",
                  color: "#1f71e0"
                }
              ] : []
            ],
            source: "readpaper",
            type: "journalArticle"
          };
          return info;
        },
        semanticscholar(data) {
          var _a;
          let info = {
            identifiers: { DOI: data.DOI },
            title: data.title,
            authors: data.authors.map((i) => i.name),
            year: data.year,
            publishDate: data.publicationDate,
            abstract: data.abstract,
            source: "semanticscholar",
            type: "journalArticle",
            tags: data.fieldsOfStudy || [],
            primaryVenue: (_a = data.journal) == null ? void 0 : _a.name,
            url: data.DOI ? `http://doi.org/${data.DOI}` : void 0
          };
          return info;
        },
        unpaywall(data) {
          const types = {
            "journal-article": "journalArticle",
            "report": "report",
            "posted-content": "preprint",
            "book-chapter": "bookSection"
          };
          let info = {
            identifiers: { DOI: data.DOI },
            authors: data.z_authors.map((i) => i.family),
            title: data.title,
            year: data.year,
            type: types[data.genre],
            primaryVenue: data.journal_name,
            source: "unpaywall",
            publishDate: data.published_date,
            abstract: void 0
          };
          return info;
        },
        arXiv: (data) => {
          let info = {
            identifiers: { arXiv: data.arXiv },
            title: data.title[0].replace(/\n/g, ""),
            year: data.year,
            authors: data.author.map((e) => e.name[0]),
            abstract: data.summary[0].replace(/\n/g, ""),
            url: this.utils.identifiers2URL({ arXiv: data.arXiv }),
            type: "preprint",
            tags: data.category.map((e) => e["$"].term),
            publishDate: data.published && data.published[0],
            primaryVenue: data["arxiv:comment"] && data["arxiv:comment"][0]["_"].replace(/\n/g, "")
          };
          return info;
        }
      };
      this.BaseInfo = {
        readcube: (data) => {
          let identifiers;
          if (data.doi && this.utils.regex.arXiv.test(data.doi)) {
            data.arxiv = data.doi.match(this.utils.regex.arXiv).slice(-1)[0];
            data.doi = void 0;
          }
          let type = "journalArticle";
          if (data.arxiv && !data.doi) {
            identifiers = { arXiv: data.arxiv };
            type = "preprint";
          } else {
            identifiers = { DOI: data.doi };
          }
          let url = this.utils.identifiers2URL(identifiers);
          let related = {
            identifiers,
            title: data.title,
            authors: data == null ? void 0 : data.authors,
            year: data.year,
            type,
            text: data.title,
            url
          };
          return related;
        }
      };
    }
    // For DOI
    async getDOIBaseInfo(DOI) {
      const routes = {
        semanticscholar: `https://api.semanticscholar.org/graph/v1/paper/${DOI}?fields=title,year,authors`,
        unpaywall: `https://api.unpaywall.org/v2/${DOI}?email=ZoteroReference@polygon.org`
      };
      for (let route in routes) {
        let response = await this.requests.get(routes[route]);
        if (response) {
          response.DOI = DOI;
          return this.Info[route](response);
        }
      }
    }
    /**
     * From semanticscholar API
     * @param DOI 
     */
    async getDOIInfoBySemanticscholar(DOI) {
      var _a;
      const api = `https://api.semanticscholar.org/graph/v1/paper/${DOI}?fields=title,authors,abstract,year,journal,fieldsOfStudy,publicationVenue,publicationDate`;
      let response = await this.requests.get(api);
      if (response) {
        response.DOI = DOI;
        if (!response.abstract) {
          let text = await this.requests.get(
            `https://www.semanticscholar.org/paper/${response.paperId}`,
            "text/html"
          );
          let parser = ztoolkit.getDOMParser();
          let doc = parser.parseFromString(text, "text/html");
          const abstract = (_a = doc.head.querySelector("meta[name=description]")) == null ? void 0 : _a.getAttribute("content");
          if (!(abstract == null ? void 0 : abstract.startsWith("Semantic Scholar"))) {
            response.abstract = abstract;
          }
        }
        return this.Info.semanticscholar(response);
      }
    }
    async getDOIInfoByCrossref(DOI) {
      const api = `https://api.crossref.org/works/${DOI}/transform/application/vnd.citationstyles.csl+json`;
      let response = await this.requests.get(api);
      if (response) {
        response.DOI = DOI;
        let info = this.Info.crossref(response);
        return info;
      }
    }
    // async getDOIRelatedArray(DOI: string): Promise<ItemBaseInfo[] | undefined> {
    //   const api = `https://services.readcube.com/reader/related?doi=${DOI}`
    //   let response = await this.requests.get(api)
    //   if (response) {
    //     let arr: ItemBaseInfo[] = response.map((i: any) => {
    //       return this.BaseInfo.readcube(i) as ItemBaseInfo
    //     })
    //     return arr
    //   }
    // }
    async getDOIRelatedArray(DOI, limit = 20) {
      let res = await this.requests.get(
        `https://rest.connectedpapers.com/id_translator/doi/${DOI}`,
        "json",
        {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 e/107.0.0.0 Safari/537.36"
        }
      );
      const api = `https://www.semanticscholar.org/api/1/paper/${res.paperId}/related-papers?limit=20&recommenderType=relatedPapers`;
      let response = await this.requests.get(api, "json", {
        cookie: "aws-waf-token=fcf9f43b-d494-44a8-8806-da20c50d9457:AQoAaIgZ+Q0AAAAA:z/ZtlDV2Oz/Ymw+RFbJ0vnEAl1/wBKTH6I4/INUou3Qqkm00bibIWkYKq0w3qq4yxB2EtdBTtRT7Q2MBPjx17WmPmcVznf7mTMTwFQjmJOB2VgQeoBzsmuzVlI/l/NBlyTFdH8xEKYYWbXB8R5oK9o7JxolugTzDKvLX4Pc57cdkbCA5A6AIExi/Wm16"
      });
      console.log(response);
      if (response) {
        let arr = response.papers.map((i) => {
          var _a, _b;
          let info = {
            title: i.title.text,
            identifiers: {},
            year: i.year.text,
            text: i.title.text,
            type: "journalArticle",
            authors: i.authors.map((e) => e[1].text),
            abstract: ((_a = i.paperAbstract) == null ? void 0 : _a.text) || (i == null ? void 0 : i.paperAbstractTruncated)
          };
          if (((_b = i.citationContexts) == null ? void 0 : _b.length) > 0) {
            let descriptions = [];
            i.citationContexts.slice(0, 1).forEach((ctx) => {
              try {
                descriptions.push(
                  `${ctx.intents.length > 0 ? ctx.intents[0].id : "unknown"}: ${i.citationContexts[0].context.text}`
                );
              } catch {
                console.log(ctx);
              }
            });
            info.description = descriptions.join("\n");
          }
          return info;
        });
        return arr;
      }
    }
    /**
     * API失效
     */
    async _getDOIRelatedArray(DOI, limit = 20) {
      let res = await this.requests.get(
        `https://rest.connectedpapers.com/id_translator/doi/${DOI}`,
        "json",
        {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 e/107.0.0.0 Safari/537.36"
        }
      );
      const api = `https://www.semanticscholar.org/api/1/search/paper/${res.paperId}/citations`;
      let response = await this.requests.post(api, {
        "page": 1,
        "pageSize": 20,
        "sort": "relevance",
        "authors": [],
        "coAuthors": [],
        "venues": [],
        "yearFilter": null,
        "requireViewablePdf": false,
        "fieldsOfStudy": [],
        "useS2FosFields": true
      });
      console.log(response);
      if (response) {
        let arr = response.results.map((i) => {
          var _a;
          let info = {
            title: i.title.text,
            identifiers: {},
            year: i.year,
            text: i.title.text,
            type: "journalArticle",
            authors: i.authors.map((e) => e[1].text)
          };
          if (((_a = i.citationContexts) == null ? void 0 : _a.length) > 0) {
            let descriptions = [];
            i.citationContexts.slice(0, 1).forEach((ctx) => {
              try {
                descriptions.push(
                  `${ctx.intents.length > 0 ? ctx.intents[0].id : "unknown"}: ${i.citationContexts[0].context.text}`
                );
              } catch {
                console.log(ctx);
              }
            });
            info.description = descriptions.join("\n");
          }
          return info;
        });
        return arr;
      }
    }
    // For arXiv
    async getArXivInfo(arXiv) {
      var _a, _b;
      const api = `https://export.arxiv.org/api/query?id_list=${arXiv}`;
      let response = await this.requests.get(
        api,
        "application/xhtml+xml"
      );
      if (response) {
        let data = (_b = (_a = await xml2js.parseStringPromise(response)) == null ? void 0 : _a.feed) == null ? void 0 : _b.entry[0];
        if (data) {
          data.arXiv = arXiv;
          return this.Info.arXiv(data);
        }
      }
    }
    // For title
    /**
     * From crossref
     * @param title 
     * @returns 
     */
    async getTitleInfoByCrossref(title) {
      const api = `https://api.crossref.org/works?query=${title}`;
      let response = await this.requests.get(api);
      if (response) {
        const skipTypes = ["component"];
        let item = response.message.items.filter((e) => skipTypes.indexOf(e.type) == -1)[0];
        let info = this.Info.crossref(item);
        return info;
      }
    }
    async getTitleInfoByConnectedpapers(text) {
      var _a;
      let title = text;
      if (this.utils.isDOI(text)) {
        let DOI = text;
        let res = await this.requests.get(
          `https://rest.connectedpapers.com/id_translator/doi/${DOI}`
        );
        title = res.title;
      }
      const api = `https://rest.connectedpapers.com/search/${escape(title)}/1`;
      let response = await this.requests.post(api);
      if (response) {
        if ((_a = response == null ? void 0 : response.results) == null ? void 0 : _a.length) {
          let item = response.results[0];
          let info = this.Info.connectedpapers(item);
          return info;
        }
      }
    }
    async getTitleInfoByReadpaper(title, body = {}, doi = void 0) {
      var _a, _b, _c, _d;
      const api = "https://readpaper.com/api/microService-app-aiKnowledge/aiKnowledge/paper/search";
      let _body = {
        keywords: title,
        page: 1,
        pageSize: 1,
        searchType: Number(Object.values(body).length > 0)
      };
      body = { ..._body, ...body };
      let response = await this.requests.post(api, body);
      if (response && ((_b = (_a = response == null ? void 0 : response.data) == null ? void 0 : _a.list) == null ? void 0 : _b[0])) {
        let data = (_d = (_c = response == null ? void 0 : response.data) == null ? void 0 : _c.list) == null ? void 0 : _d[0];
        if (doi) {
          let _res = await this.requests.post(
            "https://readpaper.com/api/microService-app-aiKnowledge/aiKnowledge/paper/getPaperDetailInfo",
            { paperId: data.id }
          );
          console.log(doi, _res.data.doi);
          if (_res.data.doi.toUpperCase() != doi.toUpperCase()) {
            return;
          }
        }
        let info = this.Info.readpaper(data);
        if (doi) {
          info.identifiers = { DOI: doi };
        }
        return info;
      }
    }
    // For CNKI
    async _getCNKIURL(title, author) {
      console.log("getCNKIURL", title, author);
      let cnkiURL;
      let oldFunc = Zotero.Jasminum.Scrape.getItemFromSearch;
      ztoolkit.patch(
        Zotero.Jasminum.Scrape,
        "createPostData",
        config.addonRef,
        (original) => (arg) => {
          let text = original.call(Zotero.Jasminum.Scrape, arg);
          console.log(text);
          text = escape(
            unescape(text).replace(/SCDB/g, "CFLS")
          );
          console.log(text);
          return text;
        }
      );
      Zotero.Jasminum.Scrape.getItemFromSearch = function (htmlString) {
        try {
          let res = htmlString.match(/href='(.+FileName=.+?&DbName=.+?)'/i);
          if (res.length) {
            return res[1];
          }
        } catch {
          return;
        }
      }.bind(Zotero.Jasminum);
      cnkiURL = await Zotero.Jasminum.Scrape.search({ keyword: title });
      Zotero.Jasminum.Scrape.getItemFromSearch = oldFunc.bind(Zotero.Jasminum);
      if (!cnkiURL) {
        console.log("cnkiURL", cnkiURL);
        return;
      }
      let args = this.utils.parseCNKIURL(cnkiURL);
      if (args) {
        cnkiURL = `https://kns.cnki.net/kcms/detail/detail.aspx?FileName=${args.fileName}&DbName=${args.dbName}&DbCode=${args.dbCode}`;
        return cnkiURL;
      }
    }
    async getCNKIURL(keywords, slience = false) {
      if (!slience) {
        new ztoolkit.ProgressWindow("[Pending] API", { closeOtherProgressWindows: true }).createLine({ text: `Get CNKI URL`, type: "default" }).show();
      }
      const res = await Zotero.HTTP.request(
        "POST",
        "https://kns.cnki.net/kns8/Brief/GetGridTableHtml",
        {
          headers: {
            Accept: "text/html, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7",
            Connection: "keep-alive",
            "Content-Length": "2085",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Host: "kns.cnki.net",
            Origin: "https://kns.cnki.net",
            Referer: "https://kns.cnki.net/kns8/AdvSearch?dbprefix=SCDB&&crossDbcodes=CJFQ%2CCDMD%2CCIPD%2CCCND%2CCISD%2CSNAD%2CBDZK%2CCJFN%2CCCJD",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: `IsSearch=true&QueryJson={"Platform":"","DBCode":"CFLS","KuaKuCode":"CJFQ,CDMD,CIPD,CCND,CISD,SNAD,BDZK,CCJD,CCVD,CJFN","QNode":{"QGroup":[{"Key":"Subject","Title":"","Logic":1,"Items":[{"Title":"\u4E3B\u9898","Name":"SU","Value":"${keywords}","Operate":"%=","BlurType":""}],"ChildItems":[]}]},"CodeLang":"ch"}&PageName=defaultresult&DBCode=CFLS&CurPage=1&RecordsCntPerPage=20&CurDisplayMode=listmode&CurrSortField=&CurrSortFieldType=desc&IsSentenceSearch=false&Subject=`
        }
      );
      try {
        if (res) {
          let cnkiURL = res.responseText.match(/href='(.+FileName=.+?&DbName=.+?)'/i);
          if (cnkiURL) {
            let args = this.utils.parseCNKIURL(cnkiURL[1]);
            if (args) {
              cnkiURL = `https://kns.cnki.net/kcms/detail/detail.aspx?FileName=${args.fileName}&DbName=${args.dbName}&DbCode=${args.dbCode}`;
              return cnkiURL;
            }
          }
        }
      } catch {
      }
      if (!slience) {
        new ztoolkit.ProgressWindow("[Pending] API", { closeOtherProgressWindows: true }).createLine({ text: `Get CNKI URL Fail`, type: "fail" }).show();
      }
    }
    async getTitleInfoByCNKI(refText) {
      if (!this.utils.isChinese(refText)) {
        return;
      }
      let res = this.utils.parseRefText(refText);
      const key = `${res.title}${res.authors}${refText}`;
      if (this.requests.cache[key]) {
        return this.requests.cache[key];
      }
      console.log("parseRefText", refText, res);
      let url = await this.getCNKIURL(res.title, true);
      if (!url) {
        return;
      }
      let htmlString = await this.requests.get(url, "text");
      console.log(url, htmlString);
      const parser = ztoolkit.getDOMParser();
      let doc = parser.parseFromString(htmlString, "text/html").childNodes[1];
      let aTags = doc.querySelectorAll(".top-tip span a");
      let info = {
        identifiers: { CNKI: url },
        title: doc.querySelector(".brief h1").innerText,
        abstract: doc.querySelector("span#ChDivSummary").innerText,
        authors: [...doc.querySelectorAll("#authorpart span a")].map((a) => a.innerText),
        type: "journalArticle",
        primaryVenue: aTags[0].innerText,
        year: aTags[1].innerText.split(",")[0],
        //2020,32(10)
        url,
        source: "CNKI",
        tags: [...doc.querySelectorAll(".keywords a")].map((a) => a.innerText.replace(/(\n|\s+|;)/g, "")).concat([
          {
            text: [...doc.querySelectorAll("p.total-inform span")].find((span) => span.innerText.includes("\u4E0B\u8F7D")).innerText.match(/\d+/)[0],
            color: "#cc7c08",
            tip: "\u77E5\u7F51\u4E0B\u8F7D\u91CF"
          }
        ])
      };
      this.requests.cache[key] = info;
      return info;
    }
    async getCNKIFileInfo(fileName, count = 0) {
      const prefsKey = `${config.addonRef}.CNKI.token`;
      const username = Zotero.Prefs.get(`${config.addonRef}.CNKI.username`);
      const password = Zotero.Prefs.get(`${config.addonRef}.CNKI.password`);
      if (username.length * password.length == 0) {
        new ztoolkit.ProgressWindow("[Fail] API", { closeOtherProgressWindows: true }).createLine({ text: "\u8BF7\u914D\u7F6E\u77E5\u7F51\u7814\u5B66\u8D26\u53F7\u5BC6\u7801\u540E\u91CD\u8BD5", type: "fail" }).show();
      }
      let updateToken = async () => {
        function getRandomIP() {
          let ip = "";
          for (var i = 0; i < 4; i++) {
            if (i < 3) {
              ip = ip + String(Math.floor(Math.random() * 256)) + ".";
            } else {
              ip = ip + String(Math.floor(Math.random() * 256));
            }
          }
          return ip;
        }
        let res = await this.requests.post(
          "https://apix.cnki.net/databusapi/api/v1.0/credential/namepasswithcleartext/personalaccount",
          {
            Username: username,
            Password: password,
            Clientip: getRandomIP()
          }
        );
        const token2 = res.Content;
        Zotero.Prefs.set(prefsKey, token2);
      };
      const infoApi = `https://x.cnki.net/readApi/api/v1/paperInfo?fileName=${fileName}&tableName=CJFDTOTAL&dbCode=CJFD&from=ReadingHistory&type=psmc&fsType=1&taskId=0`;
      const refApi = `https://x.cnki.net/readApi/api/v1/paperRefreNotes?appId=CRSP_BASIC_PSMC&dbcode=CJFD&tablename=CJFDTOTAL&filename=${fileName}&type=1&page=1`;
      const userAgent = "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36";
      const token = Zotero.Prefs.get(prefsKey);
      const infoData = await this.requests.get(infoApi, "json", {
        token,
        "user-agent": userAgent
      });
      const refData = await this.requests.get(refApi, "json", {
        token,
        "user-agent": userAgent
      });
      console.log(refData);
      if (String(refData.code) != "200") {
        if (count < 3) {
          await updateToken();
          return await this.getCNKIFileInfo(fileName, count + 1);
        } else {
          new ztoolkit.ProgressWindow("[Fail] API", { closeOtherProgressWindows: true }).createLine({ text: `${refData.code}: ${refData.promptMessage}`, type: "fail" }).show();
          return;
        }
      }
      let info = {
        identifiers: {},
        authors: [],
        type: "",
        references: []
      };
      const typeMap = {
        "journal": "journalArticle"
      };
      if (String(infoData.code) == "200") {
        infoData.content.paper.bibliography.forEach((ref) => {
          var _a, _b;
          let _ref = refData.content.refer.find((_ref2) => {
            return ref.title.indexOf(_ref2.title) != -1;
          });
          const refText = ref.title.replace(/^\[\d+\]/, "");
          if (_ref) {
            const cnkiURL = `https://kns.cnki.net/kcms/detail/detail.aspx?FileName=${_ref.fileName}&DbName=${_ref.tableName}&DbCode=${_ref.dbSource.split("_")[0]}`;
            (_a = info.references) == null ? void 0 : _a.push({
              identifiers: {
                CNKI: cnkiURL
              },
              text: refText,
              title: _ref.title,
              authors: [],
              type: typeMap[_ref.type] || "journalArticle",
              url: cnkiURL
            });
          } else {
            (_b = info.references) == null ? void 0 : _b.push({
              identifiers: {},
              text: refText,
              authors: [],
              type: "journalArticle",
              title: refText
            });
          }
        });
      } else {
        refData.content.refer.sort((a, b) => Number(a.citationNumber) - Number(b.citationNumber)).forEach((ref) => {
          var _a;
          const title = ref.title.replace(/^\[\d+\]/, "");
          const cnkiURL = `https://kns.cnki.net/kcms/detail/detail.aspx?FileName=${ref.fileName}&DbName=${ref.tableName}&DbCode=${ref.dbSource.split("_")[0]}`;
          (_a = info.references) == null ? void 0 : _a.push(
            {
              identifiers: {
                CNKI: cnkiURL
              },
              authors: ref.author.split(";").filter((s) => s.length),
              type: typeMap[ref.type] || "journalArticle",
              text: `${ref.author}. ${title}[${ref.type[0]}]. ${ref.source}, ${ref.year}, ${ref.volumn}:${ref.pageNumber}.`,
              title: ref.title,
              year: ref.year,
              url: cnkiURL,
              number: Number(ref.citationNumber)
            }
          );
        });
      }
      return info;
    }
  };
  var api_default = API;

  // src/modules/pdf.ts
  var PDF = class {
    constructor(utils) {
      this.utils = utils || new utils_default();
      this.refRegex = [
        [/^\(\d+\)\s/],
        // (1)
        [/^\[\d{0,3}\].+?[\,\.\uff0c\uff0e]?/],
        // [10] Polygon
        [/^\uff3b\d{0,3}\uff3d.+?[\,\.\uff0c\uff0e]?/],
        // ［1］
        [/^\[.+?\].+?[\,\.\uff0c\uff0e]?/],
        // [RCK + 20] 
        [/^\d+[^\d]+?[\,\.\uff0c\uff0e]?/],
        // 1. Polygon
        [/^\d+\s+/],
        // 1 Polygon
        [/^[A-Z]\w.+?\(\d+[a-z]?\)/, /^[A-Z][A-Za-z]+[\,\.\uff0c\uff0e]?/, /^.+?,.+.,/, /^[\u4e00-\u9fa5]{1,4}[\,\.\uff0c\uff0e]?/]
        // 中文
      ];
    }
    async getReferences(reader, fromCurrentPage) {
      let refLines = await this.getRefLines(reader, fromCurrentPage);
      Zotero.ProgressWindowSet.closeAll();
      if (refLines.length == 0) {
        new ztoolkit.ProgressWindow("[Fail] PDF").createLine({
          text: "Function getRefLines: 0 refLines",
          type: "fail"
        }).show();
        return [];
      }
      let references = this.mergeSameRef(refLines);
      if (references.length > 0) {
        new ztoolkit.ProgressWindow("[Done] PDF").createLine({
          text: `${references.length} references`,
          type: "success"
        }).show();
      } else {
        new ztoolkit.ProgressWindow("[Fail] PDF").createLine({
          text: "Function mergeSameRef: 0 reference",
          type: "fail"
        }).show();
      }
      console.log("references", references);
      for (let i = 0; i < references.length; i++) {
        let ref = { ...references[i] };
        ref.text = ref.text.trim().replace(/^[^0-9a-zA-Z]\s*\d+\s*[^0-9a-zA-Z]/, "").replace(/^\d+[\.\s]?/, "").trim();
        references[i] = {
          text: ref.text,
          ...this.utils.refText2Info(ref.text)
        };
        references[i].url = ref.url || references[i].url;
      }
      return references;
    }
    /**
     * Merge patrs with the same height to one part
     * @param items 
     * @returns 
     */
    mergeSameLine(items) {
      var _a, _b;
      let toLine = (item) => {
        let line = {
          x: parseFloat(item.transform[4].toFixed(1)),
          y: parseFloat(item.transform[5].toFixed(1)),
          text: item.str || "",
          height: item.height,
          width: item.width,
          url: item == null ? void 0 : item.url,
          _height: [item.height]
        };
        if (line.width < 0) {
          line.x += line.width;
          line.width = -line.width;
        }
        return line;
      };
      let j = 0;
      let lines = [toLine(items[j])];
      for (j = 1; j < items.length; j++) {
        let line = toLine(items[j]);
        let lastLine = lines.slice(-1)[0];
        if (line.y == lastLine.y || line.y >= lastLine.y && line.y < lastLine.y + lastLine.height || line.y + line.height > lastLine.y && line.y + line.height <= lastLine.y + lastLine.height) {
          lastLine.text += " " + line.text;
          lastLine.width += line.width;
          lastLine.url = lastLine.url || line.url;
          lastLine._height.push(line.height);
        } else {
          let hh = lastLine._height;
          const num = {};
          for (let i = 0; i < hh.length; i++) {
            (_b = num[_a = String(hh[i])]) != null ? _b : num[_a] = 0;
            num[String(hh[i])] += 1;
          }
          lastLine.height = Number(
            Object.keys(num).sort((h1, h2) => {
              return num[h2] - num[h1];
            })[0]
          );
          lines.push(line);
        }
      }
      return lines;
    }
    /**
     * 如果是参考文献格式的开头，返回类型；否则返回-1
     * @param text 
     * @returns 
     */
    getRefType(text) {
      for (let i = 0; i < this.refRegex.length; i++) {
        let flags = new Set(this.refRegex[i].map((regex) => {
          return regex.test(text.trim()) || regex.test(text.replace(/\s+/g, ""));
        }));
        if (flags.has(true)) {
          console.log(text, i);
          return i;
        }
      }
      return -1;
    }
    /**
     * 把多行合并为一个完整的参考文献
     * @param refLines 
     * @returns 
     */
    mergeSameRef(refLines) {
      const _refLines = [...refLines];
      console.log(this.copy(_refLines));
      let firstLine = refLines[0];
      let firstX = firstLine.x;
      let secondLine = refLines.slice(1).find((line) => {
        return line.x != firstX && this.abs(line.x - firstX) < 10 * firstLine.height;
      });
      console.log(secondLine);
      let indent = secondLine ? firstX - secondLine.x : 0;
      console.log("indent", indent);
      let refType = this.getRefType(firstLine.text);
      console.log(firstLine.text, refType);
      let ref;
      for (let i = 0; i < refLines.length; i++) {
        let line = refLines[i];
        let text = line.text;
        let lineRefType = this.getRefType(text);
        if (
          // this.abs(line.x - firstX) < line.height * 1.2 &&
          lineRefType == refType && refType <= 3 || indent == 0 && lineRefType != -1 && lineRefType == refType && this.abs(firstX - line.x) < (this.abs(indent) || line.height) * 0.5 || indent != 0 && lineRefType == refType && _refLines.find((_line) => {
            let flag = line != _line && (line.x - _line.x) * indent > 0 && this.abs(line.x - _line.x) >= this.abs(indent) && this.abs(this.abs(line.x - _line.x) - this.abs(indent)) < 2 * line.height;
            return flag;
          }) !== void 0
        ) {
          ref = line;
          console.log("->", line.text);
        } else if (ref) {
          if (ref && this.abs(this.abs(ref.x - line.x) - this.abs(indent)) > 5 * line.height) {
            refLines = refLines.slice(0, i);
            console.log("x", line.text, this.abs(this.abs(ref.x - line.x) - this.abs(indent)), 5 * line.height);
            break;
          }
          console.log("+", text);
          ref.text = ref.text.replace(/-$/, "") + (ref.text.endsWith("-") ? "" : " ") + text;
          if (line.url) {
            ref.url = line.url;
          }
          refLines[i] = false;
        }
      }
      return refLines.filter((e) => e);
    }
    /**
     * 判断A和B两个矩形是否几何相交
     * @param A 
     * @param B 
     * @returns 
     */
    isIntersect(A, B) {
      if (B.right < A.left || B.left > A.right || B.bottom > A.top || B.top < A.bottom) {
        return false;
      } else {
        return true;
      }
    }
    /**
     * 为items每个item更新对应annotations中annotation的链接信息
     */
    updateItemsAnnotions(items, annotations) {
      let toBox = (rect) => {
        let [left, bottom, right, top] = rect;
        return { left, bottom, right, top };
      };
      annotations.forEach((annotation) => {
        let annoBox = toBox(annotation.rect);
        items.forEach((item) => {
          let [x, y] = item.transform.slice(4);
          let itemBox = toBox([x, y, x + item.width, y + item.height]);
          if (this.isIntersect(annoBox, itemBox)) {
            item["url"] = (annotation == null ? void 0 : annotation.url) || (annotation == null ? void 0 : annotation.unsafeUrl);
          }
        });
      });
    }
    /**
     * 读取PDF一页面为lines对象
     * @param pdfPage 
     * @returns 
     */
    async readPdfPage(pdfPage) {
      let textContent = await pdfPage.getTextContent();
      let items = textContent.items.filter((item) => item.str.trim().length);
      if (items.length == 0) {
        return [];
      }
      let annotations = await pdfPage.getAnnotations();
      console.log("items", this.copy(items));
      this.updateItemsAnnotions(items, annotations);
      let lines = this.mergeSameLine(items);
      return lines;
    }
    async getRefLines(reader, fromCurrentPage, fullText = false) {
      const PDFViewerApplication = reader._iframeWindow.wrappedJSObject.PDFViewerApplication;
      await PDFViewerApplication.pdfLoadingTask.promise;
      await PDFViewerApplication.pdfViewer.pagesPromise;
      let pages = PDFViewerApplication.pdfViewer._pages;
      let pageLines = {};
      let maxWidth, maxHeight;
      let offset = 0;
      if (fromCurrentPage) {
        offset = pages.length - PDFViewerApplication.page;
      }
      const totalPageNum = pages.length - offset;
      const minPreLoadPageNum = parseInt(Zotero.Prefs.get(`${config.addonRef}.preLoadingPageNum`));
      let preLoadPageNum = totalPageNum > minPreLoadPageNum ? minPreLoadPageNum : totalPageNum;
      const popupWin = new ztoolkit.ProgressWindow("[Pending] PDF", { closeTime: -1 });
      popupWin.createLine({
        text: `[0/${preLoadPageNum}] Analysis PDF`,
        type: "success",
        progress: 1
      }).show();
      for (let pageNum = totalPageNum - 1; pageNum >= totalPageNum - preLoadPageNum; pageNum--) {
        let pdfPage = pages[pageNum].pdfPage;
        maxWidth = pdfPage._pageInfo.view[2];
        maxHeight = pdfPage._pageInfo.view[3];
        let lines = await this.readPdfPage(pdfPage);
        if (lines.length == 0) {
          continue;
        }
        pageLines[pageNum] = lines;
        let pct = (totalPageNum - pageNum) / preLoadPageNum * 100;
        popupWin.changeLine({
          text: `[${totalPageNum - pageNum}/${preLoadPageNum}] Read text`,
          progress: pct > 90 ? 90 : pct
        });
      }
      let parts = [];
      let part = [];
      let refPart = [];
      let _refPart = { done: false, parts: [] };
      let sep = "\n\n===current page===\n\n";
      for (let pageNum = totalPageNum - 1; pageNum >= 1; pageNum--) {
        console.log(sep, pageNum + 1);
        let pdfPage = pages[pageNum].pdfPage;
        maxWidth = pdfPage._pageInfo.view[2];
        maxHeight = pdfPage._pageInfo.view[3];
        console.log(`maxWidth=${maxWidth}, maxHeight=${maxHeight}`);
        let lines;
        if (pageNum in pageLines) {
          lines = [...pageLines[pageNum]];
        } else {
          lines = await this.readPdfPage(pdfPage);
          pageLines[pageNum] = [...lines];
          let p = totalPageNum - pageNum;
          popupWin.changeLine({ text: `[${p}/${p}] Read PDF` });
        }
        if (lines.length == 0) {
          continue;
        }
        let removeLines = /* @__PURE__ */ new Set();
        let removeNumber = (text) => {
          if (/^[A-Z]{1,3}$/.test(text)) {
            text = "";
          }
          text = text.replace(/\s+/g, "").replace(/\d+/g, "");
          return text;
        };
        let isIntersectLines = (lineA, lineB) => {
          let rectA = {
            left: lineA.x / maxWidth,
            right: (lineA.x + lineA.width) / maxWidth,
            bottom: lineA.y / maxHeight,
            top: (lineA.y + lineA.height) / maxHeight
          };
          let rectB = {
            left: lineB.x / maxWidth,
            right: (lineB.x + lineB.width) / maxWidth,
            bottom: lineB.y / maxHeight,
            top: (lineB.y + lineB.height) / maxHeight
          };
          return this.isIntersect(rectA, rectB);
        };
        let isRepeat = (line, _line) => {
          let text = removeNumber(line.text);
          let _text = removeNumber(_line.text);
          return text == _text && isIntersectLines(line, _line);
        };
        for (let i of Object.keys(pageLines)) {
          if (Number(i) == pageNum) {
            continue;
          }
          let _lines = pageLines[i];
          let directions = {
            forward: {
              factor: 1,
              done: false
            },
            backward: {
              factor: -1,
              done: false
            }
          };
          for (let offset2 = 0; offset2 < lines.length && offset2 < _lines.length; offset2++) {
            ["forward", "backward"].forEach((direction) => {
              if (directions[direction].done) {
                return;
              }
              let factor = directions[direction].factor;
              let index = factor * offset2 + (factor > 0 ? 0 : -1);
              let line = lines.slice(index)[0];
              let _line = _lines.slice(index)[0];
              if (isRepeat(line, _line)) {
                line[direction] = true;
                removeLines.add(line);
              } else {
                directions[direction].done = true;
              }
            });
          }
          const content = { x: 0.2 * maxWidth, width: 0.6 * maxWidth, y: 0.2 * maxHeight, height: 0.6 * maxHeight };
          for (let j = 0; j < lines.length; j++) {
            let line = lines[j];
            if (isIntersectLines(content, line)) {
              continue;
            }
            for (let k = 0; k < _lines.length; k++) {
              let _line = _lines[k];
              if (isRepeat(line, _line)) {
                line.repeat = line.repeat == void 0 ? 1 : line.repeat + 1;
                line.repateWith = _line;
                removeLines.add(line);
              }
            }
          }
        }
        lines = lines.filter((e) => !(e.forward || e.backward || e.repeat && e.repeat > preLoadPageNum / 2));
        if (lines.length == 0) {
          continue;
        }
        console.log("remove", [...removeLines]);
        let isFigureOrTable = (text) => {
          text = text.replace(/\s+/g, "");
          const flag = /^(Table|Fig|Figure).*\d/i.test(text);
          if (flag) {
            console.log(`isFigureOrTable - skip - ${text}`);
          }
          return flag;
        };
        lines = lines.filter((e) => isFigureOrTable(e.text) == false);
        let columns = [[lines[0]]];
        for (let i = 1; i < lines.length; i++) {
          let line = lines[i];
          let column = columns.slice(-1)[0];
          if (line.y > column.slice(-1)[0].y || column.map((_line) => Number(line.x > _line.x + _line.width)).reduce((a, b) => a + b) == column.length || column.map((_line) => Number(line.x + line.width < _line.x)).reduce((a, b) => a + b) == column.length) {
            columns.push([line]);
          } else {
            column.push(line);
          }
        }
        console.log("columns", this.copy(columns));
        columns.forEach((column, columnIndex) => {
          column.forEach((line) => {
            line["column"] = columnIndex;
            line["pageNum"] = pageNum;
          });
        });
        console.log("remove indent", this.copy(lines));
        let isStart = false;
        let donePart = (part2) => {
          part2.reverse();
          let columns2 = [[part2[0]]];
          for (let i = 1; i < part2.length; i++) {
            let line = part2[i];
            if (line.column == columns2.slice(-1)[0].slice(-1)[0].column && line.pageNum == columns2.slice(-1)[0].slice(-1)[0].pageNum) {
              columns2.slice(-1)[0].push(line);
            } else {
              columns2.push([line]);
            }
          }
          columns2.forEach((column) => {
            let offset2 = column.map((line) => line.x).sort((a, b) => a - b)[0];
            column.forEach((line) => {
              line["_x"] = line.x;
              line["_offset"] = offset2;
              line.x = parseInt((line.x - offset2).toFixed(1));
            });
          });
          parts.push(part2);
          return part2;
        };
        let isRefBreak = (text) => {
          text = text.replace(/\s+/g, "");
          if (fullText) {
            return false;
          } else {
            return /(\u53c2\u8003\u6587\u732e|reference|bibliography)/i.test(text) && text.length < 20;
          }
        };
        let doneRefPart = (part2) => {
          part2 = donePart(part2);
          _refPart.parts.push(part2);
          console.log("doneRefPart", part2[0].text);
          let res = part2[0].text.trim().match(/^\d+/);
          if (res && res[0] != "1") {
            _refPart.done = false;
          } else {
            _refPart.done = true;
          }
        };
        let endLines = lines.filter((line) => {
          return lines.every((_line) => {
            if (_line == line) {
              return true;
            }
            return _line.x + _line.width < line.x + line.width || _line.y > line.y;
          });
        });
        let heightOverlap = (hh1, hh2) => {
          return hh1.some((h1) => {
            return hh2.some((h2) => h1 - h2 < (h1 > h2 ? h2 : h1) * 0.3);
          });
        };
        const endLine = endLines.slice(-1)[0];
        console.log("endLine", endLine);
        for (let i = lines.length - 1; i >= 0; i--) {
          let line = lines[i];
          if (
            // !isStart && pageNum < totalPageNum - 1 &&
            // 考虑到有些PDF最后一页以图表结尾
            !isStart && // 图表等
            // 我们认为上一页的正文（非图表）应从页面最低端开始
            (line != endLine || // ((line.x + line.width) / maxWidth < 0.7 && line.y > pageYmin) ||
              /(图|fig|Fig|Figure).*\d+/.test(line.text.replace(/\s+/g, "")))
          ) {
            console.log("Not the endLine, skip", line.text);
            if (part.length && pageNum == totalPageNum - 1) {
              donePart(part);
              part = [];
            }
            continue;
          } else {
            isStart = true;
          }
          if (part.length > 0 && // part.slice(-1)[0].height != line.height
            !heightOverlap(part.slice(-1)[0]._height, line._height)) {
            donePart(part);
            part = [line];
            continue;
          }
          if (isRefBreak(line.text)) {
            console.log("isRefBreak", line.text);
            doneRefPart(part);
            part = [];
            break;
          }
          part.push(line);
          if (
            // 以下条件满足则页内断开
            lines[i - 1] && // line.height != lines[i - 1].height ||
            // this.abs(line.height - lines[i - 1].height) > line.height * .5 ||
            (!heightOverlap(line._height, lines[i - 1]._height) || lines[i].column < lines[i - 1].column || line.pageNum == lines[i - 1].pageNum && line.column == lines[i - 1].column && // 增大行间距阈值
              this.abs(line.y - lines[i - 1].y) > line.height * 3)
          ) {
            if (isRefBreak(lines[i - 1].text)) {
              console.log("isRefBreak", lines[i - 1].text);
              doneRefPart(part);
              part = [];
              break;
            }
            donePart(part);
            part = [];
            console.log("break", line.text, " - ", lines[i - 1].text, this.copy(line), this.copy(lines[i - 1]));
          }
        }
        if (_refPart.done) {
          console.log(_refPart);
          _refPart.parts.reverse().forEach((part2) => {
            refPart = [...refPart, ...part2];
          });
          break;
        }
      }
      popupWin.changeLine({ progress: 100 });
      console.log("parts", this.copy(parts));
      console.log(refPart);
      if (refPart.length == 0) {
        let partRefNum = [];
        for (let i2 = 0; i2 < parts.length; i2++) {
          let isRefs = parts[i2].map((line) => Number(this.getRefType(line.text) != -1));
          partRefNum.push([i2, isRefs.reduce((a, b) => a + b)]);
        }
        console.log(partRefNum);
        let i = partRefNum.sort((a, b) => b[1] - a[1])[0][0];
        refPart = parts[i];
      }
      console.log("refPart", this.copy(refPart));
      popupWin.changeHeadline("[Done] PDF");
      popupWin.changeLine({ progress: 100 });
      popupWin.startCloseTimer(3e3);
      if (fullText) {
        return parts;
      } else {
        return refPart;
      }
    }
    copy(obj) {
      try {
        return JSON.parse(JSON.stringify(obj));
      } catch (e) {
        console.log("Error copy", e, obj);
      }
    }
    abs(v) {
      return v > 0 ? v : -v;
    }
  };
  var pdf_default = PDF;

  // src/modules/utils.ts
  var Utils = class {
    constructor() {
      this.cache = {};
      this.regex = {
        DOI: /10\.\d{4,9}\/[-\._;\(\)\/:A-z0-9><]+[^\.\]]/,
        arXiv: /arXiv[\.:](\d+\.\d+)/,
        URL: /https?:\/\/[^\s\.]+/
      };
      this.copyText = (text, show = true) => {
        new ztoolkit.Clipboard().addText(text, "text/unicode").copy();
        if (show) {
          new ztoolkit.ProgressWindow("Copy").createLine({ text, type: "success" }).show();
        }
      };
      this.API = new api_default(this);
      this.PDF = new pdf_default(this);
    }
    getIdentifiers(text) {
      const targets = [
        {
          key: "DOI",
          ignoreSpace: true,
          regex: this.regex.DOI
        },
        {
          key: "arXiv",
          ignoreSpace: true,
          regex: this.regex.arXiv
        }
      ];
      let identifiers = {};
      for (let target of targets) {
        let res = (target.ignoreSpace ? text.replace(/\s+/g, "") : text).match(target.regex);
        if (res) {
          identifiers[target.key] = res.slice(-1)[0];
        }
      }
      return identifiers;
    }
    extractURL(text) {
      let res = text.match(this.regex.URL);
      if (res) {
        return res.slice(-1)[0];
      }
    }
    parseRefText(text) {
      var _a;
      try {
        text = text.replace(/^\[\d+?\]/, "");
        text = text.replace(/\s+/g, " ");
        let title, titleMatch;
        if (/\u201c(.+)\u201d/.test(text)) {
          [titleMatch, title] = text.match(/\u201c(.+)\u201d/);
          if (title.endsWith(",")) {
            title = title.slice(0, -1);
          }
        } else {
          title = titleMatch = (text.indexOf(". ") != -1 && text.match(/\.\s/g).length >= 2 && text.split(". ") || text.split(".")).sort((a, b) => b.length - a.length).map((s) => {
            let count = 0;
            [/[A-Z]\./g, /[,\.\-\(\)\:]/g, /\d/g].forEach((regex) => {
              let res2 = s.match(regex);
              count += res2 ? res2.length : 0;
            });
            return [count / s.length, s];
          }).filter((s) => {
            var _a2;
            return ((_a2 = s[1].match(/\s+/g)) == null ? void 0 : _a2.length) >= 3;
          }).sort((a, b) => a[0] - b[0])[0][1];
          if (/\[[A-Z]\]$/.test(title)) {
            title = title.replace(/\[[A-Z]\]$/, "");
          }
        }
        title = title.trim();
        console.log("title", title);
        let splitByTitle = text.split(titleMatch);
        let authorInfo = splitByTitle[0].trim();
        let publicationVenue = splitByTitle[1].match(/[^.\s].+[^\.]/)[0].split(/[,\d]/)[0].trim();
        if (authorInfo.indexOf("et al.") != -1) {
          authorInfo = authorInfo.split("et al.")[0] + "et al.";
        }
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        let res = (_a = text.match(/[^\d]\d{4}[^\d-]/g)) == null ? void 0 : _a.map((s) => s.match(/\d+/)[0]);
        console.log(res);
        let year = res == null ? void 0 : res.find((s) => {
          return Number(s) <= Number(currentYear) + 1;
        });
        authorInfo = authorInfo.replace(`${year}.`, "").replace(year, "").trim();
        console.log({ year, title, authors: [authorInfo], publicationVenue });
        return { year, title, authors: [authorInfo], publicationVenue };
      } catch {
        return {
          title: text
        };
      }
    }
    _parseRefText(text) {
      let year;
      let _years = text.match(/[^\d]?(\d{4})[^\d]?/g);
      if (_years) {
        let years = _years.map((year2) => Number(year2.match(/\d{4}/)[0])).filter((year2) => year2 > 1900 && year2 < (/* @__PURE__ */ new Date()).getFullYear());
        if (years.length > 0) {
          year = String(years[0]);
        }
      }
      year = year;
      if (this.isChinese(text)) {
        let parts = text.replace(/\[.+?\]/g, "").replace(/\s+/g, " ").split(/[\.,\uff0c\uff0e\uff3b\[\]]/).map((e) => e.trim()).filter((e) => e);
        let authors = [];
        let titles = [];
        for (let part of parts) {
          if (part.length <= 3 && part.length >= 2) {
            authors.push(part);
          } else {
            titles.push(part);
          }
        }
        let title = titles.sort((a, b) => b.length - a.length)[0];
        return { title, authors, year };
      } else {
        let authors = [];
        text = text.replace(/[\u4e00-\u9fa5]/g, "");
        const authorRegexs = [/[A-Za-z,\.\s]+?\.?[\.,;]/g, /[A-Z][a-z]+ et al.,/];
        authorRegexs.forEach((regex) => {
          var _a;
          (_a = text.match(regex)) == null ? void 0 : _a.forEach((author) => {
            authors.push(author.slice(0, -1));
          });
        });
        let title = text.split(/[,\.]\s/g).filter((e) => !e.includes("http")).sort((a, b) => b.length - a.length)[0];
        return { title, authors, year };
      }
    }
    identifiers2URL(identifiers) {
      let url;
      if (identifiers.DOI) {
        url = `https://doi.org/${identifiers.DOI}`;
      }
      if (identifiers.arXiv) {
        url = `https://arxiv.org/abs/${identifiers.arXiv}`;
      }
      return url;
    }
    refText2Info(text) {
      let identifiers = this.getIdentifiers(text);
      return {
        identifiers,
        url: this.extractURL(text) || this.identifiers2URL(identifiers),
        authors: [],
        ...this.parseRefText(text),
        type: identifiers.arXiv ? "preprint" : "journalArticle"
      };
    }
    parseCNKIURL(cnkiURL) {
      try {
        let fileName = cnkiURL.match(/fileName=(\w+)/i)[1];
        let dbName = cnkiURL.match(/dbName=(\w+)/i)[1];
        let dbCode = cnkiURL.match(/dbCode=(\w+)/i)[1];
        return { fileName, dbName, dbCode };
      } catch {
      }
    }
    async createItemByZotero(identifiers, collections) {
      var translate = new Zotero.Translate.Search();
      translate.setIdentifier(identifiers);
      let translators = await translate.getTranslators();
      translate.setTranslator(translators);
      let libraryID = ZoteroPane.getSelectedLibraryID();
      return (await translate.translate({
        libraryID,
        collections,
        saveAttachments: false
      }))[0];
    }
    async createItemByJasminum(title) {
      let cnkiURL = await this.API.getCNKIURL(title, true);
      console.log("cnkiURL", cnkiURL);
      let articleId = Zotero.Jasminum.Scrape.getIDFromURL(cnkiURL);
      let postData = Zotero.Jasminum.Scrape.createRefPostData([articleId]);
      let data = await Zotero.Jasminum.Scrape.getRefText(postData);
      let items = await Zotero.Jasminum.Utils.trans2Items(data, 1);
      if (items) {
        let item = items[0];
        item.setField("url", cnkiURL);
        await item.saveTx();
        return item;
      }
    }
    searchRelatedItem(item, refItem) {
      if (!item) {
        return;
      }
      let relatedItems = item.relatedItems.map((key) => Zotero.Items.getByLibraryAndKey(1, key));
      if (refItem) {
        let relatedItem = relatedItems.find((item2) => refItem.id == item2.id);
        return relatedItem;
      }
    }
    async searchItem(info) {
      var _a;
      if (!info) {
        return;
      }
      let s = new Zotero.Search();
      s.addCondition("joinMode", "any");
      if (info.identifiers.DOI) {
        s.addCondition("DOI", "is", info.identifiers.DOI.toLowerCase());
        s.addCondition("DOI", "is", info.identifiers.DOI.toUpperCase());
      } else {
        if (info.title && ((_a = info.title) == null ? void 0 : _a.length) > 8) {
          s.addCondition("title", "contains", info.title);
        }
        s.addCondition("url", "contains", info.identifiers.arXiv);
        s.addCondition("url", "contains", info.identifiers.CNKI);
      }
      var ids = await s.search();
      let items = (await Zotero.Items.getAsync(ids)).filter((i) => {
        return i.itemType !== "attachment" && i.isRegularItem && i.isRegularItem();
      });
      if (items.length) {
        return items[0];
      }
    }
    /**
     * 搜索本地，获取参考文献的本地item引用
     * @param info 
     * @returns 
     */
    async searchLibraryItem(info) {
      await Zotero.Promise.delay(0);
      const key = JSON.stringify(info.identifiers) + info.text + "library-item";
      if (key in this.cache) {
        info._item = this.cache[key];
        return this.cache[key];
      } else {
        let items = await Zotero.Items.getAll(1);
        let getPureText = (s) => {
          var _a, _b, _c, _d;
          return (_d = (_b = this.cache)[_c = "getPureText" + s]) != null ? _d : _b[_c] = (_a = s.toLowerCase().match(/[0-9a-z\u4e00-\u9fa5]+/g)) == null ? void 0 : _a.join("");
        };
        let item = await this.searchItem(info) || items.filter((i) => i.isRegularItem() && i.getField("title") && ["journalArtical", "preprint", "book"].indexOf(i.itemType) != -1).find((item2) => {
          try {
            let title = item2.getField("title");
            if (!this.isChinese(title) && title.split(" ").length < 4) {
              return false;
            }
            title = getPureText(title);
            const searchTitle = getPureText(info.title || info.text);
            if (searchTitle.length > 10 && title && searchTitle && ((title == null ? void 0 : title.indexOf(searchTitle)) != -1 || (searchTitle == null ? void 0 : searchTitle.indexOf(title)) != -1)) {
              return item2;
            }
          } catch (e) {
          }
        });
        if (item) {
          info._item = item;
          this.cache[key] = item;
          info.title = item.getField("title");
          let DOI = item.getField("DOI");
          if (DOI) {
            info.identifiers = { DOI };
          }
        }
        return item;
      }
    }
    selectItemInLibrary(item) {
      Zotero_Tabs.select("zotero-pane");
      ZoteroPane.selectItem(item.id);
    }
    getItemType(item) {
      if (!item) {
        return;
      }
      return Zotero.ItemTypes.getName(
        item.getField("itemTypeID")
      );
    }
    isChinese(text) {
      var _a;
      text = text.replace(/\s+/g, "");
      return (((_a = text.match(/[\u4E00-\u9FA5]/g)) == null ? void 0 : _a.length) || 0) / text.length > 0.5;
    }
    isDOI(text) {
      if (!text) {
        return false;
      }
      let res = text.match(this.regex.DOI);
      if (res) {
        return res[0] == text && !/(cnki|issn)/i.test(text);
      } else {
        return false;
      }
    }
    matchArXiv(text) {
      let res = text.match(this.regex.arXiv);
      if (res != null && res.length >= 2) {
        return res[1];
      } else {
        return false;
      }
    }
    Html2Text(html) {
      if (!html) {
        return "";
      }
      let text;
      try {
        let span = document.createElement("span");
        span.innerHTML = html;
        text = span.innerText || span.textContent;
        span = null;
      } catch (e) {
        text = html;
      }
      if (text) {
        text = text.replace(/<([\w:]+?)>([\s\S]+?)<\/\1>/g, (match, p1, p2) => p2).replace(/\n+/g, "");
      }
      return text;
    }
    getReader() {
      return Zotero.Reader.getByTabID(Zotero_Tabs.selectedID);
    }
    getItem() {
      let reader = this.getReader();
      if (reader) {
        return Zotero.Items.get(this.getReader()._itemID).parentItem;
      }
    }
    abs(v) {
      return v > 0 ? v : -v;
    }
  };
  var utils_default = Utils;

  // src/modules/tip.ts
  var TipUI = class {
    constructor() {
      this.option = {
        size: 8,
        color: {
          active: "#FF597B",
          default: "#F9B5D0"
        }
      };
      this.shadeMillisecond = parseInt(Zotero.Prefs.get(`${config.addonRef}.shadeMillisecond`));
      this.removeTipAfterMillisecond = parseInt(Zotero.Prefs.get(`${config.addonRef}.removeTipAfterMillisecond`));
      this.utils = new utils_default();
    }
    onInit(refRect, position) {
      this.refRect = refRect;
      this.position = position;
      this.clear();
      this.buildContainer();
    }
    clear() {
      document.querySelectorAll(".zotero-reference-tip-container").forEach((e) => {
        e.style.opacity = "0";
        window.setTimeout(() => {
          e.remove();
        }, this.shadeMillisecond);
      });
    }
    /**
     * 放置container到合适位置
     * 
     */
    place() {
      `
		winRect = {
			bottom: 792
			height: 792
			left: 0
			right: 1536
			top: 0
			width: 1536
			x: 0
			y: 0
		}
		eleRect = {
			bottom: 188
			height: 16
			left: 1196
			right: 1507
			top: 172
			width: 310
			x: 1196
			y: 172
		}
		\u53F3\u4E0A(x=0, y=0)
		`;
      let setStyles = (styles2) => {
        for (let k in styles2) {
          this.container.style[k] = styles2[k];
        }
        return this.container.getBoundingClientRect();
      };
      const winRect = document.documentElement.getBoundingClientRect();
      const maxWidth = winRect.width;
      const maxHeight = winRect.height;
      const refRect = this.refRect;
      let styles;
      if (this.position == "left") {
        styles = {
          // right: `${maxWidth - refRect.x + maxWidth * .014}px`,
          right: `${maxWidth - refRect.x}px`,
          bottom: "",
          top: `${refRect.y}px`,
          width: `${refRect.x * 0.7}px`
        };
      } else if (this.position == "top center") {
        let width = maxWidth * 0.7;
        styles = {
          width: `${width}px`,
          left: `${refRect.x + refRect.width / 2 - width / 2}px`,
          bottom: `${maxHeight - refRect.y}px`,
          top: ""
        };
        this.container.style.flexDirection = "column-reverse";
      }
      let rect = setStyles(styles);
      if (rect.bottom > maxHeight) {
        setStyles({
          top: "",
          bottom: "0px"
        });
        this.container.style.flexDirection = "column-reverse";
      }
      if (rect.top < 0) {
        setStyles({
          bottom: "",
          top: "0px"
        });
      }
      if (rect.left < 30) {
        setStyles({
          right: "",
          left: "30px"
        });
      }
      if (maxWidth - rect.right < 30) {
        setStyles({
          left: "",
          right: "30px"
        });
      }
      this.container.style.opacity = "1";
      return;
    }
    buildContainer() {
      this.container = ztoolkit.UI.createElement(
        document,
        "div",
        {
          namespace: "html",
          classList: ["zotero-reference-tip-container"],
          styles: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "fixed",
            zIndex: "999",
            // border: "2px solid transparent",
            padding: "1em",
            backgroundColor: Zotero.Prefs.get(`${config.addonRef}.tipBackgroundColor`),
            opacity: "0",
            transition: `opacity ${this.shadeMillisecond / 1e3}s linear`,
            "-moz-user-select": "text",
            boxShadow: "0 4px 24px rgb(0 0 0 / 20%)",
            borderRadius: "8px"
          },
          listeners: [
            {
              type: "DOMMouseScroll",
              listener: (event) => {
                if (event.ctrlKey) {
                  this.zoom(event);
                }
              }
            },
            {
              type: "mouseenter",
              listener: () => {
                window.clearTimeout(this.tipTimer);
              }
            },
            {
              type: "mouseleave",
              listener: () => {
                this.tipTimer = window.setTimeout(() => {
                  this.container.remove();
                }, this.removeTipAfterMillisecond);
              }
            }
          ],
          children: [
            {
              tag: "box",
              id: "option-container",
              styles: {
                width: "100%",
                height: `${this.option.size}px`,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: ".25em",
                marginTop: ".25em"
              }
            },
            {
              tag: "box",
              id: "content-container",
              styles: {
                width: "100%"
              }
            }
          ]
        }
      );
      document.documentElement.appendChild(this.container);
    }
    /**
     * @param title 标题
     * @param tags 标签
     * @param descriptions 描述，一般是期刊，年份作者等
     * @param content 正文，一般是摘要
     * @returns 
     */
    addTip(title, tags, descriptions, content, according, index, prefIndex) {
      const translate = async (text) => {
        var _a;
        if (Zotero.ZoteroPDFTranslate) {
          Zotero.ZoteroPDFTranslate._sourceText = text;
          const success = await Zotero.ZoteroPDFTranslate.translate.getTranslation();
          if (!success) {
            Zotero.ZoteroPDFTranslate.view.showProgressWindow(
              "Translate Failed",
              success,
              "fail"
            );
            return;
          }
          return Zotero.ZoteroPDFTranslate._translatedText;
        } else if (Zotero.PDFTranslate) {
          return (_a = await Zotero.PDFTranslate.api.translate(text)) == null ? void 0 : _a.result;
        }
      };
      let translateNode = async function (event) {
        if ((Zotero.isMac && event.metaKey && !event.ctrlKey || !Zotero.isMac && event.ctrlKey) && Zotero.Prefs.get(`${config.addonRef}.ctrlClickTranslate`)) {
          let node = this;
          let sourceText = node.getAttribute("sourceText");
          let translatedText = node.getAttribute("translatedText");
          console.log(sourceText, translatedText);
          if (!sourceText) {
            sourceText = node.innerText;
            node.setAttribute("sourceText", sourceText);
          }
          if (!translatedText) {
            translatedText = await translate(sourceText);
            node.setAttribute("translatedText", translatedText);
          }
          if (node.innerText == sourceText) {
            console.log("-> translatedText");
            node.innerText = translatedText;
          } else if (node.innerText == translatedText) {
            node.innerText = sourceText;
            console.log("-> sourceText");
          }
        }
      };
      const isSelect = index !== void 0 && prefIndex !== void 0 && index == prefIndex || this.container.querySelector("#option-container").childNodes.length == 0;
      if (isSelect) {
        this.reset();
      }
      const contentNode = ztoolkit.UI.createElement(
        document,
        "div",
        {
          classList: ["zotero-reference-tip"],
          styles: {
            padding: "0px",
            width: "100%",
            display: isSelect ? "" : "none"
          },
          subElementOptions: [
            {
              tag: "span",
              classList: ["title"],
              styles: {
                display: "block",
                fontWeight: "bold",
                marginBottom: ".25em",
                fontSize: "1.2em",
                color: Zotero.Prefs.get(`${config.addonRef}.tipTitleColor`)
              },
              directAttributes: {
                innerText: title
              },
              listeners: [
                {
                  type: "click",
                  listener: translateNode
                }
              ]
            },
            ...tags && tags.length > 0 ? [{
              tag: "div",
              id: "tags",
              styles: {
                width: "100%"
                // margin: "0.5em 0",
              },
              subElementOptions: ((tags2) => {
                if (!tags2) {
                  return [];
                }
                let arr = [];
                for (let tag of tags2) {
                  arr.push({
                    tag: "span",
                    directAttributes: {
                      innerText: tag.text
                    },
                    styles: {
                      backgroundColor: tag.color,
                      borderRadius: "10px",
                      margin: "0.5em 1em 0.5em 0px",
                      display: "inline-block",
                      padding: "0 8px",
                      color: "white",
                      cursor: "pointer",
                      userSelect: "none"
                    },
                    listeners: [
                      {
                        type: "click",
                        listener: () => {
                          if (tag.url) {
                            new ztoolkit.ProgressWindow("Launching URL").createLine({ text: tag.url, type: "default" }).show();
                            Zotero.launchURL(tag.url);
                          } else if (tag.item) {
                            this.clear();
                            Zotero.ProgressWindowSet.closeAll();
                            this.utils.selectItemInLibrary(tag.item);
                          } else {
                            this.utils.copyText(tag.text);
                          }
                        }
                      },
                      {
                        type: "mouseenter",
                        listener: () => {
                          if (!tag.tip) {
                            return;
                          }
                          Zotero.ProgressWindowSet.closeAll();
                          new ztoolkit.ProgressWindow("Reference").createLine({ text: tag.tip, type: "success" }).show();
                        }
                      },
                      {
                        type: "mouseleave",
                        listener: () => {
                          if (!tag.tip) {
                            return;
                          }
                          Zotero.ProgressWindowSet.closeAll();
                        }
                      }
                    ]
                  });
                }
                return arr;
              })(tags)
            }] : [],
            ...descriptions && descriptions.length > 0 ? [{
              tag: "div",
              id: "descriptions",
              styles: {
                marginBottom: "0.25em"
              },
              children: ((descriptions2) => {
                if (!descriptions2) {
                  return [];
                }
                let arr = [];
                for (let text of descriptions2) {
                  arr.push({
                    tag: "span",
                    id: "content",
                    styles: {
                      display: "block",
                      lineHeight: "1.5em",
                      opacity: "0.5",
                      cursor: "pointer",
                      userSelect: "none"
                    },
                    properties: {
                      innerText: text
                    },
                    listeners: [
                      {
                        type: "click",
                        listener: () => {
                          this.utils.copyText(text);
                        }
                      }
                    ]
                  });
                }
                return arr;
              })(descriptions)
            }] : [],
            {
              tag: "span",
              id: "content",
              properties: {
                innerText: content
              },
              styles: {
                display: "block",
                lineHeight: "1.5em",
                textAlign: "justify",
                opacity: "0.8",
                maxHeight: "300px",
                overflowY: "auto",
                marginTop: ".25em"
              },
              listeners: [
                {
                  type: "click",
                  listener: translateNode
                }
              ]
            }
          ]
        }
      );
      const optionNode = ztoolkit.UI.createElement(
        document,
        "div",
        {
          id: `option-${index}`,
          styles: {
            width: `${this.option.size}px`,
            height: `${this.option.size}px`,
            borderRadius: "50%",
            backgroundColor: isSelect ? this.option.color.active : this.option.color.default,
            marginLeft: `${this.option.size * 0.5}px`,
            marginRight: `${this.option.size * 0.5}px`,
            cursor: "pointer",
            transition: "background-color 0.23s linear"
          },
          listeners: [
            {
              type: "click",
              listener: () => {
                this.reset();
                optionNode.style.backgroundColor = this.option.color.active;
                contentNode.style.display = "";
                Zotero.Prefs.set(`${config.addonRef}.${according}InfoIndex`, index);
                this.place();
              }
            },
            {
              type: "mouseenter",
              listener: () => {
                let tag = tags.find((tag2) => tag2.source);
                let source = tag && tag.source && according && `${tag.source} view according to ${according}` || "reference view";
                Zotero.ProgressWindowSet.closeAll();
                new ztoolkit.ProgressWindow("Reference").createLine({ text: source, type: "success" }).show();
              }
            },
            {
              type: "mouseleave",
              listener: () => {
                Zotero.ProgressWindowSet.closeAll();
              }
            }
          ]
        }
      );
      const optionContainer = this.container.querySelector("#option-container");
      const optionNodes = [...optionContainer.querySelectorAll("[id^=option]")];
      if (optionNodes.length == 0) {
        optionContainer.appendChild(optionNode);
      } else {
        let getIndex = (node) => Number(node.id.split("-")[1]);
        for (let i = 0; i < optionNodes.length; i++) {
          if (index > getIndex(optionNodes[i])) {
            if (i + 1 < optionNodes.length) {
              if (index < getIndex(optionNodes[i + 1])) {
                optionContainer.insertBefore(optionNode, optionNodes[i + 1]);
                break;
              }
            } else {
              optionContainer.appendChild(optionNode);
              break;
            }
          } else {
            optionContainer.insertBefore(optionNode, optionNodes[i]);
            break;
          }
        }
      }
      this.container.querySelector("#content-container").appendChild(contentNode);
      this.place();
    }
    reset() {
      this.container.querySelector("#content-container").childNodes.forEach((e) => {
        e.style.display = "none";
      });
      this.container.querySelector("#option-container").childNodes.forEach((e) => {
        e.style.backgroundColor = this.option.color.default;
      });
    }
    zoom(event) {
      let _scale = this.container.style.transform.match(/scale\((.+)\)/);
      let scale = _scale ? parseFloat(_scale[1]) : 1;
      let minScale = 1, maxScale = 1.7, step = 0.05;
      if (this.container.style.bottom == "0px") {
        this.container.style.transformOrigin = "center bottom";
      } else {
        this.container.style.transformOrigin = "center center";
      }
      if (event.detail > 0) {
        scale = scale - step;
        this.container.style.transform = `scale(${scale < minScale ? minScale : scale})`;
      } else {
        scale = scale + step;
        this.container.style.transform = `scale(${scale > maxScale ? maxScale : scale})`;
      }
    }
  };

  // ../zotero-style/src/modules/localStorage.ts
  var LocalStorage = class {
    constructor(filename) {
      this.lock = Zotero.Promise.defer();
      this.init(filename);
    }
    async init(filename) {
      const window2 = Zotero.getMainWindow();
      const OS = window2.OS;
      if (!await OS.File.exists(filename)) {
        const temp = Zotero.getTempDirectory();
        this.filename = OS.Path.join(temp.path.replace(temp.leafName, ""), `${filename}.json`);
      } else {
        this.filename = filename;
      }
      try {
        const rawString = await Zotero.File.getContentsAsync(this.filename);
        this.cache = JSON.parse(rawString);
        ztoolkit.log(this.cache);
      } catch {
        this.cache = {};
      }
      this.lock.resolve();
    }
    get(item, key) {
      var _a, _b, _c;
      if (this.cache == void 0) {
        console.log("cache is undefined");
        return;
      }
      return ((_c = (_a = this.cache)[_b = item.key]) != null ? _c : _a[_b] = {})[key];
    }
    async set(item, key, value) {
      var _a, _b, _c;
      await this.lock.promise;
      ((_c = (_a = this.cache)[_b = item.key]) != null ? _c : _a[_b] = {})[key] = value;
      window.setTimeout(async () => {
        await Zotero.File.putContentsAsync(this.filename, JSON.stringify(this.cache));
      });
    }
  };
  var localStorage_default = LocalStorage;

  // src/modules/views.ts
  var localStorage = new localStorage_default(config.addonRef);
  var Views = class {
    constructor() {
      this.iconStyles = {
        bacogroundColor: "none",
        backgroundSize: "16px 16px",
        backgroundRepeat: "no-repeat",
        backgroundPositionX: "center",
        backgroundPositionY: "center",
        backgroundClip: "border-box",
        backgroundOrigin: "padding-box",
        width: "16px",
        "margin-inline-start": "0px",
        "margin-inline-end": "0px",
        marginTop: "0px",
        marginBottom: "0px"
      };
      initLocale();
      this.utils = new utils_default();
    }
    /**
     * 注册阅读侧边栏
     */
    async onInit() {
      ztoolkit.ReaderTabPanel.register(
        getString("tabpanel.reader.tab.label"),
        (panel, deck, win, reader) => {
          if (!panel) {
            ztoolkit.log(
              "This reader do not have right-side bar. Adding reader tab skipped."
            );
            return;
          }
          let timer;
          const id = `${config.addonRef}-${reader._instanceID}-extra-reader-tab-div`;
          const relatedbox = ztoolkit.UI.createElement(
            document,
            "relatedbox",
            {
              id,
              classList: ["zotero-editpane-related"],
              namespace: "xul",
              ignoreIfExists: true,
              attributes: {
                flex: "1"
              },
              children: [
                {
                  tag: "vbox",
                  namespace: "xul",
                  classList: ["zotero-box"],
                  attributes: {
                    flex: "1"
                  },
                  styles: {
                    paddingLeft: "0px",
                    paddingRight: "0px"
                  },
                  children: [
                    {
                      tag: "hbox",
                      namespace: "xul",
                      attributes: {
                        align: "center"
                      },
                      children: [
                        {
                          tag: "label",
                          namespace: "xul",
                          id: "referenceNum",
                          attributes: {
                            value: `0 ${getString("relatedbox.number.label")}`
                          },
                          listeners: [
                            {
                              type: "dblclick",
                              listener: () => {
                                ztoolkit.log("dblclick: Copy all references");
                                let textArray = [];
                                let labels = relatedbox.querySelectorAll("rows row box label");
                                labels.forEach((e) => {
                                  textArray.push(e.value);
                                });
                                new ztoolkit.ProgressWindow("Reference").createLine({ text: "Copy all references", type: "success" }).show();
                                new ztoolkit.Clipboard().addText(textArray.join("\n"), "text/unicode").copy();
                              }
                            }
                          ]
                        },
                        {
                          tag: "button",
                          namespace: "xul",
                          id: "refresh-button",
                          attributes: {
                            label: getString("relatedbox.refresh.label")
                          },
                          listeners: [
                            {
                              type: "mousedown",
                              listener: (event) => {
                                timer = window.setTimeout(async () => {
                                  timer = void 0;
                                  await this.refreshReferences(panel, false, event.ctrlKey);
                                }, 1e3);
                              }
                            },
                            {
                              type: "mouseup",
                              listener: async (event) => {
                                if (timer) {
                                  window.clearTimeout(timer);
                                  timer = void 0;
                                  await this.refreshReferences(panel, true, event.ctrlKey);
                                }
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      tag: "grid",
                      namespace: "xul",
                      attributes: {
                        flex: "1"
                      },
                      children: [
                        {
                          tag: "columns",
                          namespace: "xul",
                          children: [
                            {
                              tag: "column",
                              namespace: "xul",
                              attributes: {
                                flex: "1"
                              }
                            },
                            {
                              tag: "column",
                              namespace: "xul"
                            }
                          ]
                        },
                        {
                          tag: "rows",
                          namespace: "xul",
                          id: "referenceRows"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          );
          panel.append(relatedbox);
          window.setTimeout(async () => {
            await this.pdfLinks(reader, panel);
          });
          window.setTimeout(async () => {
            var _a;
            if (Zotero.Prefs.get(`${config.addonRef}.autoRefresh`)) {
              let excludeItemTypes = Zotero.Prefs.get(`${config.addonRef}.notAutoRefreshItemTypes`).split(/,\s*/);
              if (panel.getAttribute("isAutoRefresh") != "true") {
                const item = Zotero.Items.get(reader._itemID).parentItem;
                const id2 = item.getType();
                const itemType = (_a = Zotero.ItemTypes.getTypes().find((i) => i.id == id2)) == null ? void 0 : _a.name;
                if (excludeItemTypes.indexOf(itemType) == -1) {
                  await this.refreshReferences(panel);
                  panel.setAttribute("isAutoRefresh", "true");
                }
              }
            }
          });
          window.setTimeout(async () => {
            await this.loadingRelated();
          });
        },
        {
          targetIndex: Zotero.ZoteroPDFTranslate || Zotero.PDFTranslate ? 3 : void 0,
          tabId: "zotero-reference"
        }
      );
    }
    /**
     * 刷新推荐相关
     * @param array 
     * @param node 
     * @returns 
     */
    refreshRelated(array, node) {
      let totalNum = 0;
      ztoolkit.log("refreshRelated", array);
      array.forEach((info, i) => {
        let row = this.addRow(node, array, i, false, false);
        if (!row) {
          return;
        }
        row.classList.add("only-title");
        totalNum += 1;
        let box = row.querySelector("box");
      });
      return totalNum;
    }
    /**
    * Only item with DOI is supported
    * @returns 
    */
    async loadingRelated() {
      if (!Zotero.Prefs.get(`${config.addonRef}.loadingRelated`)) {
        return;
      }
      ztoolkit.log("loadingRelated");
      let item = this.utils.getItem();
      if (!item) {
        return;
      }
      let itemDOI = item.getField("DOI");
      if (!itemDOI || !this.utils.isDOI(itemDOI)) {
        ztoolkit.log("Not DOI", itemDOI);
        return;
      }
      let relatedbox = document.querySelector(`#${Zotero_Tabs.selectedID}-context`).querySelector("tabpanel:nth-child(3) relatedbox");
      do {
        await Zotero.Promise.delay(50);
      } while (!relatedbox.querySelector("#relatedRows"));
      let node = relatedbox.querySelector("#relatedRows").parentNode;
      if (node.querySelector(".zotero-clicky-plus")) {
        return;
      }
      console.log("getDOIRelatedArray");
      let _relatedArray = await this.utils.API.getDOIRelatedArray(itemDOI) || [];
      let func = relatedbox.refresh;
      relatedbox.refresh = () => {
        func.call(relatedbox);
        node.querySelectorAll("rows row").forEach((e) => e.remove());
        console.log(_relatedArray);
        let relatedArray = item.relatedItems.map((key) => {
          try {
            return Zotero.Items.getByLibraryAndKey(1, key);
          } catch {
          }
        }).filter((i) => i).map((item2) => {
          return {
            identifiers: { DOI: item2.getField("DOI") },
            authors: [],
            title: item2.getField("title"),
            text: item2.getField("title"),
            url: item2.getField("url"),
            type: item2.itemType,
            year: item2.getField("year"),
            _item: item2
          };
        }).concat(_relatedArray);
        console.log(relatedArray);
        this.refreshRelated(relatedArray, node);
        node.querySelectorAll("box image.zotero-box-icon").forEach((e) => {
          let label = ztoolkit.UI.createElement(
            document,
            "label",
            {
              namespace: "xul",
              styles: {
                backgroundImage: `url(${e.src})`,
                ...this.iconStyles
              }
            }
          );
          e.parentNode.replaceChild(label, e);
        });
      };
      relatedbox.refresh();
    }
    async pdfLinks(reader, panel) {
      var _a;
      let _window;
      while (!(_window = (_a = reader == null ? void 0 : reader._iframeWindow) == null ? void 0 : _a.wrappedJSObject)) {
        await Zotero.Promise.delay(10);
      }
      let refKeys = [];
      let dests;
      window.setTimeout(async () => {
        dests = await _window.PDFViewerApplication.pdfDocument._transport.getDestinations();
        const statistics = {};
        Object.keys(dests).forEach((key) => {
          var _a2;
          let _key = key.replace(/\d/g, "");
          (_a2 = statistics[_key]) != null ? _a2 : statistics[_key] = 0;
          statistics[_key] += 1;
        });
        let refKey = Object.keys(statistics).sort((k1, k2) => statistics[k2] - statistics[k1])[0];
        Object.keys(dests).forEach((key) => {
          if (key.replace(/\d/g, "") == refKey) {
            refKeys.push(key);
          }
        });
        refKeys = refKeys.sort((k1, k2) => {
          let n1 = Number(k1.match(/\d+/)[0]);
          let n2 = Number(k2.match(/\d+/)[0]);
          return n1 - n2;
        });
      });
      let id = window.setInterval(async () => {
        try {
          _window.document;
        } catch {
          window.clearInterval(id);
          return await this.pdfLinks(reader, panel);
        }
        _window.document.querySelectorAll(`.annotationLayer a[href^='#']:not([${config.addonRef}])`).forEach(async (a) => {
          const isClickLink = Zotero.Prefs.get(`${config.addonRef}.clickLink`);
          let _a2 = a;
          if (isClickLink) {
            _a2 = a.cloneNode(true);
            _a2.setAttribute(config.addonRef, "");
            a.parentNode.appendChild(_a2);
            a.remove();
            _a2.addEventListener("click", async (event) => {
              var _a3, _b;
              event.preventDefault();
              let href = _a2.getAttribute("href");
              if (_window.secondViewIframeWindow == null) {
                await reader.menuCmd(
                  Zotero.Prefs.get(`${config.addonRef}.clickLink.cmd`)
                );
                while (!((_b = (_a3 = _window == null ? void 0 : _window.secondViewIframeWindow) == null ? void 0 : _a3.PDFViewerApplication) == null ? void 0 : _b.pdfDocument)) {
                  await Zotero.Promise.delay(100);
                }
                await Zotero.Promise.delay(1e3);
              }
              let dest = unescape(href.slice(1));
              try {
                dest = JSON.parse(dest);
              } catch {
              }
              _window.secondViewIframeWindow.eval(`PDFViewerApplication
                .pdfViewer.linkService.goToDestination(${JSON.stringify(dest)})`);
            });
          }
          let timer;
          const isHoverLink = Zotero.Prefs.get(`${config.addonRef}.hoverLink`);
          if (isHoverLink) {
            _a2.addEventListener("mouseenter", async (event) => {
              console.log(
                refKeys,
                dests
              );
              let refKey = unescape(_a2.href).split("#").slice(-1)[0];
              let refIndex;
              if (refIndex = refKeys.indexOf(refKey)) {
                let row = panel.querySelector(`#referenceRows row:nth-child(${refIndex + 1})`);
                let reference = row == null ? void 0 : row.reference;
                if (reference) {
                  timer = window.setTimeout(() => {
                    timer = void 0;
                    let rect = _a2.getBoundingClientRect();
                    rect.y = rect.y + 20;
                    const tipUI = this.showTipUI(
                      rect,
                      reference,
                      "top center"
                    );
                  }, 1e3);
                }
              }
            });
            _a2.addEventListener("mouseleave", async () => {
              if (timer) {
                window.clearTimeout(timer);
                timer = void 0;
              }
            });
          }
        });
      }, 100);
    }
    /**
     * 刷新按钮触发
     * @param local 是否允许从本地读取
     * @param fromCurrentPage 从当前页向前查询参考文献
     * @returns 
     */
    async refreshReferences(panel, local = true, fromCurrentPage = false) {
      var _a, _b, _c, _d;
      Zotero.ProgressWindowSet.closeAll();
      let label = panel.querySelector("label#referenceNum");
      label.value = `${0} ${getString("relatedbox.number.label")}`;
      let source = panel.getAttribute("source");
      if (source) {
        if (local) {
          if (source == "PDF") {
            panel.setAttribute("source", "API");
          }
          if (source == "API") {
            panel.setAttribute("source", "PDF");
          }
        }
      } else {
        panel.setAttribute("source", Zotero.Prefs.get(`${config.addonRef}.prioritySource`));
      }
      panel.querySelectorAll("#referenceRows row").forEach((e) => e.remove());
      panel.querySelectorAll("#zotero-reference-search").forEach((e) => e.remove());
      let references;
      let item = this.utils.getItem();
      let reader = this.utils.getReader();
      if (panel.getAttribute("source") == "PDF") {
        const key = "References-PDF";
        references = local && localStorage.get(item, key);
        if (references) {
          new ztoolkit.ProgressWindow("[Local] PDF").createLine({ text: `${references.length} references`, type: "success" }).show();
        } else {
          references = await this.utils.PDF.getReferences(reader, fromCurrentPage);
          if (Zotero.Prefs.get(`${config.addonRef}.savePDFReferences`)) {
            window.setTimeout(async () => {
              await localStorage.set(item, key, references);
            });
          }
        }
      } else {
        const key = "References-API";
        references = local && localStorage.get(item, key);
        if (references) {
          new ztoolkit.ProgressWindow("[Local] API").createLine({ text: `${references.length} references`, type: "success" }).show();
        } else {
          let DOI = item.getField("DOI");
          let url = item.getField("url");
          let title = item.getField("title");
          let fileName = (_a = this.utils.parseCNKIURL(url)) == null ? void 0 : _a.fileName;
          let popupWin;
          if (this.utils.isDOI(DOI)) {
            popupWin = new ztoolkit.ProgressWindow("[Pending] API", { closeTime: -1 });
            popupWin.createLine({ text: "Request DOI references...", type: "default" }).show();
            references = (_b = await this.utils.API.getDOIInfoByCrossref(DOI)) == null ? void 0 : _b.references;
          } else {
            if (!fileName) {
              try {
                let url2 = await this.utils.API.getCNKIURL(title);
                if (url2) {
                  fileName = (_c = this.utils.parseCNKIURL(url2)) == null ? void 0 : _c.fileName;
                  item.setField("url", url2);
                  await item.saveTx();
                }
              } catch {
                new ztoolkit.ProgressWindow("[Fail] API").createLine({ text: `Error, Get CNKI URL`, type: "fail" }).show();
                return;
              }
              if (!fileName) {
                new ztoolkit.ProgressWindow("[Fail] API").createLine({ text: `Fail, Get CNKI URL`, type: "fail" }).show();
                return;
              }
            }
            popupWin = new ztoolkit.ProgressWindow("[Pending] API", { closeTime: -1, closeOtherProgressWindows: true });
            popupWin.createLine({ text: "Request CNKI references...", type: "default" }).show();
            references = (_d = await this.utils.API.getCNKIFileInfo(fileName)) == null ? void 0 : _d.references;
            if (!references) {
              popupWin.changeHeadline("[Fail] API");
              popupWin.changeLine({ text: `Not Supported, ${fileName}`, type: "fail" });
              popupWin.startCloseTimer(3e3);
              return;
            }
          }
          if (Zotero.Prefs.get(`${config.addonRef}.saveAPIReferences`)) {
            window.setTimeout(async () => {
              references && await localStorage.set(item, key, references);
            });
          }
          popupWin.changeHeadline("[Done] API");
          popupWin.changeLine({ text: `${references.length} references`, type: "success" });
          popupWin.startCloseTimer(3e3);
        }
      }
      const referenceNum = references.length;
      references.forEach((reference, refIndex) => {
        let row = this.addRow(panel, references, refIndex);
        row.reference = reference;
        label.value = `${refIndex + 1}/${referenceNum} ${getString("relatedbox.number.label")}`;
      });
      label.value = `${referenceNum} ${getString("relatedbox.number.label")}`;
    }
    showTipUI(refRect, reference, position, idText) {
      let toTimeInfo = (t) => {
        if (!t) {
          return void 0;
        }
        let info = new Date(t).toString().split(" ");
        return `${info[1]} ${info[3]}`;
      };
      let tipUI = new TipUI();
      tipUI.onInit(refRect, position);
      const refText = reference.text;
      let getDefalutInfoByReference = async () => {
        const localItem = reference._item;
        let info;
        if (localItem) {
          info = {
            identifiers: {},
            authors: localItem.getCreators().map((i) => i.firstName + " " + i.lastName),
            tags: localItem.getTags().map((i) => {
              let ctag = localItem.getColoredTags().find((ci) => ci.tag == i.tag);
              if (ctag) {
                return { text: i.tag, color: ctag.color };
              } else {
                return i.tag;
              }
            }),
            abstract: localItem.getField("abstractNote"),
            title: localItem.getField("title"),
            year: localItem.getField("year"),
            primaryVenue: localItem.getField("publicationTitle"),
            type: "",
            source: reference.source || void 0
          };
        } else {
          info = {
            identifiers: reference.identifiers || {},
            authors: reference.authors || [],
            type: "",
            year: reference.year || void 0,
            title: reference.title || idText || "Reference",
            tags: reference.tags || [],
            text: reference.text || refText,
            abstract: reference.abstract || refText,
            primaryVenue: reference.primaryVenue || void 0
          };
        }
        return info;
      };
      let coroutines, prefIndex, according;
      if (reference == null ? void 0 : reference.identifiers.arXiv) {
        according = "arXiv";
        coroutines = [
          getDefalutInfoByReference(),
          this.utils.API.getArXivInfo(reference.identifiers.arXiv)
        ];
        prefIndex = parseInt(Zotero.Prefs.get(`${config.addonRef}.${according}InfoIndex`));
      } else if (reference == null ? void 0 : reference.identifiers.DOI) {
        according = "DOI";
        coroutines = [
          getDefalutInfoByReference(),
          this.utils.API.getDOIInfoBySemanticscholar(reference.identifiers.DOI),
          this.utils.API.getTitleInfoByReadpaper(refText, {}, reference.identifiers.DOI),
          this.utils.API.getTitleInfoByConnectedpapers(reference.identifiers.DOI),
          this.utils.API.getDOIInfoByCrossref(reference.identifiers.DOI)
        ];
        prefIndex = parseInt(Zotero.Prefs.get(`${config.addonRef}.${according}InfoIndex`));
      } else {
        according = "Title";
        coroutines = [
          getDefalutInfoByReference(),
          this.utils.API.getTitleInfoByReadpaper(reference.title),
          this.utils.API.getTitleInfoByCrossref(reference.title),
          this.utils.API.getTitleInfoByConnectedpapers(reference.title),
          this.utils.API.getTitleInfoByCNKI(reference.title)
        ];
        prefIndex = parseInt(Zotero.Prefs.get(`${config.addonRef}.${according}InfoIndex`));
      }
      ztoolkit.log("prefIndex", prefIndex);
      const sourceConfig = {
        arXiv: { color: "#b31b1b", tip: "arXiv is a free distribution service and an open-access archive for 2,186,475 scholarly articles in the fields of physics, mathematics, computer science, quantitative biology, quantitative finance, statistics, electrical engineering and systems science, and economics. Materials on this site are not peer-reviewed by arXiv." },
        readpaper: { color: "#1f71e0", tip: "\u8BBA\u6587\u9605\u8BFB\u5E73\u53F0ReadPaper\u5171\u6536\u5F55\u8FD12\u4EBF\u7BC7\u8BBA\u6587\u30012.7\u4EBF\u4F4D\u4F5C\u8005\u3001\u8FD13\u4E07\u6240\u9AD8\u6821\u53CA\u7814\u7A76\u673A\u6784\uFF0C\u51E0\u4E4E\u6DB5\u76D6\u4E86\u5168\u4EBA\u7C7B\u6240\u6709\u5B66\u79D1\u3002\u79D1\u7814\u5DE5\u4F5C\u79BB\u4E0D\u5F00\u8BBA\u6587\u7684\u5E2E\u52A9\uFF0C\u5982\u4F55\u8BFB\u61C2\u8BBA\u6587\uFF0C\u8BFB\u597D\u8BBA\u6587\uFF0C\u8FD9\u672C\u8EAB\u5C31\u662F\u4E00\u4E2A\u5F88\u5927\u7684\u547D\u9898\uFF0C\u6211\u4EEC\u7684\u4F7F\u547D\u662F\uFF1A\u201C\u8BA9\u5929\u4E0B\u6CA1\u6709\u96BE\u8BFB\u7684\u8BBA\u6587\u201D" },
        semanticscholar: { color: "#1857b6", tip: "Semantic Scholar is an artificial intelligence\u2013powered research tool for scientific literature developed at the Allen Institute for AI and publicly released in November 2015. It uses advances in natural language processing to provide summaries for scholarly papers. The Semantic Scholar team is actively researching the use of artificial-intelligence in natural language processing, machine learning, Human-Computer interaction, and information retrieval." },
        crossref: { color: "#89bf04", tip: "Crossref is a nonprofit association of approximately 2,000 voting member publishers who represent 4,300 societies and publishers, including both commercial and nonprofit organizations. Crossref includes publishers with varied business models, including those with both open access and subscription policies." },
        connectedpapers: { color: "#35999a", tip: "Connected Papers is a visual tool to help researchers and applied scientists find academic papers relevant to their field of work." },
        DOI: { color: "#fcb426" },
        Zotero: { color: "#d63b3b", tip: "Zotero is a free, easy-to-use tool to help you collect, organize, cite, and share your research sources." },
        CNKI: { color: "#1b66e6", tip: "\u4E2D\u56FD\u77E5\u7F51\u77E5\u8BC6\u53D1\u73B0\u7F51\u7EDC\u5E73\u53F0\u2014\u9762\u5411\u6D77\u5185\u5916\u8BFB\u8005\u63D0\u4F9B\u4E2D\u56FD\u5B66\u672F\u6587\u732E\u3001\u5916\u6587\u6587\u732E\u3001\u5B66\u4F4D\u8BBA\u6587\u3001\u62A5\u7EB8\u3001\u4F1A\u8BAE\u3001\u5E74\u9274\u3001\u5DE5\u5177\u4E66\u7B49\u5404\u7C7B\u8D44\u6E90\u7EDF\u4E00\u68C0\u7D22\u3001\u7EDF\u4E00\u5BFC\u822A\u3001\u5728\u7EBF\u9605\u8BFB\u548C\u4E0B\u8F7D\u670D\u52A1\u3002" }
      };
      for (let i = 0; i < coroutines.length; i++) {
        window.setTimeout(async () => {
          let info = await coroutines[i];
          if (!info) {
            return;
          }
          const tagDefaultColor = "#59C1BD";
          let tags = info.tags.map((tag) => {
            if (typeof tag == "object") {
              return { color: tagDefaultColor, ...tag };
            } else {
              return { color: tagDefaultColor, text: tag };
            }
          }) || [];
          if (info.source) {
            tags.push({ text: info.source, ...sourceConfig[info.source], source: info.source });
          }
          if (info.identifiers.DOI) {
            let DOI = info.identifiers.DOI;
            tags.push({ text: "DOI", color: sourceConfig.DOI.color, tip: DOI, url: info.url });
          }
          if (info.identifiers.arXiv) {
            let arXiv = info.identifiers.arXiv;
            tags.push({ text: "arXiv", color: sourceConfig.arXiv.color, tip: arXiv, url: info.url });
          }
          if (info.identifiers.CNKI) {
            let url = info.identifiers.CNKI;
            tags.push({ text: "URL", color: sourceConfig.CNKI.color, tip: url, url: info.url });
          }
          if (reference._item) {
            tags.push({ text: "Zotero", color: sourceConfig.Zotero.color, tip: sourceConfig.Zotero.tip, item: reference._item });
          }
          tipUI.addTip(
            this.utils.Html2Text(info.title),
            tags,
            [
              info.authors.slice(0, 3).join(" / "),
              [info == null ? void 0 : info.primaryVenue, toTimeInfo(info.publishDate) || info.year].filter((e) => e).join(" \xB7 "),
              reference.description
            ].filter((s) => s && s != ""),
            this.utils.Html2Text(info.abstract),
            according,
            i,
            prefIndex
          );
        });
      }
      return tipUI;
    }
    addRow(node, references, refIndex, addPrefix = true, addSearch = true) {
      let notInLibarayOpacity = Zotero.Prefs.get(`${config.addonRef}.notInLibarayOpacity`);
      if (/[\d\.]+/.test(notInLibarayOpacity)) {
        notInLibarayOpacity = Number(notInLibarayOpacity);
      } else {
        notInLibarayOpacity = 1;
      }
      let reference = references[refIndex];
      let refText;
      if (addPrefix) {
        refText = `[${(reference == null ? void 0 : reference.number) || refIndex + 1}] ${reference.text}`;
      } else {
        refText = reference.text;
      }
      let toText = (s) => s.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "");
      if ([...node.querySelectorAll("row label")].find((e) => toText(e.value) == toText(refText))) {
        return;
      }
      let idText = reference.identifiers && Object.values(reference.identifiers).length > 0 && Object.keys(reference.identifiers)[0] + ": " + Object.values(reference.identifiers)[0] || "Reference";
      let item = this.utils.getItem();
      let editTimer;
      const row = ztoolkit.UI.createElement(
        document,
        "row",
        {
          namespace: "xul",
          children: [
            {
              tag: "box",
              id: "reference-box",
              namespace: "xul",
              styles: {
                opacity: String(notInLibarayOpacity)
              },
              classList: ["zotero-clicky"],
              listeners: [
                {
                  type: "click",
                  listener: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }
                },
                {
                  type: "mouseup",
                  listener: async (event) => {
                    var _a;
                    event.preventDefault();
                    event.stopPropagation();
                    if (event.ctrlKey) {
                      window.clearTimeout(editTimer);
                      if (reference._item) {
                        return this.utils.selectItemInLibrary(reference._item);
                      } else {
                        let item2 = await this.utils.searchLibraryItem(reference);
                        if (item2) {
                          return this.utils.selectItemInLibrary(item2);
                        }
                      }
                      let URL = reference.url;
                      if (!URL) {
                        const refText2 = reference.text;
                        let info = this.utils.refText2Info(refText2);
                        const popupWin = new ztoolkit.ProgressWindow("Searching URL", { closeTime: -1 }).createLine({ text: `Title: ${reference.title}`, type: "default" }).show();
                        if (this.utils.isChinese(refText2)) {
                          URL = await this.utils.API.getCNKIURL(info.title);
                        } else {
                          let DOI = (_a = await this.utils.API.getTitleInfoByConnectedpapers(reference.title)) == null ? void 0 : _a.identifiers.DOI;
                          URL = this.utils.identifiers2URL({ DOI });
                        }
                        popupWin.close();
                      }
                      if (URL) {
                        new ztoolkit.ProgressWindow("Launching URL", { closeOtherProgressWindows: true }).createLine({ text: URL, type: "default" }).show();
                        Zotero.launchURL(URL);
                      }
                    } else {
                      if (rows.querySelector("#reference-edit")) {
                        return;
                      }
                      if (editTimer) {
                        window.clearTimeout(editTimer);
                        Zotero.ProgressWindowSet.closeAll();
                        this.utils.copyText((idText ? idText + "\n" : "") + refText, false);
                        new ztoolkit.ProgressWindow("Reference", { closeTime: 10000 }).showText({ text: refText, type: "success" }).show();
                      }
                    }
                  }
                }
              ],
              children: [
                {
                  tag: "label",
                  id: "item-type-icon",
                  namespace: "xul",
                  classList: [],
                  styles: {
                    backgroundImage: `url(chrome://zotero/skin/treeitem-${reference.type}@2x.png)`,
                    ...this.iconStyles
                  }
                },
                {
                  tag: "label",
                  namespace: "xul",
                  id: "reference-label",
                  classList: ["zotero-box-label"],
                  attributes: {
                    value: refText,
                    crop: "end",
                    flex: "1"
                  },
                  listeners: [
                    {
                      type: "mousedown",
                      listener: () => {
                        editTimer = window.setTimeout(() => {
                          editTimer = void 0;
                          enterEdit();
                        }, 500);
                      }
                    }
                  ]
                }
              ]
            },
            {
              tag: "label",
              id: "add-remove",
              namespace: "xul",
              attributes: {
                value: "+"
              },
              classList: [
                "zotero-clicky",
                "zotero-clicky-plus"
              ]
            }
          ]
        }
      );
      let enterEdit = () => {
        let box2 = row.querySelector("#reference-box");
        let label2 = row.querySelector("#reference-label");
        label2.style.display = "none";
        let textbox = ztoolkit.UI.createElement(
          document,
          "textbox",
          {
            id: "reference-edit",
            namespace: "xul",
            attributes: {
              value: addPrefix ? label2.value.replace(/^\[\d+\]\s+/, "") : label2.value,
              flex: "1",
              multiline: "true",
              rows: "4"
            },
            listeners: [
              {
                type: "blur",
                listener: async () => {
                  await exitEdit();
                }
              }
            ]
          }
        );
        textbox.focus();
        label2.parentNode.insertBefore(textbox, label2);
        let exitEdit = async () => {
          let inputText = textbox.value;
          if (!inputText) {
            return;
          }
          label2.style.display = "";
          textbox.remove();
          if (inputText == reference.text) {
            return;
          }
          label2.value = `[${refIndex + 1}] ${inputText}`;
          references[refIndex] = {
            ...reference,
            ...{ identifiers: this.utils.getIdentifiers(inputText) },
            ...this.utils.refText2Info(inputText),
            ...{ text: inputText }
          };
          reference = references[refIndex];
          window.alert("\u641C\u7D22\u4FEE\u6539");
          let i = this.utils.searchLibraryItem(reference);
          window.alert(i.key);
          const key = `References-${node.getAttribute("source")}`;
          window.setTimeout(async () => {
            await localStorage.set(item, key, references);
          });
        };
        let id = window.setInterval(async () => {
          let active = rows.querySelector(".active");
          if (active && active != box2) {
            await exitEdit();
            window.clearInterval(id);
          }
        }, 100);
      };
      const label = row.querySelector("label#add-remove");
      let setState = (state = "") => {
        switch (state) {
          case "+":
            label.setAttribute("class", "zotero-clicky zotero-clicky-plus");
            label.setAttribute("value", "+");
            label.style.opacity = "1";
            break;
          case "-":
            label.setAttribute("class", "zotero-clicky zotero-clicky-minus");
            label.setAttribute("value", "-");
            label.style.opacity = "1";
            break;
          case "":
            label.setAttribute("value", "");
            label.style.opacity = ".23";
            break;
        }
      };
      let remove = async () => {
        ztoolkit.log("removeRelatedItem");
        const popunWin = new ztoolkit.ProgressWindow("Removing Item", { closeTime: -1 }).createLine({ text: refText, type: "default" }).show();
        setState();
        let relatedItem = this.utils.searchRelatedItem(item, reference._item);
        if (!relatedItem) {
          popunWin.changeHeadline("Removed");
          node.querySelector("#refresh-button").click();
          popunWin.startCloseTimer(3e3);
          return;
        }
        relatedItem.removeRelatedItem(item);
        item.removeRelatedItem(relatedItem);
        await item.saveTx();
        await relatedItem.saveTx();
        setState("+");
        popunWin.changeLine({ type: "success" });
        popunWin.startCloseTimer(3e3);
      };
      let add = async (collections = void 0) => {
        var _a;
        let collapseText = (text) => {
          let n;
          if (this.utils.isChinese(text)) {
            n = 15;
          } else {
            n = 35;
          }
          return text.length > n ? text.slice(0, n) + "..." : text;
        };
        let popupWin = new ztoolkit.ProgressWindow(
          "Searching Item",
          { closeTime: -1, closeOtherProgressWindows: true }
        ).createLine({ text: collapseText(reference.text), type: "default" }).show();
        let refItem = reference._item || await this.utils.searchLibraryItem(reference);
        setState();
        if (refItem) {
          popupWin.changeHeadline("Existing Item");
          popupWin.changeLine({ text: collapseText(refItem.getField("title")) });
        } else {
          let info = this.utils.refText2Info(reference.text);
          if (this.utils.isChinese(reference.text) && Zotero.Jasminum) {
            popupWin.changeHeadline("Creating Item");
            popupWin.changeLine({ text: collapseText(`CNKI: ${info.title}`) });
            try {
              refItem = await this.utils.createItemByJasminum(info.title);
            } catch (e) {
              console.log(e);
            }
            if (!refItem) {
              popupWin.changeLine({ type: "fail" });
              popupWin.startCloseTimer(3e3);
              setState("+");
              return;
            }
          } else {
            if (Object.keys(reference.identifiers).length == 0) {
              popupWin.changeHeadline("Searching DOI");
              popupWin.changeLine({ text: collapseText(`Title: ${info.title}`) });
              let DOI = (_a = await this.utils.API.getTitleInfoByConnectedpapers(info.title)) == null ? void 0 : _a.identifiers.DOI;
              if (!this.utils.isDOI(DOI)) {
                setState("+");
                popupWin.changeLine({ type: "fail" });
                popupWin.startCloseTimer(3e3);
                return;
              }
              reference.identifiers = { DOI };
            }
            popupWin.changeHeadline("Creating Item");
            popupWin.changeLine({ text: collapseText(`${Object.keys(reference.identifiers)}: ${Object.values(reference.identifiers)[0]}`) });
            if (await this.utils.searchRelatedItem(item, refItem)) {
              popupWin.changeHeadline("Added Item");
              popupWin.changeLine({ type: "success" });
              popupWin.startCloseTimer(3e3);
              node.querySelector("#refresh-button").click();
              return;
            }
            try {
              refItem = await this.utils.createItemByZotero(reference.identifiers, collections || item.getCollections());
            } catch (e) {
              popupWin.changeLine({ type: "fail" });
              popupWin.startCloseTimer(3e3);
              setState("+");
              ztoolkit.log(e);
              return;
            }
          }
        }
        popupWin.changeHeadline("Adding Item");
        popupWin.changeLine({ text: collapseText(refItem.getField("title")) });
        for (let collectionID of collections || item.getCollections()) {
          refItem.addToCollection(collectionID);
          await refItem.saveTx();
        }
        reference._item = refItem;
        item.addRelatedItem(refItem);
        refItem.addRelatedItem(item);
        await item.saveTx();
        await refItem.saveTx();
        setState("-");
        popupWin.changeLine({ type: "success" });
        popupWin.startCloseTimer(3e3);
        updateRowByItem(refItem);
        return row;
      };
      let getCollectionPath = async (id) => {
        let path = [];
        while (true) {
          let collection = await Zotero.Collections.getAsync(id);
          path.push(collection._name);
          if (collection._parentID) {
            id = collection._parentID;
          } else {
            break;
          }
        }
        return path.reverse().join("/");
      };
      let updateRowByItem = (refItem) => {
        box.style.opacity = "1";
        row.querySelector("#item-type-icon").style.backgroundImage = `url(chrome://zotero/skin/treeitem-${refItem.itemType}@2x.png)`;
        let alreadyRelated = this.utils.searchRelatedItem(item, refItem);
        if (alreadyRelated) {
          setState("-");
        }
      };
      let timer, tipUI;
      const box = row.querySelector("#reference-box");
      if (notInLibarayOpacity < 1) {
        window.setTimeout(async () => {
          const refItem = reference._item || await this.utils.searchLibraryItem(reference);
          if (refItem) {
            updateRowByItem(refItem);
          }
        }, refIndex * 0);
      }
      box.addEventListener("mouseenter", () => {
        if (!Zotero.Prefs.get(`${config.addonRef}.isShowTip`)) {
          return;
        }
        box.classList.add("active");
        let timeout = parseInt(Zotero.Prefs.get(`${config.addonRef}.showTipAfterMillisecond`));
        const position = Zotero.Prefs.get("extensions.zotero.layout", true) == "stacked" ? "top center" : "left";
        timer = window.setTimeout(async () => {
          const winRect = document.documentElement.getBoundingClientRect();
          const rect = box.getBoundingClientRect();
          rect.x -= winRect.width * 0.014;
          tipUI = this.showTipUI(rect, reference, position, idText);
          if (!box.classList.contains("active")) {
            tipUI.container.style.display = "none";
          }
        }, timeout);
      });
      box.addEventListener("mouseleave", () => {
        box.classList.remove("active");
        window.clearTimeout(timer);
        if (!tipUI) {
          return;
        }
        const timeout = tipUI.removeTipAfterMillisecond;
        tipUI.tipTimer = window.setTimeout(async () => {
          for (let i = 0; i < timeout / 2; i++) {
            if (rows.querySelector(".active")) {
              return;
            }
            await Zotero.Promise.delay(1 / 1e3);
          }
          tipUI && tipUI.clear();
        }, timeout / 2);
      });
      label.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (label.value == "+") {
          if (event.ctrlKey) {
            let rect = box.getBoundingClientRect();
            let menuPopup = document.createElement("menupopup");
            menuPopup.setAttribute("id", "zotero-item-addTo-menu");
            document.documentElement.appendChild(menuPopup);
            let collections = Zotero.Collections.getByLibrary(1);
            console.log(collections);
            for (let col of collections) {
              let menuItem = Zotero.Utilities.Internal.createMenuForTarget(
                col,
                menuPopup,
                null,
                async (event2, collection) => {
                  if (event2.target.tagName == "menuitem") {
                    menuPopup.openPopup(null, null, event2.clientX, event2.clientY);
                    ztoolkit.log(collection);
                    await add([collection.id]);
                    menuPopup.remove();
                    event2.stopPropagation();
                  }
                }
              );
              menuPopup.append(menuItem);
            }
            menuPopup.openPopup(null, null, rect.left, rect.top + rect.height);
          } else {
            await add();
          }
        } else if (label.value == "-") {
          await remove();
        }
      });
      row.append(box, label);
      const rows = node.querySelector("rows[id$=Rows]");
      rows.appendChild(row);
      let referenceNum = rows.childNodes.length;
      if (addSearch && referenceNum && !node.querySelector("#zotero-reference-search")) {
        this.addSearch(node);
      }
      return row;
    }
    addSearch(node) {
      ztoolkit.log("addSearch");
      let textbox = ztoolkit.UI.createElement(document, "textbox", {
        namespace: "xul",
        id: "zotero-reference-search",
        attributes: {
          type: "search",
          placeholder: getString("relatedbox.search.placeholder")
        },
        styles: {
          marginBottom: ".5em"
        }
      });
      textbox.addEventListener("input", (event) => {
        let text = event.target.value;
        ztoolkit.log(
          `ZoteroReference: source text modified to ${text}`
        );
        let keywords = text.split(/[ ,，]/).filter((e) => e);
        if (keywords.length == 0) {
          node.querySelectorAll("row").forEach((row) => row.style.display = "");
          return;
        }
        node.querySelectorAll("row").forEach((row) => {
          let content = row.querySelector("#reference-label").value;
          let isAllMatched = true;
          for (let i = 0; i < keywords.length; i++) {
            isAllMatched = isAllMatched && content.toLowerCase().includes(keywords[i].toLowerCase());
          }
          if (!isAllMatched) {
            row.style.display = "none";
          } else {
            row.style.display = "";
          }
        });
      });
      textbox._clearSearch = () => {
        textbox.value = "";
        node.querySelectorAll("row").forEach((row) => row.style.display = "");
      };
      node.querySelector("vbox").insertBefore(
        textbox,
        node.querySelector("vbox grid")
      );
    }
  };

  // src/hooks.ts
  async function onStartup() {
    await Promise.all([
      Zotero.initializationPromise,
      Zotero.unlockPromise,
      Zotero.uiReadyPromise
    ]);
    initLocale();
    ztoolkit.UI.basicOptions.ui.enableElementRecord = false;
    ztoolkit.UI.basicOptions.ui.enableElementJSONLog = false;
    ztoolkit.ProgressWindow.setIconURI(
      "default",
      `chrome://${config.addonRef}/content/icons/favicon.png`
    );
    const show = ztoolkit.ProgressWindow.prototype.show;
    ztoolkit.ProgressWindow.prototype.show = function () {
      Zotero.ProgressWindowSet.closeAll();
      return show.call(this, ...arguments);
    };
    const prefOptions = {
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs.label"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      extraDTD: [`chrome://${config.addonRef}/locale/overlay.dtd`],
      defaultXUL: true
    };
    ztoolkit.PreferencePane.register(prefOptions);
    const views = new Views();
    await views.onInit();
    Zotero[config.addonInstance].views = views;
  }
  function onShutdown() {
    ztoolkit.unregisterAll();
    addon.data.alive = false;
    delete Zotero[config.addonInstance];
  }
  async function onNotify(event, type, ids, extraData) {
    ztoolkit.log("notify", event, type, ids, extraData);
    if (event == "select" && type == "tab" && extraData[ids[0]].type == "reader") {
    } else {
      return;
    }
  }
  async function onPrefsEvent(type, data) {
    switch (type) {
      case "load":
        registerPrefsScripts(data.window);
        break;
      default:
        return;
    }
  }
  var hooks_default = {
    onStartup,
    onShutdown,
    onNotify,
    onPrefsEvent
  };

  // src/addon.ts
  var Addon = class {
    constructor() {
      this.data = {
        alive: true,
        env: "development",
        // ztoolkit: new MyToolkit(),
        ztoolkit: new import_dist.default()
      };
      this.hooks = hooks_default;
      this.api = {};
    }
  };
  var addon_default = Addon;

  // src/index.ts
  var basicTool = new import_basic.BasicTool();
  if (!basicTool.getGlobal("Zotero")[config.addonInstance]) {
    _globalThis.Zotero = basicTool.getGlobal("Zotero");
    _globalThis.ZoteroPane = basicTool.getGlobal("ZoteroPane");
    _globalThis.Zotero_Tabs = basicTool.getGlobal("Zotero_Tabs");
    _globalThis.window = basicTool.getGlobal("window");
    _globalThis.document = basicTool.getGlobal("document");
    _globalThis.addon = new addon_default();
    _globalThis.ztoolkit = addon.data.ztoolkit;
    ztoolkit.basicOptions.log.prefix = `[${config.addonName}]`;
    ztoolkit.basicOptions.log.disableConsole = true;
    ztoolkit.UI.basicOptions.ui.enableElementJSONLog = false;
    ztoolkit.UI.basicOptions.ui.enableElementDOMLog = false;
    ztoolkit.basicOptions.debug.disableDebugBridgePassword = addon.data.env === "development";
    Zotero[config.addonInstance] = addon;
    addon.hooks.onStartup();
  }
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
