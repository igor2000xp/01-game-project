import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { NgModule, provideZoneChangeDetection, ɵresolveComponentResources } from '@angular/core';
import { getTestBed, ɵgetCleanupHook as getCleanupHook } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { afterEach, beforeEach } from 'vitest';
import { readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';

type CleanupHookFactory = (runCleanup: boolean) => () => void;
type ResolveResources = (resolver: (url: string) => Promise<string>) => Promise<void>;
type GlobSync = (pattern: string, options: { absolute: boolean; cwd: string }) => string[];
type ReadFileText = (path: string, encoding: 'utf8') => Promise<string>;
type CwdGetter = () => string;
type PathResolver = (from: string, to: string) => string;
type PathIsAbsolute = (path: string) => boolean;
type FileUrlToPath = (url: string) => string;

const cleanupHookFactory = getCleanupHook as CleanupHookFactory;
const resolveResources = ɵresolveComponentResources as ResolveResources;
const globSyncTyped = globSync as GlobSync;
const readFileText = readFile as ReadFileText;
const getCwd = (process as { cwd: CwdGetter }).cwd;
const resolvePath = resolve as PathResolver;
const isAbsolutePath = isAbsolute as PathIsAbsolute;
const fileUrlToPath = fileURLToPath as FileUrlToPath;

const resourceFiles = globSyncTyped('src/**/*.{html,css}', {
  absolute: true,
  cwd: getCwd(),
});

const resourceFileMap = resourceFiles.reduce<Map<string, string[]>>((map, filePath) => {
  const filename = filePath.split('/').pop();
  if (!filename) {
    return map;
  }

  const existing = map.get(filename);
  if (existing) {
    existing.push(filePath);
  } else {
    map.set(filename, [filePath]);
  }

  return map;
}, new Map());

const resolveComponentResourcePath = (url: string): string => {
  if (isAbsolutePath(url)) {
    return url;
  }

  const fromWorkspaceRoot = resolvePath(getCwd(), url);
  if (resourceFiles.includes(fromWorkspaceRoot)) {
    return fromWorkspaceRoot;
  }

  const filename = url.replace(/^\.\//, '');
  const matches = resourceFileMap.get(filename);
  if (matches?.length) {
    return matches[0];
  }

  return fromWorkspaceRoot;
};

const resolveComponentResource = async (url: string): Promise<string> => {
  if (url.startsWith('file://')) {
    return readFileText(fileUrlToPath(url), 'utf8');
  }

  return readFileText(resolveComponentResourcePath(url), 'utf8');
};

beforeEach(cleanupHookFactory(false));
beforeEach(async () => {
  await resolveResources(resolveComponentResource);
});
afterEach(cleanupHookFactory(true));

const ANGULAR_TESTBED_SETUP = Symbol.for('@angular/cli/testbed-setup');

if (!(ANGULAR_TESTBED_SETUP in globalThis)) {
  Object.defineProperty(globalThis, ANGULAR_TESTBED_SETUP, { value: true });

  @NgModule({
    providers: [provideZoneChangeDetection()],
  })
  class TestModule {}

  getTestBed().initTestEnvironment([BrowserTestingModule, TestModule], platformBrowserTesting(), {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  });
}
