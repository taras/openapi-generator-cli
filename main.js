#!/usr/bin/env node
(() => {
  'use strict';
  var e = [
      ,
      (e) => {
        e.exports = require('@nestjs/core');
      },
      (e, t, r) => {
        var i, o, a;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.AppModule = void 0);
        const s = r(3),
          n = r(4),
          p = r(5),
          c = r(6),
          l = r(7),
          d = r(8),
          g = r(10),
          h = new (r(28).ProxyAgent)();
        let u = class AppModule {
          constructor(e, t, r) {
            (this.program = e),
              (this.versionManager = t),
              (this.passThroughService = r),
              (this.onApplicationBootstrap = async () => {
                let e = this.versionManager.getSelectedVersion();
                if (!e) {
                  const [{ version: t }] = await this.versionManager
                    .search(['latest'])
                    .toPromise();
                  await this.versionManager.setSelectedVersion(t), (e = t);
                }
                await this.versionManager.downloadIfNeeded(e),
                  await this.passThroughService.init(),
                  this.program.parse(process.argv);
              });
          }
        };
        (t.AppModule = u),
          (t.AppModule = u =
            s.__decorate(
              [
                (0, n.Module)({
                  imports: [
                    p.HttpModule.register({
                      proxy: !1,
                      httpAgent: h,
                      httpsAgent: h,
                    }),
                  ],
                  controllers: [d.VersionManagerController],
                  providers: [
                    g.UIService,
                    g.ConfigService,
                    g.GeneratorService,
                    g.PassThroughService,
                    g.VersionManagerService,
                    {
                      provide: l.COMMANDER_PROGRAM,
                      useValue: new c.Command('openapi-generator-cli')
                        .helpOption(!1)
                        .usage('<command> [<args>]'),
                    },
                    { provide: l.LOGGER, useValue: console },
                  ],
                }),
                s.__param(0, (0, n.Inject)(l.COMMANDER_PROGRAM)),
                s.__metadata('design:paramtypes', [
                  'function' == typeof (i = void 0 !== c.Command && c.Command)
                    ? i
                    : Object,
                  'function' ==
                  typeof (o =
                    void 0 !== g.VersionManagerService &&
                    g.VersionManagerService)
                    ? o
                    : Object,
                  'function' ==
                  typeof (a =
                    void 0 !== g.PassThroughService && g.PassThroughService)
                    ? a
                    : Object,
                ]),
              ],
              u
            ));
      },
      (e) => {
        e.exports = require('tslib');
      },
      (e) => {
        e.exports = require('@nestjs/common');
      },
      (e) => {
        e.exports = require('@nestjs/axios');
      },
      (e) => {
        e.exports = require('commander');
      },
      (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.COMMANDER_PROGRAM = t.LOGGER = void 0),
          (t.LOGGER = Symbol('LOGGER')),
          (t.COMMANDER_PROGRAM = Symbol('COMMANDER_PROGRAM'));
      },
      (e, t, r) => {
        var i, o, a, s;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.VersionManagerController = void 0);
        const n = r(3),
          p = r(4),
          c = r(7),
          l = r(6),
          d = n.__importDefault(r(9)),
          g = r(10);
        let h = class VersionManagerController {
          constructor(e, t, r, i) {
            (this.logger = e),
              (this.program = t),
              (this.ui = r),
              (this.service = i),
              (this.mainCommand = this.program
                .command('version-manager')
                .description('Manage used / installed generator version')),
              (this.listCommand = this.mainCommand
                .command('list [versionTags...]')
                .description('lists all published versions')
                .option('-j, --json', 'print as json', !1)
                .action((e) => this.list(e))),
              (this.setCommand = this.mainCommand
                .command('set <versionTags...>')
                .description('set version to use')
                .action((e) => this.set(e))),
              (this.list = async (e) => {
                const t = await this.service.search(e).toPromise();
                if (this.listCommand.opts().json)
                  return void this.logger.log(JSON.stringify(t, null, 2));
                if (t.length < 1)
                  return void this.logger.log(
                    d.default.red('No results for: ' + e.join(' '))
                  );
                const { version: r, installed: i } = await this.table(t),
                  o = await this.service.isSelectedVersion(r),
                  a = (e, t = () => null, r = (e) => e) => ({
                    name: r(e),
                    value: t,
                  }),
                  s = [a('exit')];
                i
                  ? o ||
                    s.unshift(
                      a('remove', () => this.service.remove(r), d.default.red)
                    )
                  : s.unshift(
                      a(
                        'download',
                        () => this.service.download(r),
                        d.default.yellow
                      )
                    ),
                  o ||
                    s.unshift(
                      a(
                        'use',
                        () => this.service.setSelectedVersion(r),
                        d.default.green
                      )
                    ),
                  await (
                    await this.ui.list({
                      name: 'next',
                      message: 'Whats next?',
                      choices: s,
                    })
                  )();
              }),
              (this.set = async (e) => {
                const t = await this.service.search(e).toPromise();
                t.length > 0
                  ? await this.service.setSelectedVersion(t[0].version)
                  : this.logger.log(
                      d.default.red(
                        `Unable to find version matching criteria "${e.join(
                          ' '
                        )}"`
                      )
                    );
              }),
              (this.table = (e) =>
                this.ui.table({
                  printColNum: !1,
                  message: 'The following releases are available:',
                  name: 'version',
                  rows: e.map((e) => {
                    const t = e.versionTags.includes('stable'),
                      r = this.service.isSelectedVersion(e.version),
                      i = e.versionTags.map((e) =>
                        'latest' === e ? d.default.green(e) : e
                      );
                    return {
                      value: e,
                      short: e.version,
                      row: {
                        '\u2610': r ? '\u2612' : '\u2610',
                        releasedAt: e.releaseDate.toISOString().split('T')[0],
                        version: t
                          ? d.default.yellow(e.version)
                          : d.default.gray(e.version),
                        installed: e.installed
                          ? d.default.green('yes')
                          : d.default.red('no'),
                        versionTags: i.join(' '),
                      },
                    };
                  }),
                }));
          }
        };
        (t.VersionManagerController = h),
          (t.VersionManagerController = h =
            n.__decorate(
              [
                (0, p.Controller)(),
                n.__param(0, (0, p.Inject)(c.LOGGER)),
                n.__param(1, (0, p.Inject)(c.COMMANDER_PROGRAM)),
                n.__metadata('design:paramtypes', [
                  'function' == typeof (i = void 0 !== c.LOGGER && c.LOGGER)
                    ? i
                    : Object,
                  'function' == typeof (o = void 0 !== l.Command && l.Command)
                    ? o
                    : Object,
                  'function' ==
                  typeof (a = void 0 !== g.UIService && g.UIService)
                    ? a
                    : Object,
                  'function' ==
                  typeof (s =
                    void 0 !== g.VersionManagerService &&
                    g.VersionManagerService)
                    ? s
                    : Object,
                ]),
              ],
              h
            ));
      },
      (e) => {
        e.exports = require('chalk');
      },
      (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 });
        const i = r(3);
        i.__exportStar(r(11), t),
          i.__exportStar(r(14), t),
          i.__exportStar(r(18), t),
          i.__exportStar(r(27), t),
          i.__exportStar(r(22), t);
      },
      (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.UIService = void 0);
        const i = r(3),
          o = r(4),
          a = r(12),
          s = r(13);
        let n = class UIService {
          async table(e) {
            const t = (0, s.getTable)(
                e.rows.map(({ row: t }, r) =>
                  !1 === e.printColNum ? t : { '#': r + 1, ...t }
                )
              ),
              [r, i, ...o] = t.trim().split('\n');
            return this.list({
              name: e.name,
              message: e.message,
              choices: [
                new a.Separator(r),
                new a.Separator(i),
                ...o.map((t, r) => ({
                  name: t,
                  short: e.rows[r].short,
                  value: e.rows[r].value,
                })),
                new a.Separator(i),
                new a.Separator(' '.repeat(i.length)),
              ],
            });
          }
          async list(e) {
            const t = e.choices.filter((e) => e instanceof a.Separator).length;
            return (
              await (0, a.prompt)([
                {
                  type: 'list',
                  name: e.name,
                  pageSize: process.stdout.rows - t - 1,
                  message: e.message,
                  choices: e.choices,
                },
              ])
            )[e.name];
          }
        };
        (t.UIService = n),
          (t.UIService = n = i.__decorate([(0, o.Injectable)()], n));
      },
      (e) => {
        e.exports = require('inquirer');
      },
      (e) => {
        e.exports = require('console.table');
      },
      (e, t, r) => {
        var i;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.ConfigService = void 0);
        const o = r(3),
          a = r(4),
          s = o.__importStar(r(15)),
          n = r(7),
          p = r(16),
          c = o.__importStar(r(17));
        let l = class ConfigService {
          get useDocker() {
            return this.get('generator-cli.useDocker', !1);
          }
          get dockerImageName() {
            return this.get(
              'generator-cli.dockerImageName',
              'openapitools/openapi-generator-cli'
            );
          }
          constructor(e) {
            (this.logger = e),
              (this.cwd =
                process.env.PWD || process.env.INIT_CWD || process.cwd()),
              (this.configFile = s.resolve(this.cwd, 'openapitools.json')),
              (this.defaultConfig = {
                $schema:
                  './node_modules/@openapitools/openapi-generator-cli/config.schema.json',
                spaces: 2,
                'generator-cli': { version: void 0 },
              });
          }
          get(e, t) {
            return (0, p.get)(this.read(), e, t);
          }
          has(e) {
            return (0, p.has)(this.read(), e);
          }
          set(e, t) {
            return this.write((0, p.set)(this.read(), e, t)), this;
          }
          read() {
            return (
              c.ensureFileSync(this.configFile),
              (0, p.merge)(
                this.defaultConfig,
                c.readJSONSync(this.configFile, {
                  throws: !1,
                  encoding: 'utf8',
                })
              )
            );
          }
          write(e) {
            c.writeJSONSync(this.configFile, e, {
              encoding: 'utf8',
              spaces: e.spaces || 2,
            });
          }
        };
        (t.ConfigService = l),
          (t.ConfigService = l =
            o.__decorate(
              [
                (0, a.Injectable)(),
                o.__param(0, (0, a.Inject)(n.LOGGER)),
                o.__metadata('design:paramtypes', [
                  'function' == typeof (i = void 0 !== n.LOGGER && n.LOGGER)
                    ? i
                    : Object,
                ]),
              ],
              l
            ));
      },
      (e) => {
        e.exports = require('path');
      },
      (e) => {
        e.exports = require('lodash');
      },
      (e) => {
        e.exports = require('fs-extra');
      },
      (e, t, r) => {
        var i, o, a;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.GeneratorService = void 0);
        const s = r(3),
          n = r(4),
          p = r(16),
          c = s.__importDefault(r(19)),
          l = s.__importStar(r(15)),
          d = s.__importStar(r(17)),
          g = s.__importStar(r(20)),
          h = s.__importDefault(r(9)),
          u = s.__importStar(r(21)),
          m = r(22),
          f = r(14),
          v = r(7);
        let y = class GeneratorService {
          constructor(e, t, r) {
            (this.logger = e),
              (this.configService = t),
              (this.versionManager = r),
              (this.configPath = 'generator-cli.generators'),
              (this.enabled = this.configService.has(this.configPath)),
              (this.cmd = (e, t, r = {}) => {
                if (this.configService.useDocker) {
                  const e = Object.entries(r)
                      .map(([e, t]) => `-v "${t}:${e}"`)
                      .join(' '),
                    i = u.userInfo();
                  return [
                    'docker run --rm',
                    -1 !== i.uid ? `--user ${i.uid}:${i.gid}` : '',
                    e,
                    this.versionManager.getDockerImageName(),
                    'generate',
                    t,
                  ].join(' ');
                }
                const i = this.versionManager.filePath(),
                  o = e
                    ? `-cp "${[i, e].join(
                        this.isWin() ? ';' : ':'
                      )}" org.openapitools.codegen.OpenAPIGenerator`
                    : `-jar "${i}"`;
                return ['java', process.env.JAVA_OPTS, o, 'generate', t]
                  .filter(p.isString)
                  .join(' ');
              }),
              (this.isWin = () => 'win32' === process.platform);
          }
          async generate(e, ...t) {
            const r = this.configService.cwd,
              i = Object.entries(this.configService.get(this.configPath, {}))
                .filter(
                  ([e, { disabled: t }]) =>
                    !t ||
                    (this.logger.log(
                      h.default.grey(
                        `[info] Skip ${h.default.yellow(
                          e
                        )}, because this generator is disabled`
                      )
                    ),
                    !1)
                )
                .filter(
                  ([e]) =>
                    !(t.length && !t.includes(e)) ||
                    (this.logger.log(
                      h.default.grey(
                        `[info] Skip ${h.default.yellow(e)}, because only ${t
                          .map((e) => h.default.yellow(e))
                          .join(', ')} shall run`
                      )
                    ),
                    !1)
                ),
              o = [],
              a = (0, p.flatten)(
                i.map(([t, i]) => {
                  const { glob: a, disabled: s, ...n } = i;
                  if (!a)
                    return [
                      {
                        name: `[${t}] ${n.inputSpec}`,
                        command: this.buildCommand(r, n, e),
                      },
                    ];
                  return (
                    g.sync(a, { cwd: r }).length < 1 && o.push(a),
                    g
                      .sync(a, { cwd: r })
                      .map((i) => ({
                        name: `[${t}] ${i}`,
                        command: this.buildCommand(r, n, e, i),
                      }))
                  );
                })
              ),
              s =
                a.length > 0 &&
                (await (async () => {
                  try {
                    return (
                      this.printResult(
                        await (0, c.default)(a, { maxProcesses: 10 })
                      ),
                      !0
                    );
                  } catch (e) {
                    return this.printResult(e), !1;
                  }
                })());
            return (
              o.map((e) =>
                this.logger.log(
                  h.default.yellow(
                    `[warn] Did not found any file matching glob "${e}"`
                  )
                )
              ),
              s
            );
          }
          printResult(e) {
            this.logger.log(
              (0, p.sortBy)(e, 'command.name')
                .map(({ exitCode: e, command: t }) => {
                  const r = e > 0;
                  return [
                    h.default[r ? 'red' : 'green'](t.name),
                    ...(r ? [h.default.yellow(`  ${t.command}\n`)] : []),
                  ].join('\n');
                })
                .join('\n')
            );
          }
          buildCommand(e, t, r, i) {
            const o = {},
              a = i ? l.resolve(e, i) : String(t.inputSpec),
              s = l.extname(a),
              n = l.basename(a, s),
              c = {
                name: n,
                Name: (0, p.upperFirst)(n),
                cwd: e,
                base: l.basename(a),
                dir: i && l.dirname(a),
                path: a,
                relDir: i && l.dirname(i),
                relPath: i,
                ext: s.split('.').slice(-1).pop(),
              },
              g = Object.entries({ inputSpec: a, ...t })
                .map(([t, r]) => {
                  const i = (0, p.kebabCase)(t),
                    a = (() => {
                      switch (typeof r) {
                        case 'object':
                          return `"${Object.entries(r)
                            .map((e) => e.join('='))
                            .join(',')}"`;
                        case 'number':
                        case 'bigint':
                          return `${r}`;
                        case 'boolean':
                          return;
                        default:
                          return this.configService.useDocker &&
                            ((r = this.replacePlaceholders(c, r)),
                            'output' === i && d.ensureDirSync(r),
                            d.existsSync(r))
                            ? ((o[`/local/${i}`] = l.resolve(e, r)),
                              `"/local/${i}"`)
                            : `"${r}"`;
                      }
                    })();
                  return void 0 === a ? `--${i}` : `--${i}=${a}`;
                })
                .join(' ');
            return this.cmd(r, this.replacePlaceholders(c, g), o);
          }
          replacePlaceholders(e, t) {
            return Object.entries(e)
              .filter(([, e]) => !!e)
              .reduce((e, [t, r]) => e.split(`#{${t}}`).join(r), t);
          }
        };
        (t.GeneratorService = y),
          (t.GeneratorService = y =
            s.__decorate(
              [
                (0, n.Injectable)(),
                s.__param(0, (0, n.Inject)(v.LOGGER)),
                s.__metadata('design:paramtypes', [
                  'function' == typeof (i = void 0 !== v.LOGGER && v.LOGGER)
                    ? i
                    : Object,
                  'function' ==
                  typeof (o = void 0 !== f.ConfigService && f.ConfigService)
                    ? o
                    : Object,
                  'function' ==
                  typeof (a =
                    void 0 !== m.VersionManagerService &&
                    m.VersionManagerService)
                    ? a
                    : Object,
                ]),
              ],
              y
            ));
      },
      (e) => {
        e.exports = require('concurrently');
      },
      (e) => {
        e.exports = require('glob');
      },
      (e) => {
        e.exports = require('os');
      },
      (e, t, r) => {
        var i, o, a;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.VersionManagerService = void 0);
        const s = r(3),
          n = r(4),
          p = r(5),
          c = r(23),
          l = r(16),
          d = s.__importStar(r(17)),
          g = s.__importStar(r(15)),
          h = s.__importStar(r(21)),
          u = s.__importDefault(r(9)),
          m = s.__importDefault(r(24)),
          f = r(7),
          v = r(14),
          y = s.__importStar(r(25)),
          b = r(26),
          S = 'org.openapitools',
          j = 'openapi-generator-cli';
        let w = class VersionManagerService {
          constructor(e, t, r) {
            (this.logger = e),
              (this.httpService = t),
              (this.configService = r),
              (this.customStorageDir = this.configService.get(
                'generator-cli.storageDir'
              )),
              (this.storage = this.customStorageDir
                ? g.resolve(
                    this.configService.cwd,
                    this.customStorageDir.replace('~', h.homedir())
                  )
                : g.resolve(__dirname, './versions'));
          }
          getAll() {
            const e = this.replacePlaceholders(
              this.configService.get('generator-cli.repository.queryUrl') ||
                y.properties['generator-cli'].properties.repository.queryUrl
                  .default
            );
            return this.httpService.get(e).pipe(
              (0, c.map)(({ data: e }) => e.response.docs),
              (0, c.map)((e) =>
                e.map((e) => ({
                  version: e.v,
                  versionTags: [
                    ...(e.v
                      .match(/^[0-9]+\.[0-9]+\.[0-9]+$/)
                      ?.concat('stable') || []),
                    ...(e.v.match(
                      /(^[0-9]+\.[0-9]+\.[0-9]+)-(([a-z]+)[0-9]?)$/
                    ) || []),
                  ],
                  releaseDate: new Date(e.timestamp),
                  installed: this.isDownloaded(e.v),
                  downloadLink: this.createDownloadLink(e.v),
                }))
              ),
              (0, c.map)(
                (e) => (
                  this.filterVersionsByTags(e, ['stable'])
                    .sort((e, t) => (0, m.default)(e.version, t.version))
                    .pop()
                    .versionTags.push('latest'),
                  e
                )
              ),
              (0, c.catchError)(
                (e) => (
                  this.logger.log(
                    u.default.red(
                      `Unable to query repository, because of: "${e.message}"`
                    )
                  ),
                  this.printResponseError(e),
                  []
                )
              )
            );
          }
          search(e) {
            return this.getAll().pipe(
              (0, c.map)((t) => this.filterVersionsByTags(t, e))
            );
          }
          isSelectedVersion(e) {
            return e === this.getSelectedVersion();
          }
          getSelectedVersion() {
            return this.configService.get('generator-cli.version');
          }
          getDockerImageName(e) {
            return `${this.configService.dockerImageName}:v${
              e || this.getSelectedVersion()
            }`;
          }
          async setSelectedVersion(e) {
            (await this.downloadIfNeeded(e)) &&
              (this.configService.set('generator-cli.version', e),
              this.logger.log(
                u.default.green(`Did set selected version to ${e}`)
              ));
          }
          async remove(e) {
            this.configService.useDocker
              ? await new Promise((t) => {
                  (0, b.spawn)('docker', ['rmi', this.getDockerImageName(e)], {
                    stdio: 'inherit',
                    shell: !0,
                  }).on('exit', () => t());
                })
              : d.removeSync(this.filePath(e)),
              this.logger.log(u.default.green(`Removed ${e}`));
          }
          async download(e) {
            if (
              (this.logger.log(u.default.yellow(`Download ${e} ...`)),
              this.configService.useDocker)
            )
              return (
                await new Promise((t) => {
                  (0, b.spawn)('docker', ['pull', this.getDockerImageName(e)], {
                    stdio: 'inherit',
                    shell: !0,
                  }).on('exit', () => t());
                }),
                void this.logger.log(u.default.green(`Downloaded ${e}`))
              );
            const t = this.createDownloadLink(e),
              r = this.filePath(e);
            try {
              return (
                await this.httpService
                  .get(t, { responseType: 'stream' })
                  .pipe(
                    (0, c.switchMap)(
                      (t) =>
                        new Promise((i) => {
                          d.ensureDirSync(this.storage);
                          const o = d.mkdtempSync(
                              g.join(h.tmpdir(), 'generator-cli-')
                            ),
                            a = g.join(o, e),
                            s = d.createWriteStream(a);
                          t.data.pipe(s),
                            s.on('finish', (e) => {
                              d.moveSync(a, r, { overwrite: !0 }), i(e);
                            });
                        })
                    )
                  )
                  .toPromise(),
                this.customStorageDir
                  ? this.logger.log(
                      u.default.green(
                        `Downloaded ${e} to custom storage location ${this.storage}`
                      )
                    )
                  : this.logger.log(u.default.green(`Downloaded ${e}`)),
                !0
              );
            } catch (i) {
              return (
                this.logger.log(
                  u.default.red(`Download failed, because of: "${i.message}"`)
                ),
                this.printResponseError(i),
                !1
              );
            }
          }
          async downloadIfNeeded(e) {
            return this.isDownloaded(e) || this.download(e);
          }
          isDownloaded(e) {
            if (this.configService.useDocker) {
              const { status: t } = (0, b.spawnSync)('docker', [
                'image',
                'inspect',
                this.getDockerImageName(e),
              ]);
              return 0 === t;
            }
            return d.existsSync(g.resolve(this.storage, `${e}.jar`));
          }
          filterVersionsByTags(e, t) {
            return t.length < 1
              ? e
              : e.filter((e) =>
                  t.every((t) => e.versionTags.some((e) => 0 === e.indexOf(t)))
                );
          }
          createDownloadLink(e) {
            return this.replacePlaceholders(
              this.configService.get('generator-cli.repository.downloadUrl') ||
                y.properties['generator-cli'].properties.repository.downloadUrl
                  .default,
              { versionName: e }
            );
          }
          replacePlaceholders(e, t = {}) {
            const r = {
              ...t,
              groupId: (0, l.replace)(S, '.', '/'),
              artifactId: (0, l.replace)(j, '.', '/'),
              'group.id': S,
              'artifact.id': j,
            };
            for (const [i, o] of Object.entries(r))
              e = e.split(`\${${i}}`).join(o);
            return e;
          }
          printResponseError(e) {
            e.isAxiosError &&
              (this.logger.log(u.default.red('\nResponse:')),
              Object.entries(e.response.headers).forEach((e) =>
                this.logger.log(...e)
              ),
              this.logger.log(),
              e.response.data.on('data', (e) =>
                this.logger.log(e.toString('utf8'))
              ));
          }
          filePath(e = this.getSelectedVersion()) {
            return g.resolve(this.storage, `${e}.jar`);
          }
        };
        (t.VersionManagerService = w),
          (t.VersionManagerService = w =
            s.__decorate(
              [
                (0, n.Injectable)(),
                s.__param(0, (0, n.Inject)(f.LOGGER)),
                s.__metadata('design:paramtypes', [
                  'function' == typeof (i = void 0 !== f.LOGGER && f.LOGGER)
                    ? i
                    : Object,
                  'function' ==
                  typeof (o = void 0 !== p.HttpService && p.HttpService)
                    ? o
                    : Object,
                  'function' ==
                  typeof (a = void 0 !== v.ConfigService && v.ConfigService)
                    ? a
                    : Object,
                ]),
              ],
              w
            ));
      },
      (e) => {
        e.exports = require('rxjs/operators');
      },
      (e) => {
        e.exports = require('compare-versions');
      },
      (e) => {
        e.exports = JSON.parse(
          '{"$id":"https://openapitools.org/openapi-generator-cli/config.schema.json","$schema":"http://json-schema.org/draft-07/schema#","title":"OpenAPI Generator CLI - Config","type":"object","required":["generator-cli"],"additionalProperties":false,"properties":{"$schema":{"type":"string"},"spaces":{"type":"number","default":2},"generator-cli":{"type":"object","required":["version"],"properties":{"version":{"type":"string"},"storageDir":{"type":"string"},"repository":{"queryUrl":{"type":"string","default":"https://search.maven.org/solrsearch/select?q=g:${group.id}+AND+a:${artifact.id}&core=gav&start=0&rows=200"},"downloadUrl":{"type":"string","default":"https://repo1.maven.org/maven2/${groupId}/${artifactId}/${versionName}/${artifactId}-${versionName}.jar"}},"useDocker":{"type":"boolean","default":false},"dockerImageName":{"type":"string","default":"openapitools/openapi-generator-cli"},"generators":{"type":"object","additionalProperties":{"$ref":"#/definitions/generator"}}}}},"definitions":{"strOrAnyObject":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}]},"generator":{"type":"object","anyOf":[{"required":["inputSpec","output","generatorName"]},{"required":["glob","output","generatorName"]}],"properties":{"glob":{"description":"matches local specification files using a glob pattern","type":"string","minLength":1},"output":{"type":"string","minLength":1},"disabled":{"type":"boolean","default":false},"generatorName":{"description":"generator to use (see list command for list)","anyOf":[{"type":"string"},{"type":"string","enum":["ada","ada-server","android","apache2","apex","asciidoc","aspnetcore","avro-schema","bash","c","clojure","cpp-pistache-server","cpp-qt5-client","cpp-qt5-qhttpengine-server","cpp-restbed-server","cpp-restsdk","cpp-tizen","csharp","csharp-nancyfx","csharp-netcore","cwiki","dart","dart-dio","dart-jaguar","dynamic-html","eiffel","elixir","elm","erlang-client","erlang-proper","erlang-server","flash","fsharp-functions","fsharp-giraffe-server","go","go-experimental","go-gin-server","go-server","graphql-nodejs-express-server","graphql-schema","groovy","haskell","haskell-http-client","html","html2","java","java-inflector","java-msf4j","java-pkmst","java-play-framework","java-undertow-server","java-vertx","java-vertx-web","javascript","javascript-apollo","javascript-closure-angular","javascript-flowtyped","jaxrs-cxf","jaxrs-cxf-cdi","jaxrs-cxf-client","jaxrs-cxf-extended","jaxrs-jersey","jaxrs-resteasy","jaxrs-resteasy-eap","jaxrs-spec","jmeter","k6","kotlin","kotlin-server","kotlin-spring","kotlin-vertx","lua","markdown","mysql-schema","nim","nodejs-express-server","objc","ocaml","openapi","openapi-yaml","perl","php","php-laravel","php-lumen","php-silex","php-slim4","php-symfony","php-ze-ph","powershell","powershell-experimental","protobuf-schema","python","python-aiohttp","python-blueplanet","python-experimental","python-flask","r","ruby","ruby-on-rails","ruby-sinatra","rust","rust-server","scala-akka","scala-akka-http-server","scala-finch","scala-gatling","scala-lagom-server","scala-play-server","scala-sttp","scalatra","scalaz","spring","swift4","swift5","typescript-angular","typescript-angularjs","typescript-aurelia","typescript-axios","typescript-fetch","typescript-inversify","typescript-jquery","typescript-node","typescript-redux-query","typescript-rxjs"]}]},"auth":{"type":"string","description":"adds authorization headers when fetching the OpenAPI definitions remotely. Pass in a URL-encoded string of name:header with a comma separating multiple values"},"apiNameSuffix":{"type":"string","description":"suffix that will be appended to all API names (\'tags\'). Default: Api. e.g. Pet => PetApi. Note: Only ruby, python, jaxrs generators support this feature at the moment"},"apiPackage":{"type":"string","description":"package for generated api classes"},"artifactId":{"type":"string","description":"artifactId in generated pom.xml. This also becomes part of the generated library\'s filename"},"artifactVersion":{"type":"string","description":"artifact version in generated pom.xml. This also becomes part of the generated library\'s filename"},"config":{"type":"string","description":"path to configuration file. It can be JSON or YAML"},"dryRun":{"type":"boolean","description":"try things out and report on potential changes (without actually making changes)"},"engine":{"type":"string","enum":["mustache","handlebars"],"description":"templating engine: \\"mustache\\" (default) or \\"handlebars\\" (beta)"},"enablePostProcessFile":{"type":"boolean","description":"enable post-processing file using environment variables"},"generateAliasAsModel":{"type":"boolean","description":"generate model implementation for aliases to map and array schemas. An \'alias\' is an array, map, or list which is defined inline in a OpenAPI document and becomes a model in the generated code. A \'map\' schema is an object that can have undeclared properties, i.e. the \'additionalproperties\' attribute is set on that object. An \'array\' schema is a list of sub schemas in a OAS document"},"gitHost":{"type":"string","description":"git host, e.g. gitlab.com"},"gitRepoId":{"type":"string","description":"git repo ID, e.g. openapi-generator"},"gitUserId":{"type":"string","description":"git user ID, e.g. openapitools"},"globalProperty":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"sets specified global properties (previously called \'system properties\') in the format of name=value,name=value (or multiple options, each with name=value)"},"groupId":{"type":"string","description":"groupId in generated pom.xml"},"httpUserAgent":{"type":"string","description":"HTTP user agent, e.g. codegen_csharp_api_client, default to \'OpenAPI-Generator/{packageVersion}}/{language}\'"},"inputSpec":{"type":"string","description":"location of the OpenAPI spec, as URL or file (required if not loaded via config using -c)"},"ignoreFileOverride":{"type":"string","description":"specifies an override location for the .openapi-generator-ignore file. Most useful on initial generation.\\n"},"importMappings":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"specifies mappings between a given class and the import that should be used for that class in the format of type=import,type=import. You can also have multiple occurrences of this option"},"instantiationTypes":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"sets instantiation type mappings in the format of type=instantiatedType,type=instantiatedType.For example (in Java): array=ArrayList,map=HashMap. In other words array types will get instantiated as ArrayList in generated code. You can also have multiple occurrences of this option"},"invokerPackage":{"type":"string","description":"root package for generated code"},"languageSpecificPrimitives":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"specifies additional language specific primitive types in the format of type1,type2,type3,type3. For example: String,boolean,Boolean,Double. You can also have multiple occurrences of this option"},"legacyDiscriminatorBehavior":{"type":"boolean","description":"this flag is used by OpenAPITools codegen to influence the processing of the discriminator attribute in OpenAPI documents. This flag has no impact if the OAS document does not use the discriminator attribute. The default value of this flag is set in each language-specific code generator (e.g. Python, Java, go...)using the method toModelName. Note to developers supporting a language generator in OpenAPITools; to fully support the discriminator attribute as defined in the OAS specification 3.x, language generators should set this flag to true by default; however this requires updating the mustache templates to generate a language-specific discriminator lookup function that iterates over {{#mappedModels}} and does not iterate over {{children}}, {{#anyOf}}, or {{#oneOf}}"},"library":{"type":"string","description":"library template (sub-template)"},"logToStderr":{"type":"boolean","description":"write all log messages (not just errors) to STDOUT. Useful for piping the JSON output of debug options (e.g. `-DdebugOperations`) to an external parser directly while testing a generator"},"minimalUpdate":{"type":"boolean","description":"only write output files that have changed"},"modelNamePrefix":{"type":"string","description":"prefix that will be prepended to all model names"},"modelNameSuffix":{"type":"string","description":"suffix that will be appended to all model names"},"modelPackage":{"type":"string","description":"package for generated models"},"additionalProperties":{"description":"sets additional properties that can be referenced by the mustache templates in the format of name=value,name=value. You can also have multiple occurrences of this option","anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}]},"packageName":{"type":"string","description":"package for generated classes (where supported)"},"releaseNote":{"type":"string","description":"release note, default to \'Minor update\'"},"removeOperationIdPrefix":{"type":"boolean","description":"remove prefix of operationId, e.g. config_getId => getId"},"reservedWordsMappings":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"specifies how a reserved name should be escaped to. Otherwise, the default _<name> is used. For example id=identifier. You can also have multiple occurrences of this option"},"skipOverwrite":{"type":"boolean","description":"specifies if the existing files should be overwritten during the generation"},"serverVariables":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"sets server variables overrides for spec documents which support variable templating of servers"},"skipValidateSpec":{"type":"boolean","description":"skips the default behavior of validating an input specification"},"strictSpec":{"type":"boolean","description":"\'MUST\' and \'SHALL\' wording in OpenAPI spec is strictly adhered to. e.g. when false, no fixes will be applied to documents which pass validation but don\'t follow the spec"},"templateDir":{"type":"string","description":"folder containing the template files"},"typeMappings":{"anyOf":[{"type":"string"},{"type":"object","additionalProperties":true}],"description":"sets mappings between OpenAPI spec types and generated code types in the format of OpenAPIType=generatedType,OpenAPIType=generatedType. For example: array=List,map=Map,string=String. You can also have multiple occurrences of this option"},"verbose":{"type":"boolean","description":"verbose mode"}}}}}'
        );
      },
      (e) => {
        e.exports = require('child_process');
      },
      (e, t, r) => {
        var i, o, a, s, n;
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.PassThroughService = void 0);
        const p = r(3),
          c = r(4),
          l = p.__importDefault(r(9)),
          d = r(26),
          g = r(6),
          h = r(16),
          u = r(7),
          m = r(18),
          f = r(22),
          v = r(14);
        let y = class PassThroughService {
          constructor(e, t, r, i, o) {
            (this.logger = e),
              (this.program = t),
              (this.versionManager = r),
              (this.configService = i),
              (this.generatorService = o),
              (this.passThrough = (e) => {
                const t = [e.name(), ...e.args];
                (0, d.spawn)(this.cmd(), t, { stdio: 'inherit', shell: !0 }).on(
                  'exit',
                  process.exit
                );
              }),
              (this.getCommands = async () => {
                const [e, t] = await Promise.all([
                    this.run('help'),
                    this.run('completion').catch(() => ''),
                  ]),
                  r = e
                    .split('\n')
                    .filter((e) => (0, h.startsWith)(e, ' '))
                    .map(h.trim)
                    .map((e) => e.match(/^([a-z-]+)\s+(.+)/i).slice(1))
                    .reduce((e, [t, r]) => ({ ...e, [t]: r }), {}),
                  i = t
                    .split('\n')
                    .map(h.trim)
                    .filter((e) => e.length > 0 && 0 !== e.indexOf('--'));
                for (const o of i) r[o] = r[o] || '';
                return Object.entries(r);
              }),
              (this.run = (e) =>
                new Promise((t, r) => {
                  (0, d.exec)(`${this.cmd()} ${e}`, (e, i, o) => {
                    e ? r(new Error(o)) : t(i);
                  });
                })),
              (this.isWin = () => 'win32' === process.platform);
          }
          async init() {
            this.program
              .allowUnknownOption()
              .option('--custom-generator <generator>', 'Custom generator jar');
            const e = (await this.getCommands()).reduce(
              (e, [t, r]) =>
                e.set(
                  t,
                  this.program
                    .command(t, { hidden: !r })
                    .description(r)
                    .allowUnknownOption()
                    .action((e, t) => this.passThrough(t))
                ),
              new Map()
            );
            e.get('help').action((t, r) => {
              if (!r.args.length) return void this.printHelp(this.program);
              const [i] = r.args;
              e.has(i) && this.printHelp(e.get(i)), this.passThrough(r);
            }),
              e
                .get('generate')
                .option(
                  '--generator-key <generator...>',
                  'Run generator by key. Separate by comma to run many generators'
                )
                .action(async (e, t) => {
                  if (0 === t.args.length || t.opts().generatorKey) {
                    const e = this.program.opts()?.customGenerator,
                      r = t.opts().generatorKey || [];
                    if (this.generatorService.enabled)
                      return void (
                        (await this.generatorService.generate(e, ...r)) ||
                        (this.logger.log(
                          l.default.red('Code generation failed')
                        ),
                        process.exit(1))
                      );
                  }
                  this.passThrough(t);
                });
          }
          cmd() {
            if (this.configService.useDocker)
              return [
                `docker run --rm -v "${this.configService.cwd}:/local"`,
                this.versionManager.getDockerImageName(),
              ].join(' ');
            const e = this.program.opts()?.customGenerator,
              t = this.versionManager.filePath(),
              r = e
                ? `-cp "${[t, e].join(
                    this.isWin() ? ';' : ':'
                  )}" org.openapitools.codegen.OpenAPIGenerator`
                : `-jar "${t}"`;
            return ['java', process.env.JAVA_OPTS, r]
              .filter(h.isString)
              .join(' ');
          }
          printHelp(e) {
            console.log(l.default.cyanBright(e.helpInformation()));
          }
        };
        (t.PassThroughService = y),
          (t.PassThroughService = y =
            p.__decorate(
              [
                (0, c.Injectable)(),
                p.__param(0, (0, c.Inject)(u.LOGGER)),
                p.__param(1, (0, c.Inject)(u.COMMANDER_PROGRAM)),
                p.__metadata('design:paramtypes', [
                  'function' == typeof (i = void 0 !== u.LOGGER && u.LOGGER)
                    ? i
                    : Object,
                  'function' == typeof (o = void 0 !== g.Command && g.Command)
                    ? o
                    : Object,
                  'function' ==
                  typeof (a =
                    void 0 !== f.VersionManagerService &&
                    f.VersionManagerService)
                    ? a
                    : Object,
                  'function' ==
                  typeof (s = void 0 !== v.ConfigService && v.ConfigService)
                    ? s
                    : Object,
                  'function' ==
                  typeof (n =
                    void 0 !== m.GeneratorService && m.GeneratorService)
                    ? n
                    : Object,
                ]),
              ],
              y
            ));
      },
      (e) => {
        e.exports = require('proxy-agent');
      },
    ],
    t = {};
  function r(i) {
    var o = t[i];
    if (void 0 !== o) return o.exports;
    var a = (t[i] = { exports: {} });
    return e[i](a, a.exports, r), a.exports;
  }
  var i = {};
  (() => {
    var e = i;
    Object.defineProperty(e, '__esModule', { value: !0 });
    const t = r(1),
      o = r(2);
    !(async function () {
      await t.NestFactory.createApplicationContext(o.AppModule, { logger: !1 });
    })();
  })();
  var o = exports;
  for (var a in i) o[a] = i[a];
  i.__esModule && Object.defineProperty(o, '__esModule', { value: !0 });
})();
