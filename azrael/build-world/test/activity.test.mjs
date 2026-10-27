import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanEvent,parseEvents} from '../activity.mjs';
test('only recognized agent statuses are public',()=>{assert.equal(cleanEvent({agent:'root',status:'testing',timestamp:new Date().toISOString()}),null);assert.equal(cleanEvent({agent:'builder',status:'fake',timestamp:new Date().toISOString()}),null);});
test('bad timestamps and future heartbeats are rejected',()=>{for(const timestamp of ['invalid',new Date(Date.now()+60000).toISOString()])assert.equal(cleanEvent({agent:'builder',status:'testing',timestamp}),null);});
test('only bounded public fields survive',()=>{const e=cleanEvent({agent:'builder',status:'testing',timestamp:new Date().toISOString(),task:'x'.repeat(200),secret:'do not publish'});assert.equal(e.task.length,160);assert.equal(e.secret,undefined);});
test('partial and corrupt lines are ignored; latest reports come first',()=>{const old={agent:'builder',status:'idle',timestamp:'2026-01-01T00:00:00Z'},fresh={...old,timestamp:new Date().toISOString()};const events=parseEvents(`broken\n${JSON.stringify(old)}\n${JSON.stringify(fresh)}\n{partial`);assert.equal(events.length,2);assert.equal(events[0].timestamp,fresh.timestamp);});
