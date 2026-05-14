import {
  require_dist
} from "/build/_shared/chunk-YGHAPAV2.js";
import {
  jsxDEV
} from "/build/_shared/chunk-CPHZSOF3.js";
import "/build/_shared/chunk-2LCIGNNS.js";
import {
  require_react
} from "/build/_shared/chunk-V6BBPW4V.js";
import {
  __commonJS,
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// ../../node_modules/@calumk/editorjs-codecup/dist/editorjs-codeCup.bundle.js
var require_editorjs_codeCup_bundle = __commonJS({
  "../../node_modules/@calumk/editorjs-codecup/dist/editorjs-codeCup.bundle.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.editorJsCodeCup = t() : e.editorJsCodeCup = t();
    }(self, () => (() => {
      var e = { 255: (e2) => {
        var t2;
        self, t2 = () => (() => {
          var e3 = { 475: () => {
            !function() {
              if ("undefined" != typeof Prism && "undefined" != typeof document) {
                var e4 = { javascript: "clike", actionscript: "javascript", apex: ["clike", "sql"], arduino: "cpp", aspnet: ["markup", "csharp"], birb: "clike", bison: "c", c: "clike", csharp: "clike", cpp: "c", cfscript: "clike", chaiscript: ["clike", "cpp"], cilkc: "c", cilkcpp: "cpp", coffeescript: "javascript", crystal: "ruby", "css-extras": "css", d: "clike", dart: "clike", django: "markup-templating", ejs: ["javascript", "markup-templating"], etlua: ["lua", "markup-templating"], erb: ["ruby", "markup-templating"], fsharp: "clike", "firestore-security-rules": "clike", flow: "javascript", ftl: "markup-templating", gml: "clike", glsl: "c", go: "clike", gradle: "clike", groovy: "clike", haml: "ruby", handlebars: "markup-templating", haxe: "clike", hlsl: "c", idris: "haskell", java: "clike", javadoc: ["markup", "java", "javadoclike"], jolie: "clike", jsdoc: ["javascript", "javadoclike", "typescript"], "js-extras": "javascript", json5: "json", jsonp: "json", "js-templates": "javascript", kotlin: "clike", latte: ["clike", "markup-templating", "php"], less: "css", lilypond: "scheme", liquid: "markup-templating", markdown: "markup", "markup-templating": "markup", mongodb: "javascript", n4js: "javascript", objectivec: "c", opencl: "c", parser: "markup", php: "markup-templating", phpdoc: ["php", "javadoclike"], "php-extras": "php", plsql: "sql", processing: "clike", protobuf: "clike", pug: ["markup", "javascript"], purebasic: "clike", purescript: "haskell", qsharp: "clike", qml: "javascript", qore: "clike", racket: "scheme", cshtml: ["markup", "csharp"], jsx: ["markup", "javascript"], tsx: ["jsx", "typescript"], reason: "clike", ruby: "clike", sass: "css", scss: "css", scala: "java", "shell-session": "bash", smarty: "markup-templating", solidity: "clike", soy: "markup-templating", sparql: "turtle", sqf: "clike", squirrel: "clike", stata: ["mata", "java", "python"], "t4-cs": ["t4-templating", "csharp"], "t4-vb": ["t4-templating", "vbnet"], tap: "yaml", tt2: ["clike", "markup-templating"], textile: "markup", twig: "markup-templating", typescript: "javascript", v: "clike", vala: "clike", vbnet: "basic", velocity: "markup", wiki: "markup", xeora: "markup", "xml-doc": "markup", xquery: "markup" }, t4 = { html: "markup", xml: "markup", svg: "markup", mathml: "markup", ssml: "markup", atom: "markup", rss: "markup", js: "javascript", g4: "antlr4", ino: "arduino", "arm-asm": "armasm", art: "arturo", adoc: "asciidoc", avs: "avisynth", avdl: "avro-idl", gawk: "awk", sh: "bash", shell: "bash", shortcode: "bbcode", rbnf: "bnf", oscript: "bsl", cs: "csharp", dotnet: "csharp", cfc: "cfscript", "cilk-c": "cilkc", "cilk-cpp": "cilkcpp", cilk: "cilkcpp", coffee: "coffeescript", conc: "concurnas", jinja2: "django", "dns-zone": "dns-zone-file", dockerfile: "docker", gv: "dot", eta: "ejs", xlsx: "excel-formula", xls: "excel-formula", gamemakerlanguage: "gml", po: "gettext", gni: "gn", ld: "linker-script", "go-mod": "go-module", hbs: "handlebars", mustache: "handlebars", hs: "haskell", idr: "idris", gitignore: "ignore", hgignore: "ignore", npmignore: "ignore", webmanifest: "json", kt: "kotlin", kts: "kotlin", kum: "kumir", tex: "latex", context: "latex", ly: "lilypond", emacs: "lisp", elisp: "lisp", "emacs-lisp": "lisp", md: "markdown", moon: "moonscript", n4jsd: "n4js", nani: "naniscript", objc: "objectivec", qasm: "openqasm", objectpascal: "pascal", px: "pcaxis", pcode: "peoplecode", plantuml: "plant-uml", pq: "powerquery", mscript: "powerquery", pbfasm: "purebasic", purs: "purescript", py: "python", qs: "qsharp", rkt: "racket", razor: "cshtml", rpy: "renpy", res: "rescript", robot: "robotframework", rb: "ruby", "sh-session": "shell-session", shellsession: "shell-session", smlnj: "sml", sol: "solidity", sln: "solution-file", rq: "sparql", sclang: "supercollider", t4: "t4-cs", trickle: "tremor", troy: "tremor", trig: "turtle", ts: "typescript", tsconfig: "typoscript", uscript: "unrealscript", uc: "unrealscript", url: "uri", vb: "visual-basic", vba: "visual-basic", webidl: "web-idl", mathematica: "wolfram", nb: "wolfram", wl: "wolfram", xeoracube: "xeora", yml: "yaml" }, n4 = {}, r4 = "components/", i = Prism.util.currentScript();
                if (i) {
                  var a3 = /\bplugins\/autoloader\/prism-autoloader\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i, o3 = /(^|\/)[\w-]+\.(?:min\.)?js(?:\?[^\r\n/]*)?$/i, s2 = i.getAttribute("data-autoloader-path");
                  if (null != s2)
                    r4 = s2.trim().replace(/\/?$/, "/");
                  else {
                    var l2 = i.src;
                    a3.test(l2) ? r4 = l2.replace(a3, "components/") : o3.test(l2) && (r4 = l2.replace(o3, "$1components/"));
                  }
                }
                var c5 = Prism.plugins.autoloader = { languages_path: r4, use_minified: true, loadLanguages: p4 };
                Prism.hooks.add("complete", function(e5) {
                  var t5 = e5.element, n5 = e5.language;
                  if (t5 && n5 && "none" !== n5) {
                    var r5 = function(e6) {
                      var t6 = (e6.getAttribute("data-dependencies") || "").trim();
                      if (!t6) {
                        var n6 = e6.parentElement;
                        n6 && "pre" === n6.tagName.toLowerCase() && (t6 = (n6.getAttribute("data-dependencies") || "").trim());
                      }
                      return t6 ? t6.split(/\s*,\s*/g) : [];
                    }(t5);
                    /^diff-./i.test(n5) ? (r5.push("diff"), r5.push(n5.substr(5))) : r5.push(n5), r5.every(u4) || p4(r5, function() {
                      Prism.highlightElement(t5);
                    });
                  }
                });
              }
              function u4(e5) {
                if (e5.indexOf("!") >= 0)
                  return false;
                if ((e5 = t4[e5] || e5) in Prism.languages)
                  return true;
                var r5 = n4[e5];
                return r5 && !r5.error && false === r5.loading;
              }
              function p4(r5, i2, a4) {
                "string" == typeof r5 && (r5 = [r5]);
                var o4 = r5.length, s3 = 0, l3 = false;
                function h3() {
                  l3 || ++s3 === o4 && i2 && i2(r5);
                }
                0 !== o4 ? r5.forEach(function(r6) {
                  !function(r7, i3, a5) {
                    var o5 = r7.indexOf("!") >= 0;
                    function s4() {
                      var e5 = n4[r7];
                      e5 || (e5 = n4[r7] = { callbacks: [] }), e5.callbacks.push({ success: i3, error: a5 }), !o5 && u4(r7) ? d3(r7, "success") : !o5 && e5.error ? d3(r7, "error") : !o5 && e5.loading || (e5.loading = true, e5.error = false, function(e6, t5, n5) {
                        var r8 = document.createElement("script");
                        r8.src = e6, r8.async = true, r8.onload = function() {
                          document.body.removeChild(r8), t5 && t5();
                        }, r8.onerror = function() {
                          document.body.removeChild(r8), n5 && n5();
                        }, document.body.appendChild(r8);
                      }(function(e6) {
                        return c5.languages_path + "prism-" + e6 + (c5.use_minified ? ".min" : "") + ".js";
                      }(r7), function() {
                        e5.loading = false, d3(r7, "success");
                      }, function() {
                        e5.loading = false, e5.error = true, d3(r7, "error");
                      }));
                    }
                    r7 = r7.replace("!", ""), r7 = t4[r7] || r7;
                    var l4 = e4[r7];
                    l4 && l4.length ? p4(l4, s4, a5) : s4();
                  }(r6, h3, function() {
                    l3 || (l3 = true, a4 && a4(r6));
                  });
                }) : i2 && setTimeout(i2, 0);
              }
              function d3(e5, t5) {
                if (n4[e5]) {
                  for (var r5 = n4[e5].callbacks, i2 = 0, a4 = r5.length; i2 < a4; i2++) {
                    var o4 = r5[i2][t5];
                    o4 && setTimeout(o4, 0);
                  }
                  r5.length = 0;
                }
              }
            }();
          }, 660: (e4, t4, n4) => {
            var r4 = function(e5) {
              var t5 = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, n5 = 0, r5 = {}, i = { manual: e5.Prism && e5.Prism.manual, disableWorkerMessageHandler: e5.Prism && e5.Prism.disableWorkerMessageHandler, util: { encode: function e6(t6) {
                return t6 instanceof a3 ? new a3(t6.type, e6(t6.content), t6.alias) : Array.isArray(t6) ? t6.map(e6) : t6.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
              }, type: function(e6) {
                return Object.prototype.toString.call(e6).slice(8, -1);
              }, objId: function(e6) {
                return e6.__id || Object.defineProperty(e6, "__id", { value: ++n5 }), e6.__id;
              }, clone: function e6(t6, n6) {
                var r6, a4;
                switch (n6 = n6 || {}, i.util.type(t6)) {
                  case "Object":
                    if (a4 = i.util.objId(t6), n6[a4])
                      return n6[a4];
                    for (var o4 in r6 = {}, n6[a4] = r6, t6)
                      t6.hasOwnProperty(o4) && (r6[o4] = e6(t6[o4], n6));
                    return r6;
                  case "Array":
                    return a4 = i.util.objId(t6), n6[a4] ? n6[a4] : (r6 = [], n6[a4] = r6, t6.forEach(function(t7, i2) {
                      r6[i2] = e6(t7, n6);
                    }), r6);
                  default:
                    return t6;
                }
              }, getLanguage: function(e6) {
                for (; e6; ) {
                  var n6 = t5.exec(e6.className);
                  if (n6)
                    return n6[1].toLowerCase();
                  e6 = e6.parentElement;
                }
                return "none";
              }, setLanguage: function(e6, n6) {
                e6.className = e6.className.replace(RegExp(t5, "gi"), ""), e6.classList.add("language-" + n6);
              }, currentScript: function() {
                if ("undefined" == typeof document)
                  return null;
                if ("currentScript" in document)
                  return document.currentScript;
                try {
                  throw new Error();
                } catch (r6) {
                  var e6 = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(r6.stack) || [])[1];
                  if (e6) {
                    var t6 = document.getElementsByTagName("script");
                    for (var n6 in t6)
                      if (t6[n6].src == e6)
                        return t6[n6];
                  }
                  return null;
                }
              }, isActive: function(e6, t6, n6) {
                for (var r6 = "no-" + t6; e6; ) {
                  var i2 = e6.classList;
                  if (i2.contains(t6))
                    return true;
                  if (i2.contains(r6))
                    return false;
                  e6 = e6.parentElement;
                }
                return !!n6;
              } }, languages: { plain: r5, plaintext: r5, text: r5, txt: r5, extend: function(e6, t6) {
                var n6 = i.util.clone(i.languages[e6]);
                for (var r6 in t6)
                  n6[r6] = t6[r6];
                return n6;
              }, insertBefore: function(e6, t6, n6, r6) {
                var a4 = (r6 = r6 || i.languages)[e6], o4 = {};
                for (var s3 in a4)
                  if (a4.hasOwnProperty(s3)) {
                    if (s3 == t6)
                      for (var l3 in n6)
                        n6.hasOwnProperty(l3) && (o4[l3] = n6[l3]);
                    n6.hasOwnProperty(s3) || (o4[s3] = a4[s3]);
                  }
                var c6 = r6[e6];
                return r6[e6] = o4, i.languages.DFS(i.languages, function(t7, n7) {
                  n7 === c6 && t7 != e6 && (this[t7] = o4);
                }), o4;
              }, DFS: function e6(t6, n6, r6, a4) {
                a4 = a4 || {};
                var o4 = i.util.objId;
                for (var s3 in t6)
                  if (t6.hasOwnProperty(s3)) {
                    n6.call(t6, s3, t6[s3], r6 || s3);
                    var l3 = t6[s3], c6 = i.util.type(l3);
                    "Object" !== c6 || a4[o4(l3)] ? "Array" !== c6 || a4[o4(l3)] || (a4[o4(l3)] = true, e6(l3, n6, s3, a4)) : (a4[o4(l3)] = true, e6(l3, n6, null, a4));
                  }
              } }, plugins: {}, highlightAll: function(e6, t6) {
                i.highlightAllUnder(document, e6, t6);
              }, highlightAllUnder: function(e6, t6, n6) {
                var r6 = { callback: n6, container: e6, selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code' };
                i.hooks.run("before-highlightall", r6), r6.elements = Array.prototype.slice.apply(r6.container.querySelectorAll(r6.selector)), i.hooks.run("before-all-elements-highlight", r6);
                for (var a4, o4 = 0; a4 = r6.elements[o4++]; )
                  i.highlightElement(a4, true === t6, r6.callback);
              }, highlightElement: function(t6, n6, r6) {
                var a4 = i.util.getLanguage(t6), o4 = i.languages[a4];
                i.util.setLanguage(t6, a4);
                var s3 = t6.parentElement;
                s3 && "pre" === s3.nodeName.toLowerCase() && i.util.setLanguage(s3, a4);
                var l3 = { element: t6, language: a4, grammar: o4, code: t6.textContent };
                function c6(e6) {
                  l3.highlightedCode = e6, i.hooks.run("before-insert", l3), l3.element.innerHTML = l3.highlightedCode, i.hooks.run("after-highlight", l3), i.hooks.run("complete", l3), r6 && r6.call(l3.element);
                }
                if (i.hooks.run("before-sanity-check", l3), (s3 = l3.element.parentElement) && "pre" === s3.nodeName.toLowerCase() && !s3.hasAttribute("tabindex") && s3.setAttribute("tabindex", "0"), !l3.code)
                  return i.hooks.run("complete", l3), void (r6 && r6.call(l3.element));
                if (i.hooks.run("before-highlight", l3), l3.grammar) {
                  if (n6 && e5.Worker) {
                    var u5 = new Worker(i.filename);
                    u5.onmessage = function(e6) {
                      c6(e6.data);
                    }, u5.postMessage(JSON.stringify({ language: l3.language, code: l3.code, immediateClose: true }));
                  } else
                    c6(i.highlight(l3.code, l3.grammar, l3.language));
                } else
                  c6(i.util.encode(l3.code));
              }, highlight: function(e6, t6, n6) {
                var r6 = { code: e6, grammar: t6, language: n6 };
                if (i.hooks.run("before-tokenize", r6), !r6.grammar)
                  throw new Error('The language "' + r6.language + '" has no grammar.');
                return r6.tokens = i.tokenize(r6.code, r6.grammar), i.hooks.run("after-tokenize", r6), a3.stringify(i.util.encode(r6.tokens), r6.language);
              }, tokenize: function(e6, t6) {
                var n6 = t6.rest;
                if (n6) {
                  for (var r6 in n6)
                    t6[r6] = n6[r6];
                  delete t6.rest;
                }
                var i2 = new l2();
                return c5(i2, i2.head, e6), s2(e6, i2, t6, i2.head, 0), function(e7) {
                  for (var t7 = [], n7 = e7.head.next; n7 !== e7.tail; )
                    t7.push(n7.value), n7 = n7.next;
                  return t7;
                }(i2);
              }, hooks: { all: {}, add: function(e6, t6) {
                var n6 = i.hooks.all;
                n6[e6] = n6[e6] || [], n6[e6].push(t6);
              }, run: function(e6, t6) {
                var n6 = i.hooks.all[e6];
                if (n6 && n6.length)
                  for (var r6, a4 = 0; r6 = n6[a4++]; )
                    r6(t6);
              } }, Token: a3 };
              function a3(e6, t6, n6, r6) {
                this.type = e6, this.content = t6, this.alias = n6, this.length = 0 | (r6 || "").length;
              }
              function o3(e6, t6, n6, r6) {
                e6.lastIndex = t6;
                var i2 = e6.exec(n6);
                if (i2 && r6 && i2[1]) {
                  var a4 = i2[1].length;
                  i2.index += a4, i2[0] = i2[0].slice(a4);
                }
                return i2;
              }
              function s2(e6, t6, n6, r6, l3, p5) {
                for (var d4 in n6)
                  if (n6.hasOwnProperty(d4) && n6[d4]) {
                    var h4 = n6[d4];
                    h4 = Array.isArray(h4) ? h4 : [h4];
                    for (var g6 = 0; g6 < h4.length; ++g6) {
                      if (p5 && p5.cause == d4 + "," + g6)
                        return;
                      var m4 = h4[g6], f4 = m4.inside, w4 = !!m4.lookbehind, v4 = !!m4.greedy, b4 = m4.alias;
                      if (v4 && !m4.pattern.global) {
                        var k4 = m4.pattern.toString().match(/[imsuy]*$/)[0];
                        m4.pattern = RegExp(m4.pattern.source, k4 + "g");
                      }
                      for (var y4 = m4.pattern || m4, x3 = r6.next, C5 = l3; x3 !== t6.tail && !(p5 && C5 >= p5.reach); C5 += x3.value.length, x3 = x3.next) {
                        var j3 = x3.value;
                        if (t6.length > e6.length)
                          return;
                        if (!(j3 instanceof a3)) {
                          var L4, S5 = 1;
                          if (v4) {
                            if (!(L4 = o3(y4, C5, e6, w4)) || L4.index >= e6.length)
                              break;
                            var _3 = L4.index, T3 = L4.index + L4[0].length, A4 = C5;
                            for (A4 += x3.value.length; _3 >= A4; )
                              A4 += (x3 = x3.next).value.length;
                            if (C5 = A4 -= x3.value.length, x3.value instanceof a3)
                              continue;
                            for (var q2 = x3; q2 !== t6.tail && (A4 < T3 || "string" == typeof q2.value); q2 = q2.next)
                              S5++, A4 += q2.value.length;
                            S5--, j3 = e6.slice(C5, A4), L4.index -= C5;
                          } else if (!(L4 = o3(y4, 0, j3, w4)))
                            continue;
                          _3 = L4.index;
                          var E4 = L4[0], D3 = j3.slice(0, _3), R4 = j3.slice(_3 + E4.length), F3 = C5 + j3.length;
                          p5 && F3 > p5.reach && (p5.reach = F3);
                          var M3 = x3.prev;
                          if (D3 && (M3 = c5(t6, M3, D3), C5 += D3.length), u4(t6, M3, S5), x3 = c5(t6, M3, new a3(d4, f4 ? i.tokenize(E4, f4) : E4, b4, E4)), R4 && c5(t6, x3, R4), S5 > 1) {
                            var G3 = { cause: d4 + "," + g6, reach: F3 };
                            s2(e6, t6, n6, x3.prev, C5, G3), p5 && G3.reach > p5.reach && (p5.reach = G3.reach);
                          }
                        }
                      }
                    }
                  }
              }
              function l2() {
                var e6 = { value: null, prev: null, next: null }, t6 = { value: null, prev: e6, next: null };
                e6.next = t6, this.head = e6, this.tail = t6, this.length = 0;
              }
              function c5(e6, t6, n6) {
                var r6 = t6.next, i2 = { value: n6, prev: t6, next: r6 };
                return t6.next = i2, r6.prev = i2, e6.length++, i2;
              }
              function u4(e6, t6, n6) {
                for (var r6 = t6.next, i2 = 0; i2 < n6 && r6 !== e6.tail; i2++)
                  r6 = r6.next;
                t6.next = r6, r6.prev = t6, e6.length -= i2;
              }
              if (e5.Prism = i, a3.stringify = function e6(t6, n6) {
                if ("string" == typeof t6)
                  return t6;
                if (Array.isArray(t6)) {
                  var r6 = "";
                  return t6.forEach(function(t7) {
                    r6 += e6(t7, n6);
                  }), r6;
                }
                var a4 = { type: t6.type, content: e6(t6.content, n6), tag: "span", classes: ["token", t6.type], attributes: {}, language: n6 }, o4 = t6.alias;
                o4 && (Array.isArray(o4) ? Array.prototype.push.apply(a4.classes, o4) : a4.classes.push(o4)), i.hooks.run("wrap", a4);
                var s3 = "";
                for (var l3 in a4.attributes)
                  s3 += " " + l3 + '="' + (a4.attributes[l3] || "").replace(/"/g, "&quot;") + '"';
                return "<" + a4.tag + ' class="' + a4.classes.join(" ") + '"' + s3 + ">" + a4.content + "</" + a4.tag + ">";
              }, !e5.document)
                return e5.addEventListener ? (i.disableWorkerMessageHandler || e5.addEventListener("message", function(t6) {
                  var n6 = JSON.parse(t6.data), r6 = n6.language, a4 = n6.code, o4 = n6.immediateClose;
                  e5.postMessage(i.highlight(a4, i.languages[r6], r6)), o4 && e5.close();
                }, false), i) : i;
              var p4 = i.util.currentScript();
              function d3() {
                i.manual || i.highlightAll();
              }
              if (p4 && (i.filename = p4.src, p4.hasAttribute("data-manual") && (i.manual = true)), !i.manual) {
                var h3 = document.readyState;
                "loading" === h3 || "interactive" === h3 && p4 && p4.defer ? document.addEventListener("DOMContentLoaded", d3) : window.requestAnimationFrame ? window.requestAnimationFrame(d3) : window.setTimeout(d3, 16);
              }
              return i;
            }("undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {});
            e4.exports && (e4.exports = r4), void 0 !== n4.g && (n4.g.Prism = r4), r4.languages.markup = { comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: true }, prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: true }, doctype: { pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i, greedy: true, inside: { "internal-subset": { pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/, lookbehind: true, greedy: true, inside: null }, string: { pattern: /"[^"]*"|'[^']*'/, greedy: true }, punctuation: /^<!|>$|[[\]]/, "doctype-tag": /^DOCTYPE/i, name: /[^\s<>'"]+/ } }, cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: true }, tag: { pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/, greedy: true, inside: { tag: { pattern: /^<\/?[^\s>\/]+/, inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ } }, "special-attr": [], "attr-value": { pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/, inside: { punctuation: [{ pattern: /^=/, alias: "attr-equals" }, { pattern: /^(\s*)["']|["']$/, lookbehind: true }] } }, punctuation: /\/?>/, "attr-name": { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } } } }, entity: [{ pattern: /&[\da-z]{1,8};/i, alias: "named-entity" }, /&#x?[\da-f]{1,8};/i] }, r4.languages.markup.tag.inside["attr-value"].inside.entity = r4.languages.markup.entity, r4.languages.markup.doctype.inside["internal-subset"].inside = r4.languages.markup, r4.hooks.add("wrap", function(e5) {
              "entity" === e5.type && (e5.attributes.title = e5.content.replace(/&amp;/, "&"));
            }), Object.defineProperty(r4.languages.markup.tag, "addInlined", { value: function(e5, t5) {
              var n5 = {};
              n5["language-" + t5] = { pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i, lookbehind: true, inside: r4.languages[t5] }, n5.cdata = /^<!\[CDATA\[|\]\]>$/i;
              var i = { "included-cdata": { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: n5 } };
              i["language-" + t5] = { pattern: /[\s\S]+/, inside: r4.languages[t5] };
              var a3 = {};
              a3[e5] = { pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
                return e5;
              }), "i"), lookbehind: true, greedy: true, inside: i }, r4.languages.insertBefore("markup", "cdata", a3);
            } }), Object.defineProperty(r4.languages.markup.tag, "addAttribute", { value: function(e5, t5) {
              r4.languages.markup.tag.inside["special-attr"].push({ pattern: RegExp(/(^|["'\s])/.source + "(?:" + e5 + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, "i"), lookbehind: true, inside: { "attr-name": /^[^\s=]+/, "attr-value": { pattern: /=[\s\S]+/, inside: { value: { pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/, lookbehind: true, alias: [t5, "language-" + t5], inside: r4.languages[t5] }, punctuation: [{ pattern: /^=/, alias: "attr-equals" }, /"|'/] } } } });
            } }), r4.languages.html = r4.languages.markup, r4.languages.mathml = r4.languages.markup, r4.languages.svg = r4.languages.markup, r4.languages.xml = r4.languages.extend("markup", {}), r4.languages.ssml = r4.languages.xml, r4.languages.atom = r4.languages.xml, r4.languages.rss = r4.languages.xml, function(e5) {
              var t5 = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
              e5.languages.css = { comment: /\/\*[\s\S]*?\*\//, atrule: { pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + t5.source + ")*?" + /(?:;|(?=\s*\{))/.source), inside: { rule: /^@[\w-]+/, "selector-function-argument": { pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/, lookbehind: true, alias: "selector" }, keyword: { pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/, lookbehind: true } } }, url: { pattern: RegExp("\\burl\\((?:" + t5.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"), greedy: true, inside: { function: /^url/i, punctuation: /^\(|\)$/, string: { pattern: RegExp("^" + t5.source + "$"), alias: "url" } } }, selector: { pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + t5.source + ")*(?=\\s*\\{)"), lookbehind: true }, string: { pattern: t5, greedy: true }, property: { pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i, lookbehind: true }, important: /!important\b/i, function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: true }, punctuation: /[(){};:,]/ }, e5.languages.css.atrule.inside.rest = e5.languages.css;
              var n5 = e5.languages.markup;
              n5 && (n5.tag.addInlined("style", "css"), n5.tag.addAttribute("style", "css"));
            }(r4), r4.languages.clike = { comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true, greedy: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }], string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true }, "class-name": { pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i, lookbehind: true, inside: { punctuation: /[.\\]/ } }, keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/, boolean: /\b(?:false|true)\b/, function: /\b\w+(?=\()/, number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i, operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/, punctuation: /[{}[\];(),.:]/ }, r4.languages.javascript = r4.languages.extend("clike", { "class-name": [r4.languages.clike["class-name"], { pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/, lookbehind: true }], keyword: [{ pattern: /((?:^|\})\s*)catch\b/, lookbehind: true }, { pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/, lookbehind: true }], function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/, number: { pattern: RegExp(/(^|[^\w$])/.source + "(?:" + /NaN|Infinity/.source + "|" + /0[bB][01]+(?:_[01]+)*n?/.source + "|" + /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + /\d+(?:_\d+)*n/.source + "|" + /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source + ")" + /(?![\w$])/.source), lookbehind: true }, operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/ }), r4.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/, r4.languages.insertBefore("javascript", "keyword", { regex: { pattern: RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source), lookbehind: true, greedy: true, inside: { "regex-source": { pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/, lookbehind: true, alias: "language-regex", inside: r4.languages.regex }, "regex-delimiter": /^\/|\/$/, "regex-flags": /^[a-z]+$/ } }, "function-variable": { pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/, alias: "function" }, parameter: [{ pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/, lookbehind: true, inside: r4.languages.javascript }, { pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i, lookbehind: true, inside: r4.languages.javascript }, { pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/, lookbehind: true, inside: r4.languages.javascript }, { pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/, lookbehind: true, inside: r4.languages.javascript }], constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/ }), r4.languages.insertBefore("javascript", "string", { hashbang: { pattern: /^#!.*/, greedy: true, alias: "comment" }, "template-string": { pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/, greedy: true, inside: { "template-punctuation": { pattern: /^`|`$/, alias: "string" }, interpolation: { pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/, lookbehind: true, inside: { "interpolation-punctuation": { pattern: /^\$\{|\}$/, alias: "punctuation" }, rest: r4.languages.javascript } }, string: /[\s\S]+/ } }, "string-property": { pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m, lookbehind: true, greedy: true, alias: "property" } }), r4.languages.insertBefore("javascript", "operator", { "literal-property": { pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m, lookbehind: true, alias: "property" } }), r4.languages.markup && (r4.languages.markup.tag.addInlined("script", "javascript"), r4.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, "javascript")), r4.languages.js = r4.languages.javascript, function() {
              if (void 0 !== r4 && "undefined" != typeof document) {
                Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
                var e5 = { js: "javascript", py: "python", rb: "ruby", ps1: "powershell", psm1: "powershell", sh: "bash", bat: "batch", h: "c", tex: "latex" }, t5 = "data-src-status", n5 = "loading", i = "loaded", a3 = "pre[data-src]:not([" + t5 + '="' + i + '"]):not([' + t5 + '="' + n5 + '"])';
                r4.hooks.add("before-highlightall", function(e6) {
                  e6.selector += ", " + a3;
                }), r4.hooks.add("before-sanity-check", function(o4) {
                  var s2 = o4.element;
                  if (s2.matches(a3)) {
                    o4.code = "", s2.setAttribute(t5, n5);
                    var l2 = s2.appendChild(document.createElement("CODE"));
                    l2.textContent = "Loading\u2026";
                    var c5 = s2.getAttribute("data-src"), u4 = o4.language;
                    if ("none" === u4) {
                      var p4 = (/\.(\w+)$/.exec(c5) || [, "none"])[1];
                      u4 = e5[p4] || p4;
                    }
                    r4.util.setLanguage(l2, u4), r4.util.setLanguage(s2, u4);
                    var d3 = r4.plugins.autoloader;
                    d3 && d3.loadLanguages(u4), function(e6, n6, a4) {
                      var o5 = new XMLHttpRequest();
                      o5.open("GET", e6, true), o5.onreadystatechange = function() {
                        4 == o5.readyState && (o5.status < 400 && o5.responseText ? function(e7) {
                          s2.setAttribute(t5, i);
                          var n7 = function(e8) {
                            var t6 = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(e8 || "");
                            if (t6) {
                              var n8 = Number(t6[1]), r5 = t6[2], i2 = t6[3];
                              return r5 ? i2 ? [n8, Number(i2)] : [n8, void 0] : [n8, n8];
                            }
                          }(s2.getAttribute("data-range"));
                          if (n7) {
                            var a5 = e7.split(/\r\n?|\n/g), o6 = n7[0], c6 = null == n7[1] ? a5.length : n7[1];
                            o6 < 0 && (o6 += a5.length), o6 = Math.max(0, Math.min(o6 - 1, a5.length)), c6 < 0 && (c6 += a5.length), c6 = Math.max(0, Math.min(c6, a5.length)), e7 = a5.slice(o6, c6).join("\n"), s2.hasAttribute("data-start") || s2.setAttribute("data-start", String(o6 + 1));
                          }
                          l2.textContent = e7, r4.highlightElement(l2);
                        }(o5.responseText) : o5.status >= 400 ? a4("\u2716 Error " + o5.status + " while fetching file: " + o5.statusText) : a4("\u2716 Error: File does not exist or is empty"));
                      }, o5.send(null);
                    }(c5, 0, function(e6) {
                      s2.setAttribute(t5, "failed"), l2.textContent = e6;
                    });
                  }
                }), r4.plugins.fileHighlight = { highlight: function(e6) {
                  for (var t6, n6 = (e6 || document).querySelectorAll(a3), i2 = 0; t6 = n6[i2++]; )
                    r4.highlightElement(t6);
                } };
                var o3 = false;
                r4.fileHighlight = function() {
                  o3 || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), o3 = true), r4.plugins.fileHighlight.highlight.apply(this, arguments);
                };
              }
            }();
          } }, t3 = {};
          function n3(r4) {
            var i = t3[r4];
            if (void 0 !== i)
              return i.exports;
            var a3 = t3[r4] = { exports: {} };
            return e3[r4](a3, a3.exports, n3), a3.exports;
          }
          n3.n = (e4) => {
            var t4 = e4 && e4.__esModule ? () => e4.default : () => e4;
            return n3.d(t4, { a: t4 }), t4;
          }, n3.d = (e4, t4) => {
            for (var r4 in t4)
              n3.o(t4, r4) && !n3.o(e4, r4) && Object.defineProperty(e4, r4, { enumerable: true, get: t4[r4] });
          }, n3.g = function() {
            if ("object" == typeof globalThis)
              return globalThis;
            try {
              return this || new Function("return this")();
            } catch (e4) {
              if ("object" == typeof window)
                return window;
            }
          }(), n3.o = (e4, t4) => Object.prototype.hasOwnProperty.call(e4, t4);
          var r3 = {};
          return (() => {
            "use strict";
            n3.d(r3, { default: () => m4 });
            const e4 = "#fff", t4 = "20px", i = `
.codecup {
  background: ${e4};
  color: #4f559c;
}

.codecup .token.punctuation {
  color: #4a4a4a;
}

.codecup .token.keyword {
  color: #8500ff;
}

.codecup .token.operator {
  color: #ff5598;
}

.codecup .token.string {
  color: #41ad8f;
}

.codecup .token.comment {
  color: #9badb7;
}

.codecup .token.function {
  color: #8500ff;
}

.codecup .token.boolean {
  color: #8500ff;
}

.codecup .token.number {
  color: #8500ff;
}

.codecup .token.selector {
  color: #8500ff;
}

.codecup .token.property {
  color: #8500ff;
}

.codecup .token.tag {
  color: #8500ff;
}

.codecup .token.attr-value {
  color: #8500ff;
}
`, a3 = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace';
            var o3, s2;
            const l2 = "40px", c5 = `
  .codecup {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .codecup, .codecup * {
    box-sizing: border-box;
  }

  .codecup__pre {
    pointer-events: none;
    z-index: 3;
    overflow: hidden;
  }

  .codecup__textarea {
    background: none;
    border: none;
    color: ${o3 = "caret-color", ("undefined" != typeof CSS ? CSS.supports(o3, "#000") : "undefined" != typeof document && (s2 = (s2 = o3).split("-").filter((e5) => !!e5).map((e5) => e5[0].toUpperCase() + e5.substr(1)).join(""))[0].toLowerCase() + s2.substr(1) in document.body.style) ? e4 : "#ccc"};
    z-index: 1;
    resize: none;
    font-family: ${a3};
    -webkit-appearance: pre;
    caret-color: #111;
    z-index: 2;
    width: 100%;
    height: 100%;
  }

  .codecup--has-line-numbers .codecup__textarea {
    width: calc(100% - ${l2});
  }

  .codecup__code {
    display: block;
    font-family: ${a3};
    overflow: hidden;
  }

  .codecup__flatten {
    padding: 10px;
    font-size: 13px;
    line-height: ${t4};
    white-space: pre;
    position: absolute;
    top: 0;
    left: 0;
    overflow: auto;
    margin: 0 !important;
    outline: none;
    text-align: left;
  }

  .codecup--has-line-numbers .codecup__flatten {
    width: calc(100% - ${l2});
    left: ${l2};
  }

  .codecup__line-highlight {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: ${t4};
    background: rgba(0,0,0,0.1);
    z-index: 1;
  }

  .codecup__lines {
    padding: 10px 4px;
    font-size: 12px;
    line-height: ${t4};
    font-family: 'Cousine', monospace;
    position: absolute;
    left: 0;
    top: 0;
    width: ${l2};
    height: 100%;
    text-align: right;
    color: #999;
    z-index: 2;
  }

  .codecup__lines__line {
    display: block;
  }

  .codecup.codecup--has-line-numbers {
    padding-left: ${l2};
  }

  .codecup.codecup--has-line-numbers:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: ${l2};
    height: 100%;
    // background: #eee;
    background: #dcdfe6;
    z-index: 1;
  }

  .codecup__copyButton{
    position: absolute;
    right: 5px;
    top: 5px;
    z-index: 3;
    background: #EAEEFB;
    border: none;
    color: #999;
    cursor: pointer;
    outline: none;
    width: 22px;
    height: 22px;
    border-radius: 4px;
  }

  .codecup__copyMessage{
    position: absolute;
    right: 32px;
    top: 5px;
    z-index: 3;
    background: #EAEEFB;
    border: none;
    color: #999;
    cursor: pointer;
    outline: none;
    width: 55px;
    height: 22px;
    line-height: 22px;
    border-radius: 4px;
    font-size: 12px;
    text-align: center;
    font-family: 'Cousine', monospace;
  }

`;
            function u4(e5, t5, n4) {
              const r4 = t5 || "codecup-style", i2 = n4 || document.head;
              if (!e5)
                return false;
              if (document.getElementById(r4))
                return true;
              const a4 = document.createElement("style");
              return a4.innerHTML = e5, a4.id = r4, i2.appendChild(a4), true;
            }
            const p4 = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "/": "&#x2F;", "`": "&#x60;", "=": "&#x3D;" };
            function d3(e5) {
              return String(e5).replace(/[&<>"'`=/]/g, function(e6) {
                return p4[e6];
              });
            }
            var h3 = n3(660), g6 = n3.n(h3);
            n3(475), g6().plugins.autoloader.languages_path = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/";
            class m4 {
              constructor(e5, t5) {
                if (!e5)
                  throw Error("codecup expects a parameter which is Element or a String selector");
                if (!t5)
                  throw Error("codecup expects an object containing options as second parameter");
                if (e5.nodeType)
                  this.editorRoot = e5;
                else {
                  const t6 = document.querySelector(e5);
                  t6 && (this.editorRoot = t6);
                }
                this.opts = t5, this.events = {}, this.startEditor();
              }
              startEditor() {
                if (!u4(c5, null, this.opts.styleParent))
                  throw Error("Failed to inject codecup CSS.");
                this.createWrapper(), this.createTextarea(), this.createPre(), this.createCode(), this.runOptions(), this.listenTextarea(), this.populateDefault(), this.updateCode(this.code);
              }
              createWrapper() {
                this.code = this.editorRoot.innerHTML, this.editorRoot.innerHTML = "", this.elWrapper = this.createElement("div", this.editorRoot), this.elWrapper.classList.add("codecup");
              }
              createTextarea() {
                this.elTextarea = this.createElement("textarea", this.elWrapper), this.elTextarea.classList.add("codecup__textarea", "codecup__flatten");
              }
              createPre() {
                this.elPre = this.createElement("pre", this.elWrapper), this.elPre.classList.add("codecup__pre", "codecup__flatten");
              }
              createCode() {
                this.elCode = this.createElement("code", this.elPre), this.elCode.classList.add("codecup__code", `language-${this.opts.language || "html"}`);
              }
              createLineNumbers() {
                this.elLineNumbers = this.createElement("div", this.elWrapper), this.elLineNumbers.classList.add("codecup__lines"), this.elWrapper.classList.add("codecup--has-line-numbers"), this.setLineNumber();
              }
              createCopyButton() {
                this.elCopyButtonMessage = this.createElement("div", this.elWrapper), this.elCopyButtonMessage.classList.add("codecup__copyMessage"), this.elCopyButtonMessage.innerHTML = "Copied!", this.elCopyButtonMessage.style.display = "none", this.elCopyButton = this.createElement("div", this.elWrapper), this.elCopyButton.classList.add("codecup__copyButton"), this.elCopyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polygon points="88 40 88 88 168 88 168 168 216 168 216 40 88 40" opacity="0.2"/><polyline points="168 168 216 168 216 40 88 40 88 88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><rect x="40" y="88" width="128" height="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>', this.elCopyButton.addEventListener("click", () => {
                  navigator.clipboard.writeText(this.code).then(() => {
                    this.elCopyButtonMessage.style.display = "block", setTimeout(() => {
                      this.elCopyButtonMessage.style.display = "none";
                    }, 1e3);
                  });
                });
              }
              destroyLineNumbers() {
                this.elWrapper.classList.remove("codecup--has-line-numbers"), this.elLineNumbers.remove();
              }
              createElement(e5, t5) {
                const n4 = document.createElement(e5);
                return t5.appendChild(n4), n4;
              }
              runOptions() {
                this.opts.rtl = this.opts.rtl || false, this.opts.tabSize = this.opts.tabSize || 2, this.opts.enableAutocorrect = this.opts.enableAutocorrect || false, this.opts.lineNumbers = this.opts.lineNumbers || false, this.opts.defaultTheme = false !== this.opts.defaultTheme, this.opts.areaId = this.opts.areaId || null, this.opts.ariaLabelledby = this.opts.ariaLabelledby || null, this.opts.readonly = this.opts.readonly || false, this.opts.copyButton = this.opts.copyButton || false, "boolean" != typeof this.opts.handleTabs && (this.opts.handleTabs = true), "boolean" != typeof this.opts.handleSelfClosingCharacters && (this.opts.handleSelfClosingCharacters = true), "boolean" != typeof this.opts.handleNewLineIndentation && (this.opts.handleNewLineIndentation = true), true === this.opts.rtl && (this.elTextarea.setAttribute("dir", "rtl"), this.elPre.setAttribute("dir", "rtl")), false === this.opts.enableAutocorrect && (this.elTextarea.setAttribute("spellcheck", "false"), this.elTextarea.setAttribute("autocapitalize", "off"), this.elTextarea.setAttribute("autocomplete", "off"), this.elTextarea.setAttribute("autocorrect", "off")), this.opts.lineNumbers && this.createLineNumbers(), this.opts.defaultTheme && u4(i, "theme-default", this.opts.styleParent), this.opts.areaId && this.elTextarea.setAttribute("id", this.opts.areaId), this.opts.ariaLabelledby && this.elTextarea.setAttribute("aria-labelledby", this.opts.ariaLabelledby), this.opts.readonly && this.enableReadonlyMode(), this.opts.copyButton && this.createCopyButton();
              }
              updateLineNumbersCount() {
                let e5 = "";
                for (let t5 = 1; t5 <= this.lineNumber; t5++)
                  e5 += `<span class="codecup__lines__line">${t5}</span>`;
                this.elLineNumbers.innerHTML = e5;
              }
              listenTextarea() {
                this.elTextarea.addEventListener("input", this.events._input = (e5) => {
                  this.opts.readonly || (this.code = e5.target.value, this.elCode.innerHTML = d3(e5.target.value), this.highlight(), setTimeout(() => {
                    this.runUpdate(), this.setLineNumber();
                  }, 1));
                }), this.elTextarea.addEventListener("keydown", this.events._keydown = (e5) => {
                  this.opts.readonly || (this.handleTabs(e5), this.handleSelfClosingCharacters(e5), this.handleNewLineIndentation(e5));
                }), this.elTextarea.addEventListener("scroll", this.events._scroll = (e5) => {
                  this.elPre.style.transform = `translate3d(-${e5.target.scrollLeft}px, -${e5.target.scrollTop}px, 0)`, this.elLineNumbers && (this.elLineNumbers.style.transform = `translate3d(0, -${e5.target.scrollTop}px, 0)`);
                });
              }
              handleTabs(e5) {
                if (this.opts.handleTabs) {
                  if (9 !== e5.keyCode)
                    return;
                  e5.preventDefault();
                  var t5 = this.elTextarea, n4 = t5.selectionDirection, r4 = t5.selectionStart, i2 = t5.selectionEnd, a4 = t5.value, o4 = a4.substr(0, r4), s3 = a4.substring(r4, i2), l3 = a4.substring(i2);
                  const h4 = " ".repeat(this.opts.tabSize);
                  if (r4 !== i2 && s3.length >= h4.length) {
                    var c6 = r4 - o4.split("\n").pop().length, u5 = h4.length, p5 = h4.length;
                    e5.shiftKey ? (a4.substr(c6, h4.length) === h4 ? (u5 = -u5, c6 > r4 ? (s3 = s3.substring(0, c6) + s3.substring(c6 + h4.length), p5 = 0) : c6 === r4 ? (u5 = 0, p5 = 0, s3 = s3.substring(h4.length)) : (p5 = -p5, o4 = o4.substring(0, c6) + o4.substring(c6 + h4.length))) : (u5 = 0, p5 = 0), s3 = s3.replace(new RegExp("\n" + h4.split("").join("\\"), "g"), "\n")) : (o4 = o4.substr(0, c6) + h4 + o4.substring(c6, r4), s3 = s3.replace(/\n/g, "\n" + h4)), t5.value = o4 + s3 + l3, t5.selectionStart = r4 + u5, t5.selectionEnd = r4 + s3.length + p5, t5.selectionDirection = n4;
                  } else
                    t5.value = o4 + h4 + l3, t5.selectionStart = r4 + h4.length, t5.selectionEnd = r4 + h4.length;
                  var d4 = t5.value;
                  this.updateCode(d4), this.elTextarea.selectionEnd = i2 + this.opts.tabSize;
                }
              }
              handleSelfClosingCharacters(e5) {
                if (!this.opts.handleSelfClosingCharacters)
                  return;
                const t5 = e5.key;
                if (["(", "[", "{", "<", "'", '"'].includes(t5) || [")", "]", "}", ">", "'", '"'].includes(t5))
                  switch (t5) {
                    case "(":
                    case ")":
                    case "[":
                    case "]":
                    case "{":
                    case "}":
                    case "<":
                    case ">":
                    case "'":
                    case '"':
                      this.closeCharacter(t5);
                  }
              }
              setLineNumber() {
                this.lineNumber = this.code.split("\n").length, this.opts.lineNumbers && this.updateLineNumbersCount();
              }
              handleNewLineIndentation(e5) {
                if (this.opts.handleNewLineIndentation && 13 === e5.keyCode) {
                  e5.preventDefault();
                  var t5 = this.elTextarea, n4 = t5.selectionStart, r4 = t5.selectionEnd, i2 = t5.value, a4 = i2.substr(0, n4), o4 = i2.substring(r4), s3 = i2.lastIndexOf("\n", n4 - 1), l3 = s3 + i2.slice(s3 + 1).search(/[^ ]|$/), c6 = l3 > s3 ? l3 - s3 : 0, u5 = a4 + "\n" + " ".repeat(c6) + o4;
                  t5.value = u5, t5.selectionStart = n4 + c6 + 1, t5.selectionEnd = n4 + c6 + 1, this.updateCode(t5.value);
                }
              }
              closeCharacter(e5) {
                const t5 = this.elTextarea.selectionStart, n4 = this.elTextarea.selectionEnd;
                if (this.skipCloseChar(e5)) {
                  const r4 = this.code.substr(n4, 1) === e5, i2 = r4 ? n4 + 1 : n4, a4 = !r4 && ["'", '"'].includes(e5) ? e5 : "", o4 = `${this.code.substring(0, t5)}${a4}${this.code.substring(i2)}`;
                  this.updateCode(o4), this.elTextarea.selectionEnd = ++this.elTextarea.selectionStart;
                } else {
                  let r4 = e5;
                  switch (e5) {
                    case "(":
                      r4 = String.fromCharCode(e5.charCodeAt() + 1);
                      break;
                    case "<":
                    case "{":
                    case "[":
                      r4 = String.fromCharCode(e5.charCodeAt() + 2);
                  }
                  const i2 = this.code.substring(t5, n4), a4 = `${this.code.substring(0, t5)}${i2}${r4}${this.code.substring(n4)}`;
                  this.updateCode(a4);
                }
                this.elTextarea.selectionEnd = t5;
              }
              skipCloseChar(e5) {
                const t5 = this.elTextarea.selectionStart, n4 = this.elTextarea.selectionEnd, r4 = Math.abs(n4 - t5) > 0;
                return [")", "}", "]", ">"].includes(e5) || ["'", '"'].includes(e5) && !r4;
              }
              updateCode(e5) {
                this.code = e5, this.elTextarea.value = e5, this.elCode.innerHTML = d3(e5), this.highlight(), this.setLineNumber(), setTimeout(this.runUpdate.bind(this), 1);
              }
              updateLanguage(e5) {
                const t5 = this.opts.language;
                this.elCode.classList.remove(`language-${t5}`), this.elCode.classList.add(`language-${e5}`), this.opts.language = e5, this.highlight();
              }
              populateDefault() {
                this.updateCode(this.code);
              }
              highlight() {
                g6().highlightElement(this.elCode, false);
              }
              onUpdate(e5) {
                if (e5 && "[object Function]" !== {}.toString.call(e5))
                  throw Error("codecup expects callback of type Function");
                this.updateCallBack = e5;
              }
              getCode() {
                return this.code;
              }
              runUpdate() {
                this.updateCallBack && this.updateCallBack(this.code);
              }
              enableReadonlyMode() {
                this.elTextarea.setAttribute("readonly", true), this.opts.readonly = true;
              }
              disableReadonlyMode() {
                this.elTextarea.removeAttribute("readonly"), this.opts.readonly = false;
              }
              toggleReadonlyMode() {
                this.opts.readonly ? this.disableReadonlyMode() : this.enableReadonlyMode();
              }
              enableLineNumbers() {
                this.opts.lineNumbers = true, this.destroyLineNumbers(), this.createLineNumbers(), this.updateLineNumbersCount();
              }
              disableLineNumbers() {
                this.opts.lineNumbers = false, this.destroyLineNumbers();
              }
              toggleLineNumbers() {
                this.opts.lineNumbers ? this.disableLineNumbers() : this.enableLineNumbers();
              }
              dispose() {
                this.elTextarea.removeEventListener("input", this.events._input), this.elTextarea.removeEventListener("keydown", this.events._keydown), this.elTextarea.removeEventListener("scroll", this.events._scroll), this.elWrapper.remove();
              }
            }
          })(), r3.default;
        })(), e2.exports = t2();
      }, 572: (e2, t2, n3) => {
        "use strict";
        n3.d(t2, { Z: () => s2 });
        var r3 = n3(81), i = n3.n(r3), a3 = n3(645), o3 = n3.n(a3)()(i());
        o3.push([e2.id, ".editorjs-codeCup_Wrapper {\n    height: 200px;\n	border: 1px solid #dcdfe6;\n	border-radius: 5px;\n	background-color: #f0f2f5;\n    margin-bottom: 10px;\n\n	z-index: 0;\n    position: inherit; \n}\n\n.editorjs-codeCup_Wrapper .codeCup {\n	border-radius: 5px;\n	background: none;\n}\n\n\n.editorjs-codeCup_Wrapper .editorjs-codeCup_LangDisplay {\n	position: absolute;\n	height: 20px;\n	line-height: 20px;\n	font-size: 10px;\n	color: #999;\n	background-color: #dcdfe6;\n	padding: 5px;\n	padding-left: 10px;\n	padding-right: 10px;\n	right: 0px; \n	bottom: 0;\n	border-bottom-right-radius: 5px;\n	border-top-left-radius: 5px;\n}\n\n.editorjs-codeCup_Wrapper .codeCup.codeCup--has-line-numbers:before{\n    background-color: #dcdfe6;\n}\n\n/* .wide{\n	width: 100%;\n\n	z-index: 10;\n    position: inherit;\n} */\n\n\n.editorjs-codeCup_input{\n	background-color: #F8F8F8;\n	border-radius: 2px;\n	padding:5px;\n	flex: 1;\n	margin-right: 5px;\n}\n\n.editorjs-codeCup_input:focus{\n    outline: none;\n}\n\n.editorjs-codeCup_inputButton{\n	display:flex;\n	align-items: center;\n	justify-content: center;\n}\n\n.editorjs-codeCup_inputButton:hover{\n	border-radius: 2px;\n	background-color: #dcdfe6;\n	cursor: pointer;\n}\n\n.editorjs-codeCup_inputContainer{\n	padding:5px;\n	display: flex;\n	justify-content: space-between;\n}\n\n.editorjs-codeCup_languageSelectContainer {\n	position: relative;\n}\n\n.editorjs-codeCup_languageDropdown {\n	/* top:10px; left:100px; */\n	position: fixed;\n	background: white;\n	border: 1px solid #ddd;\n	padding: 5px;\n	z-index: 9999;\n	max-height: 200px;\n	overflow-y: auto;\n	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);\n	border-radius: 5px;\n	font-size: 14px;\n	min-width: 150px;\n	/* The position will need to be set dynamically via JavaScript */\n}\n\n.editorjs-codeCup_languageOption {\n	font-size: 14px;\n    line-height: 20px;\n    font-weight: 500;\n	padding: 6px 12px;\n	cursor: pointer;\n	border-bottom: 1px solid #f0f0f0;\n}\n\n.editorjs-codeCup_languageOption:hover {\n	background-color: #f5f5f5;		\n}\n\n.editorjs-codeCup_languageErrorMessage {\n	display: flex;\n	align-items: center;\n	gap: 8px;\n	font-size: 14px;\n	font-weight: 500;\n	color: #d9534f;\n	background: white;\n	padding: 6px 10px;\n	margin-top: 8px;\n	border-left: 4px solid #d9534f;\n	border-radius: 4px;\n  }\n\n  .editorjs-codeCup_languageErrorMessage .close-error {\n	font-size: 18px;\n	font-weight: bold;\n	color: black;\n	background: transparent;\n	border: none;\n	cursor: pointer;\n	transition: color 0.2s ease;\n  }\n  \n  .editorjs-codeCup_languageErrorMessage .close-error:hover {\n	color: #444;\n  }", ""]);
        const s2 = o3;
      }, 645: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          var t2 = [];
          return t2.toString = function() {
            return this.map(function(t3) {
              var n3 = "", r3 = void 0 !== t3[5];
              return t3[4] && (n3 += "@supports (".concat(t3[4], ") {")), t3[2] && (n3 += "@media ".concat(t3[2], " {")), r3 && (n3 += "@layer".concat(t3[5].length > 0 ? " ".concat(t3[5]) : "", " {")), n3 += e3(t3), r3 && (n3 += "}"), t3[2] && (n3 += "}"), t3[4] && (n3 += "}"), n3;
            }).join("");
          }, t2.i = function(e4, n3, r3, i, a3) {
            "string" == typeof e4 && (e4 = [[null, e4, void 0]]);
            var o3 = {};
            if (r3)
              for (var s2 = 0; s2 < this.length; s2++) {
                var l2 = this[s2][0];
                null != l2 && (o3[l2] = true);
              }
            for (var c5 = 0; c5 < e4.length; c5++) {
              var u4 = [].concat(e4[c5]);
              r3 && o3[u4[0]] || (void 0 !== a3 && (void 0 === u4[5] || (u4[1] = "@layer".concat(u4[5].length > 0 ? " ".concat(u4[5]) : "", " {").concat(u4[1], "}")), u4[5] = a3), n3 && (u4[2] ? (u4[1] = "@media ".concat(u4[2], " {").concat(u4[1], "}"), u4[2] = n3) : u4[2] = n3), i && (u4[4] ? (u4[1] = "@supports (".concat(u4[4], ") {").concat(u4[1], "}"), u4[4] = i) : u4[4] = "".concat(i)), t2.push(u4));
            }
          }, t2;
        };
      }, 81: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          return e3[1];
        };
      }, 379: (e2) => {
        "use strict";
        var t2 = [];
        function n3(e3) {
          for (var n4 = -1, r4 = 0; r4 < t2.length; r4++)
            if (t2[r4].identifier === e3) {
              n4 = r4;
              break;
            }
          return n4;
        }
        function r3(e3, r4) {
          for (var a3 = {}, o3 = [], s2 = 0; s2 < e3.length; s2++) {
            var l2 = e3[s2], c5 = r4.base ? l2[0] + r4.base : l2[0], u4 = a3[c5] || 0, p4 = "".concat(c5, " ").concat(u4);
            a3[c5] = u4 + 1;
            var d3 = n3(p4), h3 = { css: l2[1], media: l2[2], sourceMap: l2[3], supports: l2[4], layer: l2[5] };
            if (-1 !== d3)
              t2[d3].references++, t2[d3].updater(h3);
            else {
              var g6 = i(h3, r4);
              r4.byIndex = s2, t2.splice(s2, 0, { identifier: p4, updater: g6, references: 1 });
            }
            o3.push(p4);
          }
          return o3;
        }
        function i(e3, t3) {
          var n4 = t3.domAPI(t3);
          return n4.update(e3), function(t4) {
            if (t4) {
              if (t4.css === e3.css && t4.media === e3.media && t4.sourceMap === e3.sourceMap && t4.supports === e3.supports && t4.layer === e3.layer)
                return;
              n4.update(e3 = t4);
            } else
              n4.remove();
          };
        }
        e2.exports = function(e3, i2) {
          var a3 = r3(e3 = e3 || [], i2 = i2 || {});
          return function(e4) {
            e4 = e4 || [];
            for (var o3 = 0; o3 < a3.length; o3++) {
              var s2 = n3(a3[o3]);
              t2[s2].references--;
            }
            for (var l2 = r3(e4, i2), c5 = 0; c5 < a3.length; c5++) {
              var u4 = n3(a3[c5]);
              0 === t2[u4].references && (t2[u4].updater(), t2.splice(u4, 1));
            }
            a3 = l2;
          };
        };
      }, 569: (e2) => {
        "use strict";
        var t2 = {};
        e2.exports = function(e3, n3) {
          var r3 = function(e4) {
            if (void 0 === t2[e4]) {
              var n4 = document.querySelector(e4);
              if (window.HTMLIFrameElement && n4 instanceof window.HTMLIFrameElement)
                try {
                  n4 = n4.contentDocument.head;
                } catch (e5) {
                  n4 = null;
                }
              t2[e4] = n4;
            }
            return t2[e4];
          }(e3);
          if (!r3)
            throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
          r3.appendChild(n3);
        };
      }, 216: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          var t2 = document.createElement("style");
          return e3.setAttributes(t2, e3.attributes), e3.insert(t2, e3.options), t2;
        };
      }, 565: (e2, t2, n3) => {
        "use strict";
        e2.exports = function(e3) {
          var t3 = n3.nc;
          t3 && e3.setAttribute("nonce", t3);
        };
      }, 795: (e2) => {
        "use strict";
        e2.exports = function(e3) {
          var t2 = e3.insertStyleElement(e3);
          return { update: function(n3) {
            !function(e4, t3, n4) {
              var r3 = "";
              n4.supports && (r3 += "@supports (".concat(n4.supports, ") {")), n4.media && (r3 += "@media ".concat(n4.media, " {"));
              var i = void 0 !== n4.layer;
              i && (r3 += "@layer".concat(n4.layer.length > 0 ? " ".concat(n4.layer) : "", " {")), r3 += n4.css, i && (r3 += "}"), n4.media && (r3 += "}"), n4.supports && (r3 += "}");
              var a3 = n4.sourceMap;
              a3 && "undefined" != typeof btoa && (r3 += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a3)))), " */")), t3.styleTagTransform(r3, e4, t3.options);
            }(t2, e3, n3);
          }, remove: function() {
            !function(e4) {
              if (null === e4.parentNode)
                return false;
              e4.parentNode.removeChild(e4);
            }(t2);
          } };
        };
      }, 589: (e2) => {
        "use strict";
        e2.exports = function(e3, t2) {
          if (t2.styleSheet)
            t2.styleSheet.cssText = e3;
          else {
            for (; t2.firstChild; )
              t2.removeChild(t2.firstChild);
            t2.appendChild(document.createTextNode(e3));
          }
        };
      }, 548: (e2) => {
        e2.exports = '<svg width="14" height="14" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z"></path></svg>';
      } }, t = {};
      function n2(r3) {
        var i = t[r3];
        if (void 0 !== i)
          return i.exports;
        var a3 = t[r3] = { id: r3, exports: {} };
        return e[r3](a3, a3.exports, n2), a3.exports;
      }
      n2.n = (e2) => {
        var t2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return n2.d(t2, { a: t2 }), t2;
      }, n2.d = (e2, t2) => {
        for (var r3 in t2)
          n2.o(t2, r3) && !n2.o(e2, r3) && Object.defineProperty(e2, r3, { enumerable: true, get: t2[r3] });
      }, n2.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), n2.nc = void 0;
      var r2 = {};
      return (() => {
        "use strict";
        n2.d(r2, { default: () => y4 });
        var e2 = n2(379), t2 = n2.n(e2), i = n2(795), a3 = n2.n(i), o3 = n2(569), s2 = n2.n(o3), l2 = n2(565), c5 = n2.n(l2), u4 = n2(216), p4 = n2.n(u4), d3 = n2(589), h3 = n2.n(d3), g6 = n2(572), m4 = {};
        m4.styleTagTransform = h3(), m4.setAttributes = c5(), m4.insert = s2().bind(null, "head"), m4.domAPI = a3(), m4.insertStyleElement = p4(), t2()(g6.Z, m4), g6.Z && g6.Z.locals && g6.Z.locals;
        var f4 = n2(548), w4 = n2.n(f4), v4 = n2(255), b4 = n2.n(v4);
        const k4 = JSON.parse(`{"Mj":{"meta":{"path":"components/prism-{id}","noCSS":true,"examplesPath":"examples/prism-{id}","addCheckAll":true},"markup":{"title":"Markup","alias":["html","xml","svg","mathml","ssml","atom","rss"],"aliasTitles":{"html":"HTML","xml":"XML","svg":"SVG","mathml":"MathML","ssml":"SSML","atom":"Atom","rss":"RSS"},"option":"default"},"css":{"title":"CSS","option":"default","modify":"markup"},"clike":{"title":"C-like","option":"default"},"javascript":{"title":"JavaScript","require":"clike","modify":"markup","optional":"regex","alias":"js","option":"default"},"abap":{"title":"ABAP","owner":"dellagustin"},"abnf":{"title":"ABNF","owner":"RunDevelopment"},"actionscript":{"title":"ActionScript","require":"javascript","modify":"markup","owner":"Golmote"},"ada":{"title":"Ada","owner":"Lucretia"},"agda":{"title":"Agda","owner":"xy-ren"},"al":{"title":"AL","owner":"RunDevelopment"},"antlr4":{"title":"ANTLR4","alias":"g4","owner":"RunDevelopment"},"apacheconf":{"title":"Apache Configuration","owner":"GuiTeK"},"apex":{"title":"Apex","require":["clike","sql"],"owner":"RunDevelopment"},"apl":{"title":"APL","owner":"ngn"},"applescript":{"title":"AppleScript","owner":"Golmote"},"aql":{"title":"AQL","owner":"RunDevelopment"},"arduino":{"title":"Arduino","require":"cpp","alias":"ino","owner":"dkern"},"arff":{"title":"ARFF","owner":"Golmote"},"armasm":{"title":"ARM Assembly","alias":"arm-asm","owner":"RunDevelopment"},"arturo":{"title":"Arturo","alias":"art","optional":["bash","css","javascript","markup","markdown","sql"],"owner":"drkameleon"},"asciidoc":{"alias":"adoc","title":"AsciiDoc","owner":"Golmote"},"aspnet":{"title":"ASP.NET (C#)","require":["markup","csharp"],"owner":"nauzilus"},"asm6502":{"title":"6502 Assembly","owner":"kzurawel"},"asmatmel":{"title":"Atmel AVR Assembly","owner":"cerkit"},"autohotkey":{"title":"AutoHotkey","owner":"aviaryan"},"autoit":{"title":"AutoIt","owner":"Golmote"},"avisynth":{"title":"AviSynth","alias":"avs","owner":"Zinfidel"},"avro-idl":{"title":"Avro IDL","alias":"avdl","owner":"RunDevelopment"},"awk":{"title":"AWK","alias":"gawk","aliasTitles":{"gawk":"GAWK"},"owner":"RunDevelopment"},"bash":{"title":"Bash","alias":["sh","shell"],"aliasTitles":{"sh":"Shell","shell":"Shell"},"owner":"zeitgeist87"},"basic":{"title":"BASIC","owner":"Golmote"},"batch":{"title":"Batch","owner":"Golmote"},"bbcode":{"title":"BBcode","alias":"shortcode","aliasTitles":{"shortcode":"Shortcode"},"owner":"RunDevelopment"},"bbj":{"title":"BBj","owner":"hyyan"},"bicep":{"title":"Bicep","owner":"johnnyreilly"},"birb":{"title":"Birb","require":"clike","owner":"Calamity210"},"bison":{"title":"Bison","require":"c","owner":"Golmote"},"bnf":{"title":"BNF","alias":"rbnf","aliasTitles":{"rbnf":"RBNF"},"owner":"RunDevelopment"},"bqn":{"title":"BQN","owner":"yewscion"},"brainfuck":{"title":"Brainfuck","owner":"Golmote"},"brightscript":{"title":"BrightScript","owner":"RunDevelopment"},"bro":{"title":"Bro","owner":"wayward710"},"bsl":{"title":"BSL (1C:Enterprise)","alias":"oscript","aliasTitles":{"oscript":"OneScript"},"owner":"Diversus23"},"c":{"title":"C","require":"clike","owner":"zeitgeist87"},"csharp":{"title":"C#","require":"clike","alias":["cs","dotnet"],"owner":"mvalipour"},"cpp":{"title":"C++","require":"c","owner":"zeitgeist87"},"cfscript":{"title":"CFScript","require":"clike","alias":"cfc","owner":"mjclemente"},"chaiscript":{"title":"ChaiScript","require":["clike","cpp"],"owner":"RunDevelopment"},"cil":{"title":"CIL","owner":"sbrl"},"cilkc":{"title":"Cilk/C","require":"c","alias":"cilk-c","owner":"OpenCilk"},"cilkcpp":{"title":"Cilk/C++","require":"cpp","alias":["cilk-cpp","cilk"],"owner":"OpenCilk"},"clojure":{"title":"Clojure","owner":"troglotit"},"cmake":{"title":"CMake","owner":"mjrogozinski"},"cobol":{"title":"COBOL","owner":"RunDevelopment"},"coffeescript":{"title":"CoffeeScript","require":"javascript","alias":"coffee","owner":"R-osey"},"concurnas":{"title":"Concurnas","alias":"conc","owner":"jasontatton"},"csp":{"title":"Content-Security-Policy","owner":"ScottHelme"},"cooklang":{"title":"Cooklang","owner":"ahue"},"coq":{"title":"Coq","owner":"RunDevelopment"},"crystal":{"title":"Crystal","require":"ruby","owner":"MakeNowJust"},"css-extras":{"title":"CSS Extras","require":"css","modify":"css","owner":"milesj"},"csv":{"title":"CSV","owner":"RunDevelopment"},"cue":{"title":"CUE","owner":"RunDevelopment"},"cypher":{"title":"Cypher","owner":"RunDevelopment"},"d":{"title":"D","require":"clike","owner":"Golmote"},"dart":{"title":"Dart","require":"clike","owner":"Golmote"},"dataweave":{"title":"DataWeave","owner":"machaval"},"dax":{"title":"DAX","owner":"peterbud"},"dhall":{"title":"Dhall","owner":"RunDevelopment"},"diff":{"title":"Diff","owner":"uranusjr"},"django":{"title":"Django/Jinja2","require":"markup-templating","alias":"jinja2","owner":"romanvm"},"dns-zone-file":{"title":"DNS zone file","owner":"RunDevelopment","alias":"dns-zone"},"docker":{"title":"Docker","alias":"dockerfile","owner":"JustinBeckwith"},"dot":{"title":"DOT (Graphviz)","alias":"gv","optional":"markup","owner":"RunDevelopment"},"ebnf":{"title":"EBNF","owner":"RunDevelopment"},"editorconfig":{"title":"EditorConfig","owner":"osipxd"},"eiffel":{"title":"Eiffel","owner":"Conaclos"},"ejs":{"title":"EJS","require":["javascript","markup-templating"],"owner":"RunDevelopment","alias":"eta","aliasTitles":{"eta":"Eta"}},"elixir":{"title":"Elixir","owner":"Golmote"},"elm":{"title":"Elm","owner":"zwilias"},"etlua":{"title":"Embedded Lua templating","require":["lua","markup-templating"],"owner":"RunDevelopment"},"erb":{"title":"ERB","require":["ruby","markup-templating"],"owner":"Golmote"},"erlang":{"title":"Erlang","owner":"Golmote"},"excel-formula":{"title":"Excel Formula","alias":["xlsx","xls"],"owner":"RunDevelopment"},"fsharp":{"title":"F#","require":"clike","owner":"simonreynolds7"},"factor":{"title":"Factor","owner":"catb0t"},"false":{"title":"False","owner":"edukisto"},"firestore-security-rules":{"title":"Firestore security rules","require":"clike","owner":"RunDevelopment"},"flow":{"title":"Flow","require":"javascript","owner":"Golmote"},"fortran":{"title":"Fortran","owner":"Golmote"},"ftl":{"title":"FreeMarker Template Language","require":"markup-templating","owner":"RunDevelopment"},"gml":{"title":"GameMaker Language","alias":"gamemakerlanguage","require":"clike","owner":"LiarOnce"},"gap":{"title":"GAP (CAS)","owner":"RunDevelopment"},"gcode":{"title":"G-code","owner":"RunDevelopment"},"gdscript":{"title":"GDScript","owner":"RunDevelopment"},"gedcom":{"title":"GEDCOM","owner":"Golmote"},"gettext":{"title":"gettext","alias":"po","owner":"RunDevelopment"},"gherkin":{"title":"Gherkin","owner":"hason"},"git":{"title":"Git","owner":"lgiraudel"},"glsl":{"title":"GLSL","require":"c","owner":"Golmote"},"gn":{"title":"GN","alias":"gni","owner":"RunDevelopment"},"linker-script":{"title":"GNU Linker Script","alias":"ld","owner":"RunDevelopment"},"go":{"title":"Go","require":"clike","owner":"arnehormann"},"go-module":{"title":"Go module","alias":"go-mod","owner":"RunDevelopment"},"gradle":{"title":"Gradle","require":"clike","owner":"zeabdelkhalek-badido18"},"graphql":{"title":"GraphQL","optional":"markdown","owner":"Golmote"},"groovy":{"title":"Groovy","require":"clike","owner":"robfletcher"},"haml":{"title":"Haml","require":"ruby","optional":["css","css-extras","coffeescript","erb","javascript","less","markdown","scss","textile"],"owner":"Golmote"},"handlebars":{"title":"Handlebars","require":"markup-templating","alias":["hbs","mustache"],"aliasTitles":{"mustache":"Mustache"},"owner":"Golmote"},"haskell":{"title":"Haskell","alias":"hs","owner":"bholst"},"haxe":{"title":"Haxe","require":"clike","optional":"regex","owner":"Golmote"},"hcl":{"title":"HCL","owner":"outsideris"},"hlsl":{"title":"HLSL","require":"c","owner":"RunDevelopment"},"hoon":{"title":"Hoon","owner":"matildepark"},"http":{"title":"HTTP","optional":["csp","css","hpkp","hsts","javascript","json","markup","uri"],"owner":"danielgtaylor"},"hpkp":{"title":"HTTP Public-Key-Pins","owner":"ScottHelme"},"hsts":{"title":"HTTP Strict-Transport-Security","owner":"ScottHelme"},"ichigojam":{"title":"IchigoJam","owner":"BlueCocoa"},"icon":{"title":"Icon","owner":"Golmote"},"icu-message-format":{"title":"ICU Message Format","owner":"RunDevelopment"},"idris":{"title":"Idris","alias":"idr","owner":"KeenS","require":"haskell"},"ignore":{"title":".ignore","owner":"osipxd","alias":["gitignore","hgignore","npmignore"],"aliasTitles":{"gitignore":".gitignore","hgignore":".hgignore","npmignore":".npmignore"}},"inform7":{"title":"Inform 7","owner":"Golmote"},"ini":{"title":"Ini","owner":"aviaryan"},"io":{"title":"Io","owner":"AlesTsurko"},"j":{"title":"J","owner":"Golmote"},"java":{"title":"Java","require":"clike","owner":"sherblot"},"javadoc":{"title":"JavaDoc","require":["markup","java","javadoclike"],"modify":"java","optional":"scala","owner":"RunDevelopment"},"javadoclike":{"title":"JavaDoc-like","modify":["java","javascript","php"],"owner":"RunDevelopment"},"javastacktrace":{"title":"Java stack trace","owner":"RunDevelopment"},"jexl":{"title":"Jexl","owner":"czosel"},"jolie":{"title":"Jolie","require":"clike","owner":"thesave"},"jq":{"title":"JQ","owner":"RunDevelopment"},"jsdoc":{"title":"JSDoc","require":["javascript","javadoclike","typescript"],"modify":"javascript","optional":["actionscript","coffeescript"],"owner":"RunDevelopment"},"js-extras":{"title":"JS Extras","require":"javascript","modify":"javascript","optional":["actionscript","coffeescript","flow","n4js","typescript"],"owner":"RunDevelopment"},"json":{"title":"JSON","alias":"webmanifest","aliasTitles":{"webmanifest":"Web App Manifest"},"owner":"CupOfTea696"},"json5":{"title":"JSON5","require":"json","owner":"RunDevelopment"},"jsonp":{"title":"JSONP","require":"json","owner":"RunDevelopment"},"jsstacktrace":{"title":"JS stack trace","owner":"sbrl"},"js-templates":{"title":"JS Templates","require":"javascript","modify":"javascript","optional":["css","css-extras","graphql","markdown","markup","sql"],"owner":"RunDevelopment"},"julia":{"title":"Julia","owner":"cdagnino"},"keepalived":{"title":"Keepalived Configure","owner":"dev-itsheng"},"keyman":{"title":"Keyman","owner":"mcdurdin"},"kotlin":{"title":"Kotlin","alias":["kt","kts"],"aliasTitles":{"kts":"Kotlin Script"},"require":"clike","owner":"Golmote"},"kumir":{"title":"KuMir (\u041A\u0443\u041C\u0438\u0440)","alias":"kum","owner":"edukisto"},"kusto":{"title":"Kusto","owner":"RunDevelopment"},"latex":{"title":"LaTeX","alias":["tex","context"],"aliasTitles":{"tex":"TeX","context":"ConTeXt"},"owner":"japborst"},"latte":{"title":"Latte","require":["clike","markup-templating","php"],"owner":"nette"},"less":{"title":"Less","require":"css","optional":"css-extras","owner":"Golmote"},"lilypond":{"title":"LilyPond","require":"scheme","alias":"ly","owner":"RunDevelopment"},"liquid":{"title":"Liquid","require":"markup-templating","owner":"cinhtau"},"lisp":{"title":"Lisp","alias":["emacs","elisp","emacs-lisp"],"owner":"JuanCaicedo"},"livescript":{"title":"LiveScript","owner":"Golmote"},"llvm":{"title":"LLVM IR","owner":"porglezomp"},"log":{"title":"Log file","optional":"javastacktrace","owner":"RunDevelopment"},"lolcode":{"title":"LOLCODE","owner":"Golmote"},"lua":{"title":"Lua","owner":"Golmote"},"magma":{"title":"Magma (CAS)","owner":"RunDevelopment"},"makefile":{"title":"Makefile","owner":"Golmote"},"markdown":{"title":"Markdown","require":"markup","optional":"yaml","alias":"md","owner":"Golmote"},"markup-templating":{"title":"Markup templating","require":"markup","owner":"Golmote"},"mata":{"title":"Mata","owner":"RunDevelopment"},"matlab":{"title":"MATLAB","owner":"Golmote"},"maxscript":{"title":"MAXScript","owner":"RunDevelopment"},"mel":{"title":"MEL","owner":"Golmote"},"mermaid":{"title":"Mermaid","owner":"RunDevelopment"},"metafont":{"title":"METAFONT","owner":"LaeriExNihilo"},"mizar":{"title":"Mizar","owner":"Golmote"},"mongodb":{"title":"MongoDB","owner":"airs0urce","require":"javascript"},"monkey":{"title":"Monkey","owner":"Golmote"},"moonscript":{"title":"MoonScript","alias":"moon","owner":"RunDevelopment"},"n1ql":{"title":"N1QL","owner":"TMWilds"},"n4js":{"title":"N4JS","require":"javascript","optional":"jsdoc","alias":"n4jsd","owner":"bsmith-n4"},"nand2tetris-hdl":{"title":"Nand To Tetris HDL","owner":"stephanmax"},"naniscript":{"title":"Naninovel Script","owner":"Elringus","alias":"nani"},"nasm":{"title":"NASM","owner":"rbmj"},"neon":{"title":"NEON","owner":"nette"},"nevod":{"title":"Nevod","owner":"nezaboodka"},"nginx":{"title":"nginx","owner":"volado"},"nim":{"title":"Nim","owner":"Golmote"},"nix":{"title":"Nix","owner":"Golmote"},"nsis":{"title":"NSIS","owner":"idleberg"},"objectivec":{"title":"Objective-C","require":"c","alias":"objc","owner":"uranusjr"},"ocaml":{"title":"OCaml","owner":"Golmote"},"odin":{"title":"Odin","owner":"edukisto"},"opencl":{"title":"OpenCL","require":"c","modify":["c","cpp"],"owner":"Milania1"},"openqasm":{"title":"OpenQasm","alias":"qasm","owner":"RunDevelopment"},"oz":{"title":"Oz","owner":"Golmote"},"parigp":{"title":"PARI/GP","owner":"Golmote"},"parser":{"title":"Parser","require":"markup","owner":"Golmote"},"pascal":{"title":"Pascal","alias":"objectpascal","aliasTitles":{"objectpascal":"Object Pascal"},"owner":"Golmote"},"pascaligo":{"title":"Pascaligo","owner":"DefinitelyNotAGoat"},"psl":{"title":"PATROL Scripting Language","owner":"bertysentry"},"pcaxis":{"title":"PC-Axis","alias":"px","owner":"RunDevelopment"},"peoplecode":{"title":"PeopleCode","alias":"pcode","owner":"RunDevelopment"},"perl":{"title":"Perl","owner":"Golmote"},"php":{"title":"PHP","require":"markup-templating","owner":"milesj"},"phpdoc":{"title":"PHPDoc","require":["php","javadoclike"],"modify":"php","owner":"RunDevelopment"},"php-extras":{"title":"PHP Extras","require":"php","modify":"php","owner":"milesj"},"plant-uml":{"title":"PlantUML","alias":"plantuml","owner":"RunDevelopment"},"plsql":{"title":"PL/SQL","require":"sql","owner":"Golmote"},"powerquery":{"title":"PowerQuery","alias":["pq","mscript"],"owner":"peterbud"},"powershell":{"title":"PowerShell","owner":"nauzilus"},"processing":{"title":"Processing","require":"clike","owner":"Golmote"},"prolog":{"title":"Prolog","owner":"Golmote"},"promql":{"title":"PromQL","owner":"arendjr"},"properties":{"title":".properties","owner":"Golmote"},"protobuf":{"title":"Protocol Buffers","require":"clike","owner":"just-boris"},"pug":{"title":"Pug","require":["markup","javascript"],"optional":["coffeescript","ejs","handlebars","less","livescript","markdown","scss","stylus","twig"],"owner":"Golmote"},"puppet":{"title":"Puppet","owner":"Golmote"},"pure":{"title":"Pure","optional":["c","cpp","fortran"],"owner":"Golmote"},"purebasic":{"title":"PureBasic","require":"clike","alias":"pbfasm","owner":"HeX0R101"},"purescript":{"title":"PureScript","require":"haskell","alias":"purs","owner":"sriharshachilakapati"},"python":{"title":"Python","alias":"py","owner":"multipetros"},"qsharp":{"title":"Q#","require":"clike","alias":"qs","owner":"fedonman"},"q":{"title":"Q (kdb+ database)","owner":"Golmote"},"qml":{"title":"QML","require":"javascript","owner":"RunDevelopment"},"qore":{"title":"Qore","require":"clike","owner":"temnroegg"},"r":{"title":"R","owner":"Golmote"},"racket":{"title":"Racket","require":"scheme","alias":"rkt","owner":"RunDevelopment"},"cshtml":{"title":"Razor C#","alias":"razor","require":["markup","csharp"],"optional":["css","css-extras","javascript","js-extras"],"owner":"RunDevelopment"},"jsx":{"title":"React JSX","require":["markup","javascript"],"optional":["jsdoc","js-extras","js-templates"],"owner":"vkbansal"},"tsx":{"title":"React TSX","require":["jsx","typescript"]},"reason":{"title":"Reason","require":"clike","owner":"Golmote"},"regex":{"title":"Regex","owner":"RunDevelopment"},"rego":{"title":"Rego","owner":"JordanSh"},"renpy":{"title":"Ren'py","alias":"rpy","owner":"HyuchiaDiego"},"rescript":{"title":"ReScript","alias":"res","owner":"vmarcosp"},"rest":{"title":"reST (reStructuredText)","owner":"Golmote"},"rip":{"title":"Rip","owner":"ravinggenius"},"roboconf":{"title":"Roboconf","owner":"Golmote"},"robotframework":{"title":"Robot Framework","alias":"robot","owner":"RunDevelopment"},"ruby":{"title":"Ruby","require":"clike","alias":"rb","owner":"samflores"},"rust":{"title":"Rust","owner":"Golmote"},"sas":{"title":"SAS","optional":["groovy","lua","sql"],"owner":"Golmote"},"sass":{"title":"Sass (Sass)","require":"css","optional":"css-extras","owner":"Golmote"},"scss":{"title":"Sass (SCSS)","require":"css","optional":"css-extras","owner":"MoOx"},"scala":{"title":"Scala","require":"java","owner":"jozic"},"scheme":{"title":"Scheme","owner":"bacchus123"},"shell-session":{"title":"Shell session","require":"bash","alias":["sh-session","shellsession"],"owner":"RunDevelopment"},"smali":{"title":"Smali","owner":"RunDevelopment"},"smalltalk":{"title":"Smalltalk","owner":"Golmote"},"smarty":{"title":"Smarty","require":"markup-templating","optional":"php","owner":"Golmote"},"sml":{"title":"SML","alias":"smlnj","aliasTitles":{"smlnj":"SML/NJ"},"owner":"RunDevelopment"},"solidity":{"title":"Solidity (Ethereum)","alias":"sol","require":"clike","owner":"glachaud"},"solution-file":{"title":"Solution file","alias":"sln","owner":"RunDevelopment"},"soy":{"title":"Soy (Closure Template)","require":"markup-templating","owner":"Golmote"},"sparql":{"title":"SPARQL","require":"turtle","owner":"Triply-Dev","alias":"rq"},"splunk-spl":{"title":"Splunk SPL","owner":"RunDevelopment"},"sqf":{"title":"SQF: Status Quo Function (Arma 3)","require":"clike","owner":"RunDevelopment"},"sql":{"title":"SQL","owner":"multipetros"},"squirrel":{"title":"Squirrel","require":"clike","owner":"RunDevelopment"},"stan":{"title":"Stan","owner":"RunDevelopment"},"stata":{"title":"Stata Ado","require":["mata","java","python"],"owner":"RunDevelopment"},"iecst":{"title":"Structured Text (IEC 61131-3)","owner":"serhioromano"},"stylus":{"title":"Stylus","owner":"vkbansal"},"supercollider":{"title":"SuperCollider","alias":"sclang","owner":"RunDevelopment"},"swift":{"title":"Swift","owner":"chrischares"},"systemd":{"title":"Systemd configuration file","owner":"RunDevelopment"},"t4-templating":{"title":"T4 templating","owner":"RunDevelopment"},"t4-cs":{"title":"T4 Text Templates (C#)","require":["t4-templating","csharp"],"alias":"t4","owner":"RunDevelopment"},"t4-vb":{"title":"T4 Text Templates (VB)","require":["t4-templating","vbnet"],"owner":"RunDevelopment"},"tap":{"title":"TAP","owner":"isaacs","require":"yaml"},"tcl":{"title":"Tcl","owner":"PeterChaplin"},"tt2":{"title":"Template Toolkit 2","require":["clike","markup-templating"],"owner":"gflohr"},"textile":{"title":"Textile","require":"markup","optional":"css","owner":"Golmote"},"toml":{"title":"TOML","owner":"RunDevelopment"},"tremor":{"title":"Tremor","alias":["trickle","troy"],"owner":"darach","aliasTitles":{"trickle":"trickle","troy":"troy"}},"turtle":{"title":"Turtle","alias":"trig","aliasTitles":{"trig":"TriG"},"owner":"jakubklimek"},"twig":{"title":"Twig","require":"markup-templating","owner":"brandonkelly"},"typescript":{"title":"TypeScript","require":"javascript","optional":"js-templates","alias":"ts","owner":"vkbansal"},"typoscript":{"title":"TypoScript","alias":"tsconfig","aliasTitles":{"tsconfig":"TSConfig"},"owner":"dkern"},"unrealscript":{"title":"UnrealScript","alias":["uscript","uc"],"owner":"RunDevelopment"},"uorazor":{"title":"UO Razor Script","owner":"jaseowns"},"uri":{"title":"URI","alias":"url","aliasTitles":{"url":"URL"},"owner":"RunDevelopment"},"v":{"title":"V","require":"clike","owner":"taggon"},"vala":{"title":"Vala","require":"clike","optional":"regex","owner":"TemplarVolk"},"vbnet":{"title":"VB.Net","require":"basic","owner":"Bigsby"},"velocity":{"title":"Velocity","require":"markup","owner":"Golmote"},"verilog":{"title":"Verilog","owner":"a-rey"},"vhdl":{"title":"VHDL","owner":"a-rey"},"vim":{"title":"vim","owner":"westonganger"},"visual-basic":{"title":"Visual Basic","alias":["vb","vba"],"aliasTitles":{"vba":"VBA"},"owner":"Golmote"},"warpscript":{"title":"WarpScript","owner":"RunDevelopment"},"wasm":{"title":"WebAssembly","owner":"Golmote"},"web-idl":{"title":"Web IDL","alias":"webidl","owner":"RunDevelopment"},"wgsl":{"title":"WGSL","owner":"Dr4gonthree"},"wiki":{"title":"Wiki markup","require":"markup","owner":"Golmote"},"wolfram":{"title":"Wolfram language","alias":["mathematica","nb","wl"],"aliasTitles":{"mathematica":"Mathematica","nb":"Mathematica Notebook"},"owner":"msollami"},"wren":{"title":"Wren","owner":"clsource"},"xeora":{"title":"Xeora","require":"markup","alias":"xeoracube","aliasTitles":{"xeoracube":"XeoraCube"},"owner":"freakmaxi"},"xml-doc":{"title":"XML doc (.net)","require":"markup","modify":["csharp","fsharp","vbnet"],"owner":"RunDevelopment"},"xojo":{"title":"Xojo (REALbasic)","owner":"Golmote"},"xquery":{"title":"XQuery","require":"markup","owner":"Golmote"},"yaml":{"title":"YAML","alias":"yml","owner":"hason"},"yang":{"title":"YANG","owner":"RunDevelopment"},"zig":{"title":"Zig","owner":"RunDevelopment"}}}`);
        class y4 {
          static get DEFAULT_PLACEHOLDER() {
            return "// Hello";
          }
          static get enableLineBreaks() {
            return true;
          }
          static getDefaultLanguages() {
            return { bash: "Bash", c: "C", cpp: "C++", csharp: "C#", css: "CSS", go: "Go", html: "HTML", java: "Java", javascript: "JavaScript", json: "JSON", kotlin: "Kotlin", none: "Plain Text", php: "PHP", python: "Python", ruby: "Ruby", rust: "Rust", sql: "SQL", swift: "Swift", typescript: "TypeScript" };
          }
          constructor({ data: e3, config: t3, api: n3, readOnly: r3 }) {
            this.api = n3, this.readOnly = r3, this._CSS = { block: this.api.styles.block, wrapper: "ce-EditorJsCodeCup", settingsButton: this.api.styles.settingsButton, settingsButtonActive: this.api.styles.settingsButtonActive }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = t3.placeholder ? t3.placeholder : y4.DEFAULT_PLACEHOLDER, this._preserveBlank = void 0 !== t3.preserveBlank && t3.preserveBlank, this._forceShowLanguageInput = t3.forceShowLanguageInput || false, this._hasConfiguredLanguages = t3.languages && Object.keys(t3.languages).length > 0, this._languages = this._hasConfiguredLanguages ? t3.languages : {}, this._element, this.data = {}, this.data.code = void 0 === e3.code ? "// Hello World" : e3.code, this.data.language = void 0 === e3.language ? "plain" : e3.language.toLowerCase(), this.data.showlinenumbers = void 0 === e3.showlinenumbers || e3.showlinenumbers, this.data.showCopyButton = void 0 === e3.showCopyButton || e3.showCopyButton, this.data.editorInstance = {};
          }
          onKeyUp(e3) {
            if ("Backspace" !== e3.code && "Delete" !== e3.code)
              return;
            const { textContent: t3 } = this._element;
            "" === t3 && (this._element.innerHTML = "");
          }
          render() {
            this._element = document.createElement("div"), this._element.classList.add("editorjs-codeCup_Wrapper");
            let e3 = document.createElement("div");
            e3.classList.add("editorjs-codeCup_Editor");
            let t3 = document.createElement("div");
            return t3.classList.add("editorjs-codeCup_LangDisplay"), t3.innerHTML = "plain" === this.data.language ? "Plain Text" : this._languages[this.data.language] || this.data.language, this._element.appendChild(e3), this._element.appendChild(t3), this.data.editorInstance = new (b4())(e3, { language: this.data.language, lineNumbers: this.data.showlinenumbers, readonly: this.readOnly, copyButton: this.data.showCopyButton }), this.data.editorInstance.onUpdate((e4) => {
              let t4 = e4.split("\n").length;
              this._debounce(this._updateEditorHeight(t4));
            }), this.data.editorInstance.updateCode(this.data.code), this._element;
          }
          _updateEditorHeight(e3) {
            let t3 = 21 * e3 + 10;
            t3 < 60 && (t3 = 60), this._element.style.height = t3 + "px";
          }
          _debounce(e3, t3 = 500) {
            let n3;
            return (...r3) => {
              clearTimeout(n3), n3 = setTimeout(() => {
                e3.apply(this, r3);
              }, t3);
            };
          }
          _renderLanguageDropdown(e3) {
            const t3 = document.createElement("div");
            t3.classList.add("editorjs-codeCup_languageDropdown");
            const n3 = Object.entries(this._languages).sort((e4, t4) => e4[1].localeCompare(t4[1], void 0, { sensitivity: "base" })), r3 = document.createDocumentFragment();
            n3.forEach(([e4, n4]) => {
              const i3 = document.createElement("div");
              i3.classList.add("editorjs-codeCup_languageOption"), i3.innerText = n4, i3.addEventListener("click", (r4) => {
                r4.stopPropagation(), this._updateLanguage(e4, n4) && (t3.style.display = "none");
              }), r3.appendChild(i3);
            }), t3.appendChild(r3);
            const i2 = e3.getBoundingClientRect();
            t3.style.top = `${i2.bottom + window.scrollY}px`, t3.style.left = `${i2.left + window.scrollX}px`, document.body.appendChild(t3);
            const a4 = (n4) => {
              t3.contains(n4.target) || e3.contains(n4.target) || (t3.remove(), document.removeEventListener("click", a4));
            };
            document.addEventListener("click", a4);
          }
          _renderLanguageSelectContainer() {
            const e3 = document.createElement("div");
            return e3.classList.add("ce-popover-item"), e3.classList.add("editorjs-codeCup_languageSelectContainer"), e3.innerHTML = '\n      <div class="ce-popover-item__icon ce-popover-item__icon--tool">\n        <svg width="64px" height="64px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000">\n          <polyline points="160 368 32 256 160 144" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></polyline>\n          <polyline points="352 368 480 256 352 144" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></polyline>\n          <line x1="304" y1="96" x2="208" y2="416" style="fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"></line>\n        </svg>\n      </div>\n      <div class="ce-popover-item__title">Select Language</div>\n    ', e3.addEventListener("click", (t3) => {
              t3.stopPropagation();
              const n3 = document.querySelector(".editorjs-codeCup_languageDropdown");
              n3 ? n3.remove() : this._renderLanguageDropdown(e3);
            }), e3;
          }
          renderSettings() {
            const e3 = document.createElement("div"), t3 = document.createElement("div"), n3 = document.createElement("div");
            if (t3.classList.add("ce-popover-item"), n3.classList.add("ce-popover-item__title"), this.data.showlinenumbers ? n3.innerHTML = "Hide Numbers" : n3.innerHTML = "Show Numbers", t3.innerHTML = '<div class="ce-popover-item__icon ce-popover-item__icon--tool">\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="48" y1="40" x2="208" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M154.91,157.6a40,40,0,0,1-53.82-59.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M135.53,88.71a40,40,0,0,1,32.3,35.53" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M208.61,169.1C230.41,149.58,240,128,240,128S208,56,128,56a126,126,0,0,0-20.68,1.68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M74,68.6C33.23,89.24,16,128,16,128s32,72,112,72a118.05,118.05,0,0,0,54-12.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>\n    </div>', t3.appendChild(n3), t3.addEventListener("click", (e4) => {
              e4.target.classList.toggle(this._CSS.settingsButtonActive), this._toggleLineNumbers(), this.data.showlinenumbers ? n3.innerHTML = "Hide Numbers" : n3.innerHTML = "Show Numbers";
            }), e3.appendChild(t3), this._hasConfiguredLanguages && e3.appendChild(this._renderLanguageSelectContainer()), !this._hasConfiguredLanguages || this._forceShowLanguageInput) {
              const t4 = document.createElement("div");
              t4.classList.add("editorjs-codeCup_inputContainer");
              let n4 = document.createElement("div");
              n4.classList.add("editorjs-codeCup_input"), n4.setAttribute("contenteditable", "true"), n4.setAttribute("data-placeholder", "Enter language..");
              let r3 = document.createElement("div"), i2 = '<div class="ce-popover-item__icon ce-popover-item__icon--tool">\n      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M136,136a8,8,0,0,1,8,8,16,16,0,0,1-16,16,24,24,0,0,1-24-24,32,32,0,0,1,32-32,40,40,0,0,1,40,40,48,48,0,0,1-48,48,56,56,0,0,1-56-56,64,64,0,0,1,64-64,72,72,0,0,1,72,72,80,80,0,0,1-80,80,88,88,0,0,1-88-88,96,96,0,0,1,96-96A104,104,0,0,1,240,144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>\n      </div>';
              r3.innerHTML = i2, r3.classList.add("editorjs-codeCup_inputButton"), r3.addEventListener("click", (e4) => {
                let t5 = n4.textContent;
                "" != t5 && this._updateLanguage(t5) && (n4.textContent = "");
              }), t4.appendChild(n4), t4.appendChild(r3), e3.appendChild(t4);
            }
            return e3;
          }
          _toggleLineNumbers = (e3) => {
            this.data.showlinenumbers = !this.data.showlinenumbers, this.data.editorInstance.toggleLineNumbers();
          };
          _updateLanguage(e3, t3) {
            if (!this._isValidLanguage(e3))
              return this.data.language = "plain", this.data.editorInstance.updateLanguage("none"), this._element.querySelector(".editorjs-codeCup_LangDisplay").innerHTML = "none", this._handleErrorMessage(e3), false;
            const n3 = e3.toLowerCase();
            return this.data.language = "none" === n3 ? "plain" : n3, this.data.editorInstance.updateLanguage(n3), this._element.querySelector(".editorjs-codeCup_LangDisplay").innerHTML = t3 || this._languages[n3] || this.data.language, this._handleErrorMessage(null), true;
          }
          _isValidLanguage = (e3) => {
            if (!e3)
              return false;
            const t3 = e3.toLowerCase();
            if ("none" === t3)
              return true;
            const n3 = Object.keys(k4.Mj);
            return !!new Set(n3).has(t3.toLowerCase()) || n3.some((e4) => {
              const n4 = k4.Mj[e4];
              return !(!n4 || !n4.alias) && (Array.isArray(n4.alias) ? n4.alias : [n4.alias]).includes(t3.toLowerCase());
            });
          };
          _handleErrorMessage = (e3) => {
            if (!this._element)
              return;
            let t3 = this._element.parentNode.querySelector(".editorjs-codeCup_languageErrorMessage");
            e3 ? (t3 || (t3 = document.createElement("div"), t3.classList.add("editorjs-codeCup_languageErrorMessage"), this._element.before(t3)), t3.innerHTML = `\u26A0 Syntax highlighting is unavailable. "${e3}" is not a valid Prism.js language key. <button class="close-error">&times;</button>`, t3.querySelector(".close-error").addEventListener("click", () => {
              t3.remove();
            })) : t3 && t3.remove();
          };
          save(e3) {
            return { code: this.data.editorInstance.getCode(), language: this.data.language, showlinenumbers: this.data.showlinenumbers, showCopyButton: this.data.showCopyButton };
          }
          static get isReadOnlySupported() {
            return true;
          }
          static get toolbox() {
            return { icon: w4(), title: "CodeCup" };
          }
        }
      })(), r2.default;
    })());
  }
});

// ../../node_modules/editorjs-drag-drop/dist/bundle.js
var require_bundle = __commonJS({
  "../../node_modules/editorjs-drag-drop/dist/bundle.js"(exports, module) {
    !function(e, t) {
      "object" == typeof exports && "object" == typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : "object" == typeof exports ? exports.DragDrop = t() : e.DragDrop = t();
    }(self, () => (() => {
      "use strict";
      var e = { 523: (e2, t2, r3) => {
        r3.d(t2, { A: () => c5 });
        var n3 = r3(601), o3 = r3.n(n3), i = r3(314), a3 = r3.n(i)()(o3());
        a3.push([e2.id, '.ce-block--drop-target .ce-block__content:before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: -20px;\n  margin-top: -1px;\n  height: 8px;\n  width: 8px;\n  border: solid #a0a0a0;\n  border-width: 1px 1px 0 0;\n  -webkit-transform-origin: right;\n  transform-origin: right;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg);\n}\n\n.ce-block--drop-target .ce-block__content:after {\n  background: none;\n}\n', ""]);
        const c5 = a3;
      }, 314: (e2) => {
        e2.exports = function(e3) {
          var t2 = [];
          return t2.toString = function() {
            return this.map(function(t3) {
              var r3 = "", n3 = void 0 !== t3[5];
              return t3[4] && (r3 += "@supports (".concat(t3[4], ") {")), t3[2] && (r3 += "@media ".concat(t3[2], " {")), n3 && (r3 += "@layer".concat(t3[5].length > 0 ? " ".concat(t3[5]) : "", " {")), r3 += e3(t3), n3 && (r3 += "}"), t3[2] && (r3 += "}"), t3[4] && (r3 += "}"), r3;
            }).join("");
          }, t2.i = function(e4, r3, n3, o3, i) {
            "string" == typeof e4 && (e4 = [[null, e4, void 0]]);
            var a3 = {};
            if (n3)
              for (var c5 = 0; c5 < this.length; c5++) {
                var s2 = this[c5][0];
                null != s2 && (a3[s2] = true);
              }
            for (var l2 = 0; l2 < e4.length; l2++) {
              var u4 = [].concat(e4[l2]);
              n3 && a3[u4[0]] || (void 0 !== i && (void 0 === u4[5] || (u4[1] = "@layer".concat(u4[5].length > 0 ? " ".concat(u4[5]) : "", " {").concat(u4[1], "}")), u4[5] = i), r3 && (u4[2] ? (u4[1] = "@media ".concat(u4[2], " {").concat(u4[1], "}"), u4[2] = r3) : u4[2] = r3), o3 && (u4[4] ? (u4[1] = "@supports (".concat(u4[4], ") {").concat(u4[1], "}"), u4[4] = o3) : u4[4] = "".concat(o3)), t2.push(u4));
            }
          }, t2;
        };
      }, 601: (e2) => {
        e2.exports = function(e3) {
          return e3[1];
        };
      }, 72: (e2) => {
        var t2 = [];
        function r3(e3) {
          for (var r4 = -1, n4 = 0; n4 < t2.length; n4++)
            if (t2[n4].identifier === e3) {
              r4 = n4;
              break;
            }
          return r4;
        }
        function n3(e3, n4) {
          for (var i = {}, a3 = [], c5 = 0; c5 < e3.length; c5++) {
            var s2 = e3[c5], l2 = n4.base ? s2[0] + n4.base : s2[0], u4 = i[l2] || 0, d3 = "".concat(l2, " ").concat(u4);
            i[l2] = u4 + 1;
            var f4 = r3(d3), p4 = { css: s2[1], media: s2[2], sourceMap: s2[3], supports: s2[4], layer: s2[5] };
            if (-1 !== f4)
              t2[f4].references++, t2[f4].updater(p4);
            else {
              var v4 = o3(p4, n4);
              n4.byIndex = c5, t2.splice(c5, 0, { identifier: d3, updater: v4, references: 1 });
            }
            a3.push(d3);
          }
          return a3;
        }
        function o3(e3, t3) {
          var r4 = t3.domAPI(t3);
          return r4.update(e3), function(t4) {
            if (t4) {
              if (t4.css === e3.css && t4.media === e3.media && t4.sourceMap === e3.sourceMap && t4.supports === e3.supports && t4.layer === e3.layer)
                return;
              r4.update(e3 = t4);
            } else
              r4.remove();
          };
        }
        e2.exports = function(e3, o4) {
          var i = n3(e3 = e3 || [], o4 = o4 || {});
          return function(e4) {
            e4 = e4 || [];
            for (var a3 = 0; a3 < i.length; a3++) {
              var c5 = r3(i[a3]);
              t2[c5].references--;
            }
            for (var s2 = n3(e4, o4), l2 = 0; l2 < i.length; l2++) {
              var u4 = r3(i[l2]);
              0 === t2[u4].references && (t2[u4].updater(), t2.splice(u4, 1));
            }
            i = s2;
          };
        };
      }, 659: (e2) => {
        var t2 = {};
        e2.exports = function(e3, r3) {
          var n3 = function(e4) {
            if (void 0 === t2[e4]) {
              var r4 = document.querySelector(e4);
              if (window.HTMLIFrameElement && r4 instanceof window.HTMLIFrameElement)
                try {
                  r4 = r4.contentDocument.head;
                } catch (e5) {
                  r4 = null;
                }
              t2[e4] = r4;
            }
            return t2[e4];
          }(e3);
          if (!n3)
            throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
          n3.appendChild(r3);
        };
      }, 540: (e2) => {
        e2.exports = function(e3) {
          var t2 = document.createElement("style");
          return e3.setAttributes(t2, e3.attributes), e3.insert(t2, e3.options), t2;
        };
      }, 56: (e2, t2, r3) => {
        e2.exports = function(e3) {
          var t3 = r3.nc;
          t3 && e3.setAttribute("nonce", t3);
        };
      }, 825: (e2) => {
        e2.exports = function(e3) {
          if ("undefined" == typeof document)
            return { update: function() {
            }, remove: function() {
            } };
          var t2 = e3.insertStyleElement(e3);
          return { update: function(r3) {
            !function(e4, t3, r4) {
              var n3 = "";
              r4.supports && (n3 += "@supports (".concat(r4.supports, ") {")), r4.media && (n3 += "@media ".concat(r4.media, " {"));
              var o3 = void 0 !== r4.layer;
              o3 && (n3 += "@layer".concat(r4.layer.length > 0 ? " ".concat(r4.layer) : "", " {")), n3 += r4.css, o3 && (n3 += "}"), r4.media && (n3 += "}"), r4.supports && (n3 += "}");
              var i = r4.sourceMap;
              i && "undefined" != typeof btoa && (n3 += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i)))), " */")), t3.styleTagTransform(n3, e4, t3.options);
            }(t2, e3, r3);
          }, remove: function() {
            !function(e4) {
              if (null === e4.parentNode)
                return false;
              e4.parentNode.removeChild(e4);
            }(t2);
          } };
        };
      }, 113: (e2) => {
        e2.exports = function(e3, t2) {
          if (t2.styleSheet)
            t2.styleSheet.cssText = e3;
          else {
            for (; t2.firstChild; )
              t2.removeChild(t2.firstChild);
            t2.appendChild(document.createTextNode(e3));
          }
        };
      } }, t = {};
      function r2(n3) {
        var o3 = t[n3];
        if (void 0 !== o3)
          return o3.exports;
        var i = t[n3] = { id: n3, exports: {} };
        return e[n3](i, i.exports, r2), i.exports;
      }
      r2.n = (e2) => {
        var t2 = e2 && e2.__esModule ? () => e2.default : () => e2;
        return r2.d(t2, { a: t2 }), t2;
      }, r2.d = (e2, t2) => {
        for (var n3 in t2)
          r2.o(t2, n3) && !r2.o(e2, n3) && Object.defineProperty(e2, n3, { enumerable: true, get: t2[n3] });
      }, r2.o = (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), r2.nc = void 0;
      var n2 = {};
      return (() => {
        r2.d(n2, { default: () => g6 });
        var e2 = r2(72), t2 = r2.n(e2), o3 = r2(825), i = r2.n(o3), a3 = r2(659), c5 = r2.n(a3), s2 = r2(56), l2 = r2.n(s2), u4 = r2(540), d3 = r2.n(u4), f4 = r2(113), p4 = r2.n(f4), v4 = r2(523), y4 = {};
        function h3(e3) {
          return h3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
            return typeof e4;
          } : function(e4) {
            return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
          }, h3(e3);
        }
        function b4(e3, t3) {
          for (var r3 = 0; r3 < t3.length; r3++) {
            var n3 = t3[r3];
            n3.enumerable = n3.enumerable || false, n3.configurable = true, "value" in n3 && (n3.writable = true), Object.defineProperty(e3, m4(n3.key), n3);
          }
        }
        function m4(e3) {
          var t3 = function(e4, t4) {
            if ("object" != h3(e4) || !e4)
              return e4;
            var r3 = e4[Symbol.toPrimitive];
            if (void 0 !== r3) {
              var n3 = r3.call(e4, "string");
              if ("object" != h3(n3))
                return n3;
              throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return String(e4);
          }(e3);
          return "symbol" == h3(t3) ? t3 : t3 + "";
        }
        y4.styleTagTransform = p4(), y4.setAttributes = l2(), y4.insert = c5().bind(null, "head"), y4.domAPI = i(), y4.insertStyleElement = d3(), t2()(v4.A, y4), v4.A && v4.A.locals && v4.A.locals;
        var g6 = function() {
          return e3 = function e4(t4, r4) {
            var n3 = t4.configuration, o4 = t4.blocks, i2 = t4.toolbar, a4 = t4.save;
            !function(e5, t5) {
              if (!(e5 instanceof t5))
                throw new TypeError("Cannot call a class as a function");
            }(this, e4), this.toolbar = i2, this.borderStyle = r4 || "1px dashed #aaa", this.api = o4, this.holder = "string" == typeof n3.holder ? document.getElementById(n3.holder) : n3.holder, this.readOnly = n3.readOnly, this.startBlock = null, this.endBlock = null, this.save = a4, this.setDragListener(), this.setDropListener();
          }, r3 = [{ key: "isReadOnlySupported", get: function() {
            return true;
          } }], (t3 = [{ key: "setElementCursor", value: function(e4) {
            if (e4) {
              var t4 = document.createRange(), r4 = window.getSelection();
              t4.setStart(e4.childNodes[0], 0), t4.collapse(true), r4.removeAllRanges(), r4.addRange(t4), e4.focus();
            }
          } }, { key: "setDragListener", value: function() {
            var e4 = this;
            if (!this.readOnly) {
              var t4 = this.holder.querySelector(".ce-toolbar__settings-btn");
              if (t4)
                this.initializeDragListener(t4);
              else {
                var r4 = new MutationObserver(function(t5, r5) {
                  var n3 = e4.holder.querySelector(".ce-toolbar__settings-btn");
                  n3 && (e4.initializeDragListener(n3), r5.disconnect());
                });
                r4.observe(this.holder, { childList: true, subtree: true });
              }
            }
          } }, { key: "initializeDragListener", value: function(e4) {
            var t4 = this;
            e4.setAttribute("draggable", "true"), e4.addEventListener("dragstart", function() {
              t4.startBlock = t4.api.getCurrentBlockIndex();
            }), e4.addEventListener("drag", function() {
              if (t4.toolbar.close(), !t4.isTheOnlyBlock()) {
                var e5 = t4.holder.querySelectorAll(".ce-block"), r4 = t4.holder.querySelector(".ce-block--drop-target");
                t4.setElementCursor(r4), t4.setBorderBlocks(e5, r4);
              }
            });
          } }, { key: "setBorderBlocks", value: function(e4, t4) {
            var r4 = this;
            Object.values(e4).forEach(function(n3) {
              var o4 = n3.querySelector(".ce-block__content");
              n3 !== t4 ? (o4.style.removeProperty("border-top"), o4.style.removeProperty("border-bottom")) : Object.keys(e4).find(function(r5) {
                return e4[r5] === t4;
              }) > r4.startBlock ? o4.style.borderBottom = r4.borderStyle : o4.style.borderTop = r4.borderStyle;
            });
          } }, { key: "setDropListener", value: function() {
            var e4 = this;
            document.addEventListener("drop", function(t4) {
              var r4 = t4.target;
              if (e4.holder.contains(r4) && null !== e4.startBlock) {
                var n3 = e4.getDropTarget(r4);
                if (n3) {
                  var o4 = n3.querySelector(".ce-block__content");
                  o4.style.removeProperty("border-top"), o4.style.removeProperty("border-bottom"), e4.endBlock = e4.getTargetPosition(n3), e4.moveBlocks();
                }
              }
              e4.startBlock = null;
            });
          } }, { key: "getDropTarget", value: function(e4) {
            return e4.classList.contains("ce-block") ? e4 : e4.closest(".ce-block");
          } }, { key: "getTargetPosition", value: function(e4) {
            return Array.from(e4.parentNode.children).indexOf(e4);
          } }, { key: "isTheOnlyBlock", value: function() {
            return 1 === this.api.getBlocksCount();
          } }, { key: "moveBlocks", value: function() {
            this.isTheOnlyBlock() || this.api.move(this.endBlock, this.startBlock);
          } }]) && b4(e3.prototype, t3), r3 && b4(e3, r3), Object.defineProperty(e3, "prototype", { writable: false }), e3;
          var e3, t3, r3;
        }();
      })(), n2.default;
    })());
  }
});

// ../core/jupiter/core/infra/component/block-editor.tsx
var import_editorjs_codecup = __toESM(require_editorjs_codeCup_bundle(), 1);

// ../../node_modules/@editorjs/checklist/dist/checklist.mjs
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.appendChild(document.createTextNode('.cdx-checklist{gap:6px;display:flex;flex-direction:column}.cdx-checklist__item{display:flex;box-sizing:content-box;align-items:flex-start}.cdx-checklist__item-text{outline:none;flex-grow:1;line-height:1.57em}.cdx-checklist__item-checkbox{width:22px;height:22px;display:flex;align-items:center;margin-right:8px;margin-top:calc(.785em - 11px);cursor:pointer}.cdx-checklist__item-checkbox svg{opacity:0;height:20px;width:20px;position:absolute;left:-1px;top:-1px;max-height:20px}@media (hover: hover){.cdx-checklist__item-checkbox:not(.cdx-checklist__item-checkbox--no-hover):hover .cdx-checklist__item-checkbox-check svg{opacity:1}}.cdx-checklist__item-checkbox-check{cursor:pointer;display:inline-block;flex-shrink:0;position:relative;width:20px;height:20px;box-sizing:border-box;margin-left:0;border-radius:5px;border:1px solid #C9C9C9;background:#fff}.cdx-checklist__item-checkbox-check:before{content:"";position:absolute;top:0;right:0;bottom:0;left:0;border-radius:100%;background-color:#369fff;visibility:hidden;pointer-events:none;transform:scale(1);transition:transform .4s ease-out,opacity .4s}@media (hover: hover){.cdx-checklist__item--checked .cdx-checklist__item-checkbox:not(.cdx-checklist__item--checked .cdx-checklist__item-checkbox--no-hover):hover .cdx-checklist__item-checkbox-check{background:#0059AB;border-color:#0059ab}}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check{background:#369FFF;border-color:#369fff}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check svg{opacity:1}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check svg path{stroke:#fff}.cdx-checklist__item--checked .cdx-checklist__item-checkbox-check:before{opacity:0;visibility:visible;transform:scale(2.5)}')), document.head.appendChild(e);
    }
  } catch (c5) {
    console.error("vite-plugin-css-injected-by-js", c5);
  }
})();
var k = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 12L10.4884 15.8372C10.5677 15.9245 10.705 15.9245 10.7844 15.8372L17 9"/></svg>';
var g = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9.2 12L11.0586 13.8586C11.1367 13.9367 11.2633 13.9367 11.3414 13.8586L14.7 10.5"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
function d() {
  const s2 = document.activeElement, t = window.getSelection().getRangeAt(0), n2 = t.cloneRange();
  return n2.selectNodeContents(s2), n2.setStart(t.endContainer, t.endOffset), n2.extractContents();
}
function C(s2) {
  const e = document.createElement("div");
  return e.appendChild(s2), e.innerHTML;
}
function c(s2, e = null, t = {}) {
  const n2 = document.createElement(s2);
  Array.isArray(e) ? n2.classList.add(...e) : e && n2.classList.add(e);
  for (const i in t)
    n2[i] = t[i];
  return n2;
}
function m(s2) {
  return s2.innerHTML.replace("<br>", " ").trim();
}
function p(s2, e = false, t = void 0) {
  const n2 = document.createRange(), i = window.getSelection();
  n2.selectNodeContents(s2), t !== void 0 && (n2.setStart(s2, t), n2.setEnd(s2, t)), n2.collapse(e), i.removeAllRanges(), i.addRange(n2);
}
Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
Element.prototype.closest || (Element.prototype.closest = function(s2) {
  let e = this;
  if (!document.documentElement.contains(e))
    return null;
  do {
    if (e.matches(s2))
      return e;
    e = e.parentElement || e.parentNode;
  } while (e !== null && e.nodeType === 1);
  return null;
});
var f = class {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Allow to use native Enter behaviour
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: g,
      title: "Checklist"
    };
  }
  /**
   * Allow Checkbox Tool to be converted to/from other block
   *
   * @returns {{export: Function, import: Function}}
   */
  static get conversionConfig() {
    return {
      /**
       * To create exported string from the checkbox, concatenate items by dot-symbol.
       *
       * @param {ChecklistData} data - checklist data to create a string from that
       * @returns {string}
       */
      export: (e) => e.items.map(({ text: t }) => t).join(". "),
      /**
       * To create a checklist from other block's string, just put it at the first item
       *
       * @param {string} string - string to create list tool data from that
       * @returns {ChecklistData}
       */
      import: (e) => ({
        items: [
          {
            text: e,
            checked: false
          }
        ]
      })
    };
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} options - block constructor options
   * @param {ChecklistData} options.data - previously saved data
   * @param {object} options.config - user config for Tool
   * @param {object} options.api - Editor.js API
   * @param {boolean} options.readOnly - read only mode flag
   */
  constructor({ data: e, config: t, api: n2, readOnly: i }) {
    this._elements = {
      wrapper: null,
      items: []
    }, this.readOnly = i, this.api = n2, this.data = e || {};
  }
  /**
   * Returns checklist tag with items
   *
   * @returns {Element}
   */
  render() {
    return this._elements.wrapper = c("div", [this.CSS.baseBlock, this.CSS.wrapper]), this.data.items || (this.data.items = [
      {
        text: "",
        checked: false
      }
    ]), this.data.items.forEach((e) => {
      const t = this.createChecklistItem(e);
      this._elements.wrapper.appendChild(t);
    }), this.readOnly ? this._elements.wrapper : (this._elements.wrapper.addEventListener("keydown", (e) => {
      const [t, n2] = [13, 8];
      switch (e.keyCode) {
        case t:
          this.enterPressed(e);
          break;
        case n2:
          this.backspace(e);
          break;
      }
    }, false), this._elements.wrapper.addEventListener("click", (e) => {
      this.toggleCheckbox(e);
    }), this._elements.wrapper);
  }
  /**
   * Return Checklist data
   *
   * @returns {ChecklistData}
   */
  save() {
    let e = this.items.map((t) => {
      const n2 = this.getItemInput(t);
      return {
        text: m(n2),
        checked: t.classList.contains(this.CSS.itemChecked)
      };
    });
    return e = e.filter((t) => t.text.trim().length !== 0), {
      items: e
    };
  }
  /**
   * Validate data: check if Checklist has items
   *
   * @param {ChecklistData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return !!e.items.length;
  }
  /**
   * Toggle checklist item state
   *
   * @param {MouseEvent} event - click
   * @returns {void}
   */
  toggleCheckbox(e) {
    const t = e.target.closest(`.${this.CSS.item}`), n2 = t.querySelector(`.${this.CSS.checkboxContainer}`);
    n2.contains(e.target) && (t.classList.toggle(this.CSS.itemChecked), n2.classList.add(this.CSS.noHover), n2.addEventListener("mouseleave", () => this.removeSpecialHoverBehavior(n2), { once: true }));
  }
  /**
   * Create Checklist items
   *
   * @param {ChecklistItem} item - data.item
   * @returns {Element} checkListItem - new element of checklist
   */
  createChecklistItem(e = {}) {
    const t = c("div", this.CSS.item), n2 = c("span", this.CSS.checkbox), i = c("div", this.CSS.checkboxContainer), o3 = c("div", this.CSS.textField, {
      innerHTML: e.text ? e.text : "",
      contentEditable: !this.readOnly
    });
    return e.checked && t.classList.add(this.CSS.itemChecked), n2.innerHTML = k, i.appendChild(n2), t.appendChild(i), t.appendChild(o3), t;
  }
  /**
   * Append new elements to the list by pressing Enter
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  enterPressed(e) {
    e.preventDefault();
    const t = this.items, n2 = document.activeElement.closest(`.${this.CSS.item}`);
    if (t.indexOf(n2) === t.length - 1 && m(this.getItemInput(n2)).length === 0) {
      const u4 = this.api.blocks.getCurrentBlockIndex();
      n2.remove(), this.api.blocks.insert(), this.api.caret.setToBlock(u4 + 1);
      return;
    }
    const a3 = d(), l2 = C(a3), r2 = this.createChecklistItem({
      text: l2,
      checked: false
    });
    this._elements.wrapper.insertBefore(r2, n2.nextSibling), p(this.getItemInput(r2), true);
  }
  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  backspace(e) {
    const t = e.target.closest(`.${this.CSS.item}`), n2 = this.items.indexOf(t), i = this.items[n2 - 1];
    if (!i || !(window.getSelection().focusOffset === 0))
      return;
    e.preventDefault();
    const l2 = d(), r2 = this.getItemInput(i), h3 = r2.childNodes.length;
    r2.appendChild(l2), p(r2, void 0, h3), t.remove();
  }
  /**
   * Styles
   *
   * @private
   * @returns {object<string>}
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      wrapper: "cdx-checklist",
      item: "cdx-checklist__item",
      itemChecked: "cdx-checklist__item--checked",
      noHover: "cdx-checklist__item-checkbox--no-hover",
      checkbox: "cdx-checklist__item-checkbox-check",
      textField: "cdx-checklist__item-text",
      checkboxContainer: "cdx-checklist__item-checkbox"
    };
  }
  /**
   * Return all items elements
   *
   * @returns {Element[]}
   */
  get items() {
    return Array.from(this._elements.wrapper.querySelectorAll(`.${this.CSS.item}`));
  }
  /**
   * Removes class responsible for special hover behavior on an item
   * 
   * @private
   * @param {Element} el - item wrapper
   * @returns {Element}
   */
  removeSpecialHoverBehavior(e) {
    e.classList.remove(this.CSS.noHover);
  }
  /**
   * Find and return item's content editable element
   *
   * @private
   * @param {Element} el - item wrapper
   * @returns {Element}
   */
  getItemInput(e) {
    return e.querySelector(`.${this.CSS.textField}`);
  }
};

// ../../node_modules/@editorjs/delimiter/dist/delimiter.mjs
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.appendChild(document.createTextNode('.ce-delimiter{line-height:1.6em;width:100%;text-align:center}.ce-delimiter:before{display:inline-block;content:"***";font-size:30px;line-height:65px;height:30px;letter-spacing:.2em}')), document.head.appendChild(e);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
var r = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="6" x2="10" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="14" x2="18" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>';
var n = class {
  /**
   * Notify core that read-only mode is supported
   * @return {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Allow Tool to have no content
   * @return {boolean}
   */
  static get contentless() {
    return true;
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: DelimiterData, config: object, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data: t, config: s2, api: e }) {
    this.api = e, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-delimiter"
    }, this._element = this.drawView(), this.data = t;
  }
  /**
   * Create Tool's view
   * @return {HTMLDivElement}
   * @private
   */
  drawView() {
    let t = document.createElement("div");
    return t.classList.add(this._CSS.wrapper, this._CSS.block), t;
  }
  /**
   * Return Tool's view
   * @returns {HTMLDivElement}
   * @public
   */
  render() {
    return this._element;
  }
  /**
   * Extract Tool's data from the view
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {DelimiterData} - saved data
   * @public
   */
  save(t) {
    return {};
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: r,
      title: "Delimiter"
    };
  }
  /**
   * Delimiter onPaste configuration
   *
   * @public
   */
  static get pasteConfig() {
    return { tags: ["HR"] };
  }
  /**
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(t) {
    this.data = {};
  }
};

// ../../node_modules/@editorjs/editorjs/dist/editorjs.mjs
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.appendChild(document.createTextNode(".ce-hint--align-start{text-align:left}.ce-hint--align-center{text-align:center}.ce-hint__description{opacity:.6;margin-top:3px}")), document.head.appendChild(e);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
var Ce = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {};
function Ke(n2) {
  return n2 && n2.__esModule && Object.prototype.hasOwnProperty.call(n2, "default") ? n2.default : n2;
}
function Xn(n2) {
  if (n2.__esModule)
    return n2;
  var e = n2.default;
  if (typeof e == "function") {
    var t = function o3() {
      return this instanceof o3 ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: true }), Object.keys(n2).forEach(function(o3) {
    var i = Object.getOwnPropertyDescriptor(n2, o3);
    Object.defineProperty(t, o3, i.get ? i : {
      enumerable: true,
      get: function() {
        return n2[o3];
      }
    });
  }), t;
}
function ot() {
}
Object.assign(ot, {
  default: ot,
  register: ot,
  revert: function() {
  },
  __esModule: true
});
Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(n2) {
  const e = (this.document || this.ownerDocument).querySelectorAll(n2);
  let t = e.length;
  for (; --t >= 0 && e.item(t) !== this; )
    ;
  return t > -1;
});
Element.prototype.closest || (Element.prototype.closest = function(n2) {
  let e = this;
  if (!document.documentElement.contains(e))
    return null;
  do {
    if (e.matches(n2))
      return e;
    e = e.parentElement || e.parentNode;
  } while (e !== null);
  return null;
});
Element.prototype.prepend || (Element.prototype.prepend = function(e) {
  const t = document.createDocumentFragment();
  Array.isArray(e) || (e = [e]), e.forEach((o3) => {
    const i = o3 instanceof Node;
    t.appendChild(i ? o3 : document.createTextNode(o3));
  }), this.insertBefore(t, this.firstChild);
});
Element.prototype.scrollIntoViewIfNeeded || (Element.prototype.scrollIntoViewIfNeeded = function(n2) {
  n2 = arguments.length === 0 ? true : !!n2;
  const e = this.parentNode, t = window.getComputedStyle(e, null), o3 = parseInt(t.getPropertyValue("border-top-width")), i = parseInt(t.getPropertyValue("border-left-width")), s2 = this.offsetTop - e.offsetTop < e.scrollTop, r2 = this.offsetTop - e.offsetTop + this.clientHeight - o3 > e.scrollTop + e.clientHeight, a3 = this.offsetLeft - e.offsetLeft < e.scrollLeft, l2 = this.offsetLeft - e.offsetLeft + this.clientWidth - i > e.scrollLeft + e.clientWidth, c5 = s2 && !r2;
  (s2 || r2) && n2 && (e.scrollTop = this.offsetTop - e.offsetTop - e.clientHeight / 2 - o3 + this.clientHeight / 2), (a3 || l2) && n2 && (e.scrollLeft = this.offsetLeft - e.offsetLeft - e.clientWidth / 2 - i + this.clientWidth / 2), (s2 || r2 || a3 || l2) && !n2 && this.scrollIntoView(c5);
});
window.requestIdleCallback = window.requestIdleCallback || function(n2) {
  const e = Date.now();
  return setTimeout(function() {
    n2({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - e));
      }
    });
  }, 1);
};
window.cancelIdleCallback = window.cancelIdleCallback || function(n2) {
  clearTimeout(n2);
};
var Vn = (n2 = 21) => crypto.getRandomValues(new Uint8Array(n2)).reduce((e, t) => (t &= 63, t < 36 ? e += t.toString(36) : t < 62 ? e += (t - 26).toString(36).toUpperCase() : t > 62 ? e += "-" : e += "_", e), "");
var Lo = /* @__PURE__ */ ((n2) => (n2.VERBOSE = "VERBOSE", n2.INFO = "INFO", n2.WARN = "WARN", n2.ERROR = "ERROR", n2))(Lo || {});
var y = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  SLASH: 191
};
var qn = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4
};
function Ie(n2, e, t = "log", o3, i = "color: inherit") {
  if (!("console" in window) || !window.console[t])
    return;
  const s2 = ["info", "log", "warn", "error"].includes(t), r2 = [];
  switch (Ie.logLevel) {
    case "ERROR":
      if (t !== "error")
        return;
      break;
    case "WARN":
      if (!["error", "warn"].includes(t))
        return;
      break;
    case "INFO":
      if (!s2 || n2)
        return;
      break;
  }
  o3 && r2.push(o3);
  const a3 = "Editor.js 2.31.1", l2 = `line-height: 1em;
            color: #006FEA;
            display: inline-block;
            font-size: 11px;
            line-height: 1em;
            background-color: #fff;
            padding: 4px 9px;
            border-radius: 30px;
            border: 1px solid rgba(56, 138, 229, 0.16);
            margin: 4px 5px 4px 0;`;
  n2 && (s2 ? (r2.unshift(l2, i), e = `%c${a3}%c ${e}`) : e = `( ${a3} )${e}`);
  try {
    s2 ? o3 ? console[t](`${e} %o`, ...r2) : console[t](e, ...r2) : console[t](e);
  } catch {
  }
}
Ie.logLevel = "VERBOSE";
function Zn(n2) {
  Ie.logLevel = n2;
}
var S = Ie.bind(window, false);
var X = Ie.bind(window, true);
function le(n2) {
  return Object.prototype.toString.call(n2).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function A(n2) {
  return le(n2) === "function" || le(n2) === "asyncfunction";
}
function D(n2) {
  return le(n2) === "object";
}
function te(n2) {
  return le(n2) === "string";
}
function Gn(n2) {
  return le(n2) === "boolean";
}
function yo(n2) {
  return le(n2) === "number";
}
function wo(n2) {
  return le(n2) === "undefined";
}
function V(n2) {
  return n2 ? Object.keys(n2).length === 0 && n2.constructor === Object : true;
}
function Po(n2) {
  return n2 > 47 && n2 < 58 || // number keys
  n2 === 32 || n2 === 13 || // Space bar & return key(s)
  n2 === 229 || // processing key input for certain languages — Chinese, Japanese, etc.
  n2 > 64 && n2 < 91 || // letter keys
  n2 > 95 && n2 < 112 || // Numpad keys
  n2 > 185 && n2 < 193 || // ;=,-./` (in order)
  n2 > 218 && n2 < 223;
}
async function Qn(n2, e = () => {
}, t = () => {
}) {
  async function o3(i, s2, r2) {
    try {
      await i.function(i.data), await s2(wo(i.data) ? {} : i.data);
    } catch {
      r2(wo(i.data) ? {} : i.data);
    }
  }
  return n2.reduce(async (i, s2) => (await i, o3(s2, e, t)), Promise.resolve());
}
function No(n2) {
  return Array.prototype.slice.call(n2);
}
function Fe(n2, e) {
  return function() {
    const t = this, o3 = arguments;
    window.setTimeout(() => n2.apply(t, o3), e);
  };
}
function Jn(n2) {
  return n2.name.split(".").pop();
}
function ei(n2) {
  return /^[-\w]+\/([-+\w]+|\*)$/.test(n2);
}
function Eo(n2, e, t) {
  let o3;
  return (...i) => {
    const s2 = this, r2 = () => {
      o3 = null, t || n2.apply(s2, i);
    }, a3 = t && !o3;
    window.clearTimeout(o3), o3 = window.setTimeout(r2, e), a3 && n2.apply(s2, i);
  };
}
function dt(n2, e, t = void 0) {
  let o3, i, s2, r2 = null, a3 = 0;
  t || (t = {});
  const l2 = function() {
    a3 = t.leading === false ? 0 : Date.now(), r2 = null, s2 = n2.apply(o3, i), r2 || (o3 = i = null);
  };
  return function() {
    const c5 = Date.now();
    !a3 && t.leading === false && (a3 = c5);
    const d3 = e - (c5 - a3);
    return o3 = this, i = arguments, d3 <= 0 || d3 > e ? (r2 && (clearTimeout(r2), r2 = null), a3 = c5, s2 = n2.apply(o3, i), r2 || (o3 = i = null)) : !r2 && t.trailing !== false && (r2 = setTimeout(l2, d3)), s2;
  };
}
function ti() {
  const n2 = {
    win: false,
    mac: false,
    x11: false,
    linux: false
  }, e = Object.keys(n2).find((t) => window.navigator.appVersion.toLowerCase().indexOf(t) !== -1);
  return e && (n2[e] = true), n2;
}
function je(n2) {
  return n2[0].toUpperCase() + n2.slice(1);
}
function ut(n2, ...e) {
  if (!e.length)
    return n2;
  const t = e.shift();
  if (D(n2) && D(t))
    for (const o3 in t)
      D(t[o3]) ? (n2[o3] || Object.assign(n2, { [o3]: {} }), ut(n2[o3], t[o3])) : Object.assign(n2, { [o3]: t[o3] });
  return ut(n2, ...e);
}
function vt(n2) {
  const e = ti();
  return n2 = n2.replace(/shift/gi, "\u21E7").replace(/backspace/gi, "\u232B").replace(/enter/gi, "\u23CE").replace(/up/gi, "\u2191").replace(/left/gi, "\u2192").replace(/down/gi, "\u2193").replace(/right/gi, "\u2190").replace(/escape/gi, "\u238B").replace(/insert/gi, "Ins").replace(/delete/gi, "\u2421").replace(/\+/gi, " + "), e.mac ? n2 = n2.replace(/ctrl|cmd/gi, "\u2318").replace(/alt/gi, "\u2325") : n2 = n2.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), n2;
}
function oi(n2) {
  try {
    return new URL(n2).href;
  } catch {
  }
  return n2.substring(0, 2) === "//" ? window.location.protocol + n2 : window.location.origin + n2;
}
function ni() {
  return Vn(10);
}
function ii(n2) {
  window.open(n2, "_blank");
}
function si(n2 = "") {
  return `${n2}${Math.floor(Math.random() * 1e8).toString(16)}`;
}
function ht(n2, e, t) {
  const o3 = `\xAB${e}\xBB is deprecated and will be removed in the next major release. Please use the \xAB${t}\xBB instead.`;
  n2 && X(o3, "warn");
}
function me(n2, e, t) {
  const o3 = t.value ? "value" : "get", i = t[o3], s2 = `#${e}Cache`;
  if (t[o3] = function(...r2) {
    return this[s2] === void 0 && (this[s2] = i.apply(this, ...r2)), this[s2];
  }, o3 === "get" && t.set) {
    const r2 = t.set;
    t.set = function(a3) {
      delete n2[s2], r2.apply(this, a3);
    };
  }
  return t;
}
var Ro = 650;
function be() {
  return window.matchMedia(`(max-width: ${Ro}px)`).matches;
}
var pt = typeof window < "u" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function ri(n2, e) {
  const t = Array.isArray(n2) || D(n2), o3 = Array.isArray(e) || D(e);
  return t || o3 ? JSON.stringify(n2) === JSON.stringify(e) : n2 === e;
}
var u = class {
  /**
   * Check if passed tag has no closed tag
   *
   * @param {HTMLElement} tag - element to check
   * @returns {boolean}
   */
  static isSingleTag(e) {
    return e.tagName && [
      "AREA",
      "BASE",
      "BR",
      "COL",
      "COMMAND",
      "EMBED",
      "HR",
      "IMG",
      "INPUT",
      "KEYGEN",
      "LINK",
      "META",
      "PARAM",
      "SOURCE",
      "TRACK",
      "WBR"
    ].includes(e.tagName);
  }
  /**
   * Check if element is BR or WBR
   *
   * @param {HTMLElement} element - element to check
   * @returns {boolean}
   */
  static isLineBreakTag(e) {
    return e && e.tagName && [
      "BR",
      "WBR"
    ].includes(e.tagName);
  }
  /**
   * Helper for making Elements with class name and attributes
   *
   * @param  {string} tagName - new Element tag name
   * @param  {string[]|string} [classNames] - list or name of CSS class name(s)
   * @param  {object} [attributes] - any attributes
   * @returns {HTMLElement}
   */
  static make(e, t = null, o3 = {}) {
    const i = document.createElement(e);
    if (Array.isArray(t)) {
      const s2 = t.filter((r2) => r2 !== void 0);
      i.classList.add(...s2);
    } else
      t && i.classList.add(t);
    for (const s2 in o3)
      Object.prototype.hasOwnProperty.call(o3, s2) && (i[s2] = o3[s2]);
    return i;
  }
  /**
   * Creates Text Node with the passed content
   *
   * @param {string} content - text content
   * @returns {Text}
   */
  static text(e) {
    return document.createTextNode(e);
  }
  /**
   * Append one or several elements to the parent
   *
   * @param  {Element|DocumentFragment} parent - where to append
   * @param  {Element|Element[]|DocumentFragment|Text|Text[]} elements - element or elements list
   */
  static append(e, t) {
    Array.isArray(t) ? t.forEach((o3) => e.appendChild(o3)) : e.appendChild(t);
  }
  /**
   * Append element or a couple to the beginning of the parent elements
   *
   * @param {Element} parent - where to append
   * @param {Element|Element[]} elements - element or elements list
   */
  static prepend(e, t) {
    Array.isArray(t) ? (t = t.reverse(), t.forEach((o3) => e.prepend(o3))) : e.prepend(t);
  }
  /**
   * Swap two elements in parent
   *
   * @param {HTMLElement} el1 - from
   * @param {HTMLElement} el2 - to
   * @deprecated
   */
  static swap(e, t) {
    const o3 = document.createElement("div"), i = e.parentNode;
    i.insertBefore(o3, e), i.insertBefore(e, t), i.insertBefore(t, o3), i.removeChild(o3);
  }
  /**
   * Selector Decorator
   *
   * Returns first match
   *
   * @param {Element} el - element we searching inside. Default - DOM Document
   * @param {string} selector - searching string
   * @returns {Element}
   */
  static find(e = document, t) {
    return e.querySelector(t);
  }
  /**
   * Get Element by Id
   *
   * @param {string} id - id to find
   * @returns {HTMLElement | null}
   */
  static get(e) {
    return document.getElementById(e);
  }
  /**
   * Selector Decorator.
   *
   * Returns all matches
   *
   * @param {Element|Document} el - element we searching inside. Default - DOM Document
   * @param {string} selector - searching string
   * @returns {NodeList}
   */
  static findAll(e = document, t) {
    return e.querySelectorAll(t);
  }
  /**
   * Returns CSS selector for all text inputs
   */
  static get allInputsSelector() {
    return "[contenteditable=true], textarea, input:not([type]), " + ["text", "password", "email", "number", "search", "tel", "url"].map((t) => `input[type="${t}"]`).join(", ");
  }
  /**
   * Find all contenteditable, textarea and editable input elements passed holder contains
   *
   * @param holder - element where to find inputs
   */
  static findAllInputs(e) {
    return No(e.querySelectorAll(u.allInputsSelector)).reduce((t, o3) => u.isNativeInput(o3) || u.containsOnlyInlineElements(o3) ? [...t, o3] : [...t, ...u.getDeepestBlockElements(o3)], []);
  }
  /**
   * Search for deepest node which is Leaf.
   * Leaf is the vertex that doesn't have any child nodes
   *
   * @description Method recursively goes throw the all Node until it finds the Leaf
   * @param {Node} node - root Node. From this vertex we start Deep-first search
   *                      {@link https://en.wikipedia.org/wiki/Depth-first_search}
   * @param {boolean} [atLast] - find last text node
   * @returns - it can be text Node or Element Node, so that caret will able to work with it
   *            Can return null if node is Document or DocumentFragment, or node is not attached to the DOM
   */
  static getDeepestNode(e, t = false) {
    const o3 = t ? "lastChild" : "firstChild", i = t ? "previousSibling" : "nextSibling";
    if (e && e.nodeType === Node.ELEMENT_NODE && e[o3]) {
      let s2 = e[o3];
      if (u.isSingleTag(s2) && !u.isNativeInput(s2) && !u.isLineBreakTag(s2))
        if (s2[i])
          s2 = s2[i];
        else if (s2.parentNode[i])
          s2 = s2.parentNode[i];
        else
          return s2.parentNode;
      return this.getDeepestNode(s2, t);
    }
    return e;
  }
  /**
   * Check if object is DOM node
   *
   * @param {*} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isElement(e) {
    return yo(e) ? false : e && e.nodeType && e.nodeType === Node.ELEMENT_NODE;
  }
  /**
   * Check if object is DocumentFragment node
   *
   * @param {object} node - object to check
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isFragment(e) {
    return yo(e) ? false : e && e.nodeType && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
  }
  /**
   * Check if passed element is contenteditable
   *
   * @param {HTMLElement} element - html element to check
   * @returns {boolean}
   */
  static isContentEditable(e) {
    return e.contentEditable === "true";
  }
  /**
   * Checks target if it is native input
   *
   * @param {*} target - HTML element or string
   * @returns {boolean}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNativeInput(e) {
    const t = [
      "INPUT",
      "TEXTAREA"
    ];
    return e && e.tagName ? t.includes(e.tagName) : false;
  }
  /**
   * Checks if we can set caret
   *
   * @param {HTMLElement} target - target to check
   * @returns {boolean}
   */
  static canSetCaret(e) {
    let t = true;
    if (u.isNativeInput(e))
      switch (e.type) {
        case "file":
        case "checkbox":
        case "radio":
        case "hidden":
        case "submit":
        case "button":
        case "image":
        case "reset":
          t = false;
          break;
      }
    else
      t = u.isContentEditable(e);
    return t;
  }
  /**
   * Checks node if it is empty
   *
   * @description Method checks simple Node without any childs for emptiness
   * If you have Node with 2 or more children id depth, you better use {@link Dom#isEmpty} method
   * @param {Node} node - node to check
   * @param {string} [ignoreChars] - char or substring to treat as empty
   * @returns {boolean} true if it is empty
   */
  static isNodeEmpty(e, t) {
    let o3;
    return this.isSingleTag(e) && !this.isLineBreakTag(e) ? false : (this.isElement(e) && this.isNativeInput(e) ? o3 = e.value : o3 = e.textContent.replace("\u200B", ""), t && (o3 = o3.replace(new RegExp(t, "g"), "")), o3.length === 0);
  }
  /**
   * checks node if it is doesn't have any child nodes
   *
   * @param {Node} node - node to check
   * @returns {boolean}
   */
  static isLeaf(e) {
    return e ? e.childNodes.length === 0 : false;
  }
  /**
   * breadth-first search (BFS)
   * {@link https://en.wikipedia.org/wiki/Breadth-first_search}
   *
   * @description Pushes to stack all DOM leafs and checks for emptiness
   * @param {Node} node - node to check
   * @param {string} [ignoreChars] - char or substring to treat as empty
   * @returns {boolean}
   */
  static isEmpty(e, t) {
    const o3 = [e];
    for (; o3.length > 0; )
      if (e = o3.shift(), !!e) {
        if (this.isLeaf(e) && !this.isNodeEmpty(e, t))
          return false;
        e.childNodes && o3.push(...Array.from(e.childNodes));
      }
    return true;
  }
  /**
   * Check if string contains html elements
   *
   * @param {string} str - string to check
   * @returns {boolean}
   */
  static isHTMLString(e) {
    const t = u.make("div");
    return t.innerHTML = e, t.childElementCount > 0;
  }
  /**
   * Return length of node`s text content
   *
   * @param {Node} node - node with content
   * @returns {number}
   */
  static getContentLength(e) {
    return u.isNativeInput(e) ? e.value.length : e.nodeType === Node.TEXT_NODE ? e.length : e.textContent.length;
  }
  /**
   * Return array of names of block html elements
   *
   * @returns {string[]}
   */
  static get blockElements() {
    return [
      "address",
      "article",
      "aside",
      "blockquote",
      "canvas",
      "div",
      "dl",
      "dt",
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
      "header",
      "hgroup",
      "hr",
      "li",
      "main",
      "nav",
      "noscript",
      "ol",
      "output",
      "p",
      "pre",
      "ruby",
      "section",
      "table",
      "tbody",
      "thead",
      "tr",
      "tfoot",
      "ul",
      "video"
    ];
  }
  /**
   * Check if passed content includes only inline elements
   *
   * @param {string|HTMLElement} data - element or html string
   * @returns {boolean}
   */
  static containsOnlyInlineElements(e) {
    let t;
    te(e) ? (t = document.createElement("div"), t.innerHTML = e) : t = e;
    const o3 = (i) => !u.blockElements.includes(i.tagName.toLowerCase()) && Array.from(i.children).every(o3);
    return Array.from(t.children).every(o3);
  }
  /**
   * Find and return all block elements in the passed parent (including subtree)
   *
   * @param {HTMLElement} parent - root element
   * @returns {HTMLElement[]}
   */
  static getDeepestBlockElements(e) {
    return u.containsOnlyInlineElements(e) ? [e] : Array.from(e.children).reduce((t, o3) => [...t, ...u.getDeepestBlockElements(o3)], []);
  }
  /**
   * Helper for get holder from {string} or return HTMLElement
   *
   * @param {string | HTMLElement} element - holder's id or holder's HTML Element
   * @returns {HTMLElement}
   */
  static getHolder(e) {
    return te(e) ? document.getElementById(e) : e;
  }
  /**
   * Returns true if element is anchor (is A tag)
   *
   * @param {Element} element - element to check
   * @returns {boolean}
   */
  static isAnchor(e) {
    return e.tagName.toLowerCase() === "a";
  }
  /**
   * Return element's offset related to the document
   *
   * @todo handle case when editor initialized in scrollable popup
   * @param el - element to compute offset
   */
  static offset(e) {
    const t = e.getBoundingClientRect(), o3 = window.pageXOffset || document.documentElement.scrollLeft, i = window.pageYOffset || document.documentElement.scrollTop, s2 = t.top + i, r2 = t.left + o3;
    return {
      top: s2,
      left: r2,
      bottom: s2 + t.height,
      right: r2 + t.width
    };
  }
  /**
   * Find text node and offset by total content offset
   *
   * @param {Node} root - root node to start search from
   * @param {number} totalOffset - offset relative to the root node content
   * @returns {{node: Node | null, offset: number}} - node and offset inside node
   */
  static getNodeByOffset(e, t) {
    let o3 = 0, i = null;
    const s2 = document.createTreeWalker(
      e,
      NodeFilter.SHOW_TEXT,
      null
    );
    let r2 = s2.nextNode();
    for (; r2; ) {
      const c5 = r2.textContent, d3 = c5 === null ? 0 : c5.length;
      if (i = r2, o3 + d3 >= t)
        break;
      o3 += d3, r2 = s2.nextNode();
    }
    if (!i)
      return {
        node: null,
        offset: 0
      };
    const a3 = i.textContent;
    if (a3 === null || a3.length === 0)
      return {
        node: null,
        offset: 0
      };
    const l2 = Math.min(t - o3, a3.length);
    return {
      node: i,
      offset: l2
    };
  }
};
function ai(n2) {
  return !/[^\t\n\r ]/.test(n2);
}
function li(n2) {
  const e = window.getComputedStyle(n2), t = parseFloat(e.fontSize), o3 = parseFloat(e.lineHeight) || t * 1.2, i = parseFloat(e.paddingTop), s2 = parseFloat(e.borderTopWidth), r2 = parseFloat(e.marginTop), a3 = t * 0.8, l2 = (o3 - t) / 2;
  return r2 + s2 + i + l2 + a3;
}
function Do(n2) {
  n2.dataset.empty = u.isEmpty(n2) ? "true" : "false";
}
var ci = {
  blockTunes: {
    toggler: {
      "Click to tune": "",
      "or drag to move": ""
    }
  },
  inlineToolbar: {
    converter: {
      "Convert to": ""
    }
  },
  toolbar: {
    toolbox: {
      Add: ""
    }
  },
  popover: {
    Filter: "",
    "Nothing found": "",
    "Convert to": ""
  }
};
var di = {
  Text: "",
  Link: "",
  Bold: "",
  Italic: ""
};
var ui = {
  link: {
    "Add a link": ""
  },
  stub: {
    "The block can not be displayed correctly.": ""
  }
};
var hi = {
  delete: {
    Delete: "",
    "Click to delete": ""
  },
  moveUp: {
    "Move up": ""
  },
  moveDown: {
    "Move down": ""
  }
};
var Fo = {
  ui: ci,
  toolNames: di,
  tools: ui,
  blockTunes: hi
};
var jo = class he {
  /**
   * Type-safe translation for internal UI texts:
   * Perform translation of the string by namespace and a key
   *
   * @example I18n.ui(I18nInternalNS.ui.blockTunes.toggler, 'Click to tune')
   * @param internalNamespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static ui(e, t) {
    return he._t(e, t);
  }
  /**
   * Translate for external strings that is not presented in default dictionary.
   * For example, for user-specified tool names
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static t(e, t) {
    return he._t(e, t);
  }
  /**
   * Adjust module for using external dictionary
   *
   * @param dictionary - new messages list to override default
   */
  static setDictionary(e) {
    he.currentDictionary = e;
  }
  /**
   * Perform translation both for internal and external namespaces
   * If there is no translation found, returns passed key as a translated message
   *
   * @param namespace - path to translated string in dictionary
   * @param dictKey - dictionary key. Better to use default locale original text
   */
  static _t(e, t) {
    const o3 = he.getNamespace(e);
    return !o3 || !o3[t] ? t : o3[t];
  }
  /**
   * Find messages section by namespace path
   *
   * @param namespace - path to section
   */
  static getNamespace(e) {
    return e.split(".").reduce((o3, i) => !o3 || !Object.keys(o3).length ? {} : o3[i], he.currentDictionary);
  }
};
jo.currentDictionary = Fo;
var z = jo;
var Ho = class extends Error {
};
var Oe = class {
  constructor() {
    this.subscribers = {};
  }
  /**
   * Subscribe any event on callback
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  on(e, t) {
    e in this.subscribers || (this.subscribers[e] = []), this.subscribers[e].push(t);
  }
  /**
   * Subscribe any event on callback. Callback will be called once and be removed from subscribers array after call.
   *
   * @param eventName - event name
   * @param callback - subscriber
   */
  once(e, t) {
    e in this.subscribers || (this.subscribers[e] = []);
    const o3 = (i) => {
      const s2 = t(i), r2 = this.subscribers[e].indexOf(o3);
      return r2 !== -1 && this.subscribers[e].splice(r2, 1), s2;
    };
    this.subscribers[e].push(o3);
  }
  /**
   * Emit callbacks with passed data
   *
   * @param eventName - event name
   * @param data - subscribers get this data when they were fired
   */
  emit(e, t) {
    V(this.subscribers) || !this.subscribers[e] || this.subscribers[e].reduce((o3, i) => {
      const s2 = i(o3);
      return s2 !== void 0 ? s2 : o3;
    }, t);
  }
  /**
   * Unsubscribe callback from event
   *
   * @param eventName - event name
   * @param callback - event handler
   */
  off(e, t) {
    if (this.subscribers[e] === void 0) {
      console.warn(`EventDispatcher .off(): there is no subscribers for event "${e.toString()}". Probably, .off() called before .on()`);
      return;
    }
    for (let o3 = 0; o3 < this.subscribers[e].length; o3++)
      if (this.subscribers[e][o3] === t) {
        delete this.subscribers[e][o3];
        break;
      }
  }
  /**
   * Destroyer
   * clears subscribers list
   */
  destroy() {
    this.subscribers = {};
  }
};
function J(n2) {
  Object.setPrototypeOf(this, {
    /**
     * Block id
     *
     * @returns {string}
     */
    get id() {
      return n2.id;
    },
    /**
     * Tool name
     *
     * @returns {string}
     */
    get name() {
      return n2.name;
    },
    /**
     * Tool config passed on Editor's initialization
     *
     * @returns {ToolConfig}
     */
    get config() {
      return n2.config;
    },
    /**
     * .ce-block element, that wraps plugin contents
     *
     * @returns {HTMLElement}
     */
    get holder() {
      return n2.holder;
    },
    /**
     * True if Block content is empty
     *
     * @returns {boolean}
     */
    get isEmpty() {
      return n2.isEmpty;
    },
    /**
     * True if Block is selected with Cross-Block selection
     *
     * @returns {boolean}
     */
    get selected() {
      return n2.selected;
    },
    /**
     * Set Block's stretch state
     *
     * @param {boolean} state — state to set
     */
    set stretched(t) {
      n2.stretched = t;
    },
    /**
     * True if Block is stretched
     *
     * @returns {boolean}
     */
    get stretched() {
      return n2.stretched;
    },
    /**
     * True if Block has inputs to be focused
     */
    get focusable() {
      return n2.focusable;
    },
    /**
     * Call Tool method with errors handler under-the-hood
     *
     * @param {string} methodName - method to call
     * @param {object} param - object with parameters
     * @returns {unknown}
     */
    call(t, o3) {
      return n2.call(t, o3);
    },
    /**
     * Save Block content
     *
     * @returns {Promise<void|SavedData>}
     */
    save() {
      return n2.save();
    },
    /**
     * Validate Block data
     *
     * @param {BlockToolData} data - data to validate
     * @returns {Promise<boolean>}
     */
    validate(t) {
      return n2.validate(t);
    },
    /**
     * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
     * Can be useful for block changes invisible for editor core.
     */
    dispatchChange() {
      n2.dispatchChange();
    },
    /**
     * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
     * This method returns the entry that is related to the Block (depended on the Block data)
     */
    getActiveToolboxEntry() {
      return n2.getActiveToolboxEntry();
    }
  });
}
var _e = class {
  constructor() {
    this.allListeners = [];
  }
  /**
   * Assigns event listener on element and returns unique identifier
   *
   * @param {EventTarget} element - DOM element that needs to be listened
   * @param {string} eventType - event type
   * @param {Function} handler - method that will be fired on event
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   */
  on(e, t, o3, i = false) {
    const s2 = si("l"), r2 = {
      id: s2,
      element: e,
      eventType: t,
      handler: o3,
      options: i
    };
    if (!this.findOne(e, t, o3))
      return this.allListeners.push(r2), e.addEventListener(t, o3, i), s2;
  }
  /**
   * Removes event listener from element
   *
   * @param {EventTarget} element - DOM element that we removing listener
   * @param {string} eventType - event type
   * @param {Function} handler - remove handler, if element listens several handlers on the same event type
   * @param {boolean|AddEventListenerOptions} options - useCapture or {capture, passive, once}
   */
  off(e, t, o3, i) {
    const s2 = this.findAll(e, t, o3);
    s2.forEach((r2, a3) => {
      const l2 = this.allListeners.indexOf(s2[a3]);
      l2 > -1 && (this.allListeners.splice(l2, 1), r2.element.removeEventListener(r2.eventType, r2.handler, r2.options));
    });
  }
  /**
   * Removes listener by id
   *
   * @param {string} id - listener identifier
   */
  offById(e) {
    const t = this.findById(e);
    t && t.element.removeEventListener(t.eventType, t.handler, t.options);
  }
  /**
   * Finds and returns first listener by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} [eventType] - event type
   * @param {Function} [handler] - event handler
   * @returns {ListenerData|null}
   */
  findOne(e, t, o3) {
    const i = this.findAll(e, t, o3);
    return i.length > 0 ? i[0] : null;
  }
  /**
   * Return all stored listeners by passed params
   *
   * @param {EventTarget} element - event target
   * @param {string} eventType - event type
   * @param {Function} handler - event handler
   * @returns {ListenerData[]}
   */
  findAll(e, t, o3) {
    let i;
    const s2 = e ? this.findByEventTarget(e) : [];
    return e && t && o3 ? i = s2.filter((r2) => r2.eventType === t && r2.handler === o3) : e && t ? i = s2.filter((r2) => r2.eventType === t) : i = s2, i;
  }
  /**
   * Removes all listeners
   */
  removeAll() {
    this.allListeners.map((e) => {
      e.element.removeEventListener(e.eventType, e.handler, e.options);
    }), this.allListeners = [];
  }
  /**
   * Module cleanup on destruction
   */
  destroy() {
    this.removeAll();
  }
  /**
   * Search method: looks for listener by passed element
   *
   * @param {EventTarget} element - searching element
   * @returns {Array} listeners that found on element
   */
  findByEventTarget(e) {
    return this.allListeners.filter((t) => {
      if (t.element === e)
        return t;
    });
  }
  /**
   * Search method: looks for listener by passed event type
   *
   * @param {string} eventType - event type
   * @returns {ListenerData[]} listeners that found on element
   */
  findByType(e) {
    return this.allListeners.filter((t) => {
      if (t.eventType === e)
        return t;
    });
  }
  /**
   * Search method: looks for listener by passed handler
   *
   * @param {Function} handler - event handler
   * @returns {ListenerData[]} listeners that found on element
   */
  findByHandler(e) {
    return this.allListeners.filter((t) => {
      if (t.handler === e)
        return t;
    });
  }
  /**
   * Returns listener data found by id
   *
   * @param {string} id - listener identifier
   * @returns {ListenerData}
   */
  findById(e) {
    return this.allListeners.find((t) => t.id === e);
  }
};
var E = class {
  /**
   * @class
   * @param options - Module options
   * @param options.config - Module config
   * @param options.eventsDispatcher - Common event bus
   */
  constructor({ config: e, eventsDispatcher: t }) {
    if (this.nodes = {}, this.listeners = new _e(), this.readOnlyMutableListeners = {
      /**
       * Assigns event listener on DOM element and pushes into special array that might be removed
       *
       * @param {EventTarget} element - DOM Element
       * @param {string} eventType - Event name
       * @param {Function} handler - Event handler
       * @param {boolean|AddEventListenerOptions} options - Listening options
       */
      on: (o3, i, s2, r2 = false) => {
        this.mutableListenerIds.push(
          this.listeners.on(o3, i, s2, r2)
        );
      },
      /**
       * Clears all mutable listeners
       */
      clearAll: () => {
        for (const o3 of this.mutableListenerIds)
          this.listeners.offById(o3);
        this.mutableListenerIds = [];
      }
    }, this.mutableListenerIds = [], new.target === E)
      throw new TypeError("Constructors for abstract class Module are not allowed.");
    this.config = e, this.eventsDispatcher = t;
  }
  /**
   * Editor modules setter
   *
   * @param {EditorModules} Editor - Editor's Modules
   */
  set state(e) {
    this.Editor = e;
  }
  /**
   * Remove memorized nodes
   */
  removeAllNodes() {
    for (const e in this.nodes) {
      const t = this.nodes[e];
      t instanceof HTMLElement && t.remove();
    }
  }
  /**
   * Returns true if current direction is RTL (Right-To-Left)
   */
  get isRtl() {
    return this.config.i18n.direction === "rtl";
  }
};
var b = class {
  constructor() {
    this.instance = null, this.selection = null, this.savedSelectionRange = null, this.isFakeBackgroundEnabled = false, this.commandBackground = "backColor", this.commandRemoveFormat = "removeFormat";
  }
  /**
   * Editor styles
   *
   * @returns {{editorWrapper: string, editorZone: string}}
   */
  static get CSS() {
    return {
      editorWrapper: "codex-editor",
      editorZone: "codex-editor__redactor"
    };
  }
  /**
   * Returns selected anchor
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorNode}
   *
   * @returns {Node|null}
   */
  static get anchorNode() {
    const e = window.getSelection();
    return e ? e.anchorNode : null;
  }
  /**
   * Returns selected anchor element
   *
   * @returns {Element|null}
   */
  static get anchorElement() {
    const e = window.getSelection();
    if (!e)
      return null;
    const t = e.anchorNode;
    return t ? u.isElement(t) ? t : t.parentElement : null;
  }
  /**
   * Returns selection offset according to the anchor node
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Selection/anchorOffset}
   *
   * @returns {number|null}
   */
  static get anchorOffset() {
    const e = window.getSelection();
    return e ? e.anchorOffset : null;
  }
  /**
   * Is current selection range collapsed
   *
   * @returns {boolean|null}
   */
  static get isCollapsed() {
    const e = window.getSelection();
    return e ? e.isCollapsed : null;
  }
  /**
   * Check current selection if it is at Editor's zone
   *
   * @returns {boolean}
   */
  static get isAtEditor() {
    return this.isSelectionAtEditor(b.get());
  }
  /**
   * Check if passed selection is at Editor's zone
   *
   * @param selection - Selection object to check
   */
  static isSelectionAtEditor(e) {
    if (!e)
      return false;
    let t = e.anchorNode || e.focusNode;
    t && t.nodeType === Node.TEXT_NODE && (t = t.parentNode);
    let o3 = null;
    return t && t instanceof Element && (o3 = t.closest(`.${b.CSS.editorZone}`)), o3 ? o3.nodeType === Node.ELEMENT_NODE : false;
  }
  /**
   * Check if passed range at Editor zone
   *
   * @param range - range to check
   */
  static isRangeAtEditor(e) {
    if (!e)
      return;
    let t = e.startContainer;
    t && t.nodeType === Node.TEXT_NODE && (t = t.parentNode);
    let o3 = null;
    return t && t instanceof Element && (o3 = t.closest(`.${b.CSS.editorZone}`)), o3 ? o3.nodeType === Node.ELEMENT_NODE : false;
  }
  /**
   * Methods return boolean that true if selection exists on the page
   */
  static get isSelectionExists() {
    return !!b.get().anchorNode;
  }
  /**
   * Return first range
   *
   * @returns {Range|null}
   */
  static get range() {
    return this.getRangeFromSelection(this.get());
  }
  /**
   * Returns range from passed Selection object
   *
   * @param selection - Selection object to get Range from
   */
  static getRangeFromSelection(e) {
    return e && e.rangeCount ? e.getRangeAt(0) : null;
  }
  /**
   * Calculates position and size of selected text
   *
   * @returns {DOMRect | ClientRect}
   */
  static get rect() {
    let e = document.selection, t, o3 = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
    if (e && e.type !== "Control")
      return e = e, t = e.createRange(), o3.x = t.boundingLeft, o3.y = t.boundingTop, o3.width = t.boundingWidth, o3.height = t.boundingHeight, o3;
    if (!window.getSelection)
      return S("Method window.getSelection is not supported", "warn"), o3;
    if (e = window.getSelection(), e.rangeCount === null || isNaN(e.rangeCount))
      return S("Method SelectionUtils.rangeCount is not supported", "warn"), o3;
    if (e.rangeCount === 0)
      return o3;
    if (t = e.getRangeAt(0).cloneRange(), t.getBoundingClientRect && (o3 = t.getBoundingClientRect()), o3.x === 0 && o3.y === 0) {
      const i = document.createElement("span");
      if (i.getBoundingClientRect) {
        i.appendChild(document.createTextNode("\u200B")), t.insertNode(i), o3 = i.getBoundingClientRect();
        const s2 = i.parentNode;
        s2.removeChild(i), s2.normalize();
      }
    }
    return o3;
  }
  /**
   * Returns selected text as String
   *
   * @returns {string}
   */
  static get text() {
    return window.getSelection ? window.getSelection().toString() : "";
  }
  /**
   * Returns window SelectionUtils
   * {@link https://developer.mozilla.org/ru/docs/Web/API/Window/getSelection}
   *
   * @returns {Selection}
   */
  static get() {
    return window.getSelection();
  }
  /**
   * Set focus to contenteditable or native input element
   *
   * @param element - element where to set focus
   * @param offset - offset of cursor
   */
  static setCursor(e, t = 0) {
    const o3 = document.createRange(), i = window.getSelection();
    return u.isNativeInput(e) ? u.canSetCaret(e) ? (e.focus(), e.selectionStart = e.selectionEnd = t, e.getBoundingClientRect()) : void 0 : (o3.setStart(e, t), o3.setEnd(e, t), i.removeAllRanges(), i.addRange(o3), o3.getBoundingClientRect());
  }
  /**
   * Check if current range exists and belongs to container
   *
   * @param container - where range should be
   */
  static isRangeInsideContainer(e) {
    const t = b.range;
    return t === null ? false : e.contains(t.startContainer);
  }
  /**
   * Adds fake cursor to the current range
   */
  static addFakeCursor() {
    const e = b.range;
    if (e === null)
      return;
    const t = u.make("span", "codex-editor__fake-cursor");
    t.dataset.mutationFree = "true", e.collapse(), e.insertNode(t);
  }
  /**
   * Check if passed element contains a fake cursor
   *
   * @param el - where to check
   */
  static isFakeCursorInsideContainer(e) {
    return u.find(e, ".codex-editor__fake-cursor") !== null;
  }
  /**
   * Removes fake cursor from a container
   *
   * @param container - container to look for
   */
  static removeFakeCursor(e = document.body) {
    const t = u.find(e, ".codex-editor__fake-cursor");
    t && t.remove();
  }
  /**
   * Removes fake background
   */
  removeFakeBackground() {
    this.isFakeBackgroundEnabled && (this.isFakeBackgroundEnabled = false, document.execCommand(this.commandRemoveFormat));
  }
  /**
   * Sets fake background
   */
  setFakeBackground() {
    document.execCommand(this.commandBackground, false, "#a8d6ff"), this.isFakeBackgroundEnabled = true;
  }
  /**
   * Save SelectionUtils's range
   */
  save() {
    this.savedSelectionRange = b.range;
  }
  /**
   * Restore saved SelectionUtils's range
   */
  restore() {
    if (!this.savedSelectionRange)
      return;
    const e = window.getSelection();
    e.removeAllRanges(), e.addRange(this.savedSelectionRange);
  }
  /**
   * Clears saved selection
   */
  clearSaved() {
    this.savedSelectionRange = null;
  }
  /**
   * Collapse current selection
   */
  collapseToEnd() {
    const e = window.getSelection(), t = document.createRange();
    t.selectNodeContents(e.focusNode), t.collapse(false), e.removeAllRanges(), e.addRange(t);
  }
  /**
   * Looks ahead to find passed tag from current selection
   *
   * @param  {string} tagName       - tag to found
   * @param  {string} [className]   - tag's class name
   * @param  {number} [searchDepth] - count of tags that can be included. For better performance.
   * @returns {HTMLElement|null}
   */
  findParentTag(e, t, o3 = 10) {
    const i = window.getSelection();
    let s2 = null;
    return !i || !i.anchorNode || !i.focusNode ? null : ([
      /** the Node in which the selection begins */
      i.anchorNode,
      /** the Node in which the selection ends */
      i.focusNode
    ].forEach((a3) => {
      let l2 = o3;
      for (; l2 > 0 && a3.parentNode && !(a3.tagName === e && (s2 = a3, t && a3.classList && !a3.classList.contains(t) && (s2 = null), s2)); )
        a3 = a3.parentNode, l2--;
    }), s2);
  }
  /**
   * Expands selection range to the passed parent node
   *
   * @param {HTMLElement} element - element which contents should be selected
   */
  expandToTag(e) {
    const t = window.getSelection();
    t.removeAllRanges();
    const o3 = document.createRange();
    o3.selectNodeContents(e), t.addRange(o3);
  }
};
function pi(n2, e) {
  const { type: t, target: o3, addedNodes: i, removedNodes: s2 } = n2;
  return n2.type === "attributes" && n2.attributeName === "data-empty" ? false : !!(e.contains(o3) || t === "childList" && (Array.from(i).some((l2) => l2 === e) || Array.from(s2).some((l2) => l2 === e)));
}
var ft = "redactor dom changed";
var $o = "block changed";
var zo = "fake cursor is about to be toggled";
var Uo = "fake cursor have been set";
var Te = "editor mobile layout toggled";
function gt(n2, e) {
  if (!n2.conversionConfig)
    return false;
  const t = n2.conversionConfig[e];
  return A(t) || te(t);
}
function He(n2, e) {
  return gt(n2.tool, e);
}
function Wo(n2, e) {
  return Object.entries(n2).some(([t, o3]) => e[t] && ri(e[t], o3));
}
async function Yo(n2, e) {
  const o3 = (await n2.save()).data, i = e.find((s2) => s2.name === n2.name);
  return i !== void 0 && !gt(i, "export") ? [] : e.reduce((s2, r2) => {
    if (!gt(r2, "import") || r2.toolbox === void 0)
      return s2;
    const a3 = r2.toolbox.filter((l2) => {
      if (V(l2) || l2.icon === void 0)
        return false;
      if (l2.data !== void 0) {
        if (Wo(l2.data, o3))
          return false;
      } else if (r2.name === n2.name)
        return false;
      return true;
    });
    return s2.push({
      ...r2,
      toolbox: a3
    }), s2;
  }, []);
}
function xo(n2, e) {
  return n2.mergeable ? n2.name === e.name ? true : He(e, "export") && He(n2, "import") : false;
}
function fi(n2, e) {
  const t = e == null ? void 0 : e.export;
  return A(t) ? t(n2) : te(t) ? n2[t] : (t !== void 0 && S("Conversion \xABexport\xBB property must be a string or function. String means key of saved data object to export. Function should export processed string to export."), "");
}
function Bo(n2, e, t) {
  const o3 = e == null ? void 0 : e.import;
  return A(o3) ? o3(n2, t) : te(o3) ? {
    [o3]: n2
  } : (o3 !== void 0 && S("Conversion \xABimport\xBB property must be a string or function. String means key of tool data to import. Function accepts a imported string and return composed tool data."), {});
}
var _ = /* @__PURE__ */ ((n2) => (n2.Default = "default", n2.Separator = "separator", n2.Html = "html", n2))(_ || {});
var ee = /* @__PURE__ */ ((n2) => (n2.APPEND_CALLBACK = "appendCallback", n2.RENDERED = "rendered", n2.MOVED = "moved", n2.UPDATED = "updated", n2.REMOVED = "removed", n2.ON_PASTE = "onPaste", n2))(ee || {});
var R = class extends Oe {
  /**
   * @param options - block constructor options
   * @param [options.id] - block's id. Will be generated if omitted.
   * @param options.data - Tool's initial data
   * @param options.tool — block's tool
   * @param options.api - Editor API module for pass it to the Block Tunes
   * @param options.readOnly - Read-Only flag
   * @param [eventBus] - Editor common event bus. Allows to subscribe on some Editor events. Could be omitted when "virtual" Block is created. See BlocksAPI@composeBlockData.
   */
  constructor({
    id: e = ni(),
    data: t,
    tool: o3,
    readOnly: i,
    tunesData: s2
  }, r2) {
    super(), this.cachedInputs = [], this.toolRenderedElement = null, this.tunesInstances = /* @__PURE__ */ new Map(), this.defaultTunesInstances = /* @__PURE__ */ new Map(), this.unavailableTunesData = {}, this.inputIndex = 0, this.editorEventBus = null, this.handleFocus = () => {
      this.dropInputsCache(), this.updateCurrentInput();
    }, this.didMutated = (a3 = void 0) => {
      const l2 = a3 === void 0, c5 = a3 instanceof InputEvent;
      !l2 && !c5 && this.detectToolRootChange(a3);
      let d3;
      l2 || c5 ? d3 = true : d3 = !(a3.length > 0 && a3.every((p4) => {
        const { addedNodes: g6, removedNodes: f4, target: v4 } = p4;
        return [
          ...Array.from(g6),
          ...Array.from(f4),
          v4
        ].some((T3) => (u.isElement(T3) || (T3 = T3.parentElement), T3 && T3.closest('[data-mutation-free="true"]') !== null));
      })), d3 && (this.dropInputsCache(), this.updateCurrentInput(), this.toggleInputsEmptyMark(), this.call(
        "updated"
        /* UPDATED */
      ), this.emit("didMutated", this));
    }, this.name = o3.name, this.id = e, this.settings = o3.settings, this.config = o3.settings.config || {}, this.editorEventBus = r2 || null, this.blockAPI = new J(this), this.tool = o3, this.toolInstance = o3.create(t, this.blockAPI, i), this.tunes = o3.tunes, this.composeTunes(s2), this.holder = this.compose(), window.requestIdleCallback(() => {
      this.watchBlockMutations(), this.addInputEvents(), this.toggleInputsEmptyMark();
    });
  }
  /**
   * CSS classes for the Block
   *
   * @returns {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      wrapper: "ce-block",
      wrapperStretched: "ce-block--stretched",
      content: "ce-block__content",
      selected: "ce-block--selected",
      dropTarget: "ce-block--drop-target"
    };
  }
  /**
   * Find and return all editable elements (contenteditable and native inputs) in the Tool HTML
   */
  get inputs() {
    if (this.cachedInputs.length !== 0)
      return this.cachedInputs;
    const e = u.findAllInputs(this.holder);
    return this.inputIndex > e.length - 1 && (this.inputIndex = e.length - 1), this.cachedInputs = e, e;
  }
  /**
   * Return current Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  get currentInput() {
    return this.inputs[this.inputIndex];
  }
  /**
   * Set input index to the passed element
   *
   * @param element - HTML Element to set as current input
   */
  set currentInput(e) {
    const t = this.inputs.findIndex((o3) => o3 === e || o3.contains(e));
    t !== -1 && (this.inputIndex = t);
  }
  /**
   * Return first Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  get firstInput() {
    return this.inputs[0];
  }
  /**
   * Return first Tool`s input
   * If Block doesn't contain inputs, return undefined
   */
  get lastInput() {
    const e = this.inputs;
    return e[e.length - 1];
  }
  /**
   * Return next Tool`s input or undefined if it doesn't exist
   * If Block doesn't contain inputs, return undefined
   */
  get nextInput() {
    return this.inputs[this.inputIndex + 1];
  }
  /**
   * Return previous Tool`s input or undefined if it doesn't exist
   * If Block doesn't contain inputs, return undefined
   */
  get previousInput() {
    return this.inputs[this.inputIndex - 1];
  }
  /**
   * Get Block's JSON data
   *
   * @returns {object}
   */
  get data() {
    return this.save().then((e) => e && !V(e.data) ? e.data : {});
  }
  /**
   * Returns tool's sanitizer config
   *
   * @returns {object}
   */
  get sanitize() {
    return this.tool.sanitizeConfig;
  }
  /**
   * is block mergeable
   * We plugin have merge function then we call it mergeable
   *
   * @returns {boolean}
   */
  get mergeable() {
    return A(this.toolInstance.merge);
  }
  /**
   * If Block contains inputs, it is focusable
   */
  get focusable() {
    return this.inputs.length !== 0;
  }
  /**
   * Check block for emptiness
   *
   * @returns {boolean}
   */
  get isEmpty() {
    const e = u.isEmpty(this.pluginsContent, "/"), t = !this.hasMedia;
    return e && t;
  }
  /**
   * Check if block has a media content such as images, iframe and other
   *
   * @returns {boolean}
   */
  get hasMedia() {
    const e = [
      "img",
      "iframe",
      "video",
      "audio",
      "source",
      "input",
      "textarea",
      "twitterwidget"
    ];
    return !!this.holder.querySelector(e.join(","));
  }
  /**
   * Set selected state
   * We don't need to mark Block as Selected when it is empty
   *
   * @param {boolean} state - 'true' to select, 'false' to remove selection
   */
  set selected(e) {
    var i, s2;
    this.holder.classList.toggle(R.CSS.selected, e);
    const t = e === true && b.isRangeInsideContainer(this.holder), o3 = e === false && b.isFakeCursorInsideContainer(this.holder);
    (t || o3) && ((i = this.editorEventBus) == null || i.emit(zo, { state: e }), t ? b.addFakeCursor() : b.removeFakeCursor(this.holder), (s2 = this.editorEventBus) == null || s2.emit(Uo, { state: e }));
  }
  /**
   * Returns True if it is Selected
   *
   * @returns {boolean}
   */
  get selected() {
    return this.holder.classList.contains(R.CSS.selected);
  }
  /**
   * Set stretched state
   *
   * @param {boolean} state - 'true' to enable, 'false' to disable stretched state
   */
  set stretched(e) {
    this.holder.classList.toggle(R.CSS.wrapperStretched, e);
  }
  /**
   * Return Block's stretched state
   *
   * @returns {boolean}
   */
  get stretched() {
    return this.holder.classList.contains(R.CSS.wrapperStretched);
  }
  /**
   * Toggle drop target state
   *
   * @param {boolean} state - 'true' if block is drop target, false otherwise
   */
  set dropTarget(e) {
    this.holder.classList.toggle(R.CSS.dropTarget, e);
  }
  /**
   * Returns Plugins content
   *
   * @returns {HTMLElement}
   */
  get pluginsContent() {
    return this.toolRenderedElement;
  }
  /**
   * Calls Tool's method
   *
   * Method checks tool property {MethodName}. Fires method with passes params If it is instance of Function
   *
   * @param {string} methodName - method to call
   * @param {object} params - method argument
   */
  call(e, t) {
    if (A(this.toolInstance[e])) {
      e === "appendCallback" && S(
        "`appendCallback` hook is deprecated and will be removed in the next major release. Use `rendered` hook instead",
        "warn"
      );
      try {
        this.toolInstance[e].call(this.toolInstance, t);
      } catch (o3) {
        S(`Error during '${e}' call: ${o3.message}`, "error");
      }
    }
  }
  /**
   * Call plugins merge method
   *
   * @param {BlockToolData} data - data to merge
   */
  async mergeWith(e) {
    await this.toolInstance.merge(e);
  }
  /**
   * Extracts data from Block
   * Groups Tool's save processing time
   *
   * @returns {object}
   */
  async save() {
    const e = await this.toolInstance.save(this.pluginsContent), t = this.unavailableTunesData;
    [
      ...this.tunesInstances.entries(),
      ...this.defaultTunesInstances.entries()
    ].forEach(([s2, r2]) => {
      if (A(r2.save))
        try {
          t[s2] = r2.save();
        } catch (a3) {
          S(`Tune ${r2.constructor.name} save method throws an Error %o`, "warn", a3);
        }
    });
    const o3 = window.performance.now();
    let i;
    return Promise.resolve(e).then((s2) => (i = window.performance.now(), {
      id: this.id,
      tool: this.name,
      data: s2,
      tunes: t,
      time: i - o3
    })).catch((s2) => {
      S(`Saving process for ${this.name} tool failed due to the ${s2}`, "log", "red");
    });
  }
  /**
   * Uses Tool's validation method to check the correctness of output data
   * Tool's validation method is optional
   *
   * @description Method returns true|false whether data passed the validation or not
   * @param {BlockToolData} data - data to validate
   * @returns {Promise<boolean>} valid
   */
  async validate(e) {
    let t = true;
    return this.toolInstance.validate instanceof Function && (t = await this.toolInstance.validate(e)), t;
  }
  /**
   * Returns data to render in Block Tunes menu.
   * Splits block tunes into 2 groups: block specific tunes and common tunes
   */
  getTunes() {
    const e = [], t = [], o3 = typeof this.toolInstance.renderSettings == "function" ? this.toolInstance.renderSettings() : [];
    return u.isElement(o3) ? e.push({
      type: _.Html,
      element: o3
    }) : Array.isArray(o3) ? e.push(...o3) : e.push(o3), [
      ...this.tunesInstances.values(),
      ...this.defaultTunesInstances.values()
    ].map((s2) => s2.render()).forEach((s2) => {
      u.isElement(s2) ? t.push({
        type: _.Html,
        element: s2
      }) : Array.isArray(s2) ? t.push(...s2) : t.push(s2);
    }), {
      toolTunes: e,
      commonTunes: t
    };
  }
  /**
   * Update current input index with selection anchor node
   */
  updateCurrentInput() {
    this.currentInput = u.isNativeInput(document.activeElement) || !b.anchorNode ? document.activeElement : b.anchorNode;
  }
  /**
   * Allows to say Editor that Block was changed. Used to manually trigger Editor's 'onChange' callback
   * Can be useful for block changes invisible for editor core.
   */
  dispatchChange() {
    this.didMutated();
  }
  /**
   * Call Tool instance destroy method
   */
  destroy() {
    this.unwatchBlockMutations(), this.removeInputEvents(), super.destroy(), A(this.toolInstance.destroy) && this.toolInstance.destroy();
  }
  /**
   * Tool could specify several entries to be displayed at the Toolbox (for example, "Heading 1", "Heading 2", "Heading 3")
   * This method returns the entry that is related to the Block (depended on the Block data)
   */
  async getActiveToolboxEntry() {
    const e = this.tool.toolbox;
    if (e.length === 1)
      return Promise.resolve(this.tool.toolbox[0]);
    const t = await this.data, o3 = e;
    return o3 == null ? void 0 : o3.find((i) => Wo(i.data, t));
  }
  /**
   * Exports Block data as string using conversion config
   */
  async exportDataAsString() {
    const e = await this.data;
    return fi(e, this.tool.conversionConfig);
  }
  /**
   * Make default Block wrappers and put Tool`s content there
   *
   * @returns {HTMLDivElement}
   */
  compose() {
    const e = u.make("div", R.CSS.wrapper), t = u.make("div", R.CSS.content), o3 = this.toolInstance.render();
    e.dataset.id = this.id, this.toolRenderedElement = o3, t.appendChild(this.toolRenderedElement);
    let i = t;
    return [...this.tunesInstances.values(), ...this.defaultTunesInstances.values()].forEach((s2) => {
      if (A(s2.wrap))
        try {
          i = s2.wrap(i);
        } catch (r2) {
          S(`Tune ${s2.constructor.name} wrap method throws an Error %o`, "warn", r2);
        }
    }), e.appendChild(i), e;
  }
  /**
   * Instantiate Block Tunes
   *
   * @param tunesData - current Block tunes data
   * @private
   */
  composeTunes(e) {
    Array.from(this.tunes.values()).forEach((t) => {
      (t.isInternal ? this.defaultTunesInstances : this.tunesInstances).set(t.name, t.create(e[t.name], this.blockAPI));
    }), Object.entries(e).forEach(([t, o3]) => {
      this.tunesInstances.has(t) || (this.unavailableTunesData[t] = o3);
    });
  }
  /**
   * Adds focus event listeners to all inputs and contenteditable
   */
  addInputEvents() {
    this.inputs.forEach((e) => {
      e.addEventListener("focus", this.handleFocus), u.isNativeInput(e) && e.addEventListener("input", this.didMutated);
    });
  }
  /**
   * removes focus event listeners from all inputs and contenteditable
   */
  removeInputEvents() {
    this.inputs.forEach((e) => {
      e.removeEventListener("focus", this.handleFocus), u.isNativeInput(e) && e.removeEventListener("input", this.didMutated);
    });
  }
  /**
   * Listen common editor Dom Changed event and detect mutations related to the  Block
   */
  watchBlockMutations() {
    var e;
    this.redactorDomChangedCallback = (t) => {
      const { mutations: o3 } = t;
      o3.some((s2) => pi(s2, this.toolRenderedElement)) && this.didMutated(o3);
    }, (e = this.editorEventBus) == null || e.on(ft, this.redactorDomChangedCallback);
  }
  /**
   * Remove redactor dom change event listener
   */
  unwatchBlockMutations() {
    var e;
    (e = this.editorEventBus) == null || e.off(ft, this.redactorDomChangedCallback);
  }
  /**
   * Sometimes Tool can replace own main element, for example H2 -> H4 or UL -> OL
   * We need to detect such changes and update a link to tools main element with the new one
   *
   * @param mutations - records of block content mutations
   */
  detectToolRootChange(e) {
    e.forEach((t) => {
      if (Array.from(t.removedNodes).includes(this.toolRenderedElement)) {
        const i = t.addedNodes[t.addedNodes.length - 1];
        this.toolRenderedElement = i;
      }
    });
  }
  /**
   * Clears inputs cached value
   */
  dropInputsCache() {
    this.cachedInputs = [];
  }
  /**
   * Mark inputs with 'data-empty' attribute with the empty state
   */
  toggleInputsEmptyMark() {
    this.inputs.forEach(Do);
  }
};
var gi = class extends E {
  constructor() {
    super(...arguments), this.insert = (e = this.config.defaultBlock, t = {}, o3 = {}, i, s2, r2, a3) => {
      const l2 = this.Editor.BlockManager.insert({
        id: a3,
        tool: e,
        data: t,
        index: i,
        needToFocus: s2,
        replace: r2
      });
      return new J(l2);
    }, this.composeBlockData = async (e) => {
      const t = this.Editor.Tools.blockTools.get(e);
      return new R({
        tool: t,
        api: this.Editor.API,
        readOnly: true,
        data: {},
        tunesData: {}
      }).data;
    }, this.update = async (e, t, o3) => {
      const { BlockManager: i } = this.Editor, s2 = i.getBlockById(e);
      if (s2 === void 0)
        throw new Error(`Block with id "${e}" not found`);
      const r2 = await i.update(s2, t, o3);
      return new J(r2);
    }, this.convert = async (e, t, o3) => {
      var h3, p4;
      const { BlockManager: i, Tools: s2 } = this.Editor, r2 = i.getBlockById(e);
      if (!r2)
        throw new Error(`Block with id "${e}" not found`);
      const a3 = s2.blockTools.get(r2.name), l2 = s2.blockTools.get(t);
      if (!l2)
        throw new Error(`Block Tool with type "${t}" not found`);
      const c5 = ((h3 = a3 == null ? void 0 : a3.conversionConfig) == null ? void 0 : h3.export) !== void 0, d3 = ((p4 = l2.conversionConfig) == null ? void 0 : p4.import) !== void 0;
      if (c5 && d3) {
        const g6 = await i.convert(r2, t, o3);
        return new J(g6);
      } else {
        const g6 = [
          c5 ? false : je(r2.name),
          d3 ? false : je(t)
        ].filter(Boolean).join(" and ");
        throw new Error(`Conversion from "${r2.name}" to "${t}" is not possible. ${g6} tool(s) should provide a "conversionConfig"`);
      }
    }, this.insertMany = (e, t = this.Editor.BlockManager.blocks.length - 1) => {
      this.validateIndex(t);
      const o3 = e.map(({ id: i, type: s2, data: r2 }) => this.Editor.BlockManager.composeBlock({
        id: i,
        tool: s2 || this.config.defaultBlock,
        data: r2
      }));
      return this.Editor.BlockManager.insertMany(o3, t), o3.map((i) => new J(i));
    };
  }
  /**
   * Available methods
   *
   * @returns {Blocks}
   */
  get methods() {
    return {
      clear: () => this.clear(),
      render: (e) => this.render(e),
      renderFromHTML: (e) => this.renderFromHTML(e),
      delete: (e) => this.delete(e),
      swap: (e, t) => this.swap(e, t),
      move: (e, t) => this.move(e, t),
      getBlockByIndex: (e) => this.getBlockByIndex(e),
      getById: (e) => this.getById(e),
      getCurrentBlockIndex: () => this.getCurrentBlockIndex(),
      getBlockIndex: (e) => this.getBlockIndex(e),
      getBlocksCount: () => this.getBlocksCount(),
      getBlockByElement: (e) => this.getBlockByElement(e),
      stretchBlock: (e, t = true) => this.stretchBlock(e, t),
      insertNewBlock: () => this.insertNewBlock(),
      insert: this.insert,
      insertMany: this.insertMany,
      update: this.update,
      composeBlockData: this.composeBlockData,
      convert: this.convert
    };
  }
  /**
   * Returns Blocks count
   *
   * @returns {number}
   */
  getBlocksCount() {
    return this.Editor.BlockManager.blocks.length;
  }
  /**
   * Returns current block index
   *
   * @returns {number}
   */
  getCurrentBlockIndex() {
    return this.Editor.BlockManager.currentBlockIndex;
  }
  /**
   * Returns the index of Block by id;
   *
   * @param id - block id
   */
  getBlockIndex(e) {
    const t = this.Editor.BlockManager.getBlockById(e);
    if (!t) {
      X("There is no block with id `" + e + "`", "warn");
      return;
    }
    return this.Editor.BlockManager.getBlockIndex(t);
  }
  /**
   * Returns BlockAPI object by Block index
   *
   * @param {number} index - index to get
   */
  getBlockByIndex(e) {
    const t = this.Editor.BlockManager.getBlockByIndex(e);
    if (t === void 0) {
      X("There is no block at index `" + e + "`", "warn");
      return;
    }
    return new J(t);
  }
  /**
   * Returns BlockAPI object by Block id
   *
   * @param id - id of block to get
   */
  getById(e) {
    const t = this.Editor.BlockManager.getBlockById(e);
    return t === void 0 ? (X("There is no block with id `" + e + "`", "warn"), null) : new J(t);
  }
  /**
   * Get Block API object by any child html element
   *
   * @param element - html element to get Block by
   */
  getBlockByElement(e) {
    const t = this.Editor.BlockManager.getBlock(e);
    if (t === void 0) {
      X("There is no block corresponding to element `" + e + "`", "warn");
      return;
    }
    return new J(t);
  }
  /**
   * Call Block Manager method that swap Blocks
   *
   * @param {number} fromIndex - position of first Block
   * @param {number} toIndex - position of second Block
   * @deprecated — use 'move' instead
   */
  swap(e, t) {
    S(
      "`blocks.swap()` method is deprecated and will be removed in the next major release. Use `block.move()` method instead",
      "info"
    ), this.Editor.BlockManager.swap(e, t);
  }
  /**
   * Move block from one index to another
   *
   * @param {number} toIndex - index to move to
   * @param {number} fromIndex - index to move from
   */
  move(e, t) {
    this.Editor.BlockManager.move(e, t);
  }
  /**
   * Deletes Block
   *
   * @param {number} blockIndex - index of Block to delete
   */
  delete(e = this.Editor.BlockManager.currentBlockIndex) {
    try {
      const t = this.Editor.BlockManager.getBlockByIndex(e);
      this.Editor.BlockManager.removeBlock(t);
    } catch (t) {
      X(t, "warn");
      return;
    }
    this.Editor.BlockManager.blocks.length === 0 && this.Editor.BlockManager.insert(), this.Editor.BlockManager.currentBlock && this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END), this.Editor.Toolbar.close();
  }
  /**
   * Clear Editor's area
   */
  async clear() {
    await this.Editor.BlockManager.clear(true), this.Editor.InlineToolbar.close();
  }
  /**
   * Fills Editor with Blocks data
   *
   * @param {OutputData} data — Saved Editor data
   */
  async render(e) {
    if (e === void 0 || e.blocks === void 0)
      throw new Error("Incorrect data passed to the render() method");
    this.Editor.ModificationsObserver.disable(), await this.Editor.BlockManager.clear(), await this.Editor.Renderer.render(e.blocks), this.Editor.ModificationsObserver.enable();
  }
  /**
   * Render passed HTML string
   *
   * @param {string} data - HTML string to render
   * @returns {Promise<void>}
   */
  async renderFromHTML(e) {
    return await this.Editor.BlockManager.clear(), this.Editor.Paste.processText(e, true);
  }
  /**
   * Stretch Block's content
   *
   * @param {number} index - index of Block to stretch
   * @param {boolean} status - true to enable, false to disable
   * @deprecated Use BlockAPI interface to stretch Blocks
   */
  stretchBlock(e, t = true) {
    ht(
      true,
      "blocks.stretchBlock()",
      "BlockAPI"
    );
    const o3 = this.Editor.BlockManager.getBlockByIndex(e);
    o3 && (o3.stretched = t);
  }
  /**
   * Insert new Block
   * After set caret to this Block
   *
   * @todo remove in 3.0.0
   * @deprecated with insert() method
   */
  insertNewBlock() {
    S("Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. Use blocks.insert() instead.", "warn"), this.insert();
  }
  /**
   * Validated block index and throws an error if it's invalid
   *
   * @param index - index to validate
   */
  validateIndex(e) {
    if (typeof e != "number")
      throw new Error("Index should be a number");
    if (e < 0)
      throw new Error("Index should be greater than or equal to 0");
    if (e === null)
      throw new Error("Index should be greater than or equal to 0");
  }
};
function mi(n2, e) {
  return typeof n2 == "number" ? e.BlockManager.getBlockByIndex(n2) : typeof n2 == "string" ? e.BlockManager.getBlockById(n2) : e.BlockManager.getBlockById(n2.id);
}
var bi = class extends E {
  constructor() {
    super(...arguments), this.setToFirstBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.firstBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.firstBlock, e, t), true) : false, this.setToLastBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.lastBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.lastBlock, e, t), true) : false, this.setToPreviousBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.previousBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.previousBlock, e, t), true) : false, this.setToNextBlock = (e = this.Editor.Caret.positions.DEFAULT, t = 0) => this.Editor.BlockManager.nextBlock ? (this.Editor.Caret.setToBlock(this.Editor.BlockManager.nextBlock, e, t), true) : false, this.setToBlock = (e, t = this.Editor.Caret.positions.DEFAULT, o3 = 0) => {
      const i = mi(e, this.Editor);
      return i === void 0 ? false : (this.Editor.Caret.setToBlock(i, t, o3), true);
    }, this.focus = (e = false) => e ? this.setToLastBlock(this.Editor.Caret.positions.END) : this.setToFirstBlock(this.Editor.Caret.positions.START);
  }
  /**
   * Available methods
   *
   * @returns {Caret}
   */
  get methods() {
    return {
      setToFirstBlock: this.setToFirstBlock,
      setToLastBlock: this.setToLastBlock,
      setToPreviousBlock: this.setToPreviousBlock,
      setToNextBlock: this.setToNextBlock,
      setToBlock: this.setToBlock,
      focus: this.focus
    };
  }
};
var vi = class extends E {
  /**
   * Available methods
   *
   * @returns {Events}
   */
  get methods() {
    return {
      emit: (e, t) => this.emit(e, t),
      off: (e, t) => this.off(e, t),
      on: (e, t) => this.on(e, t)
    };
  }
  /**
   * Subscribe on Events
   *
   * @param {string} eventName - event name to subscribe
   * @param {Function} callback - event handler
   */
  on(e, t) {
    this.eventsDispatcher.on(e, t);
  }
  /**
   * Emit event with data
   *
   * @param {string} eventName - event to emit
   * @param {object} data - event's data
   */
  emit(e, t) {
    this.eventsDispatcher.emit(e, t);
  }
  /**
   * Unsubscribe from Event
   *
   * @param {string} eventName - event to unsubscribe
   * @param {Function} callback - event handler
   */
  off(e, t) {
    this.eventsDispatcher.off(e, t);
  }
};
var kt = class extends E {
  /**
   * Return namespace section for tool or block tune
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  static getNamespace(e, t) {
    return t ? `blockTunes.${e}` : `tools.${e}`;
  }
  /**
   * Return I18n API methods with global dictionary access
   */
  get methods() {
    return {
      t: () => {
        X("I18n.t() method can be accessed only from Tools", "warn");
      }
    };
  }
  /**
   * Return I18n API methods with tool namespaced dictionary
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  getMethodsForTool(e, t) {
    return Object.assign(
      this.methods,
      {
        t: (o3) => z.t(kt.getNamespace(e, t), o3)
      }
    );
  }
};
var ki = class extends E {
  /**
   * Editor.js Core API modules
   */
  get methods() {
    return {
      blocks: this.Editor.BlocksAPI.methods,
      caret: this.Editor.CaretAPI.methods,
      tools: this.Editor.ToolsAPI.methods,
      events: this.Editor.EventsAPI.methods,
      listeners: this.Editor.ListenersAPI.methods,
      notifier: this.Editor.NotifierAPI.methods,
      sanitizer: this.Editor.SanitizerAPI.methods,
      saver: this.Editor.SaverAPI.methods,
      selection: this.Editor.SelectionAPI.methods,
      styles: this.Editor.StylesAPI.classes,
      toolbar: this.Editor.ToolbarAPI.methods,
      inlineToolbar: this.Editor.InlineToolbarAPI.methods,
      tooltip: this.Editor.TooltipAPI.methods,
      i18n: this.Editor.I18nAPI.methods,
      readOnly: this.Editor.ReadOnlyAPI.methods,
      ui: this.Editor.UiAPI.methods
    };
  }
  /**
   * Returns Editor.js Core API methods for passed tool
   *
   * @param toolName - tool name
   * @param isTune - is tool a block tune
   */
  getMethodsForTool(e, t) {
    return Object.assign(
      this.methods,
      {
        i18n: this.Editor.I18nAPI.getMethodsForTool(e, t)
      }
    );
  }
};
var yi = class extends E {
  /**
   * Available methods
   *
   * @returns {InlineToolbar}
   */
  get methods() {
    return {
      close: () => this.close(),
      open: () => this.open()
    };
  }
  /**
   * Open Inline Toolbar
   */
  open() {
    this.Editor.InlineToolbar.tryToShow();
  }
  /**
   * Close Inline Toolbar
   */
  close() {
    this.Editor.InlineToolbar.close();
  }
};
var wi = class extends E {
  /**
   * Available methods
   *
   * @returns {Listeners}
   */
  get methods() {
    return {
      on: (e, t, o3, i) => this.on(e, t, o3, i),
      off: (e, t, o3, i) => this.off(e, t, o3, i),
      offById: (e) => this.offById(e)
    };
  }
  /**
   * Ads a DOM event listener. Return it's id.
   *
   * @param {HTMLElement} element - Element to set handler to
   * @param {string} eventType - event type
   * @param {() => void} handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  on(e, t, o3, i) {
    return this.listeners.on(e, t, o3, i);
  }
  /**
   * Removes DOM listener from element
   *
   * @param {Element} element - Element to remove handler from
   * @param eventType - event type
   * @param handler - event handler
   * @param {boolean} useCapture - capture event or not
   */
  off(e, t, o3, i) {
    this.listeners.off(e, t, o3, i);
  }
  /**
   * Removes DOM listener by the listener id
   *
   * @param id - id of the listener to remove
   */
  offById(e) {
    this.listeners.offById(e);
  }
};
var Ko = { exports: {} };
(function(n2, e) {
  (function(t, o3) {
    n2.exports = o3();
  })(window, function() {
    return function(t) {
      var o3 = {};
      function i(s2) {
        if (o3[s2])
          return o3[s2].exports;
        var r2 = o3[s2] = { i: s2, l: false, exports: {} };
        return t[s2].call(r2.exports, r2, r2.exports, i), r2.l = true, r2.exports;
      }
      return i.m = t, i.c = o3, i.d = function(s2, r2, a3) {
        i.o(s2, r2) || Object.defineProperty(s2, r2, { enumerable: true, get: a3 });
      }, i.r = function(s2) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s2, "__esModule", { value: true });
      }, i.t = function(s2, r2) {
        if (1 & r2 && (s2 = i(s2)), 8 & r2 || 4 & r2 && typeof s2 == "object" && s2 && s2.__esModule)
          return s2;
        var a3 = /* @__PURE__ */ Object.create(null);
        if (i.r(a3), Object.defineProperty(a3, "default", { enumerable: true, value: s2 }), 2 & r2 && typeof s2 != "string")
          for (var l2 in s2)
            i.d(a3, l2, function(c5) {
              return s2[c5];
            }.bind(null, l2));
        return a3;
      }, i.n = function(s2) {
        var r2 = s2 && s2.__esModule ? function() {
          return s2.default;
        } : function() {
          return s2;
        };
        return i.d(r2, "a", r2), r2;
      }, i.o = function(s2, r2) {
        return Object.prototype.hasOwnProperty.call(s2, r2);
      }, i.p = "/", i(i.s = 0);
    }([function(t, o3, i) {
      i(1), /*!
      * Codex JavaScript Notification module
      * https://github.com/codex-team/js-notifier
      */
      t.exports = function() {
        var s2 = i(6), r2 = "cdx-notify--bounce-in", a3 = null;
        return { show: function(l2) {
          if (l2.message) {
            (function() {
              if (a3)
                return true;
              a3 = s2.getWrapper(), document.body.appendChild(a3);
            })();
            var c5 = null, d3 = l2.time || 8e3;
            switch (l2.type) {
              case "confirm":
                c5 = s2.confirm(l2);
                break;
              case "prompt":
                c5 = s2.prompt(l2);
                break;
              default:
                c5 = s2.alert(l2), window.setTimeout(function() {
                  c5.remove();
                }, d3);
            }
            a3.appendChild(c5), c5.classList.add(r2);
          }
        } };
      }();
    }, function(t, o3, i) {
      var s2 = i(2);
      typeof s2 == "string" && (s2 = [[t.i, s2, ""]]);
      var r2 = { hmr: true, transform: void 0, insertInto: void 0 };
      i(4)(s2, r2), s2.locals && (t.exports = s2.locals);
    }, function(t, o3, i) {
      (t.exports = i(3)(false)).push([t.i, `.cdx-notify--error{background:#fffbfb!important}.cdx-notify--error::before{background:#fb5d5d!important}.cdx-notify__input{max-width:130px;padding:5px 10px;background:#f7f7f7;border:0;border-radius:3px;font-size:13px;color:#656b7c;outline:0}.cdx-notify__input:-ms-input-placeholder{color:#656b7c}.cdx-notify__input::placeholder{color:#656b7c}.cdx-notify__input:focus:-ms-input-placeholder{color:rgba(101,107,124,.3)}.cdx-notify__input:focus::placeholder{color:rgba(101,107,124,.3)}.cdx-notify__button{border:none;border-radius:3px;font-size:13px;padding:5px 10px;cursor:pointer}.cdx-notify__button:last-child{margin-left:10px}.cdx-notify__button--cancel{background:#f2f5f7;box-shadow:0 2px 1px 0 rgba(16,19,29,0);color:#656b7c}.cdx-notify__button--cancel:hover{background:#eee}.cdx-notify__button--confirm{background:#34c992;box-shadow:0 1px 1px 0 rgba(18,49,35,.05);color:#fff}.cdx-notify__button--confirm:hover{background:#33b082}.cdx-notify__btns-wrapper{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;margin-top:5px}.cdx-notify__cross{position:absolute;top:5px;right:5px;width:10px;height:10px;padding:5px;opacity:.54;cursor:pointer}.cdx-notify__cross::after,.cdx-notify__cross::before{content:'';position:absolute;left:9px;top:5px;height:12px;width:2px;background:#575d67}.cdx-notify__cross::before{transform:rotate(-45deg)}.cdx-notify__cross::after{transform:rotate(45deg)}.cdx-notify__cross:hover{opacity:1}.cdx-notifies{position:fixed;z-index:2;bottom:20px;left:20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif}.cdx-notify{position:relative;width:220px;margin-top:15px;padding:13px 16px;background:#fff;box-shadow:0 11px 17px 0 rgba(23,32,61,.13);border-radius:5px;font-size:14px;line-height:1.4em;word-wrap:break-word}.cdx-notify::before{content:'';position:absolute;display:block;top:0;left:0;width:3px;height:calc(100% - 6px);margin:3px;border-radius:5px;background:0 0}@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)}}.cdx-notify--bounce-in{animation-name:bounceIn;animation-duration:.6s;animation-iteration-count:1}.cdx-notify--success{background:#fafffe!important}.cdx-notify--success::before{background:#41ffb1!important}`, ""]);
    }, function(t, o3) {
      t.exports = function(i) {
        var s2 = [];
        return s2.toString = function() {
          return this.map(function(r2) {
            var a3 = function(l2, c5) {
              var d3 = l2[1] || "", h3 = l2[3];
              if (!h3)
                return d3;
              if (c5 && typeof btoa == "function") {
                var p4 = (f4 = h3, "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(f4)))) + " */"), g6 = h3.sources.map(function(v4) {
                  return "/*# sourceURL=" + h3.sourceRoot + v4 + " */";
                });
                return [d3].concat(g6).concat([p4]).join(`
`);
              }
              var f4;
              return [d3].join(`
`);
            }(r2, i);
            return r2[2] ? "@media " + r2[2] + "{" + a3 + "}" : a3;
          }).join("");
        }, s2.i = function(r2, a3) {
          typeof r2 == "string" && (r2 = [[null, r2, ""]]);
          for (var l2 = {}, c5 = 0; c5 < this.length; c5++) {
            var d3 = this[c5][0];
            typeof d3 == "number" && (l2[d3] = true);
          }
          for (c5 = 0; c5 < r2.length; c5++) {
            var h3 = r2[c5];
            typeof h3[0] == "number" && l2[h3[0]] || (a3 && !h3[2] ? h3[2] = a3 : a3 && (h3[2] = "(" + h3[2] + ") and (" + a3 + ")"), s2.push(h3));
          }
        }, s2;
      };
    }, function(t, o3, i) {
      var s2, r2, a3 = {}, l2 = (s2 = function() {
        return window && document && document.all && !window.atob;
      }, function() {
        return r2 === void 0 && (r2 = s2.apply(this, arguments)), r2;
      }), c5 = function(k4) {
        var m4 = {};
        return function(w4) {
          if (typeof w4 == "function")
            return w4();
          if (m4[w4] === void 0) {
            var x3 = function(I2) {
              return document.querySelector(I2);
            }.call(this, w4);
            if (window.HTMLIFrameElement && x3 instanceof window.HTMLIFrameElement)
              try {
                x3 = x3.contentDocument.head;
              } catch {
                x3 = null;
              }
            m4[w4] = x3;
          }
          return m4[w4];
        };
      }(), d3 = null, h3 = 0, p4 = [], g6 = i(5);
      function f4(k4, m4) {
        for (var w4 = 0; w4 < k4.length; w4++) {
          var x3 = k4[w4], I2 = a3[x3.id];
          if (I2) {
            I2.refs++;
            for (var C5 = 0; C5 < I2.parts.length; C5++)
              I2.parts[C5](x3.parts[C5]);
            for (; C5 < x3.parts.length; C5++)
              I2.parts.push(F3(x3.parts[C5], m4));
          } else {
            var N2 = [];
            for (C5 = 0; C5 < x3.parts.length; C5++)
              N2.push(F3(x3.parts[C5], m4));
            a3[x3.id] = { id: x3.id, refs: 1, parts: N2 };
          }
        }
      }
      function v4(k4, m4) {
        for (var w4 = [], x3 = {}, I2 = 0; I2 < k4.length; I2++) {
          var C5 = k4[I2], N2 = m4.base ? C5[0] + m4.base : C5[0], B3 = { css: C5[1], media: C5[2], sourceMap: C5[3] };
          x3[N2] ? x3[N2].parts.push(B3) : w4.push(x3[N2] = { id: N2, parts: [B3] });
        }
        return w4;
      }
      function O3(k4, m4) {
        var w4 = c5(k4.insertInto);
        if (!w4)
          throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
        var x3 = p4[p4.length - 1];
        if (k4.insertAt === "top")
          x3 ? x3.nextSibling ? w4.insertBefore(m4, x3.nextSibling) : w4.appendChild(m4) : w4.insertBefore(m4, w4.firstChild), p4.push(m4);
        else if (k4.insertAt === "bottom")
          w4.appendChild(m4);
        else {
          if (typeof k4.insertAt != "object" || !k4.insertAt.before)
            throw new Error(`[Style Loader]

 Invalid value for parameter 'insertAt' ('options.insertAt') found.
 Must be 'top', 'bottom', or Object.
 (https://github.com/webpack-contrib/style-loader#insertat)
`);
          var I2 = c5(k4.insertInto + " " + k4.insertAt.before);
          w4.insertBefore(m4, I2);
        }
      }
      function T3(k4) {
        if (k4.parentNode === null)
          return false;
        k4.parentNode.removeChild(k4);
        var m4 = p4.indexOf(k4);
        m4 >= 0 && p4.splice(m4, 1);
      }
      function M3(k4) {
        var m4 = document.createElement("style");
        return k4.attrs.type === void 0 && (k4.attrs.type = "text/css"), q2(m4, k4.attrs), O3(k4, m4), m4;
      }
      function q2(k4, m4) {
        Object.keys(m4).forEach(function(w4) {
          k4.setAttribute(w4, m4[w4]);
        });
      }
      function F3(k4, m4) {
        var w4, x3, I2, C5;
        if (m4.transform && k4.css) {
          if (!(C5 = m4.transform(k4.css)))
            return function() {
            };
          k4.css = C5;
        }
        if (m4.singleton) {
          var N2 = h3++;
          w4 = d3 || (d3 = M3(m4)), x3 = ie2.bind(null, w4, N2, false), I2 = ie2.bind(null, w4, N2, true);
        } else
          k4.sourceMap && typeof URL == "function" && typeof URL.createObjectURL == "function" && typeof URL.revokeObjectURL == "function" && typeof Blob == "function" && typeof btoa == "function" ? (w4 = function(B3) {
            var W2 = document.createElement("link");
            return B3.attrs.type === void 0 && (B3.attrs.type = "text/css"), B3.attrs.rel = "stylesheet", q2(W2, B3.attrs), O3(B3, W2), W2;
          }(m4), x3 = function(B3, W2, ve2) {
            var se2 = ve2.css, tt2 = ve2.sourceMap, Yn = W2.convertToAbsoluteUrls === void 0 && tt2;
            (W2.convertToAbsoluteUrls || Yn) && (se2 = g6(se2)), tt2 && (se2 += `
/*# sourceMappingURL=data:application/json;base64,` + btoa(unescape(encodeURIComponent(JSON.stringify(tt2)))) + " */");
            var Kn = new Blob([se2], { type: "text/css" }), ko = B3.href;
            B3.href = URL.createObjectURL(Kn), ko && URL.revokeObjectURL(ko);
          }.bind(null, w4, m4), I2 = function() {
            T3(w4), w4.href && URL.revokeObjectURL(w4.href);
          }) : (w4 = M3(m4), x3 = function(B3, W2) {
            var ve2 = W2.css, se2 = W2.media;
            if (se2 && B3.setAttribute("media", se2), B3.styleSheet)
              B3.styleSheet.cssText = ve2;
            else {
              for (; B3.firstChild; )
                B3.removeChild(B3.firstChild);
              B3.appendChild(document.createTextNode(ve2));
            }
          }.bind(null, w4), I2 = function() {
            T3(w4);
          });
        return x3(k4), function(B3) {
          if (B3) {
            if (B3.css === k4.css && B3.media === k4.media && B3.sourceMap === k4.sourceMap)
              return;
            x3(k4 = B3);
          } else
            I2();
        };
      }
      t.exports = function(k4, m4) {
        if (typeof DEBUG < "u" && DEBUG && typeof document != "object")
          throw new Error("The style-loader cannot be used in a non-browser environment");
        (m4 = m4 || {}).attrs = typeof m4.attrs == "object" ? m4.attrs : {}, m4.singleton || typeof m4.singleton == "boolean" || (m4.singleton = l2()), m4.insertInto || (m4.insertInto = "head"), m4.insertAt || (m4.insertAt = "bottom");
        var w4 = v4(k4, m4);
        return f4(w4, m4), function(x3) {
          for (var I2 = [], C5 = 0; C5 < w4.length; C5++) {
            var N2 = w4[C5];
            (B3 = a3[N2.id]).refs--, I2.push(B3);
          }
          for (x3 && f4(v4(x3, m4), m4), C5 = 0; C5 < I2.length; C5++) {
            var B3;
            if ((B3 = I2[C5]).refs === 0) {
              for (var W2 = 0; W2 < B3.parts.length; W2++)
                B3.parts[W2]();
              delete a3[B3.id];
            }
          }
        };
      };
      var H3, Q2 = (H3 = [], function(k4, m4) {
        return H3[k4] = m4, H3.filter(Boolean).join(`
`);
      });
      function ie2(k4, m4, w4, x3) {
        var I2 = w4 ? "" : x3.css;
        if (k4.styleSheet)
          k4.styleSheet.cssText = Q2(m4, I2);
        else {
          var C5 = document.createTextNode(I2), N2 = k4.childNodes;
          N2[m4] && k4.removeChild(N2[m4]), N2.length ? k4.insertBefore(C5, N2[m4]) : k4.appendChild(C5);
        }
      }
    }, function(t, o3) {
      t.exports = function(i) {
        var s2 = typeof window < "u" && window.location;
        if (!s2)
          throw new Error("fixUrls requires window.location");
        if (!i || typeof i != "string")
          return i;
        var r2 = s2.protocol + "//" + s2.host, a3 = r2 + s2.pathname.replace(/\/[^\/]*$/, "/");
        return i.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(l2, c5) {
          var d3, h3 = c5.trim().replace(/^"(.*)"$/, function(p4, g6) {
            return g6;
          }).replace(/^'(.*)'$/, function(p4, g6) {
            return g6;
          });
          return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(h3) ? l2 : (d3 = h3.indexOf("//") === 0 ? h3 : h3.indexOf("/") === 0 ? r2 + h3 : a3 + h3.replace(/^\.\//, ""), "url(" + JSON.stringify(d3) + ")");
        });
      };
    }, function(t, o3, i) {
      var s2, r2, a3, l2, c5, d3, h3, p4, g6;
      t.exports = (s2 = "cdx-notifies", r2 = "cdx-notify", a3 = "cdx-notify__cross", l2 = "cdx-notify__button--confirm", c5 = "cdx-notify__button--cancel", d3 = "cdx-notify__input", h3 = "cdx-notify__button", p4 = "cdx-notify__btns-wrapper", { alert: g6 = function(f4) {
        var v4 = document.createElement("DIV"), O3 = document.createElement("DIV"), T3 = f4.message, M3 = f4.style;
        return v4.classList.add(r2), M3 && v4.classList.add(r2 + "--" + M3), v4.innerHTML = T3, O3.classList.add(a3), O3.addEventListener("click", v4.remove.bind(v4)), v4.appendChild(O3), v4;
      }, confirm: function(f4) {
        var v4 = g6(f4), O3 = document.createElement("div"), T3 = document.createElement("button"), M3 = document.createElement("button"), q2 = v4.querySelector("." + a3), F3 = f4.cancelHandler, H3 = f4.okHandler;
        return O3.classList.add(p4), T3.innerHTML = f4.okText || "Confirm", M3.innerHTML = f4.cancelText || "Cancel", T3.classList.add(h3), M3.classList.add(h3), T3.classList.add(l2), M3.classList.add(c5), F3 && typeof F3 == "function" && (M3.addEventListener("click", F3), q2.addEventListener("click", F3)), H3 && typeof H3 == "function" && T3.addEventListener("click", H3), T3.addEventListener("click", v4.remove.bind(v4)), M3.addEventListener("click", v4.remove.bind(v4)), O3.appendChild(T3), O3.appendChild(M3), v4.appendChild(O3), v4;
      }, prompt: function(f4) {
        var v4 = g6(f4), O3 = document.createElement("div"), T3 = document.createElement("button"), M3 = document.createElement("input"), q2 = v4.querySelector("." + a3), F3 = f4.cancelHandler, H3 = f4.okHandler;
        return O3.classList.add(p4), T3.innerHTML = f4.okText || "Ok", T3.classList.add(h3), T3.classList.add(l2), M3.classList.add(d3), f4.placeholder && M3.setAttribute("placeholder", f4.placeholder), f4.default && (M3.value = f4.default), f4.inputType && (M3.type = f4.inputType), F3 && typeof F3 == "function" && q2.addEventListener("click", F3), H3 && typeof H3 == "function" && T3.addEventListener("click", function() {
          H3(M3.value);
        }), T3.addEventListener("click", v4.remove.bind(v4)), O3.appendChild(M3), O3.appendChild(T3), v4.appendChild(O3), v4;
      }, getWrapper: function() {
        var f4 = document.createElement("DIV");
        return f4.classList.add(s2), f4;
      } });
    }]);
  });
})(Ko);
var Ei = Ko.exports;
var xi = /* @__PURE__ */ Ke(Ei);
var Bi = class {
  /**
   * Show web notification
   *
   * @param {NotifierOptions | ConfirmNotifierOptions | PromptNotifierOptions} options - notification options
   */
  show(e) {
    xi.show(e);
  }
};
var Ci = class extends E {
  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.notifier = new Bi();
  }
  /**
   * Available methods
   */
  get methods() {
    return {
      show: (e) => this.show(e)
    };
  }
  /**
   * Show notification
   *
   * @param {NotifierOptions} options - message option
   */
  show(e) {
    return this.notifier.show(e);
  }
};
var Ti = class extends E {
  /**
   * Available methods
   */
  get methods() {
    const e = () => this.isEnabled;
    return {
      toggle: (t) => this.toggle(t),
      get isEnabled() {
        return e();
      }
    };
  }
  /**
   * Set or toggle read-only state
   *
   * @param {boolean|undefined} state - set or toggle state
   * @returns {boolean} current value
   */
  toggle(e) {
    return this.Editor.ReadOnly.toggle(e);
  }
  /**
   * Returns current read-only state
   */
  get isEnabled() {
    return this.Editor.ReadOnly.isEnabled;
  }
};
var Xo = { exports: {} };
(function(n2, e) {
  (function(t, o3) {
    n2.exports = o3();
  })(Ce, function() {
    function t(h3) {
      var p4 = h3.tags, g6 = Object.keys(p4), f4 = g6.map(function(v4) {
        return typeof p4[v4];
      }).every(function(v4) {
        return v4 === "object" || v4 === "boolean" || v4 === "function";
      });
      if (!f4)
        throw new Error("The configuration was invalid");
      this.config = h3;
    }
    var o3 = ["P", "LI", "TD", "TH", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "PRE"];
    function i(h3) {
      return o3.indexOf(h3.nodeName) !== -1;
    }
    var s2 = ["A", "B", "STRONG", "I", "EM", "SUB", "SUP", "U", "STRIKE"];
    function r2(h3) {
      return s2.indexOf(h3.nodeName) !== -1;
    }
    t.prototype.clean = function(h3) {
      const p4 = document.implementation.createHTMLDocument(), g6 = p4.createElement("div");
      return g6.innerHTML = h3, this._sanitize(p4, g6), g6.innerHTML;
    }, t.prototype._sanitize = function(h3, p4) {
      var g6 = a3(h3, p4), f4 = g6.firstChild();
      if (f4)
        do {
          if (f4.nodeType === Node.TEXT_NODE)
            if (f4.data.trim() === "" && (f4.previousElementSibling && i(f4.previousElementSibling) || f4.nextElementSibling && i(f4.nextElementSibling))) {
              p4.removeChild(f4), this._sanitize(h3, p4);
              break;
            } else
              continue;
          if (f4.nodeType === Node.COMMENT_NODE) {
            p4.removeChild(f4), this._sanitize(h3, p4);
            break;
          }
          var v4 = r2(f4), O3;
          v4 && (O3 = Array.prototype.some.call(f4.childNodes, i));
          var T3 = !!p4.parentNode, M3 = i(p4) && i(f4) && T3, q2 = f4.nodeName.toLowerCase(), F3 = l2(this.config, q2, f4), H3 = v4 && O3;
          if (H3 || c5(f4, F3) || !this.config.keepNestedBlockElements && M3) {
            if (!(f4.nodeName === "SCRIPT" || f4.nodeName === "STYLE"))
              for (; f4.childNodes.length > 0; )
                p4.insertBefore(f4.childNodes[0], f4);
            p4.removeChild(f4), this._sanitize(h3, p4);
            break;
          }
          for (var Q2 = 0; Q2 < f4.attributes.length; Q2 += 1) {
            var ie2 = f4.attributes[Q2];
            d3(ie2, F3, f4) && (f4.removeAttribute(ie2.name), Q2 = Q2 - 1);
          }
          this._sanitize(h3, f4);
        } while (f4 = g6.nextSibling());
    };
    function a3(h3, p4) {
      return h3.createTreeWalker(
        p4,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
        null,
        false
      );
    }
    function l2(h3, p4, g6) {
      return typeof h3.tags[p4] == "function" ? h3.tags[p4](g6) : h3.tags[p4];
    }
    function c5(h3, p4) {
      return typeof p4 > "u" ? true : typeof p4 == "boolean" ? !p4 : false;
    }
    function d3(h3, p4, g6) {
      var f4 = h3.name.toLowerCase();
      return p4 === true ? false : typeof p4[f4] == "function" ? !p4[f4](h3.value, g6) : typeof p4[f4] > "u" || p4[f4] === false ? true : typeof p4[f4] == "string" ? p4[f4] !== h3.value : false;
    }
    return t;
  });
})(Xo);
var Si = Xo.exports;
var Ii = /* @__PURE__ */ Ke(Si);
function yt(n2, e) {
  return n2.map((t) => {
    const o3 = A(e) ? e(t.tool) : e;
    return V(o3) || (t.data = wt(t.data, o3)), t;
  });
}
function Z(n2, e = {}) {
  const t = {
    tags: e
  };
  return new Ii(t).clean(n2);
}
function wt(n2, e) {
  return Array.isArray(n2) ? Oi(n2, e) : D(n2) ? _i(n2, e) : te(n2) ? Mi(n2, e) : n2;
}
function Oi(n2, e) {
  return n2.map((t) => wt(t, e));
}
function _i(n2, e) {
  const t = {};
  for (const o3 in n2) {
    if (!Object.prototype.hasOwnProperty.call(n2, o3))
      continue;
    const i = n2[o3], s2 = Ai(e[o3]) ? e[o3] : e;
    t[o3] = wt(i, s2);
  }
  return t;
}
function Mi(n2, e) {
  return D(e) ? Z(n2, e) : e === false ? Z(n2, {}) : n2;
}
function Ai(n2) {
  return D(n2) || Gn(n2) || A(n2);
}
var Li = class extends E {
  /**
   * Available methods
   *
   * @returns {SanitizerConfig}
   */
  get methods() {
    return {
      clean: (e, t) => this.clean(e, t)
    };
  }
  /**
   * Perform sanitizing of a string
   *
   * @param {string} taintString - what to sanitize
   * @param {SanitizerConfig} config - sanitizer config
   * @returns {string}
   */
  clean(e, t) {
    return Z(e, t);
  }
};
var Pi = class extends E {
  /**
   * Available methods
   *
   * @returns {Saver}
   */
  get methods() {
    return {
      save: () => this.save()
    };
  }
  /**
   * Return Editor's data
   *
   * @returns {OutputData}
   */
  save() {
    const e = "Editor's content can not be saved in read-only mode";
    return this.Editor.ReadOnly.isEnabled ? (X(e, "warn"), Promise.reject(new Error(e))) : this.Editor.Saver.save();
  }
};
var Ni = class extends E {
  constructor() {
    super(...arguments), this.selectionUtils = new b();
  }
  /**
   * Available methods
   *
   * @returns {SelectionAPIInterface}
   */
  get methods() {
    return {
      findParentTag: (e, t) => this.findParentTag(e, t),
      expandToTag: (e) => this.expandToTag(e),
      save: () => this.selectionUtils.save(),
      restore: () => this.selectionUtils.restore(),
      setFakeBackground: () => this.selectionUtils.setFakeBackground(),
      removeFakeBackground: () => this.selectionUtils.removeFakeBackground()
    };
  }
  /**
   * Looks ahead from selection and find passed tag with class name
   *
   * @param {string} tagName - tag to find
   * @param {string} className - tag's class name
   * @returns {HTMLElement|null}
   */
  findParentTag(e, t) {
    return this.selectionUtils.findParentTag(e, t);
  }
  /**
   * Expand selection to passed tag
   *
   * @param {HTMLElement} node - tag that should contain selection
   */
  expandToTag(e) {
    this.selectionUtils.expandToTag(e);
  }
};
var Ri = class extends E {
  /**
   * Available methods
   */
  get methods() {
    return {
      getBlockTools: () => Array.from(this.Editor.Tools.blockTools.values())
    };
  }
};
var Di = class extends E {
  /**
   * Exported classes
   */
  get classes() {
    return {
      /**
       * Base Block styles
       */
      block: "cdx-block",
      /**
       * Inline Tools styles
       */
      inlineToolButton: "ce-inline-tool",
      inlineToolButtonActive: "ce-inline-tool--active",
      /**
       * UI elements
       */
      input: "cdx-input",
      loader: "cdx-loader",
      button: "cdx-button",
      /**
       * Settings styles
       */
      settingsButton: "cdx-settings-button",
      settingsButtonActive: "cdx-settings-button--active"
    };
  }
};
var Fi = class extends E {
  /**
   * Available methods
   *
   * @returns {Toolbar}
   */
  get methods() {
    return {
      close: () => this.close(),
      open: () => this.open(),
      toggleBlockSettings: (e) => this.toggleBlockSettings(e),
      toggleToolbox: (e) => this.toggleToolbox(e)
    };
  }
  /**
   * Open toolbar
   */
  open() {
    this.Editor.Toolbar.moveAndOpen();
  }
  /**
   * Close toolbar and all included elements
   */
  close() {
    this.Editor.Toolbar.close();
  }
  /**
   * Toggles Block Setting of the current block
   *
   * @param {boolean} openingState —  opening state of Block Setting
   */
  toggleBlockSettings(e) {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      X("Could't toggle the Toolbar because there is no block selected ", "warn");
      return;
    }
    e ?? !this.Editor.BlockSettings.opened ? (this.Editor.Toolbar.moveAndOpen(), this.Editor.BlockSettings.open()) : this.Editor.BlockSettings.close();
  }
  /**
   * Open toolbox
   *
   * @param {boolean} openingState - Opening state of toolbox
   */
  toggleToolbox(e) {
    if (this.Editor.BlockManager.currentBlockIndex === -1) {
      X("Could't toggle the Toolbox because there is no block selected ", "warn");
      return;
    }
    e ?? !this.Editor.Toolbar.toolbox.opened ? (this.Editor.Toolbar.moveAndOpen(), this.Editor.Toolbar.toolbox.open()) : this.Editor.Toolbar.toolbox.close();
  }
};
var Vo = { exports: {} };
(function(n2, e) {
  (function(t, o3) {
    n2.exports = o3();
  })(window, function() {
    return function(t) {
      var o3 = {};
      function i(s2) {
        if (o3[s2])
          return o3[s2].exports;
        var r2 = o3[s2] = { i: s2, l: false, exports: {} };
        return t[s2].call(r2.exports, r2, r2.exports, i), r2.l = true, r2.exports;
      }
      return i.m = t, i.c = o3, i.d = function(s2, r2, a3) {
        i.o(s2, r2) || Object.defineProperty(s2, r2, { enumerable: true, get: a3 });
      }, i.r = function(s2) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s2, "__esModule", { value: true });
      }, i.t = function(s2, r2) {
        if (1 & r2 && (s2 = i(s2)), 8 & r2 || 4 & r2 && typeof s2 == "object" && s2 && s2.__esModule)
          return s2;
        var a3 = /* @__PURE__ */ Object.create(null);
        if (i.r(a3), Object.defineProperty(a3, "default", { enumerable: true, value: s2 }), 2 & r2 && typeof s2 != "string")
          for (var l2 in s2)
            i.d(a3, l2, function(c5) {
              return s2[c5];
            }.bind(null, l2));
        return a3;
      }, i.n = function(s2) {
        var r2 = s2 && s2.__esModule ? function() {
          return s2.default;
        } : function() {
          return s2;
        };
        return i.d(r2, "a", r2), r2;
      }, i.o = function(s2, r2) {
        return Object.prototype.hasOwnProperty.call(s2, r2);
      }, i.p = "", i(i.s = 0);
    }([function(t, o3, i) {
      t.exports = i(1);
    }, function(t, o3, i) {
      i.r(o3), i.d(o3, "default", function() {
        return s2;
      });
      class s2 {
        constructor() {
          this.nodes = { wrapper: null, content: null }, this.showed = false, this.offsetTop = 10, this.offsetLeft = 10, this.offsetRight = 10, this.hidingDelay = 0, this.handleWindowScroll = () => {
            this.showed && this.hide(true);
          }, this.loadStyles(), this.prepare(), window.addEventListener("scroll", this.handleWindowScroll, { passive: true });
        }
        get CSS() {
          return { tooltip: "ct", tooltipContent: "ct__content", tooltipShown: "ct--shown", placement: { left: "ct--left", bottom: "ct--bottom", right: "ct--right", top: "ct--top" } };
        }
        show(a3, l2, c5) {
          this.nodes.wrapper || this.prepare(), this.hidingTimeout && clearTimeout(this.hidingTimeout);
          const d3 = Object.assign({ placement: "bottom", marginTop: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, delay: 70, hidingDelay: 0 }, c5);
          if (d3.hidingDelay && (this.hidingDelay = d3.hidingDelay), this.nodes.content.innerHTML = "", typeof l2 == "string")
            this.nodes.content.appendChild(document.createTextNode(l2));
          else {
            if (!(l2 instanceof Node))
              throw Error("[CodeX Tooltip] Wrong type of \xABcontent\xBB passed. It should be an instance of Node or String. But " + typeof l2 + " given.");
            this.nodes.content.appendChild(l2);
          }
          switch (this.nodes.wrapper.classList.remove(...Object.values(this.CSS.placement)), d3.placement) {
            case "top":
              this.placeTop(a3, d3);
              break;
            case "left":
              this.placeLeft(a3, d3);
              break;
            case "right":
              this.placeRight(a3, d3);
              break;
            case "bottom":
            default:
              this.placeBottom(a3, d3);
          }
          d3 && d3.delay ? this.showingTimeout = setTimeout(() => {
            this.nodes.wrapper.classList.add(this.CSS.tooltipShown), this.showed = true;
          }, d3.delay) : (this.nodes.wrapper.classList.add(this.CSS.tooltipShown), this.showed = true);
        }
        hide(a3 = false) {
          if (this.hidingDelay && !a3)
            return this.hidingTimeout && clearTimeout(this.hidingTimeout), void (this.hidingTimeout = setTimeout(() => {
              this.hide(true);
            }, this.hidingDelay));
          this.nodes.wrapper.classList.remove(this.CSS.tooltipShown), this.showed = false, this.showingTimeout && clearTimeout(this.showingTimeout);
        }
        onHover(a3, l2, c5) {
          a3.addEventListener("mouseenter", () => {
            this.show(a3, l2, c5);
          }), a3.addEventListener("mouseleave", () => {
            this.hide();
          });
        }
        destroy() {
          this.nodes.wrapper.remove(), window.removeEventListener("scroll", this.handleWindowScroll);
        }
        prepare() {
          this.nodes.wrapper = this.make("div", this.CSS.tooltip), this.nodes.content = this.make("div", this.CSS.tooltipContent), this.append(this.nodes.wrapper, this.nodes.content), this.append(document.body, this.nodes.wrapper);
        }
        loadStyles() {
          const a3 = "codex-tooltips-style";
          if (document.getElementById(a3))
            return;
          const l2 = i(2), c5 = this.make("style", null, { textContent: l2.toString(), id: a3 });
          this.prepend(document.head, c5);
        }
        placeBottom(a3, l2) {
          const c5 = a3.getBoundingClientRect(), d3 = c5.left + a3.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2, h3 = c5.bottom + window.pageYOffset + this.offsetTop + l2.marginTop;
          this.applyPlacement("bottom", d3, h3);
        }
        placeTop(a3, l2) {
          const c5 = a3.getBoundingClientRect(), d3 = c5.left + a3.clientWidth / 2 - this.nodes.wrapper.offsetWidth / 2, h3 = c5.top + window.pageYOffset - this.nodes.wrapper.clientHeight - this.offsetTop;
          this.applyPlacement("top", d3, h3);
        }
        placeLeft(a3, l2) {
          const c5 = a3.getBoundingClientRect(), d3 = c5.left - this.nodes.wrapper.offsetWidth - this.offsetLeft - l2.marginLeft, h3 = c5.top + window.pageYOffset + a3.clientHeight / 2 - this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("left", d3, h3);
        }
        placeRight(a3, l2) {
          const c5 = a3.getBoundingClientRect(), d3 = c5.right + this.offsetRight + l2.marginRight, h3 = c5.top + window.pageYOffset + a3.clientHeight / 2 - this.nodes.wrapper.offsetHeight / 2;
          this.applyPlacement("right", d3, h3);
        }
        applyPlacement(a3, l2, c5) {
          this.nodes.wrapper.classList.add(this.CSS.placement[a3]), this.nodes.wrapper.style.left = l2 + "px", this.nodes.wrapper.style.top = c5 + "px";
        }
        make(a3, l2 = null, c5 = {}) {
          const d3 = document.createElement(a3);
          Array.isArray(l2) ? d3.classList.add(...l2) : l2 && d3.classList.add(l2);
          for (const h3 in c5)
            c5.hasOwnProperty(h3) && (d3[h3] = c5[h3]);
          return d3;
        }
        append(a3, l2) {
          Array.isArray(l2) ? l2.forEach((c5) => a3.appendChild(c5)) : a3.appendChild(l2);
        }
        prepend(a3, l2) {
          Array.isArray(l2) ? (l2 = l2.reverse()).forEach((c5) => a3.prepend(c5)) : a3.prepend(l2);
        }
      }
    }, function(t, o3) {
      t.exports = `.ct{z-index:999;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1),-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);will-change:opacity,top,left;-webkit-box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);border-radius:9px}.ct,.ct:before{position:absolute;top:0;left:0}.ct:before{content:"";bottom:0;right:0;background-color:#1d202b;z-index:-1;border-radius:4px}@supports(-webkit-mask-box-image:url("")){.ct:before{border-radius:0;-webkit-mask-box-image:url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.71 0h2.58c3.02 0 4.64.42 6.1 1.2a8.18 8.18 0 013.4 3.4C23.6 6.07 24 7.7 24 10.71v2.58c0 3.02-.42 4.64-1.2 6.1a8.18 8.18 0 01-3.4 3.4c-1.47.8-3.1 1.21-6.11 1.21H10.7c-3.02 0-4.64-.42-6.1-1.2a8.18 8.18 0 01-3.4-3.4C.4 17.93 0 16.3 0 13.29V10.7c0-3.02.42-4.64 1.2-6.1a8.18 8.18 0 013.4-3.4C6.07.4 7.7 0 10.71 0z"/></svg>') 48% 41% 37.9% 53.3%}}@media (--mobile){.ct{display:none}}.ct__content{padding:6px 10px;color:#cdd1e0;font-size:12px;text-align:center;letter-spacing:.02em;line-height:1em}.ct:after{content:"";width:8px;height:8px;position:absolute;background-color:#1d202b;z-index:-1}.ct--bottom{-webkit-transform:translateY(5px);transform:translateY(5px)}.ct--bottom:after{top:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--top{-webkit-transform:translateY(-5px);transform:translateY(-5px)}.ct--top:after{top:auto;bottom:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--left{-webkit-transform:translateX(-5px);transform:translateX(-5px)}.ct--left:after{top:50%;left:auto;right:0;-webkit-transform:translate(41.6%,-50%) rotate(-45deg);transform:translate(41.6%,-50%) rotate(-45deg)}.ct--right{-webkit-transform:translateX(5px);transform:translateX(5px)}.ct--right:after{top:50%;left:0;-webkit-transform:translate(-41.6%,-50%) rotate(-45deg);transform:translate(-41.6%,-50%) rotate(-45deg)}.ct--shown{opacity:1;-webkit-transform:none;transform:none}`;
    }]).default;
  });
})(Vo);
var ji = Vo.exports;
var Hi = /* @__PURE__ */ Ke(ji);
var U = null;
function Et() {
  U || (U = new Hi());
}
function $i(n2, e, t) {
  Et(), U == null || U.show(n2, e, t);
}
function $e(n2 = false) {
  Et(), U == null || U.hide(n2);
}
function ze(n2, e, t) {
  Et(), U == null || U.onHover(n2, e, t);
}
function zi() {
  U == null || U.destroy(), U = null;
}
var Ui = class extends E {
  /**
   * @class
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    });
  }
  /**
   * Available methods
   */
  get methods() {
    return {
      show: (e, t, o3) => this.show(e, t, o3),
      hide: () => this.hide(),
      onHover: (e, t, o3) => this.onHover(e, t, o3)
    };
  }
  /**
   * Method show tooltip on element with passed HTML content
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  show(e, t, o3) {
    $i(e, t, o3);
  }
  /**
   * Method hides tooltip on HTML page
   */
  hide() {
    $e();
  }
  /**
   * Decorator for showing Tooltip by mouseenter/mouseleave
   *
   * @param {HTMLElement} element - element on which tooltip should be shown
   * @param {TooltipContent} content - tooltip content
   * @param {TooltipOptions} options - tooltip options
   */
  onHover(e, t, o3) {
    ze(e, t, o3);
  }
};
var Wi = class extends E {
  /**
   * Available methods / getters
   */
  get methods() {
    return {
      nodes: this.editorNodes
      /**
       * There can be added some UI methods, like toggleThinMode() etc
       */
    };
  }
  /**
   * Exported classes
   */
  get editorNodes() {
    return {
      /**
       * Top-level editor instance wrapper
       */
      wrapper: this.Editor.UI.nodes.wrapper,
      /**
       * Element that holds all the Blocks
       */
      redactor: this.Editor.UI.nodes.redactor
    };
  }
};
function qo(n2, e) {
  const t = {};
  return Object.entries(n2).forEach(([o3, i]) => {
    if (D(i)) {
      const s2 = e ? `${e}.${o3}` : o3;
      Object.values(i).every((a3) => te(a3)) ? t[o3] = s2 : t[o3] = qo(i, s2);
      return;
    }
    t[o3] = i;
  }), t;
}
var K = qo(Fo);
function Yi(n2, e) {
  const t = {};
  return Object.keys(n2).forEach((o3) => {
    const i = e[o3];
    i !== void 0 ? t[i] = n2[o3] : t[o3] = n2[o3];
  }), t;
}
var Zo = class Ee {
  /**
   * @param {HTMLElement[]} nodeList — the list of iterable HTML-items
   * @param {string} focusedCssClass - user-provided CSS-class that will be set in flipping process
   */
  constructor(e, t) {
    this.cursor = -1, this.items = [], this.items = e || [], this.focusedCssClass = t;
  }
  /**
   * Returns Focused button Node
   *
   * @returns {HTMLElement}
   */
  get currentItem() {
    return this.cursor === -1 ? null : this.items[this.cursor];
  }
  /**
   * Sets cursor to specified position
   *
   * @param cursorPosition - new cursor position
   */
  setCursor(e) {
    e < this.items.length && e >= -1 && (this.dropCursor(), this.cursor = e, this.items[this.cursor].classList.add(this.focusedCssClass));
  }
  /**
   * Sets items. Can be used when iterable items changed dynamically
   *
   * @param {HTMLElement[]} nodeList - nodes to iterate
   */
  setItems(e) {
    this.items = e;
  }
  /**
   * Sets cursor next to the current
   */
  next() {
    this.cursor = this.leafNodesAndReturnIndex(Ee.directions.RIGHT);
  }
  /**
   * Sets cursor before current
   */
  previous() {
    this.cursor = this.leafNodesAndReturnIndex(Ee.directions.LEFT);
  }
  /**
   * Sets cursor to the default position and removes CSS-class from previously focused item
   */
  dropCursor() {
    this.cursor !== -1 && (this.items[this.cursor].classList.remove(this.focusedCssClass), this.cursor = -1);
  }
  /**
   * Leafs nodes inside the target list from active element
   *
   * @param {string} direction - leaf direction. Can be 'left' or 'right'
   * @returns {number} index of focused node
   */
  leafNodesAndReturnIndex(e) {
    if (this.items.length === 0)
      return this.cursor;
    let t = this.cursor;
    return t === -1 ? t = e === Ee.directions.RIGHT ? -1 : 0 : this.items[t].classList.remove(this.focusedCssClass), e === Ee.directions.RIGHT ? t = (t + 1) % this.items.length : t = (this.items.length + t - 1) % this.items.length, u.canSetCaret(this.items[t]) && Fe(() => b.setCursor(this.items[t]), 50)(), this.items[t].classList.add(this.focusedCssClass), t;
  }
};
Zo.directions = {
  RIGHT: "right",
  LEFT: "left"
};
var ke = Zo;
var ce = class {
  /**
   * @param options - different constructing settings
   */
  constructor(e) {
    this.iterator = null, this.activated = false, this.flipCallbacks = [], this.onKeyDown = (t) => {
      if (!(!this.isEventReadyForHandling(t) || t.shiftKey === true))
        switch (ce.usedKeys.includes(t.keyCode) && t.preventDefault(), t.keyCode) {
          case y.TAB:
            this.handleTabPress(t);
            break;
          case y.LEFT:
          case y.UP:
            this.flipLeft();
            break;
          case y.RIGHT:
          case y.DOWN:
            this.flipRight();
            break;
          case y.ENTER:
            this.handleEnterPress(t);
            break;
        }
    }, this.iterator = new ke(e.items, e.focusedItemClass), this.activateCallback = e.activateCallback, this.allowedKeys = e.allowedKeys || ce.usedKeys;
  }
  /**
   * True if flipper is currently activated
   */
  get isActivated() {
    return this.activated;
  }
  /**
   * Array of keys (codes) that is handled by Flipper
   * Used to:
   *  - preventDefault only for this keys, not all keydowns (@see constructor)
   *  - to skip external behaviours only for these keys, when filler is activated (@see BlockEvents@arrowRightAndDown)
   */
  static get usedKeys() {
    return [
      y.TAB,
      y.LEFT,
      y.RIGHT,
      y.ENTER,
      y.UP,
      y.DOWN
    ];
  }
  /**
   * Active tab/arrows handling by flipper
   *
   * @param items - Some modules (like, InlineToolbar, BlockSettings) might refresh buttons dynamically
   * @param cursorPosition - index of the item that should be focused once flipper is activated
   */
  activate(e, t) {
    this.activated = true, e && this.iterator.setItems(e), t !== void 0 && this.iterator.setCursor(t), document.addEventListener("keydown", this.onKeyDown, true);
  }
  /**
   * Disable tab/arrows handling by flipper
   */
  deactivate() {
    this.activated = false, this.dropCursor(), document.removeEventListener("keydown", this.onKeyDown);
  }
  /**
   * Focus first item
   */
  focusFirst() {
    this.dropCursor(), this.flipRight();
  }
  /**
   * Focuses previous flipper iterator item
   */
  flipLeft() {
    this.iterator.previous(), this.flipCallback();
  }
  /**
   * Focuses next flipper iterator item
   */
  flipRight() {
    this.iterator.next(), this.flipCallback();
  }
  /**
   * Return true if some button is focused
   */
  hasFocus() {
    return !!this.iterator.currentItem;
  }
  /**
   * Registeres function that should be executed on each navigation action
   *
   * @param cb - function to execute
   */
  onFlip(e) {
    this.flipCallbacks.push(e);
  }
  /**
   * Unregisteres function that is executed on each navigation action
   *
   * @param cb - function to stop executing
   */
  removeOnFlip(e) {
    this.flipCallbacks = this.flipCallbacks.filter((t) => t !== e);
  }
  /**
   * Drops flipper's iterator cursor
   *
   * @see DomIterator#dropCursor
   */
  dropCursor() {
    this.iterator.dropCursor();
  }
  /**
   * This function is fired before handling flipper keycodes
   * The result of this function defines if it is need to be handled or not
   *
   * @param {KeyboardEvent} event - keydown keyboard event
   * @returns {boolean}
   */
  isEventReadyForHandling(e) {
    return this.activated && this.allowedKeys.includes(e.keyCode);
  }
  /**
   * When flipper is activated tab press will leaf the items
   *
   * @param {KeyboardEvent} event - tab keydown event
   */
  handleTabPress(e) {
    switch (e.shiftKey ? ke.directions.LEFT : ke.directions.RIGHT) {
      case ke.directions.RIGHT:
        this.flipRight();
        break;
      case ke.directions.LEFT:
        this.flipLeft();
        break;
    }
  }
  /**
   * Enter press will click current item if flipper is activated
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  handleEnterPress(e) {
    this.activated && (this.iterator.currentItem && (e.stopPropagation(), e.preventDefault(), this.iterator.currentItem.click()), A(this.activateCallback) && this.activateCallback(this.iterator.currentItem));
  }
  /**
   * Fired after flipping in any direction
   */
  flipCallback() {
    this.iterator.currentItem && this.iterator.currentItem.scrollIntoViewIfNeeded(), this.flipCallbacks.forEach((e) => e());
  }
};
var Ki = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 12L9 7.1C9 7.04477 9.04477 7 9.1 7H10.4C11.5 7 14 7.1 14 9.5C14 9.5 14 12 11 12M9 12V16.8C9 16.9105 9.08954 17 9.2 17H12.5C14 17 15 16 15 14.5C15 11.7046 11 12 11 12M9 12H11"/></svg>';
var Xi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 10L11.8586 14.8586C11.9367 14.9367 12.0633 14.9367 12.1414 14.8586L17 10"/></svg>';
var Vi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.5 17.5L9.64142 12.6414C9.56331 12.5633 9.56331 12.4367 9.64142 12.3586L14.5 7.5"/></svg>';
var qi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9.58284 17.5L14.4414 12.6414C14.5195 12.5633 14.5195 12.4367 14.4414 12.3586L9.58284 7.5"/></svg>';
var Zi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7 15L11.8586 10.1414C11.9367 10.0633 12.0633 10.0633 12.1414 10.1414L17 15"/></svg>';
var Gi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>';
var Qi = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/></svg>';
var Ji = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13.34 10C12.4223 12.7337 11 17 11 17"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M14.21 7H14.2"/></svg>';
var Co = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.69998 12.6L7.67896 12.62C6.53993 13.7048 6.52012 15.5155 7.63516 16.625V16.625C8.72293 17.7073 10.4799 17.7102 11.5712 16.6314L13.0263 15.193C14.0703 14.1609 14.2141 12.525 13.3662 11.3266L13.22 11.12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16.22 11.12L16.3564 10.9805C17.2895 10.0265 17.3478 8.5207 16.4914 7.49733V7.49733C15.5691 6.39509 13.9269 6.25143 12.8271 7.17675L11.3901 8.38588C10.0935 9.47674 9.95706 11.4241 11.0888 12.6852L11.12 12.72"/></svg>';
var es = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.40999 7.29999H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 7.29999H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.30999 12H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 12H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.40999 16.7H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 16.7H14.59"/></svg>';
var ts = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>';
var Go = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M11.5 17.5L5 11M5 11V15.5M5 11H9.5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12.5 6.5L19 13M19 13V8.5M19 13H14.5"/></svg>';
var os = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" stroke-width="2"/><line x1="15.4142" x2="19" y1="15" y2="18.5858" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>';
var ns = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M15.7795 11.5C15.7795 11.5 16.053 11.1962 16.5497 10.6722C17.4442 9.72856 17.4701 8.2475 16.5781 7.30145V7.30145C15.6482 6.31522 14.0873 6.29227 13.1288 7.25073L11.8796 8.49999"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8.24517 12.3883C8.24517 12.3883 7.97171 12.6922 7.47504 13.2161C6.58051 14.1598 6.55467 15.6408 7.44666 16.5869V16.5869C8.37653 17.5731 9.93744 17.5961 10.8959 16.6376L12.1452 15.3883"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17.7802 15.1032L16.597 14.9422C16.0109 14.8624 15.4841 15.3059 15.4627 15.8969L15.4199 17.0818"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6.39064 9.03238L7.58432 9.06668C8.17551 9.08366 8.6522 8.58665 8.61056 7.99669L8.5271 6.81397"/><line x1="12.1142" x2="11.7" y1="12.2" y2="11.7858" stroke="currentColor" stroke-linecap="round" stroke-width="2"/></svg>';
var is = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/><line x1="12" x2="12" y1="9" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 15.02V15.01"/></svg>';
var ss = "__";
var rs = "--";
function ne(n2) {
  return (e, t) => [[n2, e].filter((i) => !!i).join(ss), t].filter((i) => !!i).join(rs);
}
var ye = ne("ce-hint");
var we = {
  root: ye(),
  alignedStart: ye(null, "align-left"),
  alignedCenter: ye(null, "align-center"),
  title: ye("title"),
  description: ye("description")
};
var as = class {
  /**
   * Constructs the hint content instance
   *
   * @param params - hint content parameters
   */
  constructor(e) {
    this.nodes = {
      root: u.make("div", [we.root, e.alignment === "center" ? we.alignedCenter : we.alignedStart]),
      title: u.make("div", we.title, { textContent: e.title })
    }, this.nodes.root.appendChild(this.nodes.title), e.description !== void 0 && (this.nodes.description = u.make("div", we.description, { textContent: e.description }), this.nodes.root.appendChild(this.nodes.description));
  }
  /**
   * Returns the root element of the hint content
   */
  getElement() {
    return this.nodes.root;
  }
};
var xt = class {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(e) {
    this.params = e;
  }
  /**
   * Item name if exists
   */
  get name() {
    if (this.params !== void 0 && "name" in this.params)
      return this.params.name;
  }
  /**
   * Destroys the instance
   */
  destroy() {
    $e();
  }
  /**
   * Called when children popover is opened (if exists)
   */
  onChildrenOpen() {
    var e;
    this.params !== void 0 && "children" in this.params && typeof ((e = this.params.children) == null ? void 0 : e.onOpen) == "function" && this.params.children.onOpen();
  }
  /**
   * Called when children popover is closed (if exists)
   */
  onChildrenClose() {
    var e;
    this.params !== void 0 && "children" in this.params && typeof ((e = this.params.children) == null ? void 0 : e.onClose) == "function" && this.params.children.onClose();
  }
  /**
   * Called on popover item click
   */
  handleClick() {
    var e, t;
    this.params !== void 0 && "onActivate" in this.params && ((t = (e = this.params).onActivate) == null || t.call(e, this.params));
  }
  /**
   * Adds hint to the item element if hint data is provided
   *
   * @param itemElement - popover item root element to add hint to
   * @param hintData - hint data
   */
  addHint(e, t) {
    const o3 = new as(t);
    ze(e, o3.getElement(), {
      placement: t.position,
      hidingDelay: 100
    });
  }
  /**
   * Returns item children that are represented as popover items
   */
  get children() {
    var e;
    return this.params !== void 0 && "children" in this.params && ((e = this.params.children) == null ? void 0 : e.items) !== void 0 ? this.params.children.items : [];
  }
  /**
   * Returns true if item has any type of children
   */
  get hasChildren() {
    return this.children.length > 0;
  }
  /**
   * Returns true if item children should be open instantly after popover is opened and not on item click/hover
   */
  get isChildrenOpen() {
    var e;
    return this.params !== void 0 && "children" in this.params && ((e = this.params.children) == null ? void 0 : e.isOpen) === true;
  }
  /**
   * True if item children items should be navigatable via keyboard
   */
  get isChildrenFlippable() {
    var e;
    return !(this.params === void 0 || !("children" in this.params) || ((e = this.params.children) == null ? void 0 : e.isFlippable) === false);
  }
  /**
   * Returns true if item has children that should be searchable
   */
  get isChildrenSearchable() {
    var e;
    return this.params !== void 0 && "children" in this.params && ((e = this.params.children) == null ? void 0 : e.searchable) === true;
  }
  /**
   * True if popover should close once item is activated
   */
  get closeOnActivate() {
    return this.params !== void 0 && "closeOnActivate" in this.params && this.params.closeOnActivate;
  }
  /**
   * True if item is active
   */
  get isActive() {
    return this.params === void 0 || !("isActive" in this.params) ? false : typeof this.params.isActive == "function" ? this.params.isActive() : this.params.isActive === true;
  }
};
var Y = ne("ce-popover-item");
var L = {
  container: Y(),
  active: Y(null, "active"),
  disabled: Y(null, "disabled"),
  focused: Y(null, "focused"),
  hidden: Y(null, "hidden"),
  confirmationState: Y(null, "confirmation"),
  noHover: Y(null, "no-hover"),
  noFocus: Y(null, "no-focus"),
  title: Y("title"),
  secondaryTitle: Y("secondary-title"),
  icon: Y("icon"),
  iconTool: Y("icon", "tool"),
  iconChevronRight: Y("icon", "chevron-right"),
  wobbleAnimation: ne("wobble")()
};
var re = class extends xt {
  /**
   * Constructs popover item instance
   *
   * @param params - popover item construction params
   * @param renderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t) {
    super(e), this.params = e, this.nodes = {
      root: null,
      icon: null
    }, this.confirmationState = null, this.removeSpecialFocusBehavior = () => {
      var o3;
      (o3 = this.nodes.root) == null || o3.classList.remove(L.noFocus);
    }, this.removeSpecialHoverBehavior = () => {
      var o3;
      (o3 = this.nodes.root) == null || o3.classList.remove(L.noHover);
    }, this.onErrorAnimationEnd = () => {
      var o3, i;
      (o3 = this.nodes.icon) == null || o3.classList.remove(L.wobbleAnimation), (i = this.nodes.icon) == null || i.removeEventListener("animationend", this.onErrorAnimationEnd);
    }, this.nodes.root = this.make(e, t);
  }
  /**
   * True if item is disabled and hence not clickable
   */
  get isDisabled() {
    return this.params.isDisabled === true;
  }
  /**
   * Exposes popover item toggle parameter
   */
  get toggle() {
    return this.params.toggle;
  }
  /**
   * Item title
   */
  get title() {
    return this.params.title;
  }
  /**
   * True if confirmation state is enabled for popover item
   */
  get isConfirmationStateEnabled() {
    return this.confirmationState !== null;
  }
  /**
   * True if item is focused in keyboard navigation process
   */
  get isFocused() {
    return this.nodes.root === null ? false : this.nodes.root.classList.contains(L.focused);
  }
  /**
   * Returns popover item root element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Called on popover item click
   */
  handleClick() {
    if (this.isConfirmationStateEnabled && this.confirmationState !== null) {
      this.activateOrEnableConfirmationMode(this.confirmationState);
      return;
    }
    this.activateOrEnableConfirmationMode(this.params);
  }
  /**
   * Toggles item active state
   *
   * @param isActive - true if item should strictly should become active
   */
  toggleActive(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(L.active, e);
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(L.hidden, e);
  }
  /**
   * Resets popover item to its original state
   */
  reset() {
    this.isConfirmationStateEnabled && this.disableConfirmationMode();
  }
  /**
   * Method called once item becomes focused during keyboard navigation
   */
  onFocus() {
    this.disableSpecialHoverAndFocusBehavior();
  }
  /**
   * Constructs HTML element corresponding to popover item params
   *
   * @param params - item construction params
   * @param renderParams - popover item render params
   */
  make(e, t) {
    var s2, r2;
    const o3 = (t == null ? void 0 : t.wrapperTag) || "div", i = u.make(o3, L.container, {
      type: o3 === "button" ? "button" : void 0
    });
    return e.name && (i.dataset.itemName = e.name), this.nodes.icon = u.make("div", [L.icon, L.iconTool], {
      innerHTML: e.icon || Qi
    }), i.appendChild(this.nodes.icon), e.title !== void 0 && i.appendChild(u.make("div", L.title, {
      innerHTML: e.title || ""
    })), e.secondaryLabel && i.appendChild(u.make("div", L.secondaryTitle, {
      textContent: e.secondaryLabel
    })), this.hasChildren && i.appendChild(u.make("div", [L.icon, L.iconChevronRight], {
      innerHTML: qi
    })), this.isActive && i.classList.add(L.active), e.isDisabled && i.classList.add(L.disabled), e.hint !== void 0 && ((s2 = t == null ? void 0 : t.hint) == null ? void 0 : s2.enabled) !== false && this.addHint(i, {
      ...e.hint,
      position: ((r2 = t == null ? void 0 : t.hint) == null ? void 0 : r2.position) || "right"
    }), i;
  }
  /**
   * Activates confirmation mode for the item.
   *
   * @param newState - new popover item params that should be applied
   */
  enableConfirmationMode(e) {
    if (this.nodes.root === null)
      return;
    const t = {
      ...this.params,
      ...e,
      confirmation: "confirmation" in e ? e.confirmation : void 0
    }, o3 = this.make(t);
    this.nodes.root.innerHTML = o3.innerHTML, this.nodes.root.classList.add(L.confirmationState), this.confirmationState = e, this.enableSpecialHoverAndFocusBehavior();
  }
  /**
   * Returns item to its original state
   */
  disableConfirmationMode() {
    if (this.nodes.root === null)
      return;
    const e = this.make(this.params);
    this.nodes.root.innerHTML = e.innerHTML, this.nodes.root.classList.remove(L.confirmationState), this.confirmationState = null, this.disableSpecialHoverAndFocusBehavior();
  }
  /**
   * Enables special focus and hover behavior for item in confirmation state.
   * This is needed to prevent item from being highlighted as hovered/focused just after click.
   */
  enableSpecialHoverAndFocusBehavior() {
    var e, t, o3;
    (e = this.nodes.root) == null || e.classList.add(L.noHover), (t = this.nodes.root) == null || t.classList.add(L.noFocus), (o3 = this.nodes.root) == null || o3.addEventListener("mouseleave", this.removeSpecialHoverBehavior, { once: true });
  }
  /**
   * Disables special focus and hover behavior
   */
  disableSpecialHoverAndFocusBehavior() {
    var e;
    this.removeSpecialFocusBehavior(), this.removeSpecialHoverBehavior(), (e = this.nodes.root) == null || e.removeEventListener("mouseleave", this.removeSpecialHoverBehavior);
  }
  /**
   * Executes item's onActivate callback if the item has no confirmation configured
   *
   * @param item - item to activate or bring to confirmation mode
   */
  activateOrEnableConfirmationMode(e) {
    var t;
    if (!("confirmation" in e) || e.confirmation === void 0)
      try {
        (t = e.onActivate) == null || t.call(e, e), this.disableConfirmationMode();
      } catch {
        this.animateError();
      }
    else
      this.enableConfirmationMode(e.confirmation);
  }
  /**
   * Animates item which symbolizes that error occured while executing 'onActivate()' callback
   */
  animateError() {
    var e, t, o3;
    (e = this.nodes.icon) != null && e.classList.contains(L.wobbleAnimation) || ((t = this.nodes.icon) == null || t.classList.add(L.wobbleAnimation), (o3 = this.nodes.icon) == null || o3.addEventListener("animationend", this.onErrorAnimationEnd));
  }
};
var nt = ne("ce-popover-item-separator");
var it = {
  container: nt(),
  line: nt("line"),
  hidden: nt(null, "hidden")
};
var Qo = class extends xt {
  /**
   * Constructs the instance
   */
  constructor() {
    super(), this.nodes = {
      root: u.make("div", it.container),
      line: u.make("div", it.line)
    }, this.nodes.root.appendChild(this.nodes.line);
  }
  /**
   * Returns popover separator root element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(it.hidden, e);
  }
};
var G = /* @__PURE__ */ ((n2) => (n2.Closed = "closed", n2.ClosedOnActivate = "closed-on-activate", n2))(G || {});
var $ = ne("ce-popover");
var P = {
  popover: $(),
  popoverContainer: $("container"),
  popoverOpenTop: $(null, "open-top"),
  popoverOpenLeft: $(null, "open-left"),
  popoverOpened: $(null, "opened"),
  search: $("search"),
  nothingFoundMessage: $("nothing-found-message"),
  nothingFoundMessageDisplayed: $("nothing-found-message", "displayed"),
  items: $("items"),
  overlay: $("overlay"),
  overlayHidden: $("overlay", "hidden"),
  popoverNested: $(null, "nested"),
  getPopoverNestedClass: (n2) => $(null, `nested-level-${n2.toString()}`),
  popoverInline: $(null, "inline"),
  popoverHeader: $("header")
};
var fe = /* @__PURE__ */ ((n2) => (n2.NestingLevel = "--nesting-level", n2.PopoverHeight = "--popover-height", n2.InlinePopoverWidth = "--inline-popover-width", n2.TriggerItemLeft = "--trigger-item-left", n2.TriggerItemTop = "--trigger-item-top", n2))(fe || {});
var To = ne("ce-popover-item-html");
var So = {
  root: To(),
  hidden: To(null, "hidden")
};
var Se = class extends xt {
  /**
   * Constructs the instance
   *
   * @param params – instance parameters
   * @param renderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t) {
    var o3, i;
    super(e), this.nodes = {
      root: u.make("div", So.root)
    }, this.nodes.root.appendChild(e.element), e.name && (this.nodes.root.dataset.itemName = e.name), e.hint !== void 0 && ((o3 = t == null ? void 0 : t.hint) == null ? void 0 : o3.enabled) !== false && this.addHint(this.nodes.root, {
      ...e.hint,
      position: ((i = t == null ? void 0 : t.hint) == null ? void 0 : i.position) || "right"
    });
  }
  /**
   * Returns popover item root element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Toggles item hidden state
   *
   * @param isHidden - true if item should be hidden
   */
  toggleHidden(e) {
    var t;
    (t = this.nodes.root) == null || t.classList.toggle(So.hidden, e);
  }
  /**
   * Returns list of buttons and inputs inside custom content
   */
  getControls() {
    const e = this.nodes.root.querySelectorAll(
      `button, ${u.allInputsSelector}`
    );
    return Array.from(e);
  }
};
var Jo = class extends Oe {
  /**
   * Constructs the instance
   *
   * @param params - popover construction params
   * @param itemsRenderParams - popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t = {}) {
    super(), this.params = e, this.itemsRenderParams = t, this.listeners = new _e(), this.messages = {
      nothingFound: "Nothing found",
      search: "Search"
    }, this.items = this.buildItems(e.items), e.messages && (this.messages = {
      ...this.messages,
      ...e.messages
    }), this.nodes = {}, this.nodes.popoverContainer = u.make("div", [P.popoverContainer]), this.nodes.nothingFoundMessage = u.make("div", [P.nothingFoundMessage], {
      textContent: this.messages.nothingFound
    }), this.nodes.popoverContainer.appendChild(this.nodes.nothingFoundMessage), this.nodes.items = u.make("div", [P.items]), this.items.forEach((o3) => {
      const i = o3.getElement();
      i !== null && this.nodes.items.appendChild(i);
    }), this.nodes.popoverContainer.appendChild(this.nodes.items), this.listeners.on(this.nodes.popoverContainer, "click", (o3) => this.handleClick(o3)), this.nodes.popover = u.make(
      "div",
      [
        P.popover,
        this.params.class
      ]
    ), this.nodes.popover.appendChild(this.nodes.popoverContainer);
  }
  /**
   * List of default popover items that are searchable and may have confirmation state
   */
  get itemsDefault() {
    return this.items.filter((e) => e instanceof re);
  }
  /**
   * Returns HTML element corresponding to the popover
   */
  getElement() {
    return this.nodes.popover;
  }
  /**
   * Open popover
   */
  show() {
    this.nodes.popover.classList.add(P.popoverOpened), this.search !== void 0 && this.search.focus();
  }
  /**
   * Closes popover
   */
  hide() {
    this.nodes.popover.classList.remove(P.popoverOpened), this.nodes.popover.classList.remove(P.popoverOpenTop), this.itemsDefault.forEach((e) => e.reset()), this.search !== void 0 && this.search.clear(), this.emit(G.Closed);
  }
  /**
   * Clears memory
   */
  destroy() {
    var e;
    this.items.forEach((t) => t.destroy()), this.nodes.popover.remove(), this.listeners.removeAll(), (e = this.search) == null || e.destroy();
  }
  /**
   * Looks for the item by name and imitates click on it
   *
   * @param name - name of the item to activate
   */
  activateItemByName(e) {
    const t = this.items.find((o3) => o3.name === e);
    this.handleItemClick(t);
  }
  /**
   * Factory method for creating popover items
   *
   * @param items - list of items params
   */
  buildItems(e) {
    return e.map((t) => {
      switch (t.type) {
        case _.Separator:
          return new Qo();
        case _.Html:
          return new Se(t, this.itemsRenderParams[_.Html]);
        default:
          return new re(t, this.itemsRenderParams[_.Default]);
      }
    });
  }
  /**
   * Retrieves popover item that is the target of the specified event
   *
   * @param event - event to retrieve popover item from
   */
  getTargetItem(e) {
    return this.items.filter((t) => t instanceof re || t instanceof Se).find((t) => {
      const o3 = t.getElement();
      return o3 === null ? false : e.composedPath().includes(o3);
    });
  }
  /**
   * Handles popover item click
   *
   * @param item - item to handle click of
   */
  handleItemClick(e) {
    if (!("isDisabled" in e && e.isDisabled)) {
      if (e.hasChildren) {
        this.showNestedItems(e), "handleClick" in e && typeof e.handleClick == "function" && e.handleClick();
        return;
      }
      this.itemsDefault.filter((t) => t !== e).forEach((t) => t.reset()), "handleClick" in e && typeof e.handleClick == "function" && e.handleClick(), this.toggleItemActivenessIfNeeded(e), e.closeOnActivate && (this.hide(), this.emit(G.ClosedOnActivate));
    }
  }
  /**
   * Handles clicks inside popover
   *
   * @param event - item to handle click of
   */
  handleClick(e) {
    const t = this.getTargetItem(e);
    t !== void 0 && this.handleItemClick(t);
  }
  /**
   * - Toggles item active state, if clicked popover item has property 'toggle' set to true.
   *
   * - Performs radiobutton-like behavior if the item has property 'toggle' set to string key.
   * (All the other items with the same key get inactive, and the item gets active)
   *
   * @param clickedItem - popover item that was clicked
   */
  toggleItemActivenessIfNeeded(e) {
    if (e instanceof re && (e.toggle === true && e.toggleActive(), typeof e.toggle == "string")) {
      const t = this.itemsDefault.filter((o3) => o3.toggle === e.toggle);
      if (t.length === 1) {
        e.toggleActive();
        return;
      }
      t.forEach((o3) => {
        o3.toggleActive(o3 === e);
      });
    }
  }
};
var Ue = /* @__PURE__ */ ((n2) => (n2.Search = "search", n2))(Ue || {});
var st = ne("cdx-search-field");
var rt = {
  wrapper: st(),
  icon: st("icon"),
  input: st("input")
};
var ls = class extends Oe {
  /**
   * @param options - available config
   * @param options.items - searchable items list
   * @param options.placeholder - input placeholder
   */
  constructor({ items: e, placeholder: t }) {
    super(), this.listeners = new _e(), this.items = e, this.wrapper = u.make("div", rt.wrapper);
    const o3 = u.make("div", rt.icon, {
      innerHTML: os
    });
    this.input = u.make("input", rt.input, {
      placeholder: t,
      /**
       * Used to prevent focusing on the input by Tab key
       * (Popover in the Toolbar lays below the blocks,
       * so Tab in the last block will focus this hidden input if this property is not set)
       */
      tabIndex: -1
    }), this.wrapper.appendChild(o3), this.wrapper.appendChild(this.input), this.listeners.on(this.input, "input", () => {
      this.searchQuery = this.input.value, this.emit(Ue.Search, {
        query: this.searchQuery,
        items: this.foundItems
      });
    });
  }
  /**
   * Returns search field element
   */
  getElement() {
    return this.wrapper;
  }
  /**
   * Sets focus to the input
   */
  focus() {
    this.input.focus();
  }
  /**
   * Clears search query and results
   */
  clear() {
    this.input.value = "", this.searchQuery = "", this.emit(Ue.Search, {
      query: "",
      items: this.foundItems
    });
  }
  /**
   * Clears memory
   */
  destroy() {
    this.listeners.removeAll();
  }
  /**
   * Returns list of found items for the current search query
   */
  get foundItems() {
    return this.items.filter((e) => this.checkItem(e));
  }
  /**
   * Contains logic for checking whether passed item conforms the search query
   *
   * @param item - item to be checked
   */
  checkItem(e) {
    var i, s2;
    const t = ((i = e.title) == null ? void 0 : i.toLowerCase()) || "", o3 = (s2 = this.searchQuery) == null ? void 0 : s2.toLowerCase();
    return o3 !== void 0 ? t.includes(o3) : false;
  }
};
var cs = Object.defineProperty;
var ds = Object.getOwnPropertyDescriptor;
var us = (n2, e, t, o3) => {
  for (var i = o3 > 1 ? void 0 : o3 ? ds(e, t) : e, s2 = n2.length - 1, r2; s2 >= 0; s2--)
    (r2 = n2[s2]) && (i = (o3 ? r2(e, t, i) : r2(i)) || i);
  return o3 && i && cs(e, t, i), i;
};
var en = class tn extends Jo {
  /**
   * Construct the instance
   *
   * @param params - popover params
   * @param itemsRenderParams – popover item render params.
   * The parameters that are not set by user via popover api but rather depend on technical implementation
   */
  constructor(e, t) {
    super(e, t), this.nestingLevel = 0, this.nestedPopoverTriggerItem = null, this.previouslyHoveredItem = null, this.scopeElement = document.body, this.hide = () => {
      var o3;
      super.hide(), this.destroyNestedPopoverIfExists(), (o3 = this.flipper) == null || o3.deactivate(), this.previouslyHoveredItem = null;
    }, this.onFlip = () => {
      const o3 = this.itemsDefault.find((i) => i.isFocused);
      o3 == null || o3.onFocus();
    }, this.onSearch = (o3) => {
      var a3;
      const i = o3.query === "", s2 = o3.items.length === 0;
      this.items.forEach((l2) => {
        let c5 = false;
        l2 instanceof re ? c5 = !o3.items.includes(l2) : (l2 instanceof Qo || l2 instanceof Se) && (c5 = s2 || !i), l2.toggleHidden(c5);
      }), this.toggleNothingFoundMessage(s2);
      const r2 = o3.query === "" ? this.flippableElements : o3.items.map((l2) => l2.getElement());
      (a3 = this.flipper) != null && a3.isActivated && (this.flipper.deactivate(), this.flipper.activate(r2));
    }, e.nestingLevel !== void 0 && (this.nestingLevel = e.nestingLevel), this.nestingLevel > 0 && this.nodes.popover.classList.add(P.popoverNested), e.scopeElement !== void 0 && (this.scopeElement = e.scopeElement), this.nodes.popoverContainer !== null && this.listeners.on(this.nodes.popoverContainer, "mouseover", (o3) => this.handleHover(o3)), e.searchable && this.addSearch(), e.flippable !== false && (this.flipper = new ce({
      items: this.flippableElements,
      focusedItemClass: L.focused,
      allowedKeys: [
        y.TAB,
        y.UP,
        y.DOWN,
        y.ENTER
      ]
    }), this.flipper.onFlip(this.onFlip));
  }
  /**
   * Returns true if some item inside popover is focused
   */
  hasFocus() {
    return this.flipper === void 0 ? false : this.flipper.hasFocus();
  }
  /**
   * Scroll position inside items container of the popover
   */
  get scrollTop() {
    return this.nodes.items === null ? 0 : this.nodes.items.scrollTop;
  }
  /**
   * Returns visible element offset top
   */
  get offsetTop() {
    return this.nodes.popoverContainer === null ? 0 : this.nodes.popoverContainer.offsetTop;
  }
  /**
   * Open popover
   */
  show() {
    var e;
    this.nodes.popover.style.setProperty(fe.PopoverHeight, this.size.height + "px"), this.shouldOpenBottom || this.nodes.popover.classList.add(P.popoverOpenTop), this.shouldOpenRight || this.nodes.popover.classList.add(P.popoverOpenLeft), super.show(), (e = this.flipper) == null || e.activate(this.flippableElements);
  }
  /**
   * Clears memory
   */
  destroy() {
    this.hide(), super.destroy();
  }
  /**
   * Handles displaying nested items for the item.
   *
   * @param item – item to show nested popover for
   */
  showNestedItems(e) {
    this.nestedPopover !== null && this.nestedPopover !== void 0 || (this.nestedPopoverTriggerItem = e, this.showNestedPopoverForItem(e));
  }
  /**
   * Handles hover events inside popover items container
   *
   * @param event - hover event data
   */
  handleHover(e) {
    const t = this.getTargetItem(e);
    t !== void 0 && this.previouslyHoveredItem !== t && (this.destroyNestedPopoverIfExists(), this.previouslyHoveredItem = t, t.hasChildren && this.showNestedPopoverForItem(t));
  }
  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used for correct positioning of the nested popover
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  setTriggerItemPosition(e, t) {
    const o3 = t.getElement(), i = (o3 ? o3.offsetTop : 0) - this.scrollTop, s2 = this.offsetTop + i;
    e.style.setProperty(fe.TriggerItemTop, s2 + "px");
  }
  /**
   * Destroys existing nested popover
   */
  destroyNestedPopoverIfExists() {
    var e, t;
    this.nestedPopover === void 0 || this.nestedPopover === null || (this.nestedPopover.off(G.ClosedOnActivate, this.hide), this.nestedPopover.hide(), this.nestedPopover.destroy(), this.nestedPopover.getElement().remove(), this.nestedPopover = null, (e = this.flipper) == null || e.activate(this.flippableElements), (t = this.nestedPopoverTriggerItem) == null || t.onChildrenClose());
  }
  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  showNestedPopoverForItem(e) {
    var o3;
    this.nestedPopover = new tn({
      searchable: e.isChildrenSearchable,
      items: e.children,
      nestingLevel: this.nestingLevel + 1,
      flippable: e.isChildrenFlippable,
      messages: this.messages
    }), e.onChildrenOpen(), this.nestedPopover.on(G.ClosedOnActivate, this.hide);
    const t = this.nestedPopover.getElement();
    return this.nodes.popover.appendChild(t), this.setTriggerItemPosition(t, e), t.style.setProperty(fe.NestingLevel, this.nestedPopover.nestingLevel.toString()), this.nestedPopover.show(), (o3 = this.flipper) == null || o3.deactivate(), this.nestedPopover;
  }
  /**
   * Checks if popover should be opened bottom.
   * It should happen when there is enough space below or not enough space above
   */
  get shouldOpenBottom() {
    if (this.nodes.popover === void 0 || this.nodes.popover === null)
      return false;
    const e = this.nodes.popoverContainer.getBoundingClientRect(), t = this.scopeElement.getBoundingClientRect(), o3 = this.size.height, i = e.top + o3, s2 = e.top - o3, r2 = Math.min(window.innerHeight, t.bottom);
    return s2 < t.top || i <= r2;
  }
  /**
   * Checks if popover should be opened left.
   * It should happen when there is enough space in the right or not enough space in the left
   */
  get shouldOpenRight() {
    if (this.nodes.popover === void 0 || this.nodes.popover === null)
      return false;
    const e = this.nodes.popover.getBoundingClientRect(), t = this.scopeElement.getBoundingClientRect(), o3 = this.size.width, i = e.right + o3, s2 = e.left - o3, r2 = Math.min(window.innerWidth, t.right);
    return s2 < t.left || i <= r2;
  }
  get size() {
    var i;
    const e = {
      height: 0,
      width: 0
    };
    if (this.nodes.popover === null)
      return e;
    const t = this.nodes.popover.cloneNode(true);
    t.style.visibility = "hidden", t.style.position = "absolute", t.style.top = "-1000px", t.classList.add(P.popoverOpened), (i = t.querySelector("." + P.popoverNested)) == null || i.remove(), document.body.appendChild(t);
    const o3 = t.querySelector("." + P.popoverContainer);
    return e.height = o3.offsetHeight, e.width = o3.offsetWidth, t.remove(), e;
  }
  /**
   * Returns list of elements available for keyboard navigation.
   */
  get flippableElements() {
    return this.items.map((t) => {
      if (t instanceof re)
        return t.getElement();
      if (t instanceof Se)
        return t.getControls();
    }).flat().filter((t) => t != null);
  }
  /**
   * Adds search to the popover
   */
  addSearch() {
    this.search = new ls({
      items: this.itemsDefault,
      placeholder: this.messages.search
    }), this.search.on(Ue.Search, this.onSearch);
    const e = this.search.getElement();
    e.classList.add(P.search), this.nodes.popoverContainer.insertBefore(e, this.nodes.popoverContainer.firstChild);
  }
  /**
   * Toggles nothing found message visibility
   *
   * @param isDisplayed - true if the message should be displayed
   */
  toggleNothingFoundMessage(e) {
    this.nodes.nothingFoundMessage.classList.toggle(P.nothingFoundMessageDisplayed, e);
  }
};
us(
  [
    me
  ],
  en.prototype,
  "size",
  1
);
var Bt = en;
var hs = class extends Bt {
  /**
   * Constructs the instance
   *
   * @param params - instance parameters
   */
  constructor(e) {
    const t = !be();
    super(
      {
        ...e,
        class: P.popoverInline
      },
      {
        [_.Default]: {
          /**
           * We use button instead of div here to fix bug associated with focus loss (which leads to selection change) on click in safari
           *
           * @todo figure out better way to solve the issue
           */
          wrapperTag: "button",
          hint: {
            position: "top",
            alignment: "center",
            enabled: t
          }
        },
        [_.Html]: {
          hint: {
            position: "top",
            alignment: "center",
            enabled: t
          }
        }
      }
    ), this.items.forEach((o3) => {
      !(o3 instanceof re) && !(o3 instanceof Se) || o3.hasChildren && o3.isChildrenOpen && this.showNestedItems(o3);
    });
  }
  /**
   * Returns visible element offset top
   */
  get offsetLeft() {
    return this.nodes.popoverContainer === null ? 0 : this.nodes.popoverContainer.offsetLeft;
  }
  /**
   * Open popover
   */
  show() {
    this.nestingLevel === 0 && this.nodes.popover.style.setProperty(
      fe.InlinePopoverWidth,
      this.size.width + "px"
    ), super.show();
  }
  /**
   * Disable hover event handling.
   * Overrides parent's class behavior
   */
  handleHover() {
  }
  /**
   * Sets CSS variable with position of item near which nested popover should be displayed.
   * Is used to position nested popover right below clicked item
   *
   * @param nestedPopoverEl - nested popover element
   * @param item – item near which nested popover should be displayed
   */
  setTriggerItemPosition(e, t) {
    const o3 = t.getElement(), i = o3 ? o3.offsetLeft : 0, s2 = this.offsetLeft + i;
    e.style.setProperty(
      fe.TriggerItemLeft,
      s2 + "px"
    );
  }
  /**
   * Handles displaying nested items for the item.
   * Overriding in order to add toggling behaviour
   *
   * @param item – item to toggle nested popover for
   */
  showNestedItems(e) {
    if (this.nestedPopoverTriggerItem === e) {
      this.destroyNestedPopoverIfExists(), this.nestedPopoverTriggerItem = null;
      return;
    }
    super.showNestedItems(e);
  }
  /**
   * Creates and displays nested popover for specified item.
   * Is used only on desktop
   *
   * @param item - item to display nested popover by
   */
  showNestedPopoverForItem(e) {
    const t = super.showNestedPopoverForItem(e);
    return t.getElement().classList.add(P.getPopoverNestedClass(t.nestingLevel)), t;
  }
  /**
   * Overrides default item click handling.
   * Helps to close nested popover once other item is clicked.
   *
   * @param item - clicked item
   */
  handleItemClick(e) {
    var t;
    e !== this.nestedPopoverTriggerItem && ((t = this.nestedPopoverTriggerItem) == null || t.handleClick(), super.destroyNestedPopoverIfExists()), super.handleItemClick(e);
  }
};
var on = class xe {
  constructor() {
    this.scrollPosition = null;
  }
  /**
   * Locks body element scroll
   */
  lock() {
    pt ? this.lockHard() : document.body.classList.add(xe.CSS.scrollLocked);
  }
  /**
   * Unlocks body element scroll
   */
  unlock() {
    pt ? this.unlockHard() : document.body.classList.remove(xe.CSS.scrollLocked);
  }
  /**
   * Locks scroll in a hard way (via setting fixed position to body element)
   */
  lockHard() {
    this.scrollPosition = window.pageYOffset, document.documentElement.style.setProperty(
      "--window-scroll-offset",
      `${this.scrollPosition}px`
    ), document.body.classList.add(xe.CSS.scrollLockedHard);
  }
  /**
   * Unlocks hard scroll lock
   */
  unlockHard() {
    document.body.classList.remove(xe.CSS.scrollLockedHard), this.scrollPosition !== null && window.scrollTo(0, this.scrollPosition), this.scrollPosition = null;
  }
};
on.CSS = {
  scrollLocked: "ce-scroll-locked",
  scrollLockedHard: "ce-scroll-locked--hard"
};
var ps = on;
var at = ne("ce-popover-header");
var lt = {
  root: at(),
  text: at("text"),
  backButton: at("back-button")
};
var fs = class {
  /**
   * Constructs the instance
   *
   * @param params - popover header params
   */
  constructor({ text: e, onBackButtonClick: t }) {
    this.listeners = new _e(), this.text = e, this.onBackButtonClick = t, this.nodes = {
      root: u.make("div", [lt.root]),
      backButton: u.make("button", [lt.backButton]),
      text: u.make("div", [lt.text])
    }, this.nodes.backButton.innerHTML = Vi, this.nodes.root.appendChild(this.nodes.backButton), this.listeners.on(this.nodes.backButton, "click", this.onBackButtonClick), this.nodes.text.innerText = this.text, this.nodes.root.appendChild(this.nodes.text);
  }
  /**
   * Returns popover header root html element
   */
  getElement() {
    return this.nodes.root;
  }
  /**
   * Destroys the instance
   */
  destroy() {
    this.nodes.root.remove(), this.listeners.destroy();
  }
};
var gs = class {
  constructor() {
    this.history = [];
  }
  /**
   * Push new popover state
   *
   * @param state - new state
   */
  push(e) {
    this.history.push(e);
  }
  /**
   * Pop last popover state
   */
  pop() {
    return this.history.pop();
  }
  /**
   * Title retrieved from the current state
   */
  get currentTitle() {
    return this.history.length === 0 ? "" : this.history[this.history.length - 1].title;
  }
  /**
   * Items list retrieved from the current state
   */
  get currentItems() {
    return this.history.length === 0 ? [] : this.history[this.history.length - 1].items;
  }
  /**
   * Returns history to initial popover state
   */
  reset() {
    for (; this.history.length > 1; )
      this.pop();
  }
};
var nn = class extends Jo {
  /**
   * Construct the instance
   *
   * @param params - popover params
   */
  constructor(e) {
    super(e, {
      [_.Default]: {
        hint: {
          enabled: false
        }
      },
      [_.Html]: {
        hint: {
          enabled: false
        }
      }
    }), this.scrollLocker = new ps(), this.history = new gs(), this.isHidden = true, this.nodes.overlay = u.make("div", [P.overlay, P.overlayHidden]), this.nodes.popover.insertBefore(this.nodes.overlay, this.nodes.popover.firstChild), this.listeners.on(this.nodes.overlay, "click", () => {
      this.hide();
    }), this.history.push({ items: e.items });
  }
  /**
   * Open popover
   */
  show() {
    this.nodes.overlay.classList.remove(P.overlayHidden), super.show(), this.scrollLocker.lock(), this.isHidden = false;
  }
  /**
   * Closes popover
   */
  hide() {
    this.isHidden || (super.hide(), this.nodes.overlay.classList.add(P.overlayHidden), this.scrollLocker.unlock(), this.history.reset(), this.isHidden = true);
  }
  /**
   * Clears memory
   */
  destroy() {
    super.destroy(), this.scrollLocker.unlock();
  }
  /**
   * Handles displaying nested items for the item
   *
   * @param item – item to show nested popover for
   */
  showNestedItems(e) {
    this.updateItemsAndHeader(e.children, e.title), this.history.push({
      title: e.title,
      items: e.children
    });
  }
  /**
   * Removes rendered popover items and header and displays new ones
   *
   * @param items - new popover items
   * @param title - new popover header text
   */
  updateItemsAndHeader(e, t) {
    if (this.header !== null && this.header !== void 0 && (this.header.destroy(), this.header = null), t !== void 0) {
      this.header = new fs({
        text: t,
        onBackButtonClick: () => {
          this.history.pop(), this.updateItemsAndHeader(this.history.currentItems, this.history.currentTitle);
        }
      });
      const o3 = this.header.getElement();
      o3 !== null && this.nodes.popoverContainer.insertBefore(o3, this.nodes.popoverContainer.firstChild);
    }
    this.items.forEach((o3) => {
      var i;
      return (i = o3.getElement()) == null ? void 0 : i.remove();
    }), this.items = this.buildItems(e), this.items.forEach((o3) => {
      var s2;
      const i = o3.getElement();
      i !== null && ((s2 = this.nodes.items) == null || s2.appendChild(i));
    });
  }
};
var ms = class extends E {
  constructor() {
    super(...arguments), this.opened = false, this.hasMobileLayoutToggleListener = false, this.selection = new b(), this.popover = null, this.close = () => {
      this.opened && (this.opened = false, b.isAtEditor || this.selection.restore(), this.selection.clearSaved(), !this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted && this.Editor.BlockManager.currentBlock && this.Editor.BlockSelection.unselectBlock(this.Editor.BlockManager.currentBlock), this.eventsDispatcher.emit(this.events.closed), this.popover && (this.popover.off(G.Closed, this.onPopoverClose), this.popover.destroy(), this.popover.getElement().remove(), this.popover = null));
    }, this.onPopoverClose = () => {
      this.close();
    };
  }
  /**
   * Module Events
   */
  get events() {
    return {
      opened: "block-settings-opened",
      closed: "block-settings-closed"
    };
  }
  /**
   * Block Settings CSS
   */
  get CSS() {
    return {
      settings: "ce-settings"
    };
  }
  /**
   * Getter for inner popover's flipper instance
   *
   * @todo remove once BlockSettings becomes standalone non-module class
   */
  get flipper() {
    var e;
    if (this.popover !== null)
      return "flipper" in this.popover ? (e = this.popover) == null ? void 0 : e.flipper : void 0;
  }
  /**
   * Panel with block settings with 2 sections:
   *  - Tool's Settings
   *  - Default Settings [Move, Remove, etc]
   */
  make() {
    this.nodes.wrapper = u.make("div", [this.CSS.settings]), this.eventsDispatcher.on(Te, this.close), this.hasMobileLayoutToggleListener = true;
  }
  /**
   * Destroys module
   */
  destroy() {
    this.removeAllNodes(), this.listeners.destroy(), this.hasMobileLayoutToggleListener && (this.eventsDispatcher.off(Te, this.close), this.hasMobileLayoutToggleListener = false);
  }
  /**
   * Open Block Settings pane
   *
   * @param targetBlock - near which Block we should open BlockSettings
   */
  async open(e = this.Editor.BlockManager.currentBlock) {
    var s2;
    this.opened = true, this.selection.save(), this.Editor.BlockSelection.selectBlock(e), this.Editor.BlockSelection.clearCache();
    const { toolTunes: t, commonTunes: o3 } = e.getTunes();
    this.eventsDispatcher.emit(this.events.opened);
    const i = be() ? nn : Bt;
    this.popover = new i({
      searchable: true,
      items: await this.getTunesItems(e, o3, t),
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: z.ui(K.ui.popover, "Nothing found"),
        search: z.ui(K.ui.popover, "Filter")
      }
    }), this.popover.on(G.Closed, this.onPopoverClose), (s2 = this.nodes.wrapper) == null || s2.append(this.popover.getElement()), this.popover.show();
  }
  /**
   * Returns root block settings element
   */
  getElement() {
    return this.nodes.wrapper;
  }
  /**
   * Returns list of items to be displayed in block tunes menu.
   * Merges tool specific tunes, conversion menu and common tunes in one list in predefined order
   *
   * @param currentBlock –  block we are about to open block tunes for
   * @param commonTunes – common tunes
   * @param toolTunes - tool specific tunes
   */
  async getTunesItems(e, t, o3) {
    const i = [];
    o3 !== void 0 && o3.length > 0 && (i.push(...o3), i.push({
      type: _.Separator
    }));
    const s2 = Array.from(this.Editor.Tools.blockTools.values()), a3 = (await Yo(e, s2)).reduce((l2, c5) => (c5.toolbox.forEach((d3) => {
      l2.push({
        icon: d3.icon,
        title: z.t(K.toolNames, d3.title),
        name: c5.name,
        closeOnActivate: true,
        onActivate: async () => {
          const { BlockManager: h3, Caret: p4, Toolbar: g6 } = this.Editor, f4 = await h3.convert(e, c5.name, d3.data);
          g6.close(), p4.setToBlock(f4, p4.positions.END);
        }
      });
    }), l2), []);
    return a3.length > 0 && (i.push({
      icon: Go,
      name: "convert-to",
      title: z.ui(K.ui.popover, "Convert to"),
      children: {
        searchable: true,
        items: a3
      }
    }), i.push({
      type: _.Separator
    })), i.push(...t), i.map((l2) => this.resolveTuneAliases(l2));
  }
  /**
   * Resolves aliases in tunes menu items
   *
   * @param item - item with resolved aliases
   */
  resolveTuneAliases(e) {
    if (e.type === _.Separator || e.type === _.Html)
      return e;
    const t = Yi(e, { label: "title" });
    return e.confirmation && (t.confirmation = this.resolveTuneAliases(e.confirmation)), t;
  }
};
var sn = { exports: {} };
(function(n2, e) {
  (function(t, o3) {
    n2.exports = o3();
  })(window, function() {
    return function(t) {
      var o3 = {};
      function i(s2) {
        if (o3[s2])
          return o3[s2].exports;
        var r2 = o3[s2] = { i: s2, l: false, exports: {} };
        return t[s2].call(r2.exports, r2, r2.exports, i), r2.l = true, r2.exports;
      }
      return i.m = t, i.c = o3, i.d = function(s2, r2, a3) {
        i.o(s2, r2) || Object.defineProperty(s2, r2, { enumerable: true, get: a3 });
      }, i.r = function(s2) {
        typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(s2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(s2, "__esModule", { value: true });
      }, i.t = function(s2, r2) {
        if (1 & r2 && (s2 = i(s2)), 8 & r2 || 4 & r2 && typeof s2 == "object" && s2 && s2.__esModule)
          return s2;
        var a3 = /* @__PURE__ */ Object.create(null);
        if (i.r(a3), Object.defineProperty(a3, "default", { enumerable: true, value: s2 }), 2 & r2 && typeof s2 != "string")
          for (var l2 in s2)
            i.d(a3, l2, function(c5) {
              return s2[c5];
            }.bind(null, l2));
        return a3;
      }, i.n = function(s2) {
        var r2 = s2 && s2.__esModule ? function() {
          return s2.default;
        } : function() {
          return s2;
        };
        return i.d(r2, "a", r2), r2;
      }, i.o = function(s2, r2) {
        return Object.prototype.hasOwnProperty.call(s2, r2);
      }, i.p = "", i(i.s = 0);
    }([function(t, o3, i) {
      function s2(l2, c5) {
        for (var d3 = 0; d3 < c5.length; d3++) {
          var h3 = c5[d3];
          h3.enumerable = h3.enumerable || false, h3.configurable = true, "value" in h3 && (h3.writable = true), Object.defineProperty(l2, h3.key, h3);
        }
      }
      function r2(l2, c5, d3) {
        return c5 && s2(l2.prototype, c5), d3 && s2(l2, d3), l2;
      }
      i.r(o3);
      var a3 = function() {
        function l2(c5) {
          var d3 = this;
          (function(h3, p4) {
            if (!(h3 instanceof p4))
              throw new TypeError("Cannot call a class as a function");
          })(this, l2), this.commands = {}, this.keys = {}, this.name = c5.name, this.parseShortcutName(c5.name), this.element = c5.on, this.callback = c5.callback, this.executeShortcut = function(h3) {
            d3.execute(h3);
          }, this.element.addEventListener("keydown", this.executeShortcut, false);
        }
        return r2(l2, null, [{ key: "supportedCommands", get: function() {
          return { SHIFT: ["SHIFT"], CMD: ["CMD", "CONTROL", "COMMAND", "WINDOWS", "CTRL"], ALT: ["ALT", "OPTION"] };
        } }, { key: "keyCodes", get: function() {
          return { 0: 48, 1: 49, 2: 50, 3: 51, 4: 52, 5: 53, 6: 54, 7: 55, 8: 56, 9: 57, A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90, BACKSPACE: 8, ENTER: 13, ESCAPE: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, INSERT: 45, DELETE: 46, ".": 190 };
        } }]), r2(l2, [{ key: "parseShortcutName", value: function(c5) {
          c5 = c5.split("+");
          for (var d3 = 0; d3 < c5.length; d3++) {
            c5[d3] = c5[d3].toUpperCase();
            var h3 = false;
            for (var p4 in l2.supportedCommands)
              if (l2.supportedCommands[p4].includes(c5[d3])) {
                h3 = this.commands[p4] = true;
                break;
              }
            h3 || (this.keys[c5[d3]] = true);
          }
          for (var g6 in l2.supportedCommands)
            this.commands[g6] || (this.commands[g6] = false);
        } }, { key: "execute", value: function(c5) {
          var d3, h3 = { CMD: c5.ctrlKey || c5.metaKey, SHIFT: c5.shiftKey, ALT: c5.altKey }, p4 = true;
          for (d3 in this.commands)
            this.commands[d3] !== h3[d3] && (p4 = false);
          var g6, f4 = true;
          for (g6 in this.keys)
            f4 = f4 && c5.keyCode === l2.keyCodes[g6];
          p4 && f4 && this.callback(c5);
        } }, { key: "remove", value: function() {
          this.element.removeEventListener("keydown", this.executeShortcut);
        } }]), l2;
      }();
      o3.default = a3;
    }]).default;
  });
})(sn);
var bs = sn.exports;
var vs = /* @__PURE__ */ Ke(bs);
var ks = class {
  constructor() {
    this.registeredShortcuts = /* @__PURE__ */ new Map();
  }
  /**
   * Register shortcut
   *
   * @param shortcut - shortcut options
   */
  add(e) {
    if (this.findShortcut(e.on, e.name))
      throw Error(
        `Shortcut ${e.name} is already registered for ${e.on}. Please remove it before add a new handler.`
      );
    const o3 = new vs({
      name: e.name,
      on: e.on,
      callback: e.handler
    }), i = this.registeredShortcuts.get(e.on) || [];
    this.registeredShortcuts.set(e.on, [...i, o3]);
  }
  /**
   * Remove shortcut
   *
   * @param element - Element shortcut is set for
   * @param name - shortcut name
   */
  remove(e, t) {
    const o3 = this.findShortcut(e, t);
    if (!o3)
      return;
    o3.remove();
    const s2 = this.registeredShortcuts.get(e).filter((r2) => r2 !== o3);
    if (s2.length === 0) {
      this.registeredShortcuts.delete(e);
      return;
    }
    this.registeredShortcuts.set(e, s2);
  }
  /**
   * Get Shortcut instance if exist
   *
   * @param element - Element shorcut is set for
   * @param shortcut - shortcut name
   * @returns {number} index - shortcut index if exist
   */
  findShortcut(e, t) {
    return (this.registeredShortcuts.get(e) || []).find(({ name: i }) => i === t);
  }
};
var ge = new ks();
var ys = Object.defineProperty;
var ws = Object.getOwnPropertyDescriptor;
var rn = (n2, e, t, o3) => {
  for (var i = o3 > 1 ? void 0 : o3 ? ws(e, t) : e, s2 = n2.length - 1, r2; s2 >= 0; s2--)
    (r2 = n2[s2]) && (i = (o3 ? r2(e, t, i) : r2(i)) || i);
  return o3 && i && ys(e, t, i), i;
};
var Le = /* @__PURE__ */ ((n2) => (n2.Opened = "toolbox-opened", n2.Closed = "toolbox-closed", n2.BlockAdded = "toolbox-block-added", n2))(Le || {});
var Ct = class an extends Oe {
  /**
   * Toolbox constructor
   *
   * @param options - available parameters
   * @param options.api - Editor API methods
   * @param options.tools - Tools available to check whether some of them should be displayed at the Toolbox or not
   */
  constructor({ api: e, tools: t, i18nLabels: o3 }) {
    super(), this.opened = false, this.listeners = new _e(), this.popover = null, this.handleMobileLayoutToggle = () => {
      this.destroyPopover(), this.initPopover();
    }, this.onPopoverClose = () => {
      this.opened = false, this.emit(
        "toolbox-closed"
        /* Closed */
      );
    }, this.api = e, this.tools = t, this.i18nLabels = o3, this.enableShortcuts(), this.nodes = {
      toolbox: u.make("div", an.CSS.toolbox)
    }, this.initPopover(), this.api.events.on(Te, this.handleMobileLayoutToggle);
  }
  /**
   * Returns True if Toolbox is Empty and nothing to show
   *
   * @returns {boolean}
   */
  get isEmpty() {
    return this.toolsToBeDisplayed.length === 0;
  }
  /**
   * CSS styles
   */
  static get CSS() {
    return {
      toolbox: "ce-toolbox"
    };
  }
  /**
   * Returns root block settings element
   */
  getElement() {
    return this.nodes.toolbox;
  }
  /**
   * Returns true if the Toolbox has the Flipper activated and the Flipper has selected button
   */
  hasFocus() {
    if (this.popover !== null)
      return "hasFocus" in this.popover ? this.popover.hasFocus() : void 0;
  }
  /**
   * Destroy Module
   */
  destroy() {
    var e;
    super.destroy(), this.nodes && this.nodes.toolbox && this.nodes.toolbox.remove(), this.removeAllShortcuts(), (e = this.popover) == null || e.off(G.Closed, this.onPopoverClose), this.listeners.destroy(), this.api.events.off(Te, this.handleMobileLayoutToggle);
  }
  /**
   * Toolbox Tool's button click handler
   *
   * @param toolName - tool type to be activated
   * @param blockDataOverrides - Block data predefined by the activated Toolbox item
   */
  toolButtonActivated(e, t) {
    this.insertNewBlock(e, t);
  }
  /**
   * Open Toolbox with Tools
   */
  open() {
    var e;
    this.isEmpty || ((e = this.popover) == null || e.show(), this.opened = true, this.emit(
      "toolbox-opened"
      /* Opened */
    ));
  }
  /**
   * Close Toolbox
   */
  close() {
    var e;
    (e = this.popover) == null || e.hide(), this.opened = false, this.emit(
      "toolbox-closed"
      /* Closed */
    );
  }
  /**
   * Close Toolbox
   */
  toggle() {
    this.opened ? this.close() : this.open();
  }
  /**
   * Creates toolbox popover and appends it inside wrapper element
   */
  initPopover() {
    var t;
    const e = be() ? nn : Bt;
    this.popover = new e({
      scopeElement: this.api.ui.nodes.redactor,
      searchable: true,
      messages: {
        nothingFound: this.i18nLabels.nothingFound,
        search: this.i18nLabels.filter
      },
      items: this.toolboxItemsToBeDisplayed
    }), this.popover.on(G.Closed, this.onPopoverClose), (t = this.nodes.toolbox) == null || t.append(this.popover.getElement());
  }
  /**
   * Destroys popover instance and removes it from DOM
   */
  destroyPopover() {
    this.popover !== null && (this.popover.hide(), this.popover.off(G.Closed, this.onPopoverClose), this.popover.destroy(), this.popover = null), this.nodes.toolbox !== null && (this.nodes.toolbox.innerHTML = "");
  }
  get toolsToBeDisplayed() {
    const e = [];
    return this.tools.forEach((t) => {
      t.toolbox && e.push(t);
    }), e;
  }
  get toolboxItemsToBeDisplayed() {
    const e = (t, o3, i = true) => ({
      icon: t.icon,
      title: z.t(K.toolNames, t.title || je(o3.name)),
      name: o3.name,
      onActivate: () => {
        this.toolButtonActivated(o3.name, t.data);
      },
      secondaryLabel: o3.shortcut && i ? vt(o3.shortcut) : ""
    });
    return this.toolsToBeDisplayed.reduce((t, o3) => (Array.isArray(o3.toolbox) ? o3.toolbox.forEach((i, s2) => {
      t.push(e(i, o3, s2 === 0));
    }) : o3.toolbox !== void 0 && t.push(e(o3.toolbox, o3)), t), []);
  }
  /**
   * Iterate all tools and enable theirs shortcuts if specified
   */
  enableShortcuts() {
    this.toolsToBeDisplayed.forEach((e) => {
      const t = e.shortcut;
      t && this.enableShortcutForTool(e.name, t);
    });
  }
  /**
   * Enable shortcut Block Tool implemented shortcut
   *
   * @param {string} toolName - Tool name
   * @param {string} shortcut - shortcut according to the ShortcutData Module format
   */
  enableShortcutForTool(e, t) {
    ge.add({
      name: t,
      on: this.api.ui.nodes.redactor,
      handler: async (o3) => {
        o3.preventDefault();
        const i = this.api.blocks.getCurrentBlockIndex(), s2 = this.api.blocks.getBlockByIndex(i);
        if (s2)
          try {
            const r2 = await this.api.blocks.convert(s2.id, e);
            this.api.caret.setToBlock(r2, "end");
            return;
          } catch {
          }
        this.insertNewBlock(e);
      }
    });
  }
  /**
   * Removes all added shortcuts
   * Fired when the Read-Only mode is activated
   */
  removeAllShortcuts() {
    this.toolsToBeDisplayed.forEach((e) => {
      const t = e.shortcut;
      t && ge.remove(this.api.ui.nodes.redactor, t);
    });
  }
  /**
   * Inserts new block
   * Can be called when button clicked on Toolbox or by ShortcutData
   *
   * @param {string} toolName - Tool name
   * @param blockDataOverrides - predefined Block data
   */
  async insertNewBlock(e, t) {
    const o3 = this.api.blocks.getCurrentBlockIndex(), i = this.api.blocks.getBlockByIndex(o3);
    if (!i)
      return;
    const s2 = i.isEmpty ? o3 : o3 + 1;
    let r2;
    if (t) {
      const l2 = await this.api.blocks.composeBlockData(e);
      r2 = Object.assign(l2, t);
    }
    const a3 = this.api.blocks.insert(
      e,
      r2,
      void 0,
      s2,
      void 0,
      i.isEmpty
    );
    a3.call(ee.APPEND_CALLBACK), this.api.caret.setToBlock(s2), this.emit("toolbox-block-added", {
      block: a3
    }), this.api.toolbar.close();
  }
};
rn(
  [
    me
  ],
  Ct.prototype,
  "toolsToBeDisplayed",
  1
);
rn(
  [
    me
  ],
  Ct.prototype,
  "toolboxItemsToBeDisplayed",
  1
);
var Es = Ct;
var ln = "block hovered";
async function xs(n2, e) {
  const t = navigator.keyboard;
  if (!t)
    return e;
  try {
    return (await t.getLayoutMap()).get(n2) || e;
  } catch (o3) {
    return console.error(o3), e;
  }
}
var Bs = class extends E {
  /**
   * @class
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.toolboxInstance = null;
  }
  /**
   * CSS styles
   *
   * @returns {object}
   */
  get CSS() {
    return {
      toolbar: "ce-toolbar",
      content: "ce-toolbar__content",
      actions: "ce-toolbar__actions",
      actionsOpened: "ce-toolbar__actions--opened",
      toolbarOpened: "ce-toolbar--opened",
      openedToolboxHolderModifier: "codex-editor--toolbox-opened",
      plusButton: "ce-toolbar__plus",
      plusButtonShortcut: "ce-toolbar__plus-shortcut",
      settingsToggler: "ce-toolbar__settings-btn",
      settingsTogglerHidden: "ce-toolbar__settings-btn--hidden"
    };
  }
  /**
   * Returns the Toolbar opening state
   *
   * @returns {boolean}
   */
  get opened() {
    return this.nodes.wrapper.classList.contains(this.CSS.toolbarOpened);
  }
  /**
   * Public interface for accessing the Toolbox
   */
  get toolbox() {
    var e;
    return {
      opened: (e = this.toolboxInstance) == null ? void 0 : e.opened,
      close: () => {
        var t;
        (t = this.toolboxInstance) == null || t.close();
      },
      open: () => {
        if (this.toolboxInstance === null) {
          S("toolbox.open() called before initialization is finished", "warn");
          return;
        }
        this.Editor.BlockManager.currentBlock = this.hoveredBlock, this.toolboxInstance.open();
      },
      toggle: () => {
        if (this.toolboxInstance === null) {
          S("toolbox.toggle() called before initialization is finished", "warn");
          return;
        }
        this.toolboxInstance.toggle();
      },
      hasFocus: () => {
        var t;
        return (t = this.toolboxInstance) == null ? void 0 : t.hasFocus();
      }
    };
  }
  /**
   * Block actions appearance manipulations
   */
  get blockActions() {
    return {
      hide: () => {
        this.nodes.actions.classList.remove(this.CSS.actionsOpened);
      },
      show: () => {
        this.nodes.actions.classList.add(this.CSS.actionsOpened);
      }
    };
  }
  /**
   * Methods for working with Block Tunes toggler
   */
  get blockTunesToggler() {
    return {
      hide: () => this.nodes.settingsToggler.classList.add(this.CSS.settingsTogglerHidden),
      show: () => this.nodes.settingsToggler.classList.remove(this.CSS.settingsTogglerHidden)
    };
  }
  /**
   * Toggles read-only mode
   *
   * @param {boolean} readOnlyEnabled - read-only mode
   */
  toggleReadOnly(e) {
    e ? (this.destroy(), this.Editor.BlockSettings.destroy(), this.disableModuleBindings()) : window.requestIdleCallback(() => {
      this.drawUI(), this.enableModuleBindings();
    }, { timeout: 2e3 });
  }
  /**
   * Move Toolbar to the passed (or current) Block
   *
   * @param block - block to move Toolbar near it
   */
  moveAndOpen(e = this.Editor.BlockManager.currentBlock) {
    if (this.toolboxInstance === null) {
      S("Can't open Toolbar since Editor initialization is not finished yet", "warn");
      return;
    }
    if (this.toolboxInstance.opened && this.toolboxInstance.close(), this.Editor.BlockSettings.opened && this.Editor.BlockSettings.close(), !e)
      return;
    this.hoveredBlock = e;
    const t = e.holder, { isMobile: o3 } = this.Editor.UI;
    let i;
    const s2 = 20, r2 = e.firstInput, a3 = t.getBoundingClientRect(), l2 = r2 !== void 0 ? r2.getBoundingClientRect() : null, c5 = l2 !== null ? l2.top - a3.top : null, d3 = c5 !== null ? c5 > s2 : void 0;
    if (o3)
      i = t.offsetTop + t.offsetHeight;
    else if (r2 === void 0 || d3) {
      const h3 = parseInt(window.getComputedStyle(e.pluginsContent).paddingTop);
      i = t.offsetTop + h3;
    } else {
      const h3 = li(r2), p4 = parseInt(window.getComputedStyle(this.nodes.plusButton).height, 10), g6 = 8;
      i = t.offsetTop + h3 - p4 + g6 + c5;
    }
    this.nodes.wrapper.style.top = `${Math.floor(i)}px`, this.Editor.BlockManager.blocks.length === 1 && e.isEmpty ? this.blockTunesToggler.hide() : this.blockTunesToggler.show(), this.open();
  }
  /**
   * Close the Toolbar
   */
  close() {
    var e, t;
    this.Editor.ReadOnly.isEnabled || ((e = this.nodes.wrapper) == null || e.classList.remove(this.CSS.toolbarOpened), this.blockActions.hide(), (t = this.toolboxInstance) == null || t.close(), this.Editor.BlockSettings.close(), this.reset());
  }
  /**
   * Reset the Toolbar position to prevent DOM height growth, for example after blocks deletion
   */
  reset() {
    this.nodes.wrapper.style.top = "unset";
  }
  /**
   * Open Toolbar with Plus Button and Actions
   *
   * @param {boolean} withBlockActions - by default, Toolbar opens with Block Actions.
   *                                     This flag allows to open Toolbar without Actions.
   */
  open(e = true) {
    this.nodes.wrapper.classList.add(this.CSS.toolbarOpened), e ? this.blockActions.show() : this.blockActions.hide();
  }
  /**
   * Draws Toolbar elements
   */
  async make() {
    this.nodes.wrapper = u.make("div", this.CSS.toolbar), ["content", "actions"].forEach((s2) => {
      this.nodes[s2] = u.make("div", this.CSS[s2]);
    }), u.append(this.nodes.wrapper, this.nodes.content), u.append(this.nodes.content, this.nodes.actions), this.nodes.plusButton = u.make("div", this.CSS.plusButton, {
      innerHTML: ts
    }), u.append(this.nodes.actions, this.nodes.plusButton), this.readOnlyMutableListeners.on(this.nodes.plusButton, "click", () => {
      $e(true), this.plusButtonClicked();
    }, false);
    const e = u.make("div");
    e.appendChild(document.createTextNode(z.ui(K.ui.toolbar.toolbox, "Add"))), e.appendChild(u.make("div", this.CSS.plusButtonShortcut, {
      textContent: "/"
    })), ze(this.nodes.plusButton, e, {
      hidingDelay: 400
    }), this.nodes.settingsToggler = u.make("span", this.CSS.settingsToggler, {
      innerHTML: es
    }), u.append(this.nodes.actions, this.nodes.settingsToggler);
    const t = u.make("div"), o3 = u.text(z.ui(K.ui.blockTunes.toggler, "Click to tune")), i = await xs("Slash", "/");
    t.appendChild(o3), t.appendChild(u.make("div", this.CSS.plusButtonShortcut, {
      textContent: vt(`CMD + ${i}`)
    })), ze(this.nodes.settingsToggler, t, {
      hidingDelay: 400
    }), u.append(this.nodes.actions, this.makeToolbox()), u.append(this.nodes.actions, this.Editor.BlockSettings.getElement()), u.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }
  /**
   * Creates the Toolbox instance and return it's rendered element
   */
  makeToolbox() {
    return this.toolboxInstance = new Es({
      api: this.Editor.API.methods,
      tools: this.Editor.Tools.blockTools,
      i18nLabels: {
        filter: z.ui(K.ui.popover, "Filter"),
        nothingFound: z.ui(K.ui.popover, "Nothing found")
      }
    }), this.toolboxInstance.on(Le.Opened, () => {
      this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolboxHolderModifier);
    }), this.toolboxInstance.on(Le.Closed, () => {
      this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolboxHolderModifier);
    }), this.toolboxInstance.on(Le.BlockAdded, ({ block: e }) => {
      const { BlockManager: t, Caret: o3 } = this.Editor, i = t.getBlockById(e.id);
      i.inputs.length === 0 && (i === t.lastBlock ? (t.insertAtEnd(), o3.setToBlock(t.lastBlock)) : o3.setToBlock(t.nextBlock));
    }), this.toolboxInstance.getElement();
  }
  /**
   * Handler for Plus Button
   */
  plusButtonClicked() {
    var e;
    this.Editor.BlockManager.currentBlock = this.hoveredBlock, (e = this.toolboxInstance) == null || e.toggle();
  }
  /**
   * Enable bindings
   */
  enableModuleBindings() {
    this.readOnlyMutableListeners.on(this.nodes.settingsToggler, "mousedown", (e) => {
      var t;
      e.stopPropagation(), this.settingsTogglerClicked(), (t = this.toolboxInstance) != null && t.opened && this.toolboxInstance.close(), $e(true);
    }, true), be() || this.eventsDispatcher.on(ln, (e) => {
      var t;
      this.Editor.BlockSettings.opened || (t = this.toolboxInstance) != null && t.opened || this.moveAndOpen(e.block);
    });
  }
  /**
   * Disable bindings
   */
  disableModuleBindings() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Clicks on the Block Settings toggler
   */
  settingsTogglerClicked() {
    this.Editor.BlockManager.currentBlock = this.hoveredBlock, this.Editor.BlockSettings.opened ? this.Editor.BlockSettings.close() : this.Editor.BlockSettings.open(this.hoveredBlock);
  }
  /**
   * Draws Toolbar UI
   *
   * Toolbar contains BlockSettings and Toolbox.
   * That's why at first we draw its components and then Toolbar itself
   *
   * Steps:
   *  - Make Toolbar dependent components like BlockSettings, Toolbox and so on
   *  - Make itself and append dependent nodes to itself
   *
   */
  drawUI() {
    this.Editor.BlockSettings.make(), this.make();
  }
  /**
   * Removes all created and saved HTMLElements
   * It is used in Read-Only mode
   */
  destroy() {
    this.removeAllNodes(), this.toolboxInstance && this.toolboxInstance.destroy();
  }
};
var ae = /* @__PURE__ */ ((n2) => (n2[n2.Block = 0] = "Block", n2[n2.Inline = 1] = "Inline", n2[n2.Tune = 2] = "Tune", n2))(ae || {});
var Pe = /* @__PURE__ */ ((n2) => (n2.Shortcut = "shortcut", n2.Toolbox = "toolbox", n2.EnabledInlineTools = "inlineToolbar", n2.EnabledBlockTunes = "tunes", n2.Config = "config", n2))(Pe || {});
var cn = /* @__PURE__ */ ((n2) => (n2.Shortcut = "shortcut", n2.SanitizeConfig = "sanitize", n2))(cn || {});
var pe = /* @__PURE__ */ ((n2) => (n2.IsEnabledLineBreaks = "enableLineBreaks", n2.Toolbox = "toolbox", n2.ConversionConfig = "conversionConfig", n2.IsReadOnlySupported = "isReadOnlySupported", n2.PasteConfig = "pasteConfig", n2))(pe || {});
var We = /* @__PURE__ */ ((n2) => (n2.IsInline = "isInline", n2.Title = "title", n2.IsReadOnlySupported = "isReadOnlySupported", n2))(We || {});
var mt = /* @__PURE__ */ ((n2) => (n2.IsTune = "isTune", n2))(mt || {});
var Tt = class {
  /**
   * @class
   * @param {ConstructorOptions} options - Constructor options
   */
  constructor({
    name: e,
    constructable: t,
    config: o3,
    api: i,
    isDefault: s2,
    isInternal: r2 = false,
    defaultPlaceholder: a3
  }) {
    this.api = i, this.name = e, this.constructable = t, this.config = o3, this.isDefault = s2, this.isInternal = r2, this.defaultPlaceholder = a3;
  }
  /**
   * Returns Tool user configuration
   */
  get settings() {
    const e = this.config.config || {};
    return this.isDefault && !("placeholder" in e) && this.defaultPlaceholder && (e.placeholder = this.defaultPlaceholder), e;
  }
  /**
   * Calls Tool's reset method
   */
  reset() {
    if (A(this.constructable.reset))
      return this.constructable.reset();
  }
  /**
   * Calls Tool's prepare method
   */
  prepare() {
    if (A(this.constructable.prepare))
      return this.constructable.prepare({
        toolName: this.name,
        config: this.settings
      });
  }
  /**
   * Returns shortcut for Tool (internal or specified by user)
   */
  get shortcut() {
    const e = this.constructable.shortcut;
    return this.config.shortcut || e;
  }
  /**
   * Returns Tool's sanitizer configuration
   */
  get sanitizeConfig() {
    return this.constructable.sanitize || {};
  }
  /**
   * Returns true if Tools is inline
   */
  isInline() {
    return this.type === ae.Inline;
  }
  /**
   * Returns true if Tools is block
   */
  isBlock() {
    return this.type === ae.Block;
  }
  /**
   * Returns true if Tools is tune
   */
  isTune() {
    return this.type === ae.Tune;
  }
};
var Cs = class extends E {
  /**
   * @param moduleConfiguration - Module Configuration
   * @param moduleConfiguration.config - Editor's config
   * @param moduleConfiguration.eventsDispatcher - Editor's event dispatcher
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.CSS = {
      inlineToolbar: "ce-inline-toolbar"
    }, this.opened = false, this.popover = null, this.toolbarVerticalMargin = be() ? 20 : 6, this.tools = /* @__PURE__ */ new Map(), window.requestIdleCallback(() => {
      this.make();
    }, { timeout: 2e3 });
  }
  /**
   *  Moving / appearance
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Shows Inline Toolbar if something is selected
   *
   * @param [needToClose] - pass true to close toolbar if it is not allowed.
   *                                  Avoid to use it just for closing IT, better call .close() clearly.
   */
  async tryToShow(e = false) {
    e && this.close(), this.allowedToShow() && (await this.open(), this.Editor.Toolbar.close());
  }
  /**
   * Hides Inline Toolbar
   */
  close() {
    var e, t;
    if (this.opened) {
      for (const [o3, i] of this.tools) {
        const s2 = this.getToolShortcut(o3.name);
        s2 !== void 0 && ge.remove(this.Editor.UI.nodes.redactor, s2), A(i.clear) && i.clear();
      }
      this.tools = /* @__PURE__ */ new Map(), this.reset(), this.opened = false, (e = this.popover) == null || e.hide(), (t = this.popover) == null || t.destroy(), this.popover = null;
    }
  }
  /**
   * Check if node is contained by Inline Toolbar
   *
   * @param {Node} node — node to check
   */
  containsNode(e) {
    return this.nodes.wrapper === void 0 ? false : this.nodes.wrapper.contains(e);
  }
  /**
   * Removes UI and its components
   */
  destroy() {
    var e;
    this.removeAllNodes(), (e = this.popover) == null || e.destroy(), this.popover = null;
  }
  /**
   * Making DOM
   */
  make() {
    this.nodes.wrapper = u.make(
      "div",
      [
        this.CSS.inlineToolbar,
        ...this.isRtl ? [this.Editor.UI.CSS.editorRtlFix] : []
      ]
    ), u.append(this.Editor.UI.nodes.wrapper, this.nodes.wrapper);
  }
  /**
   * Shows Inline Toolbar
   */
  async open() {
    var t;
    if (this.opened)
      return;
    this.opened = true, this.popover !== null && this.popover.destroy(), this.createToolsInstances();
    const e = await this.getPopoverItems();
    this.popover = new hs({
      items: e,
      scopeElement: this.Editor.API.methods.ui.nodes.redactor,
      messages: {
        nothingFound: z.ui(K.ui.popover, "Nothing found"),
        search: z.ui(K.ui.popover, "Filter")
      }
    }), this.move(this.popover.size.width), (t = this.nodes.wrapper) == null || t.append(this.popover.getElement()), this.popover.show();
  }
  /**
   * Move Toolbar to the selected text
   *
   * @param popoverWidth - width of the toolbar popover
   */
  move(e) {
    const t = b.rect, o3 = this.Editor.UI.nodes.wrapper.getBoundingClientRect(), i = {
      x: t.x - o3.x,
      y: t.y + t.height - // + window.scrollY
      o3.top + this.toolbarVerticalMargin
    };
    i.x + e + o3.x > this.Editor.UI.contentRect.right && (i.x = this.Editor.UI.contentRect.right - e - o3.x), this.nodes.wrapper.style.left = Math.floor(i.x) + "px", this.nodes.wrapper.style.top = Math.floor(i.y) + "px";
  }
  /**
   * Clear orientation classes and reset position
   */
  reset() {
    this.nodes.wrapper.style.left = "0", this.nodes.wrapper.style.top = "0";
  }
  /**
   * Need to show Inline Toolbar or not
   */
  allowedToShow() {
    const e = ["IMG", "INPUT"], t = b.get(), o3 = b.text;
    if (!t || !t.anchorNode || t.isCollapsed || o3.length < 1)
      return false;
    const i = u.isElement(t.anchorNode) ? t.anchorNode : t.anchorNode.parentElement;
    if (i === null || t !== null && e.includes(i.tagName))
      return false;
    const s2 = this.Editor.BlockManager.getBlock(t.anchorNode);
    return !s2 || this.getTools().some((c5) => s2.tool.inlineTools.has(c5.name)) === false ? false : i.closest("[contenteditable]") !== null;
  }
  /**
   *  Working with Tools
   *  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
   */
  /**
   * Returns tools that are available for current block
   *
   * Used to check if Inline Toolbar could be shown
   * and to render tools in the Inline Toolbar
   */
  getTools() {
    const e = this.Editor.BlockManager.currentBlock;
    return e ? Array.from(e.tool.inlineTools.values()).filter((o3) => !(this.Editor.ReadOnly.isEnabled && o3.isReadOnlySupported !== true)) : [];
  }
  /**
   * Constructs tools instances and saves them to this.tools
   */
  createToolsInstances() {
    this.tools = /* @__PURE__ */ new Map(), this.getTools().forEach((t) => {
      const o3 = t.create();
      this.tools.set(t, o3);
    });
  }
  /**
   * Returns Popover Items for tools segregated by their appearance type: regular items and custom html elements.
   */
  async getPopoverItems() {
    const e = [];
    let t = 0;
    for (const [o3, i] of this.tools) {
      const s2 = await i.render(), r2 = this.getToolShortcut(o3.name);
      if (r2 !== void 0)
        try {
          this.enableShortcuts(o3.name, r2);
        } catch {
        }
      const a3 = r2 !== void 0 ? vt(r2) : void 0, l2 = z.t(
        K.toolNames,
        o3.title || je(o3.name)
      );
      [s2].flat().forEach((c5) => {
        var h3, p4;
        const d3 = {
          name: o3.name,
          onActivate: () => {
            this.toolClicked(i);
          },
          hint: {
            title: l2,
            description: a3
          }
        };
        if (u.isElement(c5)) {
          const g6 = {
            ...d3,
            element: c5,
            type: _.Html
          };
          if (A(i.renderActions)) {
            const f4 = i.renderActions();
            g6.children = {
              isOpen: (h3 = i.checkState) == null ? void 0 : h3.call(i, b.get()),
              /** Disable keyboard navigation in actions, as it might conflict with enter press handling */
              isFlippable: false,
              items: [
                {
                  type: _.Html,
                  element: f4
                }
              ]
            };
          } else
            (p4 = i.checkState) == null || p4.call(i, b.get());
          e.push(g6);
        } else if (c5.type === _.Html)
          e.push({
            ...d3,
            ...c5,
            type: _.Html
          });
        else if (c5.type === _.Separator)
          e.push({
            type: _.Separator
          });
        else {
          const g6 = {
            ...d3,
            ...c5,
            type: _.Default
          };
          "children" in g6 && t !== 0 && e.push({
            type: _.Separator
          }), e.push(g6), "children" in g6 && t < this.tools.size - 1 && e.push({
            type: _.Separator
          });
        }
      }), t++;
    }
    return e;
  }
  /**
   * Get shortcut name for tool
   *
   * @param toolName — Tool name
   */
  getToolShortcut(e) {
    const { Tools: t } = this.Editor, o3 = t.inlineTools.get(e), i = t.internal.inlineTools;
    return Array.from(i.keys()).includes(e) ? this.inlineTools[e][cn.Shortcut] : o3 == null ? void 0 : o3.shortcut;
  }
  /**
   * Enable Tool shortcut with Editor Shortcuts Module
   *
   * @param toolName - tool name
   * @param shortcut - shortcut according to the ShortcutData Module format
   */
  enableShortcuts(e, t) {
    ge.add({
      name: t,
      handler: (o3) => {
        var s2;
        const { currentBlock: i } = this.Editor.BlockManager;
        i && i.tool.enabledInlineTools && (o3.preventDefault(), (s2 = this.popover) == null || s2.activateItemByName(e));
      },
      /**
       * We need to bind shortcut to the document to make it work in read-only mode
       */
      on: document
    });
  }
  /**
   * Inline Tool button clicks
   *
   * @param tool - Tool's instance
   */
  toolClicked(e) {
    var o3;
    const t = b.range;
    (o3 = e.surround) == null || o3.call(e, t), this.checkToolsState();
  }
  /**
   * Check Tools` state by selection
   */
  checkToolsState() {
    var e;
    (e = this.tools) == null || e.forEach((t) => {
      var o3;
      (o3 = t.checkState) == null || o3.call(t, b.get());
    });
  }
  /**
   * Get inline tools tools
   * Tools that has isInline is true
   */
  get inlineTools() {
    const e = {};
    return Array.from(this.Editor.Tools.inlineTools.entries()).forEach(([t, o3]) => {
      e[t] = o3.create();
    }), e;
  }
};
function dn() {
  const n2 = window.getSelection();
  if (n2 === null)
    return [null, 0];
  let e = n2.focusNode, t = n2.focusOffset;
  return e === null ? [null, 0] : (e.nodeType !== Node.TEXT_NODE && e.childNodes.length > 0 && (e.childNodes[t] ? (e = e.childNodes[t], t = 0) : (e = e.childNodes[t - 1], t = e.textContent.length)), [e, t]);
}
function un(n2, e, t, o3) {
  const i = document.createRange();
  o3 === "left" ? (i.setStart(n2, 0), i.setEnd(e, t)) : (i.setStart(e, t), i.setEnd(n2, n2.childNodes.length));
  const s2 = i.cloneContents(), r2 = document.createElement("div");
  r2.appendChild(s2);
  const a3 = r2.textContent || "";
  return ai(a3);
}
function Ne(n2) {
  const e = u.getDeepestNode(n2);
  if (e === null || u.isEmpty(n2))
    return true;
  if (u.isNativeInput(e))
    return e.selectionEnd === 0;
  if (u.isEmpty(n2))
    return true;
  const [t, o3] = dn();
  return t === null ? false : un(n2, t, o3, "left");
}
function Re(n2) {
  const e = u.getDeepestNode(n2, true);
  if (e === null)
    return true;
  if (u.isNativeInput(e))
    return e.selectionEnd === e.value.length;
  const [t, o3] = dn();
  return t === null ? false : un(n2, t, o3, "right");
}
var hn = {};
var St = {};
var Xe = {};
var de = {};
var It = {};
var Ot = {};
Object.defineProperty(Ot, "__esModule", { value: true });
Ot.allInputsSelector = Ts;
function Ts() {
  var n2 = ["text", "password", "email", "number", "search", "tel", "url"];
  return "[contenteditable=true], textarea, input:not([type]), " + n2.map(function(e) {
    return 'input[type="'.concat(e, '"]');
  }).join(", ");
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.allInputsSelector = void 0;
  var e = Ot;
  Object.defineProperty(n2, "allInputsSelector", { enumerable: true, get: function() {
    return e.allInputsSelector;
  } });
})(It);
var ue = {};
var _t = {};
Object.defineProperty(_t, "__esModule", { value: true });
_t.isNativeInput = Ss;
function Ss(n2) {
  var e = [
    "INPUT",
    "TEXTAREA"
  ];
  return n2 && n2.tagName ? e.includes(n2.tagName) : false;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isNativeInput = void 0;
  var e = _t;
  Object.defineProperty(n2, "isNativeInput", { enumerable: true, get: function() {
    return e.isNativeInput;
  } });
})(ue);
var pn = {};
var Mt = {};
Object.defineProperty(Mt, "__esModule", { value: true });
Mt.append = Is;
function Is(n2, e) {
  Array.isArray(e) ? e.forEach(function(t) {
    n2.appendChild(t);
  }) : n2.appendChild(e);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.append = void 0;
  var e = Mt;
  Object.defineProperty(n2, "append", { enumerable: true, get: function() {
    return e.append;
  } });
})(pn);
var At = {};
var Lt = {};
Object.defineProperty(Lt, "__esModule", { value: true });
Lt.blockElements = Os;
function Os() {
  return [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "div",
    "dl",
    "dt",
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
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "ruby",
    "section",
    "table",
    "tbody",
    "thead",
    "tr",
    "tfoot",
    "ul",
    "video"
  ];
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.blockElements = void 0;
  var e = Lt;
  Object.defineProperty(n2, "blockElements", { enumerable: true, get: function() {
    return e.blockElements;
  } });
})(At);
var fn = {};
var Pt = {};
Object.defineProperty(Pt, "__esModule", { value: true });
Pt.calculateBaseline = _s;
function _s(n2) {
  var e = window.getComputedStyle(n2), t = parseFloat(e.fontSize), o3 = parseFloat(e.lineHeight) || t * 1.2, i = parseFloat(e.paddingTop), s2 = parseFloat(e.borderTopWidth), r2 = parseFloat(e.marginTop), a3 = t * 0.8, l2 = (o3 - t) / 2, c5 = r2 + s2 + i + l2 + a3;
  return c5;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.calculateBaseline = void 0;
  var e = Pt;
  Object.defineProperty(n2, "calculateBaseline", { enumerable: true, get: function() {
    return e.calculateBaseline;
  } });
})(fn);
var gn = {};
var Nt = {};
var Rt = {};
var Dt = {};
Object.defineProperty(Dt, "__esModule", { value: true });
Dt.isContentEditable = Ms;
function Ms(n2) {
  return n2.contentEditable === "true";
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isContentEditable = void 0;
  var e = Dt;
  Object.defineProperty(n2, "isContentEditable", { enumerable: true, get: function() {
    return e.isContentEditable;
  } });
})(Rt);
Object.defineProperty(Nt, "__esModule", { value: true });
Nt.canSetCaret = Ps;
var As = ue;
var Ls = Rt;
function Ps(n2) {
  var e = true;
  if ((0, As.isNativeInput)(n2))
    switch (n2.type) {
      case "file":
      case "checkbox":
      case "radio":
      case "hidden":
      case "submit":
      case "button":
      case "image":
      case "reset":
        e = false;
        break;
    }
  else
    e = (0, Ls.isContentEditable)(n2);
  return e;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.canSetCaret = void 0;
  var e = Nt;
  Object.defineProperty(n2, "canSetCaret", { enumerable: true, get: function() {
    return e.canSetCaret;
  } });
})(gn);
var Ve = {};
var Ft = {};
function Ns(n2, e, t) {
  const o3 = t.value !== void 0 ? "value" : "get", i = t[o3], s2 = `#${e}Cache`;
  if (t[o3] = function(...r2) {
    return this[s2] === void 0 && (this[s2] = i.apply(this, r2)), this[s2];
  }, o3 === "get" && t.set) {
    const r2 = t.set;
    t.set = function(a3) {
      delete n2[s2], r2.apply(this, a3);
    };
  }
  return t;
}
function mn() {
  const n2 = {
    win: false,
    mac: false,
    x11: false,
    linux: false
  }, e = Object.keys(n2).find((t) => window.navigator.appVersion.toLowerCase().indexOf(t) !== -1);
  return e !== void 0 && (n2[e] = true), n2;
}
function jt(n2) {
  return n2 != null && n2 !== "" && (typeof n2 != "object" || Object.keys(n2).length > 0);
}
function Rs(n2) {
  return !jt(n2);
}
var Ds = () => typeof window < "u" && window.navigator !== null && jt(window.navigator.platform) && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function Fs(n2) {
  const e = mn();
  return n2 = n2.replace(/shift/gi, "\u21E7").replace(/backspace/gi, "\u232B").replace(/enter/gi, "\u23CE").replace(/up/gi, "\u2191").replace(/left/gi, "\u2192").replace(/down/gi, "\u2193").replace(/right/gi, "\u2190").replace(/escape/gi, "\u238B").replace(/insert/gi, "Ins").replace(/delete/gi, "\u2421").replace(/\+/gi, "+"), e.mac ? n2 = n2.replace(/ctrl|cmd/gi, "\u2318").replace(/alt/gi, "\u2325") : n2 = n2.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), n2;
}
function js(n2) {
  return n2[0].toUpperCase() + n2.slice(1);
}
function Hs(n2) {
  const e = document.createElement("div");
  e.style.position = "absolute", e.style.left = "-999px", e.style.bottom = "-999px", e.innerHTML = n2, document.body.appendChild(e);
  const t = window.getSelection(), o3 = document.createRange();
  if (o3.selectNode(e), t === null)
    throw new Error("Cannot copy text to clipboard");
  t.removeAllRanges(), t.addRange(o3), document.execCommand("copy"), document.body.removeChild(e);
}
function $s(n2, e, t) {
  let o3;
  return (...i) => {
    const s2 = this, r2 = () => {
      o3 = void 0, t !== true && n2.apply(s2, i);
    }, a3 = t === true && o3 !== void 0;
    window.clearTimeout(o3), o3 = window.setTimeout(r2, e), a3 && n2.apply(s2, i);
  };
}
function oe(n2) {
  return Object.prototype.toString.call(n2).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function zs(n2) {
  return oe(n2) === "boolean";
}
function bn(n2) {
  return oe(n2) === "function" || oe(n2) === "asyncfunction";
}
function Us(n2) {
  return bn(n2) && /^\s*class\s+/.test(n2.toString());
}
function Ws(n2) {
  return oe(n2) === "number";
}
function De(n2) {
  return oe(n2) === "object";
}
function Ys(n2) {
  return Promise.resolve(n2) === n2;
}
function Ks(n2) {
  return oe(n2) === "string";
}
function Xs(n2) {
  return oe(n2) === "undefined";
}
function bt(n2, ...e) {
  if (!e.length)
    return n2;
  const t = e.shift();
  if (De(n2) && De(t))
    for (const o3 in t)
      De(t[o3]) ? (n2[o3] === void 0 && Object.assign(n2, { [o3]: {} }), bt(n2[o3], t[o3])) : Object.assign(n2, { [o3]: t[o3] });
  return bt(n2, ...e);
}
function Vs(n2, e, t) {
  const o3 = `\xAB${e}\xBB is deprecated and will be removed in the next major release. Please use the \xAB${t}\xBB instead.`;
  n2 && console.warn(o3);
}
function qs(n2) {
  try {
    return new URL(n2).href;
  } catch {
  }
  return n2.substring(0, 2) === "//" ? window.location.protocol + n2 : window.location.origin + n2;
}
function Zs(n2) {
  return n2 > 47 && n2 < 58 || n2 === 32 || n2 === 13 || n2 === 229 || n2 > 64 && n2 < 91 || n2 > 95 && n2 < 112 || n2 > 185 && n2 < 193 || n2 > 218 && n2 < 223;
}
var Gs = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  SLASH: 191
};
var Qs = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4
};
var Js = class {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   * @param operation - promise should be added to queue
   */
  add(e) {
    return new Promise((t, o3) => {
      this.completed = this.completed.then(e).then(t).catch(o3);
    });
  }
};
function er(n2, e, t = void 0) {
  let o3, i, s2, r2 = null, a3 = 0;
  t || (t = {});
  const l2 = function() {
    a3 = t.leading === false ? 0 : Date.now(), r2 = null, s2 = n2.apply(o3, i), r2 === null && (o3 = i = null);
  };
  return function() {
    const c5 = Date.now();
    !a3 && t.leading === false && (a3 = c5);
    const d3 = e - (c5 - a3);
    return o3 = this, i = arguments, d3 <= 0 || d3 > e ? (r2 && (clearTimeout(r2), r2 = null), a3 = c5, s2 = n2.apply(o3, i), r2 === null && (o3 = i = null)) : !r2 && t.trailing !== false && (r2 = setTimeout(l2, d3)), s2;
  };
}
var tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PromiseQueue: Js,
  beautifyShortcut: Fs,
  cacheable: Ns,
  capitalize: js,
  copyTextToClipboard: Hs,
  debounce: $s,
  deepMerge: bt,
  deprecationAssert: Vs,
  getUserOS: mn,
  getValidUrl: qs,
  isBoolean: zs,
  isClass: Us,
  isEmpty: Rs,
  isFunction: bn,
  isIosDevice: Ds,
  isNumber: Ws,
  isObject: De,
  isPrintableKey: Zs,
  isPromise: Ys,
  isString: Ks,
  isUndefined: Xs,
  keyCodes: Gs,
  mouseButtons: Qs,
  notEmpty: jt,
  throttle: er,
  typeOf: oe
}, Symbol.toStringTag, { value: "Module" }));
var Ht = /* @__PURE__ */ Xn(tr);
Object.defineProperty(Ft, "__esModule", { value: true });
Ft.containsOnlyInlineElements = ir;
var or = Ht;
var nr = At;
function ir(n2) {
  var e;
  (0, or.isString)(n2) ? (e = document.createElement("div"), e.innerHTML = n2) : e = n2;
  var t = function(o3) {
    return !(0, nr.blockElements)().includes(o3.tagName.toLowerCase()) && Array.from(o3.children).every(t);
  };
  return Array.from(e.children).every(t);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.containsOnlyInlineElements = void 0;
  var e = Ft;
  Object.defineProperty(n2, "containsOnlyInlineElements", { enumerable: true, get: function() {
    return e.containsOnlyInlineElements;
  } });
})(Ve);
var vn = {};
var $t = {};
var qe = {};
var zt = {};
Object.defineProperty(zt, "__esModule", { value: true });
zt.make = sr;
function sr(n2, e, t) {
  var o3;
  e === void 0 && (e = null), t === void 0 && (t = {});
  var i = document.createElement(n2);
  if (Array.isArray(e)) {
    var s2 = e.filter(function(a3) {
      return a3 !== void 0;
    });
    (o3 = i.classList).add.apply(o3, s2);
  } else
    e !== null && i.classList.add(e);
  for (var r2 in t)
    Object.prototype.hasOwnProperty.call(t, r2) && (i[r2] = t[r2]);
  return i;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.make = void 0;
  var e = zt;
  Object.defineProperty(n2, "make", { enumerable: true, get: function() {
    return e.make;
  } });
})(qe);
Object.defineProperty($t, "__esModule", { value: true });
$t.fragmentToString = ar;
var rr = qe;
function ar(n2) {
  var e = (0, rr.make)("div");
  return e.appendChild(n2), e.innerHTML;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.fragmentToString = void 0;
  var e = $t;
  Object.defineProperty(n2, "fragmentToString", { enumerable: true, get: function() {
    return e.fragmentToString;
  } });
})(vn);
var kn = {};
var Ut = {};
Object.defineProperty(Ut, "__esModule", { value: true });
Ut.getContentLength = cr;
var lr = ue;
function cr(n2) {
  var e, t;
  return (0, lr.isNativeInput)(n2) ? n2.value.length : n2.nodeType === Node.TEXT_NODE ? n2.length : (t = (e = n2.textContent) === null || e === void 0 ? void 0 : e.length) !== null && t !== void 0 ? t : 0;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.getContentLength = void 0;
  var e = Ut;
  Object.defineProperty(n2, "getContentLength", { enumerable: true, get: function() {
    return e.getContentLength;
  } });
})(kn);
var Wt = {};
var Yt = {};
var Io = Ce && Ce.__spreadArray || function(n2, e, t) {
  if (t || arguments.length === 2)
    for (var o3 = 0, i = e.length, s2; o3 < i; o3++)
      (s2 || !(o3 in e)) && (s2 || (s2 = Array.prototype.slice.call(e, 0, o3)), s2[o3] = e[o3]);
  return n2.concat(s2 || Array.prototype.slice.call(e));
};
Object.defineProperty(Yt, "__esModule", { value: true });
Yt.getDeepestBlockElements = yn;
var dr = Ve;
function yn(n2) {
  return (0, dr.containsOnlyInlineElements)(n2) ? [n2] : Array.from(n2.children).reduce(function(e, t) {
    return Io(Io([], e, true), yn(t), true);
  }, []);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.getDeepestBlockElements = void 0;
  var e = Yt;
  Object.defineProperty(n2, "getDeepestBlockElements", { enumerable: true, get: function() {
    return e.getDeepestBlockElements;
  } });
})(Wt);
var wn = {};
var Kt = {};
var Ze = {};
var Xt = {};
Object.defineProperty(Xt, "__esModule", { value: true });
Xt.isLineBreakTag = ur;
function ur(n2) {
  return [
    "BR",
    "WBR"
  ].includes(n2.tagName);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isLineBreakTag = void 0;
  var e = Xt;
  Object.defineProperty(n2, "isLineBreakTag", { enumerable: true, get: function() {
    return e.isLineBreakTag;
  } });
})(Ze);
var Ge = {};
var Vt = {};
Object.defineProperty(Vt, "__esModule", { value: true });
Vt.isSingleTag = hr;
function hr(n2) {
  return [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ].includes(n2.tagName);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isSingleTag = void 0;
  var e = Vt;
  Object.defineProperty(n2, "isSingleTag", { enumerable: true, get: function() {
    return e.isSingleTag;
  } });
})(Ge);
Object.defineProperty(Kt, "__esModule", { value: true });
Kt.getDeepestNode = En;
var pr = ue;
var fr = Ze;
var gr = Ge;
function En(n2, e) {
  e === void 0 && (e = false);
  var t = e ? "lastChild" : "firstChild", o3 = e ? "previousSibling" : "nextSibling";
  if (n2.nodeType === Node.ELEMENT_NODE && n2[t]) {
    var i = n2[t];
    if ((0, gr.isSingleTag)(i) && !(0, pr.isNativeInput)(i) && !(0, fr.isLineBreakTag)(i))
      if (i[o3])
        i = i[o3];
      else if (i.parentNode !== null && i.parentNode[o3])
        i = i.parentNode[o3];
      else
        return i.parentNode;
    return En(i, e);
  }
  return n2;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.getDeepestNode = void 0;
  var e = Kt;
  Object.defineProperty(n2, "getDeepestNode", { enumerable: true, get: function() {
    return e.getDeepestNode;
  } });
})(wn);
var xn = {};
var qt = {};
var Me = Ce && Ce.__spreadArray || function(n2, e, t) {
  if (t || arguments.length === 2)
    for (var o3 = 0, i = e.length, s2; o3 < i; o3++)
      (s2 || !(o3 in e)) && (s2 || (s2 = Array.prototype.slice.call(e, 0, o3)), s2[o3] = e[o3]);
  return n2.concat(s2 || Array.prototype.slice.call(e));
};
Object.defineProperty(qt, "__esModule", { value: true });
qt.findAllInputs = yr;
var mr = Ve;
var br = Wt;
var vr = It;
var kr = ue;
function yr(n2) {
  return Array.from(n2.querySelectorAll((0, vr.allInputsSelector)())).reduce(function(e, t) {
    return (0, kr.isNativeInput)(t) || (0, mr.containsOnlyInlineElements)(t) ? Me(Me([], e, true), [t], false) : Me(Me([], e, true), (0, br.getDeepestBlockElements)(t), true);
  }, []);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.findAllInputs = void 0;
  var e = qt;
  Object.defineProperty(n2, "findAllInputs", { enumerable: true, get: function() {
    return e.findAllInputs;
  } });
})(xn);
var Bn = {};
var Zt = {};
Object.defineProperty(Zt, "__esModule", { value: true });
Zt.isCollapsedWhitespaces = wr;
function wr(n2) {
  return !/[^\t\n\r ]/.test(n2);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isCollapsedWhitespaces = void 0;
  var e = Zt;
  Object.defineProperty(n2, "isCollapsedWhitespaces", { enumerable: true, get: function() {
    return e.isCollapsedWhitespaces;
  } });
})(Bn);
var Gt = {};
var Qt = {};
Object.defineProperty(Qt, "__esModule", { value: true });
Qt.isElement = xr;
var Er = Ht;
function xr(n2) {
  return (0, Er.isNumber)(n2) ? false : !!n2 && !!n2.nodeType && n2.nodeType === Node.ELEMENT_NODE;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isElement = void 0;
  var e = Qt;
  Object.defineProperty(n2, "isElement", { enumerable: true, get: function() {
    return e.isElement;
  } });
})(Gt);
var Cn = {};
var Jt = {};
var eo = {};
var to = {};
Object.defineProperty(to, "__esModule", { value: true });
to.isLeaf = Br;
function Br(n2) {
  return n2 === null ? false : n2.childNodes.length === 0;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isLeaf = void 0;
  var e = to;
  Object.defineProperty(n2, "isLeaf", { enumerable: true, get: function() {
    return e.isLeaf;
  } });
})(eo);
var oo = {};
var no = {};
Object.defineProperty(no, "__esModule", { value: true });
no.isNodeEmpty = Or;
var Cr = Ze;
var Tr = Gt;
var Sr = ue;
var Ir = Ge;
function Or(n2, e) {
  var t = "";
  return (0, Ir.isSingleTag)(n2) && !(0, Cr.isLineBreakTag)(n2) ? false : ((0, Tr.isElement)(n2) && (0, Sr.isNativeInput)(n2) ? t = n2.value : n2.textContent !== null && (t = n2.textContent.replace("\u200B", "")), e !== void 0 && (t = t.replace(new RegExp(e, "g"), "")), t.trim().length === 0);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isNodeEmpty = void 0;
  var e = no;
  Object.defineProperty(n2, "isNodeEmpty", { enumerable: true, get: function() {
    return e.isNodeEmpty;
  } });
})(oo);
Object.defineProperty(Jt, "__esModule", { value: true });
Jt.isEmpty = Ar;
var _r = eo;
var Mr = oo;
function Ar(n2, e) {
  n2.normalize();
  for (var t = [n2]; t.length > 0; ) {
    var o3 = t.shift();
    if (o3) {
      if (n2 = o3, (0, _r.isLeaf)(n2) && !(0, Mr.isNodeEmpty)(n2, e))
        return false;
      t.push.apply(t, Array.from(n2.childNodes));
    }
  }
  return true;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isEmpty = void 0;
  var e = Jt;
  Object.defineProperty(n2, "isEmpty", { enumerable: true, get: function() {
    return e.isEmpty;
  } });
})(Cn);
var Tn = {};
var io = {};
Object.defineProperty(io, "__esModule", { value: true });
io.isFragment = Pr;
var Lr = Ht;
function Pr(n2) {
  return (0, Lr.isNumber)(n2) ? false : !!n2 && !!n2.nodeType && n2.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isFragment = void 0;
  var e = io;
  Object.defineProperty(n2, "isFragment", { enumerable: true, get: function() {
    return e.isFragment;
  } });
})(Tn);
var Sn = {};
var so = {};
Object.defineProperty(so, "__esModule", { value: true });
so.isHTMLString = Rr;
var Nr = qe;
function Rr(n2) {
  var e = (0, Nr.make)("div");
  return e.innerHTML = n2, e.childElementCount > 0;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isHTMLString = void 0;
  var e = so;
  Object.defineProperty(n2, "isHTMLString", { enumerable: true, get: function() {
    return e.isHTMLString;
  } });
})(Sn);
var In = {};
var ro = {};
Object.defineProperty(ro, "__esModule", { value: true });
ro.offset = Dr;
function Dr(n2) {
  var e = n2.getBoundingClientRect(), t = window.pageXOffset || document.documentElement.scrollLeft, o3 = window.pageYOffset || document.documentElement.scrollTop, i = e.top + o3, s2 = e.left + t;
  return {
    top: i,
    left: s2,
    bottom: i + e.height,
    right: s2 + e.width
  };
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.offset = void 0;
  var e = ro;
  Object.defineProperty(n2, "offset", { enumerable: true, get: function() {
    return e.offset;
  } });
})(In);
var On = {};
var ao = {};
Object.defineProperty(ao, "__esModule", { value: true });
ao.prepend = Fr;
function Fr(n2, e) {
  Array.isArray(e) ? (e = e.reverse(), e.forEach(function(t) {
    return n2.prepend(t);
  })) : n2.prepend(e);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.prepend = void 0;
  var e = ao;
  Object.defineProperty(n2, "prepend", { enumerable: true, get: function() {
    return e.prepend;
  } });
})(On);
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.prepend = n2.offset = n2.make = n2.isLineBreakTag = n2.isSingleTag = n2.isNodeEmpty = n2.isLeaf = n2.isHTMLString = n2.isFragment = n2.isEmpty = n2.isElement = n2.isContentEditable = n2.isCollapsedWhitespaces = n2.findAllInputs = n2.isNativeInput = n2.allInputsSelector = n2.getDeepestNode = n2.getDeepestBlockElements = n2.getContentLength = n2.fragmentToString = n2.containsOnlyInlineElements = n2.canSetCaret = n2.calculateBaseline = n2.blockElements = n2.append = void 0;
  var e = It;
  Object.defineProperty(n2, "allInputsSelector", { enumerable: true, get: function() {
    return e.allInputsSelector;
  } });
  var t = ue;
  Object.defineProperty(n2, "isNativeInput", { enumerable: true, get: function() {
    return t.isNativeInput;
  } });
  var o3 = pn;
  Object.defineProperty(n2, "append", { enumerable: true, get: function() {
    return o3.append;
  } });
  var i = At;
  Object.defineProperty(n2, "blockElements", { enumerable: true, get: function() {
    return i.blockElements;
  } });
  var s2 = fn;
  Object.defineProperty(n2, "calculateBaseline", { enumerable: true, get: function() {
    return s2.calculateBaseline;
  } });
  var r2 = gn;
  Object.defineProperty(n2, "canSetCaret", { enumerable: true, get: function() {
    return r2.canSetCaret;
  } });
  var a3 = Ve;
  Object.defineProperty(n2, "containsOnlyInlineElements", { enumerable: true, get: function() {
    return a3.containsOnlyInlineElements;
  } });
  var l2 = vn;
  Object.defineProperty(n2, "fragmentToString", { enumerable: true, get: function() {
    return l2.fragmentToString;
  } });
  var c5 = kn;
  Object.defineProperty(n2, "getContentLength", { enumerable: true, get: function() {
    return c5.getContentLength;
  } });
  var d3 = Wt;
  Object.defineProperty(n2, "getDeepestBlockElements", { enumerable: true, get: function() {
    return d3.getDeepestBlockElements;
  } });
  var h3 = wn;
  Object.defineProperty(n2, "getDeepestNode", { enumerable: true, get: function() {
    return h3.getDeepestNode;
  } });
  var p4 = xn;
  Object.defineProperty(n2, "findAllInputs", { enumerable: true, get: function() {
    return p4.findAllInputs;
  } });
  var g6 = Bn;
  Object.defineProperty(n2, "isCollapsedWhitespaces", { enumerable: true, get: function() {
    return g6.isCollapsedWhitespaces;
  } });
  var f4 = Rt;
  Object.defineProperty(n2, "isContentEditable", { enumerable: true, get: function() {
    return f4.isContentEditable;
  } });
  var v4 = Gt;
  Object.defineProperty(n2, "isElement", { enumerable: true, get: function() {
    return v4.isElement;
  } });
  var O3 = Cn;
  Object.defineProperty(n2, "isEmpty", { enumerable: true, get: function() {
    return O3.isEmpty;
  } });
  var T3 = Tn;
  Object.defineProperty(n2, "isFragment", { enumerable: true, get: function() {
    return T3.isFragment;
  } });
  var M3 = Sn;
  Object.defineProperty(n2, "isHTMLString", { enumerable: true, get: function() {
    return M3.isHTMLString;
  } });
  var q2 = eo;
  Object.defineProperty(n2, "isLeaf", { enumerable: true, get: function() {
    return q2.isLeaf;
  } });
  var F3 = oo;
  Object.defineProperty(n2, "isNodeEmpty", { enumerable: true, get: function() {
    return F3.isNodeEmpty;
  } });
  var H3 = Ze;
  Object.defineProperty(n2, "isLineBreakTag", { enumerable: true, get: function() {
    return H3.isLineBreakTag;
  } });
  var Q2 = Ge;
  Object.defineProperty(n2, "isSingleTag", { enumerable: true, get: function() {
    return Q2.isSingleTag;
  } });
  var ie2 = qe;
  Object.defineProperty(n2, "make", { enumerable: true, get: function() {
    return ie2.make;
  } });
  var k4 = In;
  Object.defineProperty(n2, "offset", { enumerable: true, get: function() {
    return k4.offset;
  } });
  var m4 = On;
  Object.defineProperty(n2, "prepend", { enumerable: true, get: function() {
    return m4.prepend;
  } });
})(de);
var Qe = {};
Object.defineProperty(Qe, "__esModule", { value: true });
Qe.getContenteditableSlice = Hr;
var jr = de;
function Hr(n2, e, t, o3, i) {
  var s2;
  i === void 0 && (i = false);
  var r2 = document.createRange();
  if (o3 === "left" ? (r2.setStart(n2, 0), r2.setEnd(e, t)) : (r2.setStart(e, t), r2.setEnd(n2, n2.childNodes.length)), i === true) {
    var a3 = r2.extractContents();
    return (0, jr.fragmentToString)(a3);
  }
  var l2 = r2.cloneContents(), c5 = document.createElement("div");
  c5.appendChild(l2);
  var d3 = (s2 = c5.textContent) !== null && s2 !== void 0 ? s2 : "";
  return d3;
}
Object.defineProperty(Xe, "__esModule", { value: true });
Xe.checkContenteditableSliceForEmptiness = Ur;
var $r = de;
var zr = Qe;
function Ur(n2, e, t, o3) {
  var i = (0, zr.getContenteditableSlice)(n2, e, t, o3);
  return (0, $r.isCollapsedWhitespaces)(i);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.checkContenteditableSliceForEmptiness = void 0;
  var e = Xe;
  Object.defineProperty(n2, "checkContenteditableSliceForEmptiness", { enumerable: true, get: function() {
    return e.checkContenteditableSliceForEmptiness;
  } });
})(St);
var _n = {};
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.getContenteditableSlice = void 0;
  var e = Qe;
  Object.defineProperty(n2, "getContenteditableSlice", { enumerable: true, get: function() {
    return e.getContenteditableSlice;
  } });
})(_n);
var Mn = {};
var lo = {};
Object.defineProperty(lo, "__esModule", { value: true });
lo.focus = Yr;
var Wr = de;
function Yr(n2, e) {
  var t, o3;
  if (e === void 0 && (e = true), (0, Wr.isNativeInput)(n2)) {
    n2.focus();
    var i = e ? 0 : n2.value.length;
    n2.setSelectionRange(i, i);
  } else {
    var s2 = document.createRange(), r2 = window.getSelection();
    if (!r2)
      return;
    var a3 = function(p4) {
      var g6 = document.createTextNode("");
      p4.appendChild(g6), s2.setStart(g6, 0), s2.setEnd(g6, 0);
    }, l2 = function(p4) {
      return p4 != null;
    }, c5 = n2.childNodes, d3 = e ? c5[0] : c5[c5.length - 1];
    if (l2(d3)) {
      for (; l2(d3) && d3.nodeType !== Node.TEXT_NODE; )
        d3 = e ? d3.firstChild : d3.lastChild;
      if (l2(d3) && d3.nodeType === Node.TEXT_NODE) {
        var h3 = (o3 = (t = d3.textContent) === null || t === void 0 ? void 0 : t.length) !== null && o3 !== void 0 ? o3 : 0, i = e ? 0 : h3;
        s2.setStart(d3, i), s2.setEnd(d3, i);
      } else
        a3(n2);
    } else
      a3(n2);
    r2.removeAllRanges(), r2.addRange(s2);
  }
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.focus = void 0;
  var e = lo;
  Object.defineProperty(n2, "focus", { enumerable: true, get: function() {
    return e.focus;
  } });
})(Mn);
var co = {};
var Je = {};
Object.defineProperty(Je, "__esModule", { value: true });
Je.getCaretNodeAndOffset = Kr;
function Kr() {
  var n2 = window.getSelection();
  if (n2 === null)
    return [null, 0];
  var e = n2.focusNode, t = n2.focusOffset;
  return e === null ? [null, 0] : (e.nodeType !== Node.TEXT_NODE && e.childNodes.length > 0 && (e.childNodes[t] !== void 0 ? (e = e.childNodes[t], t = 0) : (e = e.childNodes[t - 1], e.textContent !== null && (t = e.textContent.length))), [e, t]);
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.getCaretNodeAndOffset = void 0;
  var e = Je;
  Object.defineProperty(n2, "getCaretNodeAndOffset", { enumerable: true, get: function() {
    return e.getCaretNodeAndOffset;
  } });
})(co);
var An = {};
var et = {};
Object.defineProperty(et, "__esModule", { value: true });
et.getRange = Xr;
function Xr() {
  var n2 = window.getSelection();
  return n2 && n2.rangeCount ? n2.getRangeAt(0) : null;
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.getRange = void 0;
  var e = et;
  Object.defineProperty(n2, "getRange", { enumerable: true, get: function() {
    return e.getRange;
  } });
})(An);
var Ln = {};
var uo = {};
Object.defineProperty(uo, "__esModule", { value: true });
uo.isCaretAtEndOfInput = Zr;
var Oo = de;
var Vr = co;
var qr = St;
function Zr(n2) {
  var e = (0, Oo.getDeepestNode)(n2, true);
  if (e === null)
    return true;
  if ((0, Oo.isNativeInput)(e))
    return e.selectionEnd === e.value.length;
  var t = (0, Vr.getCaretNodeAndOffset)(), o3 = t[0], i = t[1];
  return o3 === null ? false : (0, qr.checkContenteditableSliceForEmptiness)(n2, o3, i, "right");
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isCaretAtEndOfInput = void 0;
  var e = uo;
  Object.defineProperty(n2, "isCaretAtEndOfInput", { enumerable: true, get: function() {
    return e.isCaretAtEndOfInput;
  } });
})(Ln);
var Pn = {};
var ho = {};
Object.defineProperty(ho, "__esModule", { value: true });
ho.isCaretAtStartOfInput = Jr;
var Ae = de;
var Gr = Je;
var Qr = Xe;
function Jr(n2) {
  var e = (0, Ae.getDeepestNode)(n2);
  if (e === null || (0, Ae.isEmpty)(n2))
    return true;
  if ((0, Ae.isNativeInput)(e))
    return e.selectionEnd === 0;
  if ((0, Ae.isEmpty)(n2))
    return true;
  var t = (0, Gr.getCaretNodeAndOffset)(), o3 = t[0], i = t[1];
  return o3 === null ? false : (0, Qr.checkContenteditableSliceForEmptiness)(n2, o3, i, "left");
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.isCaretAtStartOfInput = void 0;
  var e = ho;
  Object.defineProperty(n2, "isCaretAtStartOfInput", { enumerable: true, get: function() {
    return e.isCaretAtStartOfInput;
  } });
})(Pn);
var Nn = {};
var po = {};
Object.defineProperty(po, "__esModule", { value: true });
po.save = oa;
var ea = de;
var ta = et;
function oa() {
  var n2 = (0, ta.getRange)(), e = (0, ea.make)("span");
  if (e.id = "cursor", e.hidden = true, !!n2)
    return n2.insertNode(e), function() {
      var o3 = window.getSelection();
      o3 && (n2.setStartAfter(e), n2.setEndAfter(e), o3.removeAllRanges(), o3.addRange(n2), setTimeout(function() {
        e.remove();
      }, 150));
    };
}
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.save = void 0;
  var e = po;
  Object.defineProperty(n2, "save", { enumerable: true, get: function() {
    return e.save;
  } });
})(Nn);
(function(n2) {
  Object.defineProperty(n2, "__esModule", { value: true }), n2.save = n2.isCaretAtStartOfInput = n2.isCaretAtEndOfInput = n2.getRange = n2.getCaretNodeAndOffset = n2.focus = n2.getContenteditableSlice = n2.checkContenteditableSliceForEmptiness = void 0;
  var e = St;
  Object.defineProperty(n2, "checkContenteditableSliceForEmptiness", { enumerable: true, get: function() {
    return e.checkContenteditableSliceForEmptiness;
  } });
  var t = _n;
  Object.defineProperty(n2, "getContenteditableSlice", { enumerable: true, get: function() {
    return t.getContenteditableSlice;
  } });
  var o3 = Mn;
  Object.defineProperty(n2, "focus", { enumerable: true, get: function() {
    return o3.focus;
  } });
  var i = co;
  Object.defineProperty(n2, "getCaretNodeAndOffset", { enumerable: true, get: function() {
    return i.getCaretNodeAndOffset;
  } });
  var s2 = An;
  Object.defineProperty(n2, "getRange", { enumerable: true, get: function() {
    return s2.getRange;
  } });
  var r2 = Ln;
  Object.defineProperty(n2, "isCaretAtEndOfInput", { enumerable: true, get: function() {
    return r2.isCaretAtEndOfInput;
  } });
  var a3 = Pn;
  Object.defineProperty(n2, "isCaretAtStartOfInput", { enumerable: true, get: function() {
    return a3.isCaretAtStartOfInput;
  } });
  var l2 = Nn;
  Object.defineProperty(n2, "save", { enumerable: true, get: function() {
    return l2.save;
  } });
})(hn);
var na = class extends E {
  /**
   * All keydowns on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  keydown(e) {
    switch (this.beforeKeydownProcessing(e), e.keyCode) {
      case y.BACKSPACE:
        this.backspace(e);
        break;
      case y.DELETE:
        this.delete(e);
        break;
      case y.ENTER:
        this.enter(e);
        break;
      case y.DOWN:
      case y.RIGHT:
        this.arrowRightAndDown(e);
        break;
      case y.UP:
      case y.LEFT:
        this.arrowLeftAndUp(e);
        break;
      case y.TAB:
        this.tabPressed(e);
        break;
    }
    e.key === "/" && !e.ctrlKey && !e.metaKey && this.slashPressed(e), e.code === "Slash" && (e.ctrlKey || e.metaKey) && (e.preventDefault(), this.commandSlashPressed());
  }
  /**
   * Fires on keydown before event processing
   *
   * @param {KeyboardEvent} event - keydown
   */
  beforeKeydownProcessing(e) {
    this.needToolbarClosing(e) && Po(e.keyCode) && (this.Editor.Toolbar.close(), e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || this.Editor.BlockSelection.clearSelection(e));
  }
  /**
   * Key up on Block:
   * - shows Inline Toolbar if something selected
   * - shows conversion toolbar with 85% of block selection
   *
   * @param {KeyboardEvent} event - keyup event
   */
  keyup(e) {
    e.shiftKey || this.Editor.UI.checkEmptiness();
  }
  /**
   * Add drop target styles
   *
   * @param {DragEvent} event - drag over event
   */
  dragOver(e) {
    const t = this.Editor.BlockManager.getBlockByChildNode(e.target);
    t.dropTarget = true;
  }
  /**
   * Remove drop target style
   *
   * @param {DragEvent} event - drag leave event
   */
  dragLeave(e) {
    const t = this.Editor.BlockManager.getBlockByChildNode(e.target);
    t.dropTarget = false;
  }
  /**
   * Copying selected blocks
   * Before putting to the clipboard we sanitize all blocks and then copy to the clipboard
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  handleCommandC(e) {
    const { BlockSelection: t } = this.Editor;
    t.anyBlockSelected && t.copySelectedBlocks(e);
  }
  /**
   * Copy and Delete selected Blocks
   *
   * @param {ClipboardEvent} event - clipboard event
   */
  handleCommandX(e) {
    const { BlockSelection: t, BlockManager: o3, Caret: i } = this.Editor;
    t.anyBlockSelected && t.copySelectedBlocks(e).then(() => {
      const s2 = o3.removeSelectedBlocks(), r2 = o3.insertDefaultBlockAtIndex(s2, true);
      i.setToBlock(r2, i.positions.START), t.clearSelection(e);
    });
  }
  /**
   * Tab pressed inside a Block.
   *
   * @param {KeyboardEvent} event - keydown
   */
  tabPressed(e) {
    const { InlineToolbar: t, Caret: o3 } = this.Editor;
    if (t.opened)
      return;
    (e.shiftKey ? o3.navigatePrevious(true) : o3.navigateNext(true)) && e.preventDefault();
  }
  /**
   * '/' + 'command' keydown inside a Block
   */
  commandSlashPressed() {
    this.Editor.BlockSelection.selectedBlocks.length > 1 || this.activateBlockSettings();
  }
  /**
   * '/' keydown inside a Block
   *
   * @param event - keydown
   */
  slashPressed(e) {
    !this.Editor.UI.nodes.wrapper.contains(e.target) || !this.Editor.BlockManager.currentBlock.isEmpty || (e.preventDefault(), this.Editor.Caret.insertContentAtCaretPosition("/"), this.activateToolbox());
  }
  /**
   * ENTER pressed on block
   *
   * @param {KeyboardEvent} event - keydown
   */
  enter(e) {
    const { BlockManager: t, UI: o3 } = this.Editor, i = t.currentBlock;
    if (i === void 0 || i.tool.isLineBreaksEnabled || o3.someToolbarOpened && o3.someFlipperButtonFocused || e.shiftKey && !pt)
      return;
    let s2 = i;
    i.currentInput !== void 0 && Ne(i.currentInput) && !i.hasMedia ? this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex) : i.currentInput && Re(i.currentInput) ? s2 = this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex + 1) : s2 = this.Editor.BlockManager.split(), this.Editor.Caret.setToBlock(s2), this.Editor.Toolbar.moveAndOpen(s2), e.preventDefault();
  }
  /**
   * Handle backspace keydown on Block
   *
   * @param {KeyboardEvent} event - keydown
   */
  backspace(e) {
    const { BlockManager: t, Caret: o3 } = this.Editor, { currentBlock: i, previousBlock: s2 } = t;
    if (i === void 0 || !b.isCollapsed || !i.currentInput || !Ne(i.currentInput))
      return;
    if (e.preventDefault(), this.Editor.Toolbar.close(), !(i.currentInput === i.firstInput)) {
      o3.navigatePrevious();
      return;
    }
    if (s2 === null)
      return;
    if (s2.isEmpty) {
      t.removeBlock(s2);
      return;
    }
    if (i.isEmpty) {
      t.removeBlock(i);
      const l2 = t.currentBlock;
      o3.setToBlock(l2, o3.positions.END);
      return;
    }
    xo(s2, i) ? this.mergeBlocks(s2, i) : o3.setToBlock(s2, o3.positions.END);
  }
  /**
   * Handles delete keydown on Block
   * Removes char after the caret.
   * If caret is at the end of the block, merge next block with current
   *
   * @param {KeyboardEvent} event - keydown
   */
  delete(e) {
    const { BlockManager: t, Caret: o3 } = this.Editor, { currentBlock: i, nextBlock: s2 } = t;
    if (!b.isCollapsed || !Re(i.currentInput))
      return;
    if (e.preventDefault(), this.Editor.Toolbar.close(), !(i.currentInput === i.lastInput)) {
      o3.navigateNext();
      return;
    }
    if (s2 === null)
      return;
    if (s2.isEmpty) {
      t.removeBlock(s2);
      return;
    }
    if (i.isEmpty) {
      t.removeBlock(i), o3.setToBlock(s2, o3.positions.START);
      return;
    }
    xo(i, s2) ? this.mergeBlocks(i, s2) : o3.setToBlock(s2, o3.positions.START);
  }
  /**
   * Merge passed Blocks
   *
   * @param targetBlock - to which Block we want to merge
   * @param blockToMerge - what Block we want to merge
   */
  mergeBlocks(e, t) {
    const { BlockManager: o3, Toolbar: i } = this.Editor;
    e.lastInput !== void 0 && (hn.focus(e.lastInput, false), o3.mergeBlocks(e, t).then(() => {
      i.close();
    }));
  }
  /**
   * Handle right and down keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  arrowRightAndDown(e) {
    const t = ce.usedKeys.includes(e.keyCode) && (!e.shiftKey || e.keyCode === y.TAB);
    if (this.Editor.UI.someToolbarOpened && t)
      return;
    this.Editor.Toolbar.close();
    const { currentBlock: o3 } = this.Editor.BlockManager, s2 = ((o3 == null ? void 0 : o3.currentInput) !== void 0 ? Re(o3.currentInput) : void 0) || this.Editor.BlockSelection.anyBlockSelected;
    if (e.shiftKey && e.keyCode === y.DOWN && s2) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState();
      return;
    }
    if (e.keyCode === y.DOWN || e.keyCode === y.RIGHT && !this.isRtl ? this.Editor.Caret.navigateNext() : this.Editor.Caret.navigatePrevious()) {
      e.preventDefault();
      return;
    }
    Fe(() => {
      this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.updateCurrentInput();
    }, 20)(), this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * Handle left and up keyboard keys
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  arrowLeftAndUp(e) {
    if (this.Editor.UI.someToolbarOpened) {
      if (ce.usedKeys.includes(e.keyCode) && (!e.shiftKey || e.keyCode === y.TAB))
        return;
      this.Editor.UI.closeAllToolbars();
    }
    this.Editor.Toolbar.close();
    const { currentBlock: t } = this.Editor.BlockManager, i = ((t == null ? void 0 : t.currentInput) !== void 0 ? Ne(t.currentInput) : void 0) || this.Editor.BlockSelection.anyBlockSelected;
    if (e.shiftKey && e.keyCode === y.UP && i) {
      this.Editor.CrossBlockSelection.toggleBlockSelectedState(false);
      return;
    }
    if (e.keyCode === y.UP || e.keyCode === y.LEFT && !this.isRtl ? this.Editor.Caret.navigatePrevious() : this.Editor.Caret.navigateNext()) {
      e.preventDefault();
      return;
    }
    Fe(() => {
      this.Editor.BlockManager.currentBlock && this.Editor.BlockManager.currentBlock.updateCurrentInput();
    }, 20)(), this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * Cases when we need to close Toolbar
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  needToolbarClosing(e) {
    const t = e.keyCode === y.ENTER && this.Editor.Toolbar.toolbox.opened, o3 = e.keyCode === y.ENTER && this.Editor.BlockSettings.opened, i = e.keyCode === y.ENTER && this.Editor.InlineToolbar.opened, s2 = e.keyCode === y.TAB;
    return !(e.shiftKey || s2 || t || o3 || i);
  }
  /**
   * If Toolbox is not open, then just open it and show plus button
   */
  activateToolbox() {
    this.Editor.Toolbar.opened || this.Editor.Toolbar.moveAndOpen(), this.Editor.Toolbar.toolbox.open();
  }
  /**
   * Open Toolbar and show BlockSettings before flipping Tools
   */
  activateBlockSettings() {
    this.Editor.Toolbar.opened || this.Editor.Toolbar.moveAndOpen(), this.Editor.BlockSettings.opened || this.Editor.BlockSettings.open();
  }
};
var ct = class {
  /**
   * @class
   * @param {HTMLElement} workingArea — editor`s working node
   */
  constructor(e) {
    this.blocks = [], this.workingArea = e;
  }
  /**
   * Get length of Block instances array
   *
   * @returns {number}
   */
  get length() {
    return this.blocks.length;
  }
  /**
   * Get Block instances array
   *
   * @returns {Block[]}
   */
  get array() {
    return this.blocks;
  }
  /**
   * Get blocks html elements array
   *
   * @returns {HTMLElement[]}
   */
  get nodes() {
    return No(this.workingArea.children);
  }
  /**
   * Proxy trap to implement array-like setter
   *
   * @example
   * blocks[0] = new Block(...)
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — block index or any Blocks class property key to set
   * @param {Block} value — value to set
   * @returns {boolean}
   */
  static set(e, t, o3) {
    return isNaN(Number(t)) ? (Reflect.set(e, t, o3), true) : (e.insert(+t, o3), true);
  }
  /**
   * Proxy trap to implement array-like getter
   *
   * @param {Blocks} instance — Blocks instance
   * @param {PropertyKey} property — Blocks class property key
   * @returns {Block|*}
   */
  static get(e, t) {
    return isNaN(Number(t)) ? Reflect.get(e, t) : e.get(+t);
  }
  /**
   * Push new Block to the blocks array and append it to working area
   *
   * @param {Block} block - Block to add
   */
  push(e) {
    this.blocks.push(e), this.insertToDOM(e);
  }
  /**
   * Swaps blocks with indexes first and second
   *
   * @param {number} first - first block index
   * @param {number} second - second block index
   * @deprecated — use 'move' instead
   */
  swap(e, t) {
    const o3 = this.blocks[t];
    u.swap(this.blocks[e].holder, o3.holder), this.blocks[t] = this.blocks[e], this.blocks[e] = o3;
  }
  /**
   * Move a block from one to another index
   *
   * @param {number} toIndex - new index of the block
   * @param {number} fromIndex - block to move
   */
  move(e, t) {
    const o3 = this.blocks.splice(t, 1)[0], i = e - 1, s2 = Math.max(0, i), r2 = this.blocks[s2];
    e > 0 ? this.insertToDOM(o3, "afterend", r2) : this.insertToDOM(o3, "beforebegin", r2), this.blocks.splice(e, 0, o3);
    const a3 = this.composeBlockEvent("move", {
      fromIndex: t,
      toIndex: e
    });
    o3.call(ee.MOVED, a3);
  }
  /**
   * Insert new Block at passed index
   *
   * @param {number} index — index to insert Block
   * @param {Block} block — Block to insert
   * @param {boolean} replace — it true, replace block on given index
   */
  insert(e, t, o3 = false) {
    if (!this.length) {
      this.push(t);
      return;
    }
    e > this.length && (e = this.length), o3 && (this.blocks[e].holder.remove(), this.blocks[e].call(ee.REMOVED));
    const i = o3 ? 1 : 0;
    if (this.blocks.splice(e, i, t), e > 0) {
      const s2 = this.blocks[e - 1];
      this.insertToDOM(t, "afterend", s2);
    } else {
      const s2 = this.blocks[e + 1];
      s2 ? this.insertToDOM(t, "beforebegin", s2) : this.insertToDOM(t);
    }
  }
  /**
   * Replaces block under passed index with passed block
   *
   * @param index - index of existed block
   * @param block - new block
   */
  replace(e, t) {
    if (this.blocks[e] === void 0)
      throw Error("Incorrect index");
    this.blocks[e].holder.replaceWith(t.holder), this.blocks[e] = t;
  }
  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index to insert blocks at
   */
  insertMany(e, t) {
    const o3 = new DocumentFragment();
    for (const i of e)
      o3.appendChild(i.holder);
    if (this.length > 0) {
      if (t > 0) {
        const i = Math.min(t - 1, this.length - 1);
        this.blocks[i].holder.after(o3);
      } else
        t === 0 && this.workingArea.prepend(o3);
      this.blocks.splice(t, 0, ...e);
    } else
      this.blocks.push(...e), this.workingArea.appendChild(o3);
    e.forEach((i) => i.call(ee.RENDERED));
  }
  /**
   * Remove block
   *
   * @param {number} index - index of Block to remove
   */
  remove(e) {
    isNaN(e) && (e = this.length - 1), this.blocks[e].holder.remove(), this.blocks[e].call(ee.REMOVED), this.blocks.splice(e, 1);
  }
  /**
   * Remove all blocks
   */
  removeAll() {
    this.workingArea.innerHTML = "", this.blocks.forEach((e) => e.call(ee.REMOVED)), this.blocks.length = 0;
  }
  /**
   * Insert Block after passed target
   *
   * @todo decide if this method is necessary
   * @param {Block} targetBlock — target after which Block should be inserted
   * @param {Block} newBlock — Block to insert
   */
  insertAfter(e, t) {
    const o3 = this.blocks.indexOf(e);
    this.insert(o3 + 1, t);
  }
  /**
   * Get Block by index
   *
   * @param {number} index — Block index
   * @returns {Block}
   */
  get(e) {
    return this.blocks[e];
  }
  /**
   * Return index of passed Block
   *
   * @param {Block} block - Block to find
   * @returns {number}
   */
  indexOf(e) {
    return this.blocks.indexOf(e);
  }
  /**
   * Insert new Block into DOM
   *
   * @param {Block} block - Block to insert
   * @param {InsertPosition} position — insert position (if set, will use insertAdjacentElement)
   * @param {Block} target — Block related to position
   */
  insertToDOM(e, t, o3) {
    t ? o3.holder.insertAdjacentElement(t, e.holder) : this.workingArea.appendChild(e.holder), e.call(ee.RENDERED);
  }
  /**
   * Composes Block event with passed type and details
   *
   * @param {string} type - event type
   * @param {object} detail - event detail
   */
  composeBlockEvent(e, t) {
    return new CustomEvent(e, {
      detail: t
    });
  }
};
var _o = "block-removed";
var Mo = "block-added";
var ia = "block-moved";
var Ao = "block-changed";
var sa = class {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   *
   * @param operation - promise should be added to queue
   */
  add(e) {
    return new Promise((t, o3) => {
      this.completed = this.completed.then(e).then(t).catch(o3);
    });
  }
};
var ra = class extends E {
  constructor() {
    super(...arguments), this._currentBlockIndex = -1, this._blocks = null;
  }
  /**
   * Returns current Block index
   *
   * @returns {number}
   */
  get currentBlockIndex() {
    return this._currentBlockIndex;
  }
  /**
   * Set current Block index and fire Block lifecycle callbacks
   *
   * @param {number} newIndex - index of Block to set as current
   */
  set currentBlockIndex(e) {
    this._currentBlockIndex = e;
  }
  /**
   * returns first Block
   *
   * @returns {Block}
   */
  get firstBlock() {
    return this._blocks[0];
  }
  /**
   * returns last Block
   *
   * @returns {Block}
   */
  get lastBlock() {
    return this._blocks[this._blocks.length - 1];
  }
  /**
   * Get current Block instance
   *
   * @returns {Block}
   */
  get currentBlock() {
    return this._blocks[this.currentBlockIndex];
  }
  /**
   * Set passed Block as a current
   *
   * @param block - block to set as a current
   */
  set currentBlock(e) {
    this.currentBlockIndex = this.getBlockIndex(e);
  }
  /**
   * Returns next Block instance
   *
   * @returns {Block|null}
   */
  get nextBlock() {
    return this.currentBlockIndex === this._blocks.length - 1 ? null : this._blocks[this.currentBlockIndex + 1];
  }
  /**
   * Return first Block with inputs after current Block
   *
   * @returns {Block | undefined}
   */
  get nextContentfulBlock() {
    return this.blocks.slice(this.currentBlockIndex + 1).find((t) => !!t.inputs.length);
  }
  /**
   * Return first Block with inputs before current Block
   *
   * @returns {Block | undefined}
   */
  get previousContentfulBlock() {
    return this.blocks.slice(0, this.currentBlockIndex).reverse().find((t) => !!t.inputs.length);
  }
  /**
   * Returns previous Block instance
   *
   * @returns {Block|null}
   */
  get previousBlock() {
    return this.currentBlockIndex === 0 ? null : this._blocks[this.currentBlockIndex - 1];
  }
  /**
   * Get array of Block instances
   *
   * @returns {Block[]} {@link Blocks#array}
   */
  get blocks() {
    return this._blocks.array;
  }
  /**
   * Check if each Block is empty
   *
   * @returns {boolean}
   */
  get isEditorEmpty() {
    return this.blocks.every((e) => e.isEmpty);
  }
  /**
   * Should be called after Editor.UI preparation
   * Define this._blocks property
   */
  prepare() {
    const e = new ct(this.Editor.UI.nodes.redactor);
    this._blocks = new Proxy(e, {
      set: ct.set,
      get: ct.get
    }), this.listeners.on(
      document,
      "copy",
      (t) => this.Editor.BlockEvents.handleCommandC(t)
    );
  }
  /**
   * Toggle read-only state
   *
   * If readOnly is true:
   *  - Unbind event handlers from created Blocks
   *
   * if readOnly is false:
   *  - Bind event handlers to all existing Blocks
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  toggleReadOnly(e) {
    e ? this.disableModuleBindings() : this.enableModuleBindings();
  }
  /**
   * Creates Block instance by tool name
   *
   * @param {object} options - block creation options
   * @param {string} options.tool - tools passed in editor config {@link EditorConfig#tools}
   * @param {string} [options.id] - unique id for this block
   * @param {BlockToolData} [options.data] - constructor params
   * @returns {Block}
   */
  composeBlock({
    tool: e,
    data: t = {},
    id: o3 = void 0,
    tunes: i = {}
  }) {
    const s2 = this.Editor.ReadOnly.isEnabled, r2 = this.Editor.Tools.blockTools.get(e), a3 = new R({
      id: o3,
      data: t,
      tool: r2,
      api: this.Editor.API,
      readOnly: s2,
      tunesData: i
    }, this.eventsDispatcher);
    return s2 || window.requestIdleCallback(() => {
      this.bindBlockEvents(a3);
    }, { timeout: 2e3 }), a3;
  }
  /**
   * Insert new block into _blocks
   *
   * @param {object} options - insert options
   * @param {string} [options.id] - block's unique id
   * @param {string} [options.tool] - plugin name, by default method inserts the default block type
   * @param {object} [options.data] - plugin data
   * @param {number} [options.index] - index where to insert new Block
   * @param {boolean} [options.needToFocus] - flag shows if needed to update current Block index
   * @param {boolean} [options.replace] - flag shows if block by passed index should be replaced with inserted one
   * @returns {Block}
   */
  insert({
    id: e = void 0,
    tool: t = this.config.defaultBlock,
    data: o3 = {},
    index: i,
    needToFocus: s2 = true,
    replace: r2 = false,
    tunes: a3 = {}
  } = {}) {
    let l2 = i;
    l2 === void 0 && (l2 = this.currentBlockIndex + (r2 ? 0 : 1));
    const c5 = this.composeBlock({
      id: e,
      tool: t,
      data: o3,
      tunes: a3
    });
    return r2 && this.blockDidMutated(_o, this.getBlockByIndex(l2), {
      index: l2
    }), this._blocks.insert(l2, c5, r2), this.blockDidMutated(Mo, c5, {
      index: l2
    }), s2 ? this.currentBlockIndex = l2 : l2 <= this.currentBlockIndex && this.currentBlockIndex++, c5;
  }
  /**
   * Inserts several blocks at once
   *
   * @param blocks - blocks to insert
   * @param index - index where to insert
   */
  insertMany(e, t = 0) {
    this._blocks.insertMany(e, t);
  }
  /**
   * Update Block data.
   *
   * Currently we don't have an 'update' method in the Tools API, so we just create a new block with the same id and type
   * Should not trigger 'block-removed' or 'block-added' events.
   *
   * If neither data nor tunes is provided, return the provided block instead.
   *
   * @param block - block to update
   * @param data - (optional) new data
   * @param tunes - (optional) tune data
   */
  async update(e, t, o3) {
    if (!t && !o3)
      return e;
    const i = await e.data, s2 = this.composeBlock({
      id: e.id,
      tool: e.name,
      data: Object.assign({}, i, t ?? {}),
      tunes: o3 ?? e.tunes
    }), r2 = this.getBlockIndex(e);
    return this._blocks.replace(r2, s2), this.blockDidMutated(Ao, s2, {
      index: r2
    }), s2;
  }
  /**
   * Replace passed Block with the new one with specified Tool and data
   *
   * @param block - block to replace
   * @param newTool - new Tool name
   * @param data - new Tool data
   */
  replace(e, t, o3) {
    const i = this.getBlockIndex(e);
    return this.insert({
      tool: t,
      data: o3,
      index: i,
      replace: true
    });
  }
  /**
   * Insert pasted content. Call onPaste callback after insert.
   *
   * @param {string} toolName - name of Tool to insert
   * @param {PasteEvent} pasteEvent - pasted data
   * @param {boolean} replace - should replace current block
   */
  paste(e, t, o3 = false) {
    const i = this.insert({
      tool: e,
      replace: o3
    });
    try {
      window.requestIdleCallback(() => {
        i.call(ee.ON_PASTE, t);
      });
    } catch (s2) {
      S(`${e}: onPaste callback call is failed`, "error", s2);
    }
    return i;
  }
  /**
   * Insert new default block at passed index
   *
   * @param {number} index - index where Block should be inserted
   * @param {boolean} needToFocus - if true, updates current Block index
   *
   * TODO: Remove method and use insert() with index instead (?)
   * @returns {Block} inserted Block
   */
  insertDefaultBlockAtIndex(e, t = false) {
    const o3 = this.composeBlock({ tool: this.config.defaultBlock });
    return this._blocks[e] = o3, this.blockDidMutated(Mo, o3, {
      index: e
    }), t ? this.currentBlockIndex = e : e <= this.currentBlockIndex && this.currentBlockIndex++, o3;
  }
  /**
   * Always inserts at the end
   *
   * @returns {Block}
   */
  insertAtEnd() {
    return this.currentBlockIndex = this.blocks.length - 1, this.insert();
  }
  /**
   * Merge two blocks
   *
   * @param {Block} targetBlock - previous block will be append to this block
   * @param {Block} blockToMerge - block that will be merged with target block
   * @returns {Promise} - the sequence that can be continued
   */
  async mergeBlocks(e, t) {
    let o3;
    if (e.name === t.name && e.mergeable) {
      const i = await t.data;
      if (V(i)) {
        console.error("Could not merge Block. Failed to extract original Block data.");
        return;
      }
      const [s2] = yt([i], e.tool.sanitizeConfig);
      o3 = s2;
    } else if (e.mergeable && He(t, "export") && He(e, "import")) {
      const i = await t.exportDataAsString(), s2 = Z(i, e.tool.sanitizeConfig);
      o3 = Bo(s2, e.tool.conversionConfig);
    }
    o3 !== void 0 && (await e.mergeWith(o3), this.removeBlock(t), this.currentBlockIndex = this._blocks.indexOf(e));
  }
  /**
   * Remove passed Block
   *
   * @param block - Block to remove
   * @param addLastBlock - if true, adds new default block at the end. @todo remove this logic and use event-bus instead
   */
  removeBlock(e, t = true) {
    return new Promise((o3) => {
      const i = this._blocks.indexOf(e);
      if (!this.validateIndex(i))
        throw new Error("Can't find a Block to remove");
      this._blocks.remove(i), e.destroy(), this.blockDidMutated(_o, e, {
        index: i
      }), this.currentBlockIndex >= i && this.currentBlockIndex--, this.blocks.length ? i === 0 && (this.currentBlockIndex = 0) : (this.unsetCurrentBlock(), t && this.insert()), o3();
    });
  }
  /**
   * Remove only selected Blocks
   * and returns first Block index where started removing...
   *
   * @returns {number|undefined}
   */
  removeSelectedBlocks() {
    let e;
    for (let t = this.blocks.length - 1; t >= 0; t--)
      this.blocks[t].selected && (this.removeBlock(this.blocks[t]), e = t);
    return e;
  }
  /**
   * Attention!
   * After removing insert the new default typed Block and focus on it
   * Removes all blocks
   */
  removeAllBlocks() {
    for (let e = this.blocks.length - 1; e >= 0; e--)
      this._blocks.remove(e);
    this.unsetCurrentBlock(), this.insert(), this.currentBlock.firstInput.focus();
  }
  /**
   * Split current Block
   * 1. Extract content from Caret position to the Block`s end
   * 2. Insert a new Block below current one with extracted content
   *
   * @returns {Block}
   */
  split() {
    const e = this.Editor.Caret.extractFragmentFromCaretPosition(), t = u.make("div");
    t.appendChild(e);
    const o3 = {
      text: u.isEmpty(t) ? "" : t.innerHTML
    };
    return this.insert({ data: o3 });
  }
  /**
   * Returns Block by passed index
   *
   * @param {number} index - index to get. -1 to get last
   * @returns {Block}
   */
  getBlockByIndex(e) {
    return e === -1 && (e = this._blocks.length - 1), this._blocks[e];
  }
  /**
   * Returns an index for passed Block
   *
   * @param block - block to find index
   */
  getBlockIndex(e) {
    return this._blocks.indexOf(e);
  }
  /**
   * Returns the Block by passed id
   *
   * @param id - id of block to get
   * @returns {Block}
   */
  getBlockById(e) {
    return this._blocks.array.find((t) => t.id === e);
  }
  /**
   * Get Block instance by html element
   *
   * @param {Node} element - html element to get Block by
   */
  getBlock(e) {
    u.isElement(e) || (e = e.parentNode);
    const t = this._blocks.nodes, o3 = e.closest(`.${R.CSS.wrapper}`), i = t.indexOf(o3);
    if (i >= 0)
      return this._blocks[i];
  }
  /**
   * 1) Find first-level Block from passed child Node
   * 2) Mark it as current
   *
   * @param {Node} childNode - look ahead from this node.
   * @returns {Block | undefined} can return undefined in case when the passed child note is not a part of the current editor instance
   */
  setCurrentBlockByChildNode(e) {
    u.isElement(e) || (e = e.parentNode);
    const t = e.closest(`.${R.CSS.wrapper}`);
    if (!t)
      return;
    const o3 = t.closest(`.${this.Editor.UI.CSS.editorWrapper}`);
    if (o3 != null && o3.isEqualNode(this.Editor.UI.nodes.wrapper))
      return this.currentBlockIndex = this._blocks.nodes.indexOf(t), this.currentBlock.updateCurrentInput(), this.currentBlock;
  }
  /**
   * Return block which contents passed node
   *
   * @param {Node} childNode - node to get Block by
   * @returns {Block}
   */
  getBlockByChildNode(e) {
    if (!e || !(e instanceof Node))
      return;
    u.isElement(e) || (e = e.parentNode);
    const t = e.closest(`.${R.CSS.wrapper}`);
    return this.blocks.find((o3) => o3.holder === t);
  }
  /**
   * Swap Blocks Position
   *
   * @param {number} fromIndex - index of first block
   * @param {number} toIndex - index of second block
   * @deprecated — use 'move' instead
   */
  swap(e, t) {
    this._blocks.swap(e, t), this.currentBlockIndex = t;
  }
  /**
   * Move a block to a new index
   *
   * @param {number} toIndex - index where to move Block
   * @param {number} fromIndex - index of Block to move
   */
  move(e, t = this.currentBlockIndex) {
    if (isNaN(e) || isNaN(t)) {
      S("Warning during 'move' call: incorrect indices provided.", "warn");
      return;
    }
    if (!this.validateIndex(e) || !this.validateIndex(t)) {
      S("Warning during 'move' call: indices cannot be lower than 0 or greater than the amount of blocks.", "warn");
      return;
    }
    this._blocks.move(e, t), this.currentBlockIndex = e, this.blockDidMutated(ia, this.currentBlock, {
      fromIndex: t,
      toIndex: e
    });
  }
  /**
   * Converts passed Block to the new Tool
   * Uses Conversion Config
   *
   * @param blockToConvert - Block that should be converted
   * @param targetToolName - name of the Tool to convert to
   * @param blockDataOverrides - optional new Block data overrides
   */
  async convert(e, t, o3) {
    if (!await e.save())
      throw new Error("Could not convert Block. Failed to extract original Block data.");
    const s2 = this.Editor.Tools.blockTools.get(t);
    if (!s2)
      throw new Error(`Could not convert Block. Tool \xAB${t}\xBB not found.`);
    const r2 = await e.exportDataAsString(), a3 = Z(
      r2,
      s2.sanitizeConfig
    );
    let l2 = Bo(a3, s2.conversionConfig, s2.settings);
    return o3 && (l2 = Object.assign(l2, o3)), this.replace(e, s2.name, l2);
  }
  /**
   * Sets current Block Index -1 which means unknown
   * and clear highlights
   */
  unsetCurrentBlock() {
    this.currentBlockIndex = -1;
  }
  /**
   * Clears Editor
   *
   * @param {boolean} needToAddDefaultBlock - 1) in internal calls (for example, in api.blocks.render)
   *                                             we don't need to add an empty default block
   *                                        2) in api.blocks.clear we should add empty block
   */
  async clear(e = false) {
    const t = new sa();
    [...this.blocks].forEach((i) => {
      t.add(async () => {
        await this.removeBlock(i, false);
      });
    }), await t.completed, this.unsetCurrentBlock(), e && this.insert(), this.Editor.UI.checkEmptiness();
  }
  /**
   * Cleans up all the block tools' resources
   * This is called when editor is destroyed
   */
  async destroy() {
    await Promise.all(this.blocks.map((e) => e.destroy()));
  }
  /**
   * Bind Block events
   *
   * @param {Block} block - Block to which event should be bound
   */
  bindBlockEvents(e) {
    const { BlockEvents: t } = this.Editor;
    this.readOnlyMutableListeners.on(e.holder, "keydown", (o3) => {
      t.keydown(o3);
    }), this.readOnlyMutableListeners.on(e.holder, "keyup", (o3) => {
      t.keyup(o3);
    }), this.readOnlyMutableListeners.on(e.holder, "dragover", (o3) => {
      t.dragOver(o3);
    }), this.readOnlyMutableListeners.on(e.holder, "dragleave", (o3) => {
      t.dragLeave(o3);
    }), e.on("didMutated", (o3) => this.blockDidMutated(Ao, o3, {
      index: this.getBlockIndex(o3)
    }));
  }
  /**
   * Disable mutable handlers and bindings
   */
  disableModuleBindings() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Enables all module handlers and bindings for all Blocks
   */
  enableModuleBindings() {
    this.readOnlyMutableListeners.on(
      document,
      "cut",
      (e) => this.Editor.BlockEvents.handleCommandX(e)
    ), this.blocks.forEach((e) => {
      this.bindBlockEvents(e);
    });
  }
  /**
   * Validates that the given index is not lower than 0 or higher than the amount of blocks
   *
   * @param {number} index - index of blocks array to validate
   * @returns {boolean}
   */
  validateIndex(e) {
    return !(e < 0 || e >= this._blocks.length);
  }
  /**
   * Block mutation callback
   *
   * @param mutationType - what happened with block
   * @param block - mutated block
   * @param detailData - additional data to pass with change event
   */
  blockDidMutated(e, t, o3) {
    const i = new CustomEvent(e, {
      detail: {
        target: new J(t),
        ...o3
      }
    });
    return this.eventsDispatcher.emit($o, {
      event: i
    }), t;
  }
};
var aa = class extends E {
  constructor() {
    super(...arguments), this.anyBlockSelectedCache = null, this.needToSelectAll = false, this.nativeInputSelected = false, this.readyToBlockSelection = false;
  }
  /**
   * Sanitizer Config
   *
   * @returns {SanitizerConfig}
   */
  get sanitizerConfig() {
    return {
      p: {},
      h1: {},
      h2: {},
      h3: {},
      h4: {},
      h5: {},
      h6: {},
      ol: {},
      ul: {},
      li: {},
      br: true,
      img: {
        src: true,
        width: true,
        height: true
      },
      a: {
        href: true
      },
      b: {},
      i: {},
      u: {}
    };
  }
  /**
   * Flag that identifies all Blocks selection
   *
   * @returns {boolean}
   */
  get allBlocksSelected() {
    const { BlockManager: e } = this.Editor;
    return e.blocks.every((t) => t.selected === true);
  }
  /**
   * Set selected all blocks
   *
   * @param {boolean} state - state to set
   */
  set allBlocksSelected(e) {
    const { BlockManager: t } = this.Editor;
    t.blocks.forEach((o3) => {
      o3.selected = e;
    }), this.clearCache();
  }
  /**
   * Flag that identifies any Block selection
   *
   * @returns {boolean}
   */
  get anyBlockSelected() {
    const { BlockManager: e } = this.Editor;
    return this.anyBlockSelectedCache === null && (this.anyBlockSelectedCache = e.blocks.some((t) => t.selected === true)), this.anyBlockSelectedCache;
  }
  /**
   * Return selected Blocks array
   *
   * @returns {Block[]}
   */
  get selectedBlocks() {
    return this.Editor.BlockManager.blocks.filter((e) => e.selected);
  }
  /**
   * Module Preparation
   * Registers Shortcuts CMD+A and CMD+C
   * to select all and copy them
   */
  prepare() {
    this.selection = new b(), ge.add({
      name: "CMD+A",
      handler: (e) => {
        const { BlockManager: t, ReadOnly: o3 } = this.Editor;
        if (o3.isEnabled) {
          e.preventDefault(), this.selectAllBlocks();
          return;
        }
        t.currentBlock && this.handleCommandA(e);
      },
      on: this.Editor.UI.nodes.redactor
    });
  }
  /**
   * Toggle read-only state
   *
   *  - Remove all ranges
   *  - Unselect all Blocks
   */
  toggleReadOnly() {
    b.get().removeAllRanges(), this.allBlocksSelected = false;
  }
  /**
   * Remove selection of Block
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  unSelectBlockByIndex(e) {
    const { BlockManager: t } = this.Editor;
    let o3;
    isNaN(e) ? o3 = t.currentBlock : o3 = t.getBlockByIndex(e), o3.selected = false, this.clearCache();
  }
  /**
   * Clear selection from Blocks
   *
   * @param {Event} reason - event caused clear of selection
   * @param {boolean} restoreSelection - if true, restore saved selection
   */
  clearSelection(e, t = false) {
    const { BlockManager: o3, Caret: i, RectangleSelection: s2 } = this.Editor;
    this.needToSelectAll = false, this.nativeInputSelected = false, this.readyToBlockSelection = false;
    const r2 = e && e instanceof KeyboardEvent, a3 = r2 && Po(e.keyCode);
    if (this.anyBlockSelected && r2 && a3 && !b.isSelectionExists) {
      const l2 = o3.removeSelectedBlocks();
      o3.insertDefaultBlockAtIndex(l2, true), i.setToBlock(o3.currentBlock), Fe(() => {
        const c5 = e.key;
        i.insertContentAtCaretPosition(c5.length > 1 ? "" : c5);
      }, 20)();
    }
    if (this.Editor.CrossBlockSelection.clear(e), !this.anyBlockSelected || s2.isRectActivated()) {
      this.Editor.RectangleSelection.clearSelection();
      return;
    }
    t && this.selection.restore(), this.allBlocksSelected = false;
  }
  /**
   * Reduce each Block and copy its content
   *
   * @param {ClipboardEvent} e - copy/cut event
   * @returns {Promise<void>}
   */
  copySelectedBlocks(e) {
    e.preventDefault();
    const t = u.make("div");
    this.selectedBlocks.forEach((s2) => {
      const r2 = Z(s2.holder.innerHTML, this.sanitizerConfig), a3 = u.make("p");
      a3.innerHTML = r2, t.appendChild(a3);
    });
    const o3 = Array.from(t.childNodes).map((s2) => s2.textContent).join(`

`), i = t.innerHTML;
    return e.clipboardData.setData("text/plain", o3), e.clipboardData.setData("text/html", i), Promise.all(this.selectedBlocks.map((s2) => s2.save())).then((s2) => {
      try {
        e.clipboardData.setData(this.Editor.Paste.MIME_TYPE, JSON.stringify(s2));
      } catch {
      }
    });
  }
  /**
   * Select Block by its index
   *
   * @param {number?} index - Block index according to the BlockManager's indexes
   */
  selectBlockByIndex(e) {
    const { BlockManager: t } = this.Editor, o3 = t.getBlockByIndex(e);
    o3 !== void 0 && this.selectBlock(o3);
  }
  /**
   * Select passed Block
   *
   * @param {Block} block - Block to select
   */
  selectBlock(e) {
    this.selection.save(), b.get().removeAllRanges(), e.selected = true, this.clearCache(), this.Editor.InlineToolbar.close();
  }
  /**
   * Remove selection from passed Block
   *
   * @param {Block} block - Block to unselect
   */
  unselectBlock(e) {
    e.selected = false, this.clearCache();
  }
  /**
   * Clear anyBlockSelected cache
   */
  clearCache() {
    this.anyBlockSelectedCache = null;
  }
  /**
   * Module destruction
   * De-registers Shortcut CMD+A
   */
  destroy() {
    ge.remove(this.Editor.UI.nodes.redactor, "CMD+A");
  }
  /**
   * First CMD+A selects all input content by native behaviour,
   * next CMD+A keypress selects all blocks
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  handleCommandA(e) {
    if (this.Editor.RectangleSelection.clearSelection(), u.isNativeInput(e.target) && !this.readyToBlockSelection) {
      this.readyToBlockSelection = true;
      return;
    }
    const t = this.Editor.BlockManager.getBlock(e.target), o3 = t.inputs;
    if (o3.length > 1 && !this.readyToBlockSelection) {
      this.readyToBlockSelection = true;
      return;
    }
    if (o3.length === 1 && !this.needToSelectAll) {
      this.needToSelectAll = true;
      return;
    }
    this.needToSelectAll ? (e.preventDefault(), this.selectAllBlocks(), this.needToSelectAll = false, this.readyToBlockSelection = false) : this.readyToBlockSelection && (e.preventDefault(), this.selectBlock(t), this.needToSelectAll = true);
  }
  /**
   * Select All Blocks
   * Each Block has selected setter that makes Block copyable
   */
  selectAllBlocks() {
    this.selection.save(), b.get().removeAllRanges(), this.allBlocksSelected = true, this.Editor.InlineToolbar.close();
  }
};
var Ye = class extends E {
  /**
   * Allowed caret positions in input
   *
   * @static
   * @returns {{START: string, END: string, DEFAULT: string}}
   */
  get positions() {
    return {
      START: "start",
      END: "end",
      DEFAULT: "default"
    };
  }
  /**
   * Elements styles that can be useful for Caret Module
   */
  static get CSS() {
    return {
      shadowCaret: "cdx-shadow-caret"
    };
  }
  /**
   * Method gets Block instance and puts caret to the text node with offset
   * There two ways that method applies caret position:
   *   - first found text node: sets at the beginning, but you can pass an offset
   *   - last found text node: sets at the end of the node. Also, you can customize the behaviour
   *
   * @param {Block} block - Block class
   * @param {string} position - position where to set caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the block content
   */
  setToBlock(e, t = this.positions.DEFAULT, o3 = 0) {
    var c5;
    const { BlockManager: i, BlockSelection: s2 } = this.Editor;
    if (s2.clearSelection(), !e.focusable) {
      (c5 = window.getSelection()) == null || c5.removeAllRanges(), s2.selectBlock(e), i.currentBlock = e;
      return;
    }
    let r2;
    switch (t) {
      case this.positions.START:
        r2 = e.firstInput;
        break;
      case this.positions.END:
        r2 = e.lastInput;
        break;
      default:
        r2 = e.currentInput;
    }
    if (!r2)
      return;
    let a3, l2 = o3;
    if (t === this.positions.START)
      a3 = u.getDeepestNode(r2, false), l2 = 0;
    else if (t === this.positions.END)
      a3 = u.getDeepestNode(r2, true), l2 = u.getContentLength(a3);
    else {
      const { node: d3, offset: h3 } = u.getNodeByOffset(r2, o3);
      d3 ? (a3 = d3, l2 = h3) : (a3 = u.getDeepestNode(r2, false), l2 = 0);
    }
    this.set(a3, l2), i.setCurrentBlockByChildNode(e.holder), i.currentBlock.currentInput = r2;
  }
  /**
   * Set caret to the current input of current Block.
   *
   * @param {HTMLElement} input - input where caret should be set
   * @param {string} position - position of the caret.
   *                            If default - leave default behaviour and apply offset if it's passed
   * @param {number} offset - caret offset regarding to the text node
   */
  setToInput(e, t = this.positions.DEFAULT, o3 = 0) {
    const { currentBlock: i } = this.Editor.BlockManager, s2 = u.getDeepestNode(e);
    switch (t) {
      case this.positions.START:
        this.set(s2, 0);
        break;
      case this.positions.END:
        this.set(s2, u.getContentLength(s2));
        break;
      default:
        o3 && this.set(s2, o3);
    }
    i.currentInput = e;
  }
  /**
   * Creates Document Range and sets caret to the element with offset
   *
   * @param {HTMLElement} element - target node.
   * @param {number} offset - offset
   */
  set(e, t = 0) {
    const { top: i, bottom: s2 } = b.setCursor(e, t), { innerHeight: r2 } = window;
    i < 0 ? window.scrollBy(0, i - 30) : s2 > r2 && window.scrollBy(0, s2 - r2 + 30);
  }
  /**
   * Set Caret to the last Block
   * If last block is not empty, append another empty block
   */
  setToTheLastBlock() {
    const e = this.Editor.BlockManager.lastBlock;
    if (e)
      if (e.tool.isDefault && e.isEmpty)
        this.setToBlock(e);
      else {
        const t = this.Editor.BlockManager.insertAtEnd();
        this.setToBlock(t);
      }
  }
  /**
   * Extract content fragment of current Block from Caret position to the end of the Block
   */
  extractFragmentFromCaretPosition() {
    const e = b.get();
    if (e.rangeCount) {
      const t = e.getRangeAt(0), o3 = this.Editor.BlockManager.currentBlock.currentInput;
      if (t.deleteContents(), o3)
        if (u.isNativeInput(o3)) {
          const i = o3, s2 = document.createDocumentFragment(), r2 = i.value.substring(0, i.selectionStart), a3 = i.value.substring(i.selectionStart);
          return s2.textContent = a3, i.value = r2, s2;
        } else {
          const i = t.cloneRange();
          return i.selectNodeContents(o3), i.setStart(t.endContainer, t.endOffset), i.extractContents();
        }
    }
  }
  /**
   * Set's caret to the next Block or Tool`s input
   * Before moving caret, we should check if caret position is at the end of Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {boolean} force - pass true to skip check for caret position
   */
  navigateNext(e = false) {
    const { BlockManager: t } = this.Editor, { currentBlock: o3, nextBlock: i } = t;
    if (o3 === void 0)
      return false;
    const { nextInput: s2, currentInput: r2 } = o3, a3 = r2 !== void 0 ? Re(r2) : void 0;
    let l2 = i;
    const c5 = e || a3 || !o3.focusable;
    if (s2 && c5)
      return this.setToInput(s2, this.positions.START), true;
    if (l2 === null) {
      if (o3.tool.isDefault || !c5)
        return false;
      l2 = t.insertAtEnd();
    }
    return c5 ? (this.setToBlock(l2, this.positions.START), true) : false;
  }
  /**
   * Set's caret to the previous Tool`s input or Block
   * Before moving caret, we should check if caret position is start of the Plugins node
   * Using {@link Dom#getDeepestNode} to get a last node and match with current selection
   *
   * @param {boolean} force - pass true to skip check for caret position
   */
  navigatePrevious(e = false) {
    const { currentBlock: t, previousBlock: o3 } = this.Editor.BlockManager;
    if (!t)
      return false;
    const { previousInput: i, currentInput: s2 } = t, r2 = s2 !== void 0 ? Ne(s2) : void 0, a3 = e || r2 || !t.focusable;
    return i && a3 ? (this.setToInput(i, this.positions.END), true) : o3 !== null && a3 ? (this.setToBlock(o3, this.positions.END), true) : false;
  }
  /**
   * Inserts shadow element after passed element where caret can be placed
   *
   * @param {Element} element - element after which shadow caret should be inserted
   */
  createShadow(e) {
    const t = document.createElement("span");
    t.classList.add(Ye.CSS.shadowCaret), e.insertAdjacentElement("beforeend", t);
  }
  /**
   * Restores caret position
   *
   * @param {HTMLElement} element - element where caret should be restored
   */
  restoreCaret(e) {
    const t = e.querySelector(`.${Ye.CSS.shadowCaret}`);
    if (!t)
      return;
    new b().expandToTag(t);
    const i = document.createRange();
    i.selectNode(t), i.extractContents();
  }
  /**
   * Inserts passed content at caret position
   *
   * @param {string} content - content to insert
   */
  insertContentAtCaretPosition(e) {
    const t = document.createDocumentFragment(), o3 = document.createElement("div"), i = b.get(), s2 = b.range;
    o3.innerHTML = e, Array.from(o3.childNodes).forEach((c5) => t.appendChild(c5)), t.childNodes.length === 0 && t.appendChild(new Text());
    const r2 = t.lastChild;
    s2.deleteContents(), s2.insertNode(t);
    const a3 = document.createRange(), l2 = r2.nodeType === Node.TEXT_NODE ? r2 : r2.firstChild;
    l2 !== null && l2.textContent !== null && a3.setStart(l2, l2.textContent.length), i.removeAllRanges(), i.addRange(a3);
  }
};
var la = class extends E {
  constructor() {
    super(...arguments), this.onMouseUp = () => {
      this.listeners.off(document, "mouseover", this.onMouseOver), this.listeners.off(document, "mouseup", this.onMouseUp);
    }, this.onMouseOver = (e) => {
      const { BlockManager: t, BlockSelection: o3 } = this.Editor;
      if (e.relatedTarget === null && e.target === null)
        return;
      const i = t.getBlockByChildNode(e.relatedTarget) || this.lastSelectedBlock, s2 = t.getBlockByChildNode(e.target);
      if (!(!i || !s2) && s2 !== i) {
        if (i === this.firstSelectedBlock) {
          b.get().removeAllRanges(), i.selected = true, s2.selected = true, o3.clearCache();
          return;
        }
        if (s2 === this.firstSelectedBlock) {
          i.selected = false, s2.selected = false, o3.clearCache();
          return;
        }
        this.Editor.InlineToolbar.close(), this.toggleBlocksSelectedState(i, s2), this.lastSelectedBlock = s2;
      }
    };
  }
  /**
   * Module preparation
   *
   * @returns {Promise}
   */
  async prepare() {
    this.listeners.on(document, "mousedown", (e) => {
      this.enableCrossBlockSelection(e);
    });
  }
  /**
   * Sets up listeners
   *
   * @param {MouseEvent} event - mouse down event
   */
  watchSelection(e) {
    if (e.button !== qn.LEFT)
      return;
    const { BlockManager: t } = this.Editor;
    this.firstSelectedBlock = t.getBlock(e.target), this.lastSelectedBlock = this.firstSelectedBlock, this.listeners.on(document, "mouseover", this.onMouseOver), this.listeners.on(document, "mouseup", this.onMouseUp);
  }
  /**
   * Return boolean is cross block selection started:
   * there should be at least 2 selected blocks
   */
  get isCrossBlockSelectionStarted() {
    return !!this.firstSelectedBlock && !!this.lastSelectedBlock && this.firstSelectedBlock !== this.lastSelectedBlock;
  }
  /**
   * Change selection state of the next Block
   * Used for CBS via Shift + arrow keys
   *
   * @param {boolean} next - if true, toggle next block. Previous otherwise
   */
  toggleBlockSelectedState(e = true) {
    const { BlockManager: t, BlockSelection: o3 } = this.Editor;
    this.lastSelectedBlock || (this.lastSelectedBlock = this.firstSelectedBlock = t.currentBlock), this.firstSelectedBlock === this.lastSelectedBlock && (this.firstSelectedBlock.selected = true, o3.clearCache(), b.get().removeAllRanges());
    const i = t.blocks.indexOf(this.lastSelectedBlock) + (e ? 1 : -1), s2 = t.blocks[i];
    s2 && (this.lastSelectedBlock.selected !== s2.selected ? (s2.selected = true, o3.clearCache()) : (this.lastSelectedBlock.selected = false, o3.clearCache()), this.lastSelectedBlock = s2, this.Editor.InlineToolbar.close(), s2.holder.scrollIntoView({
      block: "nearest"
    }));
  }
  /**
   * Clear saved state
   *
   * @param {Event} reason - event caused clear of selection
   */
  clear(e) {
    const { BlockManager: t, BlockSelection: o3, Caret: i } = this.Editor, s2 = t.blocks.indexOf(this.firstSelectedBlock), r2 = t.blocks.indexOf(this.lastSelectedBlock);
    if (o3.anyBlockSelected && s2 > -1 && r2 > -1 && e && e instanceof KeyboardEvent)
      switch (e.keyCode) {
        case y.DOWN:
        case y.RIGHT:
          i.setToBlock(t.blocks[Math.max(s2, r2)], i.positions.END);
          break;
        case y.UP:
        case y.LEFT:
          i.setToBlock(t.blocks[Math.min(s2, r2)], i.positions.START);
          break;
        default:
          i.setToBlock(t.blocks[Math.max(s2, r2)], i.positions.END);
      }
    this.firstSelectedBlock = this.lastSelectedBlock = null;
  }
  /**
   * Enables Cross Block Selection
   *
   * @param {MouseEvent} event - mouse down event
   */
  enableCrossBlockSelection(e) {
    const { UI: t } = this.Editor;
    b.isCollapsed || this.Editor.BlockSelection.clearSelection(e), t.nodes.redactor.contains(e.target) ? this.watchSelection(e) : this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * Change blocks selection state between passed two blocks.
   *
   * @param {Block} firstBlock - first block in range
   * @param {Block} lastBlock - last block in range
   */
  toggleBlocksSelectedState(e, t) {
    const { BlockManager: o3, BlockSelection: i } = this.Editor, s2 = o3.blocks.indexOf(e), r2 = o3.blocks.indexOf(t), a3 = e.selected !== t.selected;
    for (let l2 = Math.min(s2, r2); l2 <= Math.max(s2, r2); l2++) {
      const c5 = o3.blocks[l2];
      c5 !== this.firstSelectedBlock && c5 !== (a3 ? e : t) && (o3.blocks[l2].selected = !o3.blocks[l2].selected, i.clearCache());
    }
  }
};
var ca = class extends E {
  constructor() {
    super(...arguments), this.isStartedAtEditor = false;
  }
  /**
   * Toggle read-only state
   *
   * if state is true:
   *  - disable all drag-n-drop event handlers
   *
   * if state is false:
   *  - restore drag-n-drop event handlers
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  toggleReadOnly(e) {
    e ? this.disableModuleBindings() : this.enableModuleBindings();
  }
  /**
   * Add drag events listeners to editor zone
   */
  enableModuleBindings() {
    const { UI: e } = this.Editor;
    this.readOnlyMutableListeners.on(e.nodes.holder, "drop", async (t) => {
      await this.processDrop(t);
    }, true), this.readOnlyMutableListeners.on(e.nodes.holder, "dragstart", () => {
      this.processDragStart();
    }), this.readOnlyMutableListeners.on(e.nodes.holder, "dragover", (t) => {
      this.processDragOver(t);
    }, true);
  }
  /**
   * Unbind drag-n-drop event handlers
   */
  disableModuleBindings() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Handle drop event
   *
   * @param {DragEvent} dropEvent - drop event
   */
  async processDrop(e) {
    const {
      BlockManager: t,
      Paste: o3,
      Caret: i
    } = this.Editor;
    e.preventDefault(), t.blocks.forEach((r2) => {
      r2.dropTarget = false;
    }), b.isAtEditor && !b.isCollapsed && this.isStartedAtEditor && document.execCommand("delete"), this.isStartedAtEditor = false;
    const s2 = t.setCurrentBlockByChildNode(e.target);
    if (s2)
      this.Editor.Caret.setToBlock(s2, i.positions.END);
    else {
      const r2 = t.setCurrentBlockByChildNode(t.lastBlock.holder);
      this.Editor.Caret.setToBlock(r2, i.positions.END);
    }
    await o3.processDataTransfer(e.dataTransfer, true);
  }
  /**
   * Handle drag start event
   */
  processDragStart() {
    b.isAtEditor && !b.isCollapsed && (this.isStartedAtEditor = true), this.Editor.InlineToolbar.close();
  }
  /**
   * @param {DragEvent} dragEvent - drag event
   */
  processDragOver(e) {
    e.preventDefault();
  }
};
var da = 180;
var ua = 400;
var ha = class extends E {
  /**
   * Prepare the module
   *
   * @param options - options used by the modification observer module
   * @param options.config - Editor configuration object
   * @param options.eventsDispatcher - common Editor event bus
   */
  constructor({ config: e, eventsDispatcher: t }) {
    super({
      config: e,
      eventsDispatcher: t
    }), this.disabled = false, this.batchingTimeout = null, this.batchingOnChangeQueue = /* @__PURE__ */ new Map(), this.batchTime = ua, this.mutationObserver = new MutationObserver((o3) => {
      this.redactorChanged(o3);
    }), this.eventsDispatcher.on($o, (o3) => {
      this.particularBlockChanged(o3.event);
    }), this.eventsDispatcher.on(zo, () => {
      this.disable();
    }), this.eventsDispatcher.on(Uo, () => {
      this.enable();
    });
  }
  /**
   * Enables onChange event
   */
  enable() {
    this.mutationObserver.observe(
      this.Editor.UI.nodes.redactor,
      {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
      }
    ), this.disabled = false;
  }
  /**
   * Disables onChange event
   */
  disable() {
    this.mutationObserver.disconnect(), this.disabled = true;
  }
  /**
   * Call onChange event passed to Editor.js configuration
   *
   * @param event - some of our custom change events
   */
  particularBlockChanged(e) {
    this.disabled || !A(this.config.onChange) || (this.batchingOnChangeQueue.set(`block:${e.detail.target.id}:event:${e.type}`, e), this.batchingTimeout && clearTimeout(this.batchingTimeout), this.batchingTimeout = setTimeout(() => {
      let t;
      this.batchingOnChangeQueue.size === 1 ? t = this.batchingOnChangeQueue.values().next().value : t = Array.from(this.batchingOnChangeQueue.values()), this.config.onChange && this.config.onChange(this.Editor.API.methods, t), this.batchingOnChangeQueue.clear();
    }, this.batchTime));
  }
  /**
   * Fired on every blocks wrapper dom change
   *
   * @param mutations - mutations happened
   */
  redactorChanged(e) {
    this.eventsDispatcher.emit(ft, {
      mutations: e
    });
  }
};
var Rn = class Dn extends E {
  constructor() {
    super(...arguments), this.MIME_TYPE = "application/x-editor-js", this.toolsTags = {}, this.tagsByTool = {}, this.toolsPatterns = [], this.toolsFiles = {}, this.exceptionList = [], this.processTool = (e) => {
      try {
        const t = e.create({}, {}, false);
        if (e.pasteConfig === false) {
          this.exceptionList.push(e.name);
          return;
        }
        if (!A(t.onPaste))
          return;
        this.getTagsConfig(e), this.getFilesConfig(e), this.getPatternsConfig(e);
      } catch (t) {
        S(
          `Paste handling for \xAB${e.name}\xBB Tool hasn't been set up because of the error`,
          "warn",
          t
        );
      }
    }, this.handlePasteEvent = async (e) => {
      const { BlockManager: t, Toolbar: o3 } = this.Editor, i = t.setCurrentBlockByChildNode(e.target);
      !i || this.isNativeBehaviour(e.target) && !e.clipboardData.types.includes("Files") || i && this.exceptionList.includes(i.name) || (e.preventDefault(), this.processDataTransfer(e.clipboardData), o3.close());
    };
  }
  /**
   * Set onPaste callback and collect tools` paste configurations
   */
  async prepare() {
    this.processTools();
  }
  /**
   * Set read-only state
   *
   * @param {boolean} readOnlyEnabled - read only flag value
   */
  toggleReadOnly(e) {
    e ? this.unsetCallback() : this.setCallback();
  }
  /**
   * Handle pasted or dropped data transfer object
   *
   * @param {DataTransfer} dataTransfer - pasted or dropped data transfer object
   * @param {boolean} isDragNDrop - true if data transfer comes from drag'n'drop events
   */
  async processDataTransfer(e, t = false) {
    const { Tools: o3 } = this.Editor, i = e.types;
    if ((i.includes ? i.includes("Files") : i.contains("Files")) && !V(this.toolsFiles)) {
      await this.processFiles(e.files);
      return;
    }
    const r2 = e.getData(this.MIME_TYPE), a3 = e.getData("text/plain");
    let l2 = e.getData("text/html");
    if (r2)
      try {
        this.insertEditorJSData(JSON.parse(r2));
        return;
      } catch {
      }
    t && a3.trim() && l2.trim() && (l2 = "<p>" + (l2.trim() ? l2 : a3) + "</p>");
    const c5 = Object.keys(this.toolsTags).reduce((p4, g6) => (p4[g6.toLowerCase()] = this.toolsTags[g6].sanitizationConfig ?? {}, p4), {}), d3 = Object.assign({}, c5, o3.getAllInlineToolsSanitizeConfig(), { br: {} }), h3 = Z(l2, d3);
    !h3.trim() || h3.trim() === a3 || !u.isHTMLString(h3) ? await this.processText(a3) : await this.processText(h3, true);
  }
  /**
   * Process pasted text and divide them into Blocks
   *
   * @param {string} data - text to process. Can be HTML or plain.
   * @param {boolean} isHTML - if passed string is HTML, this parameter should be true
   */
  async processText(e, t = false) {
    const { Caret: o3, BlockManager: i } = this.Editor, s2 = t ? this.processHTML(e) : this.processPlain(e);
    if (!s2.length)
      return;
    if (s2.length === 1) {
      s2[0].isBlock ? this.processSingleBlock(s2.pop()) : this.processInlinePaste(s2.pop());
      return;
    }
    const a3 = i.currentBlock && i.currentBlock.tool.isDefault && i.currentBlock.isEmpty;
    s2.map(
      async (l2, c5) => this.insertBlock(l2, c5 === 0 && a3)
    ), i.currentBlock && o3.setToBlock(i.currentBlock, o3.positions.END);
  }
  /**
   * Set onPaste callback handler
   */
  setCallback() {
    this.listeners.on(this.Editor.UI.nodes.holder, "paste", this.handlePasteEvent);
  }
  /**
   * Unset onPaste callback handler
   */
  unsetCallback() {
    this.listeners.off(this.Editor.UI.nodes.holder, "paste", this.handlePasteEvent);
  }
  /**
   * Get and process tool`s paste configs
   */
  processTools() {
    const e = this.Editor.Tools.blockTools;
    Array.from(e.values()).forEach(this.processTool);
  }
  /**
   * Get tags name list from either tag name or sanitization config.
   *
   * @param {string | object} tagOrSanitizeConfig - tag name or sanitize config object.
   * @returns {string[]} array of tags.
   */
  collectTagNames(e) {
    return te(e) ? [e] : D(e) ? Object.keys(e) : [];
  }
  /**
   * Get tags to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getTagsConfig(e) {
    if (e.pasteConfig === false)
      return;
    const t = e.pasteConfig.tags || [], o3 = [];
    t.forEach((i) => {
      const s2 = this.collectTagNames(i);
      o3.push(...s2), s2.forEach((r2) => {
        if (Object.prototype.hasOwnProperty.call(this.toolsTags, r2)) {
          S(
            `Paste handler for \xAB${e.name}\xBB Tool on \xAB${r2}\xBB tag is skipped because it is already used by \xAB${this.toolsTags[r2].tool.name}\xBB Tool.`,
            "warn"
          );
          return;
        }
        const a3 = D(i) ? i[r2] : null;
        this.toolsTags[r2.toUpperCase()] = {
          tool: e,
          sanitizationConfig: a3
        };
      });
    }), this.tagsByTool[e.name] = o3.map((i) => i.toUpperCase());
  }
  /**
   * Get files` types and extensions to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getFilesConfig(e) {
    if (e.pasteConfig === false)
      return;
    const { files: t = {} } = e.pasteConfig;
    let { extensions: o3, mimeTypes: i } = t;
    !o3 && !i || (o3 && !Array.isArray(o3) && (S(`\xABextensions\xBB property of the onDrop config for \xAB${e.name}\xBB Tool should be an array`), o3 = []), i && !Array.isArray(i) && (S(`\xABmimeTypes\xBB property of the onDrop config for \xAB${e.name}\xBB Tool should be an array`), i = []), i && (i = i.filter((s2) => ei(s2) ? true : (S(`MIME type value \xAB${s2}\xBB for the \xAB${e.name}\xBB Tool is not a valid MIME type`, "warn"), false))), this.toolsFiles[e.name] = {
      extensions: o3 || [],
      mimeTypes: i || []
    });
  }
  /**
   * Get RegExp patterns to substitute by Tool
   *
   * @param tool - BlockTool object
   */
  getPatternsConfig(e) {
    e.pasteConfig === false || !e.pasteConfig.patterns || V(e.pasteConfig.patterns) || Object.entries(e.pasteConfig.patterns).forEach(([t, o3]) => {
      o3 instanceof RegExp || S(
        `Pattern ${o3} for \xAB${e.name}\xBB Tool is skipped because it should be a Regexp instance.`,
        "warn"
      ), this.toolsPatterns.push({
        key: t,
        pattern: o3,
        tool: e
      });
    });
  }
  /**
   * Check if browser behavior suits better
   *
   * @param {EventTarget} element - element where content has been pasted
   * @returns {boolean}
   */
  isNativeBehaviour(e) {
    return u.isNativeInput(e);
  }
  /**
   * Get files from data transfer object and insert related Tools
   *
   * @param {FileList} items - pasted or dropped items
   */
  async processFiles(e) {
    const { BlockManager: t } = this.Editor;
    let o3;
    o3 = await Promise.all(
      Array.from(e).map((r2) => this.processFile(r2))
    ), o3 = o3.filter((r2) => !!r2);
    const s2 = t.currentBlock.tool.isDefault && t.currentBlock.isEmpty;
    o3.forEach(
      (r2, a3) => {
        t.paste(r2.type, r2.event, a3 === 0 && s2);
      }
    );
  }
  /**
   * Get information about file and find Tool to handle it
   *
   * @param {File} file - file to process
   */
  async processFile(e) {
    const t = Jn(e), o3 = Object.entries(this.toolsFiles).find(([r2, { mimeTypes: a3, extensions: l2 }]) => {
      const [c5, d3] = e.type.split("/"), h3 = l2.find((g6) => g6.toLowerCase() === t.toLowerCase()), p4 = a3.find((g6) => {
        const [f4, v4] = g6.split("/");
        return f4 === c5 && (v4 === d3 || v4 === "*");
      });
      return !!h3 || !!p4;
    });
    if (!o3)
      return;
    const [i] = o3;
    return {
      event: this.composePasteEvent("file", {
        file: e
      }),
      type: i
    };
  }
  /**
   * Split HTML string to blocks and return it as array of Block data
   *
   * @param {string} innerHTML - html string to process
   * @returns {PasteData[]}
   */
  processHTML(e) {
    const { Tools: t } = this.Editor, o3 = u.make("DIV");
    return o3.innerHTML = e, this.getNodes(o3).map((s2) => {
      let r2, a3 = t.defaultTool, l2 = false;
      switch (s2.nodeType) {
        case Node.DOCUMENT_FRAGMENT_NODE:
          r2 = u.make("div"), r2.appendChild(s2);
          break;
        case Node.ELEMENT_NODE:
          r2 = s2, l2 = true, this.toolsTags[r2.tagName] && (a3 = this.toolsTags[r2.tagName].tool);
          break;
      }
      const { tags: c5 } = a3.pasteConfig || { tags: [] }, d3 = c5.reduce((g6, f4) => (this.collectTagNames(f4).forEach((O3) => {
        const T3 = D(f4) ? f4[O3] : null;
        g6[O3.toLowerCase()] = T3 || {};
      }), g6), {}), h3 = Object.assign({}, d3, a3.baseSanitizeConfig);
      if (r2.tagName.toLowerCase() === "table") {
        const g6 = Z(r2.outerHTML, h3);
        r2 = u.make("div", void 0, {
          innerHTML: g6
        }).firstChild;
      } else
        r2.innerHTML = Z(r2.innerHTML, h3);
      const p4 = this.composePasteEvent("tag", {
        data: r2
      });
      return {
        content: r2,
        isBlock: l2,
        tool: a3.name,
        event: p4
      };
    }).filter((s2) => {
      const r2 = u.isEmpty(s2.content), a3 = u.isSingleTag(s2.content);
      return !r2 || a3;
    });
  }
  /**
   * Split plain text by new line symbols and return it as array of Block data
   *
   * @param {string} plain - string to process
   * @returns {PasteData[]}
   */
  processPlain(e) {
    const { defaultBlock: t } = this.config;
    if (!e)
      return [];
    const o3 = t;
    return e.split(/\r?\n/).filter((i) => i.trim()).map((i) => {
      const s2 = u.make("div");
      s2.textContent = i;
      const r2 = this.composePasteEvent("tag", {
        data: s2
      });
      return {
        content: s2,
        tool: o3,
        isBlock: false,
        event: r2
      };
    });
  }
  /**
   * Process paste of single Block tool content
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  async processSingleBlock(e) {
    const { Caret: t, BlockManager: o3 } = this.Editor, { currentBlock: i } = o3;
    if (!i || e.tool !== i.name || !u.containsOnlyInlineElements(e.content.innerHTML)) {
      this.insertBlock(e, (i == null ? void 0 : i.tool.isDefault) && i.isEmpty);
      return;
    }
    t.insertContentAtCaretPosition(e.content.innerHTML);
  }
  /**
   * Process paste to single Block:
   * 1. Find patterns` matches
   * 2. Insert new block if it is not the same type as current one
   * 3. Just insert text if there is no substitutions
   *
   * @param {PasteData} dataToInsert - data of Block to insert
   */
  async processInlinePaste(e) {
    const { BlockManager: t, Caret: o3 } = this.Editor, { content: i } = e;
    if (t.currentBlock && t.currentBlock.tool.isDefault && i.textContent.length < Dn.PATTERN_PROCESSING_MAX_LENGTH) {
      const r2 = await this.processPattern(i.textContent);
      if (r2) {
        const a3 = t.currentBlock && t.currentBlock.tool.isDefault && t.currentBlock.isEmpty, l2 = t.paste(r2.tool, r2.event, a3);
        o3.setToBlock(l2, o3.positions.END);
        return;
      }
    }
    if (t.currentBlock && t.currentBlock.currentInput) {
      const r2 = t.currentBlock.tool.baseSanitizeConfig;
      document.execCommand(
        "insertHTML",
        false,
        Z(i.innerHTML, r2)
      );
    } else
      this.insertBlock(e);
  }
  /**
   * Get patterns` matches
   *
   * @param {string} text - text to process
   * @returns {Promise<{event: PasteEvent, tool: string}>}
   */
  async processPattern(e) {
    const t = this.toolsPatterns.find((i) => {
      const s2 = i.pattern.exec(e);
      return s2 ? e === s2.shift() : false;
    });
    return t ? {
      event: this.composePasteEvent("pattern", {
        key: t.key,
        data: e
      }),
      tool: t.tool.name
    } : void 0;
  }
  /**
   * Insert pasted Block content to Editor
   *
   * @param {PasteData} data - data to insert
   * @param {boolean} canReplaceCurrentBlock - if true and is current Block is empty, will replace current Block
   * @returns {void}
   */
  insertBlock(e, t = false) {
    const { BlockManager: o3, Caret: i } = this.Editor, { currentBlock: s2 } = o3;
    let r2;
    if (t && s2 && s2.isEmpty) {
      r2 = o3.paste(e.tool, e.event, true), i.setToBlock(r2, i.positions.END);
      return;
    }
    r2 = o3.paste(e.tool, e.event), i.setToBlock(r2, i.positions.END);
  }
  /**
   * Insert data passed as application/x-editor-js JSON
   *
   * @param {Array} blocks — Blocks' data to insert
   * @returns {void}
   */
  insertEditorJSData(e) {
    const { BlockManager: t, Caret: o3, Tools: i } = this.Editor;
    yt(
      e,
      (r2) => i.blockTools.get(r2).sanitizeConfig
    ).forEach(({ tool: r2, data: a3 }, l2) => {
      let c5 = false;
      l2 === 0 && (c5 = t.currentBlock && t.currentBlock.tool.isDefault && t.currentBlock.isEmpty);
      const d3 = t.insert({
        tool: r2,
        data: a3,
        replace: c5
      });
      o3.setToBlock(d3, o3.positions.END);
    });
  }
  /**
   * Fetch nodes from Element node
   *
   * @param {Node} node - current node
   * @param {Node[]} nodes - processed nodes
   * @param {Node} destNode - destination node
   */
  processElementNode(e, t, o3) {
    const i = Object.keys(this.toolsTags), s2 = e, { tool: r2 } = this.toolsTags[s2.tagName] || {}, a3 = this.tagsByTool[r2 == null ? void 0 : r2.name] || [], l2 = i.includes(s2.tagName), c5 = u.blockElements.includes(s2.tagName.toLowerCase()), d3 = Array.from(s2.children).some(
      ({ tagName: p4 }) => i.includes(p4) && !a3.includes(p4)
    ), h3 = Array.from(s2.children).some(
      ({ tagName: p4 }) => u.blockElements.includes(p4.toLowerCase())
    );
    if (!c5 && !l2 && !d3)
      return o3.appendChild(s2), [...t, o3];
    if (l2 && !d3 || c5 && !h3 && !d3)
      return [...t, o3, s2];
  }
  /**
   * Recursively divide HTML string to two types of nodes:
   * 1. Block element
   * 2. Document Fragments contained text and markup tags like a, b, i etc.
   *
   * @param {Node} wrapper - wrapper of paster HTML content
   * @returns {Node[]}
   */
  getNodes(e) {
    const t = Array.from(e.childNodes);
    let o3;
    const i = (s2, r2) => {
      if (u.isEmpty(r2) && !u.isSingleTag(r2))
        return s2;
      const a3 = s2[s2.length - 1];
      let l2 = new DocumentFragment();
      switch (a3 && u.isFragment(a3) && (l2 = s2.pop()), r2.nodeType) {
        case Node.ELEMENT_NODE:
          if (o3 = this.processElementNode(r2, s2, l2), o3)
            return o3;
          break;
        case Node.TEXT_NODE:
          return l2.appendChild(r2), [...s2, l2];
        default:
          return [...s2, l2];
      }
      return [...s2, ...Array.from(r2.childNodes).reduce(i, [])];
    };
    return t.reduce(i, []);
  }
  /**
   * Compose paste event with passed type and detail
   *
   * @param {string} type - event type
   * @param {PasteEventDetail} detail - event detail
   */
  composePasteEvent(e, t) {
    return new CustomEvent(e, {
      detail: t
    });
  }
};
Rn.PATTERN_PROCESSING_MAX_LENGTH = 450;
var pa = Rn;
var fa = class extends E {
  constructor() {
    super(...arguments), this.toolsDontSupportReadOnly = [], this.readOnlyEnabled = false;
  }
  /**
   * Returns state of read only mode
   */
  get isEnabled() {
    return this.readOnlyEnabled;
  }
  /**
   * Set initial state
   */
  async prepare() {
    const { Tools: e } = this.Editor, { blockTools: t } = e, o3 = [];
    Array.from(t.entries()).forEach(([i, s2]) => {
      s2.isReadOnlySupported || o3.push(i);
    }), this.toolsDontSupportReadOnly = o3, this.config.readOnly && o3.length > 0 && this.throwCriticalError(), this.toggle(this.config.readOnly, true);
  }
  /**
   * Set read-only mode or toggle current state
   * Call all Modules `toggleReadOnly` method and re-render Editor
   *
   * @param state - (optional) read-only state or toggle
   * @param isInitial - (optional) true when editor is initializing
   */
  async toggle(e = !this.readOnlyEnabled, t = false) {
    e && this.toolsDontSupportReadOnly.length > 0 && this.throwCriticalError();
    const o3 = this.readOnlyEnabled;
    this.readOnlyEnabled = e;
    for (const s2 in this.Editor)
      this.Editor[s2].toggleReadOnly && this.Editor[s2].toggleReadOnly(e);
    if (o3 === e)
      return this.readOnlyEnabled;
    if (t)
      return this.readOnlyEnabled;
    this.Editor.ModificationsObserver.disable();
    const i = await this.Editor.Saver.save();
    return await this.Editor.BlockManager.clear(), await this.Editor.Renderer.render(i.blocks), this.Editor.ModificationsObserver.enable(), this.readOnlyEnabled;
  }
  /**
   * Throws an error about tools which don't support read-only mode
   */
  throwCriticalError() {
    throw new Ho(
      `To enable read-only mode all connected tools should support it. Tools ${this.toolsDontSupportReadOnly.join(", ")} don't support read-only mode.`
    );
  }
};
var Be = class extends E {
  constructor() {
    super(...arguments), this.isRectSelectionActivated = false, this.SCROLL_SPEED = 3, this.HEIGHT_OF_SCROLL_ZONE = 40, this.BOTTOM_SCROLL_ZONE = 1, this.TOP_SCROLL_ZONE = 2, this.MAIN_MOUSE_BUTTON = 0, this.mousedown = false, this.isScrolling = false, this.inScrollZone = null, this.startX = 0, this.startY = 0, this.mouseX = 0, this.mouseY = 0, this.stackOfSelected = [], this.listenerIds = [];
  }
  /**
   * CSS classes for the Block
   *
   * @returns {{wrapper: string, content: string}}
   */
  static get CSS() {
    return {
      overlay: "codex-editor-overlay",
      overlayContainer: "codex-editor-overlay__container",
      rect: "codex-editor-overlay__rectangle",
      topScrollZone: "codex-editor-overlay__scroll-zone--top",
      bottomScrollZone: "codex-editor-overlay__scroll-zone--bottom"
    };
  }
  /**
   * Module Preparation
   * Creating rect and hang handlers
   */
  prepare() {
    this.enableModuleBindings();
  }
  /**
   * Init rect params
   *
   * @param {number} pageX - X coord of mouse
   * @param {number} pageY - Y coord of mouse
   */
  startSelection(e, t) {
    const o3 = document.elementFromPoint(e - window.pageXOffset, t - window.pageYOffset);
    o3.closest(`.${this.Editor.Toolbar.CSS.toolbar}`) || (this.Editor.BlockSelection.allBlocksSelected = false, this.clearSelection(), this.stackOfSelected = []);
    const s2 = [
      `.${R.CSS.content}`,
      `.${this.Editor.Toolbar.CSS.toolbar}`,
      `.${this.Editor.InlineToolbar.CSS.inlineToolbar}`
    ], r2 = o3.closest("." + this.Editor.UI.CSS.editorWrapper), a3 = s2.some((l2) => !!o3.closest(l2));
    !r2 || a3 || (this.mousedown = true, this.startX = e, this.startY = t);
  }
  /**
   * Clear all params to end selection
   */
  endSelection() {
    this.mousedown = false, this.startX = 0, this.startY = 0, this.overlayRectangle.style.display = "none";
  }
  /**
   * is RectSelection Activated
   */
  isRectActivated() {
    return this.isRectSelectionActivated;
  }
  /**
   * Mark that selection is end
   */
  clearSelection() {
    this.isRectSelectionActivated = false;
  }
  /**
   * Sets Module necessary event handlers
   */
  enableModuleBindings() {
    const { container: e } = this.genHTML();
    this.listeners.on(e, "mousedown", (t) => {
      this.processMouseDown(t);
    }, false), this.listeners.on(document.body, "mousemove", dt((t) => {
      this.processMouseMove(t);
    }, 10), {
      passive: true
    }), this.listeners.on(document.body, "mouseleave", () => {
      this.processMouseLeave();
    }), this.listeners.on(window, "scroll", dt((t) => {
      this.processScroll(t);
    }, 10), {
      passive: true
    }), this.listeners.on(document.body, "mouseup", () => {
      this.processMouseUp();
    }, false);
  }
  /**
   * Handle mouse down events
   *
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processMouseDown(e) {
    if (e.button !== this.MAIN_MOUSE_BUTTON)
      return;
    e.target.closest(u.allInputsSelector) !== null || this.startSelection(e.pageX, e.pageY);
  }
  /**
   * Handle mouse move events
   *
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processMouseMove(e) {
    this.changingRectangle(e), this.scrollByZones(e.clientY);
  }
  /**
   * Handle mouse leave
   */
  processMouseLeave() {
    this.clearSelection(), this.endSelection();
  }
  /**
   * @param {MouseEvent} mouseEvent - mouse event payload
   */
  processScroll(e) {
    this.changingRectangle(e);
  }
  /**
   * Handle mouse up
   */
  processMouseUp() {
    this.clearSelection(), this.endSelection();
  }
  /**
   * Scroll If mouse in scroll zone
   *
   * @param {number} clientY - Y coord of mouse
   */
  scrollByZones(e) {
    if (this.inScrollZone = null, e <= this.HEIGHT_OF_SCROLL_ZONE && (this.inScrollZone = this.TOP_SCROLL_ZONE), document.documentElement.clientHeight - e <= this.HEIGHT_OF_SCROLL_ZONE && (this.inScrollZone = this.BOTTOM_SCROLL_ZONE), !this.inScrollZone) {
      this.isScrolling = false;
      return;
    }
    this.isScrolling || (this.scrollVertical(this.inScrollZone === this.TOP_SCROLL_ZONE ? -this.SCROLL_SPEED : this.SCROLL_SPEED), this.isScrolling = true);
  }
  /**
   * Generates required HTML elements
   *
   * @returns {Object<string, Element>}
   */
  genHTML() {
    const { UI: e } = this.Editor, t = e.nodes.holder.querySelector("." + e.CSS.editorWrapper), o3 = u.make("div", Be.CSS.overlay, {}), i = u.make("div", Be.CSS.overlayContainer, {}), s2 = u.make("div", Be.CSS.rect, {});
    return i.appendChild(s2), o3.appendChild(i), t.appendChild(o3), this.overlayRectangle = s2, {
      container: t,
      overlay: o3
    };
  }
  /**
   * Activates scrolling if blockSelection is active and mouse is in scroll zone
   *
   * @param {number} speed - speed of scrolling
   */
  scrollVertical(e) {
    if (!(this.inScrollZone && this.mousedown))
      return;
    const t = window.pageYOffset;
    window.scrollBy(0, e), this.mouseY += window.pageYOffset - t, setTimeout(() => {
      this.scrollVertical(e);
    }, 0);
  }
  /**
   * Handles the change in the rectangle and its effect
   *
   * @param {MouseEvent} event - mouse event
   */
  changingRectangle(e) {
    if (!this.mousedown)
      return;
    e.pageY !== void 0 && (this.mouseX = e.pageX, this.mouseY = e.pageY);
    const { rightPos: t, leftPos: o3, index: i } = this.genInfoForMouseSelection(), s2 = this.startX > t && this.mouseX > t, r2 = this.startX < o3 && this.mouseX < o3;
    this.rectCrossesBlocks = !(s2 || r2), this.isRectSelectionActivated || (this.rectCrossesBlocks = false, this.isRectSelectionActivated = true, this.shrinkRectangleToPoint(), this.overlayRectangle.style.display = "block"), this.updateRectangleSize(), this.Editor.Toolbar.close(), i !== void 0 && (this.trySelectNextBlock(i), this.inverseSelection(), b.get().removeAllRanges());
  }
  /**
   * Shrink rect to singular point
   */
  shrinkRectangleToPoint() {
    this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`, this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`;
  }
  /**
   * Select or unselect all of blocks in array if rect is out or in selectable area
   */
  inverseSelection() {
    const t = this.Editor.BlockManager.getBlockByIndex(this.stackOfSelected[0]).selected;
    if (this.rectCrossesBlocks && !t)
      for (const o3 of this.stackOfSelected)
        this.Editor.BlockSelection.selectBlockByIndex(o3);
    if (!this.rectCrossesBlocks && t)
      for (const o3 of this.stackOfSelected)
        this.Editor.BlockSelection.unSelectBlockByIndex(o3);
  }
  /**
   * Updates size of rectangle
   */
  updateRectangleSize() {
    this.mouseY >= this.startY ? (this.overlayRectangle.style.top = `${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.bottom = `calc(100% - ${this.mouseY - window.pageYOffset}px`) : (this.overlayRectangle.style.bottom = `calc(100% - ${this.startY - window.pageYOffset}px`, this.overlayRectangle.style.top = `${this.mouseY - window.pageYOffset}px`), this.mouseX >= this.startX ? (this.overlayRectangle.style.left = `${this.startX - window.pageXOffset}px`, this.overlayRectangle.style.right = `calc(100% - ${this.mouseX - window.pageXOffset}px`) : (this.overlayRectangle.style.right = `calc(100% - ${this.startX - window.pageXOffset}px`, this.overlayRectangle.style.left = `${this.mouseX - window.pageXOffset}px`);
  }
  /**
   * Collects information needed to determine the behavior of the rectangle
   *
   * @returns {object} index - index next Block, leftPos - start of left border of Block, rightPos - right border
   */
  genInfoForMouseSelection() {
    const t = document.body.offsetWidth / 2, o3 = this.mouseY - window.pageYOffset, i = document.elementFromPoint(t, o3), s2 = this.Editor.BlockManager.getBlockByChildNode(i);
    let r2;
    s2 !== void 0 && (r2 = this.Editor.BlockManager.blocks.findIndex((h3) => h3.holder === s2.holder));
    const a3 = this.Editor.BlockManager.lastBlock.holder.querySelector("." + R.CSS.content), l2 = Number.parseInt(window.getComputedStyle(a3).width, 10) / 2, c5 = t - l2, d3 = t + l2;
    return {
      index: r2,
      leftPos: c5,
      rightPos: d3
    };
  }
  /**
   * Select block with index index
   *
   * @param index - index of block in redactor
   */
  addBlockInSelection(e) {
    this.rectCrossesBlocks && this.Editor.BlockSelection.selectBlockByIndex(e), this.stackOfSelected.push(e);
  }
  /**
   * Adds a block to the selection and determines which blocks should be selected
   *
   * @param {object} index - index of new block in the reactor
   */
  trySelectNextBlock(e) {
    const t = this.stackOfSelected[this.stackOfSelected.length - 1] === e, o3 = this.stackOfSelected.length, i = 1, s2 = -1, r2 = 0;
    if (t)
      return;
    const a3 = this.stackOfSelected[o3 - 1] - this.stackOfSelected[o3 - 2] > 0;
    let l2 = r2;
    o3 > 1 && (l2 = a3 ? i : s2);
    const c5 = e > this.stackOfSelected[o3 - 1] && l2 === i, d3 = e < this.stackOfSelected[o3 - 1] && l2 === s2, p4 = !(c5 || d3 || l2 === r2);
    if (!p4 && (e > this.stackOfSelected[o3 - 1] || this.stackOfSelected[o3 - 1] === void 0)) {
      let v4 = this.stackOfSelected[o3 - 1] + 1 || e;
      for (v4; v4 <= e; v4++)
        this.addBlockInSelection(v4);
      return;
    }
    if (!p4 && e < this.stackOfSelected[o3 - 1]) {
      for (let v4 = this.stackOfSelected[o3 - 1] - 1; v4 >= e; v4--)
        this.addBlockInSelection(v4);
      return;
    }
    if (!p4)
      return;
    let g6 = o3 - 1, f4;
    for (e > this.stackOfSelected[o3 - 1] ? f4 = () => e > this.stackOfSelected[g6] : f4 = () => e < this.stackOfSelected[g6]; f4(); )
      this.rectCrossesBlocks && this.Editor.BlockSelection.unSelectBlockByIndex(this.stackOfSelected[g6]), this.stackOfSelected.pop(), g6--;
  }
};
var ga = class extends E {
  /**
   * Renders passed blocks as one batch
   *
   * @param blocksData - blocks to render
   */
  async render(e) {
    return new Promise((t) => {
      const { Tools: o3, BlockManager: i } = this.Editor;
      if (e.length === 0)
        i.insert();
      else {
        const s2 = e.map(({ type: r2, data: a3, tunes: l2, id: c5 }) => {
          o3.available.has(r2) === false && (X(`Tool \xAB${r2}\xBB is not found. Check 'tools' property at the Editor.js config.`, "warn"), a3 = this.composeStubDataForTool(r2, a3, c5), r2 = o3.stubTool);
          let d3;
          try {
            d3 = i.composeBlock({
              id: c5,
              tool: r2,
              data: a3,
              tunes: l2
            });
          } catch (h3) {
            S(`Block \xAB${r2}\xBB skipped because of plugins error`, "error", {
              data: a3,
              error: h3
            }), a3 = this.composeStubDataForTool(r2, a3, c5), r2 = o3.stubTool, d3 = i.composeBlock({
              id: c5,
              tool: r2,
              data: a3,
              tunes: l2
            });
          }
          return d3;
        });
        i.insertMany(s2);
      }
      window.requestIdleCallback(() => {
        t();
      }, { timeout: 2e3 });
    });
  }
  /**
   * Create data for the Stub Tool that will be used instead of unavailable tool
   *
   * @param tool - unavailable tool name to stub
   * @param data - data of unavailable block
   * @param [id] - id of unavailable block
   */
  composeStubDataForTool(e, t, o3) {
    const { Tools: i } = this.Editor;
    let s2 = e;
    if (i.unavailable.has(e)) {
      const r2 = i.unavailable.get(e).toolbox;
      r2 !== void 0 && r2[0].title !== void 0 && (s2 = r2[0].title);
    }
    return {
      savedData: {
        id: o3,
        type: e,
        data: t
      },
      title: s2
    };
  }
};
var ma = class extends E {
  /**
   * Composes new chain of Promises to fire them alternatelly
   *
   * @returns {OutputData}
   */
  async save() {
    const { BlockManager: e, Tools: t } = this.Editor, o3 = e.blocks, i = [];
    try {
      o3.forEach((a3) => {
        i.push(this.getSavedData(a3));
      });
      const s2 = await Promise.all(i), r2 = await yt(s2, (a3) => t.blockTools.get(a3).sanitizeConfig);
      return this.makeOutput(r2);
    } catch (s2) {
      X("Saving failed due to the Error %o", "error", s2);
    }
  }
  /**
   * Saves and validates
   *
   * @param {Block} block - Editor's Tool
   * @returns {ValidatedData} - Tool's validated data
   */
  async getSavedData(e) {
    const t = await e.save(), o3 = t && await e.validate(t.data);
    return {
      ...t,
      isValid: o3
    };
  }
  /**
   * Creates output object with saved data, time and version of editor
   *
   * @param {ValidatedData} allExtractedData - data extracted from Blocks
   * @returns {OutputData}
   */
  makeOutput(e) {
    const t = [];
    return e.forEach(({ id: o3, tool: i, data: s2, tunes: r2, isValid: a3 }) => {
      if (!a3) {
        S(`Block \xAB${i}\xBB skipped because saved data is invalid`);
        return;
      }
      if (i === this.Editor.Tools.stubTool) {
        t.push(s2);
        return;
      }
      const l2 = {
        id: o3,
        type: i,
        data: s2,
        ...!V(r2) && {
          tunes: r2
        }
      };
      t.push(l2);
    }), {
      time: +/* @__PURE__ */ new Date(),
      blocks: t,
      version: "2.31.1"
    };
  }
};
(function() {
  try {
    if (typeof document < "u") {
      var n2 = document.createElement("style");
      n2.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-block:only-of-type .ce-paragraph[data-placeholder-active]:empty:before,.ce-block:only-of-type .ce-paragraph[data-placeholder-active][data-empty=true]:before{content:attr(data-placeholder-active)}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")), document.head.appendChild(n2);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var ba = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
function va(n2) {
  const e = document.createElement("div");
  e.innerHTML = n2.trim();
  const t = document.createDocumentFragment();
  return t.append(...Array.from(e.childNodes)), t;
}
var fo = class {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {ParagraphData} params.data - previously saved data
   * @param {ParagraphConfig} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data: e, config: t, api: o3, readOnly: i }) {
    this.api = o3, this.readOnly = i, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = t.placeholder ? t.placeholder : fo.DEFAULT_PLACEHOLDER, this._data = e ?? {}, this._element = null, this._preserveBlank = t.preserveBlank ?? false;
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e) {
    if (e.code !== "Backspace" && e.code !== "Delete" || !this._element)
      return;
    const { textContent: t } = this._element;
    t === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView() {
    const e = document.createElement("DIV");
    return e.classList.add(this._CSS.wrapper, this._CSS.block), e.contentEditable = "false", e.dataset.placeholderActive = this.api.i18n.t(this._placeholder), this._data.text && (e.innerHTML = this._data.text), this.readOnly || (e.contentEditable = "true", e.addEventListener("keyup", this.onKeyUp)), e;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {ParagraphData} data
   * @public
   */
  merge(e) {
    if (!this._element)
      return;
    this._data.text += e.text;
    const t = va(e.text);
    this._element.appendChild(t), this._element.normalize();
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {ParagraphData} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return !(e.text.trim() === "" && !this._preserveBlank);
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {ParagraphData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML
    };
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = {
      text: e.detail.data.innerHTML
    };
    this._data = t, window.requestAnimationFrame(() => {
      this._element && (this._element.innerHTML = this._data.text || "");
    });
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   * @returns {ConversionConfig}
   */
  static get conversionConfig() {
    return {
      export: "text",
      // to convert Paragraph to other block, use 'text' property of saved data
      import: "text"
      // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
  /**
   * Sanitizer rules
   * @returns {SanitizerConfig} - Edtior.js sanitizer config
   */
  static get sanitize() {
    return {
      text: {
        br: true
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {PasteConfig} - Paragraph Paste Setting
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {ToolboxConfig} - Paragraph Toolbox Setting
   */
  static get toolbox() {
    return {
      icon: ba,
      title: "Text"
    };
  }
};
var go = class {
  constructor() {
    this.commandName = "bold";
  }
  /**
   * Sanitizer Rule
   * Leave <b> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      b: {}
    };
  }
  /**
   * Create button for Inline Toolbar
   */
  render() {
    return {
      icon: Ki,
      name: "bold",
      onActivate: () => {
        document.execCommand(this.commandName);
      },
      isActive: () => document.queryCommandState(this.commandName)
    };
  }
  /**
   * Set a shortcut
   *
   * @returns {boolean}
   */
  get shortcut() {
    return "CMD+B";
  }
};
go.isInline = true;
go.title = "Bold";
var mo = class {
  constructor() {
    this.commandName = "italic", this.CSS = {
      button: "ce-inline-tool",
      buttonActive: "ce-inline-tool--active",
      buttonModifier: "ce-inline-tool--italic"
    }, this.nodes = {
      button: null
    };
  }
  /**
   * Sanitizer Rule
   * Leave <i> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      i: {}
    };
  }
  /**
   * Create button for Inline Toolbar
   */
  render() {
    return this.nodes.button = document.createElement("button"), this.nodes.button.type = "button", this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier), this.nodes.button.innerHTML = Ji, this.nodes.button;
  }
  /**
   * Wrap range with <i> tag
   */
  surround() {
    document.execCommand(this.commandName);
  }
  /**
   * Check selection and set activated state to button if there are <i> tag
   */
  checkState() {
    const e = document.queryCommandState(this.commandName);
    return this.nodes.button.classList.toggle(this.CSS.buttonActive, e), e;
  }
  /**
   * Set a shortcut
   */
  get shortcut() {
    return "CMD+I";
  }
};
mo.isInline = true;
mo.title = "Italic";
var bo = class {
  /**
   * @param api - Editor.js API
   */
  constructor({ api: e }) {
    this.commandLink = "createLink", this.commandUnlink = "unlink", this.ENTER_KEY = 13, this.CSS = {
      button: "ce-inline-tool",
      buttonActive: "ce-inline-tool--active",
      buttonModifier: "ce-inline-tool--link",
      buttonUnlink: "ce-inline-tool--unlink",
      input: "ce-inline-tool-input",
      inputShowed: "ce-inline-tool-input--showed"
    }, this.nodes = {
      button: null,
      input: null
    }, this.inputOpened = false, this.toolbar = e.toolbar, this.inlineToolbar = e.inlineToolbar, this.notifier = e.notifier, this.i18n = e.i18n, this.selection = new b();
  }
  /**
   * Sanitizer Rule
   * Leave <a> tags
   *
   * @returns {object}
   */
  static get sanitize() {
    return {
      a: {
        href: true,
        target: "_blank",
        rel: "nofollow"
      }
    };
  }
  /**
   * Create button for Inline Toolbar
   */
  render() {
    return this.nodes.button = document.createElement("button"), this.nodes.button.type = "button", this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier), this.nodes.button.innerHTML = Co, this.nodes.button;
  }
  /**
   * Input for the link
   */
  renderActions() {
    return this.nodes.input = document.createElement("input"), this.nodes.input.placeholder = this.i18n.t("Add a link"), this.nodes.input.enterKeyHint = "done", this.nodes.input.classList.add(this.CSS.input), this.nodes.input.addEventListener("keydown", (e) => {
      e.keyCode === this.ENTER_KEY && this.enterPressed(e);
    }), this.nodes.input;
  }
  /**
   * Handle clicks on the Inline Toolbar icon
   *
   * @param {Range} range - range to wrap with link
   */
  surround(e) {
    if (e) {
      this.inputOpened ? (this.selection.restore(), this.selection.removeFakeBackground()) : (this.selection.setFakeBackground(), this.selection.save());
      const t = this.selection.findParentTag("A");
      if (t) {
        this.selection.expandToTag(t), this.unlink(), this.closeActions(), this.checkState(), this.toolbar.close();
        return;
      }
    }
    this.toggleActions();
  }
  /**
   * Check selection and set activated state to button if there are <a> tag
   */
  checkState() {
    const e = this.selection.findParentTag("A");
    if (e) {
      this.nodes.button.innerHTML = ns, this.nodes.button.classList.add(this.CSS.buttonUnlink), this.nodes.button.classList.add(this.CSS.buttonActive), this.openActions();
      const t = e.getAttribute("href");
      this.nodes.input.value = t !== "null" ? t : "", this.selection.save();
    } else
      this.nodes.button.innerHTML = Co, this.nodes.button.classList.remove(this.CSS.buttonUnlink), this.nodes.button.classList.remove(this.CSS.buttonActive);
    return !!e;
  }
  /**
   * Function called with Inline Toolbar closing
   */
  clear() {
    this.closeActions();
  }
  /**
   * Set a shortcut
   */
  get shortcut() {
    return "CMD+K";
  }
  /**
   * Show/close link input
   */
  toggleActions() {
    this.inputOpened ? this.closeActions(false) : this.openActions(true);
  }
  /**
   * @param {boolean} needFocus - on link creation we need to focus input. On editing - nope.
   */
  openActions(e = false) {
    this.nodes.input.classList.add(this.CSS.inputShowed), e && this.nodes.input.focus(), this.inputOpened = true;
  }
  /**
   * Close input
   *
   * @param {boolean} clearSavedSelection — we don't need to clear saved selection
   *                                        on toggle-clicks on the icon of opened Toolbar
   */
  closeActions(e = true) {
    if (this.selection.isFakeBackgroundEnabled) {
      const t = new b();
      t.save(), this.selection.restore(), this.selection.removeFakeBackground(), t.restore();
    }
    this.nodes.input.classList.remove(this.CSS.inputShowed), this.nodes.input.value = "", e && this.selection.clearSaved(), this.inputOpened = false;
  }
  /**
   * Enter pressed on input
   *
   * @param {KeyboardEvent} event - enter keydown event
   */
  enterPressed(e) {
    let t = this.nodes.input.value || "";
    if (!t.trim()) {
      this.selection.restore(), this.unlink(), e.preventDefault(), this.closeActions();
      return;
    }
    if (!this.validateURL(t)) {
      this.notifier.show({
        message: "Pasted link is not valid.",
        style: "error"
      }), S("Incorrect Link pasted", "warn", t);
      return;
    }
    t = this.prepareLink(t), this.selection.restore(), this.selection.removeFakeBackground(), this.insertLink(t), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), this.selection.collapseToEnd(), this.inlineToolbar.close();
  }
  /**
   * Detects if passed string is URL
   *
   * @param {string} str - string to validate
   * @returns {boolean}
   */
  validateURL(e) {
    return !/\s/.test(e);
  }
  /**
   * Process link before injection
   * - sanitize
   * - add protocol for links like 'google.com'
   *
   * @param {string} link - raw user input
   */
  prepareLink(e) {
    return e = e.trim(), e = this.addProtocol(e), e;
  }
  /**
   * Add 'http' protocol to the links like 'vc.ru', 'google.com'
   *
   * @param {string} link - string to process
   */
  addProtocol(e) {
    if (/^(\w+):(\/\/)?/.test(e))
      return e;
    const t = /^\/[^/\s]/.test(e), o3 = e.substring(0, 1) === "#", i = /^\/\/[^/\s]/.test(e);
    return !t && !o3 && !i && (e = "http://" + e), e;
  }
  /**
   * Inserts <a> tag with "href"
   *
   * @param {string} link - "href" value
   */
  insertLink(e) {
    const t = this.selection.findParentTag("A");
    t && this.selection.expandToTag(t), document.execCommand(this.commandLink, false, e);
  }
  /**
   * Removes <a> tag
   */
  unlink() {
    document.execCommand(this.commandUnlink);
  }
};
bo.isInline = true;
bo.title = "Link";
var Fn = class {
  /**
   * @param api - Editor.js API
   */
  constructor({ api: e }) {
    this.i18nAPI = e.i18n, this.blocksAPI = e.blocks, this.selectionAPI = e.selection, this.toolsAPI = e.tools, this.caretAPI = e.caret;
  }
  /**
   * Returns tool's UI config
   */
  async render() {
    const e = b.get(), t = this.blocksAPI.getBlockByElement(e.anchorNode);
    if (t === void 0)
      return [];
    const o3 = this.toolsAPI.getBlockTools(), i = await Yo(t, o3);
    if (i.length === 0)
      return [];
    const s2 = i.reduce((c5, d3) => {
      var h3;
      return (h3 = d3.toolbox) == null || h3.forEach((p4) => {
        c5.push({
          icon: p4.icon,
          title: z.t(K.toolNames, p4.title),
          name: d3.name,
          closeOnActivate: true,
          onActivate: async () => {
            const g6 = await this.blocksAPI.convert(t.id, d3.name, p4.data);
            this.caretAPI.setToBlock(g6, "end");
          }
        });
      }), c5;
    }, []), r2 = await t.getActiveToolboxEntry(), a3 = r2 !== void 0 ? r2.icon : Go, l2 = !be();
    return {
      icon: a3,
      name: "convert-to",
      hint: {
        title: this.i18nAPI.t("Convert to")
      },
      children: {
        searchable: l2,
        items: s2,
        onOpen: () => {
          l2 && (this.selectionAPI.setFakeBackground(), this.selectionAPI.save());
        },
        onClose: () => {
          l2 && (this.selectionAPI.restore(), this.selectionAPI.removeFakeBackground());
        }
      }
    };
  }
};
Fn.isInline = true;
var jn = class {
  /**
   * @param options - constructor options
   * @param options.data - stub tool data
   * @param options.api - Editor.js API
   */
  constructor({ data: e, api: t }) {
    this.CSS = {
      wrapper: "ce-stub",
      info: "ce-stub__info",
      title: "ce-stub__title",
      subtitle: "ce-stub__subtitle"
    }, this.api = t, this.title = e.title || this.api.i18n.t("Error"), this.subtitle = this.api.i18n.t("The block can not be displayed correctly."), this.savedData = e.savedData, this.wrapper = this.make();
  }
  /**
   * Returns stub holder
   *
   * @returns {HTMLElement}
   */
  render() {
    return this.wrapper;
  }
  /**
   * Return original Tool data
   *
   * @returns {BlockToolData}
   */
  save() {
    return this.savedData;
  }
  /**
   * Create Tool html markup
   *
   * @returns {HTMLElement}
   */
  make() {
    const e = u.make("div", this.CSS.wrapper), t = is, o3 = u.make("div", this.CSS.info), i = u.make("div", this.CSS.title, {
      textContent: this.title
    }), s2 = u.make("div", this.CSS.subtitle, {
      textContent: this.subtitle
    });
    return e.innerHTML = t, o3.appendChild(i), o3.appendChild(s2), e.appendChild(o3), e;
  }
};
jn.isReadOnlySupported = true;
var ka = class extends Tt {
  constructor() {
    super(...arguments), this.type = ae.Inline;
  }
  /**
   * Returns title for Inline Tool if specified by user
   */
  get title() {
    return this.constructable[We.Title];
  }
  /**
   * Constructs new InlineTool instance from constructable
   */
  create() {
    return new this.constructable({
      api: this.api,
      config: this.settings
    });
  }
  /**
   * Allows inline tool to be available in read-only mode
   * Can be used, for example, by comments tool
   */
  get isReadOnlySupported() {
    return this.constructable[We.IsReadOnlySupported] ?? false;
  }
};
var ya = class extends Tt {
  constructor() {
    super(...arguments), this.type = ae.Tune;
  }
  /**
   * Constructs new BlockTune instance from constructable
   *
   * @param data - Tune data
   * @param block - Block API object
   */
  create(e, t) {
    return new this.constructable({
      api: this.api,
      config: this.settings,
      block: t,
      data: e
    });
  }
};
var j = class extends Map {
  /**
   * Returns Block Tools collection
   */
  get blockTools() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isBlock());
    return new j(e);
  }
  /**
   * Returns Inline Tools collection
   */
  get inlineTools() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isInline());
    return new j(e);
  }
  /**
   * Returns Block Tunes collection
   */
  get blockTunes() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isTune());
    return new j(e);
  }
  /**
   * Returns internal Tools collection
   */
  get internalTools() {
    const e = Array.from(this.entries()).filter(([, t]) => t.isInternal);
    return new j(e);
  }
  /**
   * Returns Tools collection provided by user
   */
  get externalTools() {
    const e = Array.from(this.entries()).filter(([, t]) => !t.isInternal);
    return new j(e);
  }
};
var wa = Object.defineProperty;
var Ea = Object.getOwnPropertyDescriptor;
var Hn = (n2, e, t, o3) => {
  for (var i = o3 > 1 ? void 0 : o3 ? Ea(e, t) : e, s2 = n2.length - 1, r2; s2 >= 0; s2--)
    (r2 = n2[s2]) && (i = (o3 ? r2(e, t, i) : r2(i)) || i);
  return o3 && i && wa(e, t, i), i;
};
var vo = class extends Tt {
  constructor() {
    super(...arguments), this.type = ae.Block, this.inlineTools = new j(), this.tunes = new j();
  }
  /**
   * Creates new Tool instance
   *
   * @param data - Tool data
   * @param block - BlockAPI for current Block
   * @param readOnly - True if Editor is in read-only mode
   */
  create(e, t, o3) {
    return new this.constructable({
      data: e,
      block: t,
      readOnly: o3,
      api: this.api,
      config: this.settings
    });
  }
  /**
   * Returns true if read-only mode is supported by Tool
   */
  get isReadOnlySupported() {
    return this.constructable[pe.IsReadOnlySupported] === true;
  }
  /**
   * Returns true if Tool supports linebreaks
   */
  get isLineBreaksEnabled() {
    return this.constructable[pe.IsEnabledLineBreaks];
  }
  /**
   * Returns Tool toolbox configuration (internal or user-specified).
   *
   * Merges internal and user-defined toolbox configs based on the following rules:
   *
   * - If both internal and user-defined toolbox configs are arrays their items are merged.
   * Length of the second one is kept.
   *
   * - If both are objects their properties are merged.
   *
   * - If one is an object and another is an array than internal config is replaced with user-defined
   * config. This is made to allow user to override default tool's toolbox representation (single/multiple entries)
   */
  get toolbox() {
    const e = this.constructable[pe.Toolbox], t = this.config[Pe.Toolbox];
    if (!V(e) && t !== false)
      return t ? Array.isArray(e) ? Array.isArray(t) ? t.map((o3, i) => {
        const s2 = e[i];
        return s2 ? {
          ...s2,
          ...o3
        } : o3;
      }) : [t] : Array.isArray(t) ? t : [
        {
          ...e,
          ...t
        }
      ] : Array.isArray(e) ? e : [e];
  }
  /**
   * Returns Tool conversion configuration
   */
  get conversionConfig() {
    return this.constructable[pe.ConversionConfig];
  }
  /**
   * Returns enabled inline tools for Tool
   */
  get enabledInlineTools() {
    return this.config[Pe.EnabledInlineTools] || false;
  }
  /**
   * Returns enabled tunes for Tool
   */
  get enabledBlockTunes() {
    return this.config[Pe.EnabledBlockTunes];
  }
  /**
   * Returns Tool paste configuration
   */
  get pasteConfig() {
    return this.constructable[pe.PasteConfig] ?? {};
  }
  get sanitizeConfig() {
    const e = super.sanitizeConfig, t = this.baseSanitizeConfig;
    if (V(e))
      return t;
    const o3 = {};
    for (const i in e)
      if (Object.prototype.hasOwnProperty.call(e, i)) {
        const s2 = e[i];
        D(s2) ? o3[i] = Object.assign({}, t, s2) : o3[i] = s2;
      }
    return o3;
  }
  get baseSanitizeConfig() {
    const e = {};
    return Array.from(this.inlineTools.values()).forEach((t) => Object.assign(e, t.sanitizeConfig)), Array.from(this.tunes.values()).forEach((t) => Object.assign(e, t.sanitizeConfig)), e;
  }
};
Hn(
  [
    me
  ],
  vo.prototype,
  "sanitizeConfig",
  1
);
Hn(
  [
    me
  ],
  vo.prototype,
  "baseSanitizeConfig",
  1
);
var xa = class {
  /**
   * @class
   * @param config - tools config
   * @param editorConfig - EditorJS config
   * @param api - EditorJS API module
   */
  constructor(e, t, o3) {
    this.api = o3, this.config = e, this.editorConfig = t;
  }
  /**
   * Returns Tool object based on it's type
   *
   * @param name - tool name
   */
  get(e) {
    const { class: t, isInternal: o3 = false, ...i } = this.config[e], s2 = this.getConstructor(t), r2 = t[mt.IsTune];
    return new s2({
      name: e,
      constructable: t,
      config: i,
      api: this.api.getMethodsForTool(e, r2),
      isDefault: e === this.editorConfig.defaultBlock,
      defaultPlaceholder: this.editorConfig.placeholder,
      isInternal: o3
    });
  }
  /**
   * Find appropriate Tool object constructor for Tool constructable
   *
   * @param constructable - Tools constructable
   */
  getConstructor(e) {
    switch (true) {
      case e[We.IsInline]:
        return ka;
      case e[mt.IsTune]:
        return ya;
      default:
        return vo;
    }
  }
};
var $n = class {
  /**
   * MoveDownTune constructor
   *
   * @param {API} api — Editor's API
   */
  constructor({ api: e }) {
    this.CSS = {
      animation: "wobble"
    }, this.api = e;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Xi,
      title: this.api.i18n.t("Move down"),
      onActivate: () => this.handleClick(),
      name: "move-down"
    };
  }
  /**
   * Handle clicks on 'move down' button
   */
  handleClick() {
    const e = this.api.blocks.getCurrentBlockIndex(), t = this.api.blocks.getBlockByIndex(e + 1);
    if (!t)
      throw new Error("Unable to move Block down since it is already the last");
    const o3 = t.holder, i = o3.getBoundingClientRect();
    let s2 = Math.abs(window.innerHeight - o3.offsetHeight);
    i.top < window.innerHeight && (s2 = window.scrollY + o3.offsetHeight), window.scrollTo(0, s2), this.api.blocks.move(e + 1), this.api.toolbar.toggleBlockSettings(true);
  }
};
$n.isTune = true;
var zn = class {
  /**
   * DeleteTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api: e }) {
    this.api = e;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Gi,
      title: this.api.i18n.t("Delete"),
      name: "delete",
      confirmation: {
        title: this.api.i18n.t("Click to delete"),
        onActivate: () => this.handleClick()
      }
    };
  }
  /**
   * Delete block conditions passed
   */
  handleClick() {
    this.api.blocks.delete();
  }
};
zn.isTune = true;
var Un = class {
  /**
   * MoveUpTune constructor
   *
   * @param {API} api - Editor's API
   */
  constructor({ api: e }) {
    this.CSS = {
      animation: "wobble"
    }, this.api = e;
  }
  /**
   * Tune's appearance in block settings menu
   */
  render() {
    return {
      icon: Zi,
      title: this.api.i18n.t("Move up"),
      onActivate: () => this.handleClick(),
      name: "move-up"
    };
  }
  /**
   * Move current block up
   */
  handleClick() {
    const e = this.api.blocks.getCurrentBlockIndex(), t = this.api.blocks.getBlockByIndex(e), o3 = this.api.blocks.getBlockByIndex(e - 1);
    if (e === 0 || !t || !o3)
      throw new Error("Unable to move Block up since it is already the first");
    const i = t.holder, s2 = o3.holder, r2 = i.getBoundingClientRect(), a3 = s2.getBoundingClientRect();
    let l2;
    a3.top > 0 ? l2 = Math.abs(r2.top) - Math.abs(a3.top) : l2 = Math.abs(r2.top) + a3.height, window.scrollBy(0, -1 * l2), this.api.blocks.move(e - 1), this.api.toolbar.toggleBlockSettings(true);
  }
};
Un.isTune = true;
var Ba = Object.defineProperty;
var Ca = Object.getOwnPropertyDescriptor;
var Ta = (n2, e, t, o3) => {
  for (var i = o3 > 1 ? void 0 : o3 ? Ca(e, t) : e, s2 = n2.length - 1, r2; s2 >= 0; s2--)
    (r2 = n2[s2]) && (i = (o3 ? r2(e, t, i) : r2(i)) || i);
  return o3 && i && Ba(e, t, i), i;
};
var Wn = class extends E {
  constructor() {
    super(...arguments), this.stubTool = "stub", this.toolsAvailable = new j(), this.toolsUnavailable = new j();
  }
  /**
   * Returns available Tools
   */
  get available() {
    return this.toolsAvailable;
  }
  /**
   * Returns unavailable Tools
   */
  get unavailable() {
    return this.toolsUnavailable;
  }
  /**
   * Return Tools for the Inline Toolbar
   */
  get inlineTools() {
    return this.available.inlineTools;
  }
  /**
   * Return editor block tools
   */
  get blockTools() {
    return this.available.blockTools;
  }
  /**
   * Return available Block Tunes
   *
   * @returns {object} - object of Inline Tool's classes
   */
  get blockTunes() {
    return this.available.blockTunes;
  }
  /**
   * Returns default Tool object
   */
  get defaultTool() {
    return this.blockTools.get(this.config.defaultBlock);
  }
  /**
   * Returns internal tools
   */
  get internal() {
    return this.available.internalTools;
  }
  /**
   * Creates instances via passed or default configuration
   *
   * @returns {Promise<void>}
   */
  async prepare() {
    if (this.validateTools(), this.config.tools = ut({}, this.internalTools, this.config.tools), !Object.prototype.hasOwnProperty.call(this.config, "tools") || Object.keys(this.config.tools).length === 0)
      throw Error("Can't start without tools");
    const e = this.prepareConfig();
    this.factory = new xa(e, this.config, this.Editor.API);
    const t = this.getListOfPrepareFunctions(e);
    if (t.length === 0)
      return Promise.resolve();
    await Qn(t, (o3) => {
      this.toolPrepareMethodSuccess(o3);
    }, (o3) => {
      this.toolPrepareMethodFallback(o3);
    }), this.prepareBlockTools();
  }
  getAllInlineToolsSanitizeConfig() {
    const e = {};
    return Array.from(this.inlineTools.values()).forEach((t) => {
      Object.assign(e, t.sanitizeConfig);
    }), e;
  }
  /**
   * Calls each Tool reset method to clean up anything set by Tool
   */
  destroy() {
    Object.values(this.available).forEach(async (e) => {
      A(e.reset) && await e.reset();
    });
  }
  /**
   * Returns internal tools
   * Includes Bold, Italic, Link and Paragraph
   */
  get internalTools() {
    return {
      convertTo: {
        class: Fn,
        isInternal: true
      },
      link: {
        class: bo,
        isInternal: true
      },
      bold: {
        class: go,
        isInternal: true
      },
      italic: {
        class: mo,
        isInternal: true
      },
      paragraph: {
        class: fo,
        inlineToolbar: true,
        isInternal: true
      },
      stub: {
        class: jn,
        isInternal: true
      },
      moveUp: {
        class: Un,
        isInternal: true
      },
      delete: {
        class: zn,
        isInternal: true
      },
      moveDown: {
        class: $n,
        isInternal: true
      }
    };
  }
  /**
   * Tool prepare method success callback
   *
   * @param {object} data - append tool to available list
   */
  toolPrepareMethodSuccess(e) {
    const t = this.factory.get(e.toolName);
    if (t.isInline()) {
      const i = ["render"].filter((s2) => !t.create()[s2]);
      if (i.length) {
        S(
          `Incorrect Inline Tool: ${t.name}. Some of required methods is not implemented %o`,
          "warn",
          i
        ), this.toolsUnavailable.set(t.name, t);
        return;
      }
    }
    this.toolsAvailable.set(t.name, t);
  }
  /**
   * Tool prepare method fail callback
   *
   * @param {object} data - append tool to unavailable list
   */
  toolPrepareMethodFallback(e) {
    this.toolsUnavailable.set(e.toolName, this.factory.get(e.toolName));
  }
  /**
   * Binds prepare function of plugins with user or default config
   *
   * @returns {Array} list of functions that needs to be fired sequentially
   * @param config - tools config
   */
  getListOfPrepareFunctions(e) {
    const t = [];
    return Object.entries(e).forEach(([o3, i]) => {
      t.push({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function: A(i.class.prepare) ? i.class.prepare : () => {
        },
        data: {
          toolName: o3,
          config: i.config
        }
      });
    }), t;
  }
  /**
   * Assign enabled Inline Tools and Block Tunes for Block Tool
   */
  prepareBlockTools() {
    Array.from(this.blockTools.values()).forEach((e) => {
      this.assignInlineToolsToBlockTool(e), this.assignBlockTunesToBlockTool(e);
    });
  }
  /**
   * Assign enabled Inline Tools for Block Tool
   *
   * @param tool - Block Tool
   */
  assignInlineToolsToBlockTool(e) {
    if (this.config.inlineToolbar !== false) {
      if (e.enabledInlineTools === true) {
        e.inlineTools = new j(
          Array.isArray(this.config.inlineToolbar) ? this.config.inlineToolbar.map((t) => [t, this.inlineTools.get(t)]) : Array.from(this.inlineTools.entries())
        );
        return;
      }
      Array.isArray(e.enabledInlineTools) && (e.inlineTools = new j(
        /** Prepend ConvertTo Inline Tool */
        ["convertTo", ...e.enabledInlineTools].map((t) => [t, this.inlineTools.get(t)])
      ));
    }
  }
  /**
   * Assign enabled Block Tunes for Block Tool
   *
   * @param tool — Block Tool
   */
  assignBlockTunesToBlockTool(e) {
    if (e.enabledBlockTunes !== false) {
      if (Array.isArray(e.enabledBlockTunes)) {
        const t = new j(
          e.enabledBlockTunes.map((o3) => [o3, this.blockTunes.get(o3)])
        );
        e.tunes = new j([...t, ...this.blockTunes.internalTools]);
        return;
      }
      if (Array.isArray(this.config.tunes)) {
        const t = new j(
          this.config.tunes.map((o3) => [o3, this.blockTunes.get(o3)])
        );
        e.tunes = new j([...t, ...this.blockTunes.internalTools]);
        return;
      }
      e.tunes = this.blockTunes.internalTools;
    }
  }
  /**
   * Validate Tools configuration objects and throw Error for user if it is invalid
   */
  validateTools() {
    for (const e in this.config.tools)
      if (Object.prototype.hasOwnProperty.call(this.config.tools, e)) {
        if (e in this.internalTools)
          return;
        const t = this.config.tools[e];
        if (!A(t) && !A(t.class))
          throw Error(
            `Tool \xAB${e}\xBB must be a constructor function or an object with function in the \xABclass\xBB property`
          );
      }
  }
  /**
   * Unify tools config
   */
  prepareConfig() {
    const e = {};
    for (const t in this.config.tools)
      D(this.config.tools[t]) ? e[t] = this.config.tools[t] : e[t] = { class: this.config.tools[t] };
    return e;
  }
};
Ta(
  [
    me
  ],
  Wn.prototype,
  "getAllInlineToolsSanitizeConfig",
  1
);
var Sa = `:root{--selectionColor: #e1f2ff;--inlineSelectionColor: #d4ecff;--bg-light: #eff2f5;--grayText: #707684;--color-dark: #1D202B;--color-active-icon: #388AE5;--color-gray-border: rgba(201, 201, 204, .48);--content-width: 650px;--narrow-mode-right-padding: 50px;--toolbox-buttons-size: 26px;--toolbox-buttons-size--mobile: 36px;--icon-size: 20px;--icon-size--mobile: 28px;--block-padding-vertical: .4em;--color-line-gray: #EFF0F1 }.codex-editor{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1}.codex-editor .hide{display:none}.codex-editor__redactor [contenteditable]:empty:after{content:"\\feff"}@media (min-width: 651px){.codex-editor--narrow .codex-editor__redactor{margin-right:50px}}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .codex-editor__redactor{margin-left:50px;margin-right:0}}@media (min-width: 651px){.codex-editor--narrow .ce-toolbar__actions{right:-5px}}.codex-editor-copyable{position:absolute;height:1px;width:1px;top:-400%;opacity:.001}.codex-editor-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;pointer-events:none;overflow:hidden}.codex-editor-overlay__container{position:relative;pointer-events:auto;z-index:0}.codex-editor-overlay__rectangle{position:absolute;pointer-events:none;background-color:#2eaadc33;border:1px solid transparent}.codex-editor svg{max-height:100%}.codex-editor path{stroke:currentColor}.codex-editor ::-moz-selection{background-color:#d4ecff}.codex-editor ::selection{background-color:#d4ecff}.codex-editor--toolbox-opened [contentEditable=true][data-placeholder]:focus:before{opacity:0!important}.ce-scroll-locked{overflow:hidden}.ce-scroll-locked--hard{overflow:hidden;top:calc(-1 * var(--window-scroll-offset));position:fixed;width:100%}.ce-toolbar{position:absolute;left:0;right:0;top:0;-webkit-transition:opacity .1s ease;transition:opacity .1s ease;will-change:opacity,top;display:none}.ce-toolbar--opened{display:block}.ce-toolbar__content{max-width:650px;margin:0 auto;position:relative}.ce-toolbar__plus{color:#1d202b;cursor:pointer;width:26px;height:26px;border-radius:7px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-ms-flex-negative:0;flex-shrink:0}@media (max-width: 650px){.ce-toolbar__plus{width:36px;height:36px}}@media (hover: hover){.ce-toolbar__plus:hover{background-color:#eff2f5}}.ce-toolbar__plus--active{background-color:#eff2f5;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ce-toolbar__plus-shortcut{opacity:.6;word-spacing:-2px;margin-top:5px}@media (max-width: 650px){.ce-toolbar__plus{position:absolute;background-color:#fff;border:1px solid #E8E8EB;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;z-index:2;position:static}.ce-toolbar__plus--left-oriented:before{left:15px;margin-left:0}.ce-toolbar__plus--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar__actions{position:absolute;right:100%;opacity:0;display:-webkit-box;display:-ms-flexbox;display:flex;padding-right:5px}.ce-toolbar__actions--opened{opacity:1}@media (max-width: 650px){.ce-toolbar__actions{right:auto}}.ce-toolbar__settings-btn{color:#1d202b;width:26px;height:26px;border-radius:7px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;margin-left:3px;cursor:pointer;user-select:none}@media (max-width: 650px){.ce-toolbar__settings-btn{width:36px;height:36px}}@media (hover: hover){.ce-toolbar__settings-btn:hover{background-color:#eff2f5}}.ce-toolbar__settings-btn--active{background-color:#eff2f5;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}@media (min-width: 651px){.ce-toolbar__settings-btn{width:24px}}.ce-toolbar__settings-btn--hidden{display:none}@media (max-width: 650px){.ce-toolbar__settings-btn{position:absolute;background-color:#fff;border:1px solid #E8E8EB;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;z-index:2;position:static}.ce-toolbar__settings-btn--left-oriented:before{left:15px;margin-left:0}.ce-toolbar__settings-btn--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar__plus svg,.ce-toolbar__settings-btn svg{width:24px;height:24px}@media (min-width: 651px){.codex-editor--narrow .ce-toolbar__plus{left:5px}}@media (min-width: 651px){.codex-editor--narrow .ce-toolbox .ce-popover{right:0;left:auto;left:initial}}.ce-inline-toolbar{--y-offset: 8px;--color-background-icon-active: rgba(56, 138, 229, .1);--color-text-icon-active: #388AE5;--color-text-primary: black;position:absolute;visibility:hidden;-webkit-transition:opacity .25s ease;transition:opacity .25s ease;will-change:opacity,left,top;top:0;left:0;z-index:3;opacity:1;visibility:visible}.ce-inline-toolbar [hidden]{display:none!important}.ce-inline-toolbar__toggler-and-button-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;padding:0 6px}.ce-inline-toolbar__buttons{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown{display:-webkit-box;display:-ms-flexbox;display:flex;padding:6px;margin:0 6px 0 -6px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;border-right:1px solid rgba(201,201,204,.48);-webkit-box-sizing:border-box;box-sizing:border-box}@media (hover: hover){.ce-inline-toolbar__dropdown:hover{background:#eff2f5}}.ce-inline-toolbar__dropdown--hidden{display:none}.ce-inline-toolbar__dropdown-content,.ce-inline-toolbar__dropdown-arrow{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown-content svg,.ce-inline-toolbar__dropdown-arrow svg{width:20px;height:20px}.ce-inline-toolbar__shortcut{opacity:.6;word-spacing:-3px;margin-top:3px}.ce-inline-tool{color:var(--color-text-primary);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;border:0;border-radius:4px;line-height:normal;height:100%;padding:0;width:28px;background-color:transparent;cursor:pointer}@media (max-width: 650px){.ce-inline-tool{width:36px;height:36px}}@media (hover: hover){.ce-inline-tool:hover{background-color:#f8f8f8}}.ce-inline-tool svg{display:block;width:20px;height:20px}@media (max-width: 650px){.ce-inline-tool svg{width:28px;height:28px}}.ce-inline-tool--link .icon--unlink,.ce-inline-tool--unlink .icon--link{display:none}.ce-inline-tool--unlink .icon--unlink{display:inline-block;margin-bottom:-1px}.ce-inline-tool-input{background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:4px 8px;font-size:14px;line-height:22px;outline:none;margin:0;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;display:none;font-weight:500;-webkit-appearance:none;font-family:inherit}@media (max-width: 650px){.ce-inline-tool-input{font-size:15px;font-weight:500}}.ce-inline-tool-input::-webkit-input-placeholder{color:#707684}.ce-inline-tool-input::-moz-placeholder{color:#707684}.ce-inline-tool-input:-ms-input-placeholder{color:#707684}.ce-inline-tool-input::-ms-input-placeholder{color:#707684}.ce-inline-tool-input::placeholder{color:#707684}.ce-inline-tool-input--showed{display:block}.ce-inline-tool--active{background:var(--color-background-icon-active);color:var(--color-text-icon-active)}@-webkit-keyframes fade-in{0%{opacity:0}to{opacity:1}}@keyframes fade-in{0%{opacity:0}to{opacity:1}}.ce-block{-webkit-animation:fade-in .3s ease;animation:fade-in .3s ease;-webkit-animation-fill-mode:none;animation-fill-mode:none;-webkit-animation-fill-mode:initial;animation-fill-mode:initial}.ce-block:first-of-type{margin-top:0}.ce-block--selected .ce-block__content{background:#e1f2ff}.ce-block--selected .ce-block__content [contenteditable]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ce-block--selected .ce-block__content img,.ce-block--selected .ce-block__content .ce-stub{opacity:.55}.ce-block--stretched .ce-block__content{max-width:none}.ce-block__content{position:relative;max-width:650px;margin:0 auto;-webkit-transition:background-color .15s ease;transition:background-color .15s ease}.ce-block--drop-target .ce-block__content:before{content:"";position:absolute;top:100%;left:-20px;margin-top:-1px;height:8px;width:8px;border:solid #388AE5;border-width:1px 1px 0 0;-webkit-transform-origin:right;transform-origin:right;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.ce-block--drop-target .ce-block__content:after{content:"";position:absolute;top:100%;height:1px;width:100%;color:#388ae5;background:repeating-linear-gradient(90deg,#388AE5,#388AE5 1px,#fff 1px,#fff 6px)}.ce-block a{cursor:pointer;-webkit-text-decoration:underline;text-decoration:underline}.ce-block b{font-weight:700}.ce-block i{font-style:italic}@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@-webkit-keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@-webkit-keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}@keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scale3d(1,1,1);transform:scaleZ(1)}}.cdx-block{padding:.4em 0}.cdx-block::-webkit-input-placeholder{line-height:normal!important}.cdx-input{border:1px solid rgba(201,201,204,.48);-webkit-box-shadow:inset 0 1px 2px 0 rgba(35,44,72,.06);box-shadow:inset 0 1px 2px #232c480f;border-radius:3px;padding:10px 12px;outline:none;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.cdx-input[data-placeholder]:before{position:static!important}.cdx-input[data-placeholder]:before{display:inline-block;width:0;white-space:nowrap;pointer-events:none}.cdx-settings-button{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;border-radius:3px;cursor:pointer;border:0;outline:none;background-color:transparent;vertical-align:bottom;color:inherit;margin:0;min-width:26px;min-height:26px}.cdx-settings-button--focused{background:rgba(34,186,255,.08)!important}.cdx-settings-button--focused{-webkit-box-shadow:inset 0 0 0px 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px #07a1e314}.cdx-settings-button--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.cdx-settings-button--active{color:#388ae5}.cdx-settings-button svg{width:auto;height:auto}@media (max-width: 650px){.cdx-settings-button svg{width:28px;height:28px}}@media (max-width: 650px){.cdx-settings-button{width:36px;height:36px;border-radius:8px}}@media (hover: hover){.cdx-settings-button:hover{background-color:#eff2f5}}.cdx-loader{position:relative;border:1px solid rgba(201,201,204,.48)}.cdx-loader:before{content:"";position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-11px 0 0 -11px;border:2px solid rgba(201,201,204,.48);border-left-color:#388ae5;border-radius:50%;-webkit-animation:cdxRotation 1.2s infinite linear;animation:cdxRotation 1.2s infinite linear}@-webkit-keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0)}to{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}.cdx-button{padding:13px;border-radius:3px;border:1px solid rgba(201,201,204,.48);font-size:14.9px;background:#fff;-webkit-box-shadow:0 2px 2px 0 rgba(18,30,57,.04);box-shadow:0 2px 2px #121e390a;color:#707684;text-align:center;cursor:pointer}@media (hover: hover){.cdx-button:hover{background:#FBFCFE;-webkit-box-shadow:0 1px 3px 0 rgba(18,30,57,.08);box-shadow:0 1px 3px #121e3914}}.cdx-button svg{height:20px;margin-right:.2em;margin-top:-2px}.ce-stub{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:12px 18px;margin:10px 0;border-radius:10px;background:#eff2f5;border:1px solid #EFF0F1;color:#707684;font-size:14px}.ce-stub svg{width:20px;height:20px}.ce-stub__info{margin-left:14px}.ce-stub__title{font-weight:500;text-transform:capitalize}.codex-editor.codex-editor--rtl{direction:rtl}.codex-editor.codex-editor--rtl .cdx-list{padding-left:0;padding-right:40px}.codex-editor.codex-editor--rtl .ce-toolbar__plus{right:-26px;left:auto}.codex-editor.codex-editor--rtl .ce-toolbar__actions{right:auto;left:-26px}@media (max-width: 650px){.codex-editor.codex-editor--rtl .ce-toolbar__actions{margin-left:0;margin-right:auto;padding-right:0;padding-left:10px}}.codex-editor.codex-editor--rtl .ce-settings{left:5px;right:auto}.codex-editor.codex-editor--rtl .ce-settings:before{right:auto;left:25px}.codex-editor.codex-editor--rtl .ce-settings__button:not(:nth-child(3n+3)){margin-left:3px;margin-right:0}.codex-editor.codex-editor--rtl .ce-conversion-tool__icon{margin-right:0;margin-left:10px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown{border-right:0px solid transparent;border-left:1px solid rgba(201,201,204,.48);margin:0 -6px 0 6px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown .icon--toggler-down{margin-left:0;margin-right:4px}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__plus{left:0;right:5px}}@media (min-width: 651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__actions{left:-5px}}.cdx-search-field{--icon-margin-right: 10px;background:#F8F8F8;border:1px solid rgba(226,226,229,.2);border-radius:6px;padding:2px;display:grid;grid-template-columns:auto auto 1fr;grid-template-rows:auto}.cdx-search-field__icon{width:26px;height:26px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-right:var(--icon-margin-right)}.cdx-search-field__icon svg{width:20px;height:20px;color:#707684}.cdx-search-field__input{font-size:14px;outline:none;font-weight:500;font-family:inherit;border:0;background:transparent;margin:0;padding:0;line-height:22px;min-width:calc(100% - 26px - var(--icon-margin-right))}.cdx-search-field__input::-webkit-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::-moz-placeholder{color:#707684;font-weight:500}.cdx-search-field__input:-ms-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::-ms-input-placeholder{color:#707684;font-weight:500}.cdx-search-field__input::placeholder{color:#707684;font-weight:500}.ce-popover{--border-radius: 6px;--width: 200px;--max-height: 270px;--padding: 6px;--offset-from-target: 8px;--color-border: #EFF0F1;--color-shadow: rgba(13, 20, 33, .1);--color-background: white;--color-text-primary: black;--color-text-secondary: #707684;--color-border-icon: rgba(201, 201, 204, .48);--color-border-icon-disabled: #EFF0F1;--color-text-icon-active: #388AE5;--color-background-icon-active: rgba(56, 138, 229, .1);--color-background-item-focus: rgba(34, 186, 255, .08);--color-shadow-item-focus: rgba(7, 161, 227, .08);--color-background-item-hover: #F8F8F8;--color-background-item-confirm: #E24A4A;--color-background-item-confirm-hover: #CE4343;--popover-top: calc(100% + var(--offset-from-target));--popover-left: 0;--nested-popover-overlap: 4px;--icon-size: 20px;--item-padding: 3px;--item-height: calc(var(--icon-size) + 2 * var(--item-padding))}.ce-popover__container{min-width:var(--width);width:var(--width);max-height:var(--max-height);border-radius:var(--border-radius);overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-box-shadow:0px 3px 15px -3px var(--color-shadow);box-shadow:0 3px 15px -3px var(--color-shadow);position:absolute;left:var(--popover-left);top:var(--popover-top);background:var(--color-background);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;z-index:4;opacity:0;max-height:0;pointer-events:none;padding:0;border:none}.ce-popover--opened>.ce-popover__container{opacity:1;padding:var(--padding);max-height:var(--max-height);pointer-events:auto;-webkit-animation:panelShowing .1s ease;animation:panelShowing .1s ease;border:1px solid var(--color-border)}@media (max-width: 650px){.ce-popover--opened>.ce-popover__container{-webkit-animation:panelShowingMobile .25s ease;animation:panelShowingMobile .25s ease}}.ce-popover--open-top .ce-popover__container{--popover-top: calc(-1 * (var(--offset-from-target) + var(--popover-height)))}.ce-popover--open-left .ce-popover__container{--popover-left: calc(-1 * var(--width) + 100%)}.ce-popover__items{overflow-y:auto;-ms-scroll-chaining:none;overscroll-behavior:contain}@media (max-width: 650px){.ce-popover__overlay{position:fixed;top:0;bottom:0;left:0;right:0;background:#1D202B;z-index:3;opacity:.5;-webkit-transition:opacity .12s ease-in;transition:opacity .12s ease-in;will-change:opacity;visibility:visible}}.ce-popover__overlay--hidden{display:none}@media (max-width: 650px){.ce-popover .ce-popover__container{--offset: 5px;position:fixed;max-width:none;min-width:calc(100% - var(--offset) * 2);left:var(--offset);right:var(--offset);bottom:calc(var(--offset) + env(safe-area-inset-bottom));top:auto;border-radius:10px}}.ce-popover__search{margin-bottom:5px}.ce-popover__nothing-found-message{color:#707684;display:none;cursor:default;padding:3px;font-size:14px;line-height:20px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ce-popover__nothing-found-message--displayed{display:block}.ce-popover--nested .ce-popover__container{--popover-left: calc(var(--nesting-level) * (var(--width) - var(--nested-popover-overlap)));top:calc(var(--trigger-item-top) - var(--nested-popover-overlap));position:absolute}.ce-popover--open-top.ce-popover--nested .ce-popover__container{top:calc(var(--trigger-item-top) - var(--popover-height) + var(--item-height) + var(--offset-from-target) + var(--nested-popover-overlap))}.ce-popover--open-left .ce-popover--nested .ce-popover__container{--popover-left: calc(-1 * (var(--nesting-level) + 1) * var(--width) + 100%)}.ce-popover-item-separator{padding:4px 3px}.ce-popover-item-separator--hidden{display:none}.ce-popover-item-separator__line{height:1px;background:var(--color-border);width:100%}.ce-popover-item-html--hidden{display:none}.ce-popover-item{--border-radius: 6px;border-radius:var(--border-radius);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:var(--item-padding);color:var(--color-text-primary);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;background:transparent}@media (max-width: 650px){.ce-popover-item{padding:4px}}.ce-popover-item:not(:last-of-type){margin-bottom:1px}.ce-popover-item__icon{width:26px;height:26px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.ce-popover-item__icon svg{width:20px;height:20px}@media (max-width: 650px){.ce-popover-item__icon{width:36px;height:36px;border-radius:8px}.ce-popover-item__icon svg{width:28px;height:28px}}.ce-popover-item__icon--tool{margin-right:4px}.ce-popover-item__title{font-size:14px;line-height:20px;font-weight:500;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;margin-right:auto}@media (max-width: 650px){.ce-popover-item__title{font-size:16px}}.ce-popover-item__secondary-title{color:var(--color-text-secondary);font-size:12px;white-space:nowrap;letter-spacing:-.1em;padding-right:5px;opacity:.6}@media (max-width: 650px){.ce-popover-item__secondary-title{display:none}}.ce-popover-item--active{background:var(--color-background-icon-active);color:var(--color-text-icon-active)}.ce-popover-item--disabled{color:var(--color-text-secondary);cursor:default;pointer-events:none}.ce-popover-item--focused:not(.ce-popover-item--no-focus){background:var(--color-background-item-focus)!important}.ce-popover-item--hidden{display:none}@media (hover: hover){.ce-popover-item:hover{cursor:pointer}.ce-popover-item:hover:not(.ce-popover-item--no-hover){background-color:var(--color-background-item-hover)}}.ce-popover-item--confirmation{background:var(--color-background-item-confirm)}.ce-popover-item--confirmation .ce-popover-item__title,.ce-popover-item--confirmation .ce-popover-item__icon{color:#fff}@media (hover: hover){.ce-popover-item--confirmation:not(.ce-popover-item--no-hover):hover{background:var(--color-background-item-confirm-hover)}}.ce-popover-item--confirmation:not(.ce-popover-item--no-focus).ce-popover-item--focused{background:var(--color-background-item-confirm-hover)!important}@-webkit-keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@-webkit-keyframes panelShowingMobile{0%{opacity:0;-webkit-transform:translateY(14px) scale(.98);transform:translateY(14px) scale(.98)}70%{opacity:1;-webkit-transform:translateY(-4px);transform:translateY(-4px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowingMobile{0%{opacity:0;-webkit-transform:translateY(14px) scale(.98);transform:translateY(14px) scale(.98)}70%{opacity:1;-webkit-transform:translateY(-4px);transform:translateY(-4px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}.wobble{-webkit-animation-name:wobble;animation-name:wobble;-webkit-animation-duration:.4s;animation-duration:.4s}@-webkit-keyframes wobble{0%{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-9%,0,0);transform:translate3d(-9%,0,0)}30%{-webkit-transform:translate3d(9%,0,0);transform:translate3d(9%,0,0)}45%{-webkit-transform:translate3d(-4%,0,0);transform:translate3d(-4%,0,0)}60%{-webkit-transform:translate3d(4%,0,0);transform:translate3d(4%,0,0)}75%{-webkit-transform:translate3d(-1%,0,0);transform:translate3d(-1%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}}@keyframes wobble{0%{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-9%,0,0);transform:translate3d(-9%,0,0)}30%{-webkit-transform:translate3d(9%,0,0);transform:translate3d(9%,0,0)}45%{-webkit-transform:translate3d(-4%,0,0);transform:translate3d(-4%,0,0)}60%{-webkit-transform:translate3d(4%,0,0);transform:translate3d(4%,0,0)}75%{-webkit-transform:translate3d(-1%,0,0);transform:translate3d(-1%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translateZ(0)}}.ce-popover-header{margin-bottom:8px;margin-top:4px;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-popover-header__text{font-size:18px;font-weight:600}.ce-popover-header__back-button{border:0;background:transparent;width:36px;height:36px;color:var(--color-text-primary)}.ce-popover-header__back-button svg{display:block;width:28px;height:28px}.ce-popover--inline{--height: 38px;--height-mobile: 46px;--container-padding: 4px;position:relative}.ce-popover--inline .ce-popover__custom-content{margin-bottom:0}.ce-popover--inline .ce-popover__items{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-popover--inline .ce-popover__container{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;padding:var(--container-padding);height:var(--height);top:0;min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;width:-webkit-max-content;width:-moz-max-content;width:max-content;-webkit-animation:none;animation:none}@media (max-width: 650px){.ce-popover--inline .ce-popover__container{height:var(--height-mobile);position:absolute}}.ce-popover--inline .ce-popover-item-separator{padding:0 4px}.ce-popover--inline .ce-popover-item-separator__line{height:100%;width:1px}.ce-popover--inline .ce-popover-item{border-radius:4px;padding:4px}.ce-popover--inline .ce-popover-item__icon--tool{-webkit-box-shadow:none;box-shadow:none;background:transparent;margin-right:0}.ce-popover--inline .ce-popover-item__icon{width:auto;width:initial;height:auto;height:initial}.ce-popover--inline .ce-popover-item__icon svg{width:20px;height:20px}@media (max-width: 650px){.ce-popover--inline .ce-popover-item__icon svg{width:28px;height:28px}}.ce-popover--inline .ce-popover-item:not(:last-of-type){margin-bottom:0;margin-bottom:initial}.ce-popover--inline .ce-popover-item-html{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-popover--inline .ce-popover-item__icon--chevron-right{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ce-popover--inline .ce-popover--nested-level-1 .ce-popover__container{--offset: 3px;left:0;top:calc(var(--height) + var(--offset))}@media (max-width: 650px){.ce-popover--inline .ce-popover--nested-level-1 .ce-popover__container{top:calc(var(--height-mobile) + var(--offset))}}.ce-popover--inline .ce-popover--nested .ce-popover__container{min-width:var(--width);width:var(--width);height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;padding:6px;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column}.ce-popover--inline .ce-popover--nested .ce-popover__items{display:block;width:100%}.ce-popover--inline .ce-popover--nested .ce-popover-item{border-radius:6px;padding:3px}@media (max-width: 650px){.ce-popover--inline .ce-popover--nested .ce-popover-item{padding:4px}}.ce-popover--inline .ce-popover--nested .ce-popover-item__icon--tool{margin-right:4px}.ce-popover--inline .ce-popover--nested .ce-popover-item__icon{width:26px;height:26px}.ce-popover--inline .ce-popover--nested .ce-popover-item-separator{padding:4px 3px}.ce-popover--inline .ce-popover--nested .ce-popover-item-separator__line{width:100%;height:1px}.codex-editor [data-placeholder]:empty:before,.codex-editor [data-placeholder][data-empty=true]:before{pointer-events:none;color:#707684;cursor:text;content:attr(data-placeholder)}.codex-editor [data-placeholder-active]:empty:before,.codex-editor [data-placeholder-active][data-empty=true]:before{pointer-events:none;color:#707684;cursor:text}.codex-editor [data-placeholder-active]:empty:focus:before,.codex-editor [data-placeholder-active][data-empty=true]:focus:before{content:attr(data-placeholder-active)}
`;
var Ia = class extends E {
  constructor() {
    super(...arguments), this.isMobile = false, this.contentRectCache = null, this.resizeDebouncer = Eo(() => {
      this.windowResize();
    }, 200), this.selectionChangeDebounced = Eo(() => {
      this.selectionChanged();
    }, da), this.documentTouchedListener = (e) => {
      this.documentTouched(e);
    };
  }
  /**
   * Editor.js UI CSS class names
   *
   * @returns {{editorWrapper: string, editorZone: string}}
   */
  get CSS() {
    return {
      editorWrapper: "codex-editor",
      editorWrapperNarrow: "codex-editor--narrow",
      editorZone: "codex-editor__redactor",
      editorZoneHidden: "codex-editor__redactor--hidden",
      editorEmpty: "codex-editor--empty",
      editorRtlFix: "codex-editor--rtl"
    };
  }
  /**
   * Return Width of center column of Editor
   *
   * @returns {DOMRect}
   */
  get contentRect() {
    if (this.contentRectCache !== null)
      return this.contentRectCache;
    const e = this.nodes.wrapper.querySelector(`.${R.CSS.content}`);
    return e ? (this.contentRectCache = e.getBoundingClientRect(), this.contentRectCache) : {
      width: 650,
      left: 0,
      right: 0
    };
  }
  /**
   * Making main interface
   */
  async prepare() {
    this.setIsMobile(), this.make(), this.loadStyles();
  }
  /**
   * Toggle read-only state
   *
   * If readOnly is true:
   *  - removes all listeners from main UI module elements
   *
   * if readOnly is false:
   *  - enables all listeners to UI module elements
   *
   * @param {boolean} readOnlyEnabled - "read only" state
   */
  toggleReadOnly(e) {
    e ? this.unbindReadOnlySensitiveListeners() : window.requestIdleCallback(() => {
      this.bindReadOnlySensitiveListeners();
    }, {
      timeout: 2e3
    });
  }
  /**
   * Check if Editor is empty and set CSS class to wrapper
   */
  checkEmptiness() {
    const { BlockManager: e } = this.Editor;
    this.nodes.wrapper.classList.toggle(this.CSS.editorEmpty, e.isEditorEmpty);
  }
  /**
   * Check if one of Toolbar is opened
   * Used to prevent global keydowns (for example, Enter) conflicts with Enter-on-toolbar
   *
   * @returns {boolean}
   */
  get someToolbarOpened() {
    const { Toolbar: e, BlockSettings: t, InlineToolbar: o3 } = this.Editor;
    return !!(t.opened || o3.opened || e.toolbox.opened);
  }
  /**
   * Check for some Flipper-buttons is under focus
   */
  get someFlipperButtonFocused() {
    return this.Editor.Toolbar.toolbox.hasFocus() ? true : Object.entries(this.Editor).filter(([e, t]) => t.flipper instanceof ce).some(([e, t]) => t.flipper.hasFocus());
  }
  /**
   * Clean editor`s UI
   */
  destroy() {
    this.nodes.holder.innerHTML = "", this.unbindReadOnlyInsensitiveListeners();
  }
  /**
   * Close all Editor's toolbars
   */
  closeAllToolbars() {
    const { Toolbar: e, BlockSettings: t, InlineToolbar: o3 } = this.Editor;
    t.close(), o3.close(), e.toolbox.close();
  }
  /**
   * Check for mobile mode and save the result
   */
  setIsMobile() {
    const e = window.innerWidth < Ro;
    e !== this.isMobile && this.eventsDispatcher.emit(Te, {
      isEnabled: this.isMobile
    }), this.isMobile = e;
  }
  /**
   * Makes Editor.js interface
   */
  make() {
    this.nodes.holder = u.getHolder(this.config.holder), this.nodes.wrapper = u.make(
      "div",
      [
        this.CSS.editorWrapper,
        ...this.isRtl ? [this.CSS.editorRtlFix] : []
      ]
    ), this.nodes.redactor = u.make("div", this.CSS.editorZone), this.nodes.holder.offsetWidth < this.contentRect.width && this.nodes.wrapper.classList.add(this.CSS.editorWrapperNarrow), this.nodes.redactor.style.paddingBottom = this.config.minHeight + "px", this.nodes.wrapper.appendChild(this.nodes.redactor), this.nodes.holder.appendChild(this.nodes.wrapper), this.bindReadOnlyInsensitiveListeners();
  }
  /**
   * Appends CSS
   */
  loadStyles() {
    const e = "editor-js-styles";
    if (u.get(e))
      return;
    const t = u.make("style", null, {
      id: e,
      textContent: Sa.toString()
    });
    this.config.style && !V(this.config.style) && this.config.style.nonce && t.setAttribute("nonce", this.config.style.nonce), u.prepend(document.head, t);
  }
  /**
   * Adds listeners that should work both in read-only and read-write modes
   */
  bindReadOnlyInsensitiveListeners() {
    this.listeners.on(document, "selectionchange", this.selectionChangeDebounced), this.listeners.on(window, "resize", this.resizeDebouncer, {
      passive: true
    }), this.listeners.on(this.nodes.redactor, "mousedown", this.documentTouchedListener, {
      capture: true,
      passive: true
    }), this.listeners.on(this.nodes.redactor, "touchstart", this.documentTouchedListener, {
      capture: true,
      passive: true
    });
  }
  /**
   * Removes listeners that should work both in read-only and read-write modes
   */
  unbindReadOnlyInsensitiveListeners() {
    this.listeners.off(document, "selectionchange", this.selectionChangeDebounced), this.listeners.off(window, "resize", this.resizeDebouncer), this.listeners.off(this.nodes.redactor, "mousedown", this.documentTouchedListener), this.listeners.off(this.nodes.redactor, "touchstart", this.documentTouchedListener);
  }
  /**
   * Adds listeners that should work only in read-only mode
   */
  bindReadOnlySensitiveListeners() {
    this.readOnlyMutableListeners.on(this.nodes.redactor, "click", (e) => {
      this.redactorClicked(e);
    }, false), this.readOnlyMutableListeners.on(document, "keydown", (e) => {
      this.documentKeydown(e);
    }, true), this.readOnlyMutableListeners.on(document, "mousedown", (e) => {
      this.documentClicked(e);
    }, true), this.watchBlockHoveredEvents(), this.enableInputsEmptyMark();
  }
  /**
   * Listen redactor mousemove to emit 'block-hovered' event
   */
  watchBlockHoveredEvents() {
    let e;
    this.readOnlyMutableListeners.on(this.nodes.redactor, "mousemove", dt((t) => {
      const o3 = t.target.closest(".ce-block");
      this.Editor.BlockSelection.anyBlockSelected || o3 && e !== o3 && (e = o3, this.eventsDispatcher.emit(ln, {
        block: this.Editor.BlockManager.getBlockByChildNode(o3)
      }));
    }, 20), {
      passive: true
    });
  }
  /**
   * Unbind events that should work only in read-only mode
   */
  unbindReadOnlySensitiveListeners() {
    this.readOnlyMutableListeners.clearAll();
  }
  /**
   * Resize window handler
   */
  windowResize() {
    this.contentRectCache = null, this.setIsMobile();
  }
  /**
   * All keydowns on document
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  documentKeydown(e) {
    switch (e.keyCode) {
      case y.ENTER:
        this.enterPressed(e);
        break;
      case y.BACKSPACE:
      case y.DELETE:
        this.backspacePressed(e);
        break;
      case y.ESC:
        this.escapePressed(e);
        break;
      default:
        this.defaultBehaviour(e);
        break;
    }
  }
  /**
   * Ignore all other document's keydown events
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  defaultBehaviour(e) {
    const { currentBlock: t } = this.Editor.BlockManager, o3 = e.target.closest(`.${this.CSS.editorWrapper}`), i = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    if (t !== void 0 && o3 === null) {
      this.Editor.BlockEvents.keydown(e);
      return;
    }
    o3 || t && i || (this.Editor.BlockManager.unsetCurrentBlock(), this.Editor.Toolbar.close());
  }
  /**
   * @param {KeyboardEvent} event - keyboard event
   */
  backspacePressed(e) {
    const { BlockManager: t, BlockSelection: o3, Caret: i } = this.Editor;
    if (o3.anyBlockSelected && !b.isSelectionExists) {
      const s2 = t.removeSelectedBlocks(), r2 = t.insertDefaultBlockAtIndex(s2, true);
      i.setToBlock(r2, i.positions.START), o3.clearSelection(e), e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation();
    }
  }
  /**
   * Escape pressed
   * If some of Toolbar components are opened, then close it otherwise close Toolbar
   *
   * @param {Event} event - escape keydown event
   */
  escapePressed(e) {
    this.Editor.BlockSelection.clearSelection(e), this.Editor.Toolbar.toolbox.opened ? (this.Editor.Toolbar.toolbox.close(), this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock, this.Editor.Caret.positions.END)) : this.Editor.BlockSettings.opened ? this.Editor.BlockSettings.close() : this.Editor.InlineToolbar.opened ? this.Editor.InlineToolbar.close() : this.Editor.Toolbar.close();
  }
  /**
   * Enter pressed on document
   *
   * @param {KeyboardEvent} event - keyboard event
   */
  enterPressed(e) {
    const { BlockManager: t, BlockSelection: o3 } = this.Editor;
    if (this.someToolbarOpened)
      return;
    const i = t.currentBlockIndex >= 0;
    if (o3.anyBlockSelected && !b.isSelectionExists) {
      o3.clearSelection(e), e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation();
      return;
    }
    if (!this.someToolbarOpened && i && e.target.tagName === "BODY") {
      const s2 = this.Editor.BlockManager.insert();
      e.preventDefault(), this.Editor.Caret.setToBlock(s2), this.Editor.Toolbar.moveAndOpen(s2);
    }
    this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * All clicks on document
   *
   * @param {MouseEvent} event - Click event
   */
  documentClicked(e) {
    var a3, l2;
    if (!e.isTrusted)
      return;
    const t = e.target;
    this.nodes.holder.contains(t) || b.isAtEditor || (this.Editor.BlockManager.unsetCurrentBlock(), this.Editor.Toolbar.close());
    const i = (a3 = this.Editor.BlockSettings.nodes.wrapper) == null ? void 0 : a3.contains(t), s2 = (l2 = this.Editor.Toolbar.nodes.settingsToggler) == null ? void 0 : l2.contains(t), r2 = i || s2;
    if (this.Editor.BlockSettings.opened && !r2) {
      this.Editor.BlockSettings.close();
      const c5 = this.Editor.BlockManager.getBlockByChildNode(t);
      this.Editor.Toolbar.moveAndOpen(c5);
    }
    this.Editor.BlockSelection.clearSelection(e);
  }
  /**
   * First touch on editor
   * Fired before click
   *
   * Used to change current block — we need to do it before 'selectionChange' event.
   * Also:
   * - Move and show the Toolbar
   * - Set a Caret
   *
   * @param event - touch or mouse event
   */
  documentTouched(e) {
    let t = e.target;
    if (t === this.nodes.redactor) {
      const o3 = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX, i = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      t = document.elementFromPoint(o3, i);
    }
    try {
      this.Editor.BlockManager.setCurrentBlockByChildNode(t);
    } catch {
      this.Editor.RectangleSelection.isRectActivated() || this.Editor.Caret.setToTheLastBlock();
    }
    this.Editor.ReadOnly.isEnabled || this.Editor.Toolbar.moveAndOpen();
  }
  /**
   * All clicks on the redactor zone
   *
   * @param {MouseEvent} event - click event
   * @description
   * - By clicks on the Editor's bottom zone:
   *      - if last Block is empty, set a Caret to this
   *      - otherwise, add a new empty Block and set a Caret to that
   */
  redactorClicked(e) {
    if (!b.isCollapsed)
      return;
    const t = e.target, o3 = e.metaKey || e.ctrlKey;
    if (u.isAnchor(t) && o3) {
      e.stopImmediatePropagation(), e.stopPropagation();
      const i = t.getAttribute("href"), s2 = oi(i);
      ii(s2);
      return;
    }
    this.processBottomZoneClick(e);
  }
  /**
   * Check if user clicks on the Editor's bottom zone:
   *  - set caret to the last block
   *  - or add new empty block
   *
   * @param event - click event
   */
  processBottomZoneClick(e) {
    const t = this.Editor.BlockManager.getBlockByIndex(-1), o3 = u.offset(t.holder).bottom, i = e.pageY, { BlockSelection: s2 } = this.Editor;
    if (e.target instanceof Element && e.target.isEqualNode(this.nodes.redactor) && /**
    * If there is cross block selection started, target will be equal to redactor so we need additional check
    */
    !s2.anyBlockSelected && /**
    * Prevent caret jumping (to last block) when clicking between blocks
    */
    o3 < i) {
      e.stopImmediatePropagation(), e.stopPropagation();
      const { BlockManager: a3, Caret: l2, Toolbar: c5 } = this.Editor;
      (!a3.lastBlock.tool.isDefault || !a3.lastBlock.isEmpty) && a3.insertAtEnd(), l2.setToTheLastBlock(), c5.moveAndOpen(a3.lastBlock);
    }
  }
  /**
   * Handle selection changes on mobile devices
   * Uses for showing the Inline Toolbar
   */
  selectionChanged() {
    const { CrossBlockSelection: e, BlockSelection: t } = this.Editor, o3 = b.anchorElement;
    if (e.isCrossBlockSelectionStarted && t.anyBlockSelected && b.get().removeAllRanges(), !o3) {
      b.range || this.Editor.InlineToolbar.close();
      return;
    }
    const i = o3.closest(`.${R.CSS.content}`);
    (i === null || i.closest(`.${b.CSS.editorWrapper}`) !== this.nodes.wrapper) && (this.Editor.InlineToolbar.containsNode(o3) || this.Editor.InlineToolbar.close(), !(o3.dataset.inlineToolbar === "true")) || (this.Editor.BlockManager.currentBlock || this.Editor.BlockManager.setCurrentBlockByChildNode(o3), this.Editor.InlineToolbar.tryToShow(true));
  }
  /**
   * Editor.js provides and ability to show placeholders for empty contenteditable elements
   *
   * This method watches for input and focus events and toggles 'data-empty' attribute
   * to workaroud the case, when inputs contains only <br>s and has no visible content
   * Then, CSS could rely on this attribute to show placeholders
   */
  enableInputsEmptyMark() {
    function e(t) {
      const o3 = t.target;
      Do(o3);
    }
    this.readOnlyMutableListeners.on(this.nodes.wrapper, "input", e), this.readOnlyMutableListeners.on(this.nodes.wrapper, "focusin", e), this.readOnlyMutableListeners.on(this.nodes.wrapper, "focusout", e);
  }
};
var Oa = {
  // API Modules
  BlocksAPI: gi,
  CaretAPI: bi,
  EventsAPI: vi,
  I18nAPI: kt,
  API: ki,
  InlineToolbarAPI: yi,
  ListenersAPI: wi,
  NotifierAPI: Ci,
  ReadOnlyAPI: Ti,
  SanitizerAPI: Li,
  SaverAPI: Pi,
  SelectionAPI: Ni,
  ToolsAPI: Ri,
  StylesAPI: Di,
  ToolbarAPI: Fi,
  TooltipAPI: Ui,
  UiAPI: Wi,
  // Toolbar Modules
  BlockSettings: ms,
  Toolbar: Bs,
  InlineToolbar: Cs,
  // Modules
  BlockEvents: na,
  BlockManager: ra,
  BlockSelection: aa,
  Caret: Ye,
  CrossBlockSelection: la,
  DragNDrop: ca,
  ModificationsObserver: ha,
  Paste: pa,
  ReadOnly: fa,
  RectangleSelection: Be,
  Renderer: ga,
  Saver: ma,
  Tools: Wn,
  UI: Ia
};
var _a = class {
  /**
   * @param {EditorConfig} config - user configuration
   */
  constructor(e) {
    this.moduleInstances = {}, this.eventsDispatcher = new Oe();
    let t, o3;
    this.isReady = new Promise((i, s2) => {
      t = i, o3 = s2;
    }), Promise.resolve().then(async () => {
      this.configuration = e, this.validate(), this.init(), await this.start(), await this.render();
      const { BlockManager: i, Caret: s2, UI: r2, ModificationsObserver: a3 } = this.moduleInstances;
      r2.checkEmptiness(), a3.enable(), this.configuration.autofocus === true && this.configuration.readOnly !== true && s2.setToBlock(i.blocks[0], s2.positions.START), t();
    }).catch((i) => {
      S(`Editor.js is not ready because of ${i}`, "error"), o3(i);
    });
  }
  /**
   * Setting for configuration
   *
   * @param {EditorConfig|string} config - Editor's config to set
   */
  set configuration(e) {
    var o3, i;
    D(e) ? this.config = {
      ...e
    } : this.config = {
      holder: e
    }, ht(!!this.config.holderId, "config.holderId", "config.holder"), this.config.holderId && !this.config.holder && (this.config.holder = this.config.holderId, this.config.holderId = null), this.config.holder == null && (this.config.holder = "editorjs"), this.config.logLevel || (this.config.logLevel = Lo.VERBOSE), Zn(this.config.logLevel), ht(!!this.config.initialBlock, "config.initialBlock", "config.defaultBlock"), this.config.defaultBlock = this.config.defaultBlock || this.config.initialBlock || "paragraph", this.config.minHeight = this.config.minHeight !== void 0 ? this.config.minHeight : 300;
    const t = {
      type: this.config.defaultBlock,
      data: {}
    };
    this.config.placeholder = this.config.placeholder || false, this.config.sanitizer = this.config.sanitizer || {
      p: true,
      b: true,
      a: true
    }, this.config.hideToolbar = this.config.hideToolbar ? this.config.hideToolbar : false, this.config.tools = this.config.tools || {}, this.config.i18n = this.config.i18n || {}, this.config.data = this.config.data || { blocks: [] }, this.config.onReady = this.config.onReady || (() => {
    }), this.config.onChange = this.config.onChange || (() => {
    }), this.config.inlineToolbar = this.config.inlineToolbar !== void 0 ? this.config.inlineToolbar : true, (V(this.config.data) || !this.config.data.blocks || this.config.data.blocks.length === 0) && (this.config.data = { blocks: [t] }), this.config.readOnly = this.config.readOnly || false, (o3 = this.config.i18n) != null && o3.messages && z.setDictionary(this.config.i18n.messages), this.config.i18n.direction = ((i = this.config.i18n) == null ? void 0 : i.direction) || "ltr";
  }
  /**
   * Returns private property
   *
   * @returns {EditorConfig}
   */
  get configuration() {
    return this.config;
  }
  /**
   * Checks for required fields in Editor's config
   */
  validate() {
    const { holderId: e, holder: t } = this.config;
    if (e && t)
      throw Error("\xABholderId\xBB and \xABholder\xBB param can't assign at the same time.");
    if (te(t) && !u.get(t))
      throw Error(`element with ID \xAB${t}\xBB is missing. Pass correct holder's ID.`);
    if (t && D(t) && !u.isElement(t))
      throw Error("\xABholder\xBB value must be an Element node");
  }
  /**
   * Initializes modules:
   *  - make and save instances
   *  - configure
   */
  init() {
    this.constructModules(), this.configureModules();
  }
  /**
   * Start Editor!
   *
   * Get list of modules that needs to be prepared and return a sequence (Promise)
   *
   * @returns {Promise<void>}
   */
  async start() {
    await [
      "Tools",
      "UI",
      "BlockManager",
      "Paste",
      "BlockSelection",
      "RectangleSelection",
      "CrossBlockSelection",
      "ReadOnly"
    ].reduce(
      (t, o3) => t.then(async () => {
        try {
          await this.moduleInstances[o3].prepare();
        } catch (i) {
          if (i instanceof Ho)
            throw new Error(i.message);
          S(`Module ${o3} was skipped because of %o`, "warn", i);
        }
      }),
      Promise.resolve()
    );
  }
  /**
   * Render initial data
   */
  render() {
    return this.moduleInstances.Renderer.render(this.config.data.blocks);
  }
  /**
   * Make modules instances and save it to the @property this.moduleInstances
   */
  constructModules() {
    Object.entries(Oa).forEach(([e, t]) => {
      try {
        this.moduleInstances[e] = new t({
          config: this.configuration,
          eventsDispatcher: this.eventsDispatcher
        });
      } catch (o3) {
        S("[constructModules]", `Module ${e} skipped because`, "error", o3);
      }
    });
  }
  /**
   * Modules instances configuration:
   *  - pass other modules to the 'state' property
   *  - ...
   */
  configureModules() {
    for (const e in this.moduleInstances)
      Object.prototype.hasOwnProperty.call(this.moduleInstances, e) && (this.moduleInstances[e].state = this.getModulesDiff(e));
  }
  /**
   * Return modules without passed name
   *
   * @param {string} name - module for witch modules difference should be calculated
   */
  getModulesDiff(e) {
    const t = {};
    for (const o3 in this.moduleInstances)
      o3 !== e && (t[o3] = this.moduleInstances[o3]);
    return t;
  }
};
var Aa = class {
  /** Editor version */
  static get version() {
    return "2.31.1";
  }
  /**
   * @param {EditorConfig|string|undefined} [configuration] - user configuration
   */
  constructor(e) {
    let t = () => {
    };
    D(e) && A(e.onReady) && (t = e.onReady);
    const o3 = new _a(e);
    this.isReady = o3.isReady.then(() => {
      this.exportAPI(o3), t();
    });
  }
  /**
   * Export external API methods
   *
   * @param {Core} editor — Editor's instance
   */
  exportAPI(e) {
    const t = ["configuration"], o3 = () => {
      Object.values(e.moduleInstances).forEach((s2) => {
        A(s2.destroy) && s2.destroy(), s2.listeners.removeAll();
      }), zi(), e = null;
      for (const s2 in this)
        Object.prototype.hasOwnProperty.call(this, s2) && delete this[s2];
      Object.setPrototypeOf(this, null);
    };
    t.forEach((s2) => {
      this[s2] = e[s2];
    }), this.destroy = o3, Object.setPrototypeOf(this, e.moduleInstances.API.methods), delete this.exportAPI, Object.entries({
      blocks: {
        clear: "clear",
        render: "render"
      },
      caret: {
        focus: "focus"
      },
      events: {
        on: "on",
        off: "off",
        emit: "emit"
      },
      saver: {
        save: "save"
      }
    }).forEach(([s2, r2]) => {
      Object.entries(r2).forEach(([a3, l2]) => {
        this[l2] = e.moduleInstances.API.methods[s2][a3];
      });
    });
  }
};

// ../../node_modules/@editorjs/header/dist/header.mjs
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.appendChild(document.createTextNode(".ce-header{padding:.6em 0 3px;margin:0;line-height:1.25em;outline:none}.ce-header p,.ce-header div{padding:0!important;margin:0!important}")), document.head.appendChild(e);
    }
  } catch (n2) {
    console.error("vite-plugin-css-injected-by-js", n2);
  }
})();
var a = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19 17V10.2135C19 10.1287 18.9011 10.0824 18.836 10.1367L16 12.5"/></svg>';
var l = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10 19 9.5 19 12C19 13.9771 16.0684 13.9997 16.0012 16.8981C15.9999 16.9533 16.0448 17 16.1 17L19.3 17"/></svg>';
var o = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 11C16 10.5 16.8323 10 17.6 10C18.3677 10 19.5 10.311 19.5 11.5C19.5 12.5315 18.7474 12.9022 18.548 12.9823C18.5378 12.9864 18.5395 13.0047 18.5503 13.0063C18.8115 13.0456 20 13.3065 20 14.8C20 16 19.5 17 17.8 17C17.8 17 16 17 16 16.3"/></svg>';
var h = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 10L15.2834 14.8511C15.246 14.9178 15.294 15 15.3704 15C16.8489 15 18.7561 15 20.2 15M19 17C19 15.7187 19 14.8813 19 13.6"/></svg>';
var d2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 15.9C16 15.9 16.3768 17 17.8 17C19.5 17 20 15.6199 20 14.7C20 12.7323 17.6745 12.0486 16.1635 12.9894C16.094 13.0327 16 12.9846 16 12.9027V10.1C16 10.0448 16.0448 10 16.1 10H19.8"/></svg>';
var u2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M6 7L6 12M6 17L6 12M6 12L12 12M12 7V12M12 17L12 12"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M19.5 10C16.5 10.5 16 13.3285 16 15M16 15V15C16 16.1046 16.8954 17 18 17H18.3246C19.3251 17 20.3191 16.3492 20.2522 15.3509C20.0612 12.4958 16 12.6611 16 15Z"/></svg>';
var g2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M9 7L9 12M9 17V12M9 12L15 12M15 7V12M15 17L15 12"/></svg>';
var v = class {
  constructor({ data: e, config: t, api: s2, readOnly: r2 }) {
    this.api = s2, this.readOnly = r2, this._settings = t, this._data = this.normalizeData(e), this._element = this.getTag();
  }
  /**
   * Styles
   */
  get _CSS() {
    return {
      block: this.api.styles.block,
      wrapper: "ce-header"
    };
  }
  /**
   * Check if data is valid
   * 
   * @param {any} data - data to check
   * @returns {data is HeaderData}
   * @private
   */
  isHeaderData(e) {
    return e.text !== void 0;
  }
  /**
   * Normalize input data
   *
   * @param {HeaderData} data - saved data to process
   *
   * @returns {HeaderData}
   * @private
   */
  normalizeData(e) {
    const t = { text: "", level: this.defaultLevel.number };
    return this.isHeaderData(e) && (t.text = e.text || "", e.level !== void 0 && !isNaN(parseInt(e.level.toString())) && (t.level = parseInt(e.level.toString()))), t;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLHeadingElement}
   * @public
   */
  render() {
    return this._element;
  }
  /**
   * Returns header block tunes config
   *
   * @returns {Array}
   */
  renderSettings() {
    return this.levels.map((e) => ({
      icon: e.svg,
      label: this.api.i18n.t(`Heading ${e.number}`),
      onActivate: () => this.setLevel(e.number),
      closeOnActivate: true,
      isActive: this.currentLevel.number === e.number,
      render: () => document.createElement("div")
    }));
  }
  /**
   * Callback for Block's settings buttons
   *
   * @param {number} level - level to set
   */
  setLevel(e) {
    this.data = {
      level: e,
      text: this.data.text
    };
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {HeaderData} data - saved data to merger with current block
   * @public
   */
  merge(e) {
    this._element.insertAdjacentHTML("beforeend", e.text);
  }
  /**
   * Validate Text block data:
   * - check for emptiness
   *
   * @param {HeaderData} blockData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(e) {
    return e.text.trim() !== "";
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */
  save(e) {
    return {
      text: e.innerHTML,
      level: this.currentLevel.number
    };
  }
  /**
   * Allow Header to be converted to/from other blocks
   */
  static get conversionConfig() {
    return {
      export: "text",
      // use 'text' property for other blocks
      import: "text"
      // fill 'text' property from other block's export string
    };
  }
  /**
   * Sanitizer Rules
   */
  static get sanitize() {
    return {
      level: false,
      text: {}
    };
  }
  /**
   * Returns true to notify core that read-only is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  get data() {
    return this._data.text = this._element.innerHTML, this._data.level = this.currentLevel.number, this._data;
  }
  /**
   * Store data in plugin:
   * - at the this._data property
   * - at the HTML
   *
   * @param {HeaderData} data — data to set
   * @private
   */
  set data(e) {
    if (this._data = this.normalizeData(e), e.level !== void 0 && this._element.parentNode) {
      const t = this.getTag();
      t.innerHTML = this._element.innerHTML, this._element.parentNode.replaceChild(t, this._element), this._element = t;
    }
    e.text !== void 0 && (this._element.innerHTML = this._data.text || "");
  }
  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
  getTag() {
    const e = document.createElement(this.currentLevel.tag);
    return e.innerHTML = this._data.text || "", e.classList.add(this._CSS.wrapper), e.contentEditable = this.readOnly ? "false" : "true", e.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || ""), e;
  }
  /**
   * Get current level
   *
   * @returns {level}
   */
  get currentLevel() {
    let e = this.levels.find((t) => t.number === this._data.level);
    return e || (e = this.defaultLevel), e;
  }
  /**
   * Return default level
   *
   * @returns {level}
   */
  get defaultLevel() {
    if (this._settings.defaultLevel) {
      const e = this.levels.find((t) => t.number === this._settings.defaultLevel);
      if (e)
        return e;
      console.warn("(\u0E07'\u0300-'\u0301)\u0E07 Heading Tool: the default level specified was not found in available levels");
    }
    return this.levels[1];
  }
  /**
   * @typedef {object} level
   * @property {number} number - level number
   * @property {string} tag - tag corresponds with level number
   * @property {string} svg - icon
   */
  /**
   * Available header levels
   *
   * @returns {level[]}
   */
  get levels() {
    const e = [
      {
        number: 1,
        tag: "H1",
        svg: a
      },
      {
        number: 2,
        tag: "H2",
        svg: l
      },
      {
        number: 3,
        tag: "H3",
        svg: o
      },
      {
        number: 4,
        tag: "H4",
        svg: h
      },
      {
        number: 5,
        tag: "H5",
        svg: d2
      },
      {
        number: 6,
        tag: "H6",
        svg: u2
      }
    ];
    return this._settings.levels ? e.filter(
      (t) => this._settings.levels.includes(t.number)
    ) : e;
  }
  /**
   * Handle H1-H6 tags on paste to substitute it with header Tool
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(e) {
    const t = e.detail;
    if ("data" in t) {
      const s2 = t.data;
      let r2 = this.defaultLevel.number;
      switch (s2.tagName) {
        case "H1":
          r2 = 1;
          break;
        case "H2":
          r2 = 2;
          break;
        case "H3":
          r2 = 3;
          break;
        case "H4":
          r2 = 4;
          break;
        case "H5":
          r2 = 5;
          break;
        case "H6":
          r2 = 6;
          break;
      }
      this._settings.levels && (r2 = this._settings.levels.reduce((n2, i) => Math.abs(i - r2) < Math.abs(n2 - r2) ? i : n2)), this.data = {
        level: r2,
        text: s2.innerHTML
      };
    }
  }
  /**
   * Used by Editor.js paste handling API.
   * Provides configuration to handle H1-H6 tags.
   *
   * @returns {{handler: (function(HTMLElement): {text: string}), tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: ["H1", "H2", "H3", "H4", "H5", "H6"]
    };
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: g2,
      title: "Heading"
    };
  }
};

// ../../node_modules/@editorjs/nested-list/dist/nested-list.mjs
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var e = document.createElement("style");
      e.appendChild(document.createTextNode('.cdx-nested-list{margin:0;padding:0;outline:none;counter-reset:item;list-style:none}.cdx-nested-list__item{line-height:1.6em;display:flex;margin:2px 0}.cdx-nested-list__item [contenteditable]{outline:none}.cdx-nested-list__item-body{flex-grow:2}.cdx-nested-list__item-content,.cdx-nested-list__item-children{flex-basis:100%}.cdx-nested-list__item-content{word-break:break-word;white-space:pre-wrap}.cdx-nested-list__item:before{counter-increment:item;margin-right:5px;white-space:nowrap}.cdx-nested-list--ordered>.cdx-nested-list__item:before{content:counters(item,".") ". "}.cdx-nested-list--unordered>.cdx-nested-list__item:before{content:"\u2022"}.cdx-nested-list__settings{display:flex}.cdx-nested-list__settings .cdx-settings-button{width:50%}')), document.head.appendChild(e);
    }
  } catch (t) {
    console.error("vite-plugin-css-injected-by-js", t);
  }
})();
function c2(d3) {
  return d3.nodeType === Node.ELEMENT_NODE;
}
function p2(d3, e = null, t) {
  const r2 = document.createElement(d3);
  Array.isArray(e) ? r2.classList.add(...e) : e && r2.classList.add(e);
  for (const n2 in t)
    r2[n2] = t[n2];
  return r2;
}
function g3(d3) {
  const e = p2("div");
  return e.appendChild(d3), e.innerHTML;
}
function C2(d3) {
  let e;
  return d3.nodeType !== Node.ELEMENT_NODE ? e = d3.textContent : (e = d3.innerHTML, e = e.replaceAll("<br>", "")), (e == null ? void 0 : e.trim().length) === 0;
}
var u3 = class {
  /**
   * Store internal properties
   */
  constructor() {
    this.savedFakeCaret = void 0;
  }
  /**
   * Saves caret position using hidden <span>
   *
   * @returns {void}
   */
  save() {
    const e = u3.range, t = p2("span");
    t.hidden = true, e && (e.insertNode(t), this.savedFakeCaret = t);
  }
  /**
   * Restores the caret position saved by the save() method
   *
   * @returns {void}
   */
  restore() {
    if (!this.savedFakeCaret)
      return;
    const e = window.getSelection();
    if (!e)
      return;
    const t = new Range();
    t.setStartAfter(this.savedFakeCaret), t.setEndAfter(this.savedFakeCaret), e.removeAllRanges(), e.addRange(t), setTimeout(() => {
      var r2;
      (r2 = this.savedFakeCaret) == null || r2.remove();
    }, 150);
  }
  /**
   * Returns the first range
   *
   * @returns {Range|null}
   */
  static get range() {
    const e = window.getSelection();
    return e && e.rangeCount ? e.getRangeAt(0) : null;
  }
  /**
   * Extract content fragment from Caret position to the end of contenteditable element
   *
   * @returns {DocumentFragment|void}
   */
  static extractFragmentFromCaretPositionTillTheEnd() {
    const e = window.getSelection();
    if (!e || !e.rangeCount)
      return;
    const t = e.getRangeAt(0);
    let r2 = t.startContainer;
    if (r2.nodeType !== Node.ELEMENT_NODE) {
      if (!r2.parentNode)
        return;
      r2 = r2.parentNode;
    }
    if (!c2(r2))
      return;
    const n2 = r2.closest("[contenteditable]");
    if (!n2)
      return;
    t.deleteContents();
    const s2 = t.cloneRange();
    return s2.selectNodeContents(n2), s2.setStart(t.endContainer, t.endOffset), s2.extractContents();
  }
  /**
   * Set focus to contenteditable or native input element
   *
   * @param {HTMLElement} element - element where to set focus
   * @param {boolean} atStart - where to set focus: at the start or at the end
   * @returns {void}
   */
  static focus(e, t = true) {
    const r2 = document.createRange(), n2 = window.getSelection();
    n2 && (r2.selectNodeContents(e), r2.collapse(t), n2.removeAllRanges(), n2.addRange(r2));
  }
  /**
   * Check if the caret placed at the start of the contenteditable element
   *
   * @returns {boolean}
   */
  static isAtStart() {
    const e = window.getSelection();
    if (!e || e.focusOffset > 0)
      return false;
    const t = e.focusNode;
    return !t || !c2(t) ? false : u3.getHigherLevelSiblings(t, "left").every((s2) => C2(s2));
  }
  /**
   * Get all first-level (first child of [contenteditabel]) siblings from passed node
   * Then you can check it for emptiness
   *
   * @example
   * <div contenteditable>
   * <p></p>                            |
   * <p></p>                            | left first-level siblings
   * <p></p>                            |
   * <blockquote><a><b>adaddad</b><a><blockquote>       <-- passed node for example <b>
   * <p></p>                            |
   * <p></p>                            | right first-level siblings
   * <p></p>                            |
   * </div>
   * @param {HTMLElement} from - element from which siblings should be searched
   * @param {'left' | 'right'} direction - direction of search
   * @returns {HTMLElement[]}
   */
  static getHigherLevelSiblings(e, t = "left") {
    let r2 = e;
    const n2 = [];
    for (; r2.parentNode && r2.parentNode.contentEditable !== "true"; )
      r2 = r2.parentNode;
    const s2 = t === "left" ? "previousSibling" : "nextSibling";
    for (; r2[s2]; )
      r2 = r2[s2], n2.push(r2);
    return n2;
  }
};
var w = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="9" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="9" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 17H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 12H4.99002"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M5.00001 7H4.99002"/></svg>';
var S2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="12" x2="19" y1="7" y2="7" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="12" x2="19" y1="12" y2="12" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><line x1="12" x2="19" y1="17" y2="17" stroke="currentColor" stroke-linecap="round" stroke-width="2"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.79999 14L7.79999 7.2135C7.79999 7.12872 7.7011 7.0824 7.63597 7.13668L4.79999 9.5"/></svg>';
var f2 = class {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Allow to use native Enter behaviour
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {ToolboxConfig}
   */
  static get toolbox() {
    return {
      icon: S2,
      title: "List"
    };
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - tool constructor options
   * @param {ListData} params.data - previously saved data
   * @param {object} params.config - user config for Tool
   * @param {object} params.api - Editor.js API
   * @param {boolean} params.readOnly - read-only mode flag
   */
  constructor({ data: e, config: t, api: r2, readOnly: n2 }) {
    var i;
    this.nodes = {
      wrapper: null
    }, this.api = r2, this.readOnly = n2, this.config = t, this.defaultListStyle = ((i = this.config) == null ? void 0 : i.defaultStyle) === "ordered" ? "ordered" : "unordered";
    const s2 = {
      style: this.defaultListStyle,
      items: []
    };
    this.data = e && Object.keys(e).length ? e : s2, this.caret = new u3();
  }
  /**
   * Returns list tag with items
   *
   * @returns {Element}
   * @public
   */
  render() {
    return this.nodes.wrapper = this.makeListWrapper(this.data.style, [
      this.CSS.baseBlock
    ]), this.data.items.length ? this.appendItems(this.data.items, this.nodes.wrapper) : this.appendItems(
      [
        {
          content: "",
          items: []
        }
      ],
      this.nodes.wrapper
    ), this.readOnly || this.nodes.wrapper.addEventListener(
      "keydown",
      (e) => {
        switch (e.key) {
          case "Enter":
            this.enterPressed(e);
            break;
          case "Backspace":
            this.backspace(e);
            break;
          case "Tab":
            e.shiftKey ? this.shiftTab(e) : this.addTab(e);
            break;
        }
      },
      false
    ), this.nodes.wrapper;
  }
  /**
   * Creates Block Tune allowing to change the list style
   *
   * @public
   * @returns {Array}
   */
  renderSettings() {
    return [
      {
        name: "unordered",
        label: this.api.i18n.t("Unordered"),
        icon: w
      },
      {
        name: "ordered",
        label: this.api.i18n.t("Ordered"),
        icon: S2
      }
    ].map((t) => ({
      name: t.name,
      icon: t.icon,
      label: t.label,
      isActive: this.data.style === t.name,
      closeOnActivate: true,
      onActivate: () => {
        this.listStyle = t.name;
      }
    }));
  }
  /**
   * On paste sanitzation config. Allow only tags that are allowed in the Tool.
   *
   * @returns {PasteConfig} - paste config.
   */
  static get pasteConfig() {
    return {
      tags: ["OL", "UL", "LI"]
    };
  }
  /**
   * On paste callback that is fired from Editor.
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(e) {
    const t = e.detail.data;
    this.data = this.pasteHandler(t);
    const r2 = this.nodes.wrapper;
    r2 && r2.parentNode && r2.parentNode.replaceChild(this.render(), r2);
  }
  /**
   * Handle UL, OL and LI tags paste and returns List data
   *
   * @param {HTMLUListElement|HTMLOListElement|HTMLLIElement} element
   * @returns {ListData}
   */
  pasteHandler(e) {
    const { tagName: t } = e;
    let r2 = "unordered", n2;
    switch (t) {
      case "OL":
        r2 = "ordered", n2 = "ol";
        break;
      case "UL":
      case "LI":
        r2 = "unordered", n2 = "ul";
    }
    const s2 = {
      style: r2,
      items: []
    }, i = (l2) => Array.from(l2.querySelectorAll(":scope > li")).map((o3) => {
      var m4;
      const a3 = o3.querySelector(`:scope > ${n2}`), y4 = a3 ? i(a3) : [];
      return {
        content: ((m4 = o3 == null ? void 0 : o3.firstChild) == null ? void 0 : m4.textContent) || "",
        items: y4
      };
    });
    return s2.items = i(e), s2;
  }
  /**
   * Renders children list
   *
   * @param {ListItem[]} items - items data to append
   * @param {Element} parentItem - where to append
   * @returns {void}
   */
  appendItems(e, t) {
    e.forEach((r2) => {
      const n2 = this.createItem(r2.content, r2.items);
      t.appendChild(n2);
    });
  }
  /**
   * Renders the single item
   *
   * @param {string} content - item content to render
   * @param {ListItem[]} [items] - children
   * @returns {Element}
   */
  createItem(e, t = []) {
    const r2 = p2("li", this.CSS.item), n2 = p2("div", this.CSS.itemBody), s2 = p2("div", this.CSS.itemContent, {
      innerHTML: e,
      contentEditable: (!this.readOnly).toString()
    });
    return n2.appendChild(s2), r2.appendChild(n2), t && t.length > 0 && this.addChildrenList(r2, t), r2;
  }
  /**
   * Extracts tool's data from the DOM
   *
   * @returns {ListData}
   */
  save() {
    const e = (t) => Array.from(
      t.querySelectorAll(`:scope > .${this.CSS.item}`)
    ).map((n2) => {
      const s2 = n2.querySelector(`.${this.CSS.itemChildren}`), i = this.getItemContent(n2), l2 = s2 ? e(s2) : [];
      return {
        content: i,
        items: l2
      };
    });
    return {
      style: this.data.style,
      items: this.nodes.wrapper ? e(this.nodes.wrapper) : []
    };
  }
  /**
   * Append children list to passed item
   *
   * @param {Element} parentItem - item that should contain passed sub-items
   * @param {ListItem[]} items - sub items to append
   */
  addChildrenList(e, t) {
    const r2 = e.querySelector(`.${this.CSS.itemBody}`), n2 = this.makeListWrapper(void 0, [
      this.CSS.itemChildren
    ]);
    this.appendItems(t, n2), r2 && r2.appendChild(n2);
  }
  /**
   * Creates main <ul> or <ol> tag depended on style
   *
   * @param {string} [style] - 'ordered' or 'unordered'
   * @param {string[]} [classes] - additional classes to append
   * @returns {HTMLOListElement|HTMLUListElement}
   */
  makeListWrapper(e = this.listStyle, t = []) {
    const r2 = e === "ordered" ? "ol" : "ul", n2 = e === "ordered" ? this.CSS.wrapperOrdered : this.CSS.wrapperUnordered;
    return t.push(n2), p2(r2, [this.CSS.wrapper, ...t]);
  }
  /**
   * Styles
   *
   * @returns {NestedListCssClasses} - CSS classes names by keys
   * @private
   */
  get CSS() {
    return {
      baseBlock: this.api.styles.block,
      wrapper: "cdx-nested-list",
      wrapperOrdered: "cdx-nested-list--ordered",
      wrapperUnordered: "cdx-nested-list--unordered",
      item: "cdx-nested-list__item",
      itemBody: "cdx-nested-list__item-body",
      itemContent: "cdx-nested-list__item-content",
      itemChildren: "cdx-nested-list__item-children",
      settingsWrapper: "cdx-nested-list__settings",
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive
    };
  }
  /**
   * Get list style name
   *
   * @returns {string}
   */
  get listStyle() {
    return this.data.style || this.defaultListStyle;
  }
  /**
   * Set list style
   *
   * @param {ListDataStyle} style - new style to set
   */
  set listStyle(e) {
    if (!this.nodes || !this.nodes.wrapper)
      return;
    const t = Array.from(
      this.nodes.wrapper.querySelectorAll(`.${this.CSS.wrapper}`)
    );
    t.push(this.nodes.wrapper), t.forEach((r2) => {
      r2.classList.toggle(this.CSS.wrapperUnordered, e === "unordered"), r2.classList.toggle(this.CSS.wrapperOrdered, e === "ordered");
    }), this.data.style = e;
  }
  /**
   * Returns current List item by the caret position
   *
   * @returns {Element}
   */
  get currentItem() {
    const e = window.getSelection();
    if (!e)
      return null;
    let t = e.anchorNode;
    return !t || (c2(t) || (t = t.parentNode), !t) || !c2(t) ? null : t.closest(`.${this.CSS.item}`);
  }
  /**
   * Handles Enter keypress
   *
   * @param {KeyboardEvent} event - keydown
   * @returns {void}
   */
  enterPressed(e) {
    const t = this.currentItem;
    if (e.stopPropagation(), e.preventDefault(), e.isComposing)
      return;
    const r2 = t ? this.getItemContent(t).trim().length === 0 : true, n2 = (t == null ? void 0 : t.parentNode) === this.nodes.wrapper, s2 = (t == null ? void 0 : t.nextElementSibling) === null;
    if (n2 && s2 && r2) {
      this.getOutOfList();
      return;
    } else if (s2 && r2) {
      this.unshiftItem();
      return;
    }
    const i = u3.extractFragmentFromCaretPositionTillTheEnd();
    if (!i)
      return;
    const l2 = g3(i), h3 = t == null ? void 0 : t.querySelector(
      `.${this.CSS.itemChildren}`
    ), o3 = this.createItem(l2, void 0);
    h3 && Array.from(h3.querySelectorAll(`.${this.CSS.item}`)).length > 0 ? h3.prepend(o3) : t == null || t.after(o3), this.focusItem(o3);
  }
  /**
   * Decrease indentation of the current item
   *
   * @returns {void}
   */
  unshiftItem() {
    const e = this.currentItem;
    if (!e || !e.parentNode || !c2(e.parentNode))
      return;
    const t = e.parentNode.closest(`.${this.CSS.item}`);
    if (!t)
      return;
    this.caret.save(), t.after(e), this.caret.restore();
    const r2 = t.querySelector(
      `.${this.CSS.itemChildren}`
    );
    if (!r2)
      return;
    r2.children.length === 0 && r2.remove();
  }
  /**
   * Return the item content
   *
   * @param {Element} item - item wrapper (<li>)
   * @returns {string}
   */
  getItemContent(e) {
    const t = e.querySelector(`.${this.CSS.itemContent}`);
    return !t || C2(t) ? "" : t.innerHTML;
  }
  /**
   * Sets focus to the item's content
   *
   * @param {Element} item - item (<li>) to select
   * @param {boolean} atStart - where to set focus: at the start or at the end
   * @returns {void}
   */
  focusItem(e, t = true) {
    const r2 = e.querySelector(
      `.${this.CSS.itemContent}`
    );
    r2 && u3.focus(r2, t);
  }
  /**
   * Get out from List Tool by Enter on the empty last item
   *
   * @returns {void}
   */
  getOutOfList() {
    var e;
    (e = this.currentItem) == null || e.remove(), this.api.blocks.insert(), this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
  }
  /**
   * Handle backspace
   *
   * @param {KeyboardEvent} event - keydown
   */
  backspace(e) {
    if (!u3.isAtStart())
      return;
    e.preventDefault();
    const t = this.currentItem;
    if (!t)
      return;
    const r2 = t.previousSibling;
    if (!t.parentNode || !c2(t.parentNode))
      return;
    const n2 = t.parentNode.closest(`.${this.CSS.item}`);
    if (!r2 && !n2 || r2 && !c2(r2))
      return;
    e.stopPropagation();
    let s2;
    if (r2) {
      const a3 = r2.querySelectorAll(
        `.${this.CSS.item}`
      );
      s2 = Array.from(a3).pop() || r2;
    } else
      s2 = n2;
    const i = u3.extractFragmentFromCaretPositionTillTheEnd();
    if (!i)
      return;
    const l2 = g3(i);
    if (!s2)
      return;
    const h3 = s2.querySelector(
      `.${this.CSS.itemContent}`
    );
    if (!h3)
      return;
    u3.focus(h3, false), this.caret.save(), h3.insertAdjacentHTML("beforeend", l2);
    let o3 = t.querySelectorAll(
      `.${this.CSS.itemChildren} > .${this.CSS.item}`
    );
    o3 = Array.from(o3), o3 = o3.filter((a3) => !a3.parentNode || !c2(a3.parentNode) ? false : a3.parentNode.closest(`.${this.CSS.item}`) === t), o3.reverse().forEach((a3) => {
      r2 ? s2.after(a3) : t.after(a3);
    }), t.remove(), this.caret.restore();
  }
  /**
   * Add indentation to current item
   *
   * @param {KeyboardEvent} event - keydown
   */
  addTab(e) {
    e.stopPropagation(), e.preventDefault();
    const t = this.currentItem;
    if (!t)
      return;
    const r2 = t.previousSibling;
    if (!r2 || !c2(r2) || !r2)
      return;
    const s2 = r2.querySelector(
      `.${this.CSS.itemChildren}`
    );
    if (this.caret.save(), s2)
      s2.appendChild(t);
    else {
      const i = this.makeListWrapper(void 0, [
        this.CSS.itemChildren
      ]), l2 = r2.querySelector(`.${this.CSS.itemBody}`);
      i.appendChild(t), l2 == null || l2.appendChild(i);
    }
    this.caret.restore();
  }
  /**
   * Reduce indentation for current item
   *
   * @param {KeyboardEvent} event - keydown
   * @returns {void}
   */
  shiftTab(e) {
    e.stopPropagation(), e.preventDefault(), this.unshiftItem();
  }
  /**
   * Convert from list to text for conversionConfig
   *
   * @param {ListData} data
   * @returns {string}
   */
  static joinRecursive(e) {
    return e.items.map((t) => `${t.content} ${f2.joinRecursive(t)}`).join("");
  }
  /**
   * Convert from text to list with import and export list to text
   */
  static get conversionConfig() {
    return {
      export: (e) => f2.joinRecursive(e),
      import: (e) => ({
        items: [
          {
            content: e,
            items: []
          }
        ],
        style: "unordered"
      })
    };
  }
};

// ../../node_modules/@editorjs/quote/dist/quote.mjs
(function() {
  "use strict";
  try {
    if (typeof document < "u") {
      var t = document.createElement("style");
      t.appendChild(document.createTextNode(".cdx-quote-icon svg{transform:rotate(180deg)}.cdx-quote{margin:0}.cdx-quote__text{min-height:158px;margin-bottom:10px}.cdx-quote [contentEditable=true][data-placeholder]:before{position:absolute;content:attr(data-placeholder);color:#707684;font-weight:400;opacity:0}.cdx-quote [contentEditable=true][data-placeholder]:empty:before{opacity:1}.cdx-quote [contentEditable=true][data-placeholder]:empty:focus:before{opacity:0}.cdx-quote-settings{display:flex}.cdx-quote-settings .cdx-settings-button{width:50%}")), document.head.appendChild(t);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
var De2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 7L6 7"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18 17H6"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M16 12L8 12"/></svg>';
var He2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17 7L5 7"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M17 17H5"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M13 12L5 12"/></svg>';
var Re2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 10.8182L9 10.8182C8.80222 10.8182 8.60888 10.7649 8.44443 10.665C8.27998 10.5651 8.15181 10.4231 8.07612 10.257C8.00043 10.0909 7.98063 9.90808 8.01922 9.73174C8.0578 9.55539 8.15304 9.39341 8.29289 9.26627C8.43275 9.13913 8.61093 9.05255 8.80491 9.01747C8.99889 8.98239 9.19996 9.00039 9.38268 9.0692C9.56541 9.13801 9.72159 9.25453 9.83147 9.40403C9.94135 9.55353 10 9.72929 10 9.90909L10 12.1818C10 12.664 9.78929 13.1265 9.41421 13.4675C9.03914 13.8084 8.53043 14 8 14"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 10.8182L15 10.8182C14.8022 10.8182 14.6089 10.7649 14.4444 10.665C14.28 10.5651 14.1518 10.4231 14.0761 10.257C14.0004 10.0909 13.9806 9.90808 14.0192 9.73174C14.0578 9.55539 14.153 9.39341 14.2929 9.26627C14.4327 9.13913 14.6109 9.05255 14.8049 9.01747C14.9989 8.98239 15.2 9.00039 15.3827 9.0692C15.5654 9.13801 15.7216 9.25453 15.8315 9.40403C15.9414 9.55353 16 9.72929 16 9.90909L16 12.1818C16 12.664 15.7893 13.1265 15.4142 13.4675C15.0391 13.8084 14.5304 14 14 14"/></svg>';
var b2 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {};
function Fe2(e) {
  if (e.__esModule)
    return e;
  var t = e.default;
  if (typeof t == "function") {
    var n2 = function r2() {
      return this instanceof r2 ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n2.prototype = t.prototype;
  } else
    n2 = {};
  return Object.defineProperty(n2, "__esModule", { value: true }), Object.keys(e).forEach(function(r2) {
    var i = Object.getOwnPropertyDescriptor(e, r2);
    Object.defineProperty(n2, r2, i.get ? i : {
      enumerable: true,
      get: function() {
        return e[r2];
      }
    });
  }), n2;
}
var v2 = {};
var P2 = {};
var j2 = {};
Object.defineProperty(j2, "__esModule", { value: true });
j2.allInputsSelector = We2;
function We2() {
  var e = ["text", "password", "email", "number", "search", "tel", "url"];
  return "[contenteditable=true], textarea, input:not([type]), " + e.map(function(t) {
    return 'input[type="'.concat(t, '"]');
  }).join(", ");
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.allInputsSelector = void 0;
  var t = j2;
  Object.defineProperty(e, "allInputsSelector", { enumerable: true, get: function() {
    return t.allInputsSelector;
  } });
})(P2);
var c3 = {};
var T = {};
Object.defineProperty(T, "__esModule", { value: true });
T.isNativeInput = Ue2;
function Ue2(e) {
  var t = [
    "INPUT",
    "TEXTAREA"
  ];
  return e && e.tagName ? t.includes(e.tagName) : false;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isNativeInput = void 0;
  var t = T;
  Object.defineProperty(e, "isNativeInput", { enumerable: true, get: function() {
    return t.isNativeInput;
  } });
})(c3);
var ie = {};
var C3 = {};
Object.defineProperty(C3, "__esModule", { value: true });
C3.append = qe2;
function qe2(e, t) {
  Array.isArray(t) ? t.forEach(function(n2) {
    e.appendChild(n2);
  }) : e.appendChild(t);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.append = void 0;
  var t = C3;
  Object.defineProperty(e, "append", { enumerable: true, get: function() {
    return t.append;
  } });
})(ie);
var L2 = {};
var S3 = {};
Object.defineProperty(S3, "__esModule", { value: true });
S3.blockElements = ze2;
function ze2() {
  return [
    "address",
    "article",
    "aside",
    "blockquote",
    "canvas",
    "div",
    "dl",
    "dt",
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
    "header",
    "hgroup",
    "hr",
    "li",
    "main",
    "nav",
    "noscript",
    "ol",
    "output",
    "p",
    "pre",
    "ruby",
    "section",
    "table",
    "tbody",
    "thead",
    "tr",
    "tfoot",
    "ul",
    "video"
  ];
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.blockElements = void 0;
  var t = S3;
  Object.defineProperty(e, "blockElements", { enumerable: true, get: function() {
    return t.blockElements;
  } });
})(L2);
var ae2 = {};
var M = {};
Object.defineProperty(M, "__esModule", { value: true });
M.calculateBaseline = Ge2;
function Ge2(e) {
  var t = window.getComputedStyle(e), n2 = parseFloat(t.fontSize), r2 = parseFloat(t.lineHeight) || n2 * 1.2, i = parseFloat(t.paddingTop), a3 = parseFloat(t.borderTopWidth), l2 = parseFloat(t.marginTop), u4 = n2 * 0.8, d3 = (r2 - n2) / 2, s2 = l2 + a3 + i + d3 + u4;
  return s2;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.calculateBaseline = void 0;
  var t = M;
  Object.defineProperty(e, "calculateBaseline", { enumerable: true, get: function() {
    return t.calculateBaseline;
  } });
})(ae2);
var le2 = {};
var k2 = {};
var w2 = {};
var N = {};
Object.defineProperty(N, "__esModule", { value: true });
N.isContentEditable = Ke2;
function Ke2(e) {
  return e.contentEditable === "true";
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isContentEditable = void 0;
  var t = N;
  Object.defineProperty(e, "isContentEditable", { enumerable: true, get: function() {
    return t.isContentEditable;
  } });
})(w2);
Object.defineProperty(k2, "__esModule", { value: true });
k2.canSetCaret = Qe2;
var Xe2 = c3;
var Ye2 = w2;
function Qe2(e) {
  var t = true;
  if ((0, Xe2.isNativeInput)(e))
    switch (e.type) {
      case "file":
      case "checkbox":
      case "radio":
      case "hidden":
      case "submit":
      case "button":
      case "image":
      case "reset":
        t = false;
        break;
    }
  else
    t = (0, Ye2.isContentEditable)(e);
  return t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.canSetCaret = void 0;
  var t = k2;
  Object.defineProperty(e, "canSetCaret", { enumerable: true, get: function() {
    return t.canSetCaret;
  } });
})(le2);
var y2 = {};
var I = {};
function Ve2(e, t, n2) {
  const r2 = n2.value !== void 0 ? "value" : "get", i = n2[r2], a3 = `#${t}Cache`;
  if (n2[r2] = function(...l2) {
    return this[a3] === void 0 && (this[a3] = i.apply(this, l2)), this[a3];
  }, r2 === "get" && n2.set) {
    const l2 = n2.set;
    n2.set = function(u4) {
      delete e[a3], l2.apply(this, u4);
    };
  }
  return n2;
}
function ue2() {
  const e = {
    win: false,
    mac: false,
    x11: false,
    linux: false
  }, t = Object.keys(e).find((n2) => window.navigator.appVersion.toLowerCase().indexOf(n2) !== -1);
  return t !== void 0 && (e[t] = true), e;
}
function A2(e) {
  return e != null && e !== "" && (typeof e != "object" || Object.keys(e).length > 0);
}
function Ze2(e) {
  return !A2(e);
}
var Je2 = () => typeof window < "u" && window.navigator !== null && A2(window.navigator.platform) && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
function xe2(e) {
  const t = ue2();
  return e = e.replace(/shift/gi, "\u21E7").replace(/backspace/gi, "\u232B").replace(/enter/gi, "\u23CE").replace(/up/gi, "\u2191").replace(/left/gi, "\u2192").replace(/down/gi, "\u2193").replace(/right/gi, "\u2190").replace(/escape/gi, "\u238B").replace(/insert/gi, "Ins").replace(/delete/gi, "\u2421").replace(/\+/gi, "+"), t.mac ? e = e.replace(/ctrl|cmd/gi, "\u2318").replace(/alt/gi, "\u2325") : e = e.replace(/cmd/gi, "Ctrl").replace(/windows/gi, "WIN"), e;
}
function et2(e) {
  return e[0].toUpperCase() + e.slice(1);
}
function tt(e) {
  const t = document.createElement("div");
  t.style.position = "absolute", t.style.left = "-999px", t.style.bottom = "-999px", t.innerHTML = e, document.body.appendChild(t);
  const n2 = window.getSelection(), r2 = document.createRange();
  if (r2.selectNode(t), n2 === null)
    throw new Error("Cannot copy text to clipboard");
  n2.removeAllRanges(), n2.addRange(r2), document.execCommand("copy"), document.body.removeChild(t);
}
function nt2(e, t, n2) {
  let r2;
  return (...i) => {
    const a3 = this, l2 = () => {
      r2 = void 0, n2 !== true && e.apply(a3, i);
    }, u4 = n2 === true && r2 !== void 0;
    window.clearTimeout(r2), r2 = window.setTimeout(l2, t), u4 && e.apply(a3, i);
  };
}
function o2(e) {
  return Object.prototype.toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
function rt2(e) {
  return o2(e) === "boolean";
}
function oe2(e) {
  return o2(e) === "function" || o2(e) === "asyncfunction";
}
function it2(e) {
  return oe2(e) && /^\s*class\s+/.test(e.toString());
}
function at2(e) {
  return o2(e) === "number";
}
function g4(e) {
  return o2(e) === "object";
}
function lt2(e) {
  return Promise.resolve(e) === e;
}
function ut2(e) {
  return o2(e) === "string";
}
function ot2(e) {
  return o2(e) === "undefined";
}
function O(e, ...t) {
  if (!t.length)
    return e;
  const n2 = t.shift();
  if (g4(e) && g4(n2))
    for (const r2 in n2)
      g4(n2[r2]) ? (e[r2] === void 0 && Object.assign(e, { [r2]: {} }), O(e[r2], n2[r2])) : Object.assign(e, { [r2]: n2[r2] });
  return O(e, ...t);
}
function st2(e, t, n2) {
  const r2 = `\xAB${t}\xBB is deprecated and will be removed in the next major release. Please use the \xAB${n2}\xBB instead.`;
  e && console.warn(r2);
}
function ct2(e) {
  try {
    return new URL(e).href;
  } catch {
  }
  return e.substring(0, 2) === "//" ? window.location.protocol + e : window.location.origin + e;
}
function dt2(e) {
  return e > 47 && e < 58 || e === 32 || e === 13 || e === 229 || e > 64 && e < 91 || e > 95 && e < 112 || e > 185 && e < 193 || e > 218 && e < 223;
}
var ft2 = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  ESC: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  DELETE: 46,
  META: 91,
  SLASH: 191
};
var pt2 = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
  BACKWARD: 3,
  FORWARD: 4
};
var vt2 = class {
  constructor() {
    this.completed = Promise.resolve();
  }
  /**
   * Add new promise to queue
   * @param operation - promise should be added to queue
   */
  add(t) {
    return new Promise((n2, r2) => {
      this.completed = this.completed.then(t).then(n2).catch(r2);
    });
  }
};
function gt2(e, t, n2 = void 0) {
  let r2, i, a3, l2 = null, u4 = 0;
  n2 || (n2 = {});
  const d3 = function() {
    u4 = n2.leading === false ? 0 : Date.now(), l2 = null, a3 = e.apply(r2, i), l2 === null && (r2 = i = null);
  };
  return function() {
    const s2 = Date.now();
    !u4 && n2.leading === false && (u4 = s2);
    const f4 = t - (s2 - u4);
    return r2 = this, i = arguments, f4 <= 0 || f4 > t ? (l2 && (clearTimeout(l2), l2 = null), u4 = s2, a3 = e.apply(r2, i), l2 === null && (r2 = i = null)) : !l2 && n2.trailing !== false && (l2 = setTimeout(d3, f4)), a3;
  };
}
var mt2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PromiseQueue: vt2,
  beautifyShortcut: xe2,
  cacheable: Ve2,
  capitalize: et2,
  copyTextToClipboard: tt,
  debounce: nt2,
  deepMerge: O,
  deprecationAssert: st2,
  getUserOS: ue2,
  getValidUrl: ct2,
  isBoolean: rt2,
  isClass: it2,
  isEmpty: Ze2,
  isFunction: oe2,
  isIosDevice: Je2,
  isNumber: at2,
  isObject: g4,
  isPrintableKey: dt2,
  isPromise: lt2,
  isString: ut2,
  isUndefined: ot2,
  keyCodes: ft2,
  mouseButtons: pt2,
  notEmpty: A2,
  throttle: gt2,
  typeOf: o2
}, Symbol.toStringTag, { value: "Module" }));
var $2 = /* @__PURE__ */ Fe2(mt2);
Object.defineProperty(I, "__esModule", { value: true });
I.containsOnlyInlineElements = _t2;
var bt2 = $2;
var yt2 = L2;
function _t2(e) {
  var t;
  (0, bt2.isString)(e) ? (t = document.createElement("div"), t.innerHTML = e) : t = e;
  var n2 = function(r2) {
    return !(0, yt2.blockElements)().includes(r2.tagName.toLowerCase()) && Array.from(r2.children).every(n2);
  };
  return Array.from(t.children).every(n2);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.containsOnlyInlineElements = void 0;
  var t = I;
  Object.defineProperty(e, "containsOnlyInlineElements", { enumerable: true, get: function() {
    return t.containsOnlyInlineElements;
  } });
})(y2);
var se = {};
var B = {};
var _2 = {};
var D2 = {};
Object.defineProperty(D2, "__esModule", { value: true });
D2.make = ht2;
function ht2(e, t, n2) {
  var r2;
  t === void 0 && (t = null), n2 === void 0 && (n2 = {});
  var i = document.createElement(e);
  if (Array.isArray(t)) {
    var a3 = t.filter(function(u4) {
      return u4 !== void 0;
    });
    (r2 = i.classList).add.apply(r2, a3);
  } else
    t !== null && i.classList.add(t);
  for (var l2 in n2)
    Object.prototype.hasOwnProperty.call(n2, l2) && (i[l2] = n2[l2]);
  return i;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.make = void 0;
  var t = D2;
  Object.defineProperty(e, "make", { enumerable: true, get: function() {
    return t.make;
  } });
})(_2);
Object.defineProperty(B, "__esModule", { value: true });
B.fragmentToString = Ot2;
var Et2 = _2;
function Ot2(e) {
  var t = (0, Et2.make)("div");
  return t.appendChild(e), t.innerHTML;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.fragmentToString = void 0;
  var t = B;
  Object.defineProperty(e, "fragmentToString", { enumerable: true, get: function() {
    return t.fragmentToString;
  } });
})(se);
var ce2 = {};
var H = {};
Object.defineProperty(H, "__esModule", { value: true });
H.getContentLength = jt2;
var Pt2 = c3;
function jt2(e) {
  var t, n2;
  return (0, Pt2.isNativeInput)(e) ? e.value.length : e.nodeType === Node.TEXT_NODE ? e.length : (n2 = (t = e.textContent) === null || t === void 0 ? void 0 : t.length) !== null && n2 !== void 0 ? n2 : 0;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.getContentLength = void 0;
  var t = H;
  Object.defineProperty(e, "getContentLength", { enumerable: true, get: function() {
    return t.getContentLength;
  } });
})(ce2);
var R2 = {};
var F = {};
var re2 = b2 && b2.__spreadArray || function(e, t, n2) {
  if (n2 || arguments.length === 2)
    for (var r2 = 0, i = t.length, a3; r2 < i; r2++)
      (a3 || !(r2 in t)) && (a3 || (a3 = Array.prototype.slice.call(t, 0, r2)), a3[r2] = t[r2]);
  return e.concat(a3 || Array.prototype.slice.call(t));
};
Object.defineProperty(F, "__esModule", { value: true });
F.getDeepestBlockElements = de2;
var Tt2 = y2;
function de2(e) {
  return (0, Tt2.containsOnlyInlineElements)(e) ? [e] : Array.from(e.children).reduce(function(t, n2) {
    return re2(re2([], t, true), de2(n2), true);
  }, []);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.getDeepestBlockElements = void 0;
  var t = F;
  Object.defineProperty(e, "getDeepestBlockElements", { enumerable: true, get: function() {
    return t.getDeepestBlockElements;
  } });
})(R2);
var fe2 = {};
var W = {};
var h2 = {};
var U2 = {};
Object.defineProperty(U2, "__esModule", { value: true });
U2.isLineBreakTag = Ct2;
function Ct2(e) {
  return [
    "BR",
    "WBR"
  ].includes(e.tagName);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isLineBreakTag = void 0;
  var t = U2;
  Object.defineProperty(e, "isLineBreakTag", { enumerable: true, get: function() {
    return t.isLineBreakTag;
  } });
})(h2);
var E2 = {};
var q = {};
Object.defineProperty(q, "__esModule", { value: true });
q.isSingleTag = Lt2;
function Lt2(e) {
  return [
    "AREA",
    "BASE",
    "BR",
    "COL",
    "COMMAND",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "KEYGEN",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ].includes(e.tagName);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isSingleTag = void 0;
  var t = q;
  Object.defineProperty(e, "isSingleTag", { enumerable: true, get: function() {
    return t.isSingleTag;
  } });
})(E2);
Object.defineProperty(W, "__esModule", { value: true });
W.getDeepestNode = pe2;
var St2 = c3;
var Mt2 = h2;
var kt2 = E2;
function pe2(e, t) {
  t === void 0 && (t = false);
  var n2 = t ? "lastChild" : "firstChild", r2 = t ? "previousSibling" : "nextSibling";
  if (e.nodeType === Node.ELEMENT_NODE && e[n2]) {
    var i = e[n2];
    if ((0, kt2.isSingleTag)(i) && !(0, St2.isNativeInput)(i) && !(0, Mt2.isLineBreakTag)(i))
      if (i[r2])
        i = i[r2];
      else if (i.parentNode !== null && i.parentNode[r2])
        i = i.parentNode[r2];
      else
        return i.parentNode;
    return pe2(i, t);
  }
  return e;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.getDeepestNode = void 0;
  var t = W;
  Object.defineProperty(e, "getDeepestNode", { enumerable: true, get: function() {
    return t.getDeepestNode;
  } });
})(fe2);
var ve = {};
var z2 = {};
var p3 = b2 && b2.__spreadArray || function(e, t, n2) {
  if (n2 || arguments.length === 2)
    for (var r2 = 0, i = t.length, a3; r2 < i; r2++)
      (a3 || !(r2 in t)) && (a3 || (a3 = Array.prototype.slice.call(t, 0, r2)), a3[r2] = t[r2]);
  return e.concat(a3 || Array.prototype.slice.call(t));
};
Object.defineProperty(z2, "__esModule", { value: true });
z2.findAllInputs = $t2;
var wt2 = y2;
var Nt2 = R2;
var It2 = P2;
var At2 = c3;
function $t2(e) {
  return Array.from(e.querySelectorAll((0, It2.allInputsSelector)())).reduce(function(t, n2) {
    return (0, At2.isNativeInput)(n2) || (0, wt2.containsOnlyInlineElements)(n2) ? p3(p3([], t, true), [n2], false) : p3(p3([], t, true), (0, Nt2.getDeepestBlockElements)(n2), true);
  }, []);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.findAllInputs = void 0;
  var t = z2;
  Object.defineProperty(e, "findAllInputs", { enumerable: true, get: function() {
    return t.findAllInputs;
  } });
})(ve);
var ge2 = {};
var G2 = {};
Object.defineProperty(G2, "__esModule", { value: true });
G2.isCollapsedWhitespaces = Bt2;
function Bt2(e) {
  return !/[^\t\n\r ]/.test(e);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isCollapsedWhitespaces = void 0;
  var t = G2;
  Object.defineProperty(e, "isCollapsedWhitespaces", { enumerable: true, get: function() {
    return t.isCollapsedWhitespaces;
  } });
})(ge2);
var K2 = {};
var X2 = {};
Object.defineProperty(X2, "__esModule", { value: true });
X2.isElement = Ht2;
var Dt2 = $2;
function Ht2(e) {
  return (0, Dt2.isNumber)(e) ? false : !!e && !!e.nodeType && e.nodeType === Node.ELEMENT_NODE;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isElement = void 0;
  var t = X2;
  Object.defineProperty(e, "isElement", { enumerable: true, get: function() {
    return t.isElement;
  } });
})(K2);
var me2 = {};
var Y2 = {};
var Q = {};
var V2 = {};
Object.defineProperty(V2, "__esModule", { value: true });
V2.isLeaf = Rt2;
function Rt2(e) {
  return e === null ? false : e.childNodes.length === 0;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isLeaf = void 0;
  var t = V2;
  Object.defineProperty(e, "isLeaf", { enumerable: true, get: function() {
    return t.isLeaf;
  } });
})(Q);
var Z2 = {};
var J2 = {};
Object.defineProperty(J2, "__esModule", { value: true });
J2.isNodeEmpty = zt2;
var Ft2 = h2;
var Wt2 = K2;
var Ut2 = c3;
var qt2 = E2;
function zt2(e, t) {
  var n2 = "";
  return (0, qt2.isSingleTag)(e) && !(0, Ft2.isLineBreakTag)(e) ? false : ((0, Wt2.isElement)(e) && (0, Ut2.isNativeInput)(e) ? n2 = e.value : e.textContent !== null && (n2 = e.textContent.replace("\u200B", "")), t !== void 0 && (n2 = n2.replace(new RegExp(t, "g"), "")), n2.trim().length === 0);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isNodeEmpty = void 0;
  var t = J2;
  Object.defineProperty(e, "isNodeEmpty", { enumerable: true, get: function() {
    return t.isNodeEmpty;
  } });
})(Z2);
Object.defineProperty(Y2, "__esModule", { value: true });
Y2.isEmpty = Xt2;
var Gt2 = Q;
var Kt2 = Z2;
function Xt2(e, t) {
  e.normalize();
  for (var n2 = [e]; n2.length > 0; ) {
    var r2 = n2.shift();
    if (r2) {
      if (e = r2, (0, Gt2.isLeaf)(e) && !(0, Kt2.isNodeEmpty)(e, t))
        return false;
      n2.push.apply(n2, Array.from(e.childNodes));
    }
  }
  return true;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isEmpty = void 0;
  var t = Y2;
  Object.defineProperty(e, "isEmpty", { enumerable: true, get: function() {
    return t.isEmpty;
  } });
})(me2);
var be2 = {};
var x = {};
Object.defineProperty(x, "__esModule", { value: true });
x.isFragment = Qt2;
var Yt2 = $2;
function Qt2(e) {
  return (0, Yt2.isNumber)(e) ? false : !!e && !!e.nodeType && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isFragment = void 0;
  var t = x;
  Object.defineProperty(e, "isFragment", { enumerable: true, get: function() {
    return t.isFragment;
  } });
})(be2);
var ye2 = {};
var ee2 = {};
Object.defineProperty(ee2, "__esModule", { value: true });
ee2.isHTMLString = Zt2;
var Vt2 = _2;
function Zt2(e) {
  var t = (0, Vt2.make)("div");
  return t.innerHTML = e, t.childElementCount > 0;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.isHTMLString = void 0;
  var t = ee2;
  Object.defineProperty(e, "isHTMLString", { enumerable: true, get: function() {
    return t.isHTMLString;
  } });
})(ye2);
var _e2 = {};
var te2 = {};
Object.defineProperty(te2, "__esModule", { value: true });
te2.offset = Jt2;
function Jt2(e) {
  var t = e.getBoundingClientRect(), n2 = window.pageXOffset || document.documentElement.scrollLeft, r2 = window.pageYOffset || document.documentElement.scrollTop, i = t.top + r2, a3 = t.left + n2;
  return {
    top: i,
    left: a3,
    bottom: i + t.height,
    right: a3 + t.width
  };
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.offset = void 0;
  var t = te2;
  Object.defineProperty(e, "offset", { enumerable: true, get: function() {
    return t.offset;
  } });
})(_e2);
var he2 = {};
var ne2 = {};
Object.defineProperty(ne2, "__esModule", { value: true });
ne2.prepend = xt2;
function xt2(e, t) {
  Array.isArray(t) ? (t = t.reverse(), t.forEach(function(n2) {
    return e.prepend(n2);
  })) : e.prepend(t);
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.prepend = void 0;
  var t = ne2;
  Object.defineProperty(e, "prepend", { enumerable: true, get: function() {
    return t.prepend;
  } });
})(he2);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: true }), e.prepend = e.offset = e.make = e.isLineBreakTag = e.isSingleTag = e.isNodeEmpty = e.isLeaf = e.isHTMLString = e.isFragment = e.isEmpty = e.isElement = e.isContentEditable = e.isCollapsedWhitespaces = e.findAllInputs = e.isNativeInput = e.allInputsSelector = e.getDeepestNode = e.getDeepestBlockElements = e.getContentLength = e.fragmentToString = e.containsOnlyInlineElements = e.canSetCaret = e.calculateBaseline = e.blockElements = e.append = void 0;
  var t = P2;
  Object.defineProperty(e, "allInputsSelector", { enumerable: true, get: function() {
    return t.allInputsSelector;
  } });
  var n2 = c3;
  Object.defineProperty(e, "isNativeInput", { enumerable: true, get: function() {
    return n2.isNativeInput;
  } });
  var r2 = ie;
  Object.defineProperty(e, "append", { enumerable: true, get: function() {
    return r2.append;
  } });
  var i = L2;
  Object.defineProperty(e, "blockElements", { enumerable: true, get: function() {
    return i.blockElements;
  } });
  var a3 = ae2;
  Object.defineProperty(e, "calculateBaseline", { enumerable: true, get: function() {
    return a3.calculateBaseline;
  } });
  var l2 = le2;
  Object.defineProperty(e, "canSetCaret", { enumerable: true, get: function() {
    return l2.canSetCaret;
  } });
  var u4 = y2;
  Object.defineProperty(e, "containsOnlyInlineElements", { enumerable: true, get: function() {
    return u4.containsOnlyInlineElements;
  } });
  var d3 = se;
  Object.defineProperty(e, "fragmentToString", { enumerable: true, get: function() {
    return d3.fragmentToString;
  } });
  var s2 = ce2;
  Object.defineProperty(e, "getContentLength", { enumerable: true, get: function() {
    return s2.getContentLength;
  } });
  var f4 = R2;
  Object.defineProperty(e, "getDeepestBlockElements", { enumerable: true, get: function() {
    return f4.getDeepestBlockElements;
  } });
  var Oe2 = fe2;
  Object.defineProperty(e, "getDeepestNode", { enumerable: true, get: function() {
    return Oe2.getDeepestNode;
  } });
  var Pe2 = ve;
  Object.defineProperty(e, "findAllInputs", { enumerable: true, get: function() {
    return Pe2.findAllInputs;
  } });
  var je2 = ge2;
  Object.defineProperty(e, "isCollapsedWhitespaces", { enumerable: true, get: function() {
    return je2.isCollapsedWhitespaces;
  } });
  var Te2 = w2;
  Object.defineProperty(e, "isContentEditable", { enumerable: true, get: function() {
    return Te2.isContentEditable;
  } });
  var Ce2 = K2;
  Object.defineProperty(e, "isElement", { enumerable: true, get: function() {
    return Ce2.isElement;
  } });
  var Le2 = me2;
  Object.defineProperty(e, "isEmpty", { enumerable: true, get: function() {
    return Le2.isEmpty;
  } });
  var Se2 = be2;
  Object.defineProperty(e, "isFragment", { enumerable: true, get: function() {
    return Se2.isFragment;
  } });
  var Me2 = ye2;
  Object.defineProperty(e, "isHTMLString", { enumerable: true, get: function() {
    return Me2.isHTMLString;
  } });
  var ke2 = Q;
  Object.defineProperty(e, "isLeaf", { enumerable: true, get: function() {
    return ke2.isLeaf;
  } });
  var we2 = Z2;
  Object.defineProperty(e, "isNodeEmpty", { enumerable: true, get: function() {
    return we2.isNodeEmpty;
  } });
  var Ne2 = h2;
  Object.defineProperty(e, "isLineBreakTag", { enumerable: true, get: function() {
    return Ne2.isLineBreakTag;
  } });
  var Ie2 = E2;
  Object.defineProperty(e, "isSingleTag", { enumerable: true, get: function() {
    return Ie2.isSingleTag;
  } });
  var Ae2 = _2;
  Object.defineProperty(e, "make", { enumerable: true, get: function() {
    return Ae2.make;
  } });
  var $e2 = _e2;
  Object.defineProperty(e, "offset", { enumerable: true, get: function() {
    return $e2.offset;
  } });
  var Be2 = he2;
  Object.defineProperty(e, "prepend", { enumerable: true, get: function() {
    return Be2.prepend;
  } });
})(v2);
var Ee2 = /* @__PURE__ */ ((e) => (e.Left = "left", e.Center = "center", e))(Ee2 || {});
var m2 = class {
  /**
   * Render plugin`s main Element and fill it with saved data
   * @param params - Quote Tool constructor params
   * @param params.data - previously saved data
   * @param params.config - user config for Tool
   * @param params.api - editor.js api
   * @param params.readOnly - read only mode flag
   */
  constructor({ data: t, config: n2, api: r2, readOnly: i, block: a3 }) {
    const { DEFAULT_ALIGNMENT: l2 } = m2;
    this.api = r2, this.readOnly = i, this.quotePlaceholder = r2.i18n.t((n2 == null ? void 0 : n2.quotePlaceholder) ?? m2.DEFAULT_QUOTE_PLACEHOLDER), this.captionPlaceholder = r2.i18n.t((n2 == null ? void 0 : n2.captionPlaceholder) ?? m2.DEFAULT_CAPTION_PLACEHOLDER), this.data = {
      text: t.text || "",
      caption: t.caption || "",
      alignment: Object.values(Ee2).includes(t.alignment) ? t.alignment : (n2 == null ? void 0 : n2.defaultAlignment) ?? l2
    }, this.css = {
      baseClass: this.api.styles.block,
      wrapper: "cdx-quote",
      text: "cdx-quote__text",
      input: this.api.styles.input,
      caption: "cdx-quote__caption"
    }, this.block = a3;
  }
  /**
   * Notify core that read-only mode is supported
   * @returns true
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   * @returns icon and title of the toolbox
   */
  static get toolbox() {
    return {
      icon: Re2,
      title: "Quote"
    };
  }
  /**
   * Empty Quote is not empty Block
   * @returns true
   */
  static get contentless() {
    return true;
  }
  /**
   * Allow to press Enter inside the Quote
   * @returns true
   */
  static get enableLineBreaks() {
    return true;
  }
  /**
   * Default placeholder for quote text
   * @returns 'Enter a quote'
   */
  static get DEFAULT_QUOTE_PLACEHOLDER() {
    return "Enter a quote";
  }
  /**
   * Default placeholder for quote caption
   * @returns 'Enter a caption'
   */
  static get DEFAULT_CAPTION_PLACEHOLDER() {
    return "Enter a caption";
  }
  /**
   * Default quote alignment
   * @returns Alignment.Left
   */
  static get DEFAULT_ALIGNMENT() {
    return "left";
  }
  /**
   * Allow Quote to be converted to/from other blocks
   * @returns conversion config object
   */
  static get conversionConfig() {
    return {
      /**
       * To create Quote data from string, simple fill 'text' property
       */
      import: "text",
      /**
       * To create string from Quote data, concatenate text and caption
       * @param quoteData - Quote data object
       * @returns string
       */
      export: function(t) {
        return t.caption ? `${t.text} \u2014 ${t.caption}` : t.text;
      }
    };
  }
  /**
   * Tool`s styles
   * @returns CSS classes names
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-quote",
      text: "cdx-quote__text",
      input: this.api.styles.input,
      caption: "cdx-quote__caption"
    };
  }
  /**
   * Tool`s settings properties
   * @returns settings properties
   */
  get settings() {
    return [
      {
        name: "left",
        icon: He2
      },
      {
        name: "center",
        icon: De2
      }
    ];
  }
  /**
   * Create Quote Tool container with inputs
   * @returns blockquote DOM element - Quote Tool container
   */
  render() {
    const t = v2.make(
      "blockquote",
      [
        this.css.baseClass,
        this.css.wrapper
      ]
    ), n2 = v2.make("div", [this.css.input, this.css.text], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.text
    }), r2 = v2.make("div", [this.css.input, this.css.caption], {
      contentEditable: !this.readOnly,
      innerHTML: this.data.caption
    });
    return n2.dataset.placeholder = this.quotePlaceholder, r2.dataset.placeholder = this.captionPlaceholder, t.appendChild(n2), t.appendChild(r2), t;
  }
  /**
   * Extract Quote data from Quote Tool element
   * @param quoteElement - Quote DOM element to save
   * @returns Quote data object
   */
  save(t) {
    const n2 = t.querySelector(`.${this.css.text}`), r2 = t.querySelector(`.${this.css.caption}`);
    return Object.assign(this.data, {
      text: (n2 == null ? void 0 : n2.innerHTML) ?? "",
      caption: (r2 == null ? void 0 : r2.innerHTML) ?? ""
    });
  }
  /**
   * Sanitizer rules
   * @returns sanitizer rules
   */
  static get sanitize() {
    return {
      text: {
        br: true
      },
      caption: {
        br: true
      },
      alignment: {}
    };
  }
  /**
   * Create wrapper for Tool`s settings buttons:
   * 1. Left alignment
   * 2. Center alignment
   * @returns settings menu
   */
  renderSettings() {
    const t = (n2) => n2 && n2[0].toUpperCase() + n2.slice(1);
    return this.settings.map((n2) => ({
      icon: n2.icon,
      label: this.api.i18n.t(`Align ${t(n2.name)}`),
      onActivate: () => this._toggleTune(n2.name),
      isActive: this.data.alignment === n2.name,
      closeOnActivate: true
    }));
  }
  /**
   * Toggle quote`s alignment
   * @param tune - alignment
   */
  _toggleTune(t) {
    this.data.alignment = t, this.block.dispatchChange();
  }
};

// ../../node_modules/@editorjs/table/dist/table.mjs
(function() {
  var r2;
  "use strict";
  try {
    if (typeof document < "u") {
      var o3 = document.createElement("style");
      o3.nonce = (r2 = document.head.querySelector("meta[property=csp-nonce]")) == null ? void 0 : r2.content, o3.appendChild(document.createTextNode('.tc-wrap{--color-background:#f9f9fb;--color-text-secondary:#7b7e89;--color-border:#e8e8eb;--cell-size:34px;--toolbox-icon-size:18px;--toolbox-padding:6px;--toolbox-aiming-field-size:calc(var(--toolbox-icon-size) + var(--toolbox-padding)*2);border-left:0;position:relative;height:100%;width:100%;margin-top:var(--toolbox-icon-size);box-sizing:border-box;display:grid;grid-template-columns:calc(100% - var(--cell-size)) var(--cell-size);z-index:0}.tc-wrap--readonly{grid-template-columns:100% var(--cell-size)}.tc-wrap svg{vertical-align:top}@media print{.tc-wrap{border-left-color:var(--color-border);border-left-style:solid;border-left-width:1px;grid-template-columns:100% var(--cell-size)}}@media print{.tc-wrap .tc-row:after{display:none}}.tc-table{position:relative;width:100%;height:100%;display:grid;font-size:14px;border-top:1px solid var(--color-border);line-height:1.4}.tc-table:after{width:calc(var(--cell-size));height:100%;left:calc(var(--cell-size)*-1);top:0}.tc-table:after,.tc-table:before{position:absolute;content:""}.tc-table:before{width:100%;height:var(--toolbox-aiming-field-size);top:calc(var(--toolbox-aiming-field-size)*-1);left:0}.tc-table--heading .tc-row:first-child{font-weight:600;border-bottom:2px solid var(--color-border);position:sticky;top:0;z-index:2;background:var(--color-background)}.tc-table--heading .tc-row:first-child [contenteditable]:empty:before{content:attr(heading);color:var(--color-text-secondary)}.tc-table--heading .tc-row:first-child:after{bottom:-2px;border-bottom:2px solid var(--color-border)}.tc-add-column,.tc-add-row{display:flex;color:var(--color-text-secondary)}@media print{.tc-add{display:none}}.tc-add-column{display:grid;border-top:1px solid var(--color-border);grid-template-columns:var(--cell-size);grid-auto-rows:var(--cell-size);place-items:center}.tc-add-column svg{padding:5px;position:sticky;top:0;background-color:var(--color-background)}.tc-add-column--disabled{visibility:hidden}@media print{.tc-add-column{display:none}}.tc-add-row{height:var(--cell-size);align-items:center;padding-left:4px;position:relative}.tc-add-row--disabled{display:none}.tc-add-row:before{content:"";position:absolute;right:calc(var(--cell-size)*-1);width:var(--cell-size);height:100%}@media print{.tc-add-row{display:none}}.tc-add-column,.tc-add-row{transition:0s;cursor:pointer;will-change:background-color}.tc-add-column:hover,.tc-add-row:hover{transition:background-color .1s ease;background-color:var(--color-background)}.tc-add-row{margin-top:1px}.tc-add-row:hover:before{transition:.1s;background-color:var(--color-background)}.tc-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(10px,1fr));position:relative;border-bottom:1px solid var(--color-border)}.tc-row:after{content:"";pointer-events:none;position:absolute;width:var(--cell-size);height:100%;bottom:-1px;right:calc(var(--cell-size)*-1);border-bottom:1px solid var(--color-border)}.tc-row--selected{background:var(--color-background)}.tc-row--selected:after{background:var(--color-background)}.tc-cell{border-right:1px solid var(--color-border);padding:6px 12px;overflow:hidden;outline:none;line-break:normal}.tc-cell--selected{background:var(--color-background)}.tc-wrap--readonly .tc-row:after{display:none}.tc-toolbox{--toolbox-padding:6px;--popover-margin:30px;--toggler-click-zone-size:30px;--toggler-dots-color:#7b7e89;--toggler-dots-color-hovered:#1d202b;position:absolute;cursor:pointer;z-index:1;opacity:0;transition:opacity .1s;will-change:left,opacity}.tc-toolbox--column{top:calc(var(--toggler-click-zone-size)*-1);transform:translate(calc(var(--toggler-click-zone-size)*-1/2));will-change:left,opacity}.tc-toolbox--row{left:calc(var(--popover-margin)*-1);transform:translateY(calc(var(--toggler-click-zone-size)*-1/2));margin-top:-1px;will-change:top,opacity}.tc-toolbox--showed{opacity:1}.tc-toolbox .tc-popover{position:absolute;top:0;left:var(--popover-margin)}.tc-toolbox__toggler{display:flex;align-items:center;justify-content:center;width:var(--toggler-click-zone-size);height:var(--toggler-click-zone-size);color:var(--toggler-dots-color);opacity:0;transition:opacity .15s ease;will-change:opacity}.tc-toolbox__toggler:hover{color:var(--toggler-dots-color-hovered)}.tc-toolbox__toggler svg{fill:currentColor}.tc-wrap:hover .tc-toolbox__toggler{opacity:1}.tc-settings .cdx-settings-button{width:50%;margin:0}.tc-popover{--color-border:#eaeaea;--color-background:#fff;--color-background-hover:rgba(232,232,235,.49);--color-background-confirm:#e24a4a;--color-background-confirm-hover:#d54040;--color-text-confirm:#fff;background:var(--color-background);border:1px solid var(--color-border);box-shadow:0 3px 15px -3px #0d142121;border-radius:6px;padding:6px;display:none;will-change:opacity,transform}.tc-popover--opened{display:block;animation:menuShowing .1s cubic-bezier(.215,.61,.355,1) forwards}.tc-popover__item{display:flex;align-items:center;padding:2px 14px 2px 2px;border-radius:5px;cursor:pointer;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;user-select:none}.tc-popover__item:hover{background:var(--color-background-hover)}.tc-popover__item:not(:last-of-type){margin-bottom:2px}.tc-popover__item-icon{display:inline-flex;width:26px;height:26px;align-items:center;justify-content:center;background:var(--color-background);border-radius:5px;border:1px solid var(--color-border);margin-right:8px}.tc-popover__item-label{line-height:22px;font-size:14px;font-weight:500}.tc-popover__item--confirm{background:var(--color-background-confirm);color:var(--color-text-confirm)}.tc-popover__item--confirm:hover{background-color:var(--color-background-confirm-hover)}.tc-popover__item--confirm .tc-popover__item-icon{background:var(--color-background-confirm);border-color:#0000001a}.tc-popover__item--confirm .tc-popover__item-icon svg{transition:transform .2s ease-in;transform:rotate(90deg) scale(1.2)}.tc-popover__item--hidden{display:none}@keyframes menuShowing{0%{opacity:0;transform:translateY(-8px) scale(.9)}70%{opacity:1;transform:translateY(2px)}to{transform:translateY(0)}}')), document.head.appendChild(o3);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
function c4(d3, t, e = {}) {
  const o3 = document.createElement(d3);
  Array.isArray(t) ? o3.classList.add(...t) : t && o3.classList.add(t);
  for (const i in e)
    Object.prototype.hasOwnProperty.call(e, i) && (o3[i] = e[i]);
  return o3;
}
function f3(d3) {
  const t = d3.getBoundingClientRect();
  return {
    y1: Math.floor(t.top + window.pageYOffset),
    x1: Math.floor(t.left + window.pageXOffset),
    x2: Math.floor(t.right + window.pageXOffset),
    y2: Math.floor(t.bottom + window.pageYOffset)
  };
}
function g5(d3, t) {
  const e = f3(d3), o3 = f3(t);
  return {
    fromTopBorder: o3.y1 - e.y1,
    fromLeftBorder: o3.x1 - e.x1,
    fromRightBorder: e.x2 - o3.x2,
    fromBottomBorder: e.y2 - o3.y2
  };
}
function k3(d3, t) {
  const e = d3.getBoundingClientRect(), { width: o3, height: i, x: n2, y: r2 } = e, { clientX: h3, clientY: l2 } = t;
  return {
    width: o3,
    height: i,
    x: h3 - n2,
    y: l2 - r2
  };
}
function m3(d3, t) {
  return t.parentNode.insertBefore(d3, t);
}
function C4(d3, t = true) {
  const e = document.createRange(), o3 = window.getSelection();
  e.selectNodeContents(d3), e.collapse(t), o3.removeAllRanges(), o3.addRange(e);
}
var a2 = class {
  /**
   * @param {object} options - constructor options
   * @param {PopoverItem[]} options.items - constructor options
   */
  constructor({ items: t }) {
    this.items = t, this.wrapper = void 0, this.itemEls = [];
  }
  /**
   * Set of CSS classnames used in popover
   *
   * @returns {object}
   */
  static get CSS() {
    return {
      popover: "tc-popover",
      popoverOpened: "tc-popover--opened",
      item: "tc-popover__item",
      itemHidden: "tc-popover__item--hidden",
      itemConfirmState: "tc-popover__item--confirm",
      itemIcon: "tc-popover__item-icon",
      itemLabel: "tc-popover__item-label"
    };
  }
  /**
   * Returns the popover element
   *
   * @returns {Element}
   */
  render() {
    return this.wrapper = c4("div", a2.CSS.popover), this.items.forEach((t, e) => {
      const o3 = c4("div", a2.CSS.item), i = c4("div", a2.CSS.itemIcon, {
        innerHTML: t.icon
      }), n2 = c4("div", a2.CSS.itemLabel, {
        textContent: t.label
      });
      o3.dataset.index = e, o3.appendChild(i), o3.appendChild(n2), this.wrapper.appendChild(o3), this.itemEls.push(o3);
    }), this.wrapper.addEventListener("click", (t) => {
      this.popoverClicked(t);
    }), this.wrapper;
  }
  /**
   * Popover wrapper click listener
   * Used to delegate clicks in items
   *
   * @returns {void}
   */
  popoverClicked(t) {
    const e = t.target.closest(`.${a2.CSS.item}`);
    if (!e)
      return;
    const o3 = e.dataset.index, i = this.items[o3];
    if (i.confirmationRequired && !this.hasConfirmationState(e)) {
      this.setConfirmationState(e);
      return;
    }
    i.onClick();
  }
  /**
   * Enable the confirmation state on passed item
   *
   * @returns {void}
   */
  setConfirmationState(t) {
    t.classList.add(a2.CSS.itemConfirmState);
  }
  /**
   * Disable the confirmation state on passed item
   *
   * @returns {void}
   */
  clearConfirmationState(t) {
    t.classList.remove(a2.CSS.itemConfirmState);
  }
  /**
   * Check if passed item has the confirmation state
   *
   * @returns {boolean}
   */
  hasConfirmationState(t) {
    return t.classList.contains(a2.CSS.itemConfirmState);
  }
  /**
   * Return an opening state
   *
   * @returns {boolean}
   */
  get opened() {
    return this.wrapper.classList.contains(a2.CSS.popoverOpened);
  }
  /**
   * Opens the popover
   *
   * @returns {void}
   */
  open() {
    this.items.forEach((t, e) => {
      typeof t.hideIf == "function" && this.itemEls[e].classList.toggle(a2.CSS.itemHidden, t.hideIf());
    }), this.wrapper.classList.add(a2.CSS.popoverOpened);
  }
  /**
   * Closes the popover
   *
   * @returns {void}
   */
  close() {
    this.wrapper.classList.remove(a2.CSS.popoverOpened), this.itemEls.forEach((t) => {
      this.clearConfirmationState(t);
    });
  }
};
var R3 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9L10 12M10 12L7 15M10 12H4"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9L14 12M14 12L17 15M14 12H20"/></svg>';
var b3 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 8L12 12M12 12L16 16M12 12L16 8M12 12L8 16"/></svg>';
var x2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 9.16666L18.2167 12.5M18.2167 12.5L14.8833 15.8333M18.2167 12.5H10.05C9.16594 12.5 8.31809 12.1488 7.69297 11.5237C7.06785 10.8986 6.71666 10.0507 6.71666 9.16666"/></svg>';
var S4 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.9167 14.9167L11.5833 18.25M11.5833 18.25L8.25 14.9167M11.5833 18.25L11.5833 10.0833C11.5833 9.19928 11.9345 8.35143 12.5596 7.72631C13.1848 7.10119 14.0326 6.75 14.9167 6.75"/></svg>';
var y3 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.13333 14.9167L12.4667 18.25M12.4667 18.25L15.8 14.9167M12.4667 18.25L12.4667 10.0833C12.4667 9.19928 12.1155 8.35143 11.4904 7.72631C10.8652 7.10119 10.0174 6.75 9.13333 6.75"/></svg>';
var L3 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.8833 15.8333L18.2167 12.5M18.2167 12.5L14.8833 9.16667M18.2167 12.5L10.05 12.5C9.16595 12.5 8.31811 12.8512 7.69299 13.4763C7.06787 14.1014 6.71667 14.9493 6.71667 15.8333"/></svg>';
var M2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.41 9.66H9.4"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 9.66H14.59"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M9.31 14.36H9.3"/><path stroke="currentColor" stroke-linecap="round" stroke-width="2.6" d="M14.6 14.36H14.59"/></svg>';
var v3 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 7V12M12 17V12M17 12H12M12 12H7"/></svg>';
var O2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9L20 12L17 15"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 12H20"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 9L4 12L7 15"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12H10"/></svg>';
var T2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
var H2 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M14 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><path stroke="currentColor" stroke-width="2" d="M5 14H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
var A3 = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 5V18.5"/><path stroke="currentColor" stroke-width="2" d="M5 10H19"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>';
var w3 = class {
  /**
   * Creates toolbox buttons and toolbox menus
   *
   * @param {Object} config
   * @param {any} config.api - Editor.js api
   * @param {PopoverItem[]} config.items - Editor.js api
   * @param {function} config.onOpen - callback fired when the Popover is opening
   * @param {function} config.onClose - callback fired when the Popover is closing
   * @param {string} config.cssModifier - the modifier for the Toolbox. Allows to add some specific styles.
   */
  constructor({ api: t, items: e, onOpen: o3, onClose: i, cssModifier: n2 = "" }) {
    this.api = t, this.items = e, this.onOpen = o3, this.onClose = i, this.cssModifier = n2, this.popover = null, this.wrapper = this.createToolbox();
  }
  /**
   * Style classes
   */
  static get CSS() {
    return {
      toolbox: "tc-toolbox",
      toolboxShowed: "tc-toolbox--showed",
      toggler: "tc-toolbox__toggler"
    };
  }
  /**
   * Returns rendered Toolbox element
   */
  get element() {
    return this.wrapper;
  }
  /**
   * Creating a toolbox to open menu for a manipulating columns
   *
   * @returns {Element}
   */
  createToolbox() {
    const t = c4(
      "div",
      [
        w3.CSS.toolbox,
        this.cssModifier ? `${w3.CSS.toolbox}--${this.cssModifier}` : ""
      ]
    );
    t.dataset.mutationFree = "true";
    const e = this.createPopover(), o3 = this.createToggler();
    return t.appendChild(o3), t.appendChild(e), t;
  }
  /**
   * Creates the Toggler
   *
   * @returns {Element}
   */
  createToggler() {
    const t = c4("div", w3.CSS.toggler, {
      innerHTML: M2
    });
    return t.addEventListener("click", () => {
      this.togglerClicked();
    }), t;
  }
  /**
   * Creates the Popover instance and render it
   *
   * @returns {Element}
   */
  createPopover() {
    return this.popover = new a2({
      items: this.items
    }), this.popover.render();
  }
  /**
   * Toggler click handler. Opens/Closes the popover
   *
   * @returns {void}
   */
  togglerClicked() {
    this.popover.opened ? (this.popover.close(), this.onClose()) : (this.popover.open(), this.onOpen());
  }
  /**
   * Shows the Toolbox
   *
   * @param {function} computePositionMethod - method that returns the position coordinate
   * @returns {void}
   */
  show(t) {
    const e = t();
    Object.entries(e).forEach(([o3, i]) => {
      this.wrapper.style[o3] = i;
    }), this.wrapper.classList.add(w3.CSS.toolboxShowed);
  }
  /**
   * Hides the Toolbox
   *
   * @returns {void}
   */
  hide() {
    this.popover.close(), this.wrapper.classList.remove(w3.CSS.toolboxShowed);
  }
};
function B2(d3, t) {
  let e = 0;
  return function(...o3) {
    const i = (/* @__PURE__ */ new Date()).getTime();
    if (!(i - e < d3))
      return e = i, t(...o3);
  };
}
var s = {
  wrapper: "tc-wrap",
  wrapperReadOnly: "tc-wrap--readonly",
  table: "tc-table",
  row: "tc-row",
  withHeadings: "tc-table--heading",
  rowSelected: "tc-row--selected",
  cell: "tc-cell",
  cellSelected: "tc-cell--selected",
  addRow: "tc-add-row",
  addRowDisabled: "tc-add-row--disabled",
  addColumn: "tc-add-column",
  addColumnDisabled: "tc-add-column--disabled"
};
var E3 = class {
  /**
   * Creates
   *
   * @constructor
   * @param {boolean} readOnly - read-only mode flag
   * @param {object} api - Editor.js API
   * @param {TableData} data - Editor.js API
   * @param {TableConfig} config - Editor.js API
   */
  constructor(t, e, o3, i) {
    this.readOnly = t, this.api = e, this.data = o3, this.config = i, this.wrapper = null, this.table = null, this.toolboxColumn = this.createColumnToolbox(), this.toolboxRow = this.createRowToolbox(), this.createTableWrapper(), this.hoveredRow = 0, this.hoveredColumn = 0, this.selectedRow = 0, this.selectedColumn = 0, this.tunes = {
      withHeadings: false
    }, this.resize(), this.fill(), this.focusedCell = {
      row: 0,
      column: 0
    }, this.documentClicked = (n2) => {
      const r2 = n2.target.closest(`.${s.table}`) !== null, h3 = n2.target.closest(`.${s.wrapper}`) === null;
      (r2 || h3) && this.hideToolboxes();
      const u4 = n2.target.closest(`.${s.addRow}`), p4 = n2.target.closest(`.${s.addColumn}`);
      u4 && u4.parentNode === this.wrapper ? (this.addRow(void 0, true), this.hideToolboxes()) : p4 && p4.parentNode === this.wrapper && (this.addColumn(void 0, true), this.hideToolboxes());
    }, this.readOnly || this.bindEvents();
  }
  /**
   * Returns the rendered table wrapper
   *
   * @returns {Element}
   */
  getWrapper() {
    return this.wrapper;
  }
  /**
   * Hangs the necessary handlers to events
   */
  bindEvents() {
    document.addEventListener("click", this.documentClicked), this.table.addEventListener("mousemove", B2(150, (t) => this.onMouseMoveInTable(t)), { passive: true }), this.table.onkeypress = (t) => this.onKeyPressListener(t), this.table.addEventListener("keydown", (t) => this.onKeyDownListener(t)), this.table.addEventListener("focusin", (t) => this.focusInTableListener(t));
  }
  /**
   * Configures and creates the toolbox for manipulating with columns
   *
   * @returns {Toolbox}
   */
  createColumnToolbox() {
    return new w3({
      api: this.api,
      cssModifier: "column",
      items: [
        {
          label: this.api.i18n.t("Add column to left"),
          icon: S4,
          hideIf: () => this.numberOfColumns === this.config.maxcols,
          onClick: () => {
            this.addColumn(this.selectedColumn, true), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Add column to right"),
          icon: y3,
          hideIf: () => this.numberOfColumns === this.config.maxcols,
          onClick: () => {
            this.addColumn(this.selectedColumn + 1, true), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Delete column"),
          icon: b3,
          hideIf: () => this.numberOfColumns === 1,
          confirmationRequired: true,
          onClick: () => {
            this.deleteColumn(this.selectedColumn), this.hideToolboxes();
          }
        }
      ],
      onOpen: () => {
        this.selectColumn(this.hoveredColumn), this.hideRowToolbox();
      },
      onClose: () => {
        this.unselectColumn();
      }
    });
  }
  /**
   * Configures and creates the toolbox for manipulating with rows
   *
   * @returns {Toolbox}
   */
  createRowToolbox() {
    return new w3({
      api: this.api,
      cssModifier: "row",
      items: [
        {
          label: this.api.i18n.t("Add row above"),
          icon: L3,
          hideIf: () => this.numberOfRows === this.config.maxrows,
          onClick: () => {
            this.addRow(this.selectedRow, true), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Add row below"),
          icon: x2,
          hideIf: () => this.numberOfRows === this.config.maxrows,
          onClick: () => {
            this.addRow(this.selectedRow + 1, true), this.hideToolboxes();
          }
        },
        {
          label: this.api.i18n.t("Delete row"),
          icon: b3,
          hideIf: () => this.numberOfRows === 1,
          confirmationRequired: true,
          onClick: () => {
            this.deleteRow(this.selectedRow), this.hideToolboxes();
          }
        }
      ],
      onOpen: () => {
        this.selectRow(this.hoveredRow), this.hideColumnToolbox();
      },
      onClose: () => {
        this.unselectRow();
      }
    });
  }
  /**
   * When you press enter it moves the cursor down to the next row
   * or creates it if the click occurred on the last one
   */
  moveCursorToNextRow() {
    this.focusedCell.row !== this.numberOfRows ? (this.focusedCell.row += 1, this.focusCell(this.focusedCell)) : (this.addRow(), this.focusedCell.row += 1, this.focusCell(this.focusedCell), this.updateToolboxesPosition(0, 0));
  }
  /**
   * Get table cell by row and col index
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @returns {HTMLElement}
   */
  getCell(t, e) {
    return this.table.querySelectorAll(`.${s.row}:nth-child(${t}) .${s.cell}`)[e - 1];
  }
  /**
   * Get table row by index
   *
   * @param {number} row - row coordinate
   * @returns {HTMLElement}
   */
  getRow(t) {
    return this.table.querySelector(`.${s.row}:nth-child(${t})`);
  }
  /**
   * The parent of the cell which is the row
   *
   * @param {HTMLElement} cell - cell element
   * @returns {HTMLElement}
   */
  getRowByCell(t) {
    return t.parentElement;
  }
  /**
   * Ger row's first cell
   *
   * @param {Element} row - row to find its first cell
   * @returns {Element}
   */
  getRowFirstCell(t) {
    return t.querySelector(`.${s.cell}:first-child`);
  }
  /**
   * Set the sell's content by row and column numbers
   *
   * @param {number} row - cell row coordinate
   * @param {number} column - cell column coordinate
   * @param {string} content - cell HTML content
   */
  setCellContent(t, e, o3) {
    const i = this.getCell(t, e);
    i.innerHTML = o3;
  }
  /**
   * Add column in table on index place
   * Add cells in each row
   *
   * @param {number} columnIndex - number in the array of columns, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the first cell
   */
  addColumn(t = -1, e = false) {
    var n2;
    let o3 = this.numberOfColumns;
    if (this.config && this.config.maxcols && this.numberOfColumns >= this.config.maxcols)
      return;
    for (let r2 = 1; r2 <= this.numberOfRows; r2++) {
      let h3;
      const l2 = this.createCell();
      if (t > 0 && t <= o3 ? (h3 = this.getCell(r2, t), m3(l2, h3)) : h3 = this.getRow(r2).appendChild(l2), r2 === 1) {
        const u4 = this.getCell(r2, t > 0 ? t : o3 + 1);
        u4 && e && C4(u4);
      }
    }
    const i = this.wrapper.querySelector(`.${s.addColumn}`);
    (n2 = this.config) != null && n2.maxcols && this.numberOfColumns > this.config.maxcols - 1 && i && i.classList.add(s.addColumnDisabled), this.addHeadingAttrToFirstRow();
  }
  /**
   * Add row in table on index place
   *
   * @param {number} index - number in the array of rows, where new column to insert, -1 if insert at the end
   * @param {boolean} [setFocus] - pass true to focus the inserted row
   * @returns {HTMLElement} row
   */
  addRow(t = -1, e = false) {
    let o3, i = c4("div", s.row);
    this.tunes.withHeadings && this.removeHeadingAttrFromFirstRow();
    let n2 = this.numberOfColumns;
    if (this.config && this.config.maxrows && this.numberOfRows >= this.config.maxrows && h3)
      return;
    if (t > 0 && t <= this.numberOfRows) {
      let l2 = this.getRow(t);
      o3 = m3(i, l2);
    } else
      o3 = this.table.appendChild(i);
    this.fillRow(o3, n2), this.tunes.withHeadings && this.addHeadingAttrToFirstRow();
    const r2 = this.getRowFirstCell(o3);
    r2 && e && C4(r2);
    const h3 = this.wrapper.querySelector(`.${s.addRow}`);
    return this.config && this.config.maxrows && this.numberOfRows >= this.config.maxrows && h3 && h3.classList.add(s.addRowDisabled), o3;
  }
  /**
   * Delete a column by index
   *
   * @param {number} index
   */
  deleteColumn(t) {
    for (let o3 = 1; o3 <= this.numberOfRows; o3++) {
      const i = this.getCell(o3, t);
      if (!i)
        return;
      i.remove();
    }
    const e = this.wrapper.querySelector(`.${s.addColumn}`);
    e && e.classList.remove(s.addColumnDisabled);
  }
  /**
   * Delete a row by index
   *
   * @param {number} index
   */
  deleteRow(t) {
    this.getRow(t).remove();
    const e = this.wrapper.querySelector(`.${s.addRow}`);
    e && e.classList.remove(s.addRowDisabled), this.addHeadingAttrToFirstRow();
  }
  /**
   * Create a wrapper containing a table, toolboxes
   * and buttons for adding rows and columns
   *
   * @returns {HTMLElement} wrapper - where all buttons for a table and the table itself will be
   */
  createTableWrapper() {
    if (this.wrapper = c4("div", s.wrapper), this.table = c4("div", s.table), this.readOnly && this.wrapper.classList.add(s.wrapperReadOnly), this.wrapper.appendChild(this.toolboxRow.element), this.wrapper.appendChild(this.toolboxColumn.element), this.wrapper.appendChild(this.table), !this.readOnly) {
      const t = c4("div", s.addColumn, {
        innerHTML: v3
      }), e = c4("div", s.addRow, {
        innerHTML: v3
      });
      this.wrapper.appendChild(t), this.wrapper.appendChild(e);
    }
  }
  /**
   * Returns the size of the table based on initial data or config "size" property
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  computeInitialSize() {
    const t = this.data && this.data.content, e = Array.isArray(t), o3 = e ? t.length : false, i = e ? t.length : void 0, n2 = o3 ? t[0].length : void 0, r2 = Number.parseInt(this.config && this.config.rows), h3 = Number.parseInt(this.config && this.config.cols), l2 = !isNaN(r2) && r2 > 0 ? r2 : void 0, u4 = !isNaN(h3) && h3 > 0 ? h3 : void 0;
    return {
      rows: i || l2 || 2,
      cols: n2 || u4 || 2
    };
  }
  /**
   * Resize table to match config size or transmitted data size
   *
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  resize() {
    const { rows: t, cols: e } = this.computeInitialSize();
    for (let o3 = 0; o3 < t; o3++)
      this.addRow();
    for (let o3 = 0; o3 < e; o3++)
      this.addColumn();
  }
  /**
   * Fills the table with data passed to the constructor
   *
   * @returns {void}
   */
  fill() {
    const t = this.data;
    if (t && t.content)
      for (let e = 0; e < t.content.length; e++)
        for (let o3 = 0; o3 < t.content[e].length; o3++)
          this.setCellContent(e + 1, o3 + 1, t.content[e][o3]);
  }
  /**
   * Fills a row with cells
   *
   * @param {HTMLElement} row - row to fill
   * @param {number} numberOfColumns - how many cells should be in a row
   */
  fillRow(t, e) {
    for (let o3 = 1; o3 <= e; o3++) {
      const i = this.createCell();
      t.appendChild(i);
    }
  }
  /**
   * Creating a cell element
   *
   * @return {Element}
   */
  createCell() {
    return c4("div", s.cell, {
      contentEditable: !this.readOnly
    });
  }
  /**
   * Get number of rows in the table
   */
  get numberOfRows() {
    return this.table.childElementCount;
  }
  /**
   * Get number of columns in the table
   */
  get numberOfColumns() {
    return this.numberOfRows ? this.table.querySelectorAll(`.${s.row}:first-child .${s.cell}`).length : 0;
  }
  /**
   * Is the column toolbox menu displayed or not
   *
   * @returns {boolean}
   */
  get isColumnMenuShowing() {
    return this.selectedColumn !== 0;
  }
  /**
   * Is the row toolbox menu displayed or not
   *
   * @returns {boolean}
   */
  get isRowMenuShowing() {
    return this.selectedRow !== 0;
  }
  /**
   * Recalculate position of toolbox icons
   *
   * @param {Event} event - mouse move event
   */
  onMouseMoveInTable(t) {
    const { row: e, column: o3 } = this.getHoveredCell(t);
    this.hoveredColumn = o3, this.hoveredRow = e, this.updateToolboxesPosition();
  }
  /**
   * Prevents default Enter behaviors
   * Adds Shift+Enter processing
   *
   * @param {KeyboardEvent} event - keypress event
   */
  onKeyPressListener(t) {
    if (t.key === "Enter") {
      if (t.shiftKey)
        return true;
      this.moveCursorToNextRow();
    }
    return t.key !== "Enter";
  }
  /**
   * Prevents tab keydown event from bubbling
   * so that it only works inside the table
   *
   * @param {KeyboardEvent} event - keydown event
   */
  onKeyDownListener(t) {
    t.key === "Tab" && t.stopPropagation();
  }
  /**
   * Set the coordinates of the cell that the focus has moved to
   *
   * @param {FocusEvent} event - focusin event
   */
  focusInTableListener(t) {
    const e = t.target, o3 = this.getRowByCell(e);
    this.focusedCell = {
      row: Array.from(this.table.querySelectorAll(`.${s.row}`)).indexOf(o3) + 1,
      column: Array.from(o3.querySelectorAll(`.${s.cell}`)).indexOf(e) + 1
    };
  }
  /**
   * Unselect row/column
   * Close toolbox menu
   * Hide toolboxes
   *
   * @returns {void}
   */
  hideToolboxes() {
    this.hideRowToolbox(), this.hideColumnToolbox(), this.updateToolboxesPosition();
  }
  /**
   * Unselect row, close toolbox
   *
   * @returns {void}
   */
  hideRowToolbox() {
    this.unselectRow(), this.toolboxRow.hide();
  }
  /**
   * Unselect column, close toolbox
   *
   * @returns {void}
   */
  hideColumnToolbox() {
    this.unselectColumn(), this.toolboxColumn.hide();
  }
  /**
   * Set the cursor focus to the focused cell
   *
   * @returns {void}
   */
  focusCell() {
    this.focusedCellElem.focus();
  }
  /**
   * Get current focused element
   *
   * @returns {HTMLElement} - focused cell
   */
  get focusedCellElem() {
    const { row: t, column: e } = this.focusedCell;
    return this.getCell(t, e);
  }
  /**
   * Update toolboxes position
   *
   * @param {number} row - hovered row
   * @param {number} column - hovered column
   */
  updateToolboxesPosition(t = this.hoveredRow, e = this.hoveredColumn) {
    this.isColumnMenuShowing || e > 0 && e <= this.numberOfColumns && this.toolboxColumn.show(() => ({
      left: `calc((100% - var(--cell-size)) / (${this.numberOfColumns} * 2) * (1 + (${e} - 1) * 2))`
    })), this.isRowMenuShowing || t > 0 && t <= this.numberOfRows && this.toolboxRow.show(() => {
      const o3 = this.getRow(t), { fromTopBorder: i } = g5(this.table, o3), { height: n2 } = o3.getBoundingClientRect();
      return {
        top: `${Math.ceil(i + n2 / 2)}px`
      };
    });
  }
  /**
   * Makes the first row headings
   *
   * @param {boolean} withHeadings - use headings row or not
   */
  setHeadingsSetting(t) {
    this.tunes.withHeadings = t, t ? (this.table.classList.add(s.withHeadings), this.addHeadingAttrToFirstRow()) : (this.table.classList.remove(s.withHeadings), this.removeHeadingAttrFromFirstRow());
  }
  /**
   * Adds an attribute for displaying the placeholder in the cell
   */
  addHeadingAttrToFirstRow() {
    for (let t = 1; t <= this.numberOfColumns; t++) {
      let e = this.getCell(1, t);
      e && e.setAttribute("heading", this.api.i18n.t("Heading"));
    }
  }
  /**
   * Removes an attribute for displaying the placeholder in the cell
   */
  removeHeadingAttrFromFirstRow() {
    for (let t = 1; t <= this.numberOfColumns; t++) {
      let e = this.getCell(1, t);
      e && e.removeAttribute("heading");
    }
  }
  /**
   * Add effect of a selected row
   *
   * @param {number} index
   */
  selectRow(t) {
    const e = this.getRow(t);
    e && (this.selectedRow = t, e.classList.add(s.rowSelected));
  }
  /**
   * Remove effect of a selected row
   */
  unselectRow() {
    if (this.selectedRow <= 0)
      return;
    const t = this.table.querySelector(`.${s.rowSelected}`);
    t && t.classList.remove(s.rowSelected), this.selectedRow = 0;
  }
  /**
   * Add effect of a selected column
   *
   * @param {number} index
   */
  selectColumn(t) {
    for (let e = 1; e <= this.numberOfRows; e++) {
      const o3 = this.getCell(e, t);
      o3 && o3.classList.add(s.cellSelected);
    }
    this.selectedColumn = t;
  }
  /**
   * Remove effect of a selected column
   */
  unselectColumn() {
    if (this.selectedColumn <= 0)
      return;
    let t = this.table.querySelectorAll(`.${s.cellSelected}`);
    Array.from(t).forEach((e) => {
      e.classList.remove(s.cellSelected);
    }), this.selectedColumn = 0;
  }
  /**
   * Calculates the row and column that the cursor is currently hovering over
   * The search was optimized from O(n) to O (log n) via bin search to reduce the number of calculations
   *
   * @param {Event} event - mousemove event
   * @returns hovered cell coordinates as an integer row and column
   */
  getHoveredCell(t) {
    let e = this.hoveredRow, o3 = this.hoveredColumn;
    const { width: i, height: n2, x: r2, y: h3 } = k3(this.table, t);
    return r2 >= 0 && (o3 = this.binSearch(
      this.numberOfColumns,
      (l2) => this.getCell(1, l2),
      ({ fromLeftBorder: l2 }) => r2 < l2,
      ({ fromRightBorder: l2 }) => r2 > i - l2
    )), h3 >= 0 && (e = this.binSearch(
      this.numberOfRows,
      (l2) => this.getCell(l2, 1),
      ({ fromTopBorder: l2 }) => h3 < l2,
      ({ fromBottomBorder: l2 }) => h3 > n2 - l2
    )), {
      row: e || this.hoveredRow,
      column: o3 || this.hoveredColumn
    };
  }
  /**
   * Looks for the index of the cell the mouse is hovering over.
   * Cells can be represented as ordered intervals with left and
   * right (upper and lower for rows) borders inside the table, if the mouse enters it, then this is our index
   *
   * @param {number} numberOfCells - upper bound of binary search
   * @param {function} getCell - function to take the currently viewed cell
   * @param {function} beforeTheLeftBorder - determines the cursor position, to the left of the cell or not
   * @param {function} afterTheRightBorder - determines the cursor position, to the right of the cell or not
   * @returns {number}
   */
  binSearch(t, e, o3, i) {
    let n2 = 0, r2 = t + 1, h3 = 0, l2;
    for (; n2 < r2 - 1 && h3 < 10; ) {
      l2 = Math.ceil((n2 + r2) / 2);
      const u4 = e(l2), p4 = g5(this.table, u4);
      if (o3(p4))
        r2 = l2;
      else if (i(p4))
        n2 = l2;
      else
        break;
      h3++;
    }
    return l2;
  }
  /**
   * Collects data from cells into a two-dimensional array
   *
   * @returns {string[][]}
   */
  getData() {
    const t = [];
    for (let e = 1; e <= this.numberOfRows; e++) {
      const o3 = this.table.querySelector(`.${s.row}:nth-child(${e})`), i = Array.from(o3.querySelectorAll(`.${s.cell}`));
      i.every((r2) => !r2.textContent.trim()) || t.push(i.map((r2) => r2.innerHTML));
    }
    return t;
  }
  /**
   * Remove listeners on the document
   */
  destroy() {
    document.removeEventListener("click", this.documentClicked);
  }
};
var F2 = class {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }
  /**
   * Allow to press Enter inside the CodeTool textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {TableConstructor} init
   */
  constructor({ data: t, config: e, api: o3, readOnly: i, block: n2 }) {
    this.api = o3, this.readOnly = i, this.config = e, this.data = {
      withHeadings: this.getConfig("withHeadings", false, t),
      stretched: this.getConfig("stretched", false, t),
      content: t && t.content ? t.content : []
    }, this.table = null, this.block = n2;
  }
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: A3,
      title: "Table"
    };
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this.table = new E3(this.readOnly, this.api, this.data, this.config), this.container = c4("div", this.api.styles.block), this.container.appendChild(this.table.getWrapper()), this.table.setHeadingsSetting(this.data.withHeadings), this.container;
  }
  /**
   * Returns plugin settings
   *
   * @returns {Array}
   */
  renderSettings() {
    return [
      {
        label: this.api.i18n.t("With headings"),
        icon: T2,
        isActive: this.data.withHeadings,
        closeOnActivate: true,
        toggle: true,
        onActivate: () => {
          this.data.withHeadings = true, this.table.setHeadingsSetting(this.data.withHeadings);
        }
      },
      {
        label: this.api.i18n.t("Without headings"),
        icon: H2,
        isActive: !this.data.withHeadings,
        closeOnActivate: true,
        toggle: true,
        onActivate: () => {
          this.data.withHeadings = false, this.table.setHeadingsSetting(this.data.withHeadings);
        }
      },
      {
        label: this.data.stretched ? this.api.i18n.t("Collapse") : this.api.i18n.t("Stretch"),
        icon: this.data.stretched ? R3 : O2,
        closeOnActivate: true,
        toggle: true,
        onActivate: () => {
          this.data.stretched = !this.data.stretched, this.block.stretched = this.data.stretched;
        }
      }
    ];
  }
  /**
   * Extract table data from the view
   *
   * @returns {TableData} - saved data
   */
  save() {
    const t = this.table.getData();
    return {
      withHeadings: this.data.withHeadings,
      stretched: this.data.stretched,
      content: t
    };
  }
  /**
   * Plugin destroyer
   *
   * @returns {void}
   */
  destroy() {
    this.table.destroy();
  }
  /**
   * A helper to get config value.
   *
   * @param {string} configName - the key to get from the config.
   * @param {any} defaultValue - default value if config doesn't have passed key
   * @param {object} savedData - previously saved data. If passed, the key will be got from there, otherwise from the config
   * @returns {any} - config value.
   */
  getConfig(t, e = void 0, o3 = void 0) {
    const i = this.data || o3;
    return i ? i[t] ? i[t] : e : this.config && this.config[t] ? this.config[t] : e;
  }
  /**
   * Table onPaste configuration
   *
   * @public
   */
  static get pasteConfig() {
    return { tags: ["TABLE", "TR", "TH", "TD"] };
  }
  /**
   * On paste callback that is fired from Editor
   *
   * @param {PasteEvent} event - event with pasted data
   */
  onPaste(t) {
    const e = t.detail.data, o3 = e.querySelector(":scope > thead, tr:first-of-type th"), n2 = Array.from(e.querySelectorAll("tr")).map((r2) => Array.from(r2.querySelectorAll("th, td")).map((l2) => l2.innerHTML));
    this.data = {
      withHeadings: o3 !== null,
      content: n2
    }, this.table.wrapper && this.table.wrapper.replaceWith(this.render());
  }
};

// ../core/jupiter/core/infra/component/block-editor.tsx
var import_webapi_client = __toESM(require_dist(), 1);
var import_editorjs_drag_drop = __toESM(require_bundle(), 1);
var import_react = __toESM(require_react(), 1);
function BlockEditor(props) {
  const ejInstance = (0, import_react.useRef)();
  const initEditor = () => {
    const editor = new Aa({
      holder: `editorjs-${props.editorSlug}`,
      placeholder: "Start writing...",
      autofocus: props.autofocus,
      readOnly: !props.inputsEnabled,
      data: props.initialContent ? transformContentBlocksToEditorJs(props.initialContent) : void 0,
      onReady: () => {
        ejInstance.current = editor;
        new import_editorjs_drag_drop.default(editor);
      },
      onChange: async () => {
        const content = await editor.saver.save();
        if (props.onChange) {
          props.onChange(transformEditorJsToContentBlocks(content));
        }
      },
      tools: {
        header: {
          class: v,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3]
          }
        },
        list: {
          class: f2,
          inlineToolbar: true
        },
        checklist: {
          class: f,
          inlineToolbar: true
        },
        table: {
          class: F2,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        code: import_editorjs_codecup.default,
        quote: {
          class: m2,
          inlineToolbar: true
        },
        delimiter: n
      }
    });
  };
  (0, import_react.useEffect)(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
      }
      ejInstance.current = void 0;
    };
  }, []);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      id: `editorjs-${props.editorSlug}`,
      "data-testid": props.dataTestId
    },
    void 0,
    false,
    {
      fileName: "../core/jupiter/core/infra/component/block-editor.tsx",
      lineNumber: 112,
      columnNumber: 5
    },
    this
  );
}
function transformContentBlocksToEditorJs(content) {
  function transformListItemToEditorJs(listItem) {
    return {
      content: listItem.text,
      items: listItem.items.map(transformListItemToEditorJs)
    };
  }
  return {
    time: Date.now(),
    blocks: content.map((block) => {
      switch (block.kind) {
        case import_webapi_client.ParagraphBlock.kind.PARAGRAPH:
          return {
            type: "paragraph",
            id: block.correlation_id,
            data: {
              text: block.text
            }
          };
        case import_webapi_client.HeadingBlock.kind.HEADING:
          return {
            type: "header",
            id: block.correlation_id,
            data: {
              text: block.text,
              level: block.level
            }
          };
        case import_webapi_client.BulletedListBlock.kind.BULLETED_LIST:
          return {
            type: "list",
            id: block.correlation_id,
            data: {
              style: "unordered",
              items: block.items.map(transformListItemToEditorJs)
            }
          };
        case import_webapi_client.NumberedListBlock.kind.NUMBERED_LIST:
          return {
            type: "list",
            id: block.correlation_id,
            data: {
              style: "ordered",
              items: block.items.map(transformListItemToEditorJs)
            }
          };
        case import_webapi_client.ChecklistBlock.kind.CHECKLIST:
          return {
            type: "checklist",
            id: block.correlation_id,
            data: {
              items: block.items
            }
          };
        case import_webapi_client.TableBlock.kind.TABLE:
          return {
            type: "table",
            id: block.correlation_id,
            data: {
              withHeadings: block.with_header,
              content: block.contents
            }
          };
        case import_webapi_client.CodeBlock.kind.CODE:
          return {
            type: "code",
            id: block.correlation_id,
            data: {
              code: block.code,
              language: block.language,
              showlinenumbers: block.show_line_numbers
            }
          };
        case import_webapi_client.QuoteBlock.kind.QUOTE:
          return {
            type: "quote",
            id: block.correlation_id,
            data: {
              text: block.text,
              caption: ""
            }
          };
        case import_webapi_client.DividerBlock.kind.DIVIDER:
          return {
            type: "delimiter",
            id: block.correlation_id,
            data: {}
          };
        case import_webapi_client.LinkBlock.kind.LINK:
          throw new Error("Link blocks are not supported right now");
        case import_webapi_client.EntityReferenceBlock.kind.ENTITY_REFERENCE:
          throw new Error(
            "Entity reference blocks are not supported right now"
          );
        default:
          throw new Error(`Unknown block kind: ${block}`);
      }
    }),
    version: "2.22.2"
  };
}
function transformEditorJsToContentBlocks(content) {
  function transformEditorJsToListItem(listItem) {
    return {
      text: listItem.content,
      items: listItem.items.map(transformEditorJsToListItem)
    };
  }
  return content.blocks.map((block) => {
    switch (block.type) {
      case "paragraph":
        return {
          kind: import_webapi_client.ParagraphBlock.kind.PARAGRAPH,
          correlation_id: block.id,
          text: block.data.text
        };
      case "header":
        return {
          kind: import_webapi_client.HeadingBlock.kind.HEADING,
          correlation_id: block.id,
          text: block.data.text,
          level: block.data.level
        };
      case "list":
        if (block.data.style === "unordered") {
          return {
            kind: import_webapi_client.BulletedListBlock.kind.BULLETED_LIST,
            correlation_id: block.id,
            items: block.data.items.map(transformEditorJsToListItem)
          };
        } else if (block.data.style === "ordered") {
          return {
            kind: import_webapi_client.NumberedListBlock.kind.NUMBERED_LIST,
            correlation_id: block.id,
            items: block.data.items.map(transformEditorJsToListItem)
          };
        } else {
          throw new Error(`Unknown list style: ${block.data.style}`);
        }
      case "checklist":
        return {
          kind: import_webapi_client.ChecklistBlock.kind.CHECKLIST,
          correlation_id: block.id,
          items: block.data.items.map(
            (item) => ({
              text: item.text,
              checked: item.checked
            })
          )
        };
      case "table":
        return {
          kind: import_webapi_client.TableBlock.kind.TABLE,
          correlation_id: block.id,
          with_header: block.data.withHeadings,
          contents: block.data.content
        };
      case "code":
        return {
          kind: import_webapi_client.CodeBlock.kind.CODE,
          correlation_id: block.id,
          code: block.data.code,
          language: block.data.language,
          show_line_numbers: block.data.showlinenumbers
        };
      case "quote":
        return {
          kind: import_webapi_client.QuoteBlock.kind.QUOTE,
          correlation_id: block.id,
          text: block.data.text
        };
      case "delimiter":
        return {
          kind: import_webapi_client.DividerBlock.kind.DIVIDER,
          correlation_id: block.id
        };
      default:
        throw new Error(`Unknown block type: ${block.type}`);
    }
  });
}
export {
  BlockEditor as default
};
/*! Bundled license information:

@calumk/editorjs-codecup/dist/editorjs-codeCup.bundle.js:
  (*! For license information please see editorjs-codeCup.bundle.js.LICENSE.txt *)

@editorjs/delimiter/dist/delimiter.mjs:
  (**
   * Delimiter Block for the Editor.js.
   *
   * @author CodeX (team@ifmo.su)
   * @copyright CodeX 2018
   * @license The MIT License (MIT)
   * @version 2.0.0
   *)

@editorjs/editorjs/dist/editorjs.mjs:
  (*!
   * CodeX.Tooltips
   * 
   * @version 1.0.5
   * 
   * @licence MIT
   * @author CodeX <https://codex.so>
   * 
   * 
   *)
  (*!
   * Library for handling keyboard shortcuts
   * @copyright CodeX (https://codex.so)
   * @license MIT
   * @author CodeX (https://codex.so)
   * @version 1.2.0
   *)
  (**
   * Base Paragraph Block for the Editor.js.
   * Represents a regular text block
   *
   * @author CodeX (team@codex.so)
   * @copyright CodeX 2018
   * @license The MIT License (MIT)
   *)
  (**
   * Editor.js
   *
   * @license Apache-2.0
   * @see Editor.js <https://editorjs.io>
   * @author CodeX Team <https://codex.so>
   *)

@editorjs/header/dist/header.mjs:
  (**
   * Header block for the Editor.js.
   *
   * @author CodeX (team@ifmo.su)
   * @copyright CodeX 2018
   * @license MIT
   * @version 2.0.0
   *)
*/
//# sourceMappingURL=/build/_shared/block-editor-YIFMEPBT.js.map
