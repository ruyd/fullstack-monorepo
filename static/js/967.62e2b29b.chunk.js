!function(){"use strict";function e(e,n){(null==n||n>e.length)&&(n=e.length);for(var r=0,o=new Array(n);r<n;r++)o[r]=e[r];return o}function n(n,r){var o="undefined"!==typeof Symbol&&n[Symbol.iterator]||n["@@iterator"];if(!o){if(Array.isArray(n)||(o=function(n,r){if(n){if("string"===typeof n)return e(n,r);var o=Object.prototype.toString.call(n).slice(8,-1);return"Object"===o&&n.constructor&&(o=n.constructor.name),"Map"===o||"Set"===o?Array.from(n):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?e(n,r):void 0}}(n))||r&&n&&"number"===typeof n.length){o&&(n=o);var t=0,a=function(){};return{s:a,n:function(){return t>=n.length?{done:!0}:{done:!1,value:n[t++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var _,i=!0,l=!1;return{s:function(){o=o.call(n)},n:function(){var e=o.next();return i=e.done,e},e:function(e){l=!0,_=e},f:function(){try{i||null==o.return||o.return()}finally{if(l)throw _}}}}var r,o,t,a;!function(e){e[e.Open=0]="Open",e[e.Close=1]="Close",e[e.Stroke=2]="Stroke"}(r||(r={})),function(e){e.Pending="pending",e.Paid="paid",e.Shipped="shipped",e.Delivered="delivered",e.Cancelled="cancelled"}(o||(o={})),function(e){e.Stripe="STRIPE",e.PayPal="PAYPAL"}(t||(t={})),function(e){e.Successful="COMPLETED",e.Pending="PENDING",e.Failed="FAILED",e.Created="CREATED"}(a||(a={}));a.Failed,a.Successful,a.Pending,a.Pending,a.Pending,a.Pending,a.Pending,a.Failed;var _={NODE_ENV:"production",PUBLIC_URL:"/fullstack-monorepo",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0,GITHUB_STATE:"/home/runner/work/_temp/_runner_file_commands/save_state_7838a847-c285-405e-9107-f68f4ecb1b17",DEPLOYMENT_BASEPATH:"/opt/runner",DOTNET_NOLOGO:"1",USER:"runner",npm_config_user_agent:"yarn/3.3.0 npm/? node/v16.18.1 linux x64",CI:"true",GITHUB_ENV:"/home/runner/work/_temp/_runner_file_commands/set_env_7838a847-c285-405e-9107-f68f4ecb1b17",PIPX_HOME:"/opt/pipx",npm_node_execpath:"/tmp/xfs-66656f88/node",JAVA_HOME_8_X64:"/usr/lib/jvm/temurin-8-jdk-amd64",SHLVL:"1",HOME:"/home/runner",RUNNER_TEMP:"/home/runner/work/_temp",GITHUB_EVENT_PATH:"/home/runner/work/_temp/_github_workflow/event.json",npm_package_json:"/home/runner/work/fullstack-monorepo/fullstack-monorepo/workspaces/client/package.json",JAVA_HOME_11_X64:"/usr/lib/jvm/temurin-11-jdk-amd64",PIPX_BIN_DIR:"/opt/pipx_bin",GRAALVM_11_ROOT:"/usr/local/graalvm/graalvm-ce-java11-22.3.0",GITHUB_REPOSITORY_OWNER:"ruyd",GRADLE_HOME:"/usr/share/gradle-7.6",ANDROID_NDK_LATEST_HOME:"/usr/local/lib/android/sdk/ndk/25.1.8937393",STATS_RDCL:"true",GITHUB_RETENTION_DAYS:"90",POWERSHELL_DISTRIBUTION_CHANNEL:"GitHub-Actions-ubuntu22",AZURE_EXTENSION_DIR:"/opt/az/azcliextensions",GITHUB_HEAD_REF:"",SYSTEMD_EXEC_PID:"668",GITHUB_GRAPHQL_URL:"https://api.github.com/graphql",NVM_DIR:"/home/runner/.nvm",DOTNET_SKIP_FIRST_TIME_EXPERIENCE:"1",JAVA_HOME_17_X64:"/usr/lib/jvm/temurin-17-jdk-amd64",ImageVersion:"20221212.1",RUNNER_OS:"Linux",GITHUB_API_URL:"https://api.github.com",SWIFT_PATH:"/usr/share/swift/usr/bin",RUNNER_USER:"runner",CHROMEWEBDRIVER:"/usr/local/share/chrome_driver",JOURNAL_STREAM:"8:17015",GITHUB_WORKFLOW:"Deploy: Client: Github Pages",_:"/usr/local/bin/yarn",GITHUB_RUN_ID:"3870505993",HOMEPAGE:"fullstack-monorepo",GOROOT_1_17_X64:"/opt/hostedtoolcache/go/1.17.13/x64",GITHUB_REF_TYPE:"branch",BOOTSTRAP_HASKELL_NONINTERACTIVE:"1",GITHUB_BASE_REF:"",ImageOS:"ubuntu22",PERFLOG_LOCATION_SETTING:"RUNNER_PERFLOG",GOROOT_1_18_X64:"/opt/hostedtoolcache/go/1.18.9/x64",GITHUB_ACTION_REPOSITORY:"",PATH:"/tmp/xfs-66656f88:/opt/hostedtoolcache/node/16.18.1/x64/bin:/home/runner/.local/bin:/opt/pipx_bin:/home/runner/.cargo/bin:/home/runner/.config/composer/vendor/bin:/usr/local/.ghcup/bin:/home/runner/.dotnet/tools:/snap/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin",ANT_HOME:"/usr/share/ant",DOTNET_MULTILEVEL_LOOKUP:"0",RUNNER_TRACKING_ID:"github_de755ac0-1635-4bd4-9b03-9b300ddd19b2",INVOCATION_ID:"8f32abc65edc46949a67391debb37ac0",RUNNER_TOOL_CACHE:"/opt/hostedtoolcache",GOROOT_1_19_X64:"/opt/hostedtoolcache/go/1.19.4/x64",npm_package_name:"client",GITHUB_ACTION:"__run_2",GITHUB_RUN_NUMBER:"20",GITHUB_TRIGGERING_ACTOR:"ruyd",RUNNER_ARCH:"X64",XDG_RUNTIME_DIR:"/run/user/1001",AGENT_TOOLSDIRECTORY:"/opt/hostedtoolcache",LANG:"C.UTF-8",VCPKG_INSTALLATION_ROOT:"/usr/local/share/vcpkg",CONDA:"/usr/share/miniconda",RUNNER_NAME:"GitHub Actions 4",XDG_CONFIG_HOME:"/home/runner/.config",GITHUB_REF_NAME:"master",GITHUB_REPOSITORY:"ruyd/fullstack-monorepo",ANDROID_NDK_ROOT:"/usr/local/lib/android/sdk/ndk/25.1.8937393",GITHUB_ACTION_REF:"",DEBIAN_FRONTEND:"noninteractive",PROJECT_CWD:"/home/runner/work/fullstack-monorepo/fullstack-monorepo",GITHUB_ACTIONS:"true",npm_package_version:"0.1.0",npm_lifecycle_event:"build",GITHUB_REF_PROTECTED:"true",GITHUB_WORKSPACE:"/home/runner/work/fullstack-monorepo/fullstack-monorepo",ACCEPT_EULA:"Y",GITHUB_JOB:"publish",RUNNER_PERFLOG:"/home/runner/perflog",GITHUB_SHA:"a13e88cb50a305af5c63a3e5edd9fb537700a37c",GITHUB_RUN_ATTEMPT:"1",GITHUB_REF:"refs/heads/master",GITHUB_ACTOR:"ruyd",ANDROID_SDK_ROOT:"/usr/local/lib/android/sdk",LEIN_HOME:"/usr/local/lib/lein",GITHUB_PATH:"/home/runner/work/_temp/_runner_file_commands/add_path_7838a847-c285-405e-9107-f68f4ecb1b17",JAVA_HOME:"/usr/lib/jvm/temurin-11-jdk-amd64",PWD:"/home/runner/work/fullstack-monorepo/fullstack-monorepo/workspaces/client",RUNNER_WORKSPACE:"/home/runner/work/fullstack-monorepo",BERRY_BIN_FOLDER:"/tmp/xfs-66656f88",npm_execpath:"/tmp/xfs-66656f88/yarn",HOMEBREW_CLEANUP_PERIODIC_FULL_DAYS:"3650",GITHUB_EVENT_NAME:"push",HOMEBREW_NO_AUTO_UPDATE:"1",ANDROID_HOME:"/usr/local/lib/android/sdk",GITHUB_SERVER_URL:"https://github.com",GECKOWEBDRIVER:"/usr/local/share/gecko_driver",LEIN_JAR:"/usr/local/lib/lein/self-installs/leiningen-2.10.0-standalone.jar",GITHUB_OUTPUT:"/home/runner/work/_temp/_runner_file_commands/set_output_7838a847-c285-405e-9107-f68f4ecb1b17",EDGEWEBDRIVER:"/usr/local/share/edge_driver",ANDROID_NDK:"/usr/local/lib/android/sdk/ndk/25.1.8937393",SGX_AESM_ADDR:"1",CHROME_BIN:"/usr/bin/google-chrome",SELENIUM_JAR_PATH:"/usr/share/java/selenium-server.jar",ANDROID_NDK_HOME:"/usr/local/lib/android/sdk/ndk/25.1.8937393",GITHUB_STEP_SUMMARY:"/home/runner/work/_temp/_runner_file_commands/step_summary_7838a847-c285-405e-9107-f68f4ecb1b17",INIT_CWD:"/home/runner/work/fullstack-monorepo/fullstack-monorepo/workspaces/client",BABEL_ENV:"production",NODE_PATH:""},i=JSON.parse('{"Xh":"/fullstack-monorepo"}').Xh||"/",l={baseName:_.BASE_NAME||i,backendUrl:_.BACKEND||"https://api.drawspace.app",defaultTitle:"Drawspace",defaultColor:"green",defaultLineSize:5,thumbnails:{width:250,height:250},settings:{auth0:{tenant:_.AUTH_TENANT,clientAudience:"https://backend",clientId:_.AUTH_CLIENT_ID||"",redirectUrl:_.AUTH_REDIRECT_URL||"https://api.drawspace.app/callback"}},admin:{path:"/admin",models:[]}};function u(e,n,r){var o=new OffscreenCanvas(e,n);!function(e,n,r,o){var t;e&&(e.width=n*o,e.height=r*o,null===(t=e.getContext("2d"))||void 0===t||t.scale(o,o))}(o,e,n,r);var t=o.getContext("2d");if(t)return function(e){e.strokeStyle=l.defaultColor,e.lineWidth=l.defaultLineSize,e.lineCap="round",e.lineJoin="round",e.miterLimit=5}(t),t}var s=self;function c(e,n,r){try{var o=e.getImageData(0,0,n,r);null===s||void 0===s||s.postMessage(o)}catch(t){console.error(t)}}s.onmessage=function(e){!function(e){var o=e.buffer,t=e.width,a=e.height,_=e.dpr,i=e.stream,l=e.stopAt,s=u(t,a,_);if(s){var E,d=0,T=n(o);try{for(T.s();!(E=T.n()).done;){var R=E.value,m=R.t,p=R.x,O=R.y,I=R.c,f=R.w;if(I&&(s.strokeStyle=I),f&&(s.lineWidth=f),m===r.Open&&s.beginPath(),[r.Open,r.Stroke].includes(m)&&(s.lineTo(p,O),s.stroke()),m===r.Close&&(s.closePath(),i&&c(s,t,a)),l===d)return;d+=1}}catch(N){T.e(N)}finally{T.f()}c(s,t,a)}}(e.data)}}();
//# sourceMappingURL=967.62e2b29b.chunk.js.map